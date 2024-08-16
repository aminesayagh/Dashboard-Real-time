#!/bin/bash

source ./scripts/lib.sh
source ./scripts/utils.sh

healthcheck_files_permission

check_mongo_keyfile

give_execution_permission ./mono/scripts/pnpm-context.mjs
give_execution_permission ./mono/scripts/preinstall