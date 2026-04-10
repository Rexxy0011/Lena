import React from "react";
import { motion } from "framer-motion";
import { assets } from "../../assets/assets";

const CallToAction = () => {
  return (
    <div className="py-16 md:py-20 px-8 md:px-0 w-full">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-4xl mx-auto relative"
      >
        {/* Offset block shadow */}
        <div className="absolute inset-0 bg-[#ffdc73] rounded-2xl translate-x-[-16px] translate-y-[-16px]" />

        {/* Main container */}
        <div className="relative flex flex-col items-center gap-4 text-center rounded-2xl border border-gray-500/20 bg-white p-8 md:p-12">
          <h1 className="text-xl md:text-4xl text-gray-800 font-semibold">
            Learn anything, anytime, anywhere
          </h1>

          <p className="text-gray-500 sm:text-sm max-w-2xl">
            Start learning with expert-led courses, flexible schedules, and
            clear learning paths built to help you reach your goals faster.
          </p>

          <div className="flex items-center font-medium gap-6 mt-4">
            <button
              onClick={() => { window.scrollTo(0, 0); window.location.href = "/course-list"; }}
              className="px-10 py-3 rounded-md text-white bg-[#4e91fd]"
            >
              Get started
            </button>

            <button
              onClick={() => { window.scrollTo(0, 0); window.location.href = "/course-list"; }}
              className="flex items-center gap-2"
            >
              Learn More <img src={assets.arrow_icon} alt="arrow_icon" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CallToAction;
