import React from "react";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <footer className="bg-gray-900 md:px-36 text-left w-full mt-10">
      <div className="flex flex-col md:flex-row items-start px-8 md:px-0 justify-center gap-10 md:gap-32 py-10 border-b border-white/30">
        <div className="flex flex-col md:items-start items-center w-full">
          <img src={assets.logo_dark} alt="" />
          <p className="mt-6 text-center md:text-left text-sm text-white/80">
            A modern learning platform built to help students and teams learn
            faster with expert-led courses, structured paths, and progress you
            can track.
          </p>
        </div>

        <div className="flex flex-col md:items-start items-center w-full">
          <h2 className="font-semibold text-white mb-5">Resources</h2>
          <ul className="flex md:flex-col w-full justify-between text-sm text-white/80 md:space-y-2">
            <li>
              <a href="#">Courses</a>
            </li>
            <li>
              <a href="#">Help Center</a>
            </li>
            <li>
              <a href="#">Terms of Service</a>
            </li>
            <li>
              <a href="#">FAQ</a>
            </li>
          </ul>
        </div>

        <div className="hidden md:flex flex-col items-start w-full">
          <h2 className="font-semibold text-white mb-5">Newsletter</h2>
          <p className="text-sm text-white/80">
            Get product updates, new courses, and learning tips—no spam.
          </p>
          <div className="flex items-center gap-2 pt-4 w-full">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 rounded-md px-3 py-2 outline-none"
            />
            <button className="bg-[#4e91fd] text-white rounded-md px-4 py-2">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <p className="py-4 text-center text-xs md:text-sm text-white/60">
        Copyright 2026 © Lena. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
