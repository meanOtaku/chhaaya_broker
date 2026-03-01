import http from 'node:http'
import net from 'node:net'
import express from 'express'
import { Aedes } from 'aedes'
import { WebSocketServer, createWebSocketStream } from 'ws'
import 'dotenv/config'

const HTTP_PORT = process.env.PORT_HTTP || 3000
const MQTT_PORT = process.env.PORT_MQTT || 1883

// Create broker
const aedes = await Aedes.createBroker()

/* =========================
   1. HTTP + WebSocket
========================= */

const app = express()

app.get('/', (req, res) => {
  res.send('HTTP + WS + TCP MQTT Broker 🚀')
})

const httpServer = http.createServer(app)

// WebSocket MQTT
const wss = new WebSocketServer({ server: httpServer })

wss.on('connection', (ws, req) => {
  const stream = createWebSocketStream(ws)
  aedes.handle(stream, req)
})

httpServer.listen(HTTP_PORT, () => {
  console.log(`✅ HTTP + WS running on port ${HTTP_PORT}`)
})

/* =========================
   2. TCP MQTT (1883)
========================= */

const tcpServer = net.createServer((socket) => {
  aedes.handle(socket)
})

tcpServer.listen(MQTT_PORT, () => {
  console.log(`✅ TCP MQTT running on port ${MQTT_PORT}`)
})

/* =========================
   3. Broker Events
========================= */

aedes.on('client', (client) => {
  console.log('🔌 Client connected:', client.id)
})

aedes.on('clientDisconnect', (client) => {
  console.log('❌ Client disconnected:', client.id)
})

aedes.on('publish', (packet, client) => {
  if (client) {
    console.log(
      `📨 ${client.id} → ${packet.topic}: ${packet.payload.toString()}`
    )
  }
})