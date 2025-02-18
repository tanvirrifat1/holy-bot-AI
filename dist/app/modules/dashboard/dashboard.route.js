"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const dashboard_controller_1 = require("./dashboard.controller");
const router = express_1.default.Router();
router.get('/get-total-statistics', (0, auth_1.default)(user_1.USER_ROLES.ADMIN), dashboard_controller_1.DashboardController.totalStatistics);
router.get('/get-earning-chart-data', (0, auth_1.default)(user_1.USER_ROLES.ADMIN), dashboard_controller_1.DashboardController.getEarningChartData);
exports.DashboardRoutes = router;
