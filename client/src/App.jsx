import React from "react";
import { Route, Routes, useMatch } from "react-router-dom";

// Student Pages
import Home from "./pages/student/Home";
import CourseList from "./pages/student/CourseList";
import CourseDetails from "./pages/student/CourseDetails";
import MyEnrollment from "./pages/student/MyEnrollment";
import Player from "./pages/student/Player";

// Educator Pages
import Educator from "./pages/educator/Educator";
import Dashboard from "./pages/educator/Dashboard";
import AddCourse from "./pages/educator/AddCourse";
import MyCourses from "./pages/educator/MyCourses";

// Other Pages
import Loading from "./components/student/Loading";
import Navbar from "./components/student/Navbar";
import StudentsEnrolled from "./pages/educator/StudentsEnrolled";

const App = () => {
  const isEducatorRoute = useMatch("/educator/*");

  return (
    <div className="relative z-0 min-h-screen bg-white overflow-hidden">
      {/* Shared background (Student side only) */}
      {!isEducatorRoute && (
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[#ffedcf]/45 blur-[80px]" />
          <div className="absolute right-0 top-0 h-[650px] w-[650px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[#ffdc73]/20 blur-[110px]" />
        </div>
      )}

      {/* Everything else sits above it */}
      <div className="relative z-10 text-default min-h-screen">
        {!isEducatorRoute && <Navbar />}

        <Routes>
          {/* Student Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/course-list" element={<CourseList />} />
          <Route path="/course-list/:input" element={<CourseList />} />
          <Route path="/course/:id" element={<CourseDetails />} />
          <Route path="/my-enrollments" element={<MyEnrollment />} />
          <Route path="/player/:courseid" element={<Player />} />
          <Route path="/loading" element={<Loading />} />

          {/* Educator Routes */}
          <Route path="/educator" element={<Educator />}>
            <Route index element={<Dashboard />} />
            <Route path="add-course" element={<AddCourse />} />
            <Route path="my-courses" element={<MyCourses />} />
            <Route path="students-enrolled" element={<StudentsEnrolled />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

export default App;
