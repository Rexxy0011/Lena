import React, { useState, useEffect } from "react";
import { assets, dummyTestimonial } from "../../assets/assets";

const TestimonialSection = () => {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = (index) => {
    if (animating || index === active) return;
    setAnimating(true);
    setTimeout(() => {
      setActive(index);
      setAnimating(false);
    }, 300);
  };

  const prev = () => goTo((active - 1 + dummyTestimonial.length) % dummyTestimonial.length);
  const next = () => goTo((active + 1) % dummyTestimonial.length);

  // Auto-advance every 5s
  useEffect(() => {
    const t = setTimeout(next, 5000);
    return () => clearTimeout(t);
  }, [active]);

  const t = dummyTestimonial[active];

  return (
    <div className="py-16 md:py-20 px-4 text-center bg-white w-full">
      <h2 className="text-3xl font-medium text-gray-800">Voices from the Classroom</h2>
      <p className="md:text-base text-gray-500 mt-3">
        Real feedback from learners who used our platform to build confidence,
        <br />
        master new skills, and make measurable progress—one course at a time.
      </p>

      <div className="relative max-w-2xl mx-auto mt-8">
        {/* Card */}
        <div
          className={`bg-white border border-gray-100 rounded-2xl shadow-lg p-8 md:p-10 text-left transition-opacity duration-300 ${
            animating ? "opacity-0" : "opacity-100"
          }`}
        >
          {/* Quote mark */}
          <div className="text-[#4e91fd] text-6xl font-serif leading-none mb-4 select-none">"</div>

          <p className="text-gray-600 text-base leading-relaxed mb-8">{t.feedback}</p>

          {/* Stars */}
          <div className="flex gap-0.5 mb-5">
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={i < Math.floor(t.rating ?? 5) ? assets.star : assets.star_blank}
                alt=""
                className="w-4 h-4"
              />
            ))}
          </div>

          {/* Author */}
          <div className="flex items-center gap-3">
            <img src={t.image} alt={t.name} className="w-11 h-11 rounded-full object-cover" />
            <div>
              <p className="font-semibold text-gray-800 text-sm">{t.name}</p>
              <p className="text-gray-400 text-xs">{t.role}</p>
            </div>
          </div>
        </div>

        {/* Arrow buttons */}
        <button
          onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 w-10 h-10 bg-white border border-gray-200 rounded-full shadow flex items-center justify-center hover:bg-gray-50 transition"
        >
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 w-10 h-10 bg-white border border-gray-200 rounded-full shadow flex items-center justify-center hover:bg-gray-50 transition"
        >
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 mt-8">
        {dummyTestimonial.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === active ? "w-6 h-2 bg-[#4e91fd]" : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialSection;
