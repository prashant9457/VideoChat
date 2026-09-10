import {
  createOffer,
  createAnswer,
} from "./webrtc";

type PeerConnectionRef = {
  current: RTCPeerConnection | null;
};

type PendingIceCandidatesRef = {
  current: RTCIceCandidateInit[];
};

type SignalingMessage =
  | { type: "PEER_JOINED" }
  | { type: "OFFER"; offer: RTCSessionDescriptionInit }
  | { type: "ANSWER"; answer: RTCSessionDescriptionInit }
  | { type: "ICE_CANDIDATE"; candidate: RTCIceCandidateInit };

export async function handleSignalingMessage(
  socket: WebSocket,
  message: SignalingMessage,
  peerConnectionRef: PeerConnectionRef,
  pendingIceCandidates: PendingIceCandidatesRef,
) {
  console.log("Received from server:", message);

  // Existing peer creates the OFFER
  if (message.type === "PEER_JOINED") {
    const peerConnection = peerConnectionRef.current;

    if (!peerConnection) {
      console.error("Peer connection not ready");
      return;
    }

    const offer = await createOffer(peerConnection);

    socket.send(
      JSON.stringify({
        type: "OFFER",
        offer,
      }),
    );

    console.log("OFFER sent to server");
  }

  // New peer receives the OFFER
  if (message.type === "OFFER") {
    const peerConnection = peerConnectionRef.current;

    if (!peerConnection) {
      console.error("Peer connection not ready");
      return;
    }

    console.log("Received OFFER from peer:", message.offer);

    await peerConnection.setRemoteDescription(
      message.offer,
    );

    console.log("Remote description set");

    // Add ICE candidates that arrived before the OFFER
    for (const candidate of pendingIceCandidates.current) {
      await peerConnection.addIceCandidate(candidate);
    }

    pendingIceCandidates.current = [];

    console.log("Queued ICE candidates added");

    const answer = await createAnswer(peerConnection);

    socket.send(
      JSON.stringify({
        type: "ANSWER",
        answer,
      }),
    );

    console.log("ANSWER sent to server");
  }

  // Existing peer receives the ANSWER
  if (message.type === "ANSWER") {
    const peerConnection = peerConnectionRef.current;

    if (!peerConnection) {
      console.error("Peer connection not ready");
      return;
    }

    console.log("Received ANSWER from peer:", message.answer);

    await peerConnection.setRemoteDescription(
      message.answer,
    );

    console.log("Remote description set with ANSWER");
  }

  // Receive ICE candidate from the other peer
  if (message.type === "ICE_CANDIDATE") {
    const peerConnection = peerConnectionRef.current;

    if (!peerConnection) {
      console.error("Peer connection not ready");
      return;
    }

    console.log(
      "Received ICE candidate:",
      message.candidate,
    );

    // ICE can arrive before the remote description
    if (!peerConnection.remoteDescription) {
      console.log(
        "Remote description not ready. Queuing ICE candidate.",
      );

      pendingIceCandidates.current.push(
        message.candidate,
      );

      return;
    }

    await peerConnection.addIceCandidate(
      message.candidate,
    );

    console.log("ICE candidate added");
  }
}