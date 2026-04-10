import { createBrowserRouter } from "react-router-dom";
import HomeLayout from "../Layout/HomeLayout";
import DashboardLayout from "../Layout/DashboardLayout";

// Pages
import {
    Register,
    Login,
    Landing,
    Error,
    AllJobs,
    Stats,
    Profile,
    Admin,
    EditJob,
    AddJob,
    ManageJobs,
    Job,
    MyJobs,
    EditProfile,
    ManageUsers,
} from "../pages";

// Mock Interview Pages
import InterviewDashboard from "../pages/MockInterview/InterviewDashboard";
import ChooseCategory from "../pages/MockInterview/ChooseCategory";
import PracticeInterview from "../pages/MockInterview/PracticeInterview";
import InterviewResults from "../pages/MockInterview/InterviewResults";
import CreateInterviewTemplate from "../pages/MockInterview/CreateInterviewTemplate";
import RecruiterInterviewResults from "../pages/MockInterview/RecruiterInterviewResults";
import RecruiterPortal from "../pages/RecruiterPortal";
import RecruiterRegister from "../pages/RecruiterRegister";
import ForgotPassword from "../pages/ForgotPassword";

import { JobContext } from "../context/JobContext";

import CommonProtectRoute from "../components/shared/CommonProtectRoute";
import ProtectAdminRoute from "../components/shared/ProtectAdminRoute";
import RecruiterRoute from "../components/shared/RecruiterRoute";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomeLayout></HomeLayout>,
        errorElement: <Error />,
        children: [
            {
                index: true,
                element: <Landing />,
            },
            {
                path: "all-jobs",
                element: (
                    <CommonProtectRoute>
                        <JobContext>
                            <AllJobs />
                        </JobContext>
                    </CommonProtectRoute>
                ),
            },
            {
                path: "job/:id",
                element: (
                    <CommonProtectRoute>
                        <JobContext>
                            <Job />
                        </JobContext>
                    </CommonProtectRoute>
                ),
            },
            {
                path: "register",
                element: <Register></Register>,
            },
            {
                path: "login",
                element: <Login></Login>,
            },
            {
                path: "forgot-password",
                element: <ForgotPassword />,
            },
            {
                path: "recruiter",
                element: <RecruiterPortal />,
            },
            {
                path: "recruiter/register",
                element: <RecruiterRegister />,
            },
            {
                path: "mock-interview",
                element: (
                    <CommonProtectRoute>
                        <InterviewDashboard />
                    </CommonProtectRoute>
                ),
            },
            {
                path: "mock-interview/choose/:category",
                element: (
                    <CommonProtectRoute>
                        <ChooseCategory />
                    </CommonProtectRoute>
                ),
            },
            {
                path: "mock-interview/practice/:sessionId",
                element: (
                    <CommonProtectRoute>
                        <PracticeInterview />
                    </CommonProtectRoute>
                ),
            },
            {
                path: "mock-interview/results/:sessionId",
                element: (
                    <CommonProtectRoute>
                        <InterviewResults />
                    </CommonProtectRoute>
                ),
            },
            {
                path: "dashboard",
                element: (
                    <CommonProtectRoute>
                        <JobContext>
                            <DashboardLayout></DashboardLayout>
                        </JobContext>
                    </CommonProtectRoute>
                ),
                children: [
                    {
                        index: true,
                        element: <Profile />,
                    },
                    {
                        path: "edit-profile/:id",
                        element: <EditProfile />,
                    },
                    {
                        path: "stats",
                        element: (
                            <ProtectAdminRoute>
                                <Stats />
                            </ProtectAdminRoute>
                        ),
                    },
                    {
                        path: "add-jobs",
                        element: (
                            <RecruiterRoute>
                                <AddJob />
                            </RecruiterRoute>
                        ),
                    },
                    {
                        path: "manage-jobs",
                        element: (
                            <RecruiterRoute>
                                <ManageJobs />
                            </RecruiterRoute>
                        ),
                    },
                    {
                        path: "manage-users",
                        element: (
                            <ProtectAdminRoute>
                                <ManageUsers />
                            </ProtectAdminRoute>
                        ),
                    },
                    {
                        path: "admin",
                        element: (
                            <ProtectAdminRoute>
                                <Admin />
                            </ProtectAdminRoute>
                        ),
                    },
                    {
                        path: "edit-job/:id",
                        element: (
                            <RecruiterRoute>
                                <EditJob />
                            </RecruiterRoute>
                        ),
                    },
                    {
                        path: "interview-template/:jobId",
                        element: (
                            <RecruiterRoute>
                                <CreateInterviewTemplate />
                            </RecruiterRoute>
                        ),
                    },
                    {
                        path: "interview-results/:jobId",
                        element: (
                            <RecruiterRoute>
                                <RecruiterInterviewResults />
                            </RecruiterRoute>
                        ),
                    },
                    {
                        path: "my-jobs",
                        element: (
                            <CommonProtectRoute>
                                <MyJobs />
                            </CommonProtectRoute>
                        ),
                    },
                ],
            },
        ],
    },
]);

export default router;
