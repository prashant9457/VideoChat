export type SessionDescription = { type: "offer" | "answer"; sdp: string };

export type ClientMessage =
  | { type: "CREATE_ROOM"; roomId: string }
  | { type: "JOIN_ROOM"; roomId: string }
  | { type: "OFFER"; offer: SessionDescription }
  | { type: "ICE_CANDIDATE"; candidate: IceCandidate }
  | { type: "ANSWER"; answer: SessionDescription };

export type ServerMessage =
  | { type: "ROOM_CREATED"; roomId: string }
  | { type: "ROOM_JOINED"; roomId: string }
  | { type: "PEER_JOINED" }
  | { type: "OFFER"; offer: SessionDescription }
  | { type: "ANSWER"; answer: SessionDescription }
  | { type: "ICE_CANDIDATE"; candidate: IceCandidate }
  | { type: "ERROR"; message: string };

export type IceCandidate = {
  candidate: string;
  sdpMid: string | null;
  sdpMLineIndex: number | null;
  usernameFragment?: string | null;
};