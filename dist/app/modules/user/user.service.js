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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const http_status_codes_1 = require("http-status-codes");
const user_1 = require("../../../enums/user");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const emailHelper_1 = require("../../../helpers/emailHelper");
const emailTemplate_1 = require("../../../shared/emailTemplate");
const generateOTP_1 = __importDefault(require("../../../util/generateOTP"));
const user_model_1 = require("./user.model");
const notificationHelper_1 = require("../../../helpers/notificationHelper");
const unlinkFile_1 = __importDefault(require("../../../shared/unlinkFile"));
const createUserFromDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    payload.role = user_1.USER_ROLES.USER;
    const result = yield user_model_1.User.create(payload);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    const otp = (0, generateOTP_1.default)();
    const emailValues = {
        name: result.name,
        otp,
        email: result.email,
    };
    const accountEmailTemplate = emailTemplate_1.emailTemplate.createAccount(emailValues);
    emailHelper_1.emailHelper.sendEmail(accountEmailTemplate);
    // Update user with authentication details
    const authentication = {
        oneTimeCode: otp,
        expireAt: new Date(Date.now() + 3 * 60000),
    };
    const updatedUser = yield user_model_1.User.findOneAndUpdate({ _id: result._id }, { $set: { authentication } });
    if (!updatedUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found for update');
    }
    if (result.status === 'active') {
        const data = {
            text: `Registered successfully, ${result === null || result === void 0 ? void 0 : result.name}`,
            type: 'ADMIN',
        };
        yield (0, notificationHelper_1.sendNotifications)(data);
    }
    return result;
});
const getAllUsers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = query, filterData = __rest(query, ["searchTerm", "page", "limit", "sortBy", "order"]);
    // Search conditions
    const conditions = [];
    if (searchTerm) {
        conditions.push({
            $or: [{ fullName: { $regex: searchTerm, $options: 'i' } }],
        });
    }
    // Add filter conditions
    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.entries(filterData).map(([field, value]) => ({
            [field]: value,
        }));
        conditions.push({ $and: filterConditions });
    }
    conditions.push({ role: user_1.USER_ROLES.USER });
    const whereConditions = conditions.length ? { $and: conditions } : {};
    // Pagination setup
    const currentPage = Number(page);
    const pageSize = Number(limit);
    const skip = (currentPage - 1) * pageSize;
    // Sorting setup
    const sortOrder = order === 'desc' ? -1 : 1;
    const sortCondition = {
        [sortBy]: sortOrder,
    };
    // Query the database
    const [users, total] = yield Promise.all([
        user_model_1.User.find(whereConditions)
            .sort(sortCondition)
            .skip(skip)
            .limit(pageSize)
            .lean(), // Assert type
        user_model_1.User.countDocuments(whereConditions),
    ]);
    // Format the `updatedAt` field
    const formattedUsers = users === null || users === void 0 ? void 0 : users.map(user => (Object.assign(Object.assign({}, user), { updatedAt: user.updatedAt
            ? new Date(user.updatedAt).toISOString().split('T')[0]
            : null })));
    // Meta information for pagination
    return {
        result: formattedUsers,
        meta: {
            total,
            limit: pageSize,
            totalPages: Math.ceil(total / pageSize),
            currentPage,
        },
    };
});
const getUserProfileFromDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = user;
    const isExistUser = yield user_model_1.User.findById(id);
    if (!isExistUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    return isExistUser;
});
const updateProfileToDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = user;
    const isExistUser = yield user_model_1.User.isExistUserById(id);
    if (!isExistUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    if (payload.image && isExistUser.image) {
        (0, unlinkFile_1.default)(isExistUser.image);
    }
    const updateDoc = yield user_model_1.User.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return updateDoc;
});
const getSingleUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findById(id);
    return result;
});
exports.UserService = {
    createUserFromDb,
    getUserProfileFromDB,
    updateProfileToDB,
    getAllUsers,
    getSingleUser,
};
