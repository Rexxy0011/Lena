import paystackClient from '../config/paystack.js';

/**
 * Initializes a Paystack transaction.
 * @returns { authorization_url, access_code, reference }
 */
export const initializeTransaction = async ({ email, amount, reference, metadata, callback_url }) => {
  const { data } = await paystackClient.post('/transaction/initialize', {
    email,
    amount,       // in kobo (NGN) — multiply base price by 100
    reference,
    metadata,
    callback_url,
  });
  return data.data;
};

/**
 * Verifies a Paystack transaction by reference.
 * @returns full transaction data object from Paystack
 */
export const verifyTransaction = async (reference) => {
  const { data } = await paystackClient.get(`/transaction/verify/${reference}`);
  return data.data;
};
