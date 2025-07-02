#!/bin/bash
# Glitch startup script with exact Node path

echo "Starting Physics Battle Arena..."

# Use the exact path we found
NODE_PATH="/opt/nvm/versions/node/v14/bin/node"

if [ -f "$NODE_PATH" ]; then
    echo "Using Node at: $NODE_PATH"
    $NODE_PATH --version
    $NODE_PATH server.js
else
    # Fallback to searching
    echo "Node not at expected path, searching..."
    /opt/nvm/versions/node/v*/bin/node server.js
fi