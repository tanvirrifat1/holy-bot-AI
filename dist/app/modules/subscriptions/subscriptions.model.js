"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscription = void 0;
const mongoose_1 = require("mongoose");
const subscriptionSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    package: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Package',
    },
    subscriptionId: {
        type: String,
    },
    stripeCustomerId: {
        type: String,
    },
    status: {
        type: String,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    email: {
        type: String,
    },
    amount: {
        type: Number,
    },
    time: {
        type: String,
    },
});
exports.Subscription = (0, mongoose_1.model)('subscriptation', subscriptionSchema);
