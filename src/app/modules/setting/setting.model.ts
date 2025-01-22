import { model, Schema } from 'mongoose';
import { IPrivacy, ITerms, ITrust } from './setting.interface';

// terms and condition
const termSchema = new Schema<ITerms>(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const TermsAndCondition = model<ITerms>('TermsAndCondition', termSchema);

// privacy policy
const privacySchema = new Schema<IPrivacy>(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Privacy = model<IPrivacy>('Privacy', privacySchema);

// trust & security
const trustSchema = new Schema<ITrust>(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Trust = model<ITrust>('Trust', trustSchema);
