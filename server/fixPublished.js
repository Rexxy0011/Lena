import admin from './config/firebase.js';
import { db } from './config/firebase.js';

const fix = async () => {
  const snap = await db.collection('courses').get();
  let count = 0;
  for (const doc of snap.docs) {
    if (doc.data().isPublished !== true) {
      await db.collection('courses').doc(doc.id).update({ isPublished: true });
      count++;
      console.log(`Published: ${doc.data().courseTitle}`);
    }
  }
  console.log(`\nDone. Updated ${count} courses.`);
  process.exit(0);
};

fix();
