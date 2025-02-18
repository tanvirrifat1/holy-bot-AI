"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRoomId = void 0;
const room_model_1 = require("../room/room.model");
const generateRoomId = () => __awaiter(void 0, void 0, void 0, function* () {
    let currentId = '00000001';
    const lastRoom = yield room_model_1.Room.findOne().sort({ createdAt: -1 }).lean();
    if (lastRoom && lastRoom.roomName) {
        const roomParts = lastRoom.roomName.split('-');
        if (roomParts.length === 2 && !isNaN(Number(roomParts[1]))) {
            const lastRoomNumber = roomParts[1];
            currentId = (Number(lastRoomNumber) + 1).toString().padStart(8, '0');
        }
        else {
            console.warn('Invalid roomName format:', lastRoom.roomName);
        }
    }
    // Generate the new room ID
    const newRoomId = `room-${currentId}`;
    return newRoomId;
});
exports.generateRoomId = generateRoomId;
