const mongoose = require("mongoose");

const interviewQuestionSchema = new mongoose.Schema(
    {
        category: {
            type: String,
            required: true
        },
        jobRole: {
            type: String,
            required: true
        },
        difficulty: {
            type: String,
            required: true,
            enum: ["Easy", "Medium", "Hard"]
        },
        question: {
            type: String,
            required: true
        },
        sampleAnswer: {
            type: String,
            required: true
        },
        tips: [
            {
                type: String,
                required: true
            }
        ],
        keyPoints: [
            {
                type: String
            }
        ],
        estimatedTime: {
            type: Number,
            default: 120 // seconds
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("InterviewQuestion", interviewQuestionSchema);
