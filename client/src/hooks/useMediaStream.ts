import { useEffect, useState } from "react";

export function useMediaStream() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [isMicrophoneEnabled, setIsMicrophoneEnabled] = useState(true);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);

  useEffect(() => {
    let mediaStream: MediaStream;
    async function getMedia() {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        setStream(mediaStream);
        setMediaError(null);
      } catch (error) {
        console.error("failed to access camera/microphone ", error);

        if (error instanceof DOMException && error.name === "NotAllowedError") {
          setMediaError(
            "Camera and microphone access was denied. Please allow access in your browser settings.",
          );
        } else if (
          error instanceof DOMException &&
          error.name === "NotFoundError"
        ) {
          setMediaError("No camera or microphone was found on this device.");
        } else {
          setMediaError("Unable to access the camera or microphone.");
        }
      }
    }
    getMedia();

    return () => {
      mediaStream?.getTracks().forEach((track) => {
        track.stop();
      });
    };
  }, []);

  function toggleMicrophone() {
    if (!stream) return;

    const audioTracks = stream.getAudioTracks();

    audioTracks.forEach((track) => {
      track.enabled = !track.enabled;
      setIsMicrophoneEnabled(track.enabled);
    });
  }

  function toggleCamera() {
    if (!stream) return;

    const videoTracks = stream.getVideoTracks();

    videoTracks.forEach((track) => {
      track.enabled = !track.enabled;
      setIsCameraEnabled(track.enabled);
    });
  }

  return {
    stream,
    toggleMicrophone,
    toggleCamera,
    isMicrophoneEnabled,
    isCameraEnabled,
    mediaError,
  };
}
