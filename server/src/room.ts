import { WebSocket } from "ws";

type Room = {
  clients: Set<WebSocket>;
};

const rooms = new Map<string, Room>();
const clientRooms = new Map<WebSocket, string>();

export function createRoom(roomId: string, socket: WebSocket) {
  if (rooms.has(roomId)) {
    return false;
  }
  rooms.set(roomId, {
    clients: new Set([socket]),
  });
  clientRooms.set(socket, roomId);
  return true;
}

export function joinRoom(roomId: string, socket: WebSocket) {
  const room = rooms.get(roomId);

  if (!room) return null;

  if (room.clients.size >= 2) return null;
  room.clients.add(socket);
  clientRooms.set(socket, roomId);

  return room;
}

export function removeClient(socket: WebSocket) {
  const roomId = clientRooms.get(socket);

  if (!roomId) {
    return null;
  }

  const room = rooms.get(roomId);

  if (room) {
    room.clients.delete(socket);

    if (room.clients.size === 0) {
      rooms.delete(roomId);
    }
  }

  clientRooms.delete(socket);

  return roomId;
}

export function getRoomClients(roomId: string) {
  return rooms.get(roomId)?.clients;
}

export function getClientRoom(socket: WebSocket) {
  return clientRooms.get(socket);
}