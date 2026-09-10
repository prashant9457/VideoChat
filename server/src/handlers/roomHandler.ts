import { WebSocket } from "ws";
import crypto from "node:crypto";
import { createRoom, joinRoom, removeClient, getRoomClients } from "../room.js";
import type { ClientMessage } from "../types/signaling.js";
import { sendMessage } from "../utils/sendMessage.js";

export function handleCreateRoom(socket: WebSocket) {
  const roomId = crypto.randomBytes(4).toString("hex").toUpperCase();
  const created = createRoom(roomId, socket);

  if (!created) {
    sendMessage(socket, { type: "ERROR", message: "Unable to create room" });
    return;
  }

  sendMessage(socket, { type: "ROOM_CREATED", roomId });

  console.log(`Room created: ${roomId}`);
}

export function handleJoinRoom(
  socket: WebSocket,
  message: Extract<ClientMessage, { type: "JOIN_ROOM" }>,
) {
  const room = joinRoom(message.roomId, socket);

  if (!room) {
    sendMessage(socket, { type: "ERROR", message: "Unable to join room" });
    return;
  }

  sendMessage(socket, { type: "ROOM_JOINED", roomId: message.roomId });

  for (const client of room.clients) {
    if (client !== socket) {
      sendMessage(client, { type: "PEER_JOINED" });
    }
  }

  console.log(`Client joined room: ${message.roomId}`);
}

export function handleLeaveRoom(socket: WebSocket) {
  const roomId = removeClient(socket);

  if (!roomId) {
    sendMessage(socket, { type: "ERROR", message: "You are not in a room" });
    return;
  }
  const clients = getRoomClients(roomId);

  if (clients) {
    for (const client of clients) sendMessage(client, { type: "PEER_LEFT" });
  }

  sendMessage(socket, { type: "PEER_LEFT" });

  console.log(`Client left room: ${roomId}`);
}
