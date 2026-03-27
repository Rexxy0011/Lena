import React, { useContext, useState } from "react";
import { AppContext } from "../../context/AppContex";
import { Line } from "rc-progress";
import Footer from "../../components/student/Footer";

const MyEnrollment = () => {
  const { enrolledCourses, calculateCourseDuration, navigate } =
    useContext(AppContext);

  const [progressArray, setProgressArray] = useState([
    { lectureCompleted: 2, totalLectures: 4 },
    { lectureCompleted: 1, totalLectures: 5 },
    { lectureCompleted: 3, totalLectures: 6 },
    { lectureCompleted: 4, totalLectures: 4 },
    { lectureCompleted: 0, totalLectures: 3 },
    { lectureCompleted: 5, totalLectures: 7 },
    { lectureCompleted: 6, totalLectures: 8 },
    { lectureCompleted: 2, totalLectures: 6 },
    { lectureCompleted: 4, totalLectures: 10 },
    { lectureCompleted: 3, totalLectures: 5 },
    { lectureCompleted: 7, totalLectures: 7 },
    { lectureCompleted: 1, totalLectures: 4 },
    { lectureCompleted: 0, totalLectures: 2 },
    { lectureCompleted: 5, totalLectures: 5 },
  ]);

  return (
    <>
      <div className="md:px-36 px-8 pt-10">
        <h1 className="text-2xl font-semibold">MyEnrollment</h1>

        <table className="md:table-auto table-fixed w-full border mt-10">
          <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left hidden sm:table-header-group">
            <tr>
              <th className="px-4 py-3 font-semibold truncate">Course</th>
              <th className="px-4 py-3 font-semibold truncate">Duration</th>
              <th className="px-4 py-3 font-semibold truncate">Completed</th>
              <th className="px-4 py-3 font-semibold truncate">Status</th>
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {enrolledCourses.map((course, index) => {
              const progress = progressArray[index];
              const isCompleted =
                progress &&
                progress.totalLectures > 0 &&
                progress.lectureCompleted === progress.totalLectures;

              return (
                <tr key={index} className="border-b border-gray-500/20">
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3">
                    <img
                      src={course.courseThumbnail}
                      alt=""
                      className="w-14 sm:w-24 md:w-28"
                    />
                    <div className="flex-1">
                      <p className="mb-1 text-sm sm:text-base">
                        {course.courseTitle}
                      </p>
                      <Line
                        strokeWidth={2}
                        percent={
                          progressArray[index]
                            ? (progressArray[index].lectureCompleted * 100) /
                              progressArray[index].totalLectures
                            : 0
                        }
                        className="bg-gray-300 rounded-full"
                      />
                    </div>
                  </td>

                  <td className="px-4 py-3 hidden sm:table-cell">
                    {calculateCourseDuration(course)}
                  </td>

                  <td className="px-4 py-3 hidden sm:table-cell">
                    {progress
                      ? `${progress.lectureCompleted} / ${progress.totalLectures}`
                      : ""}
                    <span> Lectures</span>
                  </td>

                  <td className="px-4 py-3 text-right sm:text-left">
                    <button
                      className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm ${
                        isCompleted
                          ? "bg-gray-200 text-gray-700"
                          : "bg-[#4e91fd] text-white"
                      }`}
                      onClick={() => navigate("/player/" + course._id)}
                    >
                      {isCompleted ? "Completed" : "On Going"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Footer />
    </>
  );
};

export default MyEnrollment;
