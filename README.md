# Verdant Online — Multiplayer Creature Adventure

A runnable starter project for an original, GBA-inspired creature-adventure game. It uses original placeholder pixel-art drawn in Canvas and does not include Pokémon ROM data, copyrighted sprites, music, maps, or other official assets.

## Included in this prototype

- Browser game rendered at a pixel-art resolution
- Keyboard movement (arrow keys / WASD) and mobile on-screen directional controls
- Small explorable map with paths, grass, water, trees, and a village
- Real-time multiplayer player positions through WebSockets
- World chat, trainer names, and a wave emote
- Local browser save for the player's position and name
- Automatic reconnect if the WebSocket connection drops

## Requirements

- Node.js 18 or newer
- npm
- Internet access is not required after the dependency has been installed

## Run locally

1. Extract the ZIP.
2. Open a terminal in the extracted `verdant-online` folder.
3. Run:

   ```bash
   npm install
   npm start
   ```

4. Open `http://localhost:8080` in a browser.
5. To test multiplayer locally, open the same URL in another tab or browser window.

## Test on a phone

For devices on the same Wi-Fi, find the computer's local IP address and open `http://YOUR-COMPUTER-IP:8080` on the phone. The computer firewall must allow inbound connections on port 8080. This is for local testing, not public hosting.

## Deploy for online play

Deploy the Node.js app to a host that supports persistent Node processes and WebSockets. Configure the host to provide `PORT` and enable HTTPS/WSS. Static-only hosting (for example, a plain static file host) is not sufficient for multiplayer.

## Current limitations

This is the first playable foundation, not a finished commercial-scale game. The server currently keeps player presence in memory; all players share one simple room. Player position/name are saved locally in each browser, not to a permanent server account. There is no authentication, moderation tooling, anti-cheat, database, creature battle system, creature collection, trading, quests, or cross-device cloud saves yet. Do not expose this prototype publicly without adding validation, rate limits, abuse controls, secure accounts, and persistent storage.

## Suggested development roadmap

1. Add authoritative server-side world collision and map zones.
2. Add original creatures, turn-based battles, capture, levels, and skills.
3. Add inventory, quests, NPC dialogue, and save slots.
4. Add accounts and a database for persistent character progress.
5. Add trading / PvP battle rooms with server-side validation.
6. Add moderation tools, rate limits, backups, deployment automation, and accessibility improvements.

## Project structure

```text
verdant-online/
  package.json
  server.js
  public/
    index.html
```
