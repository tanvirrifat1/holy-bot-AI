import { Room } from '../room/room.model';

export const generateRoomId = async () => {
  let currentId = '00000001'; // Default value to start the room numbering
  const lastRoom = await Room.findOne().sort({ createdAt: -1 }).lean(); // Get the last created room

  if (lastRoom && lastRoom.roomName) {
    // Extract the number part from the last room's name (e.g., "room-001" -> 001)
    const lastRoomNumber = lastRoom.roomName.split('-')[1];
    currentId = (Number(lastRoomNumber) + 1).toString().padStart(8, '0');
  }

  // Generate the new room ID
  const newRoomId = `room-${currentId}`;

  return newRoomId;
};

// export const generateRoomId = async () => {
//   let currentId = '00000001'; // Default value to start the room numbering
//   const lastRoom = await Room.findOne().sort({ createdAt: -1 }).lean(); // Get the last created room

//   if (lastRoom && lastRoom.roomName) {
//     const roomParts = lastRoom.roomName.split('-');
//     if (roomParts.length === 2 && !isNaN(Number(roomParts[1]))) {
//       const lastRoomNumber = roomParts[1];
//       currentId = (Number(lastRoomNumber) + 1).toString().padStart(8, '0');
//     } else {
//       console.warn('Invalid roomName format:', lastRoom.roomName);
//     }
//   }

//   // Generate the new room ID
//   const newRoomId = `room-${currentId}`;
//   return newRoomId;
// };
