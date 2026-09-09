import RoomControls from "./components/RoomControls";
import VideoPlayer from "./components/VideoPlayer";
import { useMediaStream } from "./hooks/useMediaStream";
import { usePeerConnection } from "./hooks/usePeerConnection";
import { useSignaling } from "./hooks/useSignaling";

export default function App() {
  const localStream = useMediaStream();
  const peerConnectionRef = usePeerConnection(localStream);
  const { createRoom, joinRoom } = useSignaling(peerConnectionRef);

  usePeerConnection(localStream);

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
    </div>
  );
}