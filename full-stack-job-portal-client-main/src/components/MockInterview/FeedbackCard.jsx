import React from "react";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";

export default function FeedbackCard({ 
    question,
    sampleAnswer,
    userAnswer,
    feedback,
    strengths = [],
    improvements = [],
    suggestions = [],
    score,
    quality
}) {
    const getQualityColor = () => {
        if (quality === "Excellent") return "bg-green-50 border-green-200";
        if (quality === "Good") return "bg-blue-50 border-blue-200";
        if (quality === "Average") return "bg-yellow-50 border-yellow-200";
        return "bg-red-50 border-red-200";
    };

    return (
        <div className={`border rounded-lg p-6 mb-6 ${getQualityColor()}`}>
            {/* Question */}
            <div className="mb-6">
                <p className="text-sm font-semibold text-gray-600 mb-2">QUESTION</p>
                <p className="text-lg text-gray-900 leading-relaxed">{question}</p>
            </div>

            {/* Your Answer */}
            <div className="mb-6 bg-white rounded p-4 border border-gray-200">
                <p className="text-sm font-semibold text-gray-600 mb-2">YOUR ANSWER</p>
                <p className="text-gray-700 leading-relaxed">{userAnswer}</p>
                <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-600">SCORE:</span>
                    <span className="text-lg font-bold text-blue-600">{score}/20</span>
                </div>
            </div>

            {/* Sample Answer */}
            <div className="mb-6 bg-green-50 rounded p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                    <FiCheckCircle className="text-green-600" />
                    <p className="text-sm font-semibold text-green-700">SAMPLE ANSWER</p>
                </div>
                <p className="text-gray-700 leading-relaxed text-sm">{sampleAnswer}</p>
            </div>

            {/* Feedback */}
            {feedback && (
                <div className="bg-white rounded p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                        <FiAlertCircle className="text-blue-600" />
                        <p className="text-sm font-semibold text-gray-700">FEEDBACK</p>
                    </div>
                    <p className="text-gray-700 text-sm">{feedback}</p>
                </div>
            )}

            {strengths.length > 0 && (
                <div className="mt-4 bg-white rounded p-4 border border-gray-200">
                    <p className="text-sm font-semibold text-green-700 mb-2">STRENGTHS</p>
                    <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                        {strengths.map((item, index) => (
                            <li key={`strength-${index}`}>{item}</li>
                        ))}
                    </ul>
                </div>
            )}

            {improvements.length > 0 && (
                <div className="mt-4 bg-white rounded p-4 border border-gray-200">
                    <p className="text-sm font-semibold text-amber-700 mb-2">IMPROVEMENTS</p>
                    <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                        {improvements.map((item, index) => (
                            <li key={`improvement-${index}`}>{item}</li>
                        ))}
                    </ul>
                </div>
            )}

            {suggestions.length > 0 && (
                <div className="mt-4 bg-white rounded p-4 border border-gray-200">
                    <p className="text-sm font-semibold text-blue-700 mb-2">SUGGESTIONS</p>
                    <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                        {suggestions.map((item, index) => (
                            <li key={`suggestion-${index}`}>{item}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
