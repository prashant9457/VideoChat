import { WebSocket } from "ws";

type Room = {
  clients: Set<WebSocket>;
};

const rooms = new Map<string, Room>();
const clientRooms = new Map<WebSocket, string>();
const emptyRoomTimers = new Map<string, NodeJS.Timeout>();
const EMPTY_ROOM_TTL_MS = 5 * 60 * 1000;

function clearEmptyRoomTimer(roomId: string) {
  const timer = emptyRoomTimers.get(roomId);
  if (timer) {
    clearTimeout(timer);
    emptyRoomTimers.delete(roomId);
  }
}

function scheduleEmptyRoomRemoval(roomId: string) {
  clearEmptyRoomTimer(roomId);
  const timer = setTimeout(() => {
    const room = rooms.get(roomId);
    if (room?.clients.size === 0) {
      rooms.delete(roomId);
    }
    emptyRoomTimers.delete(roomId);
  }, EMPTY_ROOM_TTL_MS);
  emptyRoomTimers.set(roomId, timer);
}

export function createRoom(roomId: string, socket?: WebSocket) {
  if (rooms.has(roomId)) {
    return false;
  }
  rooms.set(roomId, {
    clients: new Set(socket ? [socket] : []),
  });
  if (socket) {
    clientRooms.set(socket, roomId);
  }
  return true;
}

export function joinRoom(roomId: string, socket: WebSocket) {
  const room = rooms.get(roomId);

  if (!room) return null;

  if (room.clients.size >= 2) return null;
  clearEmptyRoomTimer(roomId);
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
      scheduleEmptyRoomRemoval(roomId);
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
