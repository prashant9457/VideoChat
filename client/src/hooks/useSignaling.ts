import { useEffect, useRef, useCallback, useState } from "react";

import {
  connectToSignalingServer,
  createRoom,
  joinRoom,
} from "../services/signaling";
import { handleSignalingMessage } from "../services/signalingHandlers";



export function useSignaling(
  peerConnectionRef: React.RefObject<RTCPeerConnection | null>,
) {
  const socketRef = useRef<WebSocket | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);

  const pendingIceCandidates = useRef<RTCIceCandidateInit[]>([]);

  useEffect(() => {
    const socket = connectToSignalingServer();

    socketRef.current = socket;

    socket.onmessage = async (event) => {
      const message = JSON.parse(event.data);

      await handleSignalingMessage(
        socket,
        message,
        peerConnectionRef,
        pendingIceCandidates,
      );

      if (message.type === "ROOM_CREATED") {
        setRoomId(message.roomId);

        console.log("Room created:", message.roomId);
      }

      if (message.type === "ROOM_JOINED") {
        setRoomId(message.roomId);

        console.log("Joined room:", message.roomId);
      }
    };

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [peerConnectionRef]);

  function handleCreateRoom() {
    if (!socketRef.current) return;

    createRoom(socketRef.current);
  }

  function handleJoinRoom(roomId: string) {
    if (!socketRef.current) return;

    joinRoom(socketRef.current, roomId);
  }

  const sendIceCandidate = useCallback((candidate: RTCIceCandidate) => {
    if (!socketRef.current) return;

    socketRef.current.send(
      JSON.stringify({
        type: "ICE_CANDIDATE",
        candidate: candidate.toJSON(),
      }),
    );
  }, []);

  return {
    createRoom: handleCreateRoom,
    joinRoom: handleJoinRoom,
    sendIceCandidate,
    roomId,
  };
}
