import { Room } from '../room/room.model';

export const generateRoomId = async () => {
  let currentId = '00000'; // Default value to start the room numbering
  const lastRoom = await Room.findOne().sort({ createdAt: -1 }).lean(); // Get the last created room

  if (lastRoom && lastRoom.roomName) {
    // Extract the number part from the last room's name (e.g., "room-001" -> 001)
    const lastRoomNumber = lastRoom.roomName.split('-')[1];
    currentId = (Number(lastRoomNumber) + 1).toString().padStart(5, '0');
  }

  // Generate the new room ID
  const newRoomId = `room-${currentId}`;
  return newRoomId;
};
