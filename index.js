import http from 'node:http'
import { Aedes } from 'aedes'
import express from "express";
import { WebSocketServer, createWebSocketStream } from 'ws'
import 'dotenv/config'

const port = process.env.PORT;
const port_broker = process.env.PORT_BROKER;

//Initialize service
const aedes = await Aedes.createBroker()
const app = express();

// HTTP route
app.get('/', (req, res) => {
  res.send('Express + WebSocket running 🚀');
});

// Create ONE HTTP server
const server = http.createServer(app);

// Attach WebSocket server to same HTTP server
const wss = new WebSocketServer({ server });

//Connect Port to service
wss.on('connection', (websocket, req) => {
    const stream = createWebSocketStream(websocket)
    aedes.handle(stream, req)
})


// Event handling
aedes.on('client', (client) => {
    console.log('Client Connected: ', client.id);
});

aedes.on('clientDisconnect', function (client) {
  console.log('Client Disconnected: ', client.id)
})

aedes.on('publish', (packet, client) => {
    if (client) {
        console.log(`Message Published: ${packet.payload.toString()} on topic: ${packet.topic}`);
    }
});

server.listen(port, () => {
    console.log(`✅ MQTT Broker running on port ${port}`);
});