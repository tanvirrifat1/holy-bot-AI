import { Request, Response } from 'express';
import { stripe } from '../../../shared/stripe';
import { subscriptionsService } from './subscriptions.service';
import config from '../../../config';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';

const createCheckoutSessionController = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { packageId } = req.body;
  try {
    const sessionUrl = await subscriptionsService.createCheckoutSessionService(
      userId,
      packageId
    );
    res.status(200).json({ url: sessionUrl });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create checkout session' });
  }
};

const stripeWebhookController = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      config.webhook_secret as string
    );

    await subscriptionsService.handleStripeWebhookService(event);

    res.status(200).send({ received: true });
  } catch (err) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Webhook Error: ${(err as Error).message}`
    );
  }
};

const getAllSubscriptions = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;

  const result = await subscriptionsService.getSubscribtionService(userId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Subscriptions retrieved successfully',
    data: result,
  });
});

const cancelSubscriptions = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;

  const result = await subscriptionsService.cancelSubscriptation(userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Subscriptions canceled successfully',
    data: result,
  });
});

const getAllSubs = catchAsync(async (req: Request, res: Response) => {
  const result = await subscriptionsService.getAllSubs(req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Subscriptions retrieved successfully',
    data: result,
  });
});

const updateSubs = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;

  const { newPackageId } = req.body;

  const result = await subscriptionsService.updateSubscriptionPlanService(
    userId,
    newPackageId
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Subscriptions updated successfully',
    data: result,
  });
});

export const SubscriptionController = {
  createCheckoutSessionController,
  stripeWebhookController,
  getAllSubscriptions,
  cancelSubscriptions,
  getAllSubs,
  updateSubs,
};
