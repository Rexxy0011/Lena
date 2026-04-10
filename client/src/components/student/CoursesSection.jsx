import React, { useContext } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContex";
import CourseCard from "./CourseCard";

const CoursesSection = () => {
  const { allCourses } = useContext(AppContext);
  return (
    <div className="py-16 md:py-20 md:px-40 px-8 text-center w-full">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-medium text-gray-800"
      >
        Learn from industry experts
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="mt-3 text-sm md:text-base text-gray-500"
      >
        Explore top-rated courses across in-demand categories—from software
        development and design <br /> to business and personal growth. Each
        course is structured to be practical, clear, and outcome-driven.
      </motion.p>

      <div className="grid [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))] px-4 md:px-0 md:my-10 my-8 gap-4">
        {allCourses.slice(0, 4).map((course, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: index * 0.12 }}
          >
            <CourseCard course={course} />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Link
          to="/course-list"
          onClick={() => window.scrollTo(0, 0)}
          className="inline-block text-gray-500 border border-gray-500/30 px-10 py-3 rounded"
        >
          Show all courses
        </Link>
      </motion.div>
    </div>
  );
};

export default CoursesSection;
