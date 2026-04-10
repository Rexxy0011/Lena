import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContex";

const navItems = [
  { path: "/educator", label: "Dashboard", icon: assets.home_icon, end: true },
  { path: "/educator/add-course", label: "Add Course", icon: assets.add_icon },
  { path: "/educator/my-courses", label: "My Courses", icon: assets.my_course_icon },
  { path: "/educator/students-enrolled", label: "Students Enrolled", icon: assets.person_tick_icon },
];

const Sidebar = () => {
  const { isEducator } = useContext(AppContext);

  return (
    <div className="min-h-screen w-16 sm:w-56 border-r border-gray-200 bg-white flex flex-col pt-4">
      {navItems.map(({ path, label, icon, end }) => (
        <NavLink
          key={path}
          to={path}
          end={end}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 sm:px-6 py-3 text-sm font-medium transition-colors ${
              isActive
                ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                : "text-gray-600 hover:bg-gray-50"
            }`
          }
        >
          <img src={icon} alt={label} className="w-5 h-5 shrink-0" />
          <span className="hidden sm:inline">{label}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;
