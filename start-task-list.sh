#!/usr/bin/env bash

npm run dbserver &
DBSERVER_PID=$!

cleanup() {
  kill "$DBSERVER_PID" 2>/dev/null
}
trap cleanup EXIT

npm start -- --open
