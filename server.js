const http = require("http");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");

const PORT = Number(process.env.PORT || 8080);
const ROOT = path.join(__dirname, "public");
const players = new Map();
const names = ["Moss", "Ember", "Ripple", "Pebble", "Breeze", "Sprout", "Nova", "Clover"];
const world = { width: 32, height: 22, tile: 24 };

function serveFile(req, res) {
  const pathname = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
  const requested = pathname === "/" ? "/index.html" : pathname;
  const full = path.normalize(path.join(ROOT, requested));
  if (!full.startsWith(ROOT)) {
    res.writeHead(403); res.end("Forbidden"); return;
  }
  fs.readFile(full, (err, data) => {
    if (err) { res.writeHead(404); res.end("Not found"); return; }
    const ext = path.extname(full);
    const type = ext === ".html" ? "text/html; charset=utf-8"
      : ext === ".js" ? "text/javascript; charset=utf-8"
      : ext === ".css" ? "text/css; charset=utf-8" : "application/octet-stream";
    res.writeHead(200, { "Content-Type": type, "Cache-Control": "no-cache" });
    res.end(data);
  });
}
const server = http.createServer(serveFile);
const wss = new WebSocket.Server({ server });

function send(ws, data) {
  if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(data));
}
function broadcast(data, except) {
  for (const client of wss.clients) if (client !== except) send(client, data);
}
function cleanName(value) {
  return String(value || "").replace(/[<>]/g, "").trim().slice(0, 16) || "Trainer";
}
function safeNumber(n, min, max) {
  n = Number(n);
  return Number.isFinite(n) ? Math.max(min, Math.min(max, n)) : min;
}
wss.on("connection", (ws) => {
  const id = Math.random().toString(36).slice(2, 10);
  const occupied = [...players.values()].map(p => p.name);
  const defaultName = names.find(n => !occupied.includes(n)) || `Trainer${Math.floor(Math.random()*900+100)}`;
  const player = { id, name: defaultName, x: 12 + Math.random()*4, y: 10 + Math.random()*3, dir: "down", color: ["#f2bd76","#86c7a5","#a5b8ee","#e7a0b4"][Math.floor(Math.random()*4)], onlineAt: Date.now() };
  players.set(id, player);
  send(ws, { type: "welcome", id, player, players: [...players.values()], world });
  broadcast({ type: "join", player }, ws);

  ws.on("message", raw => {
    let msg;
    try { msg = JSON.parse(raw.toString()); } catch { return; }
    const p = players.get(id);
    if (!p || !msg || typeof msg.type !== "string") return;

    if (msg.type === "move") {
      p.x = safeNumber(msg.x, 1, world.width - 2);
      p.y = safeNumber(msg.y, 1, world.height - 2);
      p.dir = ["up","down","left","right"].includes(msg.dir) ? msg.dir : "down";
      if (msg.name) p.name = cleanName(msg.name);
      broadcast({ type: "move", player: p }, ws);
      send(ws, { type: "self", player: p });
    } else if (msg.type === "name") {
      p.name = cleanName(msg.name);
      broadcast({ type: "rename", player: p });
      send(ws, { type: "self", player: p });
    } else if (msg.type === "chat") {
      const text = String(msg.text || "").replace(/[<>]/g, "").trim().slice(0, 140);
      if (text) broadcast({ type: "chat", id, name: p.name, text, at: Date.now() });
    } else if (msg.type === "emote") {
      const emote = ["hello","heart","wave","!"].includes(msg.emote) ? msg.emote : "hello";
      broadcast({ type: "emote", id, emote }, ws);
      send(ws, { type: "emote", id, emote });
    }
  });
  ws.on("close", () => {
    players.delete(id);
    broadcast({ type: "leave", id });
  });
});
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Verdant Online running at http://localhost:${PORT}`);
});