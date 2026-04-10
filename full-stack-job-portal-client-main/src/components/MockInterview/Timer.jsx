import React, { useState, useEffect } from "react";
import { FiClock, FiAward } from "react-icons/fi";

export default function Timer({ duration, onTimeUp }) {
    const [timeLeft, setTimeLeft] = useState(duration);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onTimeUp?.();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [duration, onTimeUp]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const percentage = (timeLeft / duration) * 100;

    return (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <FiClock className="text-blue-500 text-xl" />
                    <span className="text-sm font-semibold text-gray-700">Time Remaining</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                    {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                </div>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
}
