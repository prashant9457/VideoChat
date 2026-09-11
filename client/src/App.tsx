import { Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react";
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
    toggleCamera,
    isMicrophoneEnabled,
    isCameraEnabled,
    mediaError,
  } = useMediaStream();

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  const {
    createRoom,
    joinRoom,
    sendIceCandidate,
    leaveRoom,
    roomId,
    peerConnectionKey,
    errorMessage,
  } = useSignaling(peerConnectionRef);

  const remoteStream = usePeerConnection(
    localStream,
    peerConnectionRef,
    sendIceCandidate,
    peerConnectionKey,
  );

  const alertMessages = [mediaError, errorMessage].filter(
    (message): message is string => Boolean(message),
  );

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>VideoChat</h1>
      </header>

      {alertMessages.length > 0 && (
        <div
          className="floating-error-window"
          role="alert"
          aria-live="assertive"
        >
          <div className="floating-error-title">Error</div>
          <ul className="floating-error-list">
            {alertMessages.map((message, index) => (
              <li key={`${message}-${index}`}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      <main className="video-stage">
        <div
          className={`video-scene ${remoteStream ? "has-remote" : "waiting-for-peer"}`}
        >
          {remoteStream ? (
            <VideoPlayer
              stream={remoteStream}
              className="video-card remote-video"
            />
          ) : (
            <div className="remote-video-placeholder">
              <span>Waiting for peer</span>
            </div>
          )}

          {localStream && (
            <div
              className={`local-video-wrap ${isCameraEnabled ? "camera-on" : "camera-off"}`}
            >
              {isCameraEnabled ? (
                <VideoPlayer
                  stream={localStream}
                  muted
                  className="video-card local-video"
                />
              ) : (
                <div className="video-placeholder">
                  <VideoOff size={28} />
                  <span>Camera off</span>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <BottomDock>
        <div className="room-controls-section">
          <RoomControls
            roomId={roomId}
            onCreateRoom={createRoom}
            onJoinRoom={joinRoom}
          />
        </div>

        <div className="call-controls-section">
          <button
            className="icon-button"
            onClick={toggleCamera}
            aria-label={isCameraEnabled ? "Turn camera off" : "Turn camera on"}
            title={isCameraEnabled ? "Turn camera off" : "Turn camera on"}
          >
            {isCameraEnabled ? <Video size={20} /> : <VideoOff size={20} />}
          </button>

          <button
            className="icon-button"
            onClick={toggleMicrophone}
            aria-label={
              isMicrophoneEnabled ? "Mute microphone" : "Unmute microphone"
            }
            title={
              isMicrophoneEnabled ? "Mute microphone" : "Unmute microphone"
            }
          >
            {isMicrophoneEnabled ? <Mic size={20} /> : <MicOff size={20} />}
          </button>

          <button
            className="icon-button icon-button-danger"
            onClick={leaveRoom}
            aria-label="Leave room"
            title="Leave room"
          >
            <PhoneOff size={20} />
          </button>
        </div>
      </BottomDock>
    </div>
  );
}
