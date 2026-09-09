import RoomControls from "./components/RoomControls";
import VideoPlayer from "./components/VideoPlayer";
import { useMediaStream } from "./hooks/useMediaStream";
import { usePeerConnection } from "./hooks/usePeerConnection";
import { useSignaling } from "./hooks/useSignaling";
import { useRef } from "react";

export default function App() {
  const localStream = useMediaStream();

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  const { createRoom, joinRoom, sendIceCandidate } = useSignaling(peerConnectionRef);

  const remoteStream = usePeerConnection( localStream, peerConnectionRef, sendIceCandidate);

  return (
    <div>
      <h1>VideoChat</h1>

      <RoomControls
        onCreateRoom={createRoom}
        onJoinRoom={joinRoom}
      />

      <VideoPlayer
        stream={localStream}
        muted
      />

      <VideoPlayer
        stream={remoteStream}
      />
  </div>
  );
}