import { Aedes } from "aedes";
import pool from "../config/db.js";

const broker = await Aedes.createBroker();

// Events
broker.on("client", (client) => {
  console.log("🔌 Client connected:", client.id);
});

broker.on("clientDisconnect", (client) => {
  console.log("❌ Client disconnected:", client.id);
});

broker.on("publish", async (packet, client) => {
  if (!client) return;

  const topic = packet.topic;
  const payload = packet.payload.toString().trim();

  console.log(`📨 ${client.id} → ${topic}: ${payload}`);

  try {
    await pool.query(
      "INSERT INTO messages (client_id, topic, payload) VALUES ($1, $2, $3)",
      [client.id, topic, payload],
    );
  } catch (err) {
    console.error("❌ DB insert failed:", err);
  }
});

export default broker;
