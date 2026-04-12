import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContex";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user } = useContext(AppContext);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign-out failed:", err.message);
    }
  };

  return (
    <div className="flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-20 border-b border-gray-200 py-3 bg-white">
      <Link to="/">
        <img src={assets.logo_dark} alt="Lena" className="h-8 lg:h-10 w-auto" />
      </Link>

      <div className="flex items-center gap-4">
        <p className="text-sm text-gray-600 max-w-40 truncate">
          Hi, {user?.displayName || user?.email || "Educator"}
        </p>
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt="avatar"
            className="w-8 h-8 rounded-full object-cover cursor-pointer"
            onClick={handleSignOut}
            title="Click to sign out"
          />
        ) : (
          <button
            onClick={handleSignOut}
            className="text-sm text-gray-500 hover:text-gray-800"
          >
            Sign Out
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
