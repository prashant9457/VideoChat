const SIGNALING_SERVER_URL =
  import.meta.env.VITE_SIGNALING_SERVER_URL || "ws://localhost:3000";

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

export function createRoom(socket: WebSocket) {
  socket.send(
    JSON.stringify({
      type: "CREATE_ROOM",
    }),
  );
}

export function joinRoom(socket: WebSocket, roomId: string) {
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

export function requestNewRoom(): Promise<string> {
  return new Promise((resolve, reject) => {
    const socket = connectToSignalingServer();

    socket.onopen = () => {
      createRoom(socket);
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data) as {
        type: string;
        roomId?: string;
        message?: string;
      };

      if (message.type === "ROOM_CREATED" && message.roomId) {
        socket.close();
        resolve(message.roomId);
      }

      if (message.type === "ERROR") {
        socket.close();
        reject(new Error(message.message || "Unable to create a meeting."));
      }
    };

    socket.onerror = () => {
      reject(new Error("Unable to reach the signaling server."));
    };
  });
}
