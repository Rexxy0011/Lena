import { db } from '../config/firebase.js';
import admin from '../config/firebase.js';

const documentId = admin.firestore.FieldPath.documentId();

/**
 * GET /api/educator/dashboard
 * Returns { totalEarnings, totalCourses, enrolledStudentsData }
 * Shape matches dummyDashboardData exactly.
 */
export const getDashboard = async (req, res) => {
  try {
    const { uid } = req.user;

    const coursesSnap = await db.collection('courses')
      .where('educator', '==', uid)
      .get();

    if (coursesSnap.empty) {
      return res.status(200).json({
        success: true,
        dashboard: { totalEarnings: 0, totalCourses: 0, enrolledStudentsData: [] },
      });
    }

    const courseIds = coursesSnap.docs.map((d) => d.id);
    const courseTitleMap = {};
    coursesSnap.docs.forEach((d) => { courseTitleMap[d.id] = d.data().courseTitle; });

    // Get enrollments for this educator's courses (in 30-item batches)
    let allEnrollments = [];
    for (let i = 0; i < courseIds.length; i += 30) {
      const chunk = courseIds.slice(i, i + 30);
      const snap = await db.collection('enrollments')
        .where('courseId', 'in', chunk)
        .where('status', '==', 'active')
        .get();
      allEnrollments.push(...snap.docs.map((d) => d.data()));
    }

    const totalEarnings = allEnrollments.reduce((sum, e) => sum + (e.amount / 100), 0);

    // Fetch student profiles
    const studentIds = [...new Set(allEnrollments.map((e) => e.studentId))];
    const studentMap = {};
    for (let i = 0; i < studentIds.length; i += 30) {
      const chunk = studentIds.slice(i, i + 30);
      const snap = await db.collection('users').where(documentId, 'in', chunk).get();
      snap.docs.forEach((d) => { studentMap[d.id] = d.data(); });
    }

    const enrolledStudentsData = allEnrollments.map((e) => ({
      courseTitle: courseTitleMap[e.courseId] || '',
      student: {
        _id: e.studentId,
        name: studentMap[e.studentId]?.name || '',
        imageUrl: studentMap[e.studentId]?.imageUrl || '',
      },
    }));

    return res.status(200).json({
      success: true,
      dashboard: {
        totalEarnings: parseFloat(totalEarnings.toFixed(2)),
        totalCourses: courseIds.length,
        enrolledStudentsData,
      },
    });
  } catch (err) {
    console.error('getDashboard error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * GET /api/educator/courses
 * Returns all courses created by the authenticated educator.
 */
export const getEducatorCourses = async (req, res) => {
  try {
    const { uid } = req.user;

    const snap = await db.collection('courses')
      .where('educator', '==', uid)
      .get();

    const courses = snap.docs
      .map((d) => ({ _id: d.id, ...d.data() }))
      .sort((a, b) => (b.createdAt?._seconds || 0) - (a.createdAt?._seconds || 0));
    return res.status(200).json({ success: true, courses });
  } catch (err) {
    console.error('getEducatorCourses error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * GET /api/educator/students
 * Returns all students enrolled in this educator's courses.
 * Shape: [{ student: { _id, name, imageUrl }, courseTitle, purchaseDate }]
 * Matches dummyStudentEnrolled shape.
 */
export const getEnrolledStudents = async (req, res) => {
  try {
    const { uid } = req.user;

    const coursesSnap = await db.collection('courses')
      .where('educator', '==', uid)
      .get();

    if (coursesSnap.empty) {
      return res.status(200).json({ success: true, students: [] });
    }

    const courseIds = coursesSnap.docs.map((d) => d.id);
    const courseTitleMap = {};
    coursesSnap.docs.forEach((d) => { courseTitleMap[d.id] = d.data().courseTitle; });

    let allEnrollments = [];
    for (let i = 0; i < courseIds.length; i += 30) {
      const chunk = courseIds.slice(i, i + 30);
      const snap = await db.collection('enrollments')
        .where('courseId', 'in', chunk)
        .where('status', '==', 'active')
        .get();
      allEnrollments.push(...snap.docs.map((d) => d.data()));
    }

    const studentIds = [...new Set(allEnrollments.map((e) => e.studentId))];
    const studentMap = {};
    for (let i = 0; i < studentIds.length; i += 30) {
      const chunk = studentIds.slice(i, i + 30);
      const snap = await db.collection('users').where(documentId, 'in', chunk).get();
      snap.docs.forEach((d) => { studentMap[d.id] = d.data(); });
    }

    const students = allEnrollments.map((e) => ({
      courseTitle: courseTitleMap[e.courseId] || '',
      purchaseDate: e.purchaseDate,
      student: {
        _id: e.studentId,
        name: studentMap[e.studentId]?.name || '',
        imageUrl: studentMap[e.studentId]?.imageUrl || '',
      },
    }));

    return res.status(200).json({ success: true, students });
  } catch (err) {
    console.error('getEnrolledStudents error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
