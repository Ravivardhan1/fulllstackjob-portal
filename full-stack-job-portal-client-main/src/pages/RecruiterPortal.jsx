import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

const RecruiterPortal = () => {
    const { user, userLoading } = useUserContext();
    const navigate = useNavigate();
    const isCandidate = user?.role === "user";
    const isRecruiter = user?.role === "recruiter" || user?.role === "admin";

    useEffect(() => {
        if (!userLoading && isCandidate) {
            navigate("/", { replace: true });
        }
    }, [isCandidate, navigate, userLoading]);

    const benefits = [
        {
            icon: "Targeted",
            title: "Targeted Reach",
            desc: "Post jobs seen by qualified candidates actively looking for opportunities.",
        },
        {
            icon: "Fast",
            title: "Quick and Easy",
            desc: "Create and publish job listings in minutes from one dashboard.",
        },
        {
            icon: "Smart",
            title: "Smart Dashboard",
            desc: "Track listings, manage applicants, and monitor vacancy performance easily.",
        },
        {
            icon: "Trusted",
            title: "Verified Platform",
            desc: "Get applications from serious job seekers using a trusted platform.",
        },
    ];

    const steps = [
        { num: "01", title: "Register as Recruiter", desc: "Create your recruiter account in under 2 minutes." },
        { num: "02", title: "Log In", desc: "Access your recruiter dashboard with your credentials." },
        { num: "03", title: "Post a Vacancy", desc: "Fill in job details, skills, salary and publish instantly." },
        { num: "04", title: "Get Applications", desc: "Candidates apply and you manage them from your dashboard." },
    ];

    if (!userLoading && isCandidate) {
        return null;
    }

    return (
        <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
            <nav
                style={{
                    background: "#fff",
                    borderBottom: "1px solid #e2e8f0",
                    padding: "1rem 2rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    position: "sticky",
                    top: 0,
                    zIndex: 100,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                }}
            >
                <Link to="/" style={{ textDecoration: "none" }}>
                    <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "#1e293b" }}>
                        Hunter <span style={{ color: "#6366f1" }}>for Recruiters</span>
                    </span>
                </Link>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    {!isRecruiter && (
                        <>
                            <Link
                                to="/login"
                                style={{
                                    padding: "0.5rem 1.2rem",
                                    borderRadius: "8px",
                                    border: "2px solid #6366f1",
                                    color: "#6366f1",
                                    fontWeight: 600,
                                    textDecoration: "none",
                                    fontSize: "0.9rem",
                                }}
                            >
                                Log In
                            </Link>
                            <Link
                                to="/recruiter/register"
                                style={{
                                    padding: "0.5rem 1.2rem",
                                    borderRadius: "8px",
                                    background: "#6366f1",
                                    color: "#fff",
                                    fontWeight: 600,
                                    textDecoration: "none",
                                    fontSize: "0.9rem",
                                }}
                            >
                                Register Free
                            </Link>
                        </>
                    )}
                    {isRecruiter && (
                        <Link
                            to="/dashboard/add-jobs"
                            style={{
                                padding: "0.5rem 1.2rem",
                                borderRadius: "8px",
                                background: "#6366f1",
                                color: "#fff",
                                fontWeight: 600,
                                textDecoration: "none",
                                fontSize: "0.9rem",
                            }}
                        >
                            Go to Recruiter Dashboard
                        </Link>
                    )}
                </div>
            </nav>

            <section
                style={{
                    background: "linear-gradient(135deg, #1e293b 0%, #312e81 100%)",
                    color: "#fff",
                    padding: "5rem 2rem",
                    textAlign: "center",
                }}
            >
                <div style={{ maxWidth: "700px", margin: "0 auto" }}>
                    <span
                        style={{
                            background: "rgba(99,102,241,0.3)",
                            padding: "0.3rem 1rem",
                            borderRadius: "999px",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            color: "#a5b4fc",
                            letterSpacing: "0.05em",
                            display: "inline-block",
                            marginBottom: "1.5rem",
                        }}
                    >
                        RECRUITER PORTAL
                    </span>
                    <h1
                        style={{
                            fontSize: "clamp(2rem, 5vw, 3.5rem)",
                            fontWeight: 800,
                            lineHeight: 1.2,
                            marginBottom: "1.5rem",
                        }}
                    >
                        Find the <span style={{ color: "#a5b4fc" }}>Best Talent</span> for Your Company
                    </h1>
                    <p style={{ fontSize: "1.15rem", color: "#cbd5e1", marginBottom: "2.5rem", lineHeight: 1.7 }}>
                        Post your job vacancies, attract qualified candidates, and hire faster. Join hundreds of
                        companies already hiring on Hunter.
                    </p>
                    <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                        {!isRecruiter && (
                            <>
                                <Link
                                    to="/recruiter/register"
                                    style={{
                                        padding: "0.9rem 2.5rem",
                                        borderRadius: "10px",
                                        background: "#6366f1",
                                        color: "#fff",
                                        fontWeight: 700,
                                        textDecoration: "none",
                                        fontSize: "1rem",
                                        boxShadow: "0 4px 15px rgba(99,102,241,0.4)",
                                    }}
                                >
                                    Register as Recruiter - Free
                                </Link>
                                <Link
                                    to="/login"
                                    style={{
                                        padding: "0.9rem 2.5rem",
                                        borderRadius: "10px",
                                        border: "2px solid rgba(255,255,255,0.3)",
                                        color: "#fff",
                                        fontWeight: 700,
                                        textDecoration: "none",
                                        fontSize: "1rem",
                                    }}
                                >
                                    Already have an account? Log In
                                </Link>
                            </>
                        )}
                        {isRecruiter && (
                            <Link
                                to="/dashboard/add-jobs"
                                style={{
                                    padding: "0.9rem 2.5rem",
                                    borderRadius: "10px",
                                    background: "#6366f1",
                                    color: "#fff",
                                    fontWeight: 700,
                                    textDecoration: "none",
                                    fontSize: "1rem",
                                    boxShadow: "0 4px 15px rgba(99,102,241,0.4)",
                                }}
                            >
                                Open Recruiter Dashboard
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            <section
                style={{
                    background: "#6366f1",
                    padding: "2rem",
                    display: "flex",
                    justifyContent: "center",
                    gap: "4rem",
                    flexWrap: "wrap",
                }}
            >
                {[
                    { num: "10,000+", label: "Active Candidates" },
                    { num: "Free", label: "Job Posting" },
                    { num: "24/7", label: "Platform Access" },
                    { num: "Fast", label: "Easy Setup" },
                ].map((s, i) => (
                    <div key={i} style={{ textAlign: "center", color: "#fff" }}>
                        <div style={{ fontSize: "1.8rem", fontWeight: 800 }}>{s.num}</div>
                        <div style={{ fontSize: "0.85rem", color: "#c7d2fe" }}>{s.label}</div>
                    </div>
                ))}
            </section>

            <section style={{ padding: "5rem 2rem", maxWidth: "1100px", margin: "0 auto" }}>
                <h2
                    style={{
                        textAlign: "center",
                        fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                        fontWeight: 800,
                        color: "#1e293b",
                        marginBottom: "3rem",
                    }}
                >
                    Why Post Jobs on Hunter?
                </h2>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
                        gap: "1.5rem",
                    }}
                >
                    {benefits.map((b, i) => (
                        <div
                            key={i}
                            style={{
                                background: "#fff",
                                borderRadius: "16px",
                                padding: "2rem",
                                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                                border: "1px solid #e2e8f0",
                            }}
                        >
                            <div style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", color: "#6366f1" }}>
                                {b.icon}
                            </div>
                            <h3 style={{ fontWeight: 700, color: "#1e293b", marginBottom: "0.5rem" }}>{b.title}</h3>
                            <p style={{ color: "#64748b", lineHeight: 1.6, fontSize: "0.9rem" }}>{b.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section style={{ background: "#f1f5f9", padding: "5rem 2rem" }}>
                <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                    <h2
                        style={{
                            textAlign: "center",
                            fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                            fontWeight: 800,
                            color: "#1e293b",
                            marginBottom: "3rem",
                        }}
                    >
                        How It Works
                    </h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem" }}>
                        {steps.map((s, i) => (
                            <div key={i} style={{ textAlign: "center" }}>
                                <div
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        borderRadius: "50%",
                                        background: "#6366f1",
                                        color: "#fff",
                                        fontWeight: 800,
                                        fontSize: "1rem",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        margin: "0 auto 1rem",
                                    }}
                                >
                                    {s.num}
                                </div>
                                <h3 style={{ fontWeight: 700, color: "#1e293b", marginBottom: "0.5rem", fontSize: "1rem" }}>
                                    {s.title}
                                </h3>
                                <p style={{ color: "#64748b", fontSize: "0.88rem", lineHeight: 1.6 }}>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section style={{ padding: "5rem 2rem", textAlign: "center", background: "linear-gradient(135deg, #312e81 0%, #1e293b 100%)" }}>
                <h2
                    style={{
                        fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                        fontWeight: 800,
                        color: "#fff",
                        marginBottom: "1rem",
                    }}
                >
                    Ready to Find Your Next Hire?
                </h2>
                <p style={{ color: "#cbd5e1", marginBottom: "2rem", fontSize: "1.05rem" }}>
                    Create your recruiter account and post your first vacancy today.
                </p>
                {!isRecruiter && (
                    <Link
                        to="/recruiter/register"
                        style={{
                            padding: "1rem 3rem",
                            borderRadius: "10px",
                            background: "#6366f1",
                            color: "#fff",
                            fontWeight: 700,
                            textDecoration: "none",
                            fontSize: "1.05rem",
                            boxShadow: "0 4px 20px rgba(99,102,241,0.5)",
                            display: "inline-block",
                        }}
                    >
                        Get Started for Free
                    </Link>
                )}
                {isRecruiter && (
                    <Link
                        to="/dashboard/add-jobs"
                        style={{
                            padding: "1rem 3rem",
                            borderRadius: "10px",
                            background: "#6366f1",
                            color: "#fff",
                            fontWeight: 700,
                            textDecoration: "none",
                            fontSize: "1.05rem",
                            boxShadow: "0 4px 20px rgba(99,102,241,0.5)",
                            display: "inline-block",
                        }}
                    >
                        Go to Dashboard
                    </Link>
                )}
            </section>

            <footer style={{ background: "#0f172a", color: "#94a3b8", textAlign: "center", padding: "1.5rem", fontSize: "0.85rem" }}>
                © {new Date().getFullYear()} Hunter Job Portal - Recruiter Portal |{" "}
                <Link to="/" style={{ color: "#a5b4fc", textDecoration: "none" }}>
                    Go to Main Site
                </Link>
            </footer>
        </div>
    );
};

export default RecruiterPortal;
