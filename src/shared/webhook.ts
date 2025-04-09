import Stripe from 'stripe';
import { stripe } from './stripe';
import { Types } from 'mongoose';
import { User } from '../app/modules/user/user.model';
import { Subscription } from '../app/modules/subscriptions/subscriptions.model';
import { sendNotifications } from '../helpers/notificationHelper';
import ApiError from '../errors/ApiError';
import { StatusCodes } from 'http-status-codes';

const handleCheckoutSessionCompleted = async (
  session: Stripe.Checkout.Session
) => {
  const { amount_total, metadata, payment_intent, payment_status } = session;

  if (payment_status !== 'paid') {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Payment failed');
  }

  const userId = metadata?.userId as string;
  const packageId = metadata?.packageId as string;
  const products = JSON.parse(metadata?.products || '[]');
  const email = session.customer_email || '';
  const amountTotal = (amount_total ?? 0) / 100;

  const subscription = await stripe.subscriptions.retrieve(
    session.subscription as string
  );

  const startDate = new Date(subscription.start_date * 1000);
  const endDate = new Date(subscription.current_period_end * 1000);
  const interval = subscription.items.data[0]?.plan?.interval as string;
  const status = payment_status === 'paid' ? 'Completed' : 'Pending';

  const existingSubscription: any = await Subscription.findOne({
    user: userId,
  });

  if (existingSubscription) {
    existingSubscription.amount = amountTotal;
    existingSubscription.package = new Types.ObjectId(packageId);
    existingSubscription.products = products;
    existingSubscription.email = email;
    existingSubscription.transactionId = payment_intent;
    existingSubscription.startDate = startDate;
    existingSubscription.endDate = endDate;
    existingSubscription.status = status;
    existingSubscription.subscriptionId = session.subscription;
    existingSubscription.stripeCustomerId = session.customer as string;
    existingSubscription.time = interval;

    await existingSubscription.save();
  } else {
    const paymentRecord = new Subscription({
      amount: amountTotal,
      user: new Types.ObjectId(userId),
      package: new Types.ObjectId(packageId),
      products,
      email,
      transactionId: payment_intent,
      startDate,
      endDate,
      status,
      subscriptionId: session.subscription,
      stripeCustomerId: session.customer as string,
      time: interval,
    });

    await paymentRecord.save();
  }
};

const handleInvoicePaymentSucceeded = async (invoice: Stripe.Invoice) => {
  const subscription = await Subscription.findOne({
    subscriptionId: invoice.subscription,
  });

  if (subscription) {
    subscription.status = 'Completed';
    await subscription.save();
  }

  const user = await User.findById(subscription?.user);
  await User.findByIdAndUpdate(user?._id, {
    $set: { subscription: true },
  });

  if (user) {
    const result = await User.findById(user._id);
    const data = {
      text: `Payment received for user, ${result?.name} `,
      type: 'ADMIN',
    };

    await sendNotifications(data);
  }
};

const handleInvoicePaymentFailed = async (invoice: Stripe.Invoice) => {
  const subscription = await Subscription.findOne({
    subscriptionId: invoice.subscription,
  });

  if (subscription) {
    subscription.status = 'expired';
    await subscription.save();
  }

  const user = await User.findById(subscription?.user);
  if (user) {
    await User.findByIdAndUpdate(user._id, {
      $set: { subscription: false },
    });
  }
};

const handleAsyncPaymentFailed = async (session: Stripe.Checkout.Session) => {
  const payment = await Subscription.findOne({
    stripeCustomerId: session.customer as string,
  });
  if (payment) {
    payment.status = 'Failed';
    await payment.save();
  }
};

const handleSubscriptionDeleted = async (subscription: Stripe.Subscription) => {
  const existingSubscription = await Subscription.findOne({
    subscriptionId: subscription.id,
  });

  if (existingSubscription) {
    existingSubscription.status = 'expired';
    await existingSubscription.save();

    const user = await User.findById(existingSubscription.user);
    if (user) {
      await User.findByIdAndUpdate(user._id, {
        $set: { subscription: false },
      });
    }
  }
};

export const WebhookService = {
  handleCheckoutSessionCompleted,
  handleInvoicePaymentSucceeded,
  handleInvoicePaymentFailed,
  handleAsyncPaymentFailed,
  handleSubscriptionDeleted,
};
