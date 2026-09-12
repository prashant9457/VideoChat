import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import MediaControls from "./MediaControls";
import { requestNewRoom } from "../services/signaling";

export default function LandingPage() {
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [previewStream, setPreviewStream] = useState<MediaStream | null>(null);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [isMicrophoneEnabled, setIsMicrophoneEnabled] = useState(false);
  const [isCreatingMeeting, setIsCreatingMeeting] = useState(false);
  const [meetingError, setMeetingError] = useState<string | null>(null);
  const cameraRef = useRef<HTMLVideoElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let stream: MediaStream | null = null;
    let isActive = true;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        if (!isActive) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        if (cameraRef.current) {
          cameraRef.current.srcObject = stream;
        }
        setPreviewStream(stream);
        setIsCameraEnabled(stream.getVideoTracks().some((track) => track.enabled));
        setCameraError(null);
      } catch (error) {
        if (!isActive) return;

        if (error instanceof DOMException && error.name === "NotAllowedError") {
          setCameraError("Camera access was denied.");
        } else {
          setCameraError("Camera preview is unavailable.");
        }
      }
    }

    startCamera();

    return () => {
      isActive = false;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  function toggleCamera() {
    const videoTracks = previewStream?.getVideoTracks() ?? [];
    if (videoTracks.length === 0) return;

    const nextEnabled = !videoTracks.some((track) => track.enabled);
    videoTracks.forEach((track) => {
      track.enabled = nextEnabled;
    });
    setIsCameraEnabled(nextEnabled);
  }

  async function toggleMicrophone() {
    if (!previewStream) return;

    const audioTracks = previewStream.getAudioTracks();
    if (audioTracks.length === 0) {
      try {
        const microphoneStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        microphoneStream.getAudioTracks().forEach((track) => {
          previewStream.addTrack(track);
        });
        setIsMicrophoneEnabled(true);
        setCameraError(null);
      } catch {
        setCameraError("Microphone access was denied or unavailable.");
      }
      return;
    }

    const nextEnabled = !audioTracks.some((track) => track.enabled);
    audioTracks.forEach((track) => {
      track.enabled = nextEnabled;
    });
    setIsMicrophoneEnabled(nextEnabled);
  }

  async function handleCreateMeeting() {
    if (isCreatingMeeting) return;

    try {
      setIsCreatingMeeting(true);
      setMeetingError(null);
      const meetingId = await requestNewRoom();
      const search = new URLSearchParams({ name: name.trim() });

      navigate(`/meeting/${meetingId}?${search.toString()}`);
    } catch (error) {
      setMeetingError(
        error instanceof Error ? error.message : "Unable to create a meeting.",
      );
    } finally {
      setIsCreatingMeeting(false);
    }
  }

  return (
    <main className="landing-page">
      <h1>VideoChat</h1>
      <div className="landing-content">
        <section className="camera-preview" aria-label="Camera preview">
          <video
            ref={cameraRef}
            className="camera-preview-video"
            autoPlay
            muted
            playsInline
          />
          <span className="camera-preview-label">{name || "you"}</span>
          {cameraError && <span className="camera-preview-error">{cameraError}</span>}
          <MediaControls
            isCameraEnabled={isCameraEnabled}
            isMicrophoneEnabled={isMicrophoneEnabled}
            onToggleCamera={toggleCamera}
            onToggleMicrophone={toggleMicrophone}
          />
        </section>

        <div className="landing-actions">
          <label className="landing-field">
            <input
              className="landing-input"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>

          <div className="landing-button-group">
            <button
              className="button button-primary"
              type="button"
              onClick={handleCreateMeeting}
              disabled={isCreatingMeeting}
            >
              {isCreatingMeeting ? "Creating meeting…" : "Start a new meeting"}
            </button>
          </div>

          {meetingError && <p className="landing-error">{meetingError}</p>}

          <span>- OR -</span>

          <div
            className={`join-meeting-control ${roomCode.trim() ? "has-room-code" : ""}`}
          >
            <input
              className="landing-input"
              type="text"
              placeholder="Enter meeting code"
              value={roomCode}
              onChange={(event) => setRoomCode(event.target.value)}
              aria-label="Meeting code"
            />
            {roomCode.trim() && (
              <button className="button join-meeting-button">Join</button>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
