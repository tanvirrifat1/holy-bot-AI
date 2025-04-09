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
exports.RequestService = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const request_model_1 = require("./request.model");
const room_model_1 = require("../room/room.model");
const moment_1 = __importDefault(require("moment"));
const user_model_1 = require("../user/user.model");
const createRequest = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    let roomId;
    let room;
    if (payload.room) {
        room = yield room_model_1.Room.findOne({ roomName: payload.room });
        if (room) {
            roomId = room.roomName;
        }
        else {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Room not found!');
        }
    }
    else if (!payload.createRoom) {
        room = yield room_model_1.Room.findOne({ user: payload.user }).sort({ createdAt: -1 });
        if (room) {
            roomId = room.roomName;
        }
    }
    if (!room || payload.createRoom) {
        const formattedDate = (0, moment_1.default)().format('HH:mm:ss');
        room = yield room_model_1.Room.create({
            user: payload.user,
            roomName: `${payload.path === '' ? payload.question : payload.fileQuestion}-${formattedDate}`,
            path: payload.path,
        });
    }
    const result = yield request_model_1.Request.create(Object.assign(Object.assign({}, payload), { room: room._id }));
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Request couldn't be created!");
    }
    return result;
});
const getAllRequests = (roomId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistRoom = yield room_model_1.Room.findById(roomId);
    if (!isExistRoom) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Room not found!');
    }
    const { page, limit, searchTerm } = query, filterData = __rest(query, ["page", "limit", "searchTerm"]);
    const anyConditions = [];
    anyConditions.push({ room: roomId });
    if (searchTerm) {
        anyConditions.push({
            $or: [{ question: { $regex: searchTerm, $options: 'i' } }],
        });
    }
    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.entries(filterData).map(([field, value]) => ({ [field]: value }));
        anyConditions.push({ $and: filterConditions });
    }
    const whereConditions = anyConditions.length > 0 ? { $and: anyConditions } : {};
    // Pagination setup
    const pages = parseInt(page) || 1;
    const size = parseInt(limit) || 10;
    const skip = (pages - 1) * size;
    const result = yield request_model_1.Request.find(whereConditions)
        .populate({
        path: 'room',
        select: 'roomName',
    })
        .skip(skip)
        .limit(size)
        .lean();
    const count = yield request_model_1.Request.countDocuments(whereConditions);
    return {
        result,
        meta: {
            page: pages,
            total: count,
        },
    };
});
const reactRequest = (roomId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, searchTerm } = query, filterData = __rest(query, ["page", "limit", "searchTerm"]);
    const isExistRoom = yield room_model_1.Room.findById(roomId);
    if (!isExistRoom) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Room not found!');
    }
    const anyConditions = [];
    anyConditions.push({ room: roomId });
    if (searchTerm) {
        anyConditions.push({
            $or: [{ question: { $regex: searchTerm, $options: 'i' } }],
        });
    }
    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.entries(filterData).map(([field, value]) => ({ [field]: value }));
        anyConditions.push({ $and: filterConditions });
    }
    const whereConditions = anyConditions.length > 0 ? { $and: anyConditions } : {};
    // Pagination setup
    const pages = parseInt(page) || 1;
    const size = parseInt(limit) || 10;
    const skip = (pages - 1) * size;
    const result = yield request_model_1.Request.find(whereConditions)
        .populate({
        path: 'room',
        select: 'roomName',
    })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(size)
        .lean();
    const count = yield request_model_1.Request.countDocuments(whereConditions);
    return {
        result,
        meta: {
            page: pages,
            total: count,
        },
    };
});
const getAllRequestsForAdmin = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, searchTerm, email } = query, filterData = __rest(query, ["page", "limit", "searchTerm", "email"]);
    const anyConditions = [];
    if (email) {
        const emailIds = yield user_model_1.User.find({
            email: { $regex: email, $options: 'i' },
        }).distinct('_id');
        if (emailIds.length > 0) {
            anyConditions.push({ user: { $in: emailIds } });
        }
    }
    if (searchTerm) {
        anyConditions.push({
            $or: [{ question: { $regex: searchTerm, $options: 'i' } }],
        });
    }
    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.entries(filterData).map(([field, value]) => ({ [field]: value }));
        anyConditions.push({ $and: filterConditions });
    }
    const whereConditions = anyConditions.length > 0 ? { $and: anyConditions } : {};
    const pages = parseInt(page) || 1;
    const size = parseInt(limit) || 10;
    const skip = (pages - 1) * size;
    const result = yield request_model_1.Request.find(whereConditions)
        .populate('user')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(size)
        .lean();
    const count = yield request_model_1.Request.countDocuments(whereConditions);
    return {
        result,
        meta: {
            page: pages,
            total: count,
        },
    };
});
const getSingleRequest = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistRequest = yield request_model_1.Request.findById(id);
    if (!isExistRequest) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Request doesn't exist!");
    }
    const result = yield request_model_1.Request.findById(id);
    return result;
});
const deleteRequest = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistRequest = yield request_model_1.Request.findById(id);
    if (!isExistRequest) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Request doesn't exist!");
    }
    const result = yield request_model_1.Request.findByIdAndDelete(id);
    return result;
});
const getAllRequestsHistory = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
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
    const whereConditions = anyConditions.length > 0 ? { $and: anyConditions } : {};
    // Pagination setup
    const pages = parseInt(page) || 1;
    const size = parseInt(limit) || 10;
    const skip = (pages - 1) * size;
    const result = yield request_model_1.Request.find(whereConditions)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(size)
        .lean();
    const count = yield request_model_1.Request.countDocuments(whereConditions);
    return {
        result,
        meta: {
            page: pages,
            total: count,
        },
    };
});
exports.RequestService = {
    createRequest,
    getAllRequests,
    getAllRequestsForAdmin,
    deleteRequest,
    getSingleRequest,
    reactRequest,
    getAllRequestsHistory,
};
