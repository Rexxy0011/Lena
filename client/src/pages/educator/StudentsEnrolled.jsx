import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContex";
import { assets } from "../../assets/assets";

const StudentsEnrolled = () => {
  const { authFetch } = useContext(AppContext);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await authFetch("/api/educator/students");
        const data = await res.json();
        if (data.success) setStudents(data.students);
      } catch (err) {
        console.error("StudentsEnrolled load error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Students Enrolled</h2>

      {students.length === 0 ? (
        <p className="text-center text-gray-400 py-20">No students enrolled yet.</p>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">#</th>
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Course</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={item.student.imageUrl || assets.user_icon}
                        alt=""
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <span className="text-gray-700">{item.student.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                    {item.courseTitle}
                  </td>
                  <td className="px-4 py-3 text-gray-400 hidden sm:table-cell">
                    {item.purchaseDate
                      ? new Date(item.purchaseDate._seconds * 1000).toLocaleDateString()
                      : "—"}
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

export default StudentsEnrolled;
