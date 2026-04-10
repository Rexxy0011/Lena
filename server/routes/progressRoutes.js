import { Router } from 'express';
import protect from '../middleware/auth.js';
import { updateProgress, getProgress } from '../controllers/progressController.js';

const router = Router();

// POST /api/progress/update — mark a lecture as completed
router.post('/update', protect, updateProgress);

// GET /api/progress/:courseId — get progress for a specific course
router.get('/:courseId', protect, getProgress);

export default router;
