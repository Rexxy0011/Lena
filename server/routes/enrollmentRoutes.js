import { Router } from 'express';
import protect from '../middleware/auth.js';
import { getMyCourses, checkEnrollment } from '../controllers/enrollmentController.js';

const router = Router();

// GET /api/enrollments/my-courses — list all courses the user is enrolled in
router.get('/my-courses', protect, getMyCourses);

// GET /api/enrollments/check/:courseId — check if user is enrolled (for CourseDetails page)
router.get('/check/:courseId', protect, checkEnrollment);

export default router;
