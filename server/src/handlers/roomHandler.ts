import { WebSocket } from "ws";
import crypto from "node:crypto";
import {
  createRoom,
  joinRoom,
  removeClient,
  getRoomClients,
  getClientRoom,
} from "../room.js";
import type { ClientMessage } from "../types/signaling.js";
import { sendMessage } from "../utils/sendMessage.js";

export function handleCreateRoom(socket: WebSocket) {
  const existingRoom = getClientRoom(socket);

  if (existingRoom) {
    sendMessage(socket, {
      type: "ERROR",
      message: "You are already in a room",
    });
    return;
  }

  const roomId = crypto.randomBytes(4).toString("hex").toUpperCase();

  const created = createRoom(roomId, socket);

  if (!created) {
    sendMessage(socket, {
      type: "ERROR",
      message: "Unable to create room",
    });
    return;
  }

  sendMessage(socket, {
    type: "ROOM_CREATED",
    roomId,
  });

  console.log(`Room created: ${roomId}`);
}

export function handleJoinRoom(
  socket: WebSocket,
  message: Extract<ClientMessage, { type: "JOIN_ROOM" }>,
) {
  if (getClientRoom(socket)) {
    sendMessage(socket, {
      type: "ERROR",
      message: "You are already in a room",
    });
    return;
  }

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
  const roomId = getClientRoom(socket);

  if (!roomId) {
    sendMessage(socket, {
      type: "ERROR",
      message: "You are not in a room",
    });
    return;
  }

  const clients = getRoomClients(roomId);

  // Notify the other participant before removing this client.
  if (clients) {
    for (const client of clients) {
      if (client !== socket) {
        sendMessage(client, {
          type: "PEER_LEFT",
        });
      }
    }
  }

  removeClient(socket);

  console.log(`Client left room: ${roomId}`);
}
