import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContex";
import { useParams } from "react-router-dom";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import YouTube from "react-youtube";
import Footer from "../../components/student/Footer";

const Player = () => {
  const { enrolledCourses, calculateChapterTime, authFetch } = useContext(AppContext);
  const { courseid } = useParams();

  const [courseData, setCourseData] = useState(null);
  const [openSection, setOpenSection] = useState({});
  const [playerData, setPlayerData] = useState(null);
  const [completedLectures, setCompletedLectures] = useState([]);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    const found = enrolledCourses?.find((course) => course._id === courseid);
    setCourseData(found || null);
  }, [enrolledCourses, courseid]);

  // Load progress when course is ready
  useEffect(() => {
    if (!courseid) return;
    const loadProgress = async () => {
      try {
        const res = await authFetch(`/api/progress/${courseid}`);
        const data = await res.json();
        if (data.success) setCompletedLectures(data.progress?.completedLectures || []);
      } catch (err) {
        console.error("Load progress error:", err.message);
      }
    };
    loadProgress();
  }, [courseid]);

  const toggleSection = (index) => {
    setOpenSection((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleMarkCompleted = async () => {
    if (!playerData?.lectureId || marking) return;
    setMarking(true);
    try {
      const res = await authFetch("/api/progress/update", {
        method: "POST",
        body: JSON.stringify({ courseId: courseid, lectureId: playerData.lectureId }),
      });
      const data = await res.json();
      if (data.success) {
        setCompletedLectures(data.completedLectures || []);
      }
    } catch (err) {
      console.error("Mark completed error:", err.message);
    } finally {
      setMarking(false);
    }
  };

  const isCompleted = (lectureId) => completedLectures.includes(lectureId);

  return (
    <>
      <div className="p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36">
        {/* left column */}
        <div className="text-gray-800">
          <h2 className="text-xl font-semibold">Course Structure</h2>

          <div className="pt-5">
            {courseData &&
              courseData.courseContent.map((chapter, index) => (
                <div
                  key={index}
                  className="border border-gray-300 bg-white mb-2 rounded"
                >
                  <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                    onClick={() => toggleSection(index)}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        className={`transform transition-transform ${
                          openSection[index] ? "rotate-180" : ""
                        }`}
                        src={assets.down_arrow_icon}
                        alt=""
                      />
                      <p className="font-medium md:text-base text-sm">
                        {chapter.chapterTitle}
                      </p>
                    </div>

                    <p className="text-sm md:text-default">
                      {chapter.chapterContent.length} lectures -{" "}
                      {calculateChapterTime(chapter)}
                    </p>
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openSection[index] ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300">
                      {chapter.chapterContent.map((lecture, i) => (
                        <li key={i} className="flex items-start gap-2 py-1">
                          <img
                            src={
                              isCompleted(lecture.lectureId)
                                ? assets.blue_tick_icon
                                : assets.play_icon
                            }
                            alt=""
                            className="w-4 h-4 mt-1"
                          />

                          <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-default">
                            <p>{lecture.lectureTitle}</p>

                            <div className="flex gap-2">
                              {lecture.lectureUrl && (
                                <p
                                  onClick={() =>
                                    setPlayerData({
                                      ...lecture,
                                      chapter: index + 1,
                                      lecture: i + 1,
                                    })
                                  }
                                  className="text-[#4e91fd] cursor-pointer"
                                >
                                  watch
                                </p>
                              )}

                              <p>
                                {humanizeDuration(
                                  lecture.lectureDuration * 60 * 1000,
                                  { units: ["h", "m"] }
                                )}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
          </div>
          <div className="flex items-center gap-2 py-3 mt-10">
            <h2 className="text-xl font-bold">Rate this Course</h2>
          </div>
        </div>

        {/* right column */}
        <div>
          {playerData ? (
            <div>
              <YouTube
                videoId={playerData.lectureUrl.split("/").pop().split("?")[0]}
                iframeClassName="w-full aspect-video"
              />
              <div className="flex justify-between items-center mt-1">
                <p>
                  {playerData.chapter}.{playerData.lecture}{" "}
                  {playerData.lectureTitle}
                </p>
                <button
                  onClick={handleMarkCompleted}
                  disabled={marking || isCompleted(playerData.lectureId)}
                  className={`text-sm px-3 py-1 rounded ${
                    isCompleted(playerData.lectureId)
                      ? "text-green-600 font-medium"
                      : "text-blue-600 hover:underline"
                  } disabled:opacity-50`}
                >
                  {isCompleted(playerData.lectureId)
                    ? "Completed"
                    : marking
                    ? "Saving..."
                    : "Mark Completed"}
                </button>
              </div>
            </div>
          ) : (
            <img src={courseData ? courseData.courseThumbnail : ""} alt="" />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Player;
