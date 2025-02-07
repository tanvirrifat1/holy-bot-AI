import { Room } from '../room/room.model';

export const generateRoomId = async () => {
  let currentId = '00000001';
  const lastRoom = await Room.findOne().sort({ createdAt: -1 }).lean();

  if (lastRoom && lastRoom.roomName) {
    const roomParts = lastRoom.roomName.split('-');
    if (roomParts.length === 2 && !isNaN(Number(roomParts[1]))) {
      const lastRoomNumber = roomParts[1];
      currentId = (Number(lastRoomNumber) + 1).toString().padStart(8, '0');
    } else {
      console.warn('Invalid roomName format:', lastRoom.roomName);
    }
  }

  // Generate the new room ID
  const newRoomId = `room-${currentId}`;
  return newRoomId;
};
