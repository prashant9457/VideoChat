import { WebSocket } from "ws";
import type { ServerMessage } from "../types/signaling.js";

export function sendMessage(
  socket: WebSocket,
  message: ServerMessage,
) {
  socket.send(JSON.stringify(message));
}