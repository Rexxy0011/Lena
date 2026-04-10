import { Router } from 'express';
import protect from '../middleware/auth.js';
import requireEducator from '../middleware/requireEducator.js';
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  rateCourse,
} from '../controllers/courseController.js';

const router = Router();

// Public routes
router.get('/', getAllCourses);
router.get('/:id', getCourseById); // protect is optional — handled inside controller

// Educator-only routes
router.post('/', protect, requireEducator, createCourse);
router.put('/:id', protect, requireEducator, updateCourse);
router.delete('/:id', protect, requireEducator, deleteCourse);

// Enrolled student routes
router.post('/:id/rate', protect, rateCourse);

export default router;
