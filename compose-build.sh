#!/bin/sh

export GIT_COMMIT_HASH=$(git rev-parse --short HEAD)
COMPOSE=docker-compose
COMPOSE_FILE=compose.local.yaml

if ! command -v $COMPOSE > /dev/null 2>&1; then
  if command -v podman-compose > /dev/null 2>&1; then
    COMPOSE=podman-compose
  else
    echo "Error: Neither docker-compose nor podman-compose found."
    exit 1
  fi
fi

if ! [ -f "$COMPOSE_FILE" ]; then
  if [ -f "compose.yaml" ]; then
    COMPOSE_FILE=compose.yaml
  else
    echo "Error: Neither compose.local.yaml nor compose.yaml found."
    exit 1
  fi
fi

$COMPOSE -f $COMPOSE_FILE down
$COMPOSE -f $COMPOSE_FILE up -d --build
