import { WebSocket } from "ws";

import { createRoom, joinRoom } from "../room.js";
import type { ClientMessage } from "../types/signaling.js";
import { sendMessage } from "../utils/sendMessage.js";

export function handleCreateRoom(
  socket: WebSocket,
  message: Extract<ClientMessage, { type: "CREATE_ROOM" }>,
) {
  const created = createRoom(message.roomId, socket);

  if (!created) {
    sendMessage(socket, { type: "ERROR", message: "Room already exists"});
    return;
  }

  sendMessage(socket, { type: "ROOM_CREATED", roomId: message.roomId });

  console.log(`Room created: ${message.roomId}`);
}

export function handleJoinRoom(
  socket: WebSocket,
  message: Extract<ClientMessage, { type: "JOIN_ROOM" }>,
) {
  const room = joinRoom(message.roomId, socket);

  if(!room) {
    sendMessage(socket, {type: "ERROR", message: "Unable to join room"});
    return;
  }

  sendMessage(socket, {type: "ROOM_JOINED", roomId: message.roomId});

  for(const client of room.clients) {
    if(client !== socket) {
      sendMessage(client, {type: "PEER_JOINED"});
    }
  }

  console.log(`Client joined room: ${message.roomId}`);
}
