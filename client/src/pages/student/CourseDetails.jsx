import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContex";
import Loading from "../../components/student/Loading";
import { assets } from "../../assets/assets";

const CourseDetails = () => {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);

  const { allCourses, calculateRating } = useContext(AppContext);

  const fetchCourseData = async () => {
    const findCourse = allCourses.find((course) => course._id === id);
    setCourseData(findCourse);
  };

  useEffect(() => {
    fetchCourseData();
  }, [allCourses, id]);

  return courseData ? (
    <>
      <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-30 pt-20 text-left">
        {/* Same background as App.jsx */}
        <div className="pointer-events-none absolute top-0 left-0 w-full h-[500px] -z-10">
          <div className="absolute right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[#ffedcf]/45 blur-[80px]" />
          <div className="absolute right-0 top-0 h-[650px] w-[650px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[#ffdc73]/20 blur-[110px]" />
        </div>

        {/* left column */}
        <div className="max-w-xl z-10 text-gray-500">
          <h1 className="md:text-course-details-heading-large text-course-details-heading-small font-semibold text-gray-800">
            {courseData.courseTitle}
          </h1>

          <p
            className="pt-4 md:text-base text-small"
            dangerouslySetInnerHTML={{
              __html: courseData.courseDescription.slice(0, 200),
            }}
          />

          {/* course rating  */}
          <div className="flex items-center space-x-2 pt-3 pb-1 text-sm">
            <p>{calculateRating(courseData)}</p>

            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  src={
                    i < Math.floor(calculateRating(courseData))
                      ? assets.star
                      : assets.star_blank
                  }
                  alt=""
                  className="w-3.5 h-3.5"
                />
              ))}
            </div>

            <p className="text-[#4e91fd]">
              ({courseData.courseRatings.length}{" "}
              {courseData.courseRatings.length > 1 ? "ratings" : "rating"})
            </p>

            <p>
              {courseData.enrolledStudents.length}{" "}
              {courseData.enrolledStudents.length > 1 ? "students" : "student"}
            </p>
          </div>

          <p className="text-sm">
            <span>
              Course by <span className="text-[#4e91fd] underline">Rex</span>
            </span>
          </p>
          <div className="pt-8 text-gray-800">
            <h2 className="text-xl font-semibold">Course Structure</h2>
            <div className="pt-5">{courseData.courseContent.map3}</div>
          </div>
        </div>

        {/* Right column */}
        <div></div>
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default CourseDetails;
