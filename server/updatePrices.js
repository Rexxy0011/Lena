import admin from './config/firebase.js';
import { db } from './config/firebase.js';

// Reasonable Nigerian prices by category
const priceMap = {
  'Development': { min: 15000, max: 35000 },
  'Design': { min: 12000, max: 25000 },
  'Data Science': { min: 18000, max: 40000 },
  'Business': { min: 10000, max: 25000 },
  'Marketing': { min: 8000, max: 20000 },
  'Finance': { min: 12000, max: 30000 },
  'Personal Development': { min: 5000, max: 15000 },
};

const roundTo500 = (n) => Math.round(n / 500) * 500;

const update = async () => {
  const snap = await db.collection('courses').get();

  for (const doc of snap.docs) {
    const data = doc.data();
    const range = priceMap[data.category] || { min: 10000, max: 25000 };
    const price = roundTo500(range.min + Math.random() * (range.max - range.min));

    await db.collection('courses').doc(doc.id).update({ coursePrice: price });
    console.log(`${data.courseTitle}: ₦${price.toLocaleString()}`);
  }

  console.log(`\nDone. Updated ${snap.size} courses.`);
  process.exit(0);
};

update();
