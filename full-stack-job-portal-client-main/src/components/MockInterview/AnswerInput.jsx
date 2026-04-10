import React from "react";
import { FiInfo } from "react-icons/fi";

export default function AnswerInput({ 
    value, 
    onChange, 
    placeholder = "Type your answer here...",
    characterCount = 0,
    minCharacters = 50
}) {
    const hasMinChars = characterCount >= minCharacters;

    return (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
                Your Answer
            </label>
            
            <textarea
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            
            <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm">
                    <FiInfo className="text-gray-400" />
                    <span className="text-gray-600">
                        Minimum {minCharacters} characters recommended
                    </span>
                </div>
                
                <div className={`text-sm font-semibold ${hasMinChars ? "text-green-600" : "text-gray-500"}`}>
                    {characterCount} characters
                </div>
            </div>

            {!hasMinChars && characterCount > 0 && (
                <p className="mt-2 text-xs text-yellow-600">
                    Please write at least {minCharacters - characterCount} more characters for a better answer.
                </p>
            )}
        </div>
    );
}
