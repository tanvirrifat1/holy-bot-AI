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
exports.NotificationService = void 0;
const notifications_model_1 = require("./notifications.model");
const getNotificationToDb = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield notifications_model_1.Notification.find({ receiver: user.id });
    const unredCount = yield notifications_model_1.Notification.countDocuments({
        receiver: user.id,
        read: false,
    });
    const data = {
        result,
        unredCount,
    };
    return data;
});
const readNotification = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield notifications_model_1.Notification.updateMany({ receiver: user.id }, { read: true });
    return result;
});
const adminNotification = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit } = query;
    // Apply filter conditions
    const pages = parseInt(page) || 1;
    const size = parseInt(limit) || 10;
    const skip = (pages - 1) * size;
    // Set default sort order to show new data first
    const result = yield notifications_model_1.Notification.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(size)
        .lean();
    const total = yield notifications_model_1.Notification.countDocuments();
    const unread = yield notifications_model_1.Notification.countDocuments({ read: false });
    const data = {
        result,
        meta: {
            page: pages,
            limit: size,
            total,
            unread,
        },
    };
    return data;
});
const adminReadNotification = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield notifications_model_1.Notification.updateMany({ type: 'ADMIN' }, { read: true });
    return result;
});
const deleteAllNotifications = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield notifications_model_1.Notification.deleteMany({});
    return result;
});
exports.NotificationService = {
    getNotificationToDb,
    readNotification,
    adminNotification,
    adminReadNotification,
    deleteAllNotifications,
};
