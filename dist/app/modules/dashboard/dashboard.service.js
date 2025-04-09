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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const user_1 = require("../../../enums/user");
const month_1 = require("../../../helpers/month");
const subscriptions_model_1 = require("../subscriptions/subscriptions.model");
const user_model_1 = require("../user/user.model");
const totalStatistics = () => __awaiter(void 0, void 0, void 0, function* () {
    const [totalEarnings, totalUsers, totalSubscription] = yield Promise.all([
        subscriptions_model_1.Subscription.aggregate([
            { $match: { status: 'Completed' } },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' },
                },
            },
        ]).then(result => (result.length > 0 ? result[0].totalAmount : 0)),
        user_model_1.User.countDocuments({ role: user_1.USER_ROLES.USER, status: 'active' }),
        subscriptions_model_1.Subscription.countDocuments({ status: 'Completed' }),
    ]);
    return {
        totalEarnings,
        totalUsers,
        totalSubscription,
    };
});
const getEarningChartData = () => __awaiter(void 0, void 0, void 0, function* () {
    const matchConditions = { status: 'Completed' };
    const result = yield subscriptions_model_1.Subscription.aggregate([
        { $match: matchConditions },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$startDate' } },
                totalAmount: { $sum: '$amount' },
            },
        },
        {
            $addFields: {
                month: {
                    $dateToString: {
                        format: '%b',
                        date: { $dateFromString: { dateString: '$_id' } },
                    },
                },
                year: {
                    $dateToString: {
                        format: '%Y',
                        date: { $dateFromString: { dateString: '$_id' } },
                    },
                },
            },
        },
        { $sort: { _id: 1 } },
        {
            $project: {
                month: 1,
                totalAmount: 1,
                year: 1,
            },
        },
        {
            $group: {
                _id: '$year',
                earnings: {
                    $push: {
                        month: '$month',
                        totalAmount: '$totalAmount',
                    },
                },
            },
        },
        {
            $addFields: {
                allMonths: month_1.months,
            },
        },
        {
            $project: {
                earnings: {
                    $map: {
                        input: '$allMonths',
                        as: 'month',
                        in: {
                            $let: {
                                vars: {
                                    monthData: {
                                        $arrayElemAt: [
                                            {
                                                $filter: {
                                                    input: '$earnings',
                                                    as: 'item',
                                                    cond: { $eq: ['$$item.month', '$$month'] },
                                                },
                                            },
                                            0,
                                        ],
                                    },
                                },
                                in: {
                                    month: '$$month',
                                    totalAmount: { $ifNull: ['$$monthData.totalAmount', 0] },
                                },
                            },
                        },
                    },
                },
            },
        },
    ]);
    return result;
});
exports.DashboardService = {
    totalStatistics,
    getEarningChartData,
};
