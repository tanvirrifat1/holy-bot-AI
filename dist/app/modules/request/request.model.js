"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = void 0;
const mongoose_1 = require("mongoose");
const questionSchema = new mongoose_1.Schema({
    question: {
        type: String,
        required: true,
        trim: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    answer: {
        type: String,
        required: true,
        trim: true,
    },
    room: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Room',
    },
    createRoom: {
        type: Boolean,
        default: false,
    },
    path: {
        type: String,
    },
    fileQuestion: {
        type: String,
    },
}, {
    timestamps: true,
});
exports.Request = (0, mongoose_1.model)('Question', questionSchema);
