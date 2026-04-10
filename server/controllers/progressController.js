import { db, FieldValue } from '../config/firebase.js';
import { isEnrolled } from '../services/firestoreService.js';

/**
 * POST /api/progress/update
 * Marks a lecture as completed and updates the stored percentage.
 * Body: { courseId, lectureId }
 */
export const updateProgress = async (req, res) => {
  try {
    const { uid } = req.user;
    const { courseId, lectureId } = req.body;

    if (!courseId || !lectureId) {
      return res.status(400).json({ success: false, message: 'courseId and lectureId are required' });
    }

    // Verify the user is enrolled
    const enrolled = await isEnrolled(uid, courseId);
    if (!enrolled) {
      return res.status(403).json({ success: false, message: 'Not enrolled in this course' });
    }

    // Get total lecture count from course document for percentage calculation
    const courseSnap = await db.collection('courses').doc(courseId).get();
    if (!courseSnap.exists) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const courseData = courseSnap.data();
    const totalLectures = courseData.courseContent.reduce(
      (sum, chapter) => sum + chapter.chapterContent.length,
      0
    );

    const progressRef = db.collection('users').doc(uid).collection('progress').doc(courseId);

    // arrayUnion is idempotent — re-marking a completed lecture is safe
    await progressRef.update({
      completedLectures: FieldValue.arrayUnion(lectureId),
      lastUpdated: FieldValue.serverTimestamp(),
    });

    // Re-read after update to get accurate count, then store percentage
    const updated = (await progressRef.get()).data();
    const percentage = totalLectures > 0
      ? Math.round((updated.completedLectures.length / totalLectures) * 100)
      : 0;

    await progressRef.update({ percentage });

    return res.status(200).json({ success: true, percentage });
  } catch (err) {
    console.error('updateProgress error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * GET /api/progress/:courseId
 * Returns the progress document for the authenticated user in a given course.
 * Used by Player.jsx to show blue tick icons and progress bar.
 */
export const getProgress = async (req, res) => {
  try {
    const { uid } = req.user;
    const { courseId } = req.params;

    const progressSnap = await db.collection('users').doc(uid)
      .collection('progress').doc(courseId).get();

    if (!progressSnap.exists) {
      // Return empty progress — user may be enrolled but hasn't started
      return res.status(200).json({
        success: true,
        progress: { courseId, completedLectures: [], percentage: 0 },
      });
    }

    return res.status(200).json({ success: true, progress: progressSnap.data() });
  } catch (err) {
    console.error('getProgress error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
