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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionController = void 0;
const stripe_1 = require("../../../shared/stripe");
const subscriptions_service_1 = require("./subscriptions.service");
const config_1 = __importDefault(require("../../../config"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const createCheckoutSessionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const { packageId } = req.body;
    try {
        const sessionUrl = yield subscriptions_service_1.subscriptionsService.createCheckoutSessionService(userId, packageId);
        res.status(200).json({ url: sessionUrl });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to create checkout session' });
    }
});
const stripeWebhookController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sig = req.headers['stripe-signature'];
    try {
        const event = stripe_1.stripe.webhooks.constructEvent(req.body, sig, config_1.default.webhook_secret);
        yield subscriptions_service_1.subscriptionsService.handleStripeWebhookService(event);
        res.status(200).send({ received: true });
    }
    catch (err) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, `Webhook Error: ${err.message}`);
    }
});
const getAllSubscriptions = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const result = yield subscriptions_service_1.subscriptionsService.getSubscribtionService(userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Subscriptions retrieved successfully',
        data: result,
    });
}));
const cancelSubscriptions = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const result = yield subscriptions_service_1.subscriptionsService.cancelSubscriptation(userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Subscriptions canceled successfully',
        data: result,
    });
}));
const getAllSubs = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield subscriptions_service_1.subscriptionsService.getAllSubs(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Subscriptions retrieved successfully',
        data: result,
    });
}));
const updateSubs = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const { newPackageId } = req.body;
    const result = yield subscriptions_service_1.subscriptionsService.updateSubscriptionPlanService(userId, newPackageId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Subscriptions updated successfully',
        data: result,
    });
}));
exports.SubscriptionController = {
    createCheckoutSessionController,
    stripeWebhookController,
    getAllSubscriptions,
    cancelSubscriptions,
    getAllSubs,
    updateSubs,
};
