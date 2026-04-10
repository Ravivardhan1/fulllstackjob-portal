const InterviewQuestion = require("../Model/InterviewQuestionModel");
const InterviewSession = require("../Model/InterviewSessionModel");
const UserAnswer = require("../Model/UserAnswerModel");
const InterviewProgress = require("../Model/InterviewProgressModel");
const JobInterviewTemplate = require("../Model/JobInterviewTemplateModel");
const ApplicationModel = require("../Model/ApplicationModel");
const { evaluateAnswersWithAI, getQualityFromScore } = require("../Utils/AIInterviewEvaluator");

// Built-in question bank — used when DB has no questions for a category
const QUESTION_BANK = {
    default: {
        Easy: [
            { question: "Tell me about yourself and your background.", tips: ["Keep it brief and professional", "Focus on relevant experience"], sampleAnswer: "I have a background in software development with experience building web applications." },
            { question: "What are your greatest strengths?", tips: ["Pick strengths relevant to the role", "Give a specific example"], sampleAnswer: "I am a strong problem-solver with excellent attention to detail, which allows me to identify and fix issues quickly." },
            { question: "Why do you want this job?", tips: ["Research the company beforehand", "Align your goals with the role"], sampleAnswer: "I am excited by the opportunity to contribute my skills in a dynamic environment and grow within the organization." },
            { question: "Where do you see yourself in 5 years?", tips: ["Show ambition without being unrealistic", "Tie it to the company's growth"], sampleAnswer: "I see myself in a senior leadership position, having made meaningful contributions to the team and organization." },
            { question: "Why are you leaving your current job?", tips: ["Stay positive", "Focus on growth rather than negativity"], sampleAnswer: "I am looking for new challenges and opportunities to expand my skill set in a more dynamic environment." }
        ],
        Medium: [
            { question: "Describe a time you faced a major challenge at work and how you overcame it.", tips: ["Use the STAR method", "Be specific about your actions"], sampleAnswer: "In my previous role, we had a critical system failure before a product launch. I coordinated with the team to identify the root cause and implemented a fix within 4 hours, allowing us to launch on time." },
            { question: "How do you handle conflicts with teammates?", tips: ["Show empathy and communication skills", "Give a real example"], sampleAnswer: "I address conflicts directly but diplomatically — I schedule a private conversation, listen to the other person's perspective, and work together to find a mutually agreeable solution." },
            { question: "Describe your leadership style.", tips: ["Match the style to the company culture", "Give examples"], sampleAnswer: "I lead by example and prefer a collaborative style where everyone's opinion is valued. I delegate based on team members' strengths while providing clear direction and support." },
            { question: "How do you prioritize tasks when everything seems urgent?", tips: ["Mention any systems or frameworks you use", "Show structured thinking"], sampleAnswer: "I use a priority matrix, categorizing tasks by urgency and importance. I communicate transparently with stakeholders when timelines need to shift." }
        ],
        Hard: [
            { question: "Tell me about a time you failed. What did you learn?", tips: ["Be honest but constructive", "Focus on the lessons learned"], sampleAnswer: "I once underestimated a project's complexity and missed a deadline. I took responsibility, communicated proactively with stakeholders, and implemented better estimation processes going forward." },
            { question: "How would you handle a situation where your manager is wrong?", tips: ["Show assertiveness with respect", "Frame it diplomatically"], sampleAnswer: "I would respectfully request a private meeting, present the facts and my concerns clearly, and offer an alternative solution. Ultimately, I respect the final decision while ensuring my view is heard." },
            { question: "Describe a time when you had to make a decision with incomplete information.", tips: ["Show decisive thinking", "Explain your risk assessment process"], sampleAnswer: "During a product crisis, I had to choose between two solutions with limited data. I gathered as much information as possible, consulted key team members, made the best decision I could, and monitored the outcome closely." }
        ]
    },
    JavaScript: {
        Easy: [
            { question: "What is the difference between var, let, and const in JavaScript?", tips: ["Mention scope differences", "Talk about hoisting"], sampleAnswer: "var is function-scoped and hoisted. let and const are block-scoped. const cannot be reassigned, while let can. Prefer let/const over var for cleaner, more predictable code." },
            { question: "What is a closure in JavaScript?", tips: ["Give a code example", "Explain scope chain"], sampleAnswer: "A closure is a function that has access to variables from its outer scope, even after that outer function has returned. This enables patterns like data privacy and function factories." },
            { question: "Explain event bubbling and event capturing.", tips: ["Mention stopPropagation", "Give a DOM hierarchy example"], sampleAnswer: "Event bubbling means an event starts at the target element and bubbles up to the root. Event capturing is the reverse. You can control this with addEventListener's third argument and stopPropagation()." },
            { question: "What is the difference between == and === in JavaScript?", tips: ["Mention type coercion", "Always recommend ==="], sampleAnswer: "== performs type coercion before comparison, while === checks both value and type without coercion. Best practice is to always use === to avoid unexpected type conversion bugs." },
            { question: "What is the this keyword in JavaScript?", tips: ["Mention arrow functions behavior", "Explain binding"], sampleAnswer: "this refers to the object that is executing the current function. In regular functions, this depends on how the function is called. In arrow functions, this is lexically inherited from the surrounding scope." }
        ],
        Medium: [
            { question: "Explain the event loop and how asynchronous JavaScript works.", tips: ["Mention call stack, task queue, microtask queue", "Explain Promises vs callbacks"], sampleAnswer: "JavaScript is single-threaded. The event loop continuously checks the call stack; when empty, it processes tasks from the task queue. Promises use the microtask queue which has higher priority than the task queue." },
            { question: "What are Promises and how do they differ from callbacks?", tips: ["Mention chaining", "Talk about error handling"], sampleAnswer: "Promises represent eventual completion or failure of an async operation. Unlike callbacks, they allow chaining with .then() and .catch(), making asynchronous code more readable and avoiding 'callback hell'." },
            { question: "What is prototype-based inheritance in JavaScript?", tips: ["Explain prototype chain", "Compare with class-based inheritance"], sampleAnswer: "JavaScript objects have an internal [[Prototype]] link to another object. Property lookups traverse this chain. ES6 classes are syntactic sugar over this prototype-based system." },
            { question: "Explain async/await and how it improves over raw Promises.", tips: ["Show a code example", "Mention error handling with try/catch"], sampleAnswer: "async/await is syntactic sugar over Promises, making async code look synchronous. It improves readability and allows using try/catch for error handling instead of .catch() chains." }
        ],
        Hard: [
            { question: "Explain memory management and garbage collection in JavaScript.", tips: ["Talk about reference counting", "Mention circular references"], sampleAnswer: "JavaScript uses automatic garbage collection with a mark-and-sweep algorithm. Objects not reachable from the root are collected. Common memory leak patterns include uncleared intervals, detached DOM nodes, and circular closures." },
            { question: "What are WeakMap and WeakSet and when would you use them?", tips: ["Emphasize weak references", "Use case: caches, metadata"], sampleAnswer: "WeakMap and WeakSet hold weak references to objects, meaning their entries can be garbage collected when all other references are gone. They're useful for caches and storing metadata without preventing GC." },
            { question: "Explain the difference between microtasks and macrotasks in the event loop.", tips: ["Promise callbacks are microtasks", "setTimeout is a macrotask"], sampleAnswer: "Microtasks (Promise callbacks, queueMicrotask) are processed immediately after the current task before the browser renders. Macrotasks (setTimeout, setInterval, I/O) are scheduled for future event loop iterations." }
        ]
    },
    React: {
        Easy: [
            { question: "What is the virtual DOM and how does React use it?", tips: ["Explain diffing algorithm", "Compare with real DOM updates"], sampleAnswer: "The virtual DOM is an in-memory representation of the real DOM. React diffs the virtual DOM trees on state changes and only updates the real DOM with the minimal necessary changes, improving performance." },
            { question: "What is the difference between state and props in React?", tips: ["State is internal, props are external", "Mention immutability of props"], sampleAnswer: "Props are read-only inputs passed from parent to child components. State is internal, mutable data managed within a component. State changes trigger re-renders." },
            { question: "What are React hooks? Name the most common ones.", tips: ["Mention useState, useEffect, useContext", "Explain rules of hooks"], sampleAnswer: "Hooks are functions that let you use React features in functional components. The most common are useState (local state), useEffect (side effects), useContext (context API), useMemo, and useCallback." },
            { question: "What is JSX and why is it used in React?", tips: ["Mention it's syntactic sugar", "Explain transpilation"], sampleAnswer: "JSX is JavaScript XML — a syntax extension that lets you write HTML-like code in JavaScript. Babel transpiles it to React.createElement() calls. It makes component templates more readable and intuitive." }
        ],
        Medium: [
            { question: "Explain the React component lifecycle (functional and class).", tips: ["Focus on hooks in functional components", "Map lifecycle methods to hooks"], sampleAnswer: "In class components, lifecycle includes mounting (constructor, render, componentDidMount), updating (shouldComponentUpdate, componentDidUpdate), and unmounting (componentWillUnmount). In functional components, useEffect covers all these phases." },
            { question: "What is the Context API and when would you use it over Redux?", tips: ["Mention prop-drilling problems", "When Redux is overkill"], sampleAnswer: "Context API provides a way to share data across the component tree without prop drilling. Use it for simple global state like themes or auth. For complex state management with many actions, Redux or Zustand is preferable." },
            { question: "Explain useMemo and useCallback. When would you use each?", tips: ["Both are optimizations", "Don't overuse them"], sampleAnswer: "useMemo memoizes the result of a computation; useCallback memoizes a function reference. Use them to prevent unnecessary re-renders in child components or expensive recalculations, but only when you've identified a performance issue." }
        ],
        Hard: [
            { question: "Explain React Server Components and how they differ from Client Components.", tips: ["Mention no JS bundle for server components", "Use cases for each"], sampleAnswer: "React Server Components run on the server and don't ship JavaScript to the client, reducing bundle size. Client Components are interactive and run in the browser. You opt into client rendering with 'use client' directive." },
            { question: "How would you optimize a React application that has performance issues?", tips: ["Mention profiler, memoization, code splitting", "Lazy loading"], sampleAnswer: "I'd start by profiling with React DevTools to identify bottlenecks. Common fixes include React.memo/useMemo/useCallback for memoization, code splitting with React.lazy, virtualization for long lists, and optimizing re-renders." }
        ]
    },
    "Node.js": {
        Easy: [
            { question: "What is Node.js and what is it mainly used for?", tips: ["Mention non-blocking I/O", "Use cases like APIs and real-time apps"], sampleAnswer: "Node.js is a JavaScript runtime built on Chrome's V8 engine. It uses non-blocking, event-driven I/O, making it ideal for scalable network applications, REST APIs, and real-time apps like chats." },
            { question: "What is the difference between synchronous and asynchronous code in Node.js?", tips: ["Mention the event loop", "Give a file reading example"], sampleAnswer: "Synchronous code blocks the event loop — nothing else can run until it completes. Asynchronous code (callbacks, Promises, async/await) allows Node to handle other requests while waiting for I/O operations." },
            { question: "What is npm and what is it used for?", tips: ["Mention package.json", "Talk about scripts and dependencies"], sampleAnswer: "npm is Node Package Manager. It's used to install, share, and manage JavaScript packages and their dependencies. package.json defines the project's dependencies and scripts." }
        ],
        Medium: [
            { question: "Explain the Node.js event loop in detail.", tips: ["Mention phases: timers, I/O, idle, poll, check, close", "Compare with browser event loop"], sampleAnswer: "The Node.js event loop has multiple phases: timers (setTimeout/setInterval), I/O callbacks, idle/prepare, poll (retrieve new I/O events), check (setImmediate), and close callbacks. It processes these phases in order." },
            { question: "What are streams in Node.js and why are they useful?", tips: ["Mention 4 types of streams", "Use case: large file processing"], sampleAnswer: "Streams are objects for handling data flow piece by piece. The 4 types are Readable, Writable, Duplex (both), and Transform. They're useful for processing large files without loading everything into memory." },
            { question: "How does error handling work in async Node.js code?", tips: ["Try/catch with async/await", "Error-first callback pattern"], sampleAnswer: "In callbacks, the error-first pattern passes errors as the first argument. With Promises, use .catch(). With async/await, wrap code in try/catch blocks. Always handle promise rejections with process.on('unhandledRejection')." }
        ],
        Hard: [
            { question: "How would you scale a Node.js application to handle millions of requests?", tips: ["Mention clustering, load balancing, caching", "Horizontal vs vertical scaling"], sampleAnswer: "I'd use the cluster module or PM2 to use all CPU cores. Deploy behind a load balancer (Nginx). Implement caching (Redis) for frequent queries. Use a message queue for async jobs. Consider microservices for specific bottlenecks." }
        ]
    }
};

