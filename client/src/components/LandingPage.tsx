import { useEffect, useRef, useState } from "react";

export default function LandingPage() {
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const cameraRef = useRef<HTMLVideoElement | null>(null);

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
            <button className="button button-primary">Start a new meeting</button>
          </div>

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
