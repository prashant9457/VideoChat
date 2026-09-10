import { Mic, MicOff } from "lucide-react";
import { useRef } from "react";
import BottomDock from "./components/BottomDock";
import RoomControls from "./components/RoomControls";
import VideoPlayer from "./components/VideoPlayer";
import { useMediaStream } from "./hooks/useMediaStream";
import { usePeerConnection } from "./hooks/usePeerConnection";
import { useSignaling } from "./hooks/useSignaling";

export default function App() {
  const {
    stream: localStream,
    toggleMicrophone,
    isMicrophoneEnabled,
  } = useMediaStream();

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  const { createRoom, joinRoom, sendIceCandidate } =
    useSignaling(peerConnectionRef);

  const remoteStream = usePeerConnection(
    localStream,
    peerConnectionRef,
    sendIceCandidate,
  );

  return (
    <div>
      <h1>VideoChat</h1>

      <BottomDock>
        <div className="room-controls-section">
          <RoomControls onCreateRoom={createRoom} onJoinRoom={joinRoom} />
        </div>

        <div className="call-controls-section">{/* UI only for now */}</div>
      </BottomDock>

      <VideoPlayer stream={localStream} muted />

      <VideoPlayer stream={remoteStream} />

      <button className="icon-button" onClick={toggleMicrophone}>
        {isMicrophoneEnabled ? <Mic size={20} /> : <MicOff size={20} />}
      </button>
    </div>
  );
}
