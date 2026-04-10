import React, { useContext, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { AppContext } from "../../context/AppContex";
import Navbar from "../../components/educator/Navbar";
import Sidebar from "../../components/educator/Sidebar";
import Footer from "../../components/educator/Footer";

const EducatorGate = () => {
  const { user, authLoading, authFetch, isEducator, setIsEducator, navigate } = useContext(AppContext);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authFetch("/api/auth/become-educator", {
        method: "POST",
        body: JSON.stringify({ code: code.trim().toUpperCase() }),
      });
      const data = await res.json();
      if (data.success) {
        setIsEducator(true);
      } else {
        setError(data.message || "Invalid access code.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;

  if (!isEducator) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-md p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-[#4e91fd]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Educator Access</h2>
            <p className="text-sm text-gray-500 mt-1">Enter your access code to unlock the educator dashboard.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Access code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 tracking-widest text-center uppercase"
            />
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4e91fd] hover:bg-blue-600 text-white rounded-lg py-3 text-sm font-medium disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Get Access"}
            </button>
          </form>
          <p
            onClick={() => navigate("/")}
            className="text-center text-xs text-gray-400 mt-4 cursor-pointer hover:text-gray-600"
          >
            ← Back to home
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-auto">
          <main className="flex-1 p-6 bg-gray-50">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default EducatorGate;
