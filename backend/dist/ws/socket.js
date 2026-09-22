"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initWebSocketServer = initWebSocketServer;
exports.broadcastEvent = broadcastEvent;
const ws_1 = require("ws");
let wss;
function initWebSocketServer(server) {
    wss = new ws_1.WebSocketServer({ server, path: '/ws' });
    wss.on('connection', (ws) => {
        console.log('Client connected to WebSocket');
        ws.on('close', () => {
            console.log('Client disconnected');
        });
    });
    return wss;
}
// Global broadcast function for models/controllers
function broadcastEvent(event, payload) {
    if (!wss)
        return;
    const message = JSON.stringify({ event, payload });
    wss.clients.forEach((client) => {
        if (client.readyState === ws_1.WebSocket.OPEN) {
            client.send(message);
        }
    });
}
//# sourceMappingURL=socket.js.map