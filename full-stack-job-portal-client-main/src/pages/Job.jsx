import React, { useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";
import { getSingleHandler } from "../utils/FetchHandlers";
import LoadingComTwo from "../components/shared/LoadingComTwo";

import advancedFormat from "dayjs/plugin/advancedFormat";
import dayjs from "dayjs";
dayjs.extend(advancedFormat);

import { MdAccessTime } from "react-icons/md";
import Navbar from "../components/shared/Navbar";
import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

// import advancedFormat from "dayjs/plugin/advancedFormat";
// import dayjs from "dayjs";
dayjs.extend(advancedFormat);

const Job = () => {
    const { id } = useParams();
    const { user } = useUserContext();
    const navigate = useNavigate();
    const [isApplying, setIsApplying] = useState(false);
    const [isStartingInterview, setIsStartingInterview] = useState(false);
    
    const {
        isLoading,
        isError,
        data: job,
        error,
    } = useQuery({
        queryKey: ["job"],
        queryFn: () =>
            getSingleHandler(
                `http://localhost:3000/api/v1/jobs/${id}`
            ),
    });

    const date = dayjs(job?.jobDeadline).format("MMM Do, YYYY");

    const handleApply = async () => {
        if (!user) {
            Swal.fire("Please login", "You need to be logged in to apply", "warning");
            navigate("/login");
            return;
        }
        if (user.role === "recruiter") {
            Swal.fire("Employers cannot apply", "Please login as a Candidate to apply for jobs", "error");
            return;
        }
        if (!user.resume) {
            Swal.fire({
                title: "Resume missing",
                text: "Please upload your resume in your profile first to apply.",
                icon: "info",
                confirmButtonText: "Go to Profile"
            }).then((res) => {
                if(res.isConfirmed) {
                    navigate("/dashboard/edit-profile/" + user._id);
                }
            });
            return;
        }

        setIsApplying(true);
        try {
            const payload = {
                applicantId: user._id,
                recruiterId: job?.createdBy,
                jobId: job?._id,
                resume: user.resume
            };
            const response = await axios.post("http://localhost:3000/api/v1/application", payload, { withCredentials: true });
            Swal.fire("Success!", "Application sent to the employer successfully.", "success");
        } catch (err) {
            // e.g "Already Applied"
            Swal.fire("Oops", err?.response?.data?.message || err?.response?.data || err.message, "error");
        } finally {
            setIsApplying(false);
        }
    };

    if (isLoading) {
        return <LoadingComTwo />;
    }
    if (isError) {
        return <h2 className="">{error?.message}</h2>;
    }
    // if (job) {
    //     console.log(job.result);
    // }
    return (
        <>
            <Navbar />
            <Wrapper>
                <div className="top-row">
                    <h2 className="title">
                        <span className="capitalize ">job title: </span>
                        {job?.position}
                    </h2>
                    <h4 className="company">
                        <span className="fancy">posted by: </span>
                        {job?.company}
                    </h4>
                    <h4 className="post-date">
                        <MdAccessTime className="text-lg mr-1" />
                        {dayjs(job?.result?.createdAt).format("MMM Do, YYYY")}
                    </h4>
                </div>
                <div className="middle-row">
                    <div className="description">
                        <h3 className="sec-title">description</h3>
                        <p className="">{job?.jobDescription}</p>
                    </div>
                    <h4 className="deadline">
                        Deadline: <span className="">{date}</span>
                    </h4>
                    <h4 className="vacancy">
                        Job Vacancy: <span className="">{job?.jobVacancy}</span>
                    </h4>
                    <div className="requirement">
                        <h3 className="sec-title">Requirements</h3>
                        <ul>
                            {job?.jobSkills?.map((skill) => (
                                <li key={skill}>{skill}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="facility">
                        <h3 className="sec-title">Facilities</h3>
                        <ul>
                            {job?.jobFacilities?.map((facility) => (
                                <li key={facility}>{facility}</li>
                            ))}
                        </ul>
                    </div>
                    <h4 className="salary">
                        Salary: <span className="">{job?.jobSalary} TK</span>
                    </h4>

                    {/* Meeting Link (if set by recruiter) */}
                    {job?.meetingLink && (
                        <div style={{
                            background: "linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)",
                            border: "1.5px solid #93c5fd",
                            borderRadius: "12px",
                            padding: "20px 24px",
                            marginBottom: "calc(10px + 0.3vw)",
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                            flexWrap: "wrap"
                        }}>
                            <div style={{ fontSize: "32px" }}>📹</div>
                            <div style={{ flex: 1, minWidth: "200px" }}>
                                <h4 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#1e293b" }}>
                                    Interview Meeting Scheduled
                                </h4>
                                <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#64748b" }}>
                                    The recruiter has shared a meeting link for this position.
                                </p>
                            </div>
                            <a
                                href={job.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    padding: "10px 22px",
                                    background: "#2563eb",
                                    color: "#fff",
                                    borderRadius: "8px",
                                    fontWeight: 700,
                                    fontSize: "14px",
                                    textDecoration: "none",
                                    transition: "background 0.2s"
                                }}
                                onMouseEnter={e => e.target.style.background = "#1d4ed8"}
                                onMouseLeave={e => e.target.style.background = "#2563eb"}
                            >
                                🔗 Join Meeting
                            </a>
                        </div>
                    )}
                    <div className="apply">
                        <h3 className="sec-title">To apply</h3>
                        {(!user || user?.role === "user") ? (
                            <div className="flex flex-wrap gap-3 mt-4">
                                <button 
                                    onClick={handleApply} 
                                    disabled={isApplying || isStartingInterview}
                                    className="bg-[#3b82f6] text-white px-6 py-2 rounded-md font-semibold text-sm hover:bg-[#2563eb] transition disabled:opacity-50 cursor-pointer"
                                >
                                    {isApplying ? "Submitting..." : "Apply Now"}
                                </button>
                                <button
                                    onClick={async () => {
                                        if (!user) {
                                            Swal.fire("Please login", "You need to be logged in to practice a mock interview", "warning");
                                            navigate("/login");
                                            return;
                                        }
                                        try {
                                            setIsStartingInterview(true);
                                            // Try to start a custom job interview first
                                            const response = await axios.post(
                                                "http://localhost:3000/api/v1/interviews/start-job",
                                                { jobId: job?._id },
                                                { withCredentials: true }
                                            );
                                            if (response.data.status) {
                                                navigate(`/mock-interview/practice/${response.data.result.sessionId}`, {
                                                    state: { questions: response.data.result.questions }
                                                });
                                            }
                                        } catch (error) {
                                            // 404 means no custom template, fall back to generic flow
                                            if (error.response && error.response.status === 404) {
                                                navigate(`/mock-interview/choose/${encodeURIComponent(job?.position)}`);
                                            } else {
                                                Swal.fire("Error", "Could not start mock interview.", "error");
                                            }
                                        } finally {
                                            setIsStartingInterview(false);
                                        }
                                    }}
                                    disabled={isApplying || isStartingInterview}
                                    className="bg-[#7c3aed] text-white px-6 py-2 rounded-md font-semibold text-sm hover:bg-[#6d28d9] transition disabled:opacity-50 cursor-pointer flex items-center gap-2"
                                >
                                    {isStartingInterview ? "Starting..." : "🎤 Practice Mock Interview"}
                                </button>
                            </div>
                        ) : (
                            <div>
                                <p className="intro">Email: {job?.jobContact}</p>
                                <p className="text-[11px] font-semibold opacity-70 mt-2 text-red-500">* Log out and log in as a Candidate to apply</p>
                            </div>
                        )}
                    </div>
                </div>
            </Wrapper>
        </>
    );
};

const Wrapper = styled.section`
    padding: 2rem 0;
    max-width: 1000px;
    margin: 0 auto;
    margin-bottom: calc(20px + 1vw);
    width: 100%;

    .top-row {
        margin-bottom: calc(30px + 1vw);
    }
    .top-row .title {
        font-size: calc(14px + 1vw);
        text-align: center;
    }
    .top-row .company {
        font-size: calc(11px + 0.35vw);
        text-align: center;
        text-transform: capitalize;
        font-weight: 600;
        margin-top: 4px;
        opacity: 0.75;
    }
    .top-row .post-date {
        font-size: 11px;
        font-weight: 600;
        text-transform: capitalize;
        text-align: center;
        opacity: 0.75;
        margin-top: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .middle-row .description h3 {
        font-size: calc(14px + 0.15vw);
        font-weight: 600;
        text-transform: capitalize;
        opacity: 0.8;
        text-decoration: underline;
    }
    .middle-row .description p {
        margin-top: 6px;
        font-size: calc(12px + 0.15vw);
        font-weight: 400;
        opacity: 0.95;
        text-align: justify;
        line-height: 23px;
    }
    .middle-row .deadline {
        font-size: calc(13px + 0.1vw);
        font-weight: 600;
        opacity: 0.8;
        margin-top: calc(10px + 0.3vw);
    }
    .middle-row .vacancy {
        font-size: calc(13px + 0.1vw);
        font-weight: 600;
        opacity: 0.8;
        margin-top: 4px;
        margin-bottom: calc(10px + 0.3vw);
    }
    .middle-row .requirement {
        margin-bottom: calc(10px + 0.3vw);
    }
    .middle-row .requirement .sec-title {
        font-size: calc(14px + 0.15vw);
        font-weight: 600;
        text-transform: capitalize;
        opacity: 0.8;
        text-decoration: underline;
    }
    .middle-row .requirement p {
        margin-top: 6px;
        font-size: calc(12px + 0.15vw);
        font-weight: 400;
        opacity: 0.95;
        text-align: justify;
        line-height: 23px;
    }
    .middle-row .requirement ul {
        margin-top: 6px;
        list-style: circle;
        margin-left: calc(30px + 0.5vw);
    }
    .middle-row .requirement ul li {
        font-size: calc(12px + 0.15vw);
        font-weight: 400;
        opacity: 0.95;
        text-transform: capitalize;
        padding: 2px 0;
    }

    .middle-row .facility .sec-title {
        font-size: calc(14px + 0.15vw);
        font-weight: 600;
        text-transform: capitalize;
        opacity: 0.8;
        text-decoration: underline;
    }
    .middle-row .facility {
        margin-bottom: calc(10px + 0.3vw);
    }
    .middle-row .facility p {
        margin-top: 6px;
        font-size: calc(12px + 0.15vw);
        font-weight: 400;
        opacity: 0.95;
        text-align: justify;
        line-height: 23px;
    }
    .middle-row .facility ul {
        margin-top: 6px;
        list-style: circle;
        margin-left: calc(30px + 0.5vw);
    }
    .middle-row .facility ul li {
        font-size: calc(12px + 0.15vw);
        font-weight: 400;
        opacity: 0.95;
        text-transform: capitalize;
        padding: 2px 0;
    }
    .middle-row .salary {
        font-size: calc(14px + 0.1vw);
        font-weight: 600;
        opacity: 0.85;
        margin-bottom: calc(10px + 0.3vw);
    }
    .middle-row .apply h3 {
        font-size: calc(14px + 0.15vw);
        font-weight: 600;
        text-transform: capitalize;
        opacity: 0.8;
        text-decoration: underline;
    }
    .middle-row .apply p {
        margin-top: 6px;
        font-size: calc(12px + 0.15vw);
        font-weight: 400;
        opacity: 0.95;
    }
    .middle-row .apply p.intro {
        text-transform: capitalize;
    }
    .middle-row .apply p.info {
        font-weight: 600;
        opacity: 0.8;
    }
`;

export default Job;
