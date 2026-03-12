import React from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";

const Navbar = () => {
  const isCourseListPage = location.pathname.includes("/course-list");
  return (
    <div
      className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-border py-4 ${isCourseListPage ? "bg-white" : "bg-bg"}`}
    >
      <img
        src={assets.logo}
        alt="logo"
        className="w-28 lg:w-32 cursor-pointer"
      />
      <div>
        <button>Become Educator</button>
        <Link to="/my-enrollments">My Enrollments</Link>
      </div>
      <button className="bg-primary text-white px-5 py-2 rounded-full">
        Create Account
      </button>
    </div>
  );
};
export default Navbar;
