"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestRoutes = void 0;
const express_1 = __importDefault(require("express"));
const request_controller_1 = require("./request.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const router = express_1.default.Router();
router.post('/create', (0, auth_1.default)(user_1.USER_ROLES.USER), request_controller_1.RequestController.createRequest);
router.get('/get-all/:id', (0, auth_1.default)(user_1.USER_ROLES.USER), request_controller_1.RequestController.getAllRequests);
router.get('/get-recent/:id', (0, auth_1.default)(user_1.USER_ROLES.USER), request_controller_1.RequestController.reactRequest);
router.get('/get-req-history', (0, auth_1.default)(user_1.USER_ROLES.USER), request_controller_1.RequestController.getAllRequestsHistory);
router.get('/get-all-admin', (0, auth_1.default)(user_1.USER_ROLES.ADMIN), request_controller_1.RequestController.getAllRequestsForAdmin);
router.get('/get/:id', (0, auth_1.default)(user_1.USER_ROLES.USER, user_1.USER_ROLES.ADMIN), request_controller_1.RequestController.getSingleRequest);
router.delete('/delete/:id', (0, auth_1.default)(user_1.USER_ROLES.USER), request_controller_1.RequestController.deleteRequest);
exports.RequestRoutes = router;
