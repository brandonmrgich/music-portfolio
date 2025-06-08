#!/bin/bash

CONTAINER_NAME="music-portfolio-backend"
IMAGE_NAME="music-portfolio-backend"
LOCAL_PORT=5000
CONTAINER_PORT=5000
DOCKER_COMPOSE_FILE="./docker-compose.yml"

MSGPRE="[DOCKER]"

# Colima/Docker status
COLIMA_STARTED=false

# Function to check if Docker or Colima is running
check_docker_or_colima() {
    if docker info &>/dev/null; then
        echo "${MSGPRE} Docker is running."
        return 0
    fi
    # If on macOS, try Colima
    if [[ "$(uname)" == "Darwin" ]]; then
        if command -v colima > /dev/null 2>&1; then
            echo "${MSGPRE} Docker is not running. Attempting to start Colima..."
            colima start
            sleep 3
            if docker info &>/dev/null; then
                echo "${MSGPRE} Colima started and Docker CLI is now available."
                COLIMA_STARTED=true
                return 0
            else
                echo "${MSGPRE} [ERR] Failed to start Colima. Aborting."
                exit 1
            fi
        else
            echo "${MSGPRE} [ERR] Docker is not running and Colima is not installed. Please start Docker Desktop or install Colima."
            exit 1
        fi
    else
        echo "${MSGPRE} [ERR] Docker is not running. Please start Docker."
        exit 1
    fi
}

# Function to clean up container on exit
cleanup() {
    echo "${MSGPRE} Stopping and removing the container: ${CONTAINER_NAME}..."

    # Stop and remove containers, networks, and volumes managed by Compose
    docker-compose down --volumes --remove-orphans

    # Ensure all related containers are stopped before removal
    docker stop ${CONTAINER_NAME} || true

    # Stop containers with 'build' in the name
    docker stop $(docker ps -q --filter "name=build") || true

    # Remove the specific container, if it exists, after stopping it
    docker rm ${CONTAINER_NAME} || true

    # Remove containers with 'build' in the name
    docker rm $(docker ps -aq --filter "name=build") || true

    # Optionally, remove unused Docker images and networks not linked to Compose
    docker system prune -f

    # Optionally remove unused volumes
    docker volume prune -f

    # Stop Colima if we started it
    if [ "$COLIMA_STARTED" = true ]; then
        echo "${MSGPRE} Stopping Colima..."
        colima stop
    fi
}

# Trap EXIT signal to run cleanup
trap cleanup EXIT

# Ensure Docker or Colima is running
check_docker_or_colima

# Start the container using docker-compose
echo "${MSGPRE} Starting container using Docker Compose..."
docker-compose -f $DOCKER_COMPOSE_FILE -p ${CONTAINER_NAME} up -d --build

# Keep script running to prevent immediate exit
echo "${MSGPRE} Backend running at http://localhost:${LOCAL_PORT}"
echo "${MSGPRE} Press Ctrl+C to stop the container."

while true; do sleep 1; done
