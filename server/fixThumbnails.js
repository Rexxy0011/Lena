/**
 * Fixes broken thumbnails for specific courses in Firestore.
 * Usage: node fixThumbnails.js
 */

import { db } from './config/firebase.js';

const HQ = (id) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

// Map of courseTitle → new thumbnail URL
const fixes = {
  'Leadership & Team Management':
    HQ('qp0HIF3SfI4'),          // Simon Sinek — "How Great Leaders Inspire Action" (most viewed TED talk)

  'Product Management — From Idea to Launch':
    HQ('yUOC-Y0f5ZQ'),          // Product School — Product Management full course

  'Data Analysis with Python & Pandas':
    HQ('ZyhVh-qRZPA'),          // Corey Schafer — Pandas tutorials (very popular)

  'Startup Fundamentals — Build Your Business':
    HQ('CBYhVcO4WgI'),          // Y Combinator — How to Start a Startup

  'Build Full Stack E-Commerce MERN App':
    HQ('y99YgaQjgx4'),          // MERN stack tutorial

  'Productivity & Deep Work — Get More Done':
    HQ('arj7oStGLkU'),          // Tim Urban TED Talk — master procrastinator (100M+ views)

  'Digital Marketing Masterclass 2024':
    HQ('xBIVlM435Zg'),          // Seth Godin TED Talk — how to get ideas to spread

  'Social Media Marketing — Grow Any Brand':
    HQ('q5ASe_sxRYI'),          // Simplilearn — Social Media Marketing Course (verified working)
};

const snap = await db.collection('courses').get();
let fixed = 0;

for (const doc of snap.docs) {
  const title = doc.data().courseTitle;
  if (fixes[title]) {
    await doc.ref.update({ courseThumbnail: fixes[title] });
    console.log(`✅ Fixed: ${title}`);
    fixed++;
  }
}

console.log(`\nDone — ${fixed} thumbnails updated.`);
process.exit(0);
