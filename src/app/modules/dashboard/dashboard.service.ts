import { USER_ROLES } from '../../../enums/user';
import { months } from '../../../helpers/month';
import { Subscriptation } from '../subscriptions/subscriptions.model';
import { User } from '../user/user.model';

const totalStatistics = async () => {
  const [totalEarnings, totalUsers, totalSubscriptation] = await Promise.all([
    Subscriptation.aggregate([
      { $match: { status: 'Completed' } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
        },
      },
    ]).then(result => (result.length > 0 ? result[0].totalAmount : 0)),

    // Total active users
    User.countDocuments({ role: USER_ROLES.USER, status: 'active' }),

    // Total active products
    Subscriptation.countDocuments({ status: 'Completed' }),
  ]);

  return {
    totalEarnings,
    totalUsers,
    totalSubscriptation,
  };
};

const getEarningChartData = async () => {
  const matchConditions: any = { status: 'Completed' };

  const result = await Subscriptation.aggregate([
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
        allMonths: months,
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
};

export const DashboardService = {
  totalStatistics,
  getEarningChartData,
};
