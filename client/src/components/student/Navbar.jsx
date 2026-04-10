import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContex";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
import AuthModal from "./AuthModal";

const Navbar = () => {
  const { navigate, isEducator, user } = useContext(AppContext);
  const [showMenu, setShowMenu] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setShowMenu(false);
    } catch (err) {
      console.error("Sign-out failed:", err.message);
    }
  };

  return (
    <>
      <div
        className="flex w-full items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-200 py-4 bg-white"
      >
        {/* Logo */}
        <Link to="/" className="shrink-0">
          <img src={assets.logo} alt="logo" className="w-28 lg:w-32" />
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3 sm:gap-5">

          {/* Desktop links */}
          {user && (
            <div className="hidden md:flex items-center gap-3">
              <button onClick={() => navigate("/educator")}>
                {isEducator ? "Educator Dashboard" : "Become Educator"}
              </button>
              <span className="h-4 w-px bg-gray-300" />
              <Link to="/my-enrollments" className="text-gray-600 hover:text-gray-900">
                My Enrollments
              </Link>
            </div>
          )}

          {/* Mobile links */}
          {user && (
            <div className="md:hidden flex items-center gap-2 text-gray-500 text-sm">
              <button onClick={() => navigate("/educator")}>
                {isEducator ? "Dashboard" : "Become Educator"}
              </button>
              <span className="h-4 w-px bg-gray-300" />
              <Link to="/my-enrollments" className="hover:text-gray-900">
                Enrollments
              </Link>
            </div>
          )}

          {/* Auth / Profile */}
          {user ? (
            <div className="relative">
              <img
                src={user.photoURL || assets.user_icon}
                alt={user.displayName || "user"}
                className="w-9 h-9 rounded-full cursor-pointer object-cover"
                onClick={() => setShowMenu((v) => !v)}
              />
              {showMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-50">
                  <Link
                    to="/my-enrollments"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowMenu(false)}
                  >
                    My Enrollments
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => setShowAuth(true)}
                className="hidden md:inline-flex bg-[#4e91fd] text-white px-5 py-2 rounded-full text-sm"
              >
                Create Account
              </button>
              <button onClick={() => setShowAuth(true)} className="md:hidden p-1">
                <img src={assets.user_icon} alt="user" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
};

export default Navbar;
