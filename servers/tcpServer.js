import net from "node:net";

export default function createTcpServer(broker, port) {
  const server = net.createServer((socket) => {
    broker.handle(socket);
  });

  server.listen(port, () => {
    console.log(`✅ TCP MQTT running on port ${port}`);
  });

  return server;
}
