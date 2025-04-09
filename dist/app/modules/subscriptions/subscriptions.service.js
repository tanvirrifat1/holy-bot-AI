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
exports.subscriptionsService = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const stripe_1 = require("../../../shared/stripe");
const package_model_1 = require("../package/package.model");
const user_model_1 = require("../user/user.model");
const webhook_1 = require("../../../shared/webhook");
const subscriptions_model_1 = require("./subscriptions.model");
const createCheckoutSessionService = (userId, packageId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(userId);
        if (!user) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
        }
        const plan = yield package_model_1.Package.findById(packageId);
        if (!plan) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Package not found');
        }
        const session = yield stripe_1.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: plan.priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: process.env.SUCCESS_URL || 'https://holybot.ai/paymentsuccess',
            cancel_url: process.env.CANCEL_URL || 'https://holybot.ai/paymentFail',
            metadata: {
                userId,
                packageId,
            },
            customer_email: user.email,
        });
        return session.url;
    }
    catch (error) {
        if (error instanceof ApiError_1.default) {
            throw error;
        }
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, (error === null || error === void 0 ? void 0 : error.message) || 'Failed to create checkout session');
    }
});
const handleStripeWebhookService = (event) => __awaiter(void 0, void 0, void 0, function* () {
    switch (event.type) {
        case 'checkout.session.completed':
            webhook_1.WebhookService.handleCheckoutSessionCompleted(event.data.object);
            break;
        case 'invoice.payment_succeeded':
            webhook_1.WebhookService.handleInvoicePaymentSucceeded(event.data.object);
            break;
        case 'invoice.payment_failed':
            webhook_1.WebhookService.handleInvoicePaymentFailed(event.data.object);
            break;
        case 'checkout.session.async_payment_failed':
            webhook_1.WebhookService.handleAsyncPaymentFailed(event.data.object);
            break;
        case 'customer.subscription.deleted':
            webhook_1.WebhookService.handleSubscriptionDeleted(event.data.object);
            break;
        default:
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid event type');
    }
});
const getSubscribtionService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isUser = yield user_model_1.User.findById(userId);
    if (!isUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User not found');
    }
    const subscription = yield subscriptions_model_1.Subscription.findOne({ user: userId })
        .populate({
        path: 'user',
        select: 'name email subscription',
    })
        .populate({
        path: 'package',
    });
    if (!subscription) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Subscriptions not found');
    }
    return subscription;
});
const cancelSubscriptation = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isUser = yield user_model_1.User.findById(userId);
    if (!isUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User not found');
    }
    const subscription = yield subscriptions_model_1.Subscription.findOne({ user: userId });
    if (!subscription) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Subscriptions not found');
    }
    const updatedSubscription = yield stripe_1.stripe.subscriptions.update(subscription.subscriptionId, {
        cancel_at_period_end: true,
    });
    if (!updatedSubscription) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Subscriptions not cancel');
    }
    const updatedSub = yield subscriptions_model_1.Subscription.findOneAndUpdate({ user: userId }, { status: 'cancel' }, { new: true });
    return updatedSub;
});
const getAllSubs = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit } = query;
    const anyConditions = [{ status: 'Completed' }];
    const whereConditions = anyConditions.length > 0 ? { $and: anyConditions } : {};
    // Pagination setup
    const pages = parseInt(page) || 1;
    const size = parseInt(limit) || 10;
    const skip = (pages - 1) * size;
    const result = yield subscriptions_model_1.Subscription.find(whereConditions)
        .populate('user', 'name email')
        .populate('package', 'name unitAmount interval')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(size)
        .lean();
    const count = yield subscriptions_model_1.Subscription.countDocuments(whereConditions);
    return {
        result,
        meta: {
            page: pages,
            total: count,
        },
    };
});
const updateSubscriptionPlanService = (userId, newPackageId) => __awaiter(void 0, void 0, void 0, function* () {
    const isUser = yield user_model_1.User.findById(userId);
    if (!isUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User not found');
    }
    const subscription = yield subscriptions_model_1.Subscription.findOne({ user: userId });
    if (!subscription) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Subscription not found');
    }
    const newPlan = yield package_model_1.Package.findById(newPackageId);
    if (!newPlan) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'New plan not found');
    }
    const stripeSubscription = yield stripe_1.stripe.subscriptions.retrieve(subscription.subscriptionId);
    if (!stripeSubscription) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Stripe subscription not found');
    }
    const updatedStripeSubscription = yield stripe_1.stripe.subscriptions.update(subscription.subscriptionId, {
        items: [
            {
                id: stripeSubscription.items.data[0].id,
                price: newPlan.priceId,
            },
        ],
        proration_behavior: 'create_prorations',
    });
    if (!updatedStripeSubscription) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Stripe subscription update failed');
    }
    const invoicePreview = yield stripe_1.stripe.invoices.retrieveUpcoming({
        customer: updatedStripeSubscription.customer,
        subscription: updatedStripeSubscription.id,
    });
    const prorationAmount = (invoicePreview.total || 0) / 100;
    const updatedSub = yield subscriptions_model_1.Subscription.findByIdAndUpdate(subscription._id, {
        plan: newPackageId,
        amount: prorationAmount,
        time: newPlan.interval,
        startDate: new Date(invoicePreview.period_start * 1000),
        endDate: new Date(invoicePreview.period_end * 1000),
    }, { new: true });
    if (updatedSub) {
        updatedSub.status = 'active';
        yield updatedSub.save();
    }
    return updatedSub;
});
exports.subscriptionsService = {
    createCheckoutSessionService,
    handleStripeWebhookService,
    getSubscribtionService,
    cancelSubscriptation,
    getAllSubs,
    updateSubscriptionPlanService,
};