// Get questions for a given category and difficulty from the built-in bank
function getBuiltInQuestions(category, difficulty, count) {
    const categoryBank = QUESTION_BANK[category] || QUESTION_BANK.default;
    const difficultyQuestions = categoryBank[difficulty] || categoryBank.Easy || [];
    // Shuffle and take the requested count
    const shuffled = [...difficultyQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Start a new interview session
exports.startInterview = async (req, res, next) => {
    try {
        const { category, jobRole, difficulty, totalQuestions = 5 } = req.body;
        const userId = req.user._id;

        // First try to get questions from the database
        let dbQuestions = await InterviewQuestion.find({
            category,
            difficulty
        })
            .limit(totalQuestions)
            .select("_id question estimatedTime difficulty tips");

        let questions;
        let useBuiltIn = false;

        if (dbQuestions.length > 0) {
            questions = dbQuestions;
        } else {
            // Fall back to built-in question bank
            useBuiltIn = true;
            const builtInQs = getBuiltInQuestions(category, difficulty, totalQuestions);

            if (builtInQs.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: "No questions found for this category and difficulty level"
                });
            }

            // Save built-in questions to DB so they can be retrieved later by session
            const savedQs = [];
            for (const q of builtInQs) {
                const newQ = new InterviewQuestion({
                    category,
                    jobRole: jobRole || category,
                    difficulty,
                    question: q.question,
                    sampleAnswer: q.sampleAnswer,
                    tips: q.tips,
                    estimatedTime: 120
                });
                await newQ.save();
                savedQs.push(newQ);
            }
            questions = savedQs;
        }

        // Create new interview session
        const session = new InterviewSession({
            userId,
            category,
            jobRole: jobRole || category,
            difficulty,
            totalQuestions: questions.length,
            questions: questions.map((q) => q._id),
            status: "InProgress",
            startedAt: new Date()
        });

        await session.save();

        // Format questions for the response
        const formattedQuestions = questions.map((q) => ({
            _id: q._id,
            question: q.question,
            difficulty: q.difficulty,
            estimatedTime: q.estimatedTime || 120,
            tips: q.tips || []
        }));

        res.status(201).json({
            status: true,
            message: "Interview session started",
            result: {
                sessionId: session._id,
                questions: formattedQuestions,
                totalQuestions: formattedQuestions.length,
                duration: session.duration
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get questions for an interview
exports.getQuestions = async (req, res, next) => {
    try {
        const { sessionId } = req.params;

        const session = await InterviewSession.findById(sessionId).populate("questions");

        if (!session) {
            return res.status(404).json({
                status: false,
                message: "Interview session not found"
            });
        }

        const questions = session.questions.map((q) => ({
            _id: q._id,
            question: q.question,
            difficulty: q.difficulty,
            estimatedTime: q.estimatedTime,
            tips: q.tips
        }));

        res.status(200).json({
            status: true,
            message: "Questions retrieved",
            result: {
                sessionId: session._id,
                questions,
                totalQuestions: questions.length
            }
        });
    } catch (error) {
        next(error);
    }
};

// Submit answers for interview questions
exports.submitAnswers = async (req, res, next) => {
    try {
        const { sessionId, answers } = req.body;
        const userId = req.user._id;

        // Validate session exists
        const session = await InterviewSession.findById(sessionId);
        if (!session) {
            return res.status(404).json({
                status: false,
                message: "Interview session not found"
            });
        }

        const questionIds = answers.map((answer) => answer.questionId);
        const questions = await InterviewQuestion.find({ _id: { $in: questionIds } });
        const questionMap = new Map(questions.map((question) => [question._id.toString(), question]));

        const answerPayloads = answers
            .map((answer) => {
                const question = questionMap.get(String(answer.questionId));

                if (!question) {
                    return null;
                }

                return {
                    questionId: String(answer.questionId),
                    category: question.category,
                    jobRole: question.jobRole,
                    difficulty: question.difficulty,
                    question: question.question,
                    sampleAnswer: question.sampleAnswer,
                    keyPoints: question.keyPoints || [],
                    tips: question.tips || [],
                    userAnswer: answer.userAnswer,
                    timeSpent: answer.timeSpent || 120
                };
            })
            .filter(Boolean);

        const aiEvaluation = await evaluateAnswersWithAI(answerPayloads, {
            sessionId: String(sessionId),
            category: session.category,
            jobRole: session.jobRole,
            difficulty: session.difficulty
        });

        const evaluationMap = new Map(
            aiEvaluation.evaluations.map((item) => [String(item.questionId), item])
        );

        let totalScore = 0;
        const savedAnswers = [];

        for (const answer of answers) {
            const question = questionMap.get(String(answer.questionId));
            const evaluation = evaluationMap.get(String(answer.questionId));

            if (!question || !evaluation) {
                continue;
            }

            const userAnswer = new UserAnswer({
                sessionId,
                userId,
                questionId: answer.questionId,
                userAnswer: answer.userAnswer,
                timeSpent: answer.timeSpent || 120,
                answerQuality: evaluation.quality,
                score: evaluation.score,
                feedback: evaluation.feedback,
                strengths: evaluation.strengths || [],
                improvements: evaluation.improvements || [],
                suggestions: evaluation.suggestions || []
            });

            await userAnswer.save();
            savedAnswers.push(userAnswer);
            totalScore += evaluation.score;
        }

        // Calculate final score
        const finalScore = savedAnswers.length > 0 ? Math.round((totalScore / (savedAnswers.length * 20)) * 100) : 0;

        // Update session
        session.status = "Completed";
        session.completedAt = new Date();
        session.score = finalScore;
        session.answerQuality = getQualityFromScore(Math.round(finalScore / 5));
        session.evaluationProvider = aiEvaluation.provider;
        session.evaluationModel = aiEvaluation.model;

        await session.save();

        // Update user progress
        let progress = await InterviewProgress.findOne({ userId });

        if (!progress) {
            progress = new InterviewProgress({
                userId,
                totalInterviews: 1,
                totalQuestions: savedAnswers.length,
                overallAverageScore: finalScore
            });
        } else {
            progress.totalInterviews += 1;
            progress.totalQuestions += savedAnswers.length;
            progress.overallAverageScore =
                (progress.overallAverageScore * (progress.totalInterviews - 1) + finalScore) /
                progress.totalInterviews;
        }

        progress.lastAttempted = new Date();
        await progress.save();

        res.status(200).json({
            status: true,
            message: "Answers submitted successfully",
            result: {
                sessionId: session._id,
                finalScore,
                quality: session.answerQuality,
                evaluationProvider: aiEvaluation.provider,
                evaluationModel: aiEvaluation.model,
                answers: savedAnswers.map((a) => ({
                    questionId: a.questionId,
                    score: a.score,
                    quality: a.answerQuality,
                    feedback: a.feedback,
                    strengths: a.strengths,
                    improvements: a.improvements,
                    suggestions: a.suggestions
                }))
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get interview results
exports.getResults = async (req, res, next) => {
    try {
        const { sessionId } = req.params;

        const session = await InterviewSession.findById(sessionId)
            .populate("userId", "name email")
            .populate("questions");

        if (!session) {
            return res.status(404).json({
                status: false,
                message: "Interview session not found"
            });
        }

        const answers = await UserAnswer.find({ sessionId }).populate("questionId");

        const detailedResults = answers.map((answer) => ({
            question: answer.questionId.question,
            sampleAnswer: answer.questionId.sampleAnswer,
            userAnswer: answer.userAnswer,
            score: answer.score,
            quality: answer.answerQuality,
            feedback: answer.feedback,
            strengths: answer.strengths || [],
            improvements: answer.improvements || [],
            suggestions: answer.suggestions || [],
            timeSpent: answer.timeSpent,
            tips: answer.questionId.tips
        }));

        res.status(200).json({
            status: true,
            message: "Interview results retrieved",
            result: {
                sessionId: session._id,
                category: session.category,
                jobRole: session.jobRole,
                difficulty: session.difficulty,
                finalScore: session.score,
                quality: session.answerQuality,
                evaluationProvider: session.evaluationProvider || "unknown",
                evaluationModel: session.evaluationModel || null,
                completedAt: session.completedAt,
                totalQuestions: session.totalQuestions,
                answers: detailedResults
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get user's interview progress
exports.getUserProgress = async (req, res, next) => {
    try {
        const userId = req.user._id;

        let progress = await InterviewProgress.findOne({ userId });

        if (!progress) {
            progress = new InterviewProgress({ userId });
            await progress.save();
        }

        const recentSessions = await InterviewSession.find({ userId, status: "Completed" })
            .sort({ completedAt: -1 })
            .limit(5);

        res.status(200).json({
            status: true,
            message: "User progress retrieved",
            result: {
                totalInterviews: progress.totalInterviews,
                overallAverageScore: progress.overallAverageScore,
                totalQuestions: progress.totalQuestions,
                lastAttempted: progress.lastAttempted,
                recentSessions: recentSessions.map((s) => ({
                    sessionId: s._id,
                    category: s.category,
                    jobRole: s.jobRole,
                    score: s.score,
                    completedAt: s.completedAt
                }))
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get all interview categories
exports.getCategories = async (req, res, next) => {
    try {
        const categories = [
            { name: "JavaScript", questionsCount: 12, roles: ["Frontend Developer", "Full-Stack Developer"] },
            { name: "React", questionsCount: 11, roles: ["Frontend Developer", "React Developer"] },
            { name: "Node.js", questionsCount: 9, roles: ["Backend Developer", "Full-Stack Developer"] },
            { name: "TypeScript", questionsCount: 8, roles: ["Frontend Developer", "Full-Stack Developer"] },
            { name: "Python", questionsCount: 8, roles: ["Data Scientist", "Backend Developer"] },
            { name: "SQL", questionsCount: 7, roles: ["Database Admin", "Backend Developer"] },
            { name: "Data Structures", questionsCount: 6, roles: ["Software Engineer", "Algorithm Engineer"] },
            { name: "Algorithms", questionsCount: 6, roles: ["Software Engineer", "Algorithm Engineer"] },
            { name: "HR Interview", questionsCount: 12, roles: ["All Roles"] },
            { name: "Management", questionsCount: 8, roles: ["Project Manager", "Team Lead"] }
        ];

        res.status(200).json({
            status: true,
            message: "Categories retrieved",
            result: categories
        });
    } catch (error) {
        next(error);
    }
};

// Get questions by category (for practice)
exports.getQuestionsByCategory = async (req, res, next) => {
    try {
        const { category, difficulty } = req.query;

        let filter = { category };
        if (difficulty) {
            filter.difficulty = difficulty;
        }

        const questions = await InterviewQuestion.find(filter).select(
            "question difficulty jobRole category"
        );

        res.status(200).json({
            status: true,
            message: "Questions retrieved",
            result: {
                category,
                questionsCount: questions.length,
                questions
            }
        });
    } catch (error) {
        next(error);
    }
};

// Add new interview question (Admin only)
exports.addQuestion = async (req, res, next) => {
    try {
        const { category, jobRole, difficulty, question, sampleAnswer, tips, keyPoints } = req.body;

        const newQuestion = new InterviewQuestion({
            category,
            jobRole,
            difficulty,
            question,
            sampleAnswer,
            tips: tips || [],
            keyPoints: keyPoints || []
        });

        await newQuestion.save();

        res.status(201).json({
            status: true,
            message: "Question added successfully",
            result: newQuestion
        });
    } catch (error) {
        next(error);
    }
};

// Create or update JobInterviewTemplate
exports.createJobInterviewTemplate = async (req, res, next) => {
    try {
        const { jobId, questions } = req.body;
        const recruiterId = req.user._id;

        let template = await JobInterviewTemplate.findOne({ jobId });

        if (template) {
            // Check if user is the recruiter who owns the template
            if (template.recruiterId.toString() !== recruiterId.toString()) {
                return res.status(403).json({
                    status: false,
                    message: "You are not authorized to update this template"
                });
            }
            template.questions = questions;
            await template.save();
        } else {
            template = new JobInterviewTemplate({
                jobId,
                recruiterId,
                questions
            });
            await template.save();
        }

        res.status(200).json({
            status: true,
            message: "Interview template saved successfully",
            result: template
        });
    } catch (error) {
        next(error);
    }
};

// Get JobInterviewTemplate for a specific job
exports.getJobInterviewTemplate = async (req, res, next) => {
    try {
        const { jobId } = req.params;
        const template = await JobInterviewTemplate.findOne({ jobId });

        if (!template) {
            return res.status(404).json({
                status: false,
                message: "No custom template found for this job"
            });
        }

        res.status(200).json({
            status: true,
            message: "Template retrieved",
            result: template
        });
    } catch (error) {
        next(error);
    }
};

// Start a job-specific interview
exports.startJobInterview = async (req, res, next) => {
    try {
        const { jobId } = req.body;
        const userId = req.user._id;

        const template = await JobInterviewTemplate.findOne({ jobId });

        if (!template) {
            return res.status(404).json({
                status: false,
                message: "No custom template found for this job"
            });
        }

        // Save recruiter questions into InterviewQuestion if not already there, 
        // because PracticeInterview works with InterviewQuestion ObjectIds.
        const questionIds = [];
        for (const q of template.questions) {
            let existingQ = await InterviewQuestion.findOne({
                question: q.question,
                sampleAnswer: q.expectedAnswer,
                jobRole: jobId.toString() // Use jobId as jobRole to isolate them
            });

            if (!existingQ) {
                existingQ = new InterviewQuestion({
                    category: "Custom",
                    jobRole: jobId.toString(),
                    difficulty: q.difficulty,
                    question: q.question,
                    sampleAnswer: q.expectedAnswer,
                    tips: q.tips,
                    estimatedTime: 120
                });
                await existingQ.save();
            }
            questionIds.push(existingQ._id);
        }

        const session = new InterviewSession({
            userId,
            jobId,
            recruiterId: template.recruiterId,
            category: "Custom Job Interview",
            jobRole: "Applicant",
            difficulty: "Medium",
            totalQuestions: questionIds.length,
            questions: questionIds,
            status: "InProgress",
            startedAt: new Date()
        });

        await session.save();

        const formattedQuestions = [];
        for (let i = 0; i < template.questions.length; i++) {
            formattedQuestions.push({
                _id: questionIds[i],
                question: template.questions[i].question,
                difficulty: template.questions[i].difficulty,
                estimatedTime: 120,
                tips: template.questions[i].tips || []
            });
        }

        res.status(201).json({
            status: true,
            message: "Job interview session started",
            result: {
                sessionId: session._id,
                questions: formattedQuestions,
                totalQuestions: formattedQuestions.length,
                duration: session.duration
            }
        });
    } catch (error) {
        next(error);
    }
};

// Recruiter gets results of all candidates for a specific job
exports.getRecruiterCandidateResults = async (req, res, next) => {
    try {
        const { jobId } = req.params;
        const recruiterId = req.user._id;

        const sessions = await InterviewSession.find({
            jobId,
            recruiterId,
            status: "Completed"
        }).populate("userId", "username email resume");

        const sessionIds = sessions.map((session) => session._id);
        const answers = await UserAnswer.find({ sessionId: { $in: sessionIds } }).populate(
            "questionId",
            "category difficulty"
        );

        const results = [];
        for (const s of sessions) {
            results.push({
                sessionId: s._id,
                candidateId: s.userId?._id,
                candidateName: s.userId?.username,
                candidateEmail: s.userId?.email,
                candidateResume: s.userId?.resume,
                score: s.score,
                quality: s.answerQuality,
                completedAt: s.completedAt
            });
        }

        results.sort((a, b) => b.score - a.score);

        const totalCandidates = results.length;
        const averageScore =
            totalCandidates > 0
                ? Math.round(
                      results.reduce((sum, candidate) => sum + (candidate.score || 0), 0) /
                          totalCandidates
                  )
                : 0;

        const qualitySummary = results.reduce(
            (acc, candidate) => {
                const key = candidate.quality || "Unrated";
                acc[key] = (acc[key] || 0) + 1;
                return acc;
            },
            { Excellent: 0, Good: 0, Average: 0, Poor: 0, Unrated: 0 }
        );

        const categorySummaryMap = {};
        for (const answer of answers) {
            const category = answer.questionId?.category || "General";
            const difficulty = answer.questionId?.difficulty || "Unknown";

            if (!categorySummaryMap[category]) {
                categorySummaryMap[category] = {
                    category,
                    attempts: 0,
                    totalScore: 0,
                    difficulties: {},
                };
            }

            categorySummaryMap[category].attempts += 1;
            categorySummaryMap[category].totalScore += answer.score || 0;
            categorySummaryMap[category].difficulties[difficulty] =
                (categorySummaryMap[category].difficulties[difficulty] || 0) + 1;
        }

        const categorySummary = Object.values(categorySummaryMap)
            .map((item) => ({
                category: item.category,
                attempts: item.attempts,
                averageQuestionScore:
                    item.attempts > 0
                        ? Number((item.totalScore / item.attempts).toFixed(1))
                        : 0,
                difficulties: item.difficulties,
            }))
            .sort((a, b) => b.attempts - a.attempts);

        const applications = await ApplicationModel.find({
            jobId,
            recruiterId,
        }).populate("applicantId", "username email resume");

        const applicantIds = applications
            .map((application) => application.applicantId?._id)
            .filter(Boolean);

        let normalMockInterview = {
            totalApplicantsWithMockTests: 0,
            subjectSummary: [],
        };

        if (applicantIds.length > 0) {
            const normalSessions = await InterviewSession.find({
                userId: { $in: applicantIds },
                status: "Completed",
                $or: [{ jobId: { $exists: false } }, { jobId: null }],
            }).populate("userId", "username email resume");

            const subjectMap = {};

            for (const session of normalSessions) {
                const subject = session.category || "General";
                const candidateId = session.userId?._id?.toString();

                if (!candidateId) {
                    continue;
                }

                if (!subjectMap[subject]) {
                    subjectMap[subject] = {
                        subject,
                        attempts: 0,
                        totalScore: 0,
                        bestScore: 0,
                        candidates: {},
                    };
                }

                subjectMap[subject].attempts += 1;
                subjectMap[subject].totalScore += session.score || 0;
                subjectMap[subject].bestScore = Math.max(
                    subjectMap[subject].bestScore,
                    session.score || 0
                );

                const existingCandidate = subjectMap[subject].candidates[candidateId];
                if (
                    !existingCandidate ||
                    (session.score || 0) > existingCandidate.bestScore
                ) {
                    subjectMap[subject].candidates[candidateId] = {
                        candidateId,
                        candidateName: session.userId?.username || "Unknown Candidate",
                        candidateEmail: session.userId?.email || "",
                        candidateResume: session.userId?.resume || "",
                        bestScore: session.score || 0,
                        quality: session.answerQuality || "Unrated",
                        completedAt: session.completedAt,
                    };
                }
            }

            const subjectSummary = Object.values(subjectMap)
                .map((item) => {
                    const topCandidates = Object.values(item.candidates)
                        .sort((a, b) => {
                            if (b.bestScore !== a.bestScore) {
                                return b.bestScore - a.bestScore;
                            }
                            return new Date(b.completedAt) - new Date(a.completedAt);
                        })
                        .slice(0, 5);

                    return {
                        subject: item.subject,
                        attempts: item.attempts,
                        candidateCount: Object.keys(item.candidates).length,
                        averageScore:
                            item.attempts > 0
                                ? Math.round(item.totalScore / item.attempts)
                                : 0,
                        bestScore: item.bestScore,
                        topCandidates,
                    };
                })
                .sort((a, b) => {
                    if (b.candidateCount !== a.candidateCount) {
                        return b.candidateCount - a.candidateCount;
                    }
                    return b.averageScore - a.averageScore;
                });

            normalMockInterview = {
                totalApplicantsWithMockTests: new Set(
                    normalSessions.map((session) => session.userId?._id?.toString()).filter(Boolean)
                ).size,
                subjectSummary,
            };
        }

        res.status(200).json({
            status: true,
            message: "Candidate results retrieved",
            result: {
                summary: {
                    totalCandidates,
                    averageScore,
                    highestScore: results[0]?.score || 0,
                    shortlistedCandidates: results.filter((candidate) => (candidate.score || 0) >= 60)
                        .length,
                    qualitySummary,
                    categorySummary,
                },
                normalMockInterview,
                candidates: results,
            }
        });
    } catch (error) {
        next(error);
    }
};
