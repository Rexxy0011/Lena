/**
 * Seed script — creates 20 sample courses across all categories.
 * Usage:  node seed.js <educatorUid>
 */

import { db, FieldValue } from './config/firebase.js';
import { randomUUID } from 'crypto';

const educatorUid = process.argv[2];
if (!educatorUid) {
  console.error('Usage: node seed.js <educatorUid>');
  process.exit(1);
}

const makeCourse = (title, description, price, discount, thumbnail, category, chapters) => ({
  courseTitle: title,
  courseDescription: description,
  coursePrice: price,
  discount,
  isPublished: true,
  courseThumbnail: thumbnail,
  category,
  educator: educatorUid,
  enrolledStudents: [],
  courseRatings: [],
  courseContent: chapters.map((ch, ci) => ({
    chapterId: randomUUID(),
    chapterOrder: ci + 1,
    chapterTitle: ch.title,
    chapterContent: ch.lectures.map((lec, li) => ({
      lectureId: randomUUID(),
      lectureOrder: li + 1,
      lectureTitle: lec.title,
      lectureDuration: lec.duration,
      lectureUrl: lec.url,
      isPreviewFree: li === 0,
    })),
  })),
  createdAt: FieldValue.serverTimestamp(),
  updatedAt: FieldValue.serverTimestamp(),
});

