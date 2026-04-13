import { Aedes } from "aedes";
import { handleAggregation } from "../middleware/aggregator.js";
import { queueInsert } from "../middleware/batchInsert.js";
import { decodeIMU } from "../utils/decodeIMU.js";

const broker = await Aedes.createBroker();

// Client connected
broker.on("client", (client) => {
  console.log(`🟢 Client connected: ${client?.id}`)
})

// Client disconnected
broker.on("clientDisconnect", (client) => {
  console.log(`🔴 Client disconnected: ${client?.id}`)
})

// Error handling
broker.on("clientError", (client, err) => {
  console.error(`❌ Client error (${client?.id}):`, err.message)
})

broker.on("connectionError", (client, err) => {
  console.error(`❌ Connection error (${client?.id}):`, err.message)
})

/* ===================== MESSAGE HANDLER ===================== */

broker.on("publish", (packet, client) => {
  if (!client) return;

  try {
    const payload = decodeIMU(packet.payload);

    if (!payload.ts || !payload.role) return;

    handleAggregation(payload, queueInsert);
  } catch (err) {
    console.error("❌ Decode error:", err.message);
  }
});

/* ===================== EXPORT ===================== */

export default broker
