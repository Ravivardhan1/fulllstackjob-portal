import React, { useEffect, useState } from "react";
import axios from "axios";
import CategoryCard from "../../components/MockInterview/CategoryCard";
import { FiArrowRight, FiArrowLeft, FiPlus, FiBookOpen, FiLayout } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import Swal from "sweetalert2";

// ─────────────────────────────────────────────
// RECRUITER: Question Manager Panel
// ─────────────────────────────────────────────
function RecruiterInterviewManager() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("add"); // "add" | "templates"

    // Add Question form state
    const CATEGORIES = [
        "JavaScript", "React", "TypeScript", "HTML & CSS",
        "Node.js", "Python", "Data Structures", "Algorithms", "SQL", "Git"
    ];
    const [qCategory, setQCategory] = useState("JavaScript");
    const [qDifficulty, setQDifficulty] = useState("Easy");
    const [qText, setQText] = useState("");
    const [qTip, setQTip] = useState("");
    const [qSample, setQSample] = useState("");
    const [adding, setAdding] = useState(false);

    const handleAddQuestion = async (e) => {
        e.preventDefault();
        if (!qText.trim()) return;
        setAdding(true);
        try {
            const response = await axios.post(
                "http://localhost:3000/api/v1/interviews/questions/add",
                {
                    question: qText.trim(),
                    category: qCategory,
                    difficulty: qDifficulty,
                    tips: qTip.trim() ? [qTip.trim()] : [],
                    sampleAnswer: qSample.trim(),
                },
                { withCredentials: true }
            );
            if (response.data.status) {
                Swal.fire({
                    icon: "success",
                    title: "Question Added!",
                    text: `"${qText.slice(0, 60)}..." was added to ${qCategory} (${qDifficulty}).`,
                    confirmButtonColor: "#3b82f6",
                    timer: 2500,
                    showConfirmButton: false,
                });
                setQText("");
                setQTip("");
                setQSample("");
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Failed to Add",
                text: err?.response?.data?.message || "Something went wrong.",
                confirmButtonColor: "#3b82f6",
            });
        } finally {
            setAdding(false);
        }
    };

    return (
        <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f4ff 0%, #ffffff 100%)", padding: "40px 16px" }}>
            <div style={{ maxWidth: "860px", margin: "0 auto" }}>

                {/* Back */}
                <button
                    onClick={() => navigate('/dashboard')}
                    style={{ display: "flex", alignItems: "center", gap: "6px", color: "#3b82f6", fontWeight: 600, background: "none", border: "none", cursor: "pointer", marginBottom: "24px", fontSize: "14px" }}
                >
                    <FiArrowLeft /> Back to Dashboard
                </button>

                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "36px" }}>
                    <div style={{ fontSize: "48px", marginBottom: "12px" }}>🎯</div>
                    <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>
                        Interview Question Manager
                    </h1>
                    <p style={{ color: "#64748b", marginTop: "10px", fontSize: "15px" }}>
                        Manage the interview question bank and your job interview templates.
                    </p>
                </div>

                {/* Tabs */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "28px", background: "#f1f5f9", padding: "6px", borderRadius: "12px" }}>
                    <button
                        onClick={() => setActiveTab("add")}
                        style={{
                            flex: 1, padding: "10px", border: "none", borderRadius: "8px", fontWeight: 600, fontSize: "14px", cursor: "pointer",
                            background: activeTab === "add" ? "#ffffff" : "transparent",
                            color: activeTab === "add" ? "#3b82f6" : "#64748b",
                            boxShadow: activeTab === "add" ? "0 1px 6px rgba(0,0,0,0.1)" : "none",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: "6px"
                        }}
                    >
                        <FiPlus /> Add Question
                    </button>
                    <button
                        onClick={() => setActiveTab("templates")}
                        style={{
                            flex: 1, padding: "10px", border: "none", borderRadius: "8px", fontWeight: 600, fontSize: "14px", cursor: "pointer",
                            background: activeTab === "templates" ? "#ffffff" : "transparent",
                            color: activeTab === "templates" ? "#3b82f6" : "#64748b",
                            boxShadow: activeTab === "templates" ? "0 1px 6px rgba(0,0,0,0.1)" : "none",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: "6px"
                        }}
                    >
                        <FiLayout /> My Job Templates
                    </button>
                </div>

                {/* ── Tab: Add Question ── */}
                {activeTab === "add" && (
                    <div style={{ background: "#fff", borderRadius: "16px", padding: "36px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" }}>
                        <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1e293b", marginTop: 0, marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px" }}>
                            <FiBookOpen color="#3b82f6" /> Add New Interview Question
                        </h2>

                        <form onSubmit={handleAddQuestion}>
                            {/* Row: Category + Difficulty */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                                <div>
                                    <label style={labelStyle}>Category</label>
                                    <select value={qCategory} onChange={e => setQCategory(e.target.value)} style={selectStyle}>
                                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Difficulty</label>
                                    <select value={qDifficulty} onChange={e => setQDifficulty(e.target.value)} style={selectStyle}>
                                        {["Easy", "Medium", "Hard"].map(d => <option key={d}>{d}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Question text */}
                            <div style={{ marginBottom: "20px" }}>
                                <label style={labelStyle}>Question <span style={{ color: "#ef4444" }}>*</span></label>
                                <textarea
                                    required
                                    rows={3}
                                    placeholder="Write the interview question here..."
                                    value={qText}
                                    onChange={e => setQText(e.target.value)}
                                    style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
                                />
                            </div>

                            {/* Tip */}
                            <div style={{ marginBottom: "20px" }}>
                                <label style={labelStyle}>Tip <span style={{ color: "#94a3b8", fontWeight: 400 }}>(optional)</span></label>
                                <input
                                    type="text"
                                    placeholder="Give candidates a helpful hint..."
                                    value={qTip}
                                    onChange={e => setQTip(e.target.value)}
                                    style={inputStyle}
                                />
                            </div>

                            {/* Sample Answer */}
                            <div style={{ marginBottom: "28px" }}>
                                <label style={labelStyle}>Sample Answer <span style={{ color: "#94a3b8", fontWeight: 400 }}>(optional)</span></label>
                                <textarea
                                    rows={4}
                                    placeholder="Write an ideal answer for reference..."
                                    value={qSample}
                                    onChange={e => setQSample(e.target.value)}
                                    style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
                                />
                            </div>

                            {/* Difficulty badge preview */}
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                                <span style={{ fontSize: "13px", color: "#64748b" }}>Preview badge:</span>
                                <span style={{
                                    padding: "3px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: 700,
                                    background: qDifficulty === "Easy" ? "#dcfce7" : qDifficulty === "Medium" ? "#fef9c3" : "#fee2e2",
                                    color: qDifficulty === "Easy" ? "#16a34a" : qDifficulty === "Medium" ? "#ca8a04" : "#dc2626",
                                }}>{qDifficulty}</span>
                                <span style={{
                                    padding: "3px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: 700,
                                    background: "#eff6ff", color: "#3b82f6"
                                }}>{qCategory}</span>
                            </div>

                            <button
                                type="submit"
                                disabled={adding}
                                style={{
                                    width: "100%", padding: "13px", background: adding ? "#94a3b8" : "#3b82f6",
                                    color: "#fff", border: "none", borderRadius: "10px", fontWeight: 700,
                                    fontSize: "15px", cursor: adding ? "not-allowed" : "pointer",
                                    transition: "background 0.2s"
                                }}
                            >
                                {adding ? "Adding..." : "➕ Add Question to Bank"}
                            </button>
                        </form>
                    </div>
                )}

                {/* ── Tab: My Templates ── */}
                {activeTab === "templates" && (
                    <div style={{ background: "#fff", borderRadius: "16px", padding: "36px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" }}>
                        <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1e293b", marginTop: 0, marginBottom: "8px" }}>
                            📋 Your Job Interview Templates
                        </h2>
                        <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "28px" }}>
                            Interview templates are linked to your job postings. Go to your dashboard to create or edit them.
                        </p>

                        {/* Quick action cards */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                            <div
                                onClick={() => navigate("/dashboard/manage-jobs")}
                                style={templateCardStyle}
                            >
                                <div style={{ fontSize: "32px", marginBottom: "10px" }}>💼</div>
                                <div style={{ fontWeight: 700, color: "#1e293b", marginBottom: "4px" }}>Manage Job Postings</div>
                                <div style={{ fontSize: "13px", color: "#64748b" }}>View all your active jobs and manage settings.</div>
                                <div style={{ marginTop: "14px", color: "#3b82f6", fontSize: "13px", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                                    Open <FiArrowRight />
                                </div>
                            </div>

                            <div
                                onClick={() => navigate("/dashboard/add-jobs")}
                                style={templateCardStyle}
                            >
                                <div style={{ fontSize: "32px", marginBottom: "10px" }}>➕</div>
                                <div style={{ fontWeight: 700, color: "#1e293b", marginBottom: "4px" }}>Post a New Job</div>
                                <div style={{ fontSize: "13px", color: "#64748b" }}>Create a new job listing and attach an interview template.</div>
                                <div style={{ marginTop: "14px", color: "#3b82f6", fontSize: "13px", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                                    Open <FiArrowRight />
                                </div>
                            </div>

                            <div
                                onClick={() => navigate("/dashboard/manage-jobs")}
                                style={templateCardStyle}
                            >
                                <div style={{ fontSize: "32px", marginBottom: "10px" }}>📊</div>
                                <div style={{ fontWeight: 700, color: "#1e293b", marginBottom: "4px" }}>View Candidate Results</div>
                                <div style={{ fontSize: "13px", color: "#64748b" }}>Open Manage Jobs and choose a specific job to see both custom and general mock interview results.</div>
                                <div style={{ marginTop: "14px", color: "#3b82f6", fontSize: "13px", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                                    Open <FiArrowRight />
                                </div>
                            </div>

                            <div
                                onClick={() => navigate("/dashboard")}
                                style={templateCardStyle}
                            >
                                <div style={{ fontSize: "32px", marginBottom: "10px" }}>🏠</div>
                                <div style={{ fontWeight: 700, color: "#1e293b", marginBottom: "4px" }}>Recruiter Dashboard</div>
                                <div style={{ fontSize: "13px", color: "#64748b" }}>Back to your main recruiter dashboard.</div>
                                <div style={{ marginTop: "14px", color: "#3b82f6", fontSize: "13px", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                                    Open <FiArrowRight />
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: "24px", padding: "16px", background: "#eff6ff", borderRadius: "10px", border: "1px solid #bfdbfe" }}>
                            <p style={{ margin: 0, fontSize: "13px", color: "#1d4ed8" }}>
                                💡 <strong>Tip:</strong> To attach a custom interview template to a job, go to <em>Manage Jobs</em>, click on a job, and use the <em>Interview Template</em> option.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const labelStyle = {
    display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px"
};
const inputStyle = {
    width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "8px",
    fontSize: "13px", color: "#1e293b", outline: "none", boxSizing: "border-box",
    transition: "border-color 0.15s"
};
const selectStyle = {
    ...inputStyle, background: "#fff", cursor: "pointer"
};
const templateCardStyle = {
    padding: "20px", border: "1px solid #e2e8f0", borderRadius: "12px", cursor: "pointer",
    transition: "box-shadow 0.2s, border-color 0.2s",
    background: "#fafafa"
};

// ─────────────────────────────────────────────
// CANDIDATE: Existing Interview Dashboard
// ─────────────────────────────────────────────
function CandidateDashboard() {
    const [categories, setCategories] = useState([
        { name: "JavaScript", questionsCount: 42 },
        { name: "React", questionsCount: 38 },
        { name: "TypeScript", questionsCount: 27 },
        { name: "HTML & CSS", questionsCount: 35 },
        { name: "Node.js", questionsCount: 23 },
        { name: "Python", questionsCount: 31 },
        { name: "Data Structures", questionsCount: 19 },
        { name: "Algorithms", questionsCount: 25 },
        { name: "SQL", questionsCount: 17 },
        { name: "Git", questionsCount: 14 },
    ]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:3000/api/v1/interviews/categories");
            if (response.data.status) {
                setCategories(response.data.result);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryClick = (category) => {
        navigate(`/mock-interview/choose/${category.name}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            <div className="container mx-auto px-4 py-12">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-semibold"
                >
                    <FiArrowLeft /> Back to Home
                </button>

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        🎤 Mock Interview Practice
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Practice your interview skills with our comprehensive question bank. Choose a category,
                        answer questions, and get detailed feedback to improve your performance.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-red-700">
                        {error}
                    </div>
                )}

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {categories.map((category) => (
                        <CategoryCard
                            key={category.name}
                            category={category.name}
                            questionsCount={category.questionsCount}
                            onClick={() => handleCategoryClick(category)}
                        />
                    ))}
                </div>

                {/* How It Works */}
                <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <span className="text-xl">1️⃣</span>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Choose Category</h3>
                            <p className="text-gray-600 text-sm">Select a job category and difficulty level</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <span className="text-xl">2️⃣</span>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Answer Questions</h3>
                            <p className="text-gray-600 text-sm">Answer interview questions under timed conditions</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <span className="text-xl">3️⃣</span>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Get Feedback</h3>
                            <p className="text-gray-600 text-sm">Receive detailed feedback and improve your answers</p>
                        </div>
                    </div>
                </div>

                {/* Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">💡 Tips for Success</h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                        <li className="flex items-start">
                            <span className="text-blue-600 font-bold mr-3">✓</span>
                            <p>Take your time to provide thoughtful, detailed answers</p>
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-600 font-bold mr-3">✓</span>
                            <p>Practice regularly to build confidence and improve performance</p>
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-600 font-bold mr-3">✓</span>
                            <p>Review feedback carefully and understand areas for improvement</p>
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-600 font-bold mr-3">✓</span>
                            <p>Compare your answers with sample answers to learn better approaches</p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
// MAIN EXPORT — role router
// ─────────────────────────────────────────────
export default function InterviewDashboard() {
    const { user, userLoading } = useUserContext();

    if (userLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (user?.role === "recruiter" || user?.role === "admin") {
        return <RecruiterInterviewManager />;
    }

    return <CandidateDashboard />;
}
