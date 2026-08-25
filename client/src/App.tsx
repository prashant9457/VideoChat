import { useEffect } from "react";
import { connectToSignalingServer } from "./services/signaling";
import { useMediaStream } from "./hooks/useMediaStream";
import VideoPlayer from "./components/VideoPlayer";

export default function App() {
  const localStream = useMediaStream();

  useEffect(() => {
    const socket = connectToSignalingServer();

    return () => {
      socket.close();
    }
  }, []);

  return (
    <div> 
      <h1>VideoChat</h1>
      <VideoPlayer stream={localStream} muted/>
    </div>
  );
}