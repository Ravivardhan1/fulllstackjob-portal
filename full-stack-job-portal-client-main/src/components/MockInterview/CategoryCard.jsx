import React from "react";
import { FiArrowRight } from "react-icons/fi";

export default function CategoryCard({ 
    category, 
    questionsCount, 
    onClick 
}) {
    const categoryIcons = {
        IT: "💻",
        HR: "👥",
        Sales: "💼",
        Finance: "💰",
        Marketing: "📱",
        Management: "📊",
        Design: "🎨"
    };

    const categoryColors = {
        IT: "from-blue-500 to-blue-600",
        HR: "from-purple-500 to-purple-600",
        Sales: "from-orange-500 to-orange-600",
        Finance: "from-green-500 to-green-600",
        Marketing: "from-pink-500 to-pink-600",
        Management: "from-indigo-500 to-indigo-600",
        Design: "from-red-500 to-red-600"
    };

    return (
        <div
            onClick={onClick}
            className={`bg-gradient-to-br ${categoryColors[category] || 'from-gray-500 to-gray-600'} 
            rounded-lg p-6 text-white cursor-pointer transform transition hover:scale-105 hover:shadow-lg`}
        >
            <div className="flex justify-between items-start mb-4">
                <span className="text-4xl">{categoryIcons[category]}</span>
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-semibold">
                    {questionsCount} Q
                </span>
            </div>
            
            <h3 className="text-2xl font-bold mb-2">{category}</h3>
            
            <p className="text-sm text-white text-opacity-90 mb-4">
                Practice interview questions for {category} roles
            </p>
            
            <div className="flex items-center gap-2 text-sm font-semibold hover:gap-3 transition">
                Start Practice
                <FiArrowRight />
            </div>
        </div>
    );
}
