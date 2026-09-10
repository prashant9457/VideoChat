const SIGNALING_SERVER_URL = "ws://localhost:3000";

export function connectToSignalingServer() {
  const socket = new WebSocket(SIGNALING_SERVER_URL);

  socket.onopen = () => {
    console.log("Connected to signaling server");
  };

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    console.log("Received from server:", message);
  };

  socket.onclose = () => {
    console.log("Disconnected from signaling server");
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  return socket;
}

export function createRoom(
  socket: WebSocket
) {
  socket.send(
    JSON.stringify({
      type: "CREATE_ROOM",
    }),
  );
}

export function joinRoom(
  socket: WebSocket,
  roomId: string,
) {
  socket.send(
    JSON.stringify({
      type: "JOIN_ROOM",
      roomId,
    }),
  );
}

export function leaveRoom(socket: WebSocket) {
  socket.send(
    JSON.stringify({
      type: "LEAVE_ROOM",
    }),
  );
}