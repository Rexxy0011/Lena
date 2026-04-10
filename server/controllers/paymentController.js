import crypto from 'crypto';
import { db } from '../config/firebase.js';
import { initializeTransaction, verifyTransaction } from '../services/paystackService.js';
import { enrollUserInCourse } from '../services/firestoreService.js';

/**
 * POST /api/payment/initialize
 * Initializes a Paystack transaction for a course purchase.
 * Body: { courseId }
 * Returns: { authorizationUrl, reference }
 */
export const initializePayment = async (req, res) => {
  try {
    const { uid } = req.user;
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ success: false, message: 'courseId is required' });
    }

    // Get course price
    const courseSnap = await db.collection('courses').doc(courseId).get();
    if (!courseSnap.exists) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    const { coursePrice, discount, courseTitle } = courseSnap.data();

    // Get user email
    const userSnap = await db.collection('users').doc(uid).get();
    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: 'User not found — call /api/auth/sync first' });
    }
    const { email } = userSnap.data();

    // Calculate discounted price in kobo (1 NGN = 100 kobo)
    const discountedPrice = coursePrice - (discount * coursePrice) / 100;
    const amountInKobo = Math.round(discountedPrice * 100);

    // Unique reference for this transaction
    const reference = `lena_${uid}_${courseId}_${Date.now()}`;

    const txData = await initializeTransaction({
      email,
      amount: amountInKobo,
      reference,
      metadata: { uid, courseId, courseTitle },
      callback_url: process.env.PAYSTACK_CALLBACK_URL,
    });

    return res.status(200).json({
      success: true,
      authorizationUrl: txData.authorization_url,
      reference: txData.reference,
    });
  } catch (err) {
    console.error('initializePayment error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to initialize payment' });
  }
};

/**
 * GET /api/payment/verify?reference=xxx
 * Verifies a Paystack transaction and enrolls the user if successful.
 */
export const verifyPayment = async (req, res) => {
  try {
    const { uid } = req.user;
    const { reference } = req.query;

    if (!reference) {
      return res.status(400).json({ success: false, message: 'reference is required' });
    }

    const txData = await verifyTransaction(reference);

    if (txData.status !== 'success') {
      return res.status(400).json({ success: false, message: 'Payment was not successful' });
    }

    const { uid: metaUid, courseId } = txData.metadata;

    // Prevent one user from verifying another user's payment
    if (metaUid !== uid) {
      return res.status(403).json({ success: false, message: 'Unauthorized verification' });
    }

    await enrollUserInCourse(uid, courseId, reference, txData.amount);

    return res.status(200).json({ success: true, courseId });
  } catch (err) {
    console.error('verifyPayment error:', err.message);
    return res.status(500).json({ success: false, message: 'Payment verification failed' });
  }
};

/**
 * POST /api/payment/webhook
 * Paystack webhook endpoint — handles charge.success as a fallback
 * in case the user closed the browser before the callback redirect fired.
 * Validates HMAC-SHA512 signature before processing.
 */
export const paystackWebhook = async (req, res) => {
  try {
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
      .update(req.body) // raw Buffer — express.raw() must be applied to this route
      .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(401).json({ success: false, message: 'Invalid signature' });
    }

    const event = JSON.parse(req.body);

    if (event.event === 'charge.success') {
      const { metadata, reference, amount } = event.data;
      const { uid, courseId } = metadata || {};

      if (uid && courseId) {
        // enrollUserInCourse is idempotent — safe to call even if already enrolled
        await enrollUserInCourse(uid, courseId, reference, amount);
      }
    }

    // Always return 200 to Paystack — non-200 causes retries
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('paystackWebhook error:', err.message);
    return res.status(200).json({ success: true }); // still 200 to prevent Paystack retries
  }
};
