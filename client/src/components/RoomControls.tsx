import { useState } from "react";

interface RoomControlsProps {
  onCreateRoom: () => void;
  onJoinRoom: (roomId: string) => void;
}

export default function RoomControls({
  onCreateRoom,
  onJoinRoom,
}: RoomControlsProps) {
  const [roomId, setRoomId] = useState("");

  function handleCreateRoom() {
    onCreateRoom();
  }

  function handleJoinRoom() {
    if (!roomId.trim()) return;

    onJoinRoom(roomId.trim());
  }

  return (
    <div>
      <input
        className="button"
        type="text"
        placeholder="Enter room code"
        value={roomId}
        onChange={(event) => setRoomId(event.target.value)}
      />

      <button className="button" onClick={handleCreateRoom}>
        Create Room
      </button>

      <button className="button" onClick={handleJoinRoom}>
        Join Room
      </button>
    </div>
  );
}