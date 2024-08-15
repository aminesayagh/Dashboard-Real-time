#!/bin/sh

# Check if the API is responding on port 3001
if curl -f http://localhost:3001 >/dev/null 2>&1; then
  exit 0
else
  exit 1
fi
