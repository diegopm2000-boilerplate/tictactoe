#!/bin/sh

# Execute this script as source ./init_git.sh for export variables to global environment outside the script scope

# Express Port
export EXPRESS_PORT="8083"
env | grep '^EXPRESS_PORT='

# Mongo URL
export MONGO_URL="mongodb://admin:admin@localhost:27018"
env | grep '^MONGO_URL='

# Private Routes
export PRIVATE_ROUTES="/api/tictactoes/*"
env | grep '^PRIVATE_ROUTES='

# Token verify Endpoint
export TOKEN_VERIFY_ENDPOINT="http://localhost:8082/api/identitysvc/tokens/verify"
env | grep '^TOKEN_VERIFY_ENDPOINT='

# Token refresh Endpoint
export TOKEN_REFRESH_ENDPOINT="http://localhost:8082/api/identitysvc/tokens/refresh"
env | grep '^TOKEN_REFRESH_ENDPOINT='