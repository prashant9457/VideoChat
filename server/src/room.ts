import { WebSocket } from "ws";

type Room = {
  clients: Set<WebSocket>;
};

const rooms = new Map<string, Room>();

export function createRoom(roomId: string, socket: WebSocket) {
  if (rooms.has(roomId)) {
    return false;
  }
  rooms.set(roomId, {
    clients: new Set([socket]),
  });
  return true;
}

export function joinRoom(roomId: string, socket: WebSocket) {
  const room = rooms.get(roomId);

  if (!room) return false;

  if (room.clients.size >= 2) return false;
  room.clients.add(socket);

  return true;
}

export function removeClient(socket: WebSocket) {
  for (const [roomId, room] of rooms) {
    if (room.clients.has(socket)) {
      room.clients.delete(socket);
      if (room.clients.size == 0) rooms.delete(roomId);
    }
    return roomId;
  }
  return null;
}

export function getRoomClients(roomId: string) {
  return rooms.get(roomId)?.clients;
}
