import { DoorOpen, Plus } from "lucide-react";
import { useState } from "react";

type RoomControlsProps = {
  onCreateRoom: (roomId: string) => void;
  onJoinRoom: (roomId: string) => void;
};

export default function RoomControls({
  onCreateRoom,
  onJoinRoom,
}: RoomControlsProps) {
  const [roomId, setRoomId] = useState("");

  function handleJoin() {
    if (!roomId.trim()) return;

    onJoinRoom(roomId.trim());
  }

  function handleCreate() {
    if (!roomId.trim()) return;

    onCreateRoom(roomId.trim());
  }

  return (
    <div className="room-controls">
      <div className="room-input-wrapper">
        <span className="room-label">Room</span>

        <input
          type="text"
          value={roomId}
          onChange={(event) => setRoomId(event.target.value)}
          placeholder="Enter room ID"
        />
      </div>

      <button className="button button-primary" onClick={handleJoin}>
        <DoorOpen size={18} />
        Join
      </button>

      <button className="button" onClick={handleCreate}>
        <Plus size={18} />
        Create
      </button>
    </div>
  );
}
