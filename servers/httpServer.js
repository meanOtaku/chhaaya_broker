import http from "node:http";
import express from "express";
import { WebSocketServer, createWebSocketStream } from "ws";
import healthRouter from "../router/healthRoutes.js";

export default function createHttpServer(broker, port) {
  const app = express();

  app.use("/health", healthRouter);

  app.get("/", (req, res) => {
    res.send("HTTP + WS running 🚀");
  });

  const httpServer = http.createServer(app);

  const wss = new WebSocketServer({ server: httpServer });

  wss.on("connection", (ws, req) => {
    const stream = createWebSocketStream(ws);
    broker.handle(stream, req);
  });

  httpServer.listen(port, () => {
    console.log(`✅ HTTP + WS running on port ${port}`);
  });

  return httpServer;
}
