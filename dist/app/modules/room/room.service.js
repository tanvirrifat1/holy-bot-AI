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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomService = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const room_model_1 = require("./room.model");
const mongoose_1 = require("mongoose");
const request_model_1 = require("../request/request.model");
const user_model_1 = require("../user/user.model");
const getQuestionAndAns = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    const testResult = yield request_model_1.Request.find({
        room: new mongoose_1.Types.ObjectId(roomId),
    });
    return testResult;
});
const getAllRooms = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistUser = yield user_model_1.User.findById(userId);
    if (!isExistUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found!');
    }
    const { page, limit, searchTerm } = query, filterData = __rest(query, ["page", "limit", "searchTerm"]);
    const anyConditions = [];
    anyConditions.push({ user: userId });
    if (searchTerm) {
        anyConditions.push({
            $or: [{ question: { $regex: searchTerm, $options: 'i' } }],
        });
    }
    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.entries(filterData).map(([field, value]) => ({ [field]: value }));
        anyConditions.push({ $and: filterConditions });
    }
    // Filter for requests created more than 24 hours ago
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    anyConditions.push({ createdAt: { $lt: oneDayAgo } });
    const whereConditions = anyConditions.length > 0 ? { $and: anyConditions } : {};
    // Pagination setup
    const pages = parseInt(page) || 1;
    const size = parseInt(limit) || 10;
    const skip = (pages - 1) * size;
    const result = yield room_model_1.Room.find(whereConditions)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(size)
        .lean();
    const count = yield room_model_1.Room.countDocuments(whereConditions);
    return {
        result,
        meta: {
            page: pages,
            total: count,
        },
    };
});
const getRecentRooms = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistUser = yield user_model_1.User.findById(userId);
    if (!isExistUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found!');
    }
    const { page, limit, searchTerm } = query, filterData = __rest(query, ["page", "limit", "searchTerm"]);
    const anyConditions = [];
    anyConditions.push({ user: userId });
    if (searchTerm) {
        anyConditions.push({
            $or: [{ question: { $regex: searchTerm, $options: 'i' } }],
        });
    }
    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.entries(filterData).map(([field, value]) => ({ [field]: value }));
        anyConditions.push({ $and: filterConditions });
    }
    // Filter for requests created more than 24 hours ago
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    anyConditions.push({ createdAt: { $gte: oneDayAgo } });
    const whereConditions = anyConditions.length > 0 ? { $and: anyConditions } : {};
    // Pagination setup
    const pages = parseInt(page) || 1;
    const size = parseInt(limit) || 10;
    const skip = (pages - 1) * size;
    const result = yield room_model_1.Room.find(whereConditions)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(size)
        .lean();
    const count = yield room_model_1.Room.countDocuments(whereConditions);
    return {
        result,
        meta: {
            page: pages,
            total: count,
        },
    };
});
const deleteRoom = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    const isRoom = yield room_model_1.Room.findByIdAndDelete(roomId);
    if (!isRoom) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Room not found!');
    }
    yield request_model_1.Request.deleteMany({ room: roomId });
    return isRoom;
});
exports.RoomService = {
    getAllRooms,
    getQuestionAndAns,
    getRecentRooms,
    deleteRoom,
};
