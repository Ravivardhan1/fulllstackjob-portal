import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Timer from "../../components/MockInterview/Timer";
import QuestionCard from "../../components/MockInterview/QuestionCard";
import AnswerInput from "../../components/MockInterview/AnswerInput";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import Swal from "sweetalert2";
import * as faceapi from "face-api.js";
import { useUserContext } from "../../context/UserContext";

export default function PracticeInterview() {
    const { user } = useUserContext();
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [questions, setQuestions] = useState(location.state?.questions || []);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sessionDuration] = useState(600); // 10 minutes

    // Proctoring Refs
    const videoRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const animationFrameRef = useRef(null);
    const faceIntervalRef = useRef(null);
    const mediaStreamRef = useRef(null);
    const proctoringActiveRef = useRef(false);
    const [warnings, setWarnings] = useState(0);
    // Use refs to avoid stale closures inside intervals
    const warningCountRef = useRef(0);
    const isShowingWarningRef = useRef(false);

    // Draggable proctoring popup state
    const [popupPos, setPopupPos] = useState({ x: 20, y: 20 });
    const dragRef = useRef({ dragging: false, startX: 0, startY: 0, origX: 0, origY: 0 });

    const onDragStart = useCallback((e) => {
        e.preventDefault();
        dragRef.current = {
            dragging: true,
            startX: e.clientX,
            startY: e.clientY,
            origX: popupPos.x,
            origY: popupPos.y
        };
        const onMove = (me) => {
            if (!dragRef.current.dragging) return;
            setPopupPos({
                x: dragRef.current.origX + me.clientX - dragRef.current.startX,
                y: dragRef.current.origY + me.clientY - dragRef.current.startY
            });
        };
        const onUp = () => {
            dragRef.current.dragging = false;
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
    }, [popupPos.x, popupPos.y]);

    useEffect(() => {
        if (user?.role === "recruiter" || user?.role === "admin") {
            return undefined;
        }

        if (questions.length === 0) {
            fetchQuestions();
        }

        // 1. Initialize Proctoring System
        startProctoring();

        // 2. Tab Switching Detection
        const handleVisibilityChange = () => {
            if (document.hidden) {
                triggerWarning("Do not switch tabs!");
            }
        };
        const handlePageLeave = () => {
            stopProctoring();
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("pagehide", handlePageLeave);
        window.addEventListener("beforeunload", handlePageLeave);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("pagehide", handlePageLeave);
            window.removeEventListener("beforeunload", handlePageLeave);
            stopProctoring();
        };
    }, [sessionId, user?.role]);

    const triggerWarning = (reason) => {
        // Block if a warning dialog is already on screen (prevents queuing)
        if (isShowingWarningRef.current) return;
        isShowingWarningRef.current = true;

        warningCountRef.current += 1;
        const newWarnings = warningCountRef.current;
        setWarnings(newWarnings); // sync to state for UI display

        if (newWarnings >= 3) {
            Swal.fire({
                title: "Interview Terminated",
                text: "You have exceeded the maximum number of cheating warnings.",
                icon: "error",
                confirmButtonText: "Return to Dashboard",
                allowOutsideClick: false
            }).then(() => {
                stopProctoring();
                isShowingWarningRef.current = false;
                navigate("/mock-interview");
            });
        } else {
            Swal.fire({
                title: "⚠️ Suspicious Activity Detected!",
                text: `${reason} (Warning ${newWarnings} of 3)`,
                icon: "warning",
                timer: 4000,
                timerProgressBar: true,
                showConfirmButton: true,
                confirmButtonText: "OK"
            }).then(() => {
                isShowingWarningRef.current = false;
            });
        }
    };

    const startProctoring = async () => {
        try {
            proctoringActiveRef.current = true;

            // Load Face API Models
            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.22.2/weights'),
                faceapi.nets.faceLandmark68Net.loadFromUri('https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.22.2/weights')
            ]);
            
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (!proctoringActiveRef.current) {
                stream.getTracks().forEach((track) => track.stop());
                return;
            }

            mediaStreamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            // Face Tracking Interval
            faceIntervalRef.current = setInterval(async () => {
                if (!proctoringActiveRef.current) return;
                // Skip detection if a warning dialog is already visible
                if (isShowingWarningRef.current) return;
                if (videoRef.current && videoRef.current.readyState === 4) {
                    const detections = await faceapi.detectAllFaces(
                        videoRef.current,
                        // inputSize 320 gives much better multi-face accuracy than 160
                        new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.45 })
                    );

                    if (detections.length === 0) {
                        triggerWarning("No face detected. Please look at the screen.");
                    } else if (detections.length > 1) {
                        triggerWarning(`Multiple people detected (${detections.length} faces). Only the candidate should be visible.`);
                    }
                }
            }, 3000);

            // Audio Noise Detection
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContextRef.current = new AudioContext();
            analyserRef.current = audioContextRef.current.createAnalyser();
            const source = audioContextRef.current.createMediaStreamSource(stream);
            source.connect(analyserRef.current);
            analyserRef.current.fftSize = 256;
            const bufferLength = analyserRef.current.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            let loudFrameCount = 0;
            const checkNoiseLevel = () => {
                if (!proctoringActiveRef.current || !analyserRef.current) {
                    return;
                }

                analyserRef.current.getByteFrequencyData(dataArray);
                let sum = 0;
                for (let i = 0; i < bufferLength; i++) {
                    sum += dataArray[i];
                }
                const average = sum / bufferLength;

                // If volume is consistently high, trigger warning
                if (average > 30) {
                    loudFrameCount++;
                    if (loudFrameCount > 100) { // Approx 1.5 seconds of sustained loud noise
                        triggerWarning("Loud background noise detected. Please ensure you are alone.");
                        loudFrameCount = 0; // reset to avoid spamming
                    }
                } else {
                    loudFrameCount = 0;
                }
                animationFrameRef.current = requestAnimationFrame(checkNoiseLevel);
            };
            checkNoiseLevel();

        } catch (err) {
            Swal.fire("Proctoring Failed", "Camera and Microphone permissions are strictly required to take this mock interview.", "error");
        }
    };

    const stopProctoring = () => {
        proctoringActiveRef.current = false;

        if (faceIntervalRef.current) {
            clearInterval(faceIntervalRef.current);
            faceIntervalRef.current = null;
        }

        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }

        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((track) => track.stop());
            mediaStreamRef.current = null;
        }

        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
            videoRef.current.srcObject = null;
        }

        if (audioContextRef.current) {
            audioContextRef.current.close().catch(() => {});
            audioContextRef.current = null;
        }

        analyserRef.current = null;
        isShowingWarningRef.current = false;
    };

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:3000/api/v1/interviews/${sessionId}/questions`,
                { withCredentials: true }
            );
            if (response.data.status) {
                setQuestions(response.data.result.questions);
            }
        } catch (err) {
            // setError("Failed to load questions");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const currentQuestion = questions[currentQuestionIndex];
    const currentAnswer = answers[currentQuestionIndex] || "";

    const handleAnswerChange = (text) => {
        setAnswers({
            ...answers,
            [currentQuestionIndex]: text
        });
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError(null);

            // Format answers for submission
            const submissionAnswers = questions.map((q, idx) => ({
                questionId: q._id,
                userAnswer: answers[idx] || "",
                timeSpent: 120
            }));

            const response = await axios.post(
                "http://localhost:3000/api/v1/interviews/submit",
                {
                    sessionId,
                    answers: submissionAnswers
                },
                { withCredentials: true }
            );

            if (response.data.status) {
                stopProctoring();
                navigate(`/mock-interview/results/${sessionId}`);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to submit answers");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading && questions.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    // ── Recruiter guard — shown BEFORE any camera/proctoring starts ──
    if (user?.role === "recruiter" || user?.role === "admin") {
        return (
            <div style={{
                minHeight: "100vh", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                background: "linear-gradient(135deg, #fef2f2 0%, #fff 100%)"
            }}>
                <div style={{
                    background: "#fff", borderRadius: "16px", padding: "48px 40px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.1)", border: "1px solid #fecaca",
                    maxWidth: "480px", textAlign: "center"
                }}>
                    <div style={{ fontSize: "56px", marginBottom: "16px" }}>🚫</div>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#991b1b", margin: "0 0 12px" }}>
                        Recruiters Cannot Take Interviews
                    </h2>
                    <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "28px", lineHeight: 1.6 }}>
                        This page is only for job candidates. As a recruiter, you can manage interview questions
                        and templates from the Mock Interview section.
                    </p>
                    <button
                        onClick={() => navigate("/mock-interview")}
                        style={{
                            padding: "12px 28px", background: "#3b82f6", color: "#fff",
                            border: "none", borderRadius: "10px", fontWeight: 700,
                            fontSize: "15px", cursor: "pointer"
                        }}
                    >
                        ← Go to Interview Manager
                    </button>
                </div>
            </div>
        );
    }

    if (!currentQuestion) {
        return <div className="text-center py-12">No questions found</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Back Button */}
                <div className="mb-6">
                    <button 
                        onClick={() => {
                            Swal.fire({
                                title: "Exit Mock Interview?",
                                text: "Your progress will be lost.",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonText: "Yes, Exit",
                                cancelButtonText: "Cancel",
                                confirmButtonColor: "#ef4444",
                                cancelButtonColor: "#6b7280"
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    stopProctoring();
                                    navigate("/mock-interview");
                                }
                            });
                        }}
                        className="flex items-center text-gray-700 hover:text-red-600 transition-colors bg-white px-4 py-2 border border-gray-200 rounded-lg shadow-sm w-max"
                    >
                        <FiArrowLeft className="mr-2" /> 
                        Exit Interview
                    </button>
                </div>

                {/* Header with Timer */}
                <div className="mb-8">
                    <Timer duration={sessionDuration} onTimeUp={handleSubmit} />
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-red-700">
                        {error}
                    </div>
                )}

                {/* Question */}
                <QuestionCard
                    questionNumber={currentQuestionIndex + 1}
                    totalQuestions={questions.length}
                    question={currentQuestion.question}
                    difficulty={currentQuestion.difficulty}
                />

                {/* Answer Input */}
                <AnswerInput
                    value={currentAnswer}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    characterCount={currentAnswer.length}
                />

                {/* Tips */}
                {currentQuestion.tips && currentQuestion.tips.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6 mb-6">
                        <p className="font-semibold text-blue-900 mb-2">Tips:</p>
                        <ul className="list-disc list-inside text-blue-800 text-sm">
                            {currentQuestion.tips.map((tip, idx) => (
                                <li key={idx}>{tip}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                    <button
                        onClick={handlePrevious}
                        disabled={currentQuestionIndex === 0}
                        className={`flex items-center px-6 py-2 rounded-lg font-medium transition-colors ${
                            currentQuestionIndex === 0
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                        }`}
                    >
                        <FiArrowLeft className="mr-2" />
                        Previous
                    </button>

                    {currentQuestionIndex === questions.length - 1 ? (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className={`flex items-center px-6 py-2 rounded-lg font-medium text-white transition-colors ${
                                loading
                                    ? "bg-blue-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            {loading ? "Submitting..." : "Submit Interview"}
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="flex items-center px-6 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        >
                            Next
                            <FiArrowRight className="ml-2" />
                        </button>
                    )}
                </div>
            </div>

            {/* Draggable Proctoring Video */}
            <div
                style={{
                    position: 'fixed',
                    left: popupPos.x,
                    top: popupPos.y,
                    zIndex: 9999,
                    userSelect: 'none',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    minWidth: '192px',
                    background: '#111'
                }}
            >
                {/* Drag handle */}
                <div
                    onMouseDown={onDragStart}
                    style={{
                        cursor: 'grab',
                        background: 'linear-gradient(90deg, #1e293b 0%, #0f172a 100%)',
                        padding: '6px 10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid #374151'
                    }}
                >
                    <span style={{ color: '#f87171', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em' }}>
                        ● PROCTORING ACTIVE
                    </span>
                    <span style={{ color: '#9ca3af', fontSize: '11px' }}>⠿ drag</span>
                </div>

                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    style={{
                        width: '192px',
                        height: '144px',
                        objectFit: 'cover',
                        display: 'block',
                        background: '#111',
                        border: '2px solid #ef4444'
                    }}
                />

                <div style={{
                    background: '#1e293b',
                    padding: '4px 10px',
                    textAlign: 'center',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#9ca3af'
                }}>
                    Strikes: <span style={{ color: '#ef4444' }}>{warnings}/3</span>
                </div>
            </div>

        </div>
    );
}
