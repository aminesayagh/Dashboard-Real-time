#!/bin/sh

# Check if Redis is running by sending a PING command
if redis-cli ping | grep -q "PONG"; then
  
  exit 0
else
  exit 1
fi
