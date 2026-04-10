// Sample interview questions for seeding the database
// Run this file to populate the database with questions

const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const InterviewQuestion = require("../Model/InterviewQuestionModel");
const DBConnectionHandler = require("../Utils/DBconnect");

const sampleQuestions = [
    // IT Questions
    {
        category: "IT",
        jobRole: "Software Engineer",
        difficulty: "Easy",
        question: "What is the difference between let, const, and var in JavaScript?",
        sampleAnswer:
            "var is function-scoped and can be redeclared. let is block-scoped and cannot be redeclared in the same scope. const is block-scoped and must be initialized, and its value cannot be reassigned (though properties can be modified).",
        tips: ["Explain scope clearly", "Give examples", "Mention hoisting"],
        keyPoints: ["Scope", "Reassignment", "Hoisting"]
    },
    {
        category: "IT",
        jobRole: "Software Engineer",
        difficulty: "Medium",
        question: "What is React and why is it used?",
        sampleAnswer:
            "React is a JavaScript library for building user interfaces using components. It's used for creating fast, interactive web applications with reusable components, efficient DOM updates, and unidirectional data flow.",
        tips: ["Mention component-based architecture", "Discuss virtual DOM", "Talk about reusability"],
        keyPoints: ["Components", "Virtual DOM", "Efficiency", "Reusability"]
    },
    {
        category: "IT",
        jobRole: "Software Engineer",
        difficulty: "Hard",
        question: "How does the event loop work in JavaScript?",
        sampleAnswer:
            "The event loop is a mechanism that allows JavaScript to perform non-blocking operations. It consists of the call stack, web APIs, callback queue, and microtask queue. The loop checks if the call stack is empty, then processes microtasks, then one macrotask, and repeats.",
        tips: ["Explain call stack", "Mention async operations", "Distinguish macrotasks from microtasks"],
        keyPoints: ["Call Stack", "Event Loop", "Callbacks", "Promises", "Async/Await"]
    },
    {
        category: "IT",
        jobRole: "Web Developer",
        difficulty: "Easy",
        question: "What is the purpose of CSS and what are its main concepts?",
        sampleAnswer:
            "CSS is used to style HTML elements. Main concepts include selectors (targeting elements), properties (what to change), values (how much), and the cascade (which rules apply). CSS handles layout, colors, fonts, and responsive design.",
        tips: ["Mention selectors", "Talk about cascade", "Discuss inheritance"],
        keyPoints: ["Selectors", "Properties", "Cascade", "Inheritance", "Box Model"]
    },
    {
        category: "IT",
        jobRole: "Data Scientist",
        difficulty: "Medium",
        question: "What is the difference between supervised and unsupervised learning?",
        sampleAnswer:
            "Supervised learning uses labeled data (input-output pairs) to train models and predict outcomes. Unsupervised learning works with unlabeled data to find hidden patterns. Examples: supervised - classification/regression, unsupervised - clustering/dimensionality reduction.",
        tips: ["Define both clearly", "Give relevant examples", "Discuss use cases"],
        keyPoints: ["Labeled Data", "Unlabeled Data", "Classification", "Clustering", "Regression"]
    },
    // HR Questions
    {
        category: "HR",
        jobRole: "HR Manager",
        difficulty: "Easy",
        question: "Tell us about yourself and your background.",
        sampleAnswer:
            "Provide a concise overview of your professional journey, highlighting relevant experience, skills, and achievements. Focus on what makes you suitable for the role. Keep it to 2-3 minutes and end with your interest in the position.",
        tips: ["Be concise", "Stay relevant", "Show enthusiasm"],
        keyPoints: ["Background", "Experience", "Skills", "Achievements", "Interest"]
    },
    {
        category: "HR",
        jobRole: "Recruiter",
        difficulty: "Medium",
        question: "What are your strengths and weaknesses?",
        sampleAnswer:
            "Discuss 2-3 genuine strengths relevant to the role. For weaknesses, choose something you've worked on improving, showing self-awareness and growth mindset. Be honest but strategic.",
        tips: ["Pick relevant strengths", "Show growth in weaknesses", "Be genuine"],
        keyPoints: ["Honesty", "Relevance", "Self-awareness", "Growth Mindset"]
    },
    {
        category: "HR",
        jobRole: "HR Specialist",
        difficulty: "Hard",
        question:
            "How do you handle conflict with colleagues and what's your approach to difficult conversations?",
        sampleAnswer:
            "Listen actively to understand the other person's perspective. Remain calm and empathetic. Focus on the issue, not the person. Use 'I' statements, seek common ground, and propose solutions. Document important conversations and escalate if needed.",
        tips: ["Emphasize listening", "Show empathy", "Provide examples"],
        keyPoints: ["Communication", "Empathy", "Problem-solving", "Patience", "Professionalism"]
    },
    // Sales Questions
    {
        category: "Sales",
        jobRole: "Sales Executive",
        difficulty: "Easy",
        question: "Why do you want to work in sales?",
        sampleAnswer:
            "Express your passion for building relationships, helping customers solve problems, and achieving targets. Mention the dynamic nature of sales and your drive to succeed. Show enthusiasm for the specific company and industry.",
        tips: ["Show genuine interest", "Connect to company values", "Mention targets/goals"],
        keyPoints: ["Passion", "Relationships", "Problem-solving", "Achievement", "Company Knowledge"]
    },
    {
        category: "Sales",
        jobRole: "Account Manager",
        difficulty: "Medium",
        question: "How would you approach a client who is not interested in our product?",
        sampleAnswer:
            "Ask open-ended questions to understand their needs and pain points. Listen actively to identify where your product could add value. Find a specific problem your product solves, address objections, and suggest a trial or follow-up meeting.",
        tips: ["Emphasize active listening", "Focus on client needs", "Show persistence"],
        keyPoints: ["Discovery", "Listening", "Problem-solving", "Objection Handling", "Follow-up"]
    },
    // Finance Questions
    {
        category: "Finance",
        jobRole: "Accountant",
        difficulty: "Easy",
        question: "What are the main financial statements and what do they show?",
        sampleAnswer:
            "The income statement shows revenue minus expenses to determine profit/loss. The balance sheet displays assets, liabilities, and equity at a point in time. The cash flow statement tracks cash movements in operating, investing, and financing activities.",
        tips: ["Explain each clearly", "Discuss relationships", "Mention importance"],
        keyPoints: ["Income Statement", "Balance Sheet", "Cash Flow", "Profit", "Assets"]
    },
    {
        category: "Finance",
        jobRole: "Financial Analyst",
        difficulty: "Hard",
        question: "How would you analyze a company's financial health?",
        sampleAnswer:
            "Perform ratio analysis (liquidity, profitability, efficiency, leverage), trend analysis comparing multiple periods, and benchmarking against competitors. Analyze cash flows, working capital, and growth trends. Use both quantitative metrics and qualitative factors.",
        tips: ["Mention specific ratios", "Discuss multiple perspectives", "Show analytical approach"],
        keyPoints: ["Ratios", "Trends", "Benchmarking", "Cash Flow", "Financial Health"]
    },
    // Marketing Questions
    {
        category: "Marketing",
        jobRole: "Marketing Manager",
        difficulty: "Medium",
        question: "How would you develop a marketing strategy for a new product launch?",
        sampleAnswer:
            "Start with market research to understand target audience, competitors, and market gaps. Define clear SMART objectives. Develop a go-to-market strategy including positioning, pricing, promotion, and distribution. Create a timeline, budget allocation, and KPIs to measure success.",
        tips: ["Show structured thinking", "Mention research", "Include metrics"],
        keyPoints: ["Research", "Target Audience", "Strategy", "Budget", "KPIs"]
    },
    {
        category: "Marketing",
        jobRole: "Digital Marketer",
        difficulty: "Medium",
        question: "How do you measure the success of a digital marketing campaign?",
        sampleAnswer:
            "Define KPIs aligned with business objectives: reach, engagement, conversion rate, ROI, etc. Use analytics tools (Google Analytics, social media insights) to track metrics. Compare performance against benchmarks and ongoing optimization.",
        tips: ["Mention specific tools", "Discuss multiple metrics", "Talk about optimization"],
        keyPoints: ["KPIs", "Analytics", "Conversion", "ROI", "Optimization"]
    },
    // Management Questions
    {
        category: "Management",
        jobRole: "Project Manager",
        difficulty: "Hard",
        question: "How do you handle a project that is falling behind schedule?",
        sampleAnswer:
            "First, conduct a root cause analysis to understand why delays occurred. Communicate the situation to stakeholders transparently. Work with the team to adjust timelines, reallocate resources, and prioritize deliverables. Implement monitoring mechanisms and adjust the plan as needed.",
        tips: ["Show problem-solving skills", "Emphasize communication", "Discuss prevention"],
        keyPoints: ["Analysis", "Communication", "Problem-solving", "Resource Management", "Planning"]
    },
    {
        category: "Management",
        jobRole: "Operations Manager",
        difficulty: "Medium",
        question: "How would you improve operational efficiency in a process?",
        sampleAnswer:
            "Start by documenting current processes and identifying bottlenecks through data analysis. Engage team members for insights and suggestions. Implement improvements incrementally, test changes, measure impact, and optimize further based on results.",
        tips: ["Show analytical thinking", "Involve team", "Mention metrics"],
        keyPoints: ["Process Analysis", "Improvement", "Team Involvement", "Measurement", "Optimization"]
    }
];

const seedQuestions = async () => {
    try {
        await DBConnectionHandler();
        console.log("Database connected");

        // Clear existing questions
        await InterviewQuestion.deleteMany({});
        console.log("Existing questions cleared");

        // Insert sample questions
        const result = await InterviewQuestion.insertMany(sampleQuestions);
        console.log(`${result.length} questions added successfully`);

        process.exit(0);
    } catch (error) {
        console.error("Error seeding questions:", error);
        process.exit(1);
    }
};

// Run this file to seed the database
if (require.main === module) {
    seedQuestions();
}

module.exports = seedQuestions;
