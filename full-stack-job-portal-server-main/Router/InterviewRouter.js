const express = require("express");
const { authenticateUser } = require("../Middleware/UserAuthenticationMiddleware");
const { inputValidationMiddleware } = require("../Validation/ValidationMiddleware");
const {
    interviewSessionValidationRules,
    userAnswerValidationRules,
    interviewQuestionValidationRules
} = require("../Validation/InterviewDataRules");
const {
    startInterview,
    getQuestions,
    submitAnswers,
    getResults,
    getUserProgress,
    getCategories,
    getQuestionsByCategory,
    addQuestion,
    createJobInterviewTemplate,
    getJobInterviewTemplate,
    startJobInterview,
    getRecruiterCandidateResults
} = require("../Controller/InterviewController");

const router = express.Router();

// Public routes - Get categories and questions
router.get("/api/v1/interviews/categories", getCategories);

router.get("/api/v1/interviews/questions", getQuestionsByCategory);

// Protected routes - User must be authenticated
router.post(
    "/api/v1/interviews/start",
    authenticateUser,
    interviewSessionValidationRules(),
    inputValidationMiddleware,
    startInterview
);

router.get("/api/v1/interviews/:sessionId/questions", authenticateUser, getQuestions);

router.post(
    "/api/v1/interviews/submit",
    authenticateUser,
    userAnswerValidationRules(),
    inputValidationMiddleware,
    submitAnswers
);

router.get("/api/v1/interviews/:sessionId/results", authenticateUser, getResults);

router.get("/api/v1/interviews/progress", authenticateUser, getUserProgress);

// Admin routes - Add new questions
router.post(
    "/api/v1/interviews/questions/add",
    authenticateUser,
    interviewQuestionValidationRules(),
    inputValidationMiddleware,
    addQuestion
);

// Recruiter routes - Custom Interview Templates
router.post(
    "/api/v1/interviews/job-template",
    authenticateUser,
    createJobInterviewTemplate
);

router.get(
    "/api/v1/interviews/job-template/:jobId",
    authenticateUser,
    getJobInterviewTemplate
);

router.post(
    "/api/v1/interviews/start-job",
    authenticateUser,
    startJobInterview
);

router.get(
    "/api/v1/interviews/recruiter-results/:jobId",
    authenticateUser,
    getRecruiterCandidateResults
);

module.exports = router;
