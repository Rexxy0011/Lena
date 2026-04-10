import { Router } from 'express';
import protect from '../middleware/auth.js';
import {
  initializePayment,
  verifyPayment,
  paystackWebhook,
} from '../controllers/paymentController.js';

const router = Router();

// POST /api/payment/initialize — create a Paystack transaction for a course
router.post('/initialize', protect, initializePayment);

// GET /api/payment/verify?reference=xxx — verify payment + enroll user
router.get('/verify', protect, verifyPayment);

// POST /api/payment/webhook — Paystack webhook (no auth, HMAC-validated in controller)
// NOTE: express.raw() middleware is applied to this route in server.js BEFORE express.json()
router.post('/webhook', paystackWebhook);

export default router;
