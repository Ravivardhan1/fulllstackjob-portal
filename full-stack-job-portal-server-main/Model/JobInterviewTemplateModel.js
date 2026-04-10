const mongoose = require("mongoose");

const jobInterviewTemplateSchema = new mongoose.Schema(
    {
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
            unique: true
        },
        recruiterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        questions: [
            {
                question: {
                    type: String,
                    required: true
                },
                expectedAnswer: {
                    type: String,
                    required: true
                },
                difficulty: {
                    type: String,
                    enum: ["Easy", "Medium", "Hard"],
                    default: "Medium"
                },
                tips: [
                    {
                        type: String
                    }
                ]
            }
        ],
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("JobInterviewTemplate", jobInterviewTemplateSchema);
