import { useEffect, useRef, useCallback, useState } from "react";

import {
  connectToSignalingServer,
  createRoom,
  joinRoom,
  leaveRoom,
} from "../services/signaling";

import { handleSignalingMessage } from "../services/signalingHandlers";

export function useSignaling(
  peerConnectionRef: React.RefObject<RTCPeerConnection | null>,
  initialRoomId?: string,
) {
  const socketRef = useRef<WebSocket | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [peerConnectionKey, setPeerConnectionKey] = useState(0);

  const pendingIceCandidates = useRef<RTCIceCandidateInit[]>([]);

  const resetPeerConnection = useCallback(() => {
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;
    pendingIceCandidates.current = [];
    setPeerConnectionKey((key) => key + 1);
  }, [peerConnectionRef]);

  useEffect(() => {
    const socket = connectToSignalingServer();

    socketRef.current = socket;

    socket.onopen = () => {
      if (initialRoomId) {
        joinRoom(socket, initialRoomId);
      }
    };

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
        setErrorMessage(null);

        console.log("Room created:", message.roomId);
      }

      if (message.type === "ROOM_JOINED") {
        setRoomId(message.roomId);
        setErrorMessage(null);

        console.log("Joined room:", message.roomId);
      }

      if (message.type === "ERROR") {
        setErrorMessage(message.message);
      }

      if (message.type === "PEER_LEFT") {
        resetPeerConnection();

        console.log("Peer left the room");
      }
    };

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [initialRoomId, peerConnectionRef, resetPeerConnection]);

  function handleCreateRoom() {
    if (!socketRef.current) return;

    setErrorMessage(null);
    createRoom(socketRef.current);
  }

  function handleJoinRoom(roomId: string) {
    if (!socketRef.current) return;

    setErrorMessage(null);
    joinRoom(socketRef.current, roomId);
  }

  function handleLeaveRoom() {
    if (socketRef.current) {
      leaveRoom(socketRef.current);
    }

    setErrorMessage(null);
    resetPeerConnection();
    setRoomId(null);
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
    leaveRoom: handleLeaveRoom,
    sendIceCandidate,
    roomId,
    peerConnectionKey,
    errorMessage,
  };
}
