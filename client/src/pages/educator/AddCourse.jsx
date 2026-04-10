import React, { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../context/AppContex";
import { assets } from "../../assets/assets";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const AddCourse = () => {
  const { authFetch, navigate } = useContext(AppContext);

  // Course-level fields
  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState("");
  const [discount, setDiscount] = useState(0);
  const [courseThumbnail, setCourseThumbnail] = useState("");
  const [category, setCategory] = useState("Development");

  // Quill rich text editor for description
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  // Chapters + lectures
  const [chapters, setChapters] = useState([
    {
      chapterTitle: "",
      chapterContent: [
        { lectureTitle: "", lectureDuration: "", lectureUrl: "", isPreviewFree: false },
      ],
    },
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Init Quill once
  useEffect(() => {
    if (!editorRef.current) {
      editorRef.current = new Quill(quillRef.current, {
        theme: "snow",
        placeholder: "Write course description here...",
      });
    }
  }, []);

  // --- Chapter helpers ---
  const addChapter = () =>
    setChapters((prev) => [
      ...prev,
      { chapterTitle: "", chapterContent: [{ lectureTitle: "", lectureDuration: "", lectureUrl: "", isPreviewFree: false }] },
    ]);

  const removeChapter = (ci) =>
    setChapters((prev) => prev.filter((_, i) => i !== ci));

  const updateChapterTitle = (ci, value) =>
    setChapters((prev) =>
      prev.map((ch, i) => (i === ci ? { ...ch, chapterTitle: value } : ch))
    );

  // --- Lecture helpers ---
  const addLecture = (ci) =>
    setChapters((prev) =>
      prev.map((ch, i) =>
        i === ci
          ? { ...ch, chapterContent: [...ch.chapterContent, { lectureTitle: "", lectureDuration: "", lectureUrl: "", isPreviewFree: false }] }
          : ch
      )
    );

  const removeLecture = (ci, li) =>
    setChapters((prev) =>
      prev.map((ch, i) =>
        i === ci
          ? { ...ch, chapterContent: ch.chapterContent.filter((_, j) => j !== li) }
          : ch
      )
    );

  const updateLecture = (ci, li, field, value) =>
    setChapters((prev) =>
      prev.map((ch, i) =>
        i === ci
          ? {
              ...ch,
              chapterContent: ch.chapterContent.map((lec, j) =>
                j === li ? { ...lec, [field]: value } : lec
              ),
            }
          : ch
      )
    );

  // --- Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!courseTitle.trim()) return setError("Course title is required.");
    if (!coursePrice || isNaN(coursePrice)) return setError("Valid course price is required.");
    if (!courseThumbnail.trim()) return setError("Thumbnail URL is required.");

    const courseDescription = editorRef.current.root.innerHTML;

    const payload = {
      courseTitle: courseTitle.trim(),
      courseDescription,
      coursePrice: parseFloat(coursePrice),
      discount: parseInt(discount) || 0,
      courseThumbnail: courseThumbnail.trim(),
      category,
      courseContent: chapters.map((ch) => ({
        chapterTitle: ch.chapterTitle,
        chapterContent: ch.chapterContent.map((lec) => ({
          lectureTitle: lec.lectureTitle,
          lectureDuration: parseFloat(lec.lectureDuration) || 0,
          lectureUrl: lec.lectureUrl,
          isPreviewFree: lec.isPreviewFree,
        })),
      })),
    };

    try {
      setSubmitting(true);
      const res = await authFetch("/api/courses", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        navigate("/educator/my-courses");
      } else {
        setError(data.message || "Failed to create course.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Add New Course</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Course Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
          <input
            type="text"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            placeholder="e.g. Introduction to JavaScript"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Description (Quill) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <div ref={quillRef} className="bg-white border border-gray-300 rounded-lg min-h-32" />
        </div>

        {/* Price + Discount + Category */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={coursePrice}
              onChange={(e) => setCoursePrice(e.target.value)}
              placeholder="49.99"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {["Development", "Design", "Business", "Marketing", "Data Science", "Finance", "Personal Development", "Other"].map(
                (c) => <option key={c}>{c}</option>
              )}
            </select>
          </div>
        </div>

        {/* Thumbnail URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Thumbnail URL
          </label>
          <input
            type="url"
            value={courseThumbnail}
            onChange={(e) => setCourseThumbnail(e.target.value)}
            placeholder="https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <p className="text-xs text-gray-400 mt-1">
            Tip: use a YouTube thumbnail URL or any public image link.
          </p>
        </div>

        {/* Course Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Course Content</label>

          {chapters.map((chapter, ci) => (
            <div key={ci} className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
              {/* Chapter Header */}
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 border-b border-gray-200">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide w-20 shrink-0">
                  Chapter {ci + 1}
                </span>
                <input
                  type="text"
                  value={chapter.chapterTitle}
                  onChange={(e) => updateChapterTitle(ci, e.target.value)}
                  placeholder="Chapter title"
                  className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
                {chapters.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeChapter(ci)}
                    className="text-red-400 hover:text-red-600 text-xs ml-2 shrink-0"
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* Lectures */}
              <div className="p-4 space-y-3">
                {chapter.chapterContent.map((lecture, li) => (
                  <div key={li} className="grid grid-cols-1 sm:grid-cols-[1fr_80px_1fr_auto_auto] gap-2 items-center">
                    <input
                      type="text"
                      value={lecture.lectureTitle}
                      onChange={(e) => updateLecture(ci, li, "lectureTitle", e.target.value)}
                      placeholder="Lecture title"
                      className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={lecture.lectureDuration}
                      onChange={(e) => updateLecture(ci, li, "lectureDuration", e.target.value)}
                      placeholder="Mins"
                      className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                    <input
                      type="url"
                      value={lecture.lectureUrl}
                      onChange={(e) => updateLecture(ci, li, "lectureUrl", e.target.value)}
                      placeholder="YouTube URL"
                      className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                    <label className="flex items-center gap-1 text-xs text-gray-600 whitespace-nowrap cursor-pointer">
                      <input
                        type="checkbox"
                        checked={lecture.isPreviewFree}
                        onChange={(e) => updateLecture(ci, li, "isPreviewFree", e.target.checked)}
                        className="accent-blue-500"
                      />
                      Free
                    </label>
                    {chapter.chapterContent.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLecture(ci, li)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <img src={assets.cross_icon} alt="remove" className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addLecture(ci)}
                  className="text-sm text-blue-500 hover:text-blue-700 flex items-center gap-1 mt-1"
                >
                  <img src={assets.add_icon} alt="" className="w-4 h-4" />
                  Add Lecture
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addChapter}
            className="text-sm text-blue-500 hover:text-blue-700 flex items-center gap-1"
          >
            <img src={assets.add_icon} alt="" className="w-4 h-4" />
            Add Chapter
          </button>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Save Course"}
        </button>
      </form>
    </div>
  );
};

export default AddCourse;
