import { useEffect, useRef } from "react";
import {
  connectToSignalingServer,
  createRoom,
  joinRoom,
} from "../services/signaling";
import { createOffer, createAnswer } from "../services/webrtc";

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
        const peerConnection = peerConnectionRef.current;

        if(!peerConnection) {
          console.log("Peer connection not ready");
          return;
        }
        console.log("Received OFFER from peer: ", message.offer);
        
        await peerConnection.setRemoteDescription(message.offer);
        console.log("Remote description set");

        const answer = await createAnswer(peerConnection);

        socket.send(JSON.stringify({type: "ANSWER", answer}));
        
        console.log("ANSWER sent to server");
      }

      if (message.type === "ANSWER") {
        const peerConnection = peerConnectionRef.current;

        if (!peerConnection) {
          console.error("Peer connection not ready");
          return;
        }

        console.log("Received ANSWER from peer:", message.answer);

        await peerConnection.setRemoteDescription(message.answer);

        console.log("Remote description set with ANSWER");
      }
      
      if (message.type === "ICE_CANDIDATE") {
        const peerConnection = peerConnectionRef.current;

        if (!peerConnection) {
          console.error("Peer connection not ready");
          return;
        }

        console.log(
          "Received ICE candidate:",
          message.candidate,
        );

        await peerConnection.addIceCandidate(
          message.candidate,
        );

        console.log("ICE candidate added");
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

  function sendIceCandidate(candidate: RTCIceCandidate) {
    if (!socketRef.current) return;

    socketRef.current.send(
      JSON.stringify({
        type: "ICE_CANDIDATE",
        candidate: candidate.toJSON(),
      }),
    );
  }

  return {
    createRoom: handleCreateRoom,
    joinRoom: handleJoinRoom,
    sendIceCandidate
  };
}
