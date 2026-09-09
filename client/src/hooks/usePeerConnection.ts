import { useEffect, useState } from "react";
import { createPeerConnection } from "../services/webrtc";

type PeerConnectionRef = {
  current: RTCPeerConnection | null;
};

export function usePeerConnection(
  localStream: MediaStream | null,
  peerConnectionRef: PeerConnectionRef,
  onIceCandidate: (candidate: RTCIceCandidate) => void,
) {
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (!localStream) return;

    const peerConnection = createPeerConnection(localStream, onIceCandidate);

    peerConnectionRef.current = peerConnection;

    peerConnection.ontrack = (event) => {
      console.log("Remote track received:", event.streams[0]);

      if (event.streams[0]) {
        setRemoteStream(event.streams[0]);
      }
    };

    return () => {
      peerConnection.close();
      peerConnectionRef.current = null;
      setRemoteStream(null);
    };
  }, [localStream, peerConnectionRef, onIceCandidate]);

  return remoteStream;
}
