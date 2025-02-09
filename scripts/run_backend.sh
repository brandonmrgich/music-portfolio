#!/bin/bash

CONTAINER_NAME="music-portfolio-backend"
IMAGE_NAME="music-portfolio-backend"
LOCAL_PORT=5000
CONTAINER_PORT=5000
DOCKERFILE="Dockerfile"

MSGPRE="[DOCKER]"

# Function to check if Docker is running
check_docker_running() {
    if ! docker info &>/dev/null; then
        echo "${MSGPRE} Docker is not running. Attempting to start it..."

        # Start Docker based on the OS
        if [[ "$OSTYPE" == "linux-gnu"* ]]; then
            echo "${MSGPRE}: Running headless."
            sudo systemctl start docker
        elif [[ "$OSTYPE" == "darwin"* ]]; then
            echo "${MSGPRE}: Running GUI."
            open -a docker
        else
            echo "${MSGPRE} Unsupported OS. Start Docker manually."
            exit 1
        fi

        sleep 5
        while ! docker info &>/dev/null; do
            echo "${MSGPRE} Waiting for Docker to start..."
            sleep 2
        done
    fi
}

# Function to clean up container on exit
cleanup() {
    echo "${MSGPRE} Stopping and removing the container: ${CONTAINER_NAME}..."
    docker stop $CONTAINER_NAME
    docker rm $CONTAINER_NAME
}

# Trap EXIT signal to run cleanup
trap cleanup EXIT

# Ensure Docker is running
check_docker_running

# Check if container already exists
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "${MSGPRE} Container exists. Starting it..."
    docker start $CONTAINER_NAME
else
    echo "${MSGPRE} Building and running a new container..."
    docker build -t $IMAGE_NAME -f $DOCKERFILE .
    docker run -d --name $CONTAINER_NAME -p $LOCAL_PORT:$CONTAINER_PORT $IMAGE_NAME
fi

# Keep script running to prevent immediate exit
echo "${MSGPRE} Backend running at http://localhost:${LOCAL_PORT}"
echo "${MSGPRE} Press Ctrl+C to stop the container."

while true; do sleep 1; done
