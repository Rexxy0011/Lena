import { db, FieldValue } from '../config/firebase.js';
import { isEnrolled, sanitizeCourseForPublic } from '../services/firestoreService.js';
import { randomUUID } from 'crypto';

const uuidv4 = () => randomUUID();

/**
 * GET /api/courses
 * Returns all published courses. Lecture URLs are stripped for non-preview lectures.
 * Supports optional ?category= and ?search= query params.
 */
export const getAllCourses = async (req, res) => {
  try {
    const { category, search } = req.query;

    const snap = await db.collection('courses').where('isPublished', '==', true).get();
    let courses = snap.docs.map((d) => ({ _id: d.id, ...d.data() }));

    if (category) {
      courses = courses.filter((c) => c.category === category);
    }

    // Sort newest first in JS to avoid needing a composite Firestore index
    courses.sort((a, b) => {
      const aTime = a.createdAt?._seconds ?? 0;
      const bTime = b.createdAt?._seconds ?? 0;
      return bTime - aTime;
    });

    // Client-side search filter (Firestore doesn't support full-text search natively)
    if (search) {
      const term = search.toLowerCase();
      courses = courses.filter((c) =>
        c.courseTitle?.toLowerCase().includes(term) ||
        c.courseDescription?.toLowerCase().includes(term)
      );
    }

    // Always sanitize for public listing (no lecture URLs exposed)
    const sanitized = courses.map(sanitizeCourseForPublic);
    return res.status(200).json({ success: true, courses: sanitized });
  } catch (err) {
    console.error('getAllCourses error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * GET /api/courses/:id
 * Returns a single course. If the requester is enrolled, full lecture URLs are included.
 * Tries to read uid from token if Authorization header is present (optional auth).
 */
export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const snap = await db.collection('courses').doc(id).get();

    if (!snap.exists) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    let courseData = { _id: snap.id, ...snap.data() };

    const uid = req.user?.uid;
    const isCreator = uid && courseData.educator === uid;
    const enrolled = (!isCreator && uid) ? await isEnrolled(uid, id) : false;

    // Creator always gets full access; enrolled students get full access; others get preview only
    if (!isCreator && !enrolled) {
      courseData = sanitizeCourseForPublic(courseData);
    }

    return res.status(200).json({ success: true, course: courseData });
  } catch (err) {
    console.error('getCourseById error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * POST /api/courses
 * Creates a new course. Educator only.
 * Matches the frontend courseContent shape exactly.
 */
export const createCourse = async (req, res) => {
  try {
    const { uid } = req.user;
    const {
      courseTitle,
      courseDescription,
      coursePrice,
      discount,
      courseThumbnail,
      category,
      courseContent,
    } = req.body;

    if (!courseTitle || !coursePrice || !courseContent) {
      return res.status(400).json({ success: false, message: 'courseTitle, coursePrice, and courseContent are required' });
    }

    // Assign stable IDs and enforce ordering
    const processedContent = (courseContent || []).map((chapter, ci) => ({
      chapterId: `chapter_${uuidv4()}`,
      chapterOrder: ci + 1,
      chapterTitle: chapter.chapterTitle,
      chapterContent: (chapter.chapterContent || []).map((lecture, li) => ({
        lectureId: `lecture_${uuidv4()}`,
        lectureTitle: lecture.lectureTitle,
        lectureDuration: lecture.lectureDuration || 0,
        lectureUrl: lecture.lectureUrl || '',
        isPreviewFree: lecture.isPreviewFree || false,
        lectureOrder: li + 1,
      })),
    }));

    const ref = db.collection('courses').doc();
    await ref.set({
      courseTitle,
      courseDescription: courseDescription || '',
      coursePrice: Number(coursePrice),
      discount: Number(discount) || 0,
      isPublished: false,
      courseThumbnail: courseThumbnail || '',
      educator: uid,
      category: category || 'General',
      enrolledStudents: [],
      courseRatings: [],
      courseContent: processedContent,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return res.status(201).json({ success: true, courseId: ref.id });
  } catch (err) {
    console.error('createCourse error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * PUT /api/courses/:id
 * Updates an existing course. Only the owning educator can update it.
 */
export const updateCourse = async (req, res) => {
  try {
    const { uid } = req.user;
    const { id } = req.params;

    const snap = await db.collection('courses').doc(id).get();
    if (!snap.exists) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    if (snap.data().educator !== uid) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this course' });
    }

    const allowedFields = [
      'courseTitle', 'courseDescription', 'coursePrice', 'discount',
      'isPublished', 'courseThumbnail', 'category', 'courseContent',
    ];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }
    updates.updatedAt = FieldValue.serverTimestamp();

    await db.collection('courses').doc(id).update(updates);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('updateCourse error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * DELETE /api/courses/:id
 * Deletes a course. Only the owning educator can delete it.
 */
export const deleteCourse = async (req, res) => {
  try {
    const { uid } = req.user;
    const { id } = req.params;

    const snap = await db.collection('courses').doc(id).get();
    if (!snap.exists) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    if (snap.data().educator !== uid) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this course' });
    }

    await db.collection('courses').doc(id).delete();
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('deleteCourse error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * POST /api/courses/:id/rate
 * Adds or updates a rating for a course. Must be enrolled to rate.
 */
export const rateCourse = async (req, res) => {
  try {
    const { uid } = req.user;
    const { id } = req.params;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    const enrolled = await isEnrolled(uid, id);
    if (!enrolled) {
      return res.status(403).json({ success: false, message: 'Must be enrolled to rate this course' });
    }

    const courseRef = db.collection('courses').doc(id);
    const courseSnap = await courseRef.get();
    if (!courseSnap.exists) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const existingRatings = courseSnap.data().courseRatings || [];
    // Replace existing rating from this user, or add new one
    const filtered = existingRatings.filter((r) => r.userId !== uid);
    filtered.push({ userId: uid, rating: Number(rating), _id: uuidv4() });

    await courseRef.update({ courseRatings: filtered, updatedAt: FieldValue.serverTimestamp() });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('rateCourse error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
