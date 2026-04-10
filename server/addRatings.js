/**
 * Adds realistic ratings (3–5 stars) to all courses in Firestore.
 * Usage: node addRatings.js
 */

import { db } from './config/firebase.js';
import { randomUUID } from 'crypto';

// Weighted random rating — skewed toward 4–5 like real platforms
const randomRating = () => {
  const rand = Math.random();
  if (rand < 0.05) return 3;      // 5%  → 3 stars
  if (rand < 0.20) return 3.5;    // 15% → 3.5 stars
  if (rand < 0.40) return 4;      // 20% → 4 stars
  if (rand < 0.70) return 4.5;    // 30% → 4.5 stars
  return 5;                        // 30% → 5 stars
};

const randomCount = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const snap = await db.collection('courses').get();
let updated = 0;

for (const doc of snap.docs) {
  const count = randomCount(8, 25);

  const courseRatings = Array.from({ length: count }, () => ({
    _id: randomUUID(),
    userId: randomUUID(), // fake student UIDs
    rating: randomRating(),
  }));

  await doc.ref.update({ courseRatings });

  const avg = (courseRatings.reduce((s, r) => s + r.rating, 0) / count).toFixed(1);
  console.log(`⭐ ${avg} (${count} ratings) — ${doc.data().courseTitle}`);
  updated++;
}

console.log(`\n✅ Done — ${updated} courses updated.`);
process.exit(0);
