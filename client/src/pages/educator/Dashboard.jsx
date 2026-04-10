import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContex";
import { assets } from "../../assets/assets";

const Dashboard = () => {
  const { authFetch, currency } = useContext(AppContext);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await authFetch("/api/educator/dashboard");
        const data = await res.json();
        if (data.success) setDashboard(data.dashboard);
      } catch (err) {
        console.error("Dashboard load error:", err.message);
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
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-5 flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-full">
            <img src={assets.earning_icon} alt="" className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Earnings</p>
            <p className="text-xl font-bold text-gray-800">
              {currency}{dashboard?.totalEarnings?.toFixed(2) ?? "0.00"}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-full">
            <img src={assets.my_course_icon} alt="" className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Courses</p>
            <p className="text-xl font-bold text-gray-800">
              {dashboard?.totalCourses ?? 0}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 flex items-center gap-4">
          <div className="p-3 bg-purple-50 rounded-full">
            <img src={assets.patients_icon} alt="" className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Students</p>
            <p className="text-xl font-bold text-gray-800">
              {dashboard?.enrolledStudentsData?.length ?? 0}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Enrollments Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-medium text-gray-700">Recent Enrollments</h3>
        </div>
        {!dashboard?.enrolledStudentsData?.length ? (
          <p className="text-center text-gray-400 py-10 text-sm">No enrollments yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-5 py-3 font-medium">#</th>
                <th className="px-5 py-3 font-medium">Student</th>
                <th className="px-5 py-3 font-medium">Course</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dashboard.enrolledStudentsData.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-5 py-3 text-gray-400">{i + 1}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={item.student.imageUrl || assets.user_icon}
                        alt=""
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <span className="text-gray-700">{item.student.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{item.courseTitle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
