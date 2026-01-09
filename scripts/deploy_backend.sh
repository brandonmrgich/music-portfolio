#!/bin/bash

MSGPRE="[DEPLOY]"

if [ -f /Users/brandon/.extendedEnv ]; then
    . /Users/brandon/.extendedEnv
else
    echo "${MSGPRE}: ~/.extendedEnv required"
    exit 1
fi

### Define variables

# Remote
BACKEND_DIR="/home/ubuntu/music-portfolio-backend" # AWS backend directory
TAR_NAME="backend.tar.gz"
DOCKER_IMAGE_NAME="music-portfolio-backend"
DOCKER_CONTAINER_NAME="music-portfolio-backend"

REMOTE_ENV=("BACKEND_DIR=$BACKEND_DIR"
    "DOCKER_IMAGE_NAME=$DOCKER_IMAGE_NAME"
    "DOCKER_CONTAINER_NAME=$DOCKER_CONTAINER_NAME"
    "TAR_NAME=$TAR_NAME")

# Local
SERVER="aws"                                        # AWS SSH alias
LOCAL_BACKEND_DIR="${MUSIC_PORTFOLIO_ROOT}/backend" # Local backend directory
LOCAL_TAR_PATH="${HOME}/tmp/${TAR_NAME}"
# Maintenance scripts (uploaded next to .env on the EC2 host)
LOCAL_SCRIPTS_DIR="${MUSIC_PORTFOLIO_ROOT}/scripts"
BACKUP_SCRIPT_NAME="backup_backend_container.sh"
RESTORE_SCRIPT_NAME="restore_backend_from_backup.sh"
#DOCKER_BUILD_PLATFORMS="linux/amd64,linux/arm64"
DOCKER_BUILD_PLATFORMS="linux/amd64"

# Config
DRY_RUN=false
#SSH_FLAGS="-v"
SSH_FLAGS=""

# Colima/Docker status
COLIMA_STARTED=false

if [[ "$1" == "--dry-run" ]]; then
    DRY_RUN=true
    echo "Dry-run mode activated. No changes will be made."
fi

log_action() {
    if [ "$DRY_RUN" = true ]; then
        echo "[DRY-RUN] $1"
    else
        echo "$1"
    fi
}

# --- Docker/Colima startup logic ---
check_docker_or_colima() {
    if docker info > /dev/null 2>&1; then
        log_action "Docker is running."
        return 0
    fi
    # If on macOS, try Colima
    if [[ "$(uname)" == "Darwin" ]]; then
        if command -v colima > /dev/null 2>&1; then
            log_action "Docker is not running. Attempting to start Colima..."
            colima start
            sleep 3
            if docker info > /dev/null 2>&1; then
                log_action "Colima started and Docker CLI is now available."
                COLIMA_STARTED=true
                return 0
            else
                echo "[ERR] Failed to start Colima. Aborting."
                exit 1
            fi
        else
            echo "[ERR] Docker is not running and Colima is not installed. Please start Docker Desktop or install Colima."
            exit 1
        fi
    else
        echo "[ERR] Docker is not running. Please start Docker."
        exit 1
    fi
}

check_docker_or_colima

# Build Docker image (use buildx for cross-arch builds; fixes "exec format error" on Apple Silicon/Colima)
log_action "Building Docker image locally..."
if [ "$DRY_RUN" = false ]; then
    LOCAL_ARCH="$(uname -m)"
    # Use buildx whenever:
    # - multi-platform is requested, OR
    # - we're on arm64 but building linux/amd64 (common for EC2 x86_64 targets)
    if [[ "$DOCKER_BUILD_PLATFORMS" == *,* ]] || ([[ "$LOCAL_ARCH" == "arm64" || "$LOCAL_ARCH" == "aarch64" ]] && [[ "$DOCKER_BUILD_PLATFORMS" == *"linux/amd64"* ]]); then
        # Ensure a buildx builder exists and is active
        if ! docker buildx inspect music-portfolio-builder >/dev/null 2>&1; then
            docker buildx create --name music-portfolio-builder --use
        else
            docker buildx use music-portfolio-builder
        fi
        docker buildx inspect --bootstrap >/dev/null

        docker buildx build --platform ${DOCKER_BUILD_PLATFORMS} -t $DOCKER_IMAGE_NAME --load ${LOCAL_BACKEND_DIR}
    else
        docker build --platform ${DOCKER_BUILD_PLATFORMS} -t $DOCKER_IMAGE_NAME ${LOCAL_BACKEND_DIR}
    fi
else
    echo "[DRY-RUN] Docker image would be built: $DOCKER_IMAGE_NAME"
fi

log_action "Saving Docker image to tarball..."
if [ "$DRY_RUN" = false ]; then
    docker save -o $LOCAL_TAR_PATH $DOCKER_IMAGE_NAME
else
    echo "[DRY-RUN] Docker image would be saved to $LOCAL_TAR_PATH"
fi

if [ "$DRY_RUN" = false ] && [ ! -f "$LOCAL_TAR_PATH" ]; then
    echo "[ERROR] Tarball not found: $LOCAL_TAR_PATH"
    # Stop Colima if we started it
    if [ "$COLIMA_STARTED" = true ]; then
        colima stop
    fi
    exit 1
fi

log_action "Copying tarball to AWS..."
if [ "$DRY_RUN" = false ]; then
    rsync -avz -c --progress $LOCAL_TAR_PATH $SERVER:$BACKEND_DIR
else
    echo "[DRY-RUN] Tarball would be copied to $SERVER:$BACKEND_DIR"
fi

