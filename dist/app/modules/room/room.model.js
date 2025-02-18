"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
const mongoose_1 = require("mongoose");
const questionSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    roomName: {
        type: String,
        required: true,
    },
    path: {
        type: String,
    },
}, {
    timestamps: true,
});
exports.Room = (0, mongoose_1.model)('Room', questionSchema);