const YT = (id) => `https://www.youtube.com/watch?v=${id}`;
const THUMB = (id) => `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

const courses = [
  // ── DEVELOPMENT ──────────────────────────────────────────────
  makeCourse(
    'Python for Beginners — Zero to Hero',
    '<h2>What you\'ll learn</h2><p>Master Python from scratch — variables, loops, functions, OOP, file handling, and real-world projects. One of the most in-demand skills in tech.</p><h2>Requirements</h2><ul><li>No prior experience needed</li><li>A computer with internet access</li></ul>',
    44.99, 15, THUMB('rfscVS0vtbw'), 'Development',
    [
      { title: 'Python Basics', lectures: [
        { title: 'Introduction to Python', duration: 8, url: YT('rfscVS0vtbw') },
        { title: 'Variables & Data Types', duration: 14, url: YT('rfscVS0vtbw') },
        { title: 'String Operations', duration: 12, url: YT('rfscVS0vtbw') },
      ]},
      { title: 'Control Flow', lectures: [
        { title: 'If / Else Statements', duration: 11, url: YT('rfscVS0vtbw') },
        { title: 'Loops — for & while', duration: 15, url: YT('rfscVS0vtbw') },
      ]},
      { title: 'Functions & OOP', lectures: [
        { title: 'Defining Functions', duration: 14, url: YT('rfscVS0vtbw') },
        { title: 'Classes & Objects', duration: 20, url: YT('rfscVS0vtbw') },
        { title: 'Inheritance & Polymorphism', duration: 18, url: YT('rfscVS0vtbw') },
      ]},
    ]
  ),

  makeCourse(
    'React.js — Build Modern Web Apps',
    '<h2>What you\'ll learn</h2><p>Learn React from the ground up: components, state, hooks, routing, context API, and connecting to a REST API. Build a complete project by the end.</p><h2>Requirements</h2><ul><li>Basic HTML, CSS & JavaScript knowledge</li></ul>',
    54.99, 20, THUMB('bMknfKXIFA8'), 'Development',
    [
      { title: 'React Fundamentals', lectures: [
        { title: 'What is React?', duration: 7, url: YT('bMknfKXIFA8') },
        { title: 'JSX & Components', duration: 13, url: YT('bMknfKXIFA8') },
        { title: 'Props & State', duration: 16, url: YT('bMknfKXIFA8') },
      ]},
      { title: 'Hooks', lectures: [
        { title: 'useState & useEffect', duration: 18, url: YT('bMknfKXIFA8') },
        { title: 'useContext & useRef', duration: 14, url: YT('bMknfKXIFA8') },
        { title: 'Custom Hooks', duration: 16, url: YT('bMknfKXIFA8') },
      ]},
      { title: 'Routing & API', lectures: [
        { title: 'React Router v6', duration: 17, url: YT('bMknfKXIFA8') },
        { title: 'Fetching Data from APIs', duration: 19, url: YT('bMknfKXIFA8') },
        { title: 'Final Project', duration: 35, url: YT('bMknfKXIFA8') },
      ]},
    ]
  ),

  makeCourse(
    'Node.js & Express — REST API Masterclass',
    '<h2>What you\'ll learn</h2><p>Build scalable REST APIs with Node.js and Express. Learn routing, middleware, authentication with JWT, MongoDB, and deployment.</p><h2>Requirements</h2><ul><li>JavaScript fundamentals</li></ul>',
    49.99, 10, THUMB('Oe421EPjeBE'), 'Development',
    [
      { title: 'Node.js Basics', lectures: [
        { title: 'What is Node.js?', duration: 9, url: YT('Oe421EPjeBE') },
        { title: 'Modules & NPM', duration: 12, url: YT('Oe421EPjeBE') },
        { title: 'File System & Events', duration: 14, url: YT('Oe421EPjeBE') },
      ]},
      { title: 'Express Framework', lectures: [
        { title: 'Setting Up Express', duration: 11, url: YT('Oe421EPjeBE') },
        { title: 'Routing & Middleware', duration: 16, url: YT('Oe421EPjeBE') },
        { title: 'Error Handling', duration: 13, url: YT('Oe421EPjeBE') },
      ]},
      { title: 'Auth & Database', lectures: [
        { title: 'MongoDB & Mongoose', duration: 18, url: YT('Oe421EPjeBE') },
        { title: 'JWT Authentication', duration: 22, url: YT('Oe421EPjeBE') },
        { title: 'Deploy to Render', duration: 20, url: YT('Oe421EPjeBE') },
      ]},
    ]
  ),

  makeCourse(
    'TypeScript — The Complete Guide',
    '<h2>What you\'ll learn</h2><p>Understand TypeScript deeply: types, interfaces, generics, decorators, and integrating it with React and Node projects.</p><h2>Requirements</h2><ul><li>JavaScript knowledge required</li></ul>',
    44.99, 25, THUMB('BwuLxPH8IDs'), 'Development',
    [
      { title: 'TypeScript Basics', lectures: [
        { title: 'Why TypeScript?', duration: 7, url: YT('BwuLxPH8IDs') },
        { title: 'Types & Interfaces', duration: 15, url: YT('BwuLxPH8IDs') },
        { title: 'Functions & Enums', duration: 13, url: YT('BwuLxPH8IDs') },
      ]},
      { title: 'Advanced Types', lectures: [
        { title: 'Generics', duration: 17, url: YT('BwuLxPH8IDs') },
        { title: 'Union & Intersection Types', duration: 14, url: YT('BwuLxPH8IDs') },
        { title: 'TypeScript with React', duration: 22, url: YT('BwuLxPH8IDs') },
      ]},
    ]
  ),

  // ── DESIGN ───────────────────────────────────────────────────
  makeCourse(
    'UI/UX Design with Figma — Full Course',
    '<h2>What you\'ll learn</h2><p>Learn professional UI/UX design from scratch using Figma. Design wireframes, prototypes, and high-fidelity mockups for web and mobile apps.</p><h2>Requirements</h2><ul><li>No experience needed</li><li>Free Figma account</li></ul>',
    49.99, 20, THUMB('FTFaQWZBqQ8'), 'Design',
    [
      { title: 'Figma Basics', lectures: [
        { title: 'Introduction to Figma', duration: 10, url: YT('FTFaQWZBqQ8') },
        { title: 'Frames, Shapes & Text', duration: 14, url: YT('FTFaQWZBqQ8') },
        { title: 'Components & Variants', duration: 18, url: YT('FTFaQWZBqQ8') },
      ]},
      { title: 'UI Design Principles', lectures: [
        { title: 'Color Theory & Typography', duration: 16, url: YT('FTFaQWZBqQ8') },
        { title: 'Spacing & Layout Grids', duration: 13, url: YT('FTFaQWZBqQ8') },
      ]},
      { title: 'Prototyping & Handoff', lectures: [
        { title: 'Building Interactive Prototypes', duration: 20, url: YT('FTFaQWZBqQ8') },
        { title: 'Developer Handoff', duration: 12, url: YT('FTFaQWZBqQ8') },
        { title: 'Portfolio Project', duration: 30, url: YT('FTFaQWZBqQ8') },
      ]},
    ]
  ),

  makeCourse(
    'Graphic Design Masterclass',
    '<h2>What you\'ll learn</h2><p>Master the fundamentals of graphic design including composition, color, typography, branding, and creating logos using professional tools.</p><h2>Requirements</h2><ul><li>No experience needed</li></ul>',
    39.99, 15, THUMB('ysz5S6PUM-U'), 'Design',
    [
      { title: 'Design Fundamentals', lectures: [
        { title: 'Principles of Design', duration: 12, url: YT('ysz5S6PUM-U') },
        { title: 'Color & Typography', duration: 15, url: YT('ysz5S6PUM-U') },
        { title: 'Composition & Balance', duration: 13, url: YT('ysz5S6PUM-U') },
      ]},
      { title: 'Branding & Logo Design', lectures: [
        { title: 'Brand Identity Basics', duration: 14, url: YT('ysz5S6PUM-U') },
        { title: 'Logo Design Process', duration: 22, url: YT('ysz5S6PUM-U') },
        { title: 'Building a Style Guide', duration: 18, url: YT('ysz5S6PUM-U') },
      ]},
    ]
  ),

  makeCourse(
    'CSS & Tailwind — Modern Web Styling',
    '<h2>What you\'ll learn</h2><p>Go deep on CSS — flexbox, grid, animations, and custom properties. Then master Tailwind CSS for fast, responsive UI development.</p><h2>Requirements</h2><ul><li>Basic HTML knowledge</li></ul>',
    34.99, 10, THUMB('1Rs2ND1ryYc'), 'Design',
    [
      { title: 'CSS Deep Dive', lectures: [
        { title: 'Flexbox Mastery', duration: 18, url: YT('1Rs2ND1ryYc') },
        { title: 'CSS Grid', duration: 16, url: YT('1Rs2ND1ryYc') },
        { title: 'Animations & Transitions', duration: 14, url: YT('1Rs2ND1ryYc') },
      ]},
      { title: 'Tailwind CSS', lectures: [
        { title: 'Tailwind Setup & Utilities', duration: 13, url: YT('1Rs2ND1ryYc') },
        { title: 'Responsive Design', duration: 15, url: YT('1Rs2ND1ryYc') },
        { title: 'Building a Landing Page', duration: 28, url: YT('1Rs2ND1ryYc') },
      ]},
    ]
  ),

  // ── DATA SCIENCE ─────────────────────────────────────────────
  makeCourse(
    'Machine Learning with Python — Beginner to Pro',
    '<h2>What you\'ll learn</h2><p>Learn supervised and unsupervised machine learning using Python, scikit-learn, and real datasets. Build regression, classification, and clustering models.</p><h2>Requirements</h2><ul><li>Basic Python knowledge</li></ul>',
    59.99, 25, THUMB('7eh4d6sabA0'), 'Data Science',
    [
      { title: 'ML Foundations', lectures: [
        { title: 'What is Machine Learning?', duration: 10, url: YT('7eh4d6sabA0') },
        { title: 'Data Preprocessing', duration: 16, url: YT('7eh4d6sabA0') },
        { title: 'Feature Engineering', duration: 18, url: YT('7eh4d6sabA0') },
      ]},
      { title: 'Supervised Learning', lectures: [
        { title: 'Linear Regression', duration: 20, url: YT('7eh4d6sabA0') },
        { title: 'Decision Trees & Random Forest', duration: 22, url: YT('7eh4d6sabA0') },
        { title: 'Support Vector Machines', duration: 19, url: YT('7eh4d6sabA0') },
      ]},
      { title: 'Model Evaluation', lectures: [
        { title: 'Cross Validation', duration: 15, url: YT('7eh4d6sabA0') },
        { title: 'Hyperparameter Tuning', duration: 17, url: YT('7eh4d6sabA0') },
        { title: 'Final Capstone Project', duration: 35, url: YT('7eh4d6sabA0') },
      ]},
    ]
  ),

  makeCourse(
    'Data Analysis with Python & Pandas',
    '<h2>What you\'ll learn</h2><p>Analyze real-world datasets using Python, Pandas, NumPy, and Matplotlib. Clean data, build visualizations, and extract meaningful insights.</p><h2>Requirements</h2><ul><li>Basic Python knowledge</li></ul>',
    44.99, 20, THUMB('vmEHCKfkNds'), 'Data Science',
    [
      { title: 'Pandas Basics', lectures: [
        { title: 'DataFrames & Series', duration: 14, url: YT('vmEHCKfkNds') },
        { title: 'Filtering & Sorting', duration: 13, url: YT('vmEHCKfkNds') },
        { title: 'GroupBy & Aggregation', duration: 15, url: YT('vmEHCKfkNds') },
      ]},
      { title: 'Data Cleaning', lectures: [
        { title: 'Handling Missing Data', duration: 12, url: YT('vmEHCKfkNds') },
        { title: 'Merging & Joining Datasets', duration: 14, url: YT('vmEHCKfkNds') },
      ]},
      { title: 'Visualization', lectures: [
        { title: 'Matplotlib & Seaborn', duration: 18, url: YT('vmEHCKfkNds') },
        { title: 'Building a Data Dashboard', duration: 25, url: YT('vmEHCKfkNds') },
      ]},
    ]
  ),

  makeCourse(
    'SQL for Data Analysis — Zero to Advanced',
    '<h2>What you\'ll learn</h2><p>Master SQL for data analysis: SELECT queries, JOINs, subqueries, window functions, CTEs, and writing production-level database queries.</p><h2>Requirements</h2><ul><li>No experience needed</li></ul>',
    39.99, 15, THUMB('HXV3zeQKqGY'), 'Data Science',
    [
      { title: 'SQL Foundations', lectures: [
        { title: 'SELECT & WHERE', duration: 12, url: YT('HXV3zeQKqGY') },
        { title: 'ORDER BY & LIMIT', duration: 10, url: YT('HXV3zeQKqGY') },
        { title: 'Aggregate Functions', duration: 13, url: YT('HXV3zeQKqGY') },
      ]},
      { title: 'Joins & Subqueries', lectures: [
        { title: 'INNER, LEFT & RIGHT JOINs', duration: 17, url: YT('HXV3zeQKqGY') },
        { title: 'Subqueries & CTEs', duration: 16, url: YT('HXV3zeQKqGY') },
      ]},
      { title: 'Advanced SQL', lectures: [
        { title: 'Window Functions', duration: 20, url: YT('HXV3zeQKqGY') },
        { title: 'Query Optimization', duration: 18, url: YT('HXV3zeQKqGY') },
        { title: 'Real-world Case Studies', duration: 25, url: YT('HXV3zeQKqGY') },
      ]},
    ]
  ),

  // ── BUSINESS ─────────────────────────────────────────────────
  makeCourse(
    'Startup Fundamentals — Build Your Business',
    '<h2>What you\'ll learn</h2><p>Learn how to validate a business idea, build an MVP, find your first customers, raise funding, and scale a startup from scratch.</p><h2>Requirements</h2><ul><li>No experience needed</li></ul>',
    54.99, 20, THUMB('WlkQKMNMPKg'), 'Business',
    [
      { title: 'Idea Validation', lectures: [
        { title: 'Finding a Problem Worth Solving', duration: 13, url: YT('WlkQKMNMPKg') },
        { title: 'Market Research', duration: 15, url: YT('WlkQKMNMPKg') },
        { title: 'MVP Strategy', duration: 14, url: YT('WlkQKMNMPKg') },
      ]},
      { title: 'Growth & Funding', lectures: [
        { title: 'Customer Acquisition', duration: 16, url: YT('WlkQKMNMPKg') },
        { title: 'Pitching to Investors', duration: 18, url: YT('WlkQKMNMPKg') },
        { title: 'Building a Team', duration: 14, url: YT('WlkQKMNMPKg') },
      ]},
    ]
  ),

  makeCourse(
    'Product Management — From Idea to Launch',
    '<h2>What you\'ll learn</h2><p>Learn the complete product management lifecycle: roadmaps, user stories, sprint planning, working with engineers, and measuring product success.</p><h2>Requirements</h2><ul><li>No technical background required</li></ul>',
    49.99, 15, THUMB('vd8t7PZR7KA'), 'Business',
    [
      { title: 'PM Foundations', lectures: [
        { title: 'What Does a PM Do?', duration: 11, url: YT('vd8t7PZR7KA') },
        { title: 'Writing User Stories', duration: 14, url: YT('vd8t7PZR7KA') },
        { title: 'Building a Product Roadmap', duration: 17, url: YT('vd8t7PZR7KA') },
      ]},
      { title: 'Execution', lectures: [
        { title: 'Agile & Scrum Basics', duration: 15, url: YT('vd8t7PZR7KA') },
        { title: 'Working with Engineering Teams', duration: 13, url: YT('vd8t7PZR7KA') },
        { title: 'Product Metrics & KPIs', duration: 16, url: YT('vd8t7PZR7KA') },
      ]},
    ]
  ),

  makeCourse(
    'Excel for Business — Data & Reporting',
    '<h2>What you\'ll learn</h2><p>Master Microsoft Excel for business: formulas, pivot tables, VLOOKUP, charts, dashboards, and automating reports with macros.</p><h2>Requirements</h2><ul><li>No experience needed</li></ul>',
    29.99, 10, THUMB('Vl0H-qTclOg'), 'Business',
    [
      { title: 'Excel Essentials', lectures: [
        { title: 'Formulas & Functions', duration: 14, url: YT('Vl0H-qTclOg') },
        { title: 'VLOOKUP & XLOOKUP', duration: 13, url: YT('Vl0H-qTclOg') },
        { title: 'Conditional Formatting', duration: 11, url: YT('Vl0H-qTclOg') },
      ]},
      { title: 'Pivot Tables & Dashboards', lectures: [
        { title: 'Pivot Tables Deep Dive', duration: 18, url: YT('Vl0H-qTclOg') },
        { title: 'Charts & Visualization', duration: 15, url: YT('Vl0H-qTclOg') },
        { title: 'Building a Business Dashboard', duration: 25, url: YT('Vl0H-qTclOg') },
      ]},
    ]
  ),

  // ── MARKETING ────────────────────────────────────────────────
  makeCourse(
    'Digital Marketing Masterclass 2024',
    '<h2>What you\'ll learn</h2><p>Complete digital marketing course covering SEO, Google Ads, Facebook Ads, email marketing, content strategy, and analytics.</p><h2>Requirements</h2><ul><li>No experience needed</li></ul>',
    49.99, 25, THUMB('nU-IIXBWlS4'), 'Marketing',
    [
      { title: 'Marketing Fundamentals', lectures: [
        { title: 'Digital Marketing Overview', duration: 10, url: YT('nU-IIXBWlS4') },
        { title: 'Understanding Your Audience', duration: 14, url: YT('nU-IIXBWlS4') },
        { title: 'Funnel Strategy', duration: 15, url: YT('nU-IIXBWlS4') },
      ]},
      { title: 'Paid Advertising', lectures: [
        { title: 'Google Ads Fundamentals', duration: 20, url: YT('nU-IIXBWlS4') },
        { title: 'Facebook & Instagram Ads', duration: 22, url: YT('nU-IIXBWlS4') },
        { title: 'Ad Copywriting', duration: 16, url: YT('nU-IIXBWlS4') },
      ]},
      { title: 'SEO & Content', lectures: [
        { title: 'On-Page SEO', duration: 18, url: YT('nU-IIXBWlS4') },
        { title: 'Content Marketing Strategy', duration: 17, url: YT('nU-IIXBWlS4') },
        { title: 'Google Analytics 4', duration: 20, url: YT('nU-IIXBWlS4') },
      ]},
    ]
  ),

  makeCourse(
    'Social Media Marketing — Grow Any Brand',
    '<h2>What you\'ll learn</h2><p>Build and grow a brand on Instagram, TikTok, LinkedIn, and YouTube. Learn content creation, scheduling, community management, and paid strategies.</p><h2>Requirements</h2><ul><li>No experience needed</li></ul>',
    39.99, 20, THUMB('R0TzFCoNMzM'), 'Marketing',
    [
      { title: 'Platform Strategy', lectures: [
        { title: 'Choosing the Right Platforms', duration: 10, url: YT('R0TzFCoNMzM') },
        { title: 'Building Your Profile', duration: 12, url: YT('R0TzFCoNMzM') },
      ]},
      { title: 'Content Creation', lectures: [
        { title: 'Content Pillars & Planning', duration: 15, url: YT('R0TzFCoNMzM') },
        { title: 'Short-Form Video (Reels/TikTok)', duration: 18, url: YT('R0TzFCoNMzM') },
        { title: 'Growing with Hashtags & SEO', duration: 14, url: YT('R0TzFCoNMzM') },
      ]},
      { title: 'Growth & Monetization', lectures: [
        { title: 'Influencer Collaborations', duration: 13, url: YT('R0TzFCoNMzM') },
        { title: 'Monetizing Your Audience', duration: 17, url: YT('R0TzFCoNMzM') },
      ]},
    ]
  ),

  // ── FINANCE ──────────────────────────────────────────────────
  makeCourse(
    'Personal Finance & Investing — Build Wealth',
    '<h2>What you\'ll learn</h2><p>Take control of your money: budgeting, emergency funds, debt payoff, stock market investing, index funds, and retirement planning.</p><h2>Requirements</h2><ul><li>No experience needed</li></ul>',
    34.99, 10, THUMB('p7HKvqRI_Bo'), 'Finance',
    [
      { title: 'Money Foundations', lectures: [
        { title: 'Budgeting That Works', duration: 13, url: YT('p7HKvqRI_Bo') },
        { title: 'Emergency Fund Strategy', duration: 10, url: YT('p7HKvqRI_Bo') },
        { title: 'Crushing Debt', duration: 15, url: YT('p7HKvqRI_Bo') },
      ]},
      { title: 'Investing Basics', lectures: [
        { title: 'Stock Market 101', duration: 17, url: YT('p7HKvqRI_Bo') },
        { title: 'Index Funds & ETFs', duration: 16, url: YT('p7HKvqRI_Bo') },
        { title: 'Retirement Accounts (401k, IRA)', duration: 14, url: YT('p7HKvqRI_Bo') },
      ]},
    ]
  ),

  makeCourse(
    'Crypto & Blockchain — Practical Guide',
    '<h2>What you\'ll learn</h2><p>Understand how blockchain technology works, how to safely buy and store crypto, DeFi, NFTs, and how to evaluate crypto projects.</p><h2>Requirements</h2><ul><li>No technical background required</li></ul>',
    44.99, 20, THUMB('SSo_EIwHSd4'), 'Finance',
    [
      { title: 'Blockchain Basics', lectures: [
        { title: 'How Blockchain Works', duration: 14, url: YT('SSo_EIwHSd4') },
        { title: 'Bitcoin vs Ethereum', duration: 13, url: YT('SSo_EIwHSd4') },
        { title: 'Wallets & Security', duration: 15, url: YT('SSo_EIwHSd4') },
      ]},
      { title: 'DeFi & NFTs', lectures: [
        { title: 'Decentralized Finance Explained', duration: 17, url: YT('SSo_EIwHSd4') },
        { title: 'NFTs — Hype vs Reality', duration: 14, url: YT('SSo_EIwHSd4') },
        { title: 'Evaluating Crypto Projects', duration: 18, url: YT('SSo_EIwHSd4') },
      ]},
    ]
  ),

  // ── PERSONAL DEVELOPMENT ─────────────────────────────────────
  makeCourse(
    'Productivity & Deep Work — Get More Done',
    '<h2>What you\'ll learn</h2><p>Master time management and deep work strategies: time blocking, eliminating distractions, building systems, and achieving your goals faster.</p><h2>Requirements</h2><ul><li>No experience needed</li></ul>',
    29.99, 15, THUMB('fn5-KGhDLN0'), 'Personal Development',
    [
      { title: 'Mindset & Focus', lectures: [
        { title: 'The Deep Work Framework', duration: 12, url: YT('fn5-KGhDLN0') },
        { title: 'Eliminating Distractions', duration: 14, url: YT('fn5-KGhDLN0') },
        { title: 'Building a Morning Routine', duration: 11, url: YT('fn5-KGhDLN0') },
      ]},
      { title: 'Systems & Habits', lectures: [
        { title: 'Time Blocking', duration: 15, url: YT('fn5-KGhDLN0') },
        { title: 'The 1% Better System', duration: 13, url: YT('fn5-KGhDLN0') },
        { title: 'Weekly & Monthly Reviews', duration: 12, url: YT('fn5-KGhDLN0') },
      ]},
    ]
  ),

  makeCourse(
    'Public Speaking — Speak with Confidence',
    '<h2>What you\'ll learn</h2><p>Overcome fear of public speaking, structure compelling presentations, use body language effectively, and deliver talks that inspire and influence.</p><h2>Requirements</h2><ul><li>No experience needed</li></ul>',
    34.99, 10, THUMB('AykYRO5d_lI'), 'Personal Development',
    [
      { title: 'Overcoming Fear', lectures: [
        { title: 'Understanding Stage Fright', duration: 11, url: YT('AykYRO5d_lI') },
        { title: 'Breathing & Grounding Techniques', duration: 10, url: YT('AykYRO5d_lI') },
      ]},
      { title: 'Presentation Skills', lectures: [
        { title: 'Structuring Your Talk', duration: 14, url: YT('AykYRO5d_lI') },
        { title: 'Storytelling That Captivates', duration: 16, url: YT('AykYRO5d_lI') },
        { title: 'Body Language & Voice', duration: 15, url: YT('AykYRO5d_lI') },
        { title: 'Handling Q&A', duration: 12, url: YT('AykYRO5d_lI') },
      ]},
    ]
  ),

  makeCourse(
    'Leadership & Team Management',
    '<h2>What you\'ll learn</h2><p>Develop real leadership skills: motivating teams, giving feedback, conflict resolution, decision making under pressure, and building a high-performance culture.</p><h2>Requirements</h2><ul><li>No experience needed</li></ul>',
    39.99, 15, THUMB('OfBMJoMPMUA'), 'Personal Development',
    [
      { title: 'Leadership Foundations', lectures: [
        { title: 'Leadership vs Management', duration: 10, url: YT('OfBMJoMPMUA') },
        { title: 'Building Trust with Your Team', duration: 13, url: YT('OfBMJoMPMUA') },
        { title: 'Giving Effective Feedback', duration: 14, url: YT('OfBMJoMPMUA') },
      ]},
      { title: 'Team Performance', lectures: [
        { title: 'Motivating Individuals', duration: 15, url: YT('OfBMJoMPMUA') },
        { title: 'Conflict Resolution', duration: 16, url: YT('OfBMJoMPMUA') },
        { title: 'Building High-Performance Culture', duration: 18, url: YT('OfBMJoMPMUA') },
      ]},
    ]
  ),
];

console.log(`Creating ${courses.length} courses...`);
let count = 0;
for (const course of courses) {
  const ref = db.collection('courses').doc();
  await ref.set(course);
  count++;
  console.log(`  [${count}/${courses.length}] ${course.courseTitle}`);
}

console.log(`\n✅ Done! ${count} courses created.`);
process.exit(0);
