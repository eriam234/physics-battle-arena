#!/bin/bash
# Glitch startup script with exact Node and npm paths

echo "Starting Physics Battle Arena..."

# Set up NVM paths
export NVM_DIR="/opt/nvm"
export PATH="/opt/nvm/versions/node/v14/bin:$PATH"

# Verify paths
echo "Node path: $(which node)"
echo "NPM path: $(which npm)"

# Run the server directly with node
/opt/nvm/versions/node/v14/bin/node server.js