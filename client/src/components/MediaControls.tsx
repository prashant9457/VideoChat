import { Mic, MicOff, Video, VideoOff } from "lucide-react";

interface MediaControlsProps {
  isCameraEnabled: boolean;
  isMicrophoneEnabled: boolean;
  onToggleCamera: () => void;
  onToggleMicrophone: () => void;
}

export default function MediaControls({
  isCameraEnabled,
  isMicrophoneEnabled,
  onToggleCamera,
  onToggleMicrophone,
}: MediaControlsProps) {
  return (
    <div className="media-controls">
      <button
        className={`media-control-button ${isCameraEnabled ? "" : "is-off"}`}
        type="button"
        onClick={onToggleCamera}
        aria-label={isCameraEnabled ? "Turn camera off" : "Turn camera on"}
        title={isCameraEnabled ? "Turn camera off" : "Turn camera on"}
      >
        {isCameraEnabled ? <Video size={18} /> : <VideoOff size={18} />}
      </button>
      <button
        className={`media-control-button ${isMicrophoneEnabled ? "" : "is-off"}`}
        type="button"
        onClick={onToggleMicrophone}
        aria-label={isMicrophoneEnabled ? "Mute microphone" : "Unmute microphone"}
        title={isMicrophoneEnabled ? "Mute microphone" : "Unmute microphone"}
      >
        {isMicrophoneEnabled ? <Mic size={18} /> : <MicOff size={18} />}
      </button>
    </div>
  );
}
