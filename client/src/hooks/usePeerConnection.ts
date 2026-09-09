import { useEffect } from "react";
import { createPeerConnection } from "../services/webrtc";

type PeerConnectionRef = {
  current: RTCPeerConnection | null;
};

export function usePeerConnection(
  localStream: MediaStream | null,
  peerConnectionRef: PeerConnectionRef,
  onIceCandidate: (candidate: RTCIceCandidate) => void,
) {
  useEffect(() => {
    if (!localStream) return;

    peerConnectionRef.current = createPeerConnection(
      localStream,
      onIceCandidate,
    );

    return () => {
      peerConnectionRef.current?.close();
      peerConnectionRef.current = null;
    };
  }, [localStream, peerConnectionRef, onIceCandidate]);
}