#!/bin/bash

# run.sh - Main script to run Docker Compose setup

# check if pnpm is installed
if ! command -v pnpm &> /dev/null
then
    echo "pnpm could not be found, installing pnpm..."
    npm install -g pnpm
fi

# update pnpm global
pnpm update -g pnpm 

# install dependencies
pnpm -r install 

# run the app
pnpm run dev