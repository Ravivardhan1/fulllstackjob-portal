import React from "react";
import { FiAlertCircle } from "react-icons/fi";

export default function QuestionCard({ 
    questionNumber, 
    totalQuestions, 
    question, 
    difficulty 
}) {
    const difficultyColor = 
        difficulty === "Easy" ? "text-green-600 bg-green-50" :
        difficulty === "Medium" ? "text-yellow-600 bg-yellow-50" :
        "text-red-600 bg-red-50";

    return (
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-sm text-gray-500 mb-2">
                        Question {questionNumber} of {totalQuestions}
                    </p>
                    <h3 className="text-xl font-bold text-gray-900 leading-relaxed">
                        {question}
                    </h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${difficultyColor}`}>
                    {difficulty}
                </span>
            </div>
            
            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded text-sm text-blue-700">
                <FiAlertCircle className="flex-shrink-0 mt-0.5" />
                <p>Take your time to provide a detailed and thoughtful answer.</p>
            </div>
        </div>
    );
}
