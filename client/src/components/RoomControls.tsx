import { DoorOpen, LogIn } from "lucide-react";
import { useState } from "react";

interface RoomControlsProps {
  roomId: string | null;
  onCreateRoom: () => void;
  onJoinRoom: (roomId: string) => void;
}

export default function RoomControls({
  roomId,
  onCreateRoom,
  onJoinRoom,
}: RoomControlsProps) {
  const [inputRoomId, setInputRoomId] = useState("");

  function handleJoinRoom() {
    if (!inputRoomId.trim()) return;

    onJoinRoom(inputRoomId.trim());
  }

  return (
    <div className="room-controls">
      {roomId && (
        <div className="room-pill">
          <span className="room-label">Room</span>
          <strong>{roomId}</strong>
        </div>
      )}

      <div className="room-input-wrapper">
        <input
          type="text"
          placeholder="Enter room code"
          value={inputRoomId}
          onChange={(event) => setInputRoomId(event.target.value)}
        />
      </div>

      <button className="button" onClick={onCreateRoom}>
        <DoorOpen size={18} />
        Create Room
      </button>

      <button className="button button-primary" onClick={handleJoinRoom}>
        <LogIn size={18} />
        Join Room
      </button>
    </div>
  );
}
