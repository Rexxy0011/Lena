import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes       from './routes/authRoutes.js';
import courseRoutes     from './routes/courseRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import progressRoutes   from './routes/progressRoutes.js';
import paymentRoutes    from './routes/paymentRoutes.js';
import educatorRoutes   from './routes/educatorRoutes.js';

const app = express();

// Security headers (relaxed for cross-origin API access)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: false,
}));

// CORS — allow requests from frontend (production + local dev)
app.use(cors({
  origin: [process.env.FRONTEND_URL, 'http://localhost:5173'].filter(Boolean),
  credentials: true,
}));

// Logging
app.use(morgan('dev'));

// IMPORTANT: Paystack webhook requires the raw request body for HMAC validation.
// This MUST be registered BEFORE express.json() or the signature check will fail.
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

// JSON body parser for all other routes
app.use(express.json());

// Routes
app.use('/api/auth',        authRoutes);
app.use('/api/courses',     courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/progress',    progressRoutes);
app.use('/api/payment',     paymentRoutes);
app.use('/api/educator',    educatorRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Lena server running on http://localhost:${PORT}`));

// Export for Vercel serverless
export default app;
