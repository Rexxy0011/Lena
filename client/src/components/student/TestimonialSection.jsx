import React from "react";
import { assets, dummyTestimonial } from "../../assets/assets";

const TestimonialSection = () => {
  const items = [...dummyTestimonial, ...dummyTestimonial];

  return (
    <div className="pb-14 px-8 md:px-0 text-center">
      <h2 className="text-3xl font-medium text-gray-800">
        Voices from the Classroom
      </h2>

      <p className="md:text-base text-gray-500 mt-3">
        Real feedback from learners who used our platform to build confidence,
        <br />
        master new skills, and make measurable progress—one course at a time.
      </p>

      {/* Marquee */}
      <div className="mt-14 overflow-hidden">
        <div className="flex w-max gap-8 animate-[marquee_28s_linear_infinite]">
          {items.map((testimonial, index) => (
            <div
              key={index}
              className="w-[320px] shrink-0 text-sm text-left border border-gray-500/30 rounded-lg bg-white shadow-[0px_4px_15px_0px] shadow-black/5 overflow-hidden"
            >
              <div className="flex items-center gap-4 px-5 py-4 bg-gray-500/10">
                <img
                  className="h-12 w-12 rounded-full"
                  src={testimonial.image}
                  alt={testimonial.name}
                />
                <div>
                  <h1 className="text-lg font-medium text-gray-800">
                    {testimonial.name}
                  </h1>
                  <p className="text-gray-800/80">{testimonial.role}</p>
                </div>
              </div>

              <div className="p-5 pb-7">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <img
                      key={i}
                      src={
                        i < Math.floor(testimonial.rating ?? 5)
                          ? assets.star
                          : assets.star_blank
                      }
                      alt="star"
                      className="h-5"
                    />
                  ))}
                </div>

                <p className="text-gray-500 mt-5">{testimonial.feedback}</p>
              </div>

              <a
                href="#"
                className="inline-block text-blue-500 underline px-5 mb-4"
              >
                Read more
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default TestimonialSection;
