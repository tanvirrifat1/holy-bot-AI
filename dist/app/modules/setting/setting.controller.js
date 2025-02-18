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
exports.SettingController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const setting_service_1 = require("./setting.service");
// Terms and condition
const createTermsAndCondition = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield setting_service_1.SettingService.createTermsAndCondition(req.body);
    res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Terms-and-condition updated successfully',
        data: result,
    });
}));
const getTermsAndCondition = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield setting_service_1.SettingService.getTermsAndCondition();
    res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Terms-and-condition retrived successfully',
        data: result,
    });
}));
// privacy and policy
const createPrivacyPolicy = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield setting_service_1.SettingService.createPrivacyPolicy(req.body);
    res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Privacy-policy updated successfully',
        data: result,
    });
}));
const getPrivacyPolicy = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield setting_service_1.SettingService.getPrivacyPolicy();
    res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Privacy-policy retrived successfully',
        data: result,
    });
}));
// privacy and policy
const createTrustAndSafety = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield setting_service_1.SettingService.createTrustAndSafety(req.body);
    res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Trust-and-safety updated successfully',
        data: result,
    });
}));
const getTrustAndSafety = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield setting_service_1.SettingService.getTrustAndSafety();
    res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Trust-and-safety retrived successfully',
        data: result,
    });
}));
exports.SettingController = {
    createTermsAndCondition,
    getTermsAndCondition,
    createPrivacyPolicy,
    getPrivacyPolicy,
    createTrustAndSafety,
    getTrustAndSafety,
};
