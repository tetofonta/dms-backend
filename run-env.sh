#!/bin/bash

#Syntax run-env.sh <env file> -- commands
ENV_FILE="${1:-'.env'}"
if [ ! -f "$ENV_FILE" ]; then
    echo "No environment found"
else
    set -o allexport
    source "${ENV_FILE}"
    set +o allexport
    echo "Loaded env from ${ENV_FILE}"
    shift
fi

if [ ! "$1" == '--' ]; then
  echo "command error"
  exit 1
fi
shift
$@