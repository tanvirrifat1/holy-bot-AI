import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IPackage } from './package.interface';
import { Package } from './package.model';

import { mapInterval } from './package.constant';
import { stripe } from '../../../shared/stripe';

const createPackage = async (payload: Partial<IPackage>) => {
  try {
    if (
      !payload.name ||
      !payload.description ||
      !payload.unitAmount ||
      !payload.interval
    ) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid package data');
    }

    const isPlanExist = await Package.findOne({ name: payload.name });

    if (isPlanExist) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'package already exist');
    }

    const descriptionString = Array.isArray(payload.description)
      ? payload.description.join(' ') // Join elements with a space
      : payload.description;

    // Create Stripe product
    const product = await stripe.products.create({
      name: payload.name,
      description: descriptionString,
    });

    // Handle recurring intervals, including custom 'half-year'
    let recurring: {
      interval: 'day' | 'week' | 'month' | 'year';
      interval_count?: number; // Optional for custom intervals
    } = {
      interval: payload.interval === 'half-year' ? 'month' : payload.interval,
    };

    if (payload.interval === 'half-year') {
      recurring.interval_count = 6; // Custom interval count for half-year
    }

    // Create Stripe price
    const price = await stripe.prices.create({
      unit_amount: payload.unitAmount * 100,
      currency: 'usd',
      recurring, // Pass the constructed recurring object
      product: product.id,
    });

    // Save plan in MongoDB
    if (price) {
      const plan = await Package.create({
        name: payload.name,
        description: payload.description,
        unitAmount: payload.unitAmount,
        interval: payload.interval,
        productId: product.id,
        priceId: price.id,
      });
      return plan;
    }
  } catch (error: any) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Error creating package: ${error.message}`
    );
  }
};

const getAllPackage = async () => {
  const plans = await Package.find();

  if (!plans) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to get Package');
  }

  return plans;
};

const getPackageById = async (id: string) => {
  const plan = await Package.findById(id);
  if (!plan) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to get Package');
  }
  return plan;
};

const updatePackage = async (
  planId: string,
  updates: Partial<IPackage>
): Promise<IPackage> => {
  try {
    const plan = await Package.findById(planId);
    if (!plan) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Package not found');
    }

    // Ensure description is always a string for Stripe
    const updatedDescription = Array.isArray(updates.description)
      ? updates.description.join(' ') // Join array elements if description is an array
      : updates.description; // Use as-is if it's already a string

    if (updates.name || updatedDescription) {
      await stripe.products.update(plan.productId, {
        name: updates.name || plan.name,
        description: updatedDescription,
      });
    }

    if (updates.unitAmount || updates.interval) {
      const stripeInterval = mapInterval(updates.interval || plan.interval);

      if (plan.priceId) {
        await stripe.prices.update(plan.priceId, {
          active: false, // Archive the old price
        });
      }

      const newPrice = await stripe.prices.create({
        unit_amount: updates.unitAmount
          ? updates.unitAmount * 100
          : plan.unitAmount * 100,
        currency: 'usd',
        recurring: { interval: stripeInterval },
        product: plan.productId,
      });

      updates.priceId = newPrice.id;
    }

    // Update the plan in the database
    const updatedPlan = await Package.findByIdAndUpdate(planId, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedPlan) {
      throw new Error('Failed to update Package');
    }

    return updatedPlan.toObject();
  } catch (error) {
    console.error('Error updating plan:', error);
    throw new Error('Failed to update plan');
  }
};

const deletePackage = async (planId: string) => {
  try {
    // Step 1: Find the plan in the database
    const plan = await Package.findById(planId);

    if (!plan) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Plan not found');
    }

    const stripePriceId = plan.priceId;
    const updatedPrice = await stripe.prices.update(stripePriceId, {
      active: false,
    });

    if (!updatedPrice) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Failed to deactivate price in Stripe'
      );
    }

    // Step 3: Delete the plan from the database
    await Package.findByIdAndDelete(planId);

    return { message: 'Plan deleted successfully' };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error; // Rethrow known API errors
    }

    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to delete plan'
    );
  }
};

export const packageService = {
  createPackage,
  getAllPackage,
  updatePackage,
  deletePackage,
  getPackageById,
};
