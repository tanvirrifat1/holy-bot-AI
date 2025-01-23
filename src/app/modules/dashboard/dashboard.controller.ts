import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { DashboardService } from './dashboard.service';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

const totalStatistics = catchAsync(async (req: Request, res: Response) => {
  const result = await DashboardService.totalStatistics();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Statistics retrieved successfully',
    data: result,
  });
});

const getEarningChartData = catchAsync(async (req: Request, res: Response) => {
  const result = await DashboardService.getEarningChartData();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Total earning retrieved successfully',
    data: result,
  });
});

export const DashboardController = {
  totalStatistics,
  getEarningChartData,
};
