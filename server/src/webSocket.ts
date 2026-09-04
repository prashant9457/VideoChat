import { Server } from "http";
import { WebSocket, WebSocketServer } from "ws";

import { handleMessage } from "./handlers/messageHandler.js";
import { removeClient } from "./room.js";

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (socket: WebSocket) => {
    console.log("WebSocket client connected");

    socket.on("message", (data) => {
      handleMessage(socket, data.toString());
    });

    socket.on("close", () => {
      const roomId = removeClient(socket);

      console.log("Client disconnected from room:", roomId);
    });
  });
}
