import React, { useState } from "react";
import { CiSquarePlus } from "react-icons/ci";
import styled from "styled-components";
import LoadingComTwo from "../components/shared/LoadingComTwo";

import { FaRegEdit, FaTasks } from "react-icons/fa";
import { MdDelete, MdOutlineQuiz } from "react-icons/md";
import { MdVisibility } from "react-icons/md";
import { FiUsers, FiVideo } from "react-icons/fi";

import Swal from "sweetalert2";
import axios from "axios";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllHandler } from "../utils/FetchHandlers";

const ManageJobs = () => {
    const {
        isPending,
        isError,
        data: jobs,
        error,
        refetch,
    } = useQuery({
        queryKey: ["my-jobs"],
        queryFn: () =>
            getAllHandler(
                `http://localhost:3000/api/v1/jobs/my-jobs`
            ),
    });

    const deleteModal = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#19b74b",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteJobHandler(id);
            }
        });
    };

    const deleteJobHandler = async (id) => {
        try {
            const response = await axios.delete(
                `http://localhost:3000/api/v1/jobs/${id}`,
                { withCredentials: true }
            );
            refetch();
            Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success",
            });
        } catch (error) {
            Swal.fire({
                title: "Sorry!",
                text: error?.message,
                icon: "error",
            });
        }
    };

    const handleSetMeetingLink = async (job) => {
        const { value: link } = await Swal.fire({
            title: "Set Meeting Link",
            html: `
                <p style="font-size:13px;color:#64748b;margin-bottom:12px;">
                    Paste a <b>Google Meet</b>, <b>Zoom</b>, or <b>Teams</b> meeting link.<br/>
                    This will be visible to candidates who view this job.
                </p>
            `,
            input: "url",
            inputLabel: "Meeting URL",
            inputPlaceholder: "https://meet.google.com/abc-defg-hij",
            inputValue: job?.meetingLink || "",
            showCancelButton: true,
            confirmButtonText: "Save Link",
            confirmButtonColor: "#3b82f6",
            cancelButtonText: "Cancel",
            inputValidator: (value) => {
                // allow clearing the link
                return undefined;
            },
        });

        if (link !== undefined) {
            try {
                await axios.patch(
                    `http://localhost:3000/api/v1/jobs/${job._id}/meeting-link`,
                    { meetingLink: link },
                    { withCredentials: true }
                );
                Swal.fire({
                    icon: "success",
                    title: link ? "Meeting Link Saved!" : "Meeting Link Removed!",
                    text: link ? "Candidates can now see the meeting link on the job page." : "The meeting link has been removed.",
                    timer: 2000,
                    showConfirmButton: false,
                });
                refetch();
            } catch (err) {
                Swal.fire("Error", err?.response?.data?.message || "Failed to update meeting link.", "error");
            }
        }
    };

    if (isPending) {
        return <LoadingComTwo />;
    }

    if (isError) {
        console.log(error?.message);
        return (
            <h2 className="text-lg md:text-3xl font-bold text-red-600 text-center mt-12">
                {error?.message}
            </h2>
        );
    }

    if (!jobs?.result?.length) {
        return (
            <h2 className="text-lg md:text-3xl font-bold text-red-600 text-center mt-12">
                -- Job List is Empty --
            </h2>
        );
    }
    return (
        <Wrapper>
            <div className="title-row">
                Manage Jobs
                <CiSquarePlus className="ml-1 text-xl md:text-2xl" />
            </div>
            <div className="content-row">
                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Job Position</th>
                            <th>Company</th>
                            <th>Created By</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs?.result?.map((job, index) => {
                            let i =
                                index + 1 < 10 ? `0${index + 1}` : index + 1;
                            return (
                                <tr key={job._id}>
                                    <td>{i}</td>
                                    <td>{job?.position}</td>
                                    <td>{job?.company}</td>
                                    <td>{job?.createdBy?.username}</td>
                                    <td>
                                        <div className="action-btn-grid">
                                            {/* View Job */}
                                            <a
                                                href={`/job/${job._id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="action-btn view"
                                            >
                                                <MdVisibility className="action-icon" />
                                                <span>View</span>
                                            </a>

                                            {/* Edit Job */}
                                            <Link
                                                to={`/dashboard/edit-job/${job._id}`}
                                                className="action-btn edit"
                                            >
                                                <FaRegEdit className="action-icon" />
                                                <span>Edit</span>
                                            </Link>

                                            {/* Interview Template */}
                                            <Link
                                                to={`/dashboard/interview-template/${job._id}`}
                                                className="action-btn quiz"
                                            >
                                                <MdOutlineQuiz className="action-icon" />
                                                <span>Questions</span>
                                            </Link>

                                            {/* View Candidate Results */}
                                            <Link
                                                to={`/dashboard/interview-results/${job._id}`}
                                                className="action-btn results"
                                            >
                                                <FiUsers className="action-icon" />
                                                <span>Results</span>
                                            </Link>

                                            {/* Meeting Link */}
                                            <button
                                                className={`action-btn meeting ${job?.meetingLink ? 'has-link' : ''}`}
                                                onClick={() => handleSetMeetingLink(job)}
                                            >
                                                <FiVideo className="action-icon" />
                                                <span>{job?.meetingLink ? "Edit Meet" : "Set Meet"}</span>
                                            </button>

                                            {/* Delete Job */}
                                            <button
                                                className="action-btn delete"
                                                onClick={() => deleteModal(job._id)}
                                            >
                                                <MdDelete className="action-icon" />
                                                <span>Delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </Wrapper>
    );
};

const Wrapper = styled.section`
    .title-row {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: calc(0.9rem + 0.4vw);
        text-transform: capitalize;
        letter-spacing: 1px;
        font-weight: 600;
        opacity: 0.85;
        color: var(--color-black);
        position: relative;
    }
    .title-row:before {
        content: "";
        position: absolute;
        bottom: -4px;
        left: 0;
        width: calc(30px + 0.7vw);
        height: calc(2px + 0.1vw);
        background-color: var(--color-primary);
    }
    .content-row {
        overflow-x: auto;
        margin-top: calc(2rem + 0.5vw);
    }
    .table {
        border-collapse: collapse;
        border-spacing: 0;
        width: 100%;
        border: 1px solid #ddd;
        border-radius: 8px;
    }
    .table thead {
        background-color: var(--color-accent);
        color: var(--color-white);
        font-size: 14px;
        letter-spacing: 1px;
        font-weight: 400;
        text-transform: capitalize;
    }

    .table th,
    .table td {
        text-align: left;
        padding: 12px;
    }

    .table tbody tr {
        font-size: 15px;
        font-weight: 400;
        text-transform: capitalize;
        letter-spacing: 1px;
        transition: all 0.2s linear;
    }

    .table tbody tr:nth-child(even) {
        background-color: #00000011;
    }

    /* ── Action button grid ── */
    .action-btn-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
    }

    .action-btn {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 5px 10px;
        border-radius: 6px;
        border: 1.5px solid;
        font-size: 11px;
        font-weight: 600;
        cursor: pointer;
        text-decoration: none;
        transition: all 0.2s ease;
        white-space: nowrap;
        background: transparent;
    }

    .action-btn .action-icon {
        font-size: 14px;
    }

    /* View */
    .action-btn.view {
        color: #16a34a;
        border-color: #bbf7d0;
        background: #f0fdf4;
    }
    .action-btn.view:hover {
        background: #dcfce7;
        border-color: #16a34a;
    }

    /* Edit */
    .action-btn.edit {
        color: #ca8a04;
        border-color: #fef08a;
        background: #fefce8;
    }
    .action-btn.edit:hover {
        background: #fef9c3;
        border-color: #ca8a04;
    }

    /* Quiz / Questions */
    .action-btn.quiz {
        color: #7c3aed;
        border-color: #ddd6fe;
        background: #f5f3ff;
    }
    .action-btn.quiz:hover {
        background: #ede9fe;
        border-color: #7c3aed;
    }

    /* Results */
    .action-btn.results {
        color: #2563eb;
        border-color: #bfdbfe;
        background: #eff6ff;
    }
    .action-btn.results:hover {
        background: #dbeafe;
        border-color: #2563eb;
    }

    /* Meeting */
    .action-btn.meeting {
        color: #0891b2;
        border-color: #a5f3fc;
        background: #ecfeff;
    }
    .action-btn.meeting:hover {
        background: #cffafe;
        border-color: #0891b2;
    }
    .action-btn.meeting.has-link {
        color: #059669;
        border-color: #6ee7b7;
        background: #ecfdf5;
    }

    /* Delete */
    .action-btn.delete {
        color: #dc2626;
        border-color: #fecaca;
        background: #fef2f2;
    }
    .action-btn.delete:hover {
        background: #fee2e2;
        border-color: #dc2626;
    }
`;

export default ManageJobs;
