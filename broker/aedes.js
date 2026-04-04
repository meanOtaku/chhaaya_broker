import { Aedes } from "aedes";

const broker = await Aedes.createBroker();

// Events
broker.on("client", (client) => {
  console.log("🔌 Client connected:", client.id);
});

broker.on("clientDisconnect", (client) => {
  console.log("❌ Client disconnected:", client.id);
});

broker.on("publish", (packet, client) => {
  if (client) {
    console.log(
      `📨 ${client.id} → ${packet.topic}: ${packet.payload.toString()}`,
    );
  }
});

export default broker;
