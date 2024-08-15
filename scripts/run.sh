#!/bin/bash

# run.sh - Main script to run Docker Compose setup

# DEFAULT ENVIRONMENT
ENVIRONMENT='development'

# Check if an argument is passed for the environment
if [ ! -z "$1" ]; then
    ENVIRONMENT="$1"
fi

# Define the environment file and Docker Compose file
ENV_FILE=".env.$ENVIRONMENT"
COMPOSE_FILE="docker-compose.yml"

# Define PORTS
MONGO_PORT=27017
REDIS_PORT=6380

# Define Log File
LOG_DIR="./logs"
LOG_FILE="$LOG_DIR/docker-compose-setup.log"

# check if the log directory exists
if [ ! -d "$LOG_DIR" ]; then
    mkdir -p "$LOG_DIR"
fi

source ./scripts/lib.sh

# Function to clean up Docker Compose services
cleanup_docker_compose() {
    message "Cleaning up Docker Compose services..." "info"
    docker compose -f "$COMPOSE_FILE" down --volumes 
    message "Cleanup complete." "success"
}

# Redirect all script output to log file and console
exec > >(tee -a "$LOG_FILE") 2>&1


# Ensure cleanup on exit
trap cleanup_docker_compose EXIT

# Main script execution
message "Starting Docker Compose setup..." "info"

# Check files exist
check_file_exists "$ENV_FILE" "Environment file not found: $ENV_FILE"
check_file_exists "$COMPOSE_FILE" "Docker Compose file not found: $COMPOSE_FILE"

# Check if Ports are available
check_port $MONGO_PORT "Port $MONGO_PORT is not available"
check_port $REDIS_PORT "Port $REDIS_PORT is not available"

# Check if the key file of MongoDB exists on ./mongodb/keyfile, if not, create it
if [ ! -f ./mongo/keyfile ]; then
    message "Creating MongoDB keyfile..." "info"
    mkdir -p ./mongo
    openssl rand -base64 756 > ./mongodb/keyfile
    chmod 400 ./mongo/keyfile
    message "MongoDB keyfile created successfully" "success"
fi

# Check if the healthcheck files exist on scripts folder, and if yes, give execution permission
for file in ./scripts/healthcheck-*.sh; do
    if [ -f "$file" ]; then
        message "Giving execution permission to $file..." "info"
        chmod +x "$file"
        message "Execution permission granted to $file" "success"
    fi
done

message "Starting Docker Compose setup..." "info"

docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up --build
DOCKER_COMPOSE_EXIT_CODE=$?

# Start Docker Compose
if [ $DOCKER_COMPOSE_EXIT_CODE -eq 0 ]; then
    message "Docker Compose setup completed successfully" "success"

    # Check if the services are running
    message "Checking services status..." "info"
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps 

    # Export logs
    message "Exporting logs..." "info"
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" logs > "$LOG_DIR/docker-compose-logs.log"
    
else
    message "Docker Compose setup failed with exit code $DOCKER_COMPOSE_EXIT_CODE" "error"
    message "Docker Compose output:" "error"
    echo "$DOCKER_COMPOSE_OUTPUT"
    
    # Check individual container logs
    message "Checking individual container logs:" "info"
    for service in $(docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" config --services); do
        message "Logs for $service:" "info"
        docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" logs $service
    done
    
    cleanup_docker_compose
    exit 1
fi

# Exit with success
cleanup_docker_compose

message "Docker Compose setup completed successfully" "success"
exit 0