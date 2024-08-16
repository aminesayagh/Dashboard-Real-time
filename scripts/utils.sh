#!/bin/bash

# Function to clean up Docker Compose services
cleanup_docker_compose() {
    message "Cleaning up Docker Compose services..." "info"
    docker compose -f "$COMPOSE_FILE" down --volumes 
    message "Cleanup complete." "success"
}

# Function to check if a port is available
check_mongo_keyfile() {
    if [ ! -f ./mongo/keyfile ]; then
        message "Creating MongoDB keyfile..." "info"
        mkdir -p ./mongo
        openssl rand -base64 756 > ./mongo/keyfile
    fi
    chmod 400 ./mongo/keyfile
    message "MongoDB keyfile created successfully" "success"
}

# Execution permission to healthcheck files
healthcheck_files_permission() {
    for file in ./scripts/healthcheck-*.sh; do
        if [ -f "$file" ]; then
            message "Giving execution permission to $file..." "info"
            chmod +x "$file"
            message "Execution permission granted to $file" "success"
        fi
    done
}

# Exit execution
exit_execution() {
    message "Exiting Docker Compose setup..." "info"
    # list all containers and their status running, related to the docker-compose file
    docker compose -f "$COMPOSE_FILE" $ENV_PARAMS ps
    exit 0
}