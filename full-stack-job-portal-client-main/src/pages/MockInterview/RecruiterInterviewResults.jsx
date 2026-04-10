import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { FiArrowLeft, FiMail, FiUser, FiCheckCircle, FiClock, FiTrendingUp, FiAward, FiBarChart2 } from "react-icons/fi";
import dayjs from "dayjs";

const RecruiterInterviewResults = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState([]);
    const [summary, setSummary] = useState(null);
    const [normalMockInterview, setNormalMockInterview] = useState(null);
    const [error, setError] = useState("");
    const hasCustomResults = results.length > 0;
    const hasGeneralResults = !!normalMockInterview?.subjectSummary?.length;
    const isInvalidSummaryRoute = jobId === "all";

    useEffect(() => {
        if (isInvalidSummaryRoute) {
            setLoading(false);
            setError("");
            setResults([]);
            setSummary(null);
            setNormalMockInterview(null);
            return;
        }

        fetchResults();
    }, [jobId]);

    const fetchResults = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:3000/api/v1/interviews/recruiter-results/${jobId}`,
                { withCredentials: true }
            );
            if (response.data.status) {
                setResults(response.data.result.candidates || []);
                setSummary(response.data.result.summary || null);
                setNormalMockInterview(response.data.result.normalMockInterview || null);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch results.");
        } finally {
            setLoading(false);
        }
    };

    const getQualityColor = (quality) => {
        switch (quality) {
            case "Excellent": return "text-green-600 bg-green-50 border-green-200";
            case "Good": return "text-blue-600 bg-blue-50 border-blue-200";
            case "Average": return "text-yellow-600 bg-yellow-50 border-yellow-200";
            case "Poor": return "text-red-600 bg-red-50 border-red-200";
            default: return "text-gray-600 bg-gray-50 border-gray-200";
        }
    };

    if (loading) {
        return <div className="text-center py-20">Loading candidate results...</div>;
    }

    return (
        <Wrapper>
            <div className="header-actions">
                <button className="back-btn" onClick={() => navigate("/dashboard/manage-jobs")}>
                    <FiArrowLeft className="icon" /> Back to Jobs
                </button>
                <div className="title-row">
                    <h2>Candidate Interview Results</h2>
                    <p>Review the mock interview performance of candidates who applied for this position.</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 border border-red-200">
                    {error}
                </div>
            )}

            {isInvalidSummaryRoute && (
                <div className="empty-state">
                    <FiUser className="empty-icon" />
                    <h3>Select a specific job to view candidate results.</h3>
                    <p>
                        Candidate interview results are stored job-wise. Open <strong>Manage Jobs</strong> and click the
                        <strong> Results </strong> button for the job you want to review.
                    </p>
                    <div className="empty-actions">
                        <button className="primary-action" onClick={() => navigate("/dashboard/manage-jobs")}>
                            Go to Manage Jobs
                        </button>
                    </div>
                </div>
            )}

            {!isInvalidSummaryRoute && !hasCustomResults && !hasGeneralResults && !error ? (
                <div className="empty-state">
                    <FiUser className="empty-icon" />
                    <h3>No interview results are available yet.</h3>
                    <p>Once applicants complete custom or normal mock interviews, their results will appear here.</p>
                </div>
            ) : (
                <>
                    {summary && (
                        <div className="summary-section">
                            <div className="summary-grid">
                                <div className="summary-card">
                                    <div className="summary-icon"><FiUser /></div>
                                    <div>
                                        <div className="summary-value">{summary.totalCandidates}</div>
                                        <div className="summary-label">Candidates Tested</div>
                                    </div>
                                </div>
                                <div className="summary-card">
                                    <div className="summary-icon"><FiTrendingUp /></div>
                                    <div>
                                        <div className="summary-value">{summary.averageScore}%</div>
                                        <div className="summary-label">Average Score</div>
                                    </div>
                                </div>
                                <div className="summary-card">
                                    <div className="summary-icon"><FiAward /></div>
                                    <div>
                                        <div className="summary-value">{summary.highestScore}%</div>
                                        <div className="summary-label">Top Score</div>
                                    </div>
                                </div>
                                <div className="summary-card">
                                    <div className="summary-icon"><FiBarChart2 /></div>
                                    <div>
                                        <div className="summary-value">{summary.shortlistedCandidates}</div>
                                        <div className="summary-label">Scored 60%+</div>
                                    </div>
                                </div>
                            </div>

                            <div className="insight-panels">
                                <div className="insight-card">
                                    <h3>Assessment Quality Mix</h3>
                                    <div className="quality-list">
                                        {Object.entries(summary.qualitySummary || {})
                                            .filter(([, count]) => count > 0)
                                            .map(([label, count]) => (
                                                <div key={label} className="quality-row">
                                                    <span className={`quality-tag ${getQualityColor(label)}`}>{label}</span>
                                                    <strong>{count}</strong>
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                <div className="insight-card">
                                    <h3>Subject / Category Performance</h3>
                                    {summary.categorySummary?.length ? (
                                        <div className="category-list">
                                            {summary.categorySummary.map((item) => (
                                                <div key={item.category} className="category-row">
                                                    <div>
                                                        <div className="category-name">{item.category}</div>
                                                        <div className="category-meta">
                                                            {item.attempts} answers reviewed • Avg question score {item.averageQuestionScore}/20
                                                        </div>
                                                    </div>
                                                    <div className="category-difficulty">
                                                        {Object.entries(item.difficulties || {}).map(([difficulty, count]) => (
                                                            <span key={difficulty}>{difficulty}: {count}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="muted-copy">No subject breakdown available yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {normalMockInterview && (
                        <div className="summary-section">
                            <div className="insight-card">
                                <h3>Normal Mock Interview Subjects for Applied Candidates</h3>
                                <p className="muted-copy" style={{ marginBottom: "1rem" }}>
                                    This shows only candidates who applied for this job and also completed regular mock interview subjects.
                                    Applicants with subject tests: <strong>{normalMockInterview.totalApplicantsWithMockTests}</strong>
                                </p>
                                {normalMockInterview.subjectSummary?.length ? (
                                    <div className="subject-panels">
                                        {normalMockInterview.subjectSummary.map((subject) => (
                                            <div key={subject.subject} className="subject-card">
                                                <div className="subject-head">
                                                    <div>
                                                        <div className="category-name">{subject.subject}</div>
                                                        <div className="category-meta">
                                                            {subject.candidateCount} applicants • {subject.attempts} attempts
                                                        </div>
                                                    </div>
                                                    <div className="subject-stats">
                                                        <span>Avg {subject.averageScore}%</span>
                                                        <span>Best {subject.bestScore}%</span>
                                                    </div>
                                                </div>
                                                <div className="subject-candidates">
                                                    {subject.topCandidates.map((candidate) => (
                                                        <div key={`${subject.subject}-${candidate.candidateId}`} className="subject-candidate-row">
                                                            <div>
                                                                <div className="subject-candidate-name">{candidate.candidateName}</div>
                                                                <div className="category-meta">{candidate.candidateEmail}</div>
                                                            </div>
                                                            <div className="subject-candidate-actions">
                                                                <span className={`quality-tag ${getQualityColor(candidate.quality)}`}>
                                                                    {candidate.bestScore}% • {candidate.quality}
                                                                </span>
                                                                {candidate.candidateResume && (
                                                                    <a
                                                                        href={candidate.candidateResume}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                        className="mini-link"
                                                                    >
                                                                        Resume
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="muted-copy">No applied candidates have completed normal mock interview subjects yet.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {hasCustomResults ? (
                        <div className="results-grid">
                            {results.map((result) => (
                                <div key={result.sessionId} className="result-card">
                                    <div className="card-top">
                                        <div className="candidate-info">
                                            <div className="avatar">
                                                {result.candidateName ? result.candidateName.charAt(0).toUpperCase() : "?"}
                                            </div>
                                            <div>
                                                <h3 className="name">{result.candidateName || "Unknown Candidate"}</h3>
                                                <p className="email">{result.candidateEmail}</p>
                                            </div>
                                        </div>
                                        <div className="score-badge">
                                            <span className="score-value">{result.score}%</span>
                                            <span className={`quality-tag ${getQualityColor(result.quality)}`}>
                                                {result.quality}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="card-middle">
                                        <div className="detail-item">
                                            <FiClock className="icon" />
                                            <span>Completed on: {dayjs(result.completedAt).format("MMM D, YYYY - h:mm A")}</span>
                                        </div>
                                        <div className="detail-item">
                                            <FiCheckCircle className="icon" />
                                            <span>AI Assessment Quality: {result.quality}</span>
                                        </div>
                                    </div>

                                    <div className="card-bottom">
                                        <a 
                                            href={`mailto:${result.candidateEmail}?subject=Regarding your application and mock interview`}
                                            className="contact-btn"
                                        >
                                            <FiMail className="icon" /> Contact Candidate
                                        </a>
                                        {result.candidateResume && (
                                            <a 
                                                href={result.candidateResume} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="view-resume-btn"
                                            >
                                                View Resume
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <FiUser className="empty-icon" />
                            <h3>No custom interview results yet.</h3>
                            <p>General mock interview subject results are shown above when available for applied candidates.</p>
                        </div>
                    )}
                </>
            )}
        </Wrapper>
    );
};

const Wrapper = styled.div`
    padding: 1.5rem;
    max-width: 1000px;
    margin: 0 auto;

    .header-actions {
        margin-bottom: 2.5rem;
    }

    .back-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: none;
        border: none;
        color: var(--color-primary);
        font-weight: 500;
        cursor: pointer;
        padding: 0;
        margin-bottom: 1rem;
        
        &:hover {
            text-decoration: underline;
        }
    }

    .title-row h2 {
        font-size: 1.8rem;
        color: var(--color-black);
    }
    
    .title-row p {
        color: #64748b;
        margin-top: 0.25rem;
        font-size: 1rem;
    }

    .empty-state {
        text-align: center;
        padding: 4rem 2rem;
        background: #f8fafc;
        border-radius: 8px;
        border: 1px dashed #cbd5e1;
        
        .empty-icon {
            font-size: 3rem;
            color: #94a3b8;
            margin-bottom: 1rem;
        }
        
        h3 {
            color: #334155;
            font-size: 1.2rem;
            margin-bottom: 0.5rem;
        }
        
        p {
            color: #64748b;
        }
    }

    .empty-actions {
        margin-top: 1.25rem;
        display: flex;
        justify-content: center;
    }

    .primary-action {
        border: none;
        border-radius: 8px;
        background: #2563eb;
        color: #fff;
        font-weight: 600;
        padding: 0.75rem 1.2rem;
        cursor: pointer;
    }

    .primary-action:hover {
        background: #1d4ed8;
    }

    .results-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;
        
        @media (min-width: 768px) {
            grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
        }
    }

    .summary-section {
        margin-bottom: 2rem;
    }

    .summary-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 1rem;
        margin-bottom: 1.25rem;
    }

    .summary-card {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 1rem;
        display: flex;
        align-items: center;
        gap: 0.9rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04);
    }

    .summary-icon {
        width: 42px;
        height: 42px;
        border-radius: 10px;
        background: #eff6ff;
        color: #2563eb;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.1rem;
    }

    .summary-value {
        font-size: 1.4rem;
        font-weight: 700;
        color: #0f172a;
        line-height: 1;
    }

    .summary-label {
        margin-top: 0.2rem;
        color: #64748b;
        font-size: 0.85rem;
    }

    .insight-panels {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .insight-card {
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 1rem 1.2rem;
    }

    .insight-card h3 {
        font-size: 1rem;
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 0.85rem;
    }

    .quality-list,
    .category-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .quality-row,
    .category-row {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        align-items: center;
    }

    .category-name {
        font-weight: 600;
        color: #0f172a;
    }

    .category-meta,
    .muted-copy {
        color: #64748b;
        font-size: 0.88rem;
    }

    .category-difficulty {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        color: #475569;
        font-size: 0.8rem;
        justify-content: flex-end;
    }

    .subject-panels {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    .subject-card {
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 1rem;
        background: #f8fafc;
    }

    .subject-head {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        align-items: center;
        margin-bottom: 0.85rem;
    }

    .subject-stats {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
        font-size: 0.88rem;
        font-weight: 600;
        color: #1e293b;
    }

    .subject-candidates {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .subject-candidate-row {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        align-items: center;
        padding-top: 0.75rem;
        border-top: 1px solid #e2e8f0;
    }

    .subject-candidate-name {
        font-weight: 600;
        color: #0f172a;
    }

    .subject-candidate-actions {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex-wrap: wrap;
        justify-content: flex-end;
    }

    .mini-link {
        font-size: 0.85rem;
        color: #2563eb;
        text-decoration: none;
        font-weight: 600;
    }

    .mini-link:hover {
        text-decoration: underline;
    }

    .result-card {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        padding: 1.5rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        transition: transform 0.2s, box-shadow 0.2s;
        
        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
    }

    .card-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #f1f5f9;
        
        .candidate-info {
            display: flex;
            align-items: center;
            gap: 1rem;
            
            .avatar {
                width: 48px;
                height: 48px;
                background: linear-gradient(135deg, var(--color-primary), #4f46e5);
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                font-weight: bold;
            }
            
            .name {
                font-weight: 600;
                font-size: 1.1rem;
                color: #1e293b;
            }
            
            .email {
                color: #64748b;
                font-size: 0.9rem;
            }
        }
        
        .score-badge {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 0.25rem;
            
            .score-value {
                font-size: 1.5rem;
                font-weight: 700;
                color: #0f172a;
            }
            
            .quality-tag {
                font-size: 0.75rem;
                font-weight: 600;
                padding: 0.1rem 0.5rem;
                border-radius: 999px;
                border: 1px solid;
            }
        }
    }

    .card-middle {
        margin-bottom: 1.5rem;
        
        .detail-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: #475569;
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
            
            .icon {
                color: #94a3b8;
            }
        }
    }

    .card-bottom {
        display: flex;
        gap: 1rem;
        
        a {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 0.5rem;
            padding: 0.6rem 0;
            border-radius: 6px;
            font-weight: 500;
            font-size: 0.9rem;
            text-decoration: none;
            transition: all 0.2s;
        }
        
        .contact-btn {
            background: #f8fafc;
            color: #334155;
            border: 1px solid #cbd5e1;
            
            &:hover {
                background: #f1f5f9;
                color: #0f172a;
            }
        }
        
        .view-resume-btn {
            background: #eff6ff;
            color: #2563eb;
            border: 1px solid #bfdbfe;
            
            &:hover {
                background: #dbeafe;
                color: #1d4ed8;
            }
        }
    }
`;

export default RecruiterInterviewResults;
