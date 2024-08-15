#!/bin/bash

# Function to format and display messages
# Parameters:
#   $1: The message to show (mandatory)
#   $2: The flag for the type of message ('error', 'warning', 'success', 'info') (mandatory)
message() {
    local message="$1"
    local type="${2:-info}"
    local timestamp=$(date "+%Y-%m-%d %H:%M:%S")
    
    # ANSI color codes
    local RED='\033[0;31m'
    local GREEN='\033[0;32m'
    local YELLOW='\033[0;33m'
    local BLUE='\033[0;34m'
    local NC='\033[0m' # No Color

    # Select color based on message type
    case "$type" in
        "error") color=$RED ;;
        "success") color=$GREEN ;;
        "warning") color=$YELLOW ;;
        *) color=$BLUE ;;
    esac

    # Print colored message to terminal
    echo -e "${color}[${type^^}] [$timestamp] $message${NC}"
}

# Function to check if a file exists
check_file_exists() {
  local file_path="$1"
  local error_message="${2:-File not found: $file_path}" # Default error message if not provided
  local continue_on_failure="$3"

  if [ ! -f "$file_path" ]; then
    message "$error_message" "error"
    if [ "$continue_on_failure" != "continue" ]; then
      exit 1
    fi
  else
    message "File found: $file_path" "success"
  fi
}

# Function to check if a directory exists
check_directory_exists() {
  local dir_path="$1"
  local error_message="${2:-Directory not found: $dir_path}"
  local continue_on_failure="$3"

  if [ ! -d "$dir_path" ]; then
    message "$error_message" "error"
    if [ "$continue_on_failure" != "continue" ]; then
      exit 1
    fi
  else
    message "Directory found: $dir_path" "success"
  fi
}

# Function to check if a port is available
check_port() {
    local port="$1"
    local error_message="${2:-Port $port is not available}"
    local continue_on_failure="$3"
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null; then
        message "$error_message " "error"
        # how use the port
        lsof -i:$port 
        if [ "$continue_on_failure" != "continue" ]; then
          exit 1
        fi
    else
        message "Port $port is available" "success"
    fi
}
