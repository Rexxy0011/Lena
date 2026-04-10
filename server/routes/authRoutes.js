import { Router } from 'express';
import protect from '../middleware/auth.js';
import { syncUser, getMe, becomeEducator } from '../controllers/userController.js';

const router = Router();

router.post('/sync', protect, syncUser);
router.get('/me', protect, getMe);
router.post('/become-educator', protect, becomeEducator);

export default router;
