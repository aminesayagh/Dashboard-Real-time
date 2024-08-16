#!/bin/bash

# cleanup.sh - Script to clean up Docker Compose services

source ./scripts/lib.sh 
source ./scripts/utils.sh

# Ensure cleanup on exit
trap cleanup_docker_compose EXIT

# Main script execution
message "Cleaning up Docker Compose services..." "info"

# Clean up Docker Compose services
cleanup_docker_compose