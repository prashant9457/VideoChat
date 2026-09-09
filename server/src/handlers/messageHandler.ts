import { WebSocket } from "ws";
import { handleOffer, handleAnswer } from "./signalingHandler.js";
import type { ClientMessage } from "../types/signaling.js";
import { handleCreateRoom, handleJoinRoom } from "./roomHandler.js";
import { sendMessage } from "../utils/sendMessage.js";

export function handleMessage(socket: WebSocket, rawMessage: string) {
  try {
    const message: ClientMessage = JSON.parse(rawMessage);

    console.log("Received message:", message);

    switch (message.type) {
      case "CREATE_ROOM":
        handleCreateRoom(socket, message);
        break;
      case "JOIN_ROOM":
        handleJoinRoom(socket, message);
        break;
      case "OFFER":
        handleOffer(socket, message);
        break;
      case "ANSWER":
        handleAnswer(socket, message);
        break;
    }
  } catch {
    sendMessage(socket, {
      type: "ERROR",
      message: "Invalid message",
    });
  }
}
