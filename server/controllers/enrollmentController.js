import { db } from '../config/firebase.js';
import { isEnrolled, enrollUserInCourse } from '../services/firestoreService.js';
import admin from '../config/firebase.js';

/**
 * GET /api/enrollments/my-courses
 * Returns full course objects for all courses the authenticated user is enrolled in.
 */
export const getMyCourses = async (req, res) => {
  try {
    const { uid } = req.user;

    const enrollSnap = await db.collection('enrollments')
      .where('studentId', '==', uid)
      .where('status', '==', 'active')
      .get();

    if (enrollSnap.empty) {
      return res.status(200).json({ success: true, courses: [] });
    }

    const courseIds = enrollSnap.docs.map((d) => d.data().courseId);

    // Firestore 'in' supports up to 30 items per query
    const chunks = [];
    for (let i = 0; i < courseIds.length; i += 30) {
      chunks.push(courseIds.slice(i, i + 30));
    }

    const courseDocs = [];
    for (const chunk of chunks) {
      const snap = await db.collection('courses')
        .where(admin.firestore.FieldPath.documentId(), 'in', chunk)
        .get();
      courseDocs.push(...snap.docs);
    }

    const courses = courseDocs.map((d) => ({ _id: d.id, ...d.data() }));
    return res.status(200).json({ success: true, courses });
  } catch (err) {
    console.error('getMyCourses error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * POST /api/enrollments/free/:courseId
 * Allows the course educator to enroll in their own course for free.
 */
export const freeEnroll = async (req, res) => {
  try {
    const { uid } = req.user;
    const { courseId } = req.params;

    const courseSnap = await db.collection('courses').doc(courseId).get();
    if (!courseSnap.exists) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    if (courseSnap.data().educator !== uid) {
      return res.status(403).json({ success: false, message: 'Only the course educator can use free enrollment' });
    }

    await enrollUserInCourse(uid, courseId, 'free', 0);
    return res.status(200).json({ success: true, courseId });
  } catch (err) {
    console.error('freeEnroll error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * GET /api/enrollments/check/:courseId
 * Returns whether the authenticated user is enrolled in a specific course.
 * Used by CourseDetails.jsx to toggle the "Already Enrolled" button state.
 */
export const checkEnrollment = async (req, res) => {
  try {
    const { uid } = req.user;
    const { courseId } = req.params;

    const enrolled = await isEnrolled(uid, courseId);
    return res.status(200).json({ success: true, enrolled });
  } catch (err) {
    console.error('checkEnrollment error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
