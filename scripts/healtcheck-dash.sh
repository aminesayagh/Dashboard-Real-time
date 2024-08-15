#!/bin/sh

# Attempt to access the dashboard service
curl -f http://localhost:3000 > /dev/null 2>&1

# Check the exit status of the curl command
if [ $? -eq 0 ]; then
  echo "Dashboard is running"
  exit 0
else
  echo "Dashboard is not responding"
  exit 1
fi
