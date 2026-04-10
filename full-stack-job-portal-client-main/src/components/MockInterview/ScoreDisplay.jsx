import React from "react";
import { FiAward, FiTrendingUp } from "react-icons/fi";

export default function ScoreDisplay({ 
    score, 
    quality, 
    totalQuestions = 5 
}) {
    const getQualityColor = () => {
        if (quality === "Excellent") return "text-green-600";
        if (quality === "Good") return "text-blue-600";
        if (quality === "Average") return "text-yellow-600";
        return "text-red-600";
    };

    const getQualityBg = () => {
        if (quality === "Excellent") return "bg-green-50";
        if (quality === "Good") return "bg-blue-50";
        if (quality === "Average") return "bg-yellow-50";
        return "bg-red-50";
    };

    const getScoreLevel = () => {
        if (score >= 80) return "Outstanding";
        if (score >= 60) return "Good";
        if (score >= 40) return "Average";
        return "Needs Improvement";
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-b from-blue-50 to-white rounded-lg border border-blue-200">
            <div className="relative w-32 h-32 mb-6">
                <svg className="transform -rotate-90 w-32 h-32">
                    <circle
                        cx="64"
                        cy="64"
                        r="60"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                    />
                    <circle
                        cx="64"
                        cy="64"
                        r="60"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="8"
                        strokeDasharray={`${(score / 100) * 377} 377`}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-blue-600">{score}</span>
                    <span className="text-sm text-gray-600">%</span>
                </div>
            </div>

            <div className="text-center mb-6">
                <p className={`text-2xl font-bold mb-2 ${getQualityColor()}`}>
                    {quality}
                </p>
                <p className="text-gray-600 text-sm">
                    Overall Performance: {getScoreLevel()}
                </p>
            </div>

            <div className={`w-full p-4 rounded-lg ${getQualityBg()}`}>
                <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-gray-700">Questions Answered:</span>
                    <span className="font-bold text-gray-900">{totalQuestions}/{totalQuestions}</span>
                </div>
            </div>
        </div>
    );
}
