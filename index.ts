import { Aedes } from 'aedes'
import express, { type Request, type Response } from "express";

import { createServer } from 'aedes-server-factory'

const port = process.env.PORT;
const port_broker = process.env.PORT_BROKER;
const app = express();
const aedes = await Aedes.createBroker()
const httpServer = createServer(aedes, { ws: true })

httpServer.listen(port_broker, function () {
    console.log('✅ MQTT websocket server listening on port:', port_broker)
})


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

aedes.off('client', (client) => {
    console.log("Client Connected: ", client.id);

})

aedes.on('publish', (packet, client) => {
    if (client) {
        console.log(`Message Published: ${packet.payload.toString()} on topic: ${packet.topic}`);
    }
});
