"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const setting_controller_1 = require("./setting.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const router = express_1.default.Router();
// Terms and condition
router.post('/create-terms', (0, auth_1.default)(user_1.USER_ROLES.ADMIN), setting_controller_1.SettingController.createTermsAndCondition);
router.get('/get-terms', setting_controller_1.SettingController.getTermsAndCondition);
// Privacy Policy
router.post('/create-privacy', (0, auth_1.default)(user_1.USER_ROLES.ADMIN), setting_controller_1.SettingController.createPrivacyPolicy);
router.get('/get-privacy', setting_controller_1.SettingController.getPrivacyPolicy);
// Trust & Safety
router.post('/create-trust', (0, auth_1.default)(user_1.USER_ROLES.ADMIN), setting_controller_1.SettingController.createTrustAndSafety);
router.get('/get-trust', setting_controller_1.SettingController.getTrustAndSafety);
exports.SettingRoutes = router;
