import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (socket: WebSocket) => {
    console.log("WebSocket client connected");

    socket.send(
      JSON.stringify({
        type: "connected",
        message: "Connected to PeerCall signaling server",
      }),
    );

    socket.on("message", (data) => {
      const message = JSON.parse(data.toString());

      console.log("Received message:", message);

      socket.send(
        JSON.stringify({
          type: "message",
          message: "Server received your message",
        }),
      );
    });

    socket.on("close", () => {
      console.log("WebSocket client disconnected");
    });
  });
}