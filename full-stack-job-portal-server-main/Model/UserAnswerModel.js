const mongoose = require("mongoose");

const userAnswerSchema = new mongoose.Schema(
    {
        sessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "InterviewSession",
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "InterviewQuestion",
            required: true
        },
        userAnswer: {
            type: String,
            required: true
        },
        answerQuality: {
            type: String,
            enum: ["Excellent", "Good", "Average", "Poor"],
            default: "Average"
        },
        score: {
            type: Number,
            min: 0,
            max: 20,
            default: 10
        },
        timeSpent: {
            type: Number, // seconds
            required: true
        },
        feedback: {
            type: String
        },
        strengths: [
            {
                type: String
            }
        ],
        improvements: [
            {
                type: String
            }
        ],
        suggestions: [
            {
                type: String
            }
        ],
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("UserAnswer", userAnswerSchema);
