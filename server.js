// Deployment Protocol Test Suite
// This temporarily replaces the game server to test platform requirements

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// TEST 1: Node version and startup
console.log('====================================');
console.log('DEPLOYMENT PROTOCOL TEST SUITE');
console.log('====================================');
console.log(`✅ TEST 1 PASSED: Node ${process.version} started successfully`);
console.log(`   Using engine requirement: ${require('./package.json').engines.node}`);

// Serve static files
app.use(express.static(__dirname));

// TEST 2: Basic HTTP server
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/test-suite.html');
});

const server = app.listen(PORT, () => {
  console.log(`✅ TEST 2 PASSED: HTTP server listening on port ${PORT}`);
});

// TEST 3: WebSocket setup on same port
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server }); // Same server instance!

wss.on('connection', (ws) => {
  console.log('✅ TEST 3 PASSED: WebSocket client connected on same port');
  
  // Keep connection alive for sleep test
  const pingInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.ping();
    } else {
      clearInterval(pingInterval);
    }
  }, 30000);
  
  ws.on('close', () => {
    console.log('WebSocket client disconnected');
    clearInterval(pingInterval);
  });
  
  // Send test updates to client
  const startTime = Date.now();
  const updateInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      ws.send(JSON.stringify({
        type: 'update',
        elapsed: elapsed,
        message: elapsed > 360 ? 'PASSED: Survived 6 minutes!' : `Active for ${elapsed}s`
      }));
    } else {
      clearInterval(updateInterval);
    }
  }, 1000);
});

console.log('Test suite ready. Visit the URL to complete tests 2-4.');