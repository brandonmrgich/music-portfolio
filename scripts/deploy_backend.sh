#!/bin/bash

MSGPRE="[DEPLOY]"

if [ -f /Users/brandon/.extendedEnv ]; then
    . /Users/brandon/.extendedEnv
else
    echo "${MSGPRE}: ~/.extendedEnv required"
    exit 1
fi

### Define variables
SERVER="aws"                                        # AWS SSH alias
BACKEND_DIR="/home/ubuntu/music-portfolio-backend"  # AWS backend directory
LOCAL_BACKEND_DIR="${MUSIC_PORTFOLIO_ROOT}/backend" # Local backend directory
DOCKER_IMAGE_NAME="music-portfolio-backend"
DOCKER_CONTAINER_NAME="music-portfolio-backend"
TAR_NAME="backend.tar.gz"
LOCAL_TAR_PATH="${HOME}/tmp/${TAR_NAME}"

DRY_RUN=false
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
    docker build -t $DOCKER_IMAGE_NAME $LOCAL_BACKEND_DIR
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
    scp $LOCAL_TAR_PATH $SERVER:$BACKEND_DIR
else
    echo "[DRY-RUN] Tarball would be copied to $SERVER:$BACKEND_DIR"
fi

log_action "Deploying Docker container on AWS..."
ssh $SERVER <<EOF
    set -e
    echo "[DEPLOY] Loading Docker image..."
    docker load -i $BACKEND_DIR/$TAR_NAME

    echo "[DEPLOY] Stopping existing container (if running)..."
    docker stop $DOCKER_CONTAINER_NAME || true
    docker rm $DOCKER_CONTAINER_NAME || true

    echo "[DEPLOY] Running new container..."
    docker run -d --name $DOCKER_CONTAINER_NAME -p 3000:3000 $DOCKER_IMAGE_NAME

    echo "[DEPLOY] Deployment complete!"
EOF

log_action "Cleaning up local tarball..."
if [ "$DRY_RUN" = false ]; then
    rm $LOCAL_TAR_PATH
else
    echo "[DRY-RUN] Local tarball would be removed: $LOCAL_TAR_PATH"
fi
