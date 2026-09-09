import { useEffect, useRef } from "react";
import {
  connectToSignalingServer,
  createRoom,
  joinRoom,
} from "../services/signaling";

import { createOffer } from "../services/webrtc";
export function useSignaling(
  peerConnectionRef: React.RefObject<RTCPeerConnection | null>,
) {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = connectToSignalingServer();

    socketRef.current = socket;

    socket.onmessage = async (event) => {
      const message = JSON.parse(event.data);

      console.log("Received from server:", message);

      if (message.type === "PEER_JOINED") {
        const peerConnection = peerConnectionRef.current;

        if (!peerConnection) {
          console.error("Peer connection not ready");
          return;
        }

        const offer = await createOffer(peerConnection);

        socket.send(JSON.stringify({ type: "OFFER", offer }));

        console.log("OFFER sent to server");
      }

      if (message.type === "OFFER") {
        console.log("Received OFFER from peer:", message.offer);
      }
    };

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [peerConnectionRef]);

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
