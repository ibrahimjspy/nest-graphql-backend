import { prepareSuccessResponse } from 'src/core/utils/response';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export const createLoginLinkFromStripe = async (accountId: string) => {
  try {
    const loginLink = await stripe.accounts.createLoginLink(accountId);
    return prepareSuccessResponse(loginLink);
  } catch (error) {
    return error?.raw;
  }
};
