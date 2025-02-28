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
exports.WebhookService = void 0;
const stripe_1 = require("./stripe");
const mongoose_1 = require("mongoose");
const user_model_1 = require("../app/modules/user/user.model");
const subscriptation_model_1 = require("../app/modules/subscriptation/subscriptation.model");
const notificationHelper_1 = require("../helpers/notificationHelper");
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const http_status_codes_1 = require("http-status-codes");
// const handleCheckoutSessionCompleted = async (
//   session: Stripe.Checkout.Session
// ) => {
//   const { amount_total, metadata, payment_intent, payment_status } = session;
//   if (payment_status !== 'paid') {
//     throw new ApiError(StatusCodes.BAD_REQUEST, 'Payment failed');
//   }
//   const userId = metadata?.userId as string;
//   const packageId = metadata?.packageId as string;
//   const products = JSON.parse(metadata?.products || '[]');
//   const email = session.customer_email || '';
//   const amountTotal = (amount_total ?? 0) / 100;
//   const subscription = await stripe.subscriptions.retrieve(
//     session.subscription as string
//   );
//   const startDate = new Date(subscription.start_date * 1000);
//   const endDate = new Date(subscription.current_period_end * 1000);
//   const interval = subscription.items.data[0]?.plan?.interval as string;
//   const status = payment_status === 'paid' ? 'Completed' : 'Pending';
//   const paymentRecord = new Subscriptation({
//     amount: amountTotal,
//     user: new Types.ObjectId(userId),
//     package: new Types.ObjectId(packageId),
//     products,
//     email,
//     transactionId: payment_intent,
//     startDate,
//     endDate,
//     status,
//     subscriptionId: session.subscription,
//     stripeCustomerId: session.customer as string,
//     time: interval,
//   });
//   await paymentRecord.save();
// };
const handleCheckoutSessionCompleted = (session) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { amount_total, metadata, payment_intent, payment_status } = session;
    if (payment_status !== 'paid') {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Payment failed');
    }
    const userId = metadata === null || metadata === void 0 ? void 0 : metadata.userId;
    const packageId = metadata === null || metadata === void 0 ? void 0 : metadata.packageId;
    const products = JSON.parse((metadata === null || metadata === void 0 ? void 0 : metadata.products) || '[]');
    const email = session.customer_email || '';
    const amountTotal = (amount_total !== null && amount_total !== void 0 ? amount_total : 0) / 100;
    const subscription = yield stripe_1.stripe.subscriptions.retrieve(session.subscription);
    const startDate = new Date(subscription.start_date * 1000);
    const endDate = new Date(subscription.current_period_end * 1000);
    const interval = (_b = (_a = subscription.items.data[0]) === null || _a === void 0 ? void 0 : _a.plan) === null || _b === void 0 ? void 0 : _b.interval;
    const status = payment_status === 'paid' ? 'Completed' : 'Pending';
    // Check if the user already has a subscription
    const existingSubscription = yield subscriptation_model_1.Subscriptation.findOne({
        user: userId,
    });
    if (existingSubscription) {
        existingSubscription.amount = amountTotal;
        existingSubscription.package = new mongoose_1.Types.ObjectId(packageId);
        existingSubscription.products = products;
        existingSubscription.email = email;
        existingSubscription.transactionId = payment_intent;
        existingSubscription.startDate = startDate;
        existingSubscription.endDate = endDate;
        existingSubscription.status = status;
        existingSubscription.subscriptionId = session.subscription;
        existingSubscription.stripeCustomerId = session.customer;
        existingSubscription.time = interval;
        yield existingSubscription.save();
    }
    else {
        const paymentRecord = new subscriptation_model_1.Subscriptation({
            amount: amountTotal,
            user: new mongoose_1.Types.ObjectId(userId),
            package: new mongoose_1.Types.ObjectId(packageId),
            products,
            email,
            transactionId: payment_intent,
            startDate,
            endDate,
            status,
            subscriptionId: session.subscription,
            stripeCustomerId: session.customer,
            time: interval,
        });
        yield paymentRecord.save();
    }
});
const handleInvoicePaymentSucceeded = (invoice) => __awaiter(void 0, void 0, void 0, function* () {
    const subscription = yield subscriptation_model_1.Subscriptation.findOne({
        subscriptionId: invoice.subscription,
    });
    if (subscription) {
        subscription.status = 'Completed'; // Update status to completed
        yield subscription.save();
    }
    const user = yield user_model_1.User.findById(subscription === null || subscription === void 0 ? void 0 : subscription.user);
    yield user_model_1.User.findByIdAndUpdate(user === null || user === void 0 ? void 0 : user._id, {
        $set: { subscription: true },
    });
    if (user) {
        const result = yield user_model_1.User.findById(user._id);
        const data = {
            text: `Payment received for user, ${result === null || result === void 0 ? void 0 : result.name} `,
            type: 'ADMIN',
        };
        yield (0, notificationHelper_1.sendNotifications)(data);
    }
});
// Function to handle invoice.payment_failed event
const handleInvoicePaymentFailed = (invoice) => __awaiter(void 0, void 0, void 0, function* () {
    const subscription = yield subscriptation_model_1.Subscriptation.findOne({
        subscriptionId: invoice.subscription,
    });
    if (subscription) {
        subscription.status = 'expired'; // Update status to expired
        yield subscription.save();
    }
    const user = yield user_model_1.User.findById(subscription === null || subscription === void 0 ? void 0 : subscription.user);
    if (user) {
        yield user_model_1.User.findByIdAndUpdate(user._id, {
            $set: { subscription: false }, // Update user subscription status
        });
    }
});
// Function to handle checkout.session.async_payment_failed event
const handleAsyncPaymentFailed = (session) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield subscriptation_model_1.Subscriptation.findOne({
        stripeCustomerId: session.customer,
    });
    if (payment) {
        payment.status = 'Failed';
        yield payment.save();
    }
});
// Function to handle customer.subscription.deleted event
const handleSubscriptionDeleted = (subscription) => __awaiter(void 0, void 0, void 0, function* () {
    const existingSubscription = yield subscriptation_model_1.Subscriptation.findOne({
        subscriptionId: subscription.id,
    });
    if (existingSubscription) {
        existingSubscription.status = 'expired'; // Mark as expired
        yield existingSubscription.save();
        const user = yield user_model_1.User.findById(existingSubscription.user);
        if (user) {
            yield user_model_1.User.findByIdAndUpdate(user._id, {
                $set: { subscription: false },
            });
        }
    }
});
exports.WebhookService = {
    handleCheckoutSessionCompleted,
    handleInvoicePaymentSucceeded,
    handleInvoicePaymentFailed,
    handleAsyncPaymentFailed,
    handleSubscriptionDeleted,
};
