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
#DOCKER_BUILD_PLATFORMS="linux/amd64,linux/arm64"
DOCKER_BUILD_PLATFORMS="linux/amd64"

# Config
DRY_RUN=false
#SSH_FLAGS="-v"
SSH_FLAGS=""

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

log_action "Building Docker image locally..."
if [ "$DRY_RUN" = false ]; then
    #docker build -t $DOCKER_IMAGE_NAME $LOCAL_BACKEND_DIR
    docker build --platform ${DOCKER_BUILD_PLATFORMS} -t $DOCKER_IMAGE_NAME ${LOCAL_BACKEND_DIR}
else
    echo "[DRY-RUN] Docker image would be built: $DOCKER_IMAGE_NAME"
fi

log_action "Saving Docker image to tarball..."
if [ "$DRY_RUN" = false ]; then
    docker save -o $LOCAL_TAR_PATH $DOCKER_IMAGE_NAME
else
    echo "[DRY-RUN] Docker image would be saved to $LOCAL_TAR_PATH"
fi

log_action "Copying tarball to AWS..."
if [ "$DRY_RUN" = false ]; then
    #scp $LOCAL_TAR_PATH $SERVER:$BACKEND_DIR
    rsync -avz -c --progress $LOCAL_TAR_PATH $SERVER:$BACKEND_DIR
else
    echo "[DRY-RUN] Tarball would be copied to $SERVER:$BACKEND_DIR"
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
    docker run --platform ${PLATFORM_ARG} -d --name $DOCKER_CONTAINER_NAME -p 5000:5000 -e NODE_ENV=production $DOCKER_IMAGE_NAME

    echo "[DEPLOY] Deployment complete, cleaning up."
EOF

REMOTE_INSTALL_STATUS=$?

log_action "Cleaning up local tarball..."
if [ "$DRY_RUN" = false ]; then
    rm $LOCAL_TAR_PATH
else
    echo "[DRY-RUN] Local tarball would be removed: $LOCAL_TAR_PATH"
fi

# Final status
if [ $REMOTE_INSTALL_STATUS != 0 ]; then
    echo "[FAIL] Failed to deploy backend."
    exit 1
else
    echo "[SUCC] Successully deployed backend."
fi

exit 0
