import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContex";
import SearchBar from "../../components/student/SearchBar";
import { useParams } from "react-router-dom";
import CourseCard from "../../components/student/CourseCard";
import { assets } from "../../assets/assets";
import Footer from "../../components/student/Footer";

const CourseList = () => {
  const { navigate, allCourses, coursesLoading } = useContext(AppContext);
  const { input } = useParams();
  const [filteredCourse, setFilteredCourse] = useState([]);
  const [query, setQuery] = useState(input ? input : "");

  useEffect(() => {
    setQuery(input ? input : "");
  }, [input]);

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const tempCourses = allCourses.slice();

      query
        ? setFilteredCourse(
            tempCourses.filter((item) =>
              item.courseTitle.toLowerCase().includes(query.toLowerCase())
            )
          )
        : setFilteredCourse(tempCourses);
    }
  }, [allCourses, query]);

  return (
    <>
      <div className="relative md:px-36 px-8 pt-20 text-left">
        <div className="flex md:flex-row flex-col gap-6 items-start justify-between w-full">
          <div>
            <h1 className="text-4xl font-semibold text-gray-800">
              Course List
            </h1>
            <p className="text-gray-500">
              <span
                className="text-[#4e91fd] cursor-pointer"
                onClick={() => navigate("/")}
              >
                Home
              </span>{" "}
              / <span>Course List</span>
            </p>
          </div>

          <SearchBar data={query} onQueryChange={setQuery} />
        </div>

        {query && (
          <div className="inline-flex items-center gap-4 px-4 py-2 border mt-8 -mb-8 text-gray-600">
            <p>{query}</p>
            <img
              src={assets.cross_icon}
              alt=""
              className="cursor-pointer"
              onClick={() => {
                setQuery("");
                navigate("/course-list");
              }}
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-16 gap-3 px-2 md:px-0">
          {coursesLoading ? (
            <p className="col-span-4 text-center text-gray-400 py-20">Loading courses...</p>
          ) : filteredCourse.length === 0 ? (
            <p className="col-span-4 text-center text-gray-400 py-20">No courses found.</p>
          ) : (
            filteredCourse.map((course, index) => (
              <CourseCard key={index} course={course} />
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CourseList;
