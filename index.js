import "dotenv/config";
import broker from "./broker/aedes.js";
import createHttpServer from "./servers/httpServer.js";
import createTcpServer from "./servers/tcpServer.js";
import { connectWithRetry } from "./config/db.js";

const HTTP_PORT = process.env.PORT_HTTP || 3000;
const MQTT_PORT = process.env.PORT_MQTT || 1883;

await connectWithRetry({
  retries: 5,
  delay: 3000,
});

createHttpServer(broker, HTTP_PORT);
createTcpServer(broker, MQTT_PORT);
