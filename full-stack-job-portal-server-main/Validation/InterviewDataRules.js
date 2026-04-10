const { body, validationResult } = require("express-validator");

const interviewSessionValidationRules = () => {
    return [
        body("category")
            .notEmpty()
            .withMessage("Category is required")
            .isString()
            .withMessage("Category must be a string"),
        body("jobRole")
            .notEmpty()
            .withMessage("Job role is required")
            .isLength({ min: 3 })
            .withMessage("Job role must be at least 3 characters"),
        body("difficulty")
            .notEmpty()
            .withMessage("Difficulty is required")
            .isIn(["Easy", "Medium", "Hard"])
            .withMessage("Invalid difficulty level"),
        body("totalQuestions")
            .optional()
            .isInt({ min: 1, max: 20 })
            .withMessage("Questions must be between 1 and 20")
    ];
};

const userAnswerValidationRules = () => {
    return [
        body("sessionId")
            .notEmpty()
            .withMessage("Session ID is required")
            .isMongoId()
            .withMessage("Invalid session ID"),
        body("answers")
            .notEmpty()
            .withMessage("Answers are required")
            .isArray()
            .withMessage("Answers must be an array")
    ];
};

const interviewQuestionValidationRules = () => {
    return [
        body("category")
            .notEmpty()
            .withMessage("Category is required")
            .isString()
            .withMessage("Category must be a string"),
        body("jobRole")
            .notEmpty()
            .withMessage("Job role is required"),
        body("difficulty")
            .notEmpty()
            .withMessage("Difficulty is required")
            .isIn(["Easy", "Medium", "Hard"])
            .withMessage("Invalid difficulty"),
        body("question")
            .notEmpty()
            .withMessage("Question is required")
            .isLength({ min: 10 })
            .withMessage("Question must be at least 10 characters"),
        body("sampleAnswer")
            .notEmpty()
            .withMessage("Sample answer is required")
            .isLength({ min: 20 })
            .withMessage("Sample answer must be at least 20 characters"),
        body("tips")
            .optional()
            .isArray()
            .withMessage("Tips must be an array")
    ];
};

module.exports = {
    interviewSessionValidationRules,
    userAnswerValidationRules,
    interviewQuestionValidationRules
};
