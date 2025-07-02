# Physics Battle Arena

A real-time multiplayer physics game where players control bouncing balls in an arena.

## 🎮 Play Online

Deploy to Glitch for instant multiplayer fun!

## 🎯 Game Features

- **Real-time Physics**: Gravity, collisions, and momentum
- **Multiplayer**: Connect with friends online
- **Dash Ability**: Strategic speed boosts
- **Visual Effects**: Particle systems and smooth rendering

## 🕹️ Controls

- **Movement**: WASD or Arrow Keys
- **Dash**: Space or Shift (3 second cooldown)

## 🚀 Quick Start

### Run Locally
```bash
npm install
npm run server
# Open http://localhost:3000
```

### Deploy to Glitch
1. Import this repo to Glitch
2. It auto-starts the server
3. Share the URL with friends!

## 🏗️ Architecture

- **WebSocket Server**: Real-time state synchronization
- **Physics Engine**: Authoritative server-side simulation
- **Canvas Renderer**: Smooth 60 FPS client rendering
- **Event System**: Modular component communication

## 📁 Files

- `server.js` - WebSocket game server
- `index-multiplayer.html` - Complete game client
- `package.json` - Dependencies
- `glitch.json` - Deployment config

---

Have fun battling! 🎮