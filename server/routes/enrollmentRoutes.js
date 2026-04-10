import { Router } from 'express';
import protect from '../middleware/auth.js';
import { getMyCourses, checkEnrollment, freeEnroll } from '../controllers/enrollmentController.js';

const router = Router();

// GET /api/enrollments/my-courses — list all courses the user is enrolled in
router.get('/my-courses', protect, getMyCourses);

// POST /api/enrollments/free/:courseId — educator enrolls in their own course for free
router.post('/free/:courseId', protect, freeEnroll);

// GET /api/enrollments/check/:courseId — check if user is enrolled (for CourseDetails page)
router.get('/check/:courseId', protect, checkEnrollment);

export default router;
