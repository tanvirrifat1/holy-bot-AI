"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const subscriptions_controller_1 = require("./subscriptions.controller");
const router = (0, express_1.Router)();
router.post('/check-out', (0, auth_1.default)(user_1.USER_ROLES.USER), subscriptions_controller_1.SubscriptionController.createCheckoutSessionController);
router.get('/get-subs-admin', (0, auth_1.default)(user_1.USER_ROLES.ADMIN), subscriptions_controller_1.SubscriptionController.getAllSubs);
router.get('/get-all', (0, auth_1.default)(user_1.USER_ROLES.USER, user_1.USER_ROLES.ADMIN), subscriptions_controller_1.SubscriptionController.getAllSubscriptions);
router.patch('/updated', (0, auth_1.default)(user_1.USER_ROLES.USER), subscriptions_controller_1.SubscriptionController.updateSubs);
router.delete('/cancel', (0, auth_1.default)(user_1.USER_ROLES.USER), subscriptions_controller_1.SubscriptionController.cancelSubscriptions);
exports.SubscriptionRoutes = router;
