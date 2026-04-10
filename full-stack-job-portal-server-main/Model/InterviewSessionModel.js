const mongoose = require("mongoose");

const interviewSessionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job"
        },
        recruiterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
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
        totalQuestions: {
            type: Number,
            required: true,
            default: 5
        },
        duration: {
            type: Number,
            default: 600 // seconds (10 minutes)
        },
        status: {
            type: String,
            required: true,
            enum: ["InProgress", "Completed", "Abandoned"],
            default: "InProgress"
        },
        startedAt: {
            type: Date,
            default: Date.now
        },
        completedAt: {
            type: Date
        },
        score: {
            type: Number,
            min: 0,
            max: 100
        },
        answerQuality: {
            type: String,
            enum: ["Excellent", "Good", "Average", "Poor"]
        },
        evaluationProvider: {
            type: String
        },
        evaluationModel: {
            type: String
        },
        questions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "InterviewQuestion"
            }
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model("InterviewSession", interviewSessionSchema);
