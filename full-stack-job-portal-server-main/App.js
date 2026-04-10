const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(cookieParser(process.env.COOKIE_SECRET));

// Middlewares
app.use(express.json());
app.use(
    cors({
        origin: ["https://mern-job-portal-seven.vercel.app","http://localhost:5173"],
        methods: ["GET,POST,DELETE,PUT,PATCH"],
        credentials: true,
    })
);

app.use("/public", express.static("public"));

// Custom Middlewares
const {
    authenticateUser,
} = require("./Middleware/UserAuthenticationMiddleware");

// Routers
const JobRouter = require("./Router/JobRouter");
const UserRouter = require("./Router/UserRouter");
const AuthRouter = require("./Router/AuthRouter");
const AdminRouter = require("./Router/AdminRouter");
const ApplicationRouter = require("./Router/ApplicationRouter");
const InterviewRouter = require("./Router/InterviewRouter");

// Connecting routes
app.use("/api/v1/jobs", authenticateUser, JobRouter);
app.use("/api/v1/users", authenticateUser, UserRouter);
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/admin", authenticateUser, AdminRouter);
app.use("/api/v1/application", authenticateUser, ApplicationRouter);
app.use("/", InterviewRouter);

module.exports = app;
