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
exports.SettingService = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const setting_model_1 = require("./setting.model");
// Terms and conditions
const createTermsAndCondition = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingTerm = yield setting_model_1.TermsAndCondition.findOne();
        if (existingTerm) {
            Object.assign(existingTerm, payload);
            const updatedTerm = yield existingTerm.save();
            return updatedTerm;
        }
        else {
            const newTerm = yield setting_model_1.TermsAndCondition.create(payload);
            return newTerm;
        }
    }
    catch (error) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Unable to create or update terms and condition.');
    }
});
const getTermsAndCondition = () => __awaiter(void 0, void 0, void 0, function* () {
    const term = yield setting_model_1.TermsAndCondition.findOne();
    if (!term) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Terms and condition not found.');
    }
    return term;
});
// Privacy policy
const createPrivacyPolicy = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingTerm = yield setting_model_1.Privacy.findOne();
        if (existingTerm) {
            Object.assign(existingTerm, payload);
            const updatedTerm = yield existingTerm.save();
            return updatedTerm;
        }
        else {
            const newTerm = yield setting_model_1.Privacy.create(payload);
            return newTerm;
        }
    }
    catch (error) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Unable to create or update privacy policy.');
    }
});
const getPrivacyPolicy = () => __awaiter(void 0, void 0, void 0, function* () {
    const term = yield setting_model_1.Privacy.findOne();
    if (!term) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Privacy policy not found.');
    }
    return term;
});
// Trust & Safety
const createTrustAndSafety = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingTerm = yield setting_model_1.Trust.findOne();
        if (existingTerm) {
            Object.assign(existingTerm, payload);
            const updatedTerm = yield existingTerm.save();
            return updatedTerm;
        }
        else {
            const newTerm = yield setting_model_1.Trust.create(payload);
            return newTerm;
        }
    }
    catch (error) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Unable to create or update trust and safety.');
    }
});
const getTrustAndSafety = () => __awaiter(void 0, void 0, void 0, function* () {
    const term = yield setting_model_1.Trust.findOne();
    if (!term) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Trust and safety not found.');
    }
    return term;
});
exports.SettingService = {
    createTermsAndCondition,
    getTermsAndCondition,
    createPrivacyPolicy,
    getPrivacyPolicy,
    createTrustAndSafety,
    getTrustAndSafety,
};
