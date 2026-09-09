import { getClientRoom, getRoomClients } from "../room.js";
import type { ClientMessage } from "../types/signaling.js";
import { sendMessage } from "../utils/sendMessage.js";
import { WebSocket } from "ws";

export function handleOffer(
    socket: WebSocket,
    message: Extract<ClientMessage, {type: "OFFER"}>,
) {
    const roomId = getClientRoom(socket);

    if(!roomId) {
        sendMessage(socket, {type: "ERROR", message: "Room not found"});
        return;
    }

    const clients = getRoomClients(roomId);

  if (!clients) { 
    sendMessage(socket, { type: "ERROR", message: "Room not found"});
    return;
  }

  for (const client of clients) {
    if (client !== socket) {
      sendMessage(client, { type: "OFFER", offer: message.offer });
    }
  }
}