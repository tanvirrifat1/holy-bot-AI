import { model, Schema } from 'mongoose';
import { ISubscription } from './subscriptation.interface';

const subscribtionSchema = new Schema<ISubscription>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  package: {
    type: Schema.Types.ObjectId,
    ref: 'Package',
  },
  subscriptionId: {
    type: String,
  },
  stripeCustomerId: {
    type: String,
  },
  status: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  email: {
    type: String,
  },
  amount: {
    type: Number,
  },
  time: {
    type: String,
  },
});

export const Subscriptation = model('subscriptation', subscribtionSchema);
