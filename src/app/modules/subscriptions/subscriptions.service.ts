import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { stripe } from '../../../shared/stripe';
import { Package } from '../package/package.model';
import { User } from '../user/user.model';
import Stripe from 'stripe';
import { WebhookService } from '../../../shared/webhook';
import { Subscription } from './subscriptions.model';

const createCheckoutSessionService = async (
  userId: string,
  packageId: string
) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }

    const plan = await Package.findById(packageId);
    if (!plan) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Package not found');
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url:
        process.env.SUCCESS_URL || 'https://holybot.ai/paymentsuccess',
      cancel_url: process.env.CANCEL_URL || 'https://holybot.ai/paymentFail',
      metadata: {
        userId,
        packageId,
      },
      customer_email: user.email,
    });

    return session.url;
  } catch (error: Error | any) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      error?.message || 'Failed to create checkout session'
    );
  }
};

const handleStripeWebhookService = async (event: Stripe.Event) => {
  switch (event.type) {
    case 'checkout.session.completed':
      WebhookService.handleCheckoutSessionCompleted(event.data.object);
      break;

    case 'invoice.payment_succeeded':
      WebhookService.handleInvoicePaymentSucceeded(event.data.object);
      break;

    case 'invoice.payment_failed':
      WebhookService.handleInvoicePaymentFailed(event.data.object);
      break;

    case 'checkout.session.async_payment_failed':
      WebhookService.handleAsyncPaymentFailed(event.data.object);
      break;

    case 'customer.subscription.deleted':
      WebhookService.handleSubscriptionDeleted(event.data.object);
      break;

    default:
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid event type');
  }
};

const getSubscribtionService = async (userId: string) => {
  const isUser = await User.findById(userId);

  if (!isUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'User not found');
  }

  const subscription = await Subscription.findOne({ user: userId })
    .populate({
      path: 'user',
      select: 'name email subscription',
    })
    .populate({
      path: 'package',
    });

  if (!subscription) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Subscriptions not found');
  }
  return subscription;
};

const cancelSubscriptation = async (userId: string) => {
  const isUser = await User.findById(userId);

  if (!isUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'User not found');
  }

  const subscription = await Subscription.findOne({ user: userId });
  if (!subscription) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Subscriptions not found');
  }

  const updatedSubscription = await stripe.subscriptions.update(
    subscription.subscriptionId,
    {
      cancel_at_period_end: true,
    }
  );

  if (!updatedSubscription) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Subscriptions not cancel');
  }

  const updatedSub = await Subscription.findOneAndUpdate(
    { user: userId },
    { status: 'cancel' },
    { new: true }
  );
  return updatedSub;
};

const getAllSubs = async (query: Record<string, unknown>) => {
  const { page, limit } = query;

  const anyConditions: any[] = [{ status: 'Completed' }];

  const whereConditions =
    anyConditions.length > 0 ? { $and: anyConditions } : {};

  // Pagination setup
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const result = await Subscription.find(whereConditions)
    .populate('user', 'name email')
    .populate('package', 'name unitAmount interval')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  const count = await Subscription.countDocuments(whereConditions);

  return {
    result,
    meta: {
      page: pages,
      total: count,
    },
  };
};

const updateSubscriptionPlanService = async (
  userId: string,
  newPackageId: string
) => {
  const isUser = await User.findById(userId);
  if (!isUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'User not found');
  }

  const subscription = await Subscription.findOne({ user: userId });
  if (!subscription) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Subscription not found');
  }

  const newPlan = await Package.findById(newPackageId);
  if (!newPlan) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'New plan not found');
  }

  const stripeSubscription = await stripe.subscriptions.retrieve(
    subscription.subscriptionId
  );

  if (!stripeSubscription) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Stripe subscription not found'
    );
  }

  const updatedStripeSubscription = await stripe.subscriptions.update(
    subscription.subscriptionId,
    {
      items: [
        {
          id: stripeSubscription.items.data[0].id,
          price: newPlan.priceId,
        },
      ],
      proration_behavior: 'create_prorations',
    }
  );

  if (!updatedStripeSubscription) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Stripe subscription update failed'
    );
  }

  const invoicePreview = await stripe.invoices.retrieveUpcoming({
    customer: updatedStripeSubscription.customer as string,
    subscription: updatedStripeSubscription.id,
  });

  const prorationAmount = (invoicePreview.total || 0) / 100;

  const updatedSub = await Subscription.findByIdAndUpdate(
    subscription._id,
    {
      plan: newPackageId,
      amount: prorationAmount,
      time: newPlan.interval,
      startDate: new Date(invoicePreview.period_start * 1000),
      endDate: new Date(invoicePreview.period_end * 1000),
    },
    { new: true }
  );

  if (updatedSub) {
    updatedSub.status = 'active';
    await updatedSub.save();
  }

  return updatedSub;
};

export const subscriptionsService = {
  createCheckoutSessionService,
  handleStripeWebhookService,
  getSubscribtionService,
  cancelSubscriptation,
  getAllSubs,
  updateSubscriptionPlanService,
};
