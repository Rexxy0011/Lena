import { db, FieldValue } from '../config/firebase.js';

/**
 * Returns true if the given user has an active enrollment in the given course.
 */
export const isEnrolled = async (uid, courseId) => {
  const snap = await db.collection('enrollments')
    .where('studentId', '==', uid)
    .where('courseId', '==', courseId)
    .where('status', '==', 'active')
    .limit(1)
    .get();
  return !snap.empty;
};

/**
 * Strips lectureUrl from any lecture that is not free-preview.
 * Called before sending a course to unauthenticated users or non-enrolled students.
 */
export const sanitizeCourseForPublic = (courseData) => {
  return {
    ...courseData,
    courseContent: courseData.courseContent.map((chapter) => ({
      ...chapter,
      chapterContent: chapter.chapterContent.map((lecture) => ({
        ...lecture,
        lectureUrl: lecture.isPreviewFree ? lecture.lectureUrl : null,
      })),
    })),
  };
};

/**
 * Upserts a user document in Firestore.
 * Creates on first login; updates name/imageUrl on subsequent logins.
 */
export const upsertUser = async (uid, { name, email, imageUrl }) => {
  const ref = db.collection('users').doc(uid);
  const snap = await ref.get();

  if (!snap.exists) {
    await ref.set({
      uid,
      name,
      email,
      imageUrl: imageUrl || '',
      isEducator: false,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  } else {
    await ref.update({
      name,
      imageUrl: imageUrl || snap.data().imageUrl,
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  return (await ref.get()).data();
};

/**
 * Creates an enrollment + initializes a progress doc inside a Firestore batch.
 * Safe to call after successful Paystack payment verification.
 * Idempotent — skips silently if the user is already enrolled.
 */
export const enrollUserInCourse = async (uid, courseId, paystackRef, amountInKobo) => {
  // Idempotency check
  const alreadyEnrolled = await isEnrolled(uid, courseId);
  if (alreadyEnrolled) return;

  const batch = db.batch();

  // 1. Enrollment document
  const enrollRef = db.collection('enrollments').doc();
  batch.set(enrollRef, {
    studentId: uid,
    courseId,
    paystackRef,
    amount: amountInKobo,
    purchaseDate: FieldValue.serverTimestamp(),
    status: 'active',
  });

  // 2. Add uid to course's enrolledStudents array
  batch.update(db.collection('courses').doc(courseId), {
    enrolledStudents: FieldValue.arrayUnion(uid),
  });

  // 3. Initialize progress subcollection doc
  const progressRef = db.collection('users').doc(uid).collection('progress').doc(courseId);
  batch.set(progressRef, {
    courseId,
    completedLectures: [],
    percentage: 0,
    lastUpdated: FieldValue.serverTimestamp(),
  });

  await batch.commit();
};
