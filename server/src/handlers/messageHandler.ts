import { WebSocket } from "ws";
import {
  handleOffer,
  handleAnswer,
  handleIceCandidate,
} from "./signalingHandler.js";
import type { ClientMessage } from "../types/signaling.js";
import { handleCreateRoom, handleJoinRoom, handleLeaveRoom } from "./roomHandler.js";
import { sendMessage } from "../utils/sendMessage.js";

export function handleMessage(socket: WebSocket, rawMessage: string) {
  try {
    const message: ClientMessage = JSON.parse(rawMessage);

    console.log("Received message:", message);

    switch (message.type) {
      case "CREATE_ROOM":
        handleCreateRoom(socket);
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
      case "ICE_CANDIDATE":
        handleIceCandidate(socket, message);
        break;
      case "LEAVE_ROOM":
        handleLeaveRoom(socket);
        break;
    }
  } catch {
    sendMessage(socket, { type: "ERROR", message: "Invalid message"});
  }
}
