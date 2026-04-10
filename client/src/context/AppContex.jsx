import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";

export const AppContext = createContext();

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const AppContextProvider = (props) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // --- Auth helpers ---

  /**
   * Returns the Firebase ID token for the current user.
   * Used as the Authorization header on all protected API calls.
   */
  const getToken = async () => {
    if (!auth.currentUser) return null;
    return auth.currentUser.getIdToken();
  };

  const authFetch = async (url, options = {}) => {
    const token = await getToken();
    return fetch(`${backendUrl}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  };

  // --- Firebase Auth listener ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);

      if (firebaseUser) {
        // Sync user to Firestore and fetch their role
        try {
          const token = await firebaseUser.getIdToken();

          const syncRes = await fetch(`${backendUrl}/api/auth/sync`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: firebaseUser.displayName || firebaseUser.email,
              email: firebaseUser.email,
              imageUrl: firebaseUser.photoURL || "",
            }),
          });
          const syncData = await syncRes.json();
          if (syncData.success) {
            setIsEducator(syncData.user?.isEducator || false);
          }

          // Load enrolled courses now that we have a user
          fetchUserEnrolledCourses(token);
        } catch (err) {
          console.error("Auth sync error:", err.message);
        }
      } else {
        setEnrolledCourses([]);
        setIsEducator(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // --- Data fetching ---

  const fetchAllCourses = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/courses`);
      const data = await res.json();
      if (data.success) setAllCourses(data.courses);
    } catch (err) {
      console.error("fetchAllCourses error:", err.message);
    }
  };

  const fetchUserEnrolledCourses = async (token) => {
    try {
      const t = token || (await getToken());
      if (!t) return;
      const res = await fetch(`${backendUrl}/api/enrollments/my-courses`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      const data = await res.json();
      if (data.success) setEnrolledCourses(data.courses);
    } catch (err) {
      console.error("fetchUserEnrolledCourses error:", err.message);
    }
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

  // --- Course calculation helpers (unchanged from original) ---

  const calculateRating = (course) => {
    if (!course?.courseRatings || course.courseRatings.length === 0) return 0;
    let total = 0;
    course.courseRatings.forEach((r) => { total += Number(r.rating || 0); });
    return total / course.courseRatings.length;
  };

  const calculateChapterTime = (chapter) => {
    let time = 0;
    chapter.chapterContent.forEach((lecture) => { time += lecture.lectureDuration; });
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  const calculateCourseDuration = (course) => {
    let time = 0;
    course.courseContent.forEach((chapter) => {
      chapter.chapterContent.forEach((lecture) => { time += lecture.lectureDuration; });
    });
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  const calculateNoOfLectures = (course) => {
    let total = 0;
    course.courseContent.forEach((chapter) => {
      if (Array.isArray(chapter.chapterContent)) total += chapter.chapterContent.length;
    });
    return total;
  };

  const value = {
    currency,
    allCourses,
    setAllCourses,
    navigate,
    calculateRating,
    isEducator,
    setIsEducator,
    calculateChapterTime,
    calculateNoOfLectures,
    calculateCourseDuration,
    enrolledCourses,
    fetchUserEnrolledCourses,
    // Auth
    user,
    setUser,
    authLoading,
    getToken,
    authFetch,
    backendUrl,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
