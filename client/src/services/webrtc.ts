export function createPeerConnection(
  localStream: MediaStream,
  onIceCandidate: (candidate: RTCIceCandidate) => void,
) {
  console.log("Creating RTCPeerConnection...");

  const peerConnection = new RTCPeerConnection();

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
    console.log("Added local track:", track.kind);
  });

  peerConnection.onconnectionstatechange = () => {
    console.log("Connection state:", peerConnection.connectionState);
  };

  peerConnection.oniceconnectionstatechange = () => {
    console.log("ICE connection state:", peerConnection.iceConnectionState);
  };

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      console.log("ICE candidate:", event.candidate);
      onIceCandidate(event.candidate);
    }
  };

  peerConnection.ontrack = (event) => {
    console.log("Remote track received:", event.streams[0]);
  };

  return peerConnection;
}

export async function createOffer(peerConnection: RTCPeerConnection) {
  console.log("Creating SDP offer...");
  const offer = await peerConnection.createOffer();

  console.log("Created Offer: ", offer);
  await peerConnection.setLocalDescription(offer);

  console.log("Local description set: ", peerConnection.localDescription);

  return offer;
}

export async function createAnswer(peerConnection: RTCPeerConnection) {
  console.log("Creating SDP answer...");

  const answer = await peerConnection.createAnswer();
  console.log("Create answer: ", answer);

  await peerConnection.setLocalDescription(answer);

  console.log("Local description set: ", peerConnection.localDescription);

  return answer;
}
