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

  function handleCreateRoom() {
    onCreateRoom();
  }

  function handleJoinRoom() {
    if (!inputRoomId.trim()) return;

    onJoinRoom(inputRoomId.trim());
  }

  return (
    <div>
      {roomId && (
        <div>
          <span>Room: </span>
          <strong>{roomId}</strong>
        </div>
      )}

      <input
        className="button"
        type="text"
        placeholder="Enter room code"
        value={inputRoomId}
        onChange={(event) => setInputRoomId(event.target.value)}
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