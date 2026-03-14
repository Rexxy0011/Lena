import React from "react";
import { assets } from "../../assets/assets";
import { Link, useLocation } from "react-router-dom";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const location = useLocation();
  const isCourseListPage = location.pathname.includes("/course-list");

  const { openSignIn } = useClerk();
  const { user } = useUser();

  return (
    <div
      className={`flex w-full items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-border py-4 ${
        isCourseListPage ? "bg-white" : "bg-bg"
      }`}
    >
      {/* Logo */}
      <Link to="/" className="shrink-0">
        <img src={assets.logo} alt="logo" className="w-28 lg:w-32" />
      </Link>

      {/* Right Side (links + profile aligned together) */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Desktop Links (right beside profile) */}
        {user && (
          <div className="hidden md:flex items-center gap-3">
            <button className="text-gray-600 hover:text-gray-900">
              Become Educator
            </button>

            <span className="h-4 w-px bg-gray-300" />

            <Link
              to="/my-enrollments"
              className="text-gray-600 hover:text-gray-900"
            >
              My Enrollments
            </Link>
          </div>
        )}

        {/* Auth / Profile */}
        {user ? (
          <UserButton />
        ) : (
          <>
            {/* Desktop */}
            <button
              onClick={() => openSignIn()}
              className="hidden md:inline-flex bg-primary text-white px-5 py-2 rounded-full"
            >
              Create Account
            </button>

            {/* Mobile */}
            <button onClick={() => openSignIn()} className="md:hidden p-1">
              <img src={assets.user_icon} alt="user" />
            </button>
          </>
        )}
      </div>

      {/* Mobile (optional links beside profile/icon) */}
      {user && (
        <div className="md:hidden flex items-center gap-2 text-gray-500">
          <button className="hover:text-gray-900">Educator</button>
          <span className="h-4 w-px bg-gray-300" />
          <Link to="/my-enrollments" className="hover:text-gray-900">
            Enrollments
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
