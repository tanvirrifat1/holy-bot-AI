"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trust = exports.Privacy = exports.TermsAndCondition = void 0;
const mongoose_1 = require("mongoose");
// terms and condition
const termSchema = new mongoose_1.Schema({
    description: {
        type: String,
        required: true,
        trim: true,
    },
}, {
    timestamps: true,
});
exports.TermsAndCondition = (0, mongoose_1.model)('TermsAndCondition', termSchema);
// privacy policy
const privacySchema = new mongoose_1.Schema({
    description: {
        type: String,
        required: true,
        trim: true,
    },
}, {
    timestamps: true,
});
exports.Privacy = (0, mongoose_1.model)('Privacy', privacySchema);
// trust & security
const trustSchema = new mongoose_1.Schema({
    description: {
        type: String,
        required: true,
        trim: true,
    },
}, {
    timestamps: true,
});
exports.Trust = (0, mongoose_1.model)('Trust', trustSchema);
