import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppContext } from "../../context/AppContex";

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const { authFetch, fetchUserEnrolledCourses, authLoading, user } = useContext(AppContext);
  const navigate = useNavigate();

  const [status, setStatus] = useState("verifying"); // "verifying" | "success" | "failed"

  useEffect(() => {
    // Wait until Firebase has restored the auth session
    if (authLoading) return;

    const reference = searchParams.get("reference");
    if (!reference || !user) {
      setStatus("failed");
      return;
    }

    const verify = async () => {
      try {
        const res = await authFetch(`/api/payment/verify?reference=${reference}`);
        const data = await res.json();

        if (data.success) {
          await fetchUserEnrolledCourses();
          setStatus("success");
          setTimeout(() => navigate(`/player/${data.courseId}`), 2000);
        } else {
          setStatus("failed");
        }
      } catch {
        setStatus("failed");
      }
    };

    verify();
  }, [authLoading, user]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      {status === "verifying" && (
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Verifying your payment...</p>
        </div>
      )}

      {status === "success" && (
        <div className="text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
          <p className="text-gray-500">Redirecting you to your course...</p>
        </div>
      )}

      {status === "failed" && (
        <div className="text-center">
          <div className="text-5xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h2>
          <p className="text-gray-500 mb-6">Something went wrong. Please try again.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded-full"
          >
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentCallback;
