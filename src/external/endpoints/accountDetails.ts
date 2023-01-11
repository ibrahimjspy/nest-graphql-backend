const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export const getAccountInfo = async (accountId: string) => {
  const loginLink = await stripe.accounts.createLoginLink(accountId);
  return { data: loginLink };
};
