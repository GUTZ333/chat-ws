import express from "express";
import { WebSocketServer } from "ws";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer });

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    wss.clients.forEach(client => client.send(message.toString()))
  })
})

httpServer.listen(8000, () => { console.log("HTTP SERVER RUNNING!") });
