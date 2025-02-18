"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../app/modules/auth/auth.route");
const user_route_1 = require("../app/modules/user/user.route");
const request_route_1 = require("../app/modules/request/request.route");
const setting_route_1 = require("../app/modules/setting/setting.route");
const package_route_1 = require("../app/modules/package/package.route");
const subscriptation_route_1 = require("../app/modules/subscriptation/subscriptation.route");
const dashboard_route_1 = require("../app/modules/dashboard/dashboard.route");
const room_route_1 = require("../app/modules/room/room.route");
const Notification_route_1 = require("../app/modules/Notification/Notification.route");
const router = express_1.default.Router();
const apiRoutes = [
    { path: '/user', route: user_route_1.UserRoutes },
    { path: '/auth', route: auth_route_1.AuthRoutes },
    { path: '/request', route: request_route_1.RequestRoutes },
    { path: '/setting', route: setting_route_1.SettingRoutes },
    { path: '/package', route: package_route_1.PackageRoutes },
    { path: '/subscription', route: subscriptation_route_1.SubscriptionRoutes },
    { path: '/dashboard', route: dashboard_route_1.DashboardRoutes },
    { path: '/room', route: room_route_1.RoomsRoutes },
    { path: '/notification', route: Notification_route_1.NotificationRoutes },
];
apiRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
