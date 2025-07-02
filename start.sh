#!/bin/bash
# Glitch startup script to ensure Node is available

echo "Starting Physics Battle Arena..."
echo "Current PATH: $PATH"
echo "Looking for Node..."

# Try different node locations
if command -v node &> /dev/null; then
    echo "Found node at: $(which node)"
    node --version
    node server.js
elif [ -f /usr/local/bin/node ]; then
    echo "Using /usr/local/bin/node"
    /usr/local/bin/node --version
    /usr/local/bin/node server.js
elif [ -f /opt/nvm/versions/node/v14.*/bin/node ]; then
    echo "Using NVM node"
    /opt/nvm/versions/node/v14.*/bin/node --version
    /opt/nvm/versions/node/v14.*/bin/node server.js
else
    echo "ERROR: Cannot find node executable!"
    echo "Trying with npx..."
    npx node server.js
fi