import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiArrowLeft } from "react-icons/fi";
import { useUserContext } from "../../context/UserContext";

export default function ChooseCategory() {
    const { user } = useUserContext();
    const { category } = useParams();
    const navigate = useNavigate();
    const [difficulty, setDifficulty] = useState("Easy");
    const [questionsCount, setQuestionsCount] = useState(5);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleStartInterview = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.post(
                "http://localhost:3000/api/v1/interviews/start",
                {
                    category,
                    jobRole: category,
                    difficulty,
                    totalQuestions: questionsCount
                },
                {
                    withCredentials: true
                }
            );

            if (response.data.status) {
                // Navigate to practice interview page with session ID
                navigate(`/mock-interview/practice/${response.data.result.sessionId}`, {
                    state: { questions: response.data.result.questions }
                });
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to start interview");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const difficulties = [
        { level: "Easy", description: "Good for beginners", color: "green" },
        { level: "Medium", description: "For intermediate candidates", color: "yellow" },
        { level: "Hard", description: "Challenge yourself", color: "red" }
    ];

    // ── Recruiter guard ──
    if (user?.role === "recruiter" || user?.role === "admin") {
        return (
            <div style={{
                minHeight: "100vh", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                background: "linear-gradient(135deg, #fef2f2 0%, #fff 100%)"
            }}>
                <div style={{
                    background: "#fff", borderRadius: "16px", padding: "48px 40px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.1)", border: "1px solid #fecaca",
                    maxWidth: "480px", textAlign: "center"
                }}>
                    <div style={{ fontSize: "56px", marginBottom: "16px" }}>🚫</div>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#991b1b", margin: "0 0 12px" }}>
                        This Page is for Candidates Only
                    </h2>
                    <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "28px", lineHeight: 1.6 }}>
                        Recruiters cannot start interview sessions. Head back to the Interview Manager
                        to add questions or manage your job templates.
                    </p>
                    <button
                        onClick={() => navigate("/mock-interview")}
                        style={{
                            padding: "12px 28px", background: "#3b82f6", color: "#fff",
                            border: "none", borderRadius: "10px", fontWeight: 700,
                            fontSize: "15px", cursor: "pointer"
                        }}
                    >
                        ← Go to Interview Manager
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
            <div className="container mx-auto px-4 max-w-2xl">
                {/* Back Button */}
                <button
                    onClick={() => navigate("/mock-interview")}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-semibold"
                >
                    <FiArrowLeft /> Back
                </button>

                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        {category} Interview
                    </h1>
                    <p className="text-gray-600">Choose difficulty level and number of questions</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-red-700">
                        {error}
                    </div>
                )}

                {/* Difficulty Selection */}
                <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Select Difficulty Level</h2>
                    <div className="grid grid-cols-1 gap-4">
                        {difficulties.map((d) => (
                            <label
                                key={d.level}
                                className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                                    difficulty === d.level
                                        ? `border-${d.color}-500 bg-${d.color}-50`
                                        : "border-gray-200 hover:border-gray-300"
                                }`}
                            >
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        name="difficulty"
                                        value={d.level}
                                        checked={difficulty === d.level}
                                        onChange={(e) => setDifficulty(e.target.value)}
                                        className="w-4 h-4"
                                    />
                                    <div className="ml-4">
                                        <p className="font-semibold text-gray-900">{d.level}</p>
                                        <p className="text-sm text-gray-600">{d.description}</p>
                                    </div>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Number of Questions */}
                <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Number of Questions</h2>
                    <div className="flex items-center gap-4">
                        <input
                            type="range"
                            min="3"
                            max="20"
                            value={questionsCount}
                            onChange={(e) => setQuestionsCount(Number(e.target.value))}
                            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-3xl font-bold text-blue-600 min-w-[60px] text-right">
                            {questionsCount}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-4">
                        Estimated time: ~{questionsCount * 2} minutes
                    </p>
                </div>

                {/* Start Button */}
                <button
                    onClick={handleStartInterview}
                    disabled={loading}
                    className={`w-full py-3 px-6 rounded-lg font-bold text-white text-lg transition ${
                        loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 active:scale-95"
                    }`}
                >
                    {loading ? "Starting Interview..." : "Start Interview"}
                </button>
            </div>
        </div>
    );
}
