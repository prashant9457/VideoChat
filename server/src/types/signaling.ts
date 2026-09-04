export type ClientMessage =
  | {
      type: "CREATE_ROOM";
      roomId: string;
    }
  | {
      type: "JOIN_ROOM";
      roomId: string;
    };

export type ServerMessage =
  | {
      type: "ROOM_CREATED";
      roomId: string;
    }
  | {
      type: "ROOM_JOINED";
      roomId: string;
    }
  | {
      type: "PEER_JOINED";
    }
  | {
      type: "ERROR";
      message: string;
    };
