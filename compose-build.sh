#!/bin/sh
# On Ubuntu 22.04, podman-compose version must be 1.0.6 due to missing of latest podman version.

export GIT_COMMIT_HASH=$(git rev-parse --short HEAD)
OCI=podman
COMPOSE=$OCI-compose
COMPOSE_FILE=compose.local.yaml
NETWORK_NAME=myboothmanager

if ! command -v $COMPOSE > /dev/null 2>&1; then
  echo "Error: '$COMPOSE' command not found."
  exit 1
fi

if ! [ -f "$COMPOSE_FILE" ]; then
  if [ -f "compose.yaml" ]; then
    COMPOSE_FILE=compose.yaml
  else
    echo "Error: Neither compose.local.yaml nor compose.yaml found."
    exit 1
  fi
fi

if ! $OCI network exists $NETWORK_NAME > /dev/null; then
  echo "'$NETWORK_NAME' network not found. Creating..."
  NETWORK_CREATE_OUTPUT=$($OCI network create $NETWORK_NAME)

  if [ $? -ne 0 ]; then
    echo "Error: Failed to create '$NETWORK_NAME' network."
    exit 1
  fi

  if [ -f "$NETWORK_CREATE_OUTPUT" ]; then
    echo "Fixing CNI version to 0.4.0..."
    sed -i 's/\(\"cniVersion\"\:\) \"\([[:digit:]]\+\.[[:digit:]]\+\.[[:digit:]]\+\)\"/\1 \"0.4.0\"/' $NETWORK_CREATE_OUTPUT
  else
    echo "Warning: Can't fix CNI version because the conflist file is not found: $NETWORK_CREATE_OUTPUT"
    echo "Warning: Please fix the CNI version manually. Anyway the process will continue."
  fi
fi

echo
echo "=========="
echo "OCI:                   $OCI"
echo "Using compose command: $COMPOSE"
echo "Using compose file:    $COMPOSE_FILE"
echo "Using network name:    $NETWORK_NAME"
echo "=========="
echo

$COMPOSE -f $COMPOSE_FILE down
time $COMPOSE -f $COMPOSE_FILE up -d --build
