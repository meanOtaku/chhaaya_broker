import { createServer } from 'node:http'
import { Aedes } from 'aedes'
import express from "express";
import { WebSocketServer, createWebSocketStream } from 'ws'
import 'dotenv/config'

const port = process.env.PORT;
const port_broker = process.env.PORT_BROKER;

const aedes = await Aedes.createBroker()
const wsserver = createServer();
const app = express();

const wss = new WebSocketServer({
    server: wsserver
})

wss.on('connection', (websocket, req) => {
    const stream = createWebSocketStream(websocket)
    aedes.handle(stream, req)
})


wsserver.listen(port_broker, () => {
    console.log(`✅ MQTT Broker running on port ${port_broker}`);
});


app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`✅ Server is running on Port: ${port}`);
});

// Event handling
aedes.on('client', (client) => {
    console.log('Client Connected: ', client.id);
});

aedes.on('publish', (packet, client) => {
    if (client) {
        console.log(`Message Published: ${packet.payload.toString()} on topic: ${packet.topic}`);
    }
});
