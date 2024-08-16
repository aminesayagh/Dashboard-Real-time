#!/bin/bash

# run.sh - Main script to run Docker Compose setup

# DEFAULT ENVIRONMENT
ENVIRONMENT='development'

# Check if an argument is passed for the environment
if [ ! -z "$1" ]; then
    ENVIRONMENT="$1"
fi

# Define the environment file and Docker Compose file
DEFAULT_ENV_FILE=".default.env"
ENV_FILE=".$ENVIRONMENT.env"
COMPOSE_FILE="docker-compose.yml"

# Define Log File
LOG_DIR="./logs"
LOG_FILE="$LOG_DIR/docker-compose-setup.log"

source ./scripts/lib.sh
source ./scripts/utils.sh

# Ensure cleanup on exit
trap exit_execution EXIT

# Main script execution
message "Starting Docker Compose setup..." "info"

# Check files exist
check_file_exists "$DEFAULT_ENV_FILE" "Default environment file not found: $DEFAULT_ENV_FILE"
check_file_exists "$ENV_FILE" "Environment file not found: $ENV_FILE"
check_file_exists "$COMPOSE_FILE" "Docker Compose file not found: $COMPOSE_FILE"

# Load environment variables from both files
set -a
source "$DEFAULT_ENV_FILE"
source "$ENV_FILE"
set +a

# Define PORTS
MONGO_PORT=${MONGO_PORT:-27017}
REDIS_PORT=${REDIS_PORT:-6379}
API_PORT=${API_PORT:-3001}
DASH_PORT=${DASH_PORT:-3000}

# Check folders exist
check_folder_exists "$LOG_DIR" "Log directory not found: $LOG_DIR"

# Redirect all script output to log file and console
exec > >(tee -a "$LOG_FILE") 2>&1

# Check if Ports are available
check_port $MONGO_PORT "Port $MONGO_PORT is not available"
check_port $REDIS_PORT "Port $REDIS_PORT is not available"
check_port $API_PORT "Port $API_PORT is not available"
check_port $DASH_PORT "Port $DASH_PORT is not available"

# Check if the key file of MongoDB exists on ./mongodb/keyfile, if not, create it
check_mongo_keyfile

# Check if the healthcheck files exist on scripts folder, and if yes, give execution permission
healthcheck_files_permission

message "Starting Docker Compose setup..." "info"

$ENV_PARAMS = "--env-file $DEFAULT_ENV_FILE --env-file $ENV_FILE"
docker compose -f "$COMPOSE_FILE" $ENV_PARAMS up --build

DOCKER_COMPOSE_EXIT_CODE=$?

# Start Docker Compose
if [ $DOCKER_COMPOSE_EXIT_CODE -eq 0 ]; then
    message "Docker Compose setup completed successfully" "success"

    # Check if the services are running
    message "Checking services status..." "info"
    docker compose -f "$COMPOSE_FILE" $ENV_PARAMS ps 

    # Export logs
    message "Exporting logs..." "info"
    docker compose -f "$COMPOSE_FILE" $ENV_PARAMS logs > "$LOG_DIR/docker-compose-logs.log"
    
else
    message "Docker Compose setup failed with exit code $DOCKER_COMPOSE_EXIT_CODE" "error"
    message "Docker Compose output: $DOCKER_COMPOSE_OUTPUT" "error"

    # Check individual container logs
    message "Checking individual container logs:" "info"
    for service in $(docker compose -f "$COMPOSE_FILE" $ENV_PARAMS config --services); do
        message "Logs for $service:" "info"
        docker compose -f "$COMPOSE_FILE" $ENV_PARAMS logs $service
    done
    
    cleanup_docker_compose
    exit 1
fi

# Exit with success
exit_execution

message "Docker Compose setup completed successfully" "success"
exit 0