import React, { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../context/AppContex";
import { assets } from "../../assets/assets";
import Quill from "quill";
import "quill/dist/quill.snow.css";

// ─── Step Progress Bar ───────────────────────────────────────────────────────

const STEPS = ["Course Details", "Pricing & Media", "Content", "Review"];

const StepBar = ({ current }) => (
  <div className="flex items-center w-full mb-10 select-none">
    {STEPS.map((label, i) => {
      const done = i < current;
      const active = i === current;
      return (
        <React.Fragment key={i}>
          <div className="flex flex-col items-center gap-1.5 shrink-0">
            {/* Circle */}
            <div
              className={`relative w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-500
                ${done ? "bg-[#4e91fd] text-white shadow-md shadow-blue-200"
                  : active ? "bg-white border-2 border-[#4e91fd] text-[#4e91fd]"
                  : "bg-gray-100 border-2 border-gray-200 text-gray-400"}`}
            >
              {done ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span>{i + 1}</span>
              )}
              {/* Pulse ring on active */}
              {active && (
                <span className="absolute inset-0 rounded-full border-2 border-[#4e91fd]/40 animate-ping" />
              )}
            </div>
            {/* Label */}
            <span className={`text-xs font-medium hidden sm:block transition-colors duration-300
              ${done ? "text-[#4e91fd]" : active ? "text-gray-800" : "text-gray-400"}`}>
              {label}
            </span>
          </div>

          {/* Connector line */}
          {i < STEPS.length - 1 && (
            <div className="flex-1 h-0.5 mx-2 mb-5 sm:mb-[1.35rem] rounded-full overflow-hidden bg-gray-200">
              <div
                className="h-full bg-[#4e91fd] transition-all duration-700 ease-in-out rounded-full"
                style={{ width: i < current ? "100%" : "0%" }}
              />
            </div>
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// ─── Field components ────────────────────────────────────────────────────────

const Field = ({ label, children, hint }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {children}
    {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
  </div>
);

const Input = (props) => (
  <input
    {...props}
    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
  />
);

// ─── Main Component ──────────────────────────────────────────────────────────

const AddCourse = () => {
  const { authFetch, navigate, formatPrice } = useContext(AppContext);

  const [step, setStep] = useState(0);

  // Step 1 — Course Details
  const [courseTitle, setCourseTitle] = useState("");
  const [category, setCategory] = useState("Development");
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  // Step 2 — Pricing & Media
  const [coursePrice, setCoursePrice] = useState("");
  const [discount, setDiscount] = useState(0);
  const [courseThumbnail, setCourseThumbnail] = useState("");

  // Step 3 — Content
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

  // Init Quill
  useEffect(() => {
    if (!editorRef.current) {
      editorRef.current = new Quill(quillRef.current, {
        theme: "snow",
        placeholder: "Describe what students will learn...",
      });
    }
  }, []);

  // ── Validation per step ────────────────────────────────────────────────────

  const validate = () => {
    if (step === 0) {
      if (!courseTitle.trim()) return "Course title is required.";
    }
    if (step === 1) {
      if (!coursePrice || isNaN(coursePrice) || Number(coursePrice) < 0)
        return "Enter a valid course price.";
      if (!courseThumbnail.trim()) return "Thumbnail URL is required.";
    }
    if (step === 2) {
      for (let ci = 0; ci < chapters.length; ci++) {
        if (!chapters[ci].chapterTitle.trim())
          return `Chapter ${ci + 1} needs a title.`;
        for (let li = 0; li < chapters[ci].chapterContent.length; li++) {
          if (!chapters[ci].chapterContent[li].lectureTitle.trim())
            return `Lecture ${li + 1} in Chapter ${ci + 1} needs a title.`;
        }
      }
    }
    return null;
  };

  const next = () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setStep((s) => s + 1);
  };

  const back = () => { setError(""); setStep((s) => s - 1); };

  // ── Chapter / Lecture helpers ──────────────────────────────────────────────

  const addChapter = () =>
    setChapters((prev) => [
      ...prev,
      { chapterTitle: "", chapterContent: [{ lectureTitle: "", lectureDuration: "", lectureUrl: "", isPreviewFree: false }] },
    ]);

  const removeChapter = (ci) => setChapters((prev) => prev.filter((_, i) => i !== ci));
  const updateChapterTitle = (ci, v) =>
    setChapters((prev) => prev.map((ch, i) => (i === ci ? { ...ch, chapterTitle: v } : ch)));

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
        i === ci ? { ...ch, chapterContent: ch.chapterContent.filter((_, j) => j !== li) } : ch
      )
    );

  const updateLecture = (ci, li, field, value) =>
    setChapters((prev) =>
      prev.map((ch, i) =>
        i === ci
          ? { ...ch, chapterContent: ch.chapterContent.map((lec, j) => (j === li ? { ...lec, [field]: value } : lec)) }
          : ch
      )
    );

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    setError("");
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
      const res = await authFetch("/api/courses", { method: "POST", body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) navigate("/educator/my-courses");
      else setError(data.message || "Failed to create course.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Derived review values ──────────────────────────────────────────────────

  const totalLectures = chapters.reduce((s, ch) => s + ch.chapterContent.length, 0);
  const discountedPrice = coursePrice
    ? (parseFloat(coursePrice) * (1 - (parseInt(discount) || 0) / 100)).toFixed(2)
    : "—";

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-3xl">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Add New Course</h2>

      <StepBar current={step} />

      {/* ── Quill is always mounted; hidden when not on step 0 ── */}
      <div style={{ display: step === 0 ? "block" : "none" }} className="space-y-5">
        <Field label="Course Title">
          <Input
            type="text"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            placeholder="e.g. Introduction to JavaScript"
          />
        </Field>

        <Field label="Category">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {["Development", "Design", "Business", "Marketing", "Data Science", "Finance", "Personal Development", "Other"].map(
              (c) => <option key={c}>{c}</option>
            )}
          </select>
        </Field>

        <Field label="Description">
          <div ref={quillRef} className="bg-white border border-gray-300 rounded-lg min-h-40" />
        </Field>
      </div>

      {/* ── Step 1: Pricing & Media ── */}
      {step === 1 && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Price (₦)">
              <Input
                type="number" min="0" step="0.01"
                value={coursePrice}
                onChange={(e) => setCoursePrice(e.target.value)}
                placeholder="49.99"
              />
            </Field>
            <Field label="Discount (%)">
              <Input
                type="number" min="0" max="100"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="0"
              />
            </Field>
          </div>

          <Field
            label="Thumbnail URL"
            hint="Tip: use a YouTube thumbnail — https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg"
          >
            <Input
              type="url"
              value={courseThumbnail}
              onChange={(e) => setCourseThumbnail(e.target.value)}
              placeholder="https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg"
            />
          </Field>

          {courseThumbnail && (
            <div className="rounded-xl overflow-hidden border border-gray-200 aspect-video w-full max-w-sm">
              <img src={courseThumbnail} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      )}

      {/* ── Step 2: Content ── */}
      {step === 2 && (
        <div>
          {chapters.map((chapter, ci) => (
            <div key={ci} className="border border-gray-200 rounded-xl mb-4 overflow-hidden">
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
                  <button type="button" onClick={() => removeChapter(ci)}
                    className="text-red-400 hover:text-red-600 text-xs ml-2 shrink-0">
                    Remove
                  </button>
                )}
              </div>

              <div className="p-4 space-y-3">
                {chapter.chapterContent.map((lecture, li) => (
                  <div key={li} className="grid grid-cols-1 sm:grid-cols-[1fr_80px_1fr_auto_auto] gap-2 items-center">
                    <input type="text" value={lecture.lectureTitle}
                      onChange={(e) => updateLecture(ci, li, "lectureTitle", e.target.value)}
                      placeholder="Lecture title"
                      className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                    <input type="number" min="0" step="0.5" value={lecture.lectureDuration}
                      onChange={(e) => updateLecture(ci, li, "lectureDuration", e.target.value)}
                      placeholder="Mins"
                      className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                    <input type="url" value={lecture.lectureUrl}
                      onChange={(e) => updateLecture(ci, li, "lectureUrl", e.target.value)}
                      placeholder="YouTube URL"
                      className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                    <label className="flex items-center gap-1 text-xs text-gray-600 whitespace-nowrap cursor-pointer">
                      <input type="checkbox" checked={lecture.isPreviewFree}
                        onChange={(e) => updateLecture(ci, li, "isPreviewFree", e.target.checked)}
                        className="accent-blue-500"
                      />
                      Free
                    </label>
                    {chapter.chapterContent.length > 1 && (
                      <button type="button" onClick={() => removeLecture(ci, li)}
                        className="text-red-400 hover:text-red-600">
                        <img src={assets.cross_icon} alt="remove" className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}

                <button type="button" onClick={() => addLecture(ci)}
                  className="text-sm text-blue-500 hover:text-blue-700 flex items-center gap-1 mt-1">
                  <img src={assets.add_icon} alt="" className="w-4 h-4" />
                  Add Lecture
                </button>
              </div>
            </div>
          ))}

          <button type="button" onClick={addChapter}
            className="text-sm text-blue-500 hover:text-blue-700 flex items-center gap-1">
            <img src={assets.add_icon} alt="" className="w-4 h-4" />
            Add Chapter
          </button>
        </div>
      )}

      {/* ── Step 3: Review ── */}
      {step === 3 && (
        <div className="space-y-5">
          {/* Summary card */}
          <div className="rounded-2xl border border-gray-200 overflow-hidden">
            {/* Thumbnail banner */}
            {courseThumbnail && (
              <img src={courseThumbnail} alt="" className="w-full h-44 object-cover" />
            )}
            <div className="p-5 space-y-4">
              <div>
                <p className="text-xs font-semibold text-[#4e91fd] uppercase tracking-widest mb-1">{category}</p>
                <h3 className="text-lg font-semibold text-gray-800">{courseTitle || "Untitled Course"}</h3>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Price", value: formatPrice(parseFloat(coursePrice || 0)) },
                  { label: "After discount", value: discount > 0 ? formatPrice(discountedPrice) : "—" },
                  { label: "Discount", value: discount > 0 ? `${discount}%` : "None" },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                    <p className="font-semibold text-gray-800 text-sm">{value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Chapters", value: chapters.length },
                  { label: "Total Lectures", value: totalLectures },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-blue-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                    <p className="font-bold text-[#4e91fd] text-xl">{value}</p>
                  </div>
                ))}
              </div>

              {/* Chapter list */}
              <div className="space-y-1">
                {chapters.map((ch, ci) => (
                  <div key={ci} className="flex items-center justify-between text-sm py-1.5 border-b border-gray-100 last:border-0">
                    <span className="text-gray-700 font-medium">{ch.chapterTitle || `Chapter ${ci + 1}`}</span>
                    <span className="text-gray-400 text-xs">{ch.chapterContent.length} lectures</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2">
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-[#4e91fd] hover:bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Publishing...
              </>
            ) : (
              "Publish Course"
            )}
          </button>
        </div>
      )}

      {/* ── Navigation buttons ── */}
      {step < 3 && (
        <div className={`flex mt-8 ${step > 0 ? "justify-between" : "justify-end"}`}>
          {step > 0 && (
            <button onClick={back}
              className="px-5 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              Back
            </button>
          )}

          {error && (
            <p className="text-red-500 text-sm self-center mx-4 flex-1">{error}</p>
          )}

          <button onClick={next}
            className="px-6 py-2 text-sm font-semibold text-white bg-[#4e91fd] hover:bg-blue-600 rounded-lg transition flex items-center gap-2">
            {step === 2 ? "Review" : "Continue"}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {step === 3 && !error && (
        <button onClick={back}
          className="mt-4 w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition">
          ← Edit course
        </button>
      )}
    </div>
  );
};

export default AddCourse;
