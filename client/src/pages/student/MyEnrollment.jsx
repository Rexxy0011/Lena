import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContex";
import { Navigate } from "react-router-dom";
import { Line } from "rc-progress";
import Footer from "../../components/student/Footer";

const MyEnrollment = () => {
  const { enrolledCourses, calculateCourseDuration, navigate, authFetch, user, authLoading } =
    useContext(AppContext);

  const [progressMap, setProgressMap] = useState({});

  useEffect(() => {
    if (!enrolledCourses.length) return;

    const fetchAllProgress = async () => {
      const results = await Promise.all(
        enrolledCourses.map(async (course) => {
          try {
            const res = await authFetch(`/api/progress/${course._id}`);
            const data = await res.json();
            return {
              id: course._id,
              completed: data.progress?.completedLectures?.length ?? 0,
              total: course.courseContent.reduce(
                (sum, ch) => sum + ch.chapterContent.length, 0
              ),
            };
          } catch {
            return { id: course._id, completed: 0, total: 0 };
          }
        })
      );
      const map = {};
      results.forEach((r) => { map[r.id] = r; });
      setProgressMap(map);
    };

    fetchAllProgress();
  }, [enrolledCourses]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;

  return (
    <>
      <div className="md:px-36 px-8 pt-10 min-h-[60vh]">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">My Learning</h1>
        <p className="text-sm text-gray-500 mb-8">{enrolledCourses.length} course{enrolledCourses.length !== 1 ? "s" : ""} enrolled</p>

        {enrolledCourses.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="mb-3">You haven't enrolled in any courses yet.</p>
            <button
              onClick={() => navigate("/course-list")}
              className="text-[#4e91fd] hover:underline text-sm"
            >
              Browse courses →
            </button>
          </div>
        ) : (
          <table className="md:table-auto table-fixed w-full border">
            <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left hidden sm:table-header-group">
              <tr>
                <th className="px-4 py-3 font-semibold">Course</th>
                <th className="px-4 py-3 font-semibold">Duration</th>
                <th className="px-4 py-3 font-semibold">Progress</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {enrolledCourses.map((course) => {
                const p = progressMap[course._id];
                const completed = p?.completed ?? 0;
                const total = p?.total ?? 0;
                const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
                const isDone = total > 0 && completed === total;

                return (
                  <tr key={course._id} className="border-b border-gray-500/20">
                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3">
                      <img src={course.courseThumbnail} alt="" className="w-14 sm:w-24 md:w-28 rounded" />
                      <div className="flex-1">
                        <p className="mb-1 text-sm sm:text-base font-medium">{course.courseTitle}</p>
                        <Line
                          strokeWidth={2}
                          percent={percent}
                          strokeColor="#4e91fd"
                          trailColor="#e5e7eb"
                          className="rounded-full"
                        />
                        <p className="text-xs text-gray-400 mt-0.5">{percent}% complete</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-sm">
                      {calculateCourseDuration(course)}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-sm">
                      {completed} / {total} lectures
                    </td>
                    <td className="px-4 py-3 text-right sm:text-left">
                      <button
                        className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm ${
                          isDone ? "bg-gray-200 text-gray-700" : "bg-[#4e91fd] text-white"
                        }`}
                        onClick={() => navigate("/player/" + course._id)}
                      >
                        {isDone ? "Completed" : "Continue"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MyEnrollment;
