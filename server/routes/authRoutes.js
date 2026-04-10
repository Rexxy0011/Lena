import { Router } from 'express';
import protect from '../middleware/auth.js';
import { syncUser, getMe } from '../controllers/userController.js';

const router = Router();

// POST /api/auth/sync — called after every Firebase login to upsert user in Firestore
router.post('/sync', protect, syncUser);

// GET /api/auth/me — returns authenticated user's Firestore profile
router.get('/me', protect, getMe);

export default router;
