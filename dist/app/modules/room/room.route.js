"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const room_controller_1 = require("./room.controller");
const router = express_1.default.Router();
router.get('/get-all-rooms', (0, auth_1.default)(user_1.USER_ROLES.USER), room_controller_1.RoomController.getAllRooms);
router.get('/get-recent-rooms', (0, auth_1.default)(user_1.USER_ROLES.USER), room_controller_1.RoomController.getRecentRooms);
router.get('/get-all-ans/:id', (0, auth_1.default)(user_1.USER_ROLES.USER), room_controller_1.RoomController.getQuestionAndAns);
router.delete('/delete/:id', (0, auth_1.default)(user_1.USER_ROLES.USER), room_controller_1.RoomController.deleteRoom);
exports.RoomsRoutes = router;
