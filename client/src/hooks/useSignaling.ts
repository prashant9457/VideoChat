import { useEffect, useRef } from "react";

import {
  connectToSignalingServer,
  createRoom,
  joinRoom,
} from "../services/signaling";

export function useSignaling() {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = connectToSignalingServer();

    socketRef.current = socket;

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, []);

  function handleCreateRoom(roomId: string) {
    if (!socketRef.current) return;

    createRoom(socketRef.current, roomId);
  }

  function handleJoinRoom(roomId: string) {
    if (!socketRef.current) return;

    joinRoom(socketRef.current, roomId);
  }

  return {
    createRoom: handleCreateRoom,
    joinRoom: handleJoinRoom,
  };
}