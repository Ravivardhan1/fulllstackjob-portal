import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import styled from "styled-components";
import { FiPlus, FiTrash2, FiSave, FiArrowLeft } from "react-icons/fi";

const CreateInterviewTemplate = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    
    const [questions, setQuestions] = useState([
        { question: "", expectedAnswer: "", difficulty: "Medium", tips: [""] }
    ]);

    useEffect(() => {
        fetchExistingTemplate();
    }, [jobId]);

    const fetchExistingTemplate = async () => {
        try {
            setFetching(true);
            const response = await axios.get(
                `http://localhost:3000/api/v1/interviews/job-template/${jobId}`,
                { withCredentials: true }
            );
            if (response.data.status && response.data.result.questions.length > 0) {
                // Ensure tips array has at least one empty string to show input box
                const formattedQs = response.data.result.questions.map(q => ({
                    ...q,
                    tips: q.tips && q.tips.length > 0 ? q.tips : [""]
                }));
                setQuestions(formattedQs);
            }
        } catch (error) {
            // It's okay if not found (404), means no template exists yet
            if (error.response && error.response.status !== 404) {
                console.error("Error fetching template", error);
            }
        } finally {
            setFetching(false);
        }
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const handleTipChange = (qIndex, tIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].tips[tIndex] = value;
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        setQuestions([
            ...questions,
            { question: "", expectedAnswer: "", difficulty: "Medium", tips: [""] }
        ]);
    };

    const removeQuestion = (index) => {
        if (questions.length === 1) {
            Swal.fire("Wait", "You need at least one question.", "warning");
            return;
        }
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        setQuestions(newQuestions);
    };

    const addTip = (qIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].tips.push("");
        setQuestions(newQuestions);
    };

    const removeTip = (qIndex, tIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].tips.splice(tIndex, 1);
        // Ensure at least one empty tip exists
        if (newQuestions[qIndex].tips.length === 0) {
            newQuestions[qIndex].tips.push("");
        }
        setQuestions(newQuestions);
    };

    const handleSave = async () => {
        // Validate
        for (let i = 0; i < questions.length; i++) {
            if (!questions[i].question.trim() || !questions[i].expectedAnswer.trim()) {
                Swal.fire("Incomplete", `Please fill out the Question and Expected Answer for question #${i + 1}`, "error");
                return;
            }
        }

        // Clean up empty tips before saving
        const cleanedQuestions = questions.map(q => ({
            ...q,
            tips: q.tips.filter(t => t.trim() !== "")
        }));

        try {
            setLoading(true);
            const response = await axios.post(
                "http://localhost:3000/api/v1/interviews/job-template",
                { jobId, questions: cleanedQuestions },
                { withCredentials: true }
            );
            
            if (response.data.status) {
                Swal.fire("Success", "Interview template saved successfully!", "success").then(() => {
                    navigate("/dashboard/manage-jobs");
                });
            }
        } catch (error) {
            Swal.fire("Error", error.response?.data?.message || "Something went wrong", "error");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <div className="text-center py-20">Loading template data...</div>;
    }

    return (
        <Wrapper>
            <div className="header-actions">
                <button className="back-btn" onClick={() => navigate("/dashboard/manage-jobs")}>
                    <FiArrowLeft className="icon" /> Back to Jobs
                </button>
                <div className="title-row">
                    <h2>Custom Mock Interview Template</h2>
                    <p>Create specific questions for candidates applying to this job</p>
                </div>
            </div>

            <div className="questions-container">
                {questions.map((q, qIndex) => (
                    <div key={qIndex} className="question-card">
                        <div className="card-header">
                            <h3>Question {qIndex + 1}</h3>
                            <button 
                                type="button" 
                                className="remove-q-btn" 
                                onClick={() => removeQuestion(qIndex)}
                            >
                                <FiTrash2 /> Remove
                            </button>
                        </div>

                        <div className="input-group">
                            <label>Question text *</label>
                            <input 
                                type="text"
                                value={q.question}
                                onChange={(e) => handleQuestionChange(qIndex, "question", e.target.value)}
                                placeholder="e.g. Can you describe your experience with React?" 
                            />
                        </div>

                        <div className="input-group">
                            <label>Expected Answer (for AI scoring) *</label>
                            <textarea 
                                value={q.expectedAnswer}
                                onChange={(e) => handleQuestionChange(qIndex, "expectedAnswer", e.target.value)}
                                placeholder="What ideally should the candidate include in their answer? Keep it detailed." 
                                rows="3"
                            />
                        </div>

                        <div className="input-row">
                            <div className="input-group">
                                <label>Difficulty</label>
                                <select 
                                    value={q.difficulty} 
                                    onChange={(e) => handleQuestionChange(qIndex, "difficulty", e.target.value)}
                                >
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                            </div>
                        </div>

                        <div className="tips-section">
                            <label>Helpful Tips for Candidate (Optional)</label>
                            {q.tips.map((tip, tIndex) => (
                                <div key={tIndex} className="tip-row">
                                    <input 
                                        type="text" 
                                        value={tip}
                                        onChange={(e) => handleTipChange(qIndex, tIndex, e.target.value)}
                                        placeholder={`Tip ${tIndex + 1}`}
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => removeTip(qIndex, tIndex)}
                                        className="remove-tip"
                                        title="Remove tip"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                            <button type="button" className="add-tip-btn" onClick={() => addTip(qIndex)}>
                                + Add another tip
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="actions-bar">
                <button type="button" className="add-q-btn" onClick={addQuestion}>
                    <FiPlus className="icon" /> Add New Question
                </button>
                <button type="button" className="save-btn" onClick={handleSave} disabled={loading}>
                    <FiSave className="icon" /> {loading ? "Saving..." : "Save Template"}
                </button>
            </div>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    padding: 1rem;
    max-width: 800px;
    margin: 0 auto;

    .header-actions {
        margin-bottom: 2rem;
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
        font-size: 1.5rem;
        color: var(--color-black);
    }
    
    .title-row p {
        color: #666;
        margin-top: 0.25rem;
        font-size: 0.95rem;
    }

    .question-card {
        background: #fff;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
        box-shadow: 0 2px 4px rgba(0,0,0,0.02);
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        border-bottom: 1px solid #f0f0f0;
        padding-bottom: 0.75rem;

        h3 {
            font-size: 1.1rem;
            color: var(--color-primary);
        }

        .remove-q-btn {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            color: #ef4444;
            background: none;
            border: none;
            font-size: 0.85rem;
            cursor: pointer;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;

            &:hover {
                background: #fef2f2;
            }
        }
    }

    .input-group {
        margin-bottom: 1.25rem;
        display: flex;
        flex-direction: column;

        label {
            font-size: 0.9rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: #333;
        }

        input, textarea, select {
            padding: 0.6rem;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 0.95rem;

            &:focus {
                outline: none;
                border-color: var(--color-primary);
            }
        }
    }

    .input-row {
        display: flex;
        gap: 1rem;
        
        .input-group {
            flex: 1;
        }
    }

    .tips-section {
        margin-top: 1.5rem;
        background: #f8fafc;
        padding: 1rem;
        border-radius: 6px;

        label {
            display: block;
            font-size: 0.85rem;
            font-weight: 600;
            color: #475569;
            margin-bottom: 0.75rem;
        }

        .tip-row {
            display: flex;
            align-items: center;
            margin-bottom: 0.5rem;

            input {
                flex: 1;
                padding: 0.5rem;
                border: 1px solid #cbd5e1;
                border-radius: 4px;
                font-size: 0.9rem;
            }

            .remove-tip {
                background: none;
                border: none;
                color: #ef4444;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0 0.5rem;
                
                &:hover {
                    color: #b91c1c;
                }
            }
        }

        .add-tip-btn {
            background: none;
            border: none;
            color: var(--color-primary);
            font-size: 0.85rem;
            font-weight: 500;
            cursor: pointer;
            padding: 0.25rem 0;
            margin-top: 0.25rem;

            &:hover {
                text-decoration: underline;
            }
        }
    }

    .actions-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 2rem;
        padding-top: 1.5rem;
        border-top: 1px solid #e0e0e0;

        button {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.2s;
            border: none;
        }

        .add-q-btn {
            background: #f1f5f9;
            color: #334155;
            
            &:hover {
                background: #e2e8f0;
            }
        }

        .save-btn {
            background: var(--color-primary);
            color: white;

            &:hover {
                opacity: 0.9;
            }
            
            &:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
        }
    }
`;

export default CreateInterviewTemplate;
