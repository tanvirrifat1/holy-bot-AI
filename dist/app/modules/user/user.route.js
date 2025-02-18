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
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const fileUploadHandler_1 = __importDefault(require("../../middlewares/fileUploadHandler"));
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const router = express_1.default.Router();
router.post('/create-user', user_controller_1.UserController.createUser);
router.patch('/update-profile', (0, fileUploadHandler_1.default)(), (0, auth_1.default)(user_1.USER_ROLES.USER, user_1.USER_ROLES.ADMIN), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Parse the body if it contains data in stringified JSON format
        let validatedData;
        if (req.body.data) {
            validatedData = user_validation_1.UserValidation.updateZodSchema.parse(JSON.parse(req.body.data));
        }
        // Handle image updates if files are uploaded
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            // Assuming `fileUploadHandler` stores files in req.files
            const uploadedFiles = req.files.map((file) => file.path);
            validatedData = Object.assign(Object.assign({}, validatedData), { image: uploadedFiles[0] });
        }
        // Pass the validated data to the controller
        req.body = validatedData;
        yield user_controller_1.UserController.updateProfile(req, res, next);
    }
    catch (error) {
        next(error);
    }
}));
router.get('/user', (0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.USER), user_controller_1.UserController.getUserProfile);
router.get('/get-all-users', (0, auth_1.default)(user_1.USER_ROLES.ADMIN), user_controller_1.UserController.getAllUser);
router.get('/get-all-users/:id', (0, auth_1.default)(user_1.USER_ROLES.ADMIN), user_controller_1.UserController.getSingleUser);
router.get('/profile', (0, auth_1.default)(user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.USER), user_controller_1.UserController.getUserProfile);
exports.UserRoutes = router;
