const SIGNALING_SERVER_URL = "ws://localhost:3000"

export function connectToSignalingServer() {
    const socket = new WebSocket(SIGNALING_SERVER_URL);

    socket.onopen = () => {
        console.log("connected to signaling server");
    };

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log("recieved from server : ", message);
    };

    socket.onclose = () => {
        console.log("Disconnected from signaling server");
    };

    socket.onerror = (error) => {
     console.error("WebSocket error:", error);
    };

    return socket;

}