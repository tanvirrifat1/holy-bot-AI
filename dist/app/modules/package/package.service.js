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
exports.packageService = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const package_model_1 = require("./package.model");
const package_constant_1 = require("./package.constant");
const stripe_1 = require("../../../shared/stripe");
const createPackage = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!payload.name ||
            !payload.description ||
            !payload.unitAmount ||
            !payload.interval) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid package data');
        }
        const isPlanExist = yield package_model_1.Package.findOne({ name: payload.name });
        if (isPlanExist) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'package already exist');
        }
        const descriptionString = Array.isArray(payload.description)
            ? payload.description.join(' ')
            : payload.description;
        // Create Stripe product
        const product = yield stripe_1.stripe.products.create({
            name: payload.name,
            description: descriptionString,
        });
        // Handle recurring intervals, including custom 'half-year'
        let recurring = {
            interval: payload.interval === 'half-year' ? 'month' : payload.interval,
        };
        if (payload.interval === 'half-year') {
            recurring.interval_count = 6; // Custom interval count for half-year
        }
        // Create Stripe price
        const price = yield stripe_1.stripe.prices.create({
            unit_amount: payload.unitAmount * 100,
            currency: 'usd',
            recurring, // Pass the constructed recurring object
            product: product.id,
        });
        // Save plan in MongoDB
        if (price) {
            const plan = yield package_model_1.Package.create({
                name: payload.name,
                description: payload.description,
                unitAmount: payload.unitAmount,
                interval: payload.interval,
                productId: product.id,
                priceId: price.id,
            });
            return plan;
        }
    }
    catch (error) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, `Error creating package: ${error.message}`);
    }
});
const getAllPackage = () => __awaiter(void 0, void 0, void 0, function* () {
    const plans = yield package_model_1.Package.find();
    if (!plans) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to get Package');
    }
    return plans;
});
const getPackageById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const plan = yield package_model_1.Package.findById(id);
    if (!plan) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to get Package');
    }
    return plan;
});
const updatePackage = (planId, updates) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const plan = yield package_model_1.Package.findById(planId);
        if (!plan) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Package not found');
        }
        // Ensure description is always a string for Stripe
        const updatedDescription = Array.isArray(updates.description)
            ? updates.description.join(' ')
            : updates.description;
        if (updates.name || updatedDescription) {
            yield stripe_1.stripe.products.update(plan.productId, {
                name: updates.name || plan.name,
                description: updatedDescription,
            });
        }
        if (updates.unitAmount || updates.interval) {
            const stripeInterval = (0, package_constant_1.mapInterval)(updates.interval || plan.interval);
            if (plan.priceId) {
                yield stripe_1.stripe.prices.update(plan.priceId, {
                    active: false, // Archive the old price
                });
            }
            const newPrice = yield stripe_1.stripe.prices.create({
                unit_amount: updates.unitAmount
                    ? updates.unitAmount * 100
                    : plan.unitAmount * 100,
                currency: 'usd',
                recurring: { interval: stripeInterval },
                product: plan.productId,
            });
            updates.priceId = newPrice.id;
        }
        // Update the plan in the database
        const updatedPlan = yield package_model_1.Package.findByIdAndUpdate(planId, updates, {
            new: true,
            runValidators: true,
        });
        if (!updatedPlan) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to update Package');
        }
        return updatedPlan.toObject();
    }
    catch (error) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to update Package');
    }
});
const deletePackage = (planId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Step 1: Find the plan in the database
        const plan = yield package_model_1.Package.findById(planId);
        if (!plan) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Plan not found');
        }
        const stripePriceId = plan.priceId;
        const updatedPrice = yield stripe_1.stripe.prices.update(stripePriceId, {
            active: false,
        });
        if (!updatedPrice) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to deactivate price in Stripe');
        }
        // Step 3: Delete the plan from the database
        yield package_model_1.Package.findByIdAndDelete(planId);
        return { message: 'Plan deleted successfully' };
    }
    catch (error) {
        if (error instanceof ApiError_1.default) {
            throw error; // Rethrow known API errors
        }
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to delete plan');
    }
});
exports.packageService = {
    createPackage,
    getAllPackage,
    updatePackage,
    deletePackage,
    getPackageById,
};
