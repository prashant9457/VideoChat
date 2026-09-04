import { useState } from "react";

interface RoomControlsProps {
  onCreateRoom: (roomId: string) => void;
  onJoinRoom: (roomId: string) => void;
}

export default function RoomControls({
  onCreateRoom,
  onJoinRoom,
}: RoomControlsProps) {
  const [roomId, setRoomId] = useState("");

  function handleCreateRoom() {
    if (!roomId.trim()) return;

    onCreateRoom(roomId.trim());
  }

  function handleJoinRoom() {
    if (!roomId.trim()) return;

    onJoinRoom(roomId.trim());
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Enter room code"
        value={roomId}
        onChange={(event) => setRoomId(event.target.value)}
      />

      <button onClick={handleCreateRoom}>
        Create Room
      </button>

      <button onClick={handleJoinRoom}>
        Join Room
      </button>
    </div>
  );
}