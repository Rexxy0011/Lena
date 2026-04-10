import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContex";
import { useParams, Navigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import YouTube from "react-youtube";
import Footer from "../../components/student/Footer";

const getYouTubeId = (url) => {
  if (!url) return null;
  const short = url.match(/youtu\.be\/([^?&]+)/);
  if (short) return short[1];
  const long = url.match(/(?:v=|\/embed\/|\/v\/)([^?&]+)/);
  return long ? long[1] : null;
};

const Player = () => {
  const { enrolledCourses, calculateChapterTime, authFetch, user, authLoading, navigate } = useContext(AppContext);
  const { courseid } = useParams();

  const [courseData, setCourseData] = useState(null);
  const [openSection, setOpenSection] = useState({ 0: true });
  const [playerData, setPlayerData] = useState(null);
  const [completedLectures, setCompletedLectures] = useState([]);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    const found = enrolledCourses?.find((course) => course._id === courseid);
    setCourseData(found || null);
  }, [enrolledCourses, courseid]);

  useEffect(() => {
    if (!courseid || !user) return;
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
  }, [courseid, user]);

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
      if (data.success) setCompletedLectures(data.completedLectures || []);
    } catch (err) {
      console.error("Mark completed error:", err.message);
    } finally {
      setMarking(false);
    }
  };

  const isCompleted = (lectureId) => completedLectures.includes(lectureId);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;

  if (!authLoading && !courseData && enrolledCourses !== null) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <p className="text-gray-500 mb-4">You are not enrolled in this course.</p>
          <button
            onClick={() => navigate(`/course/${courseid}`)}
            className="bg-[#4e91fd] text-white px-6 py-2 rounded-full text-sm"
          >
            View Course
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36">
        {/* Left column — course structure */}
        <div className="text-gray-800">
          <h2 className="text-xl font-semibold">{courseData?.courseTitle}</h2>

          <div className="pt-5">
            {courseData?.courseContent.map((chapter, index) => (
              <div key={index} className="border border-gray-300 bg-white mb-2 rounded">
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                  onClick={() => toggleSection(index)}
                >
                  <div className="flex items-center gap-2">
                    <img
                      className={`transform transition-transform ${openSection[index] ? "rotate-180" : ""}`}
                      src={assets.down_arrow_icon}
                      alt=""
                    />
                    <p className="font-medium md:text-base text-sm">{chapter.chapterTitle}</p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {chapter.chapterContent.length} lectures · {calculateChapterTime(chapter)}
                  </p>
                </div>

                <div className={`overflow-hidden transition-all duration-300 ${openSection[index] ? "max-h-96" : "max-h-0"}`}>
                  <ul className="md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300 space-y-1">
                    {chapter.chapterContent.map((lecture, i) => (
                      <li key={i} className="flex items-center gap-2 py-1">
                        <img
                          src={isCompleted(lecture.lectureId) ? assets.blue_tick_icon : assets.play_icon}
                          alt=""
                          className="w-4 h-4 shrink-0"
                        />
                        <div className="flex items-center justify-between w-full text-xs md:text-sm">
                          <p className={playerData?.lectureId === lecture.lectureId ? "text-[#4e91fd] font-medium" : ""}>
                            {lecture.lectureTitle}
                          </p>
                          <div className="flex items-center gap-3 shrink-0 ml-2">
                            {lecture.lectureUrl && (
                              <button
                                onClick={() => setPlayerData({ ...lecture, chapter: index + 1, lecture: i + 1 })}
                                className="text-[#4e91fd] hover:underline"
                              >
                                Watch
                              </button>
                            )}
                            <span className="text-gray-400">
                              {humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ["h", "m"] })}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — video player */}
        <div className="sticky top-4">
          {playerData ? (
            <div>
              <YouTube
                videoId={getYouTubeId(playerData.lectureUrl)}
                iframeClassName="w-full aspect-video rounded"
                opts={{ playerVars: { autoplay: 1 } }}
              />
              <div className="flex justify-between items-center mt-3 px-1">
                <p className="text-sm text-gray-700 font-medium">
                  {playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}
                </p>
                <button
                  onClick={handleMarkCompleted}
                  disabled={marking || isCompleted(playerData.lectureId)}
                  className={`text-sm px-3 py-1 rounded-full border ${
                    isCompleted(playerData.lectureId)
                      ? "border-green-400 text-green-600"
                      : "border-blue-400 text-blue-600 hover:bg-blue-50"
                  } disabled:opacity-50`}
                >
                  {isCompleted(playerData.lectureId) ? "✓ Completed" : marking ? "Saving..." : "Mark Completed"}
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded overflow-hidden">
              <img src={courseData?.courseThumbnail} alt="" className="w-full rounded" />
              <p className="text-sm text-gray-400 text-center mt-3">Select a lecture to start watching</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Player;
