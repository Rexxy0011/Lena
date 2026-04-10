/**
 * Seed script — creates one sample course in Firestore.
 * Usage:  node seed.js <educatorUid>
 * Example: node seed.js abc123xyz
 */

import { db, FieldValue } from './config/firebase.js';
import { randomUUID } from 'crypto';

const educatorUid = process.argv[2];

if (!educatorUid) {
  console.error('Usage: node seed.js <educatorUid>');
  process.exit(1);
}

const course = {
  courseTitle: 'Build Full Stack E-Commerce MERN App',
  courseDescription: `
    <h2>What you'll learn</h2>
    <p>Build a production-ready full stack e-commerce application from scratch using MongoDB, Express, React, and Node.js. You'll implement product listings, cart management, user authentication, order tracking, and Stripe payments.</p>
    <h2>Who this course is for</h2>
    <p>Developers who know basic JavaScript and want to build real-world full stack applications with the MERN stack.</p>
    <h2>Requirements</h2>
    <ul>
      <li>Basic knowledge of HTML, CSS and JavaScript</li>
      <li>A computer with Node.js installed</li>
      <li>No prior MERN experience needed</li>
    </ul>
  `.trim(),
  coursePrice: 49.99,
  discount: 20,
  isPublished: true,
  courseThumbnail: 'https://i.imgur.com/ShdF63V.jpeg',
  category: 'Development',
  educator: educatorUid,
  enrolledStudents: [],
  courseRatings: [],
  courseContent: [
    {
      chapterId: randomUUID(),
      chapterOrder: 1,
      chapterTitle: 'Project Setup & Introduction',
      chapterContent: [
        {
          lectureId: randomUUID(),
          lectureOrder: 1,
          lectureTitle: 'Welcome & What We Will Build',
          lectureDuration: 5,
          lectureUrl: 'https://www.youtube.com/watch?v=y99YgaQjgx4',
          isPreviewFree: true,
        },
        {
          lectureId: randomUUID(),
          lectureOrder: 2,
          lectureTitle: 'Setting Up the MERN Stack',
          lectureDuration: 12,
          lectureUrl: 'https://www.youtube.com/watch?v=y99YgaQjgx4',
          isPreviewFree: true,
        },
        {
          lectureId: randomUUID(),
          lectureOrder: 3,
          lectureTitle: 'Folder Structure & Git Init',
          lectureDuration: 8,
          lectureUrl: 'https://www.youtube.com/watch?v=y99YgaQjgx4',
          isPreviewFree: false,
        },
      ],
    },
    {
      chapterId: randomUUID(),
      chapterOrder: 2,
      chapterTitle: 'Backend — Express & MongoDB',
      chapterContent: [
        {
          lectureId: randomUUID(),
          lectureOrder: 1,
          lectureTitle: 'Setting Up Express Server',
          lectureDuration: 15,
          lectureUrl: 'https://www.youtube.com/watch?v=y99YgaQjgx4',
          isPreviewFree: false,
        },
        {
          lectureId: randomUUID(),
          lectureOrder: 2,
          lectureTitle: 'Connecting to MongoDB with Mongoose',
          lectureDuration: 14,
          lectureUrl: 'https://www.youtube.com/watch?v=y99YgaQjgx4',
          isPreviewFree: false,
        },
        {
          lectureId: randomUUID(),
          lectureOrder: 3,
          lectureTitle: 'Product Model & REST API',
          lectureDuration: 22,
          lectureUrl: 'https://www.youtube.com/watch?v=y99YgaQjgx4',
          isPreviewFree: false,
        },
        {
          lectureId: randomUUID(),
          lectureOrder: 4,
          lectureTitle: 'User Auth with JWT',
          lectureDuration: 25,
          lectureUrl: 'https://www.youtube.com/watch?v=y99YgaQjgx4',
          isPreviewFree: false,
        },
      ],
    },
    {
      chapterId: randomUUID(),
      chapterOrder: 3,
      chapterTitle: 'Frontend — React & Tailwind',
      chapterContent: [
        {
          lectureId: randomUUID(),
          lectureOrder: 1,
          lectureTitle: 'Vite + React Setup & Routing',
          lectureDuration: 13,
          lectureUrl: 'https://www.youtube.com/watch?v=y99YgaQjgx4',
          isPreviewFree: false,
        },
        {
          lectureId: randomUUID(),
          lectureOrder: 2,
          lectureTitle: 'Product Listing Page',
          lectureDuration: 20,
          lectureUrl: 'https://www.youtube.com/watch?v=y99YgaQjgx4',
          isPreviewFree: false,
        },
        {
          lectureId: randomUUID(),
          lectureOrder: 3,
          lectureTitle: 'Product Detail & Cart',
          lectureDuration: 24,
          lectureUrl: 'https://www.youtube.com/watch?v=y99YgaQjgx4',
          isPreviewFree: false,
        },
        {
          lectureId: randomUUID(),
          lectureOrder: 4,
          lectureTitle: 'User Login & Register UI',
          lectureDuration: 18,
          lectureUrl: 'https://www.youtube.com/watch?v=y99YgaQjgx4',
          isPreviewFree: false,
        },
      ],
    },
    {
      chapterId: randomUUID(),
      chapterOrder: 4,
      chapterTitle: 'Stripe Payments & Orders',
      chapterContent: [
        {
          lectureId: randomUUID(),
          lectureOrder: 1,
          lectureTitle: 'Integrating Stripe Checkout',
          lectureDuration: 28,
          lectureUrl: 'https://www.youtube.com/watch?v=y99YgaQjgx4',
          isPreviewFree: false,
        },
        {
          lectureId: randomUUID(),
          lectureOrder: 2,
          lectureTitle: 'Order Model & Webhook',
          lectureDuration: 22,
          lectureUrl: 'https://www.youtube.com/watch?v=y99YgaQjgx4',
          isPreviewFree: false,
        },
        {
          lectureId: randomUUID(),
          lectureOrder: 3,
          lectureTitle: 'Order History Page',
          lectureDuration: 16,
          lectureUrl: 'https://www.youtube.com/watch?v=y99YgaQjgx4',
          isPreviewFree: false,
        },
      ],
    },
    {
      chapterId: randomUUID(),
      chapterOrder: 5,
      chapterTitle: 'Admin Dashboard & Deployment',
      chapterContent: [
        {
          lectureId: randomUUID(),
          lectureOrder: 1,
          lectureTitle: 'Admin Panel — Manage Products',
          lectureDuration: 20,
          lectureUrl: 'https://www.youtube.com/watch?v=y99YgaQjgx4',
          isPreviewFree: false,
        },
        {
          lectureId: randomUUID(),
          lectureOrder: 2,
          lectureTitle: 'Admin Panel — Manage Orders',
          lectureDuration: 17,
          lectureUrl: 'https://www.youtube.com/watch?v=y99YgaQjgx4',
          isPreviewFree: false,
        },
        {
          lectureId: randomUUID(),
          lectureOrder: 3,
          lectureTitle: 'Deploying to Render & Vercel',
          lectureDuration: 25,
          lectureUrl: 'https://www.youtube.com/watch?v=y99YgaQjgx4',
          isPreviewFree: false,
        },
      ],
    },
  ],
  createdAt: FieldValue.serverTimestamp(),
  updatedAt: FieldValue.serverTimestamp(),
};

const ref = db.collection('courses').doc();
await ref.set(course);

console.log(`✅ Course created!`);
console.log(`   ID    : ${ref.id}`);
console.log(`   Title : ${course.courseTitle}`);
console.log(`   Price : $${course.coursePrice} (${course.discount}% off → $${(course.coursePrice * (1 - course.discount / 100)).toFixed(2)})`);
console.log(`   Chapters: ${course.courseContent.length}`);
process.exit(0);
