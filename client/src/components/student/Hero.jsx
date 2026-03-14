import React from "react";
import { assets } from "../../assets/assets";
import SearchBar from "./SearchBar";

const Hero = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full md:pt-36 pt-20 px-7 md:px-0 space-y-7 text-center">
      <h1 className="md:text-home-heading-large text-home-heading-small relative font-bold text-gray-800 max-w-3xl mx-auto">
        Build skills that move your career forward with courses built around
        your{" "}
        <span className="relative inline-block">
          <span className="relative z-10 text-black">goals and pace</span>
          <span className="pointer-events-none absolute left-0 right-0 top-1/2 z-0 h-[0.9em] -translate-y-1/2 rounded-sm bg-[#ffdc73]/90 rotate-[-2deg]" />
        </span>
        <img
          src={assets.sketch}
          alt="sketch"
          className="md:block hidden absolute-bottom-7 right-0"
        />
      </h1>

      <p className="md:block hidden text-center text-gray-500 max-w-sm mx-auto">
        Learn with expert-led lessons, hands-on projects, and structured
        learning paths designed to help you grow with confidence.
      </p>

      <p className="md:hidden text-center text-gray-500 max-w-sm mx-auto">
        Expert-led courses and practical projects to help you grow with
        confidence.
      </p>
      <SearchBar />
    </div>
  );
};
export default Hero;
