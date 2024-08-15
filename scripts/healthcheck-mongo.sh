#!/bin/sh

# Check if MongoDB is running by pinging the admin database
if mongo --eval 'db.adminCommand({ping: 1})' >/dev/null 2>&1; then
  exit 0
else
  exit 1
fi
