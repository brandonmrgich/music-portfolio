#!/bin/bash

CONTAINER_NAME="music-portfolio-backend"
IMAGE_NAME="music-portfolio-backend"
LOCAL_PORT=5000
CONTAINER_PORT=5000
DOCKER_COMPOSE_FILE="./docker-compose.yml"

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

    # Stop and remove containers, networks, and volumes managed by Compose
    docker-compose down --volumes --remove-orphans

    # Ensure all related containers are stopped before removal
    docker stop ${CONTAINER_NAME}

    # Stop containers with 'build' in the name
    docker stop $(docker ps -q --filter "name=build") || true

    # Remove the specific container, if it exists, after stopping it
    docker rm ${CONTAINER_NAME}

    # Remove containers with 'build' in the name
    docker rm $(docker ps -aq --filter "name=build") || true

    # Remove images matching 'build'
    #docker rmi $(docker images -q --filter "reference=build") || true

    # Remove volumes matching 'build'
    #docker volume rm $(docker volume ls -q --filter "name=build") || true

    # Remove networks matching 'build'
    #docker network rm $(docker network ls -q --filter "name=build") || true

    # Optionally, remove unused Docker images and networks not linked to Compose
    docker system prune -f

    # Optionally remove unused volumes
    docker volume prune -f
}

# Trap EXIT signal to run cleanup
trap cleanup EXIT

# Ensure Docker is running
check_docker_running

# Start the container using docker-compose
echo "${MSGPRE} Starting container using Docker Compose..."
docker-compose -f $DOCKER_COMPOSE_FILE -p ${CONTAINER_NAME} up -d --build

# Keep script running to prevent immediate exit
echo "${MSGPRE} Backend running at http://localhost:${LOCAL_PORT}"
echo "${MSGPRE} Press Ctrl+C to stop the container."

while true; do sleep 1; done
