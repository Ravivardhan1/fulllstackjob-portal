import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ScoreDisplay from "../../components/MockInterview/ScoreDisplay";
import FeedbackCard from "../../components/MockInterview/FeedbackCard";
import { FiArrowLeft, FiDownload } from "react-icons/fi";

export default function InterviewResults() {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchResults();
    }, [sessionId]);

    const fetchResults = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:3000/api/v1/interviews/${sessionId}/results`,
                { withCredentials: true }
            );
            if (response.data.status) {
                setResults(response.data.result);
            }
        } catch (err) {
            // setError("Failed to load results");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadReport = () => {
        // Create a simple text report
        const report = `
INTERVIEW RESULTS REPORT
========================

Category: ${results.category}
Job Role: ${results.jobRole}
Difficulty: ${results.difficulty}
Date: ${new Date(results.completedAt).toLocaleDateString()}

OVERALL SCORE: ${results.finalScore}%
Quality: ${results.quality}
Evaluation: ${results.evaluationProvider || "AI-assisted"}

DETAILED ANSWERS:
${results.answers
    .map(
        (answer, idx) => `
QUESTION ${idx + 1}:
${answer.question}

YOUR ANSWER:
${answer.userAnswer}

SAMPLE ANSWER:
${answer.sampleAnswer}

FEEDBACK: ${answer.feedback}
STRENGTHS: ${(answer.strengths || []).join("; ")}
IMPROVEMENTS: ${(answer.improvements || []).join("; ")}
SUGGESTIONS: ${(answer.suggestions || []).join("; ")}
Score: ${answer.score}/20
`
    )
    .join("\n")}
`;

        // Create and download file
        const element = document.createElement("a");
        element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(report));
        element.setAttribute("download", `interview-results-${sessionId}.txt`);
        element.style.display = "none";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (error || !results) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error || "No results found"}</p>
                    <button
                        onClick={() => navigate("/mock-interview")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Back Button */}
                <button
                    onClick={() => navigate("/mock-interview")}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-semibold"
                >
                    <FiArrowLeft /> Back to Dashboard
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Interview Results</h1>
                    <p className="text-gray-600">
                        {results.category} - {results.difficulty}
                    </p>
                    <p className="text-sm text-blue-600 mt-2">
                        Evaluation method: {results.evaluationProvider || "AI-assisted review"}
                    </p>
                </div>

                {/* Score Display */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                    <ScoreDisplay
                        score={results.finalScore}
                        quality={results.quality}
                        totalQuestions={results.answers.length}
                    />

                    {/* Download Button */}
                    <div className="mt-6 flex gap-4 justify-center">
                        <button
                            onClick={handleDownloadReport}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                            <FiDownload /> Download Report
                        </button>
                        <button
                            onClick={() => navigate("/mock-interview")}
                            className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition"
                        >
                            Practice Again
                        </button>
                    </div>
                </div>

                {/* Detailed Feedback */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed Feedback</h2>
                    {results.answers.map((answer, idx) => (
                        <FeedbackCard
                            key={idx}
                            question={answer.question}
                            sampleAnswer={answer.sampleAnswer}
                            userAnswer={answer.userAnswer}
                            feedback={answer.feedback}
                            strengths={answer.strengths}
                            improvements={answer.improvements}
                            suggestions={answer.suggestions}
                            score={answer.score}
                            quality={answer.quality}
                        />
                    ))}
                </div>

                {/* Summary Statistics */}
                <div className="bg-white rounded-lg border border-gray-200 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Summary</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600 mb-2">
                                {results.answers.length}
                            </div>
                            <p className="text-gray-600">Questions Answered</p>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600 mb-2">
                                {results.finalScore}%
                            </div>
                            <p className="text-gray-600">Overall Score</p>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600 mb-2">
                                {results.quality}
                            </div>
                            <p className="text-gray-600">Performance</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