log_action "Copying .env file to AWS..."
if [ "$DRY_RUN" = false ]; then
    if [ -f "$LOCAL_BACKEND_DIR/.env" ]; then
        rsync -avz -c --progress "$LOCAL_BACKEND_DIR/.env" "$SERVER:$BACKEND_DIR/.env"
    else
        echo "[WARN] .env file not found in $LOCAL_BACKEND_DIR. Skipping .env copy."
    fi
else
    echo "[DRY-RUN] .env file would be copied to $SERVER:$BACKEND_DIR/.env"
fi

log_action "Copying backup/restore scripts to AWS (next to .env)..."
if [ "$DRY_RUN" = false ]; then
    if [ -f "$LOCAL_SCRIPTS_DIR/$BACKUP_SCRIPT_NAME" ]; then
        rsync -avz -c --progress "$LOCAL_SCRIPTS_DIR/$BACKUP_SCRIPT_NAME" "$SERVER:$BACKEND_DIR/$BACKUP_SCRIPT_NAME"
    else
        echo "[WARN] Script not found: $LOCAL_SCRIPTS_DIR/$BACKUP_SCRIPT_NAME. Skipping."
    fi
    if [ -f "$LOCAL_SCRIPTS_DIR/$RESTORE_SCRIPT_NAME" ]; then
        rsync -avz -c --progress "$LOCAL_SCRIPTS_DIR/$RESTORE_SCRIPT_NAME" "$SERVER:$BACKEND_DIR/$RESTORE_SCRIPT_NAME"
    else
        echo "[WARN] Script not found: $LOCAL_SCRIPTS_DIR/$RESTORE_SCRIPT_NAME. Skipping."
    fi
else
    echo "[DRY-RUN] Scripts would be copied to $SERVER:$BACKEND_DIR/"
fi

log_action "Deploying Docker container on ${SERVER}..."
ssh ${SSH_FLAGS} $SERVER env "${REMOTE_ENV[@]}" 'bash -s' <<'EOF' #EOF requires quotes for remote code exec
    set -e

    echo "[INFO] System: $(uname -a)"
    echo "[INFO] User:   $(whoami)"

    PLATFORM=$(uname -m)
    # Check platform and set platform-specific Docker run options
    if [[ "$PLATFORM" == "x86_64" ]]; then
        PLATFORM_ARG="linux/amd64"
    elif [[ "$PLATFORM" == "arm64" ]]; then
        PLATFORM_ARG="linux/arm64"
    else
        echo "[ERR] Unsupported platform: $PLATFORM"
        exit 1
    fi

    # These werent passed correctly to the connectionn, abort
    if [ -z "$BACKEND_DIR" ] || [ -z "$DOCKER_IMAGE_NAME" ] || [ -z "$DOCKER_CONTAINER_NAME" ]; then
        echo "[ERR]  One or more environment variables are empty, aborting."
        echo "[INFO] DOCKER_IMAGE_NAME: ${DOCKER_IMAGE_NAME}"
        echo "[INFO] DOCKER_CONTAINER_NAME: ${DOCKER_CONTAINER_NAME}"
        echo "[INFO] BACKEND_DIR: ${BACKEND_DIR}"
        exit 1
    fi

    mkdir -p ${BACKEND_DIR}

    res=`which docker`
    if [ -z "${res}" ]; then
        sudo apt install -y docker 
    fi

    # Check if Docker is running and start it if not
    if ! systemctl is-active --quiet docker; then
        echo "[INFO] Docker is not running, starting Docker..."
        sudo systemctl start docker
        if [ $? -ne 0 ]; then
            echo "[ERR] Failed to start Docker. Aborting deployment."
            exit 1
        fi
    fi

    echo "[DEPLOY] Loading Docker image..."
    docker load -i $BACKEND_DIR/$TAR_NAME

    res=$?
    if [ ${res} -ne 0 ]; then
        echo "[ERR]  Tarball missing, aborting."
        exit 1
    fi
    
    # Stop and remove the container if it exists
    if docker ps -q -f name=$DOCKER_CONTAINER_NAME; then
        echo "[DEPLOY] Stopping existing container..."
        docker stop $DOCKER_CONTAINER_NAME || true
        docker rm $DOCKER_CONTAINER_NAME || true
    else
        echo "[DEPLOY] No existing container to stop."
    fi

    echo "[DEPLOY] Running new container..."
    docker run --platform ${PLATFORM_ARG} -d --restart unless-stopped --name $DOCKER_CONTAINER_NAME -p 5000:5000 --env-file $BACKEND_DIR/.env $DOCKER_IMAGE_NAME

    # Ensure maintenance scripts are executable (uploaded next to .env)
    if [ -f "$BACKEND_DIR/backup_backend_container.sh" ]; then
        chmod +x "$BACKEND_DIR/backup_backend_container.sh" || true
    fi
    if [ -f "$BACKEND_DIR/restore_backend_from_backup.sh" ]; then
        chmod +x "$BACKEND_DIR/restore_backend_from_backup.sh" || true
    fi

    echo "[DEPLOY] Deployment complete, cleaning up."
EOF

REMOTE_INSTALL_STATUS=$?

log_action "Cleaning up local tarball..."
if [ "$DRY_RUN" = false ] && [ -f "$LOCAL_TAR_PATH" ]; then
    rm "$LOCAL_TAR_PATH"
else
    echo "[DRY-RUN] Local tarball would be removed: $LOCAL_TAR_PATH"
fi

# Stop Colima if we started it
if [ "$COLIMA_STARTED" = true ]; then
    log_action "Stopping Colima..."
    colima stop
fi

# Final status
if [ $REMOTE_INSTALL_STATUS != 0 ]; then
    echo "[FAIL] Failed to deploy backend."
    exit 1
else
    echo "[SUCC] Successully deployed backend."
fi

exit 0
