import { createServer } from 'node:net'
import { Aedes } from 'aedes'
import express, { type Request, type Response } from "express";

const port = process.env.PORT;

const aedes = await Aedes.createBroker()
const server = createServer(aedes.handle);
const port_broker = process.env.PORT_BROKER;
const app = express();

server.listen(port_broker, () => {
    console.log(`✅ MQTT Broker running on port ${port_broker}`);
});


app.get("/", (req: Request, res: Response) => {
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
