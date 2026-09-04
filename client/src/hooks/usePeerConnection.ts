import { useEffect, useRef } from "react";
import { createPeerConnection } from "../services/webrtc";

export function usePeerConnection(localStream: MediaStream | null) {
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    if (!localStream) return;

    peerConnectionRef.current = createPeerConnection(localStream);

    return () => {
      peerConnectionRef.current?.close();
      peerConnectionRef.current = null;
    };
  }, [localStream]);

  return peerConnectionRef;
} 