/**
 * Physics Battle Arena - WebSocket Server
 * Implements the NetworkLayer server-side logic
 * Designed for Glitch.com deployment
 */

const express = require('express');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve the game files
app.use(express.static(__dirname));

// Serve the multiplayer HTML at root
app.get('/', (req, res) => {
  const path = require('path');
  const filePath = path.join(__dirname, 'index.html');
  console.log('Serving file:', filePath);
  res.sendFile(filePath);
});

// Game state
const gameState = {
  players: new Map(),
  entities: new Map(),
  frame: 0,
  lastPhysicsState: null,
  matchStarted: false
};

// Initialize game entities
function initializeGameEntities() {
  // These match the entities in index.html
  gameState.entities.set('ball3', {
    id: 'ball3',
    position: { x: 600, y: 400 },
    velocity: { x: -50, y: -50 },
    mass: 0.8,
    radius: 15
  });
  
  gameState.entities.set('ball4', {
    id: 'ball4',
    position: { x: 400, y: 400 },
    velocity: { x: 0, y: 0 },
    mass: 3,
    radius: 35
  });
}

initializeGameEntities();

console.log('Physics Battle Arena Server starting...');

wss.on('connection', (ws) => {
  const playerId = `player${gameState.players.size + 1}`;
  const ballId = `ball${gameState.players.size + 1}`;
  
  console.log(`${playerId} connected, assigned ${ballId}`);
  
  // Create player data
  const playerData = {
    id: playerId,
    ballId: ballId,
    ws: ws,
    connected: true,
    lastInput: null
  };
  
  gameState.players.set(playerId, playerData);
  
  // Add player's ball to entities
  gameState.entities.set(ballId, {
    id: ballId,
    position: { x: 200 + (gameState.players.size - 1) * 200, y: 300 },
    velocity: { x: 0, y: 0 },
    mass: 1.5,
    radius: 20
  });
  
  // Send welcome message with player info
  ws.send(JSON.stringify({
    type: 'welcome',
    playerId: playerId,
    ballId: ballId,
    frame: gameState.frame,
    entities: Array.from(gameState.entities.values()),
    otherPlayers: Array.from(gameState.players.entries())
      .filter(([id]) => id !== playerId)
      .map(([id, p]) => ({ playerId: id, ballId: p.ballId }))
  }));
  
  // Notify other players
  broadcast({
    type: 'playerJoined',
    playerId: playerId,
    ballId: ballId,
    entity: gameState.entities.get(ballId)
  }, ws);
  
  // Handle messages
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      switch(data.type) {
        case 'input':
          // Store input for processing
          playerData.lastInput = {
            ...data.input,
            timestamp: Date.now(),
            frame: data.frame
          };
          
          // Broadcast to other players for client prediction
          broadcast({
            type: 'playerInput',
            playerId: playerId,
            ballId: ballId,
            input: data.input,
            frame: gameState.frame
          }, ws);
          break;
          
        case 'physicsUpdate':
          // Only player1 sends authoritative physics updates
          if (playerId === 'player1') {
            gameState.lastPhysicsState = data.state;
            gameState.frame = data.frame;
            
            // Broadcast physics state to all other players
            broadcast({
              type: 'physicsSync',
              state: data.state,
              frame: data.frame,
              timestamp: Date.now()
            }, ws);
          }
          break;
      }
    } catch (err) {
      console.error('Message error:', err);
    }
  });
  
  ws.on('close', () => {
    console.log(`${playerId} disconnected`);
    
    const player = gameState.players.get(playerId);
    if (player) {
      gameState.players.delete(playerId);
      gameState.entities.delete(player.ballId);
      
      broadcast({
        type: 'playerLeft',
        playerId: playerId,
        ballId: player.ballId
      });
    }
  });
  
  ws.on('error', (err) => {
    console.error(`WebSocket error for ${playerId}:`, err);
  });
});

// Broadcast to all connected clients except sender
function broadcast(data, excludeWs = null) {
  const message = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Add error handling
app.use((err, req, res, next) => {
  console.error('Express error:', err);
  res.status(500).send('Server error');
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`HTTP URL: http://localhost:${PORT}`);
  console.log(`WebSocket URL: ws://localhost:${PORT}`);
  console.log('Server is ready to accept connections!');
  if (process.env.PROJECT_DOMAIN) {
    console.log(`Glitch URL: https://${process.env.PROJECT_DOMAIN}.glitch.me`);
  }
});