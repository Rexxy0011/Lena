import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContex";

const MyCourses = () => {
  const { authFetch, currency, navigate } = useContext(AppContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await authFetch("/api/educator/courses");
        const data = await res.json();
        if (data.success) setCourses(data.courses);
      } catch (err) {
        console.error("MyCourses load error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const togglePublish = async (courseId, current) => {
    try {
      const res = await authFetch(`/api/courses/${courseId}`, {
        method: "PUT",
        body: JSON.stringify({ isPublished: !current }),
      });
      const data = await res.json();
      if (data.success) {
        setCourses((prev) =>
          prev.map((c) => (c._id === courseId ? { ...c, isPublished: !current } : c))
        );
      }
    } catch (err) {
      console.error("Toggle publish error:", err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">My Courses</h2>
        <button
          onClick={() => navigate("/educator/add-course")}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg"
        >
          + Add Course
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="text-center text-gray-400 py-20">
          <p className="mb-3">No courses yet.</p>
          <button
            onClick={() => navigate("/educator/add-course")}
            className="text-blue-500 hover:underline text-sm"
          >
            Create your first course →
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Course</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Price</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Students</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {courses.map((course) => (
                <tr key={course._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={course.courseThumbnail}
                        alt=""
                        className="w-12 h-8 object-cover rounded hidden sm:block"
                      />
                      <span className="font-medium text-gray-800 line-clamp-1">
                        {course.courseTitle}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                    {currency}
                    {(course.coursePrice - (course.discount * course.coursePrice) / 100).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                    {course.enrolledStudents?.length ?? 0}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => togglePublish(course._id, course.isPublished)}
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        course.isPublished
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {course.isPublished ? "Published" : "Draft"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyCourses;
