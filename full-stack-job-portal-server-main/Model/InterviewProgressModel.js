const mongoose = require("mongoose");

const interviewProgressSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },
        totalInterviews: {
            type: Number,
            default: 0
        },
        totalQuestions: {
            type: Number,
            default: 0
        },
        totalCorrectAnswers: {
            type: Number,
            default: 0
        },
        categoryProgress: [
            {
                category: {
                    type: String,
                    enum: ["IT", "HR", "Sales", "Finance", "Marketing", "Management", "Design"]
                },
                attempts: {
                    type: Number,
                    default: 0
                },
                bestScore: {
                    type: Number,
                    default: 0
                },
                averageScore: {
                    type: Number,
                    default: 0
                }
            }
        ],
        overallAverageScore: {
            type: Number,
            default: 0
        },
        strengths: [
            {
                type: String
            }
        ],
        areasToImprove: [
            {
                type: String
            }
        ],
        lastAttempted: {
            type: Date
        },
        firstAttempted: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("InterviewProgress", interviewProgressSchema);
