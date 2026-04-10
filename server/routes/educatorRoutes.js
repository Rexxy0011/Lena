import { Router } from 'express';
import protect from '../middleware/auth.js';
import requireEducator from '../middleware/requireEducator.js';
import {
  getDashboard,
  getEducatorCourses,
  getEnrolledStudents,
} from '../controllers/educatorController.js';

const router = Router();

// All educator routes require auth + educator role
router.use(protect, requireEducator);

// GET /api/educator/dashboard — earnings, course count, recent students
router.get('/dashboard', getDashboard);

// GET /api/educator/courses — all courses created by this educator
router.get('/courses', getEducatorCourses);

// GET /api/educator/students — list of enrolled students across all educator's courses
router.get('/students', getEnrolledStudents);

export default router;
