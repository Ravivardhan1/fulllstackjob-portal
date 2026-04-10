import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const RecruiterRegister = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        companyName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const validate = () => {
        if (!form.companyName.trim()) return "Company name is required";
        if (!form.username.trim()) return "Your name is required";
        if (!form.email.trim()) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(form.email)) return "Please enter a valid email";
        if (form.password.length < 8) return "Password must be at least 8 characters";
        if (form.password !== form.confirmPassword) return "Passwords do not match";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validate();
        if (validationError) { setError(validationError); return; }

        setLoading(true);
        try {
            await axios.post("http://localhost:3000/api/v1/auth/recruiter-register", {
                username: form.username,
                companyName: form.companyName,
                email: form.email,
                password: form.password,
            });
            setSuccess(true);
        } catch (err) {
            const resData = err?.response?.data;
            const errMsg = resData?.message || resData?.error?.[0]?.msg || (typeof resData === 'string' ? resData : (err?.message || "Registration failed. Please try again."));
            setError(errMsg);
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: "100%",
        padding: "0.75rem 1rem",
        borderRadius: "8px",
        border: "1.5px solid #e2e8f0",
        fontSize: "0.95rem",
        outline: "none",
        boxSizing: "border-box",
        marginTop: "0.4rem",
        transition: "border-color 0.2s",
        fontFamily: "inherit",
    };

    const labelStyle = {
        fontWeight: 600,
        fontSize: "0.875rem",
        color: "#374151",
    };

    if (success) {
        return (
            <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif" }}>
                <div style={{ background: "#fff", borderRadius: "20px", padding: "3rem 2.5rem", maxWidth: "420px", width: "100%", textAlign: "center", boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}>
                    <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎉</div>
                    <h2 style={{ fontWeight: 800, color: "#1e293b", marginBottom: "0.75rem" }}>Account Created!</h2>
                    <p style={{ color: "#64748b", marginBottom: "2rem", lineHeight: 1.6 }}>
                        Your recruiter account has been created successfully. Log in to start posting jobs!
                    </p>
                    <Link to="/login" style={{
                        display: "block",
                        padding: "0.85rem",
                        borderRadius: "10px",
                        background: "#6366f1",
                        color: "#fff",
                        fontWeight: 700,
                        textDecoration: "none",
                        fontSize: "1rem"
                    }}>
                        Go to Login →
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #1e293b 0%, #312e81 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", fontFamily: "'Segoe UI', sans-serif" }}>
            <div style={{ background: "#fff", borderRadius: "20px", padding: "2.5rem", maxWidth: "480px", width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>

                {/* Header */}
                <div style={{ marginBottom: "2rem" }}>
                    <Link to="/recruiter" style={{ textDecoration: "none", color: "#6366f1", fontSize: "0.875rem", fontWeight: 600 }}>
                        ← Back to Recruiter Portal
                    </Link>
                    <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#1e293b", marginTop: "1rem", marginBottom: "0.3rem" }}>
                        Register as Recruiter
                    </h1>
                    <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
                        Create your free account and start posting jobs today
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "8px", padding: "0.75rem 1rem", color: "#dc2626", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Company Name */}
                    <div style={{ marginBottom: "1.25rem" }}>
                        <label style={labelStyle}>Company Name *</label>
                        <input
                            type="text"
                            name="companyName"
                            placeholder="e.g. Google, TCS, Your Startup"
                            value={form.companyName}
                            onChange={handleChange}
                            style={inputStyle}
                            required
                        />
                    </div>

                    {/* Your Name */}
                    <div style={{ marginBottom: "1.25rem" }}>
                        <label style={labelStyle}>Your Full Name *</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="e.g. Ravi Kumar"
                            value={form.username}
                            onChange={handleChange}
                            style={inputStyle}
                            required
                        />
                    </div>

                    {/* Email */}
                    <div style={{ marginBottom: "1.25rem" }}>
                        <label style={labelStyle}>Work Email *</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="you@company.com"
                            value={form.email}
                            onChange={handleChange}
                            style={inputStyle}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: "1.25rem" }}>
                        <label style={labelStyle}>Password *</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Minimum 8 characters"
                            value={form.password}
                            onChange={handleChange}
                            style={inputStyle}
                            required
                        />
                    </div>

                    {/* Confirm Password */}
                    <div style={{ marginBottom: "1.75rem" }}>
                        <label style={labelStyle}>Confirm Password *</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Re-enter your password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            style={inputStyle}
                            required
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "0.9rem",
                            borderRadius: "10px",
                            background: loading ? "#94a3b8" : "#6366f1",
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: "1rem",
                            border: "none",
                            cursor: loading ? "not-allowed" : "pointer",
                            transition: "background 0.2s",
                            fontFamily: "inherit"
                        }}
                    >
                        {loading ? "Creating Account..." : "Create Recruiter Account →"}
                    </button>
                </form>

                <p style={{ textAlign: "center", marginTop: "1.5rem", color: "#64748b", fontSize: "0.875rem" }}>
                    Already have an account?{" "}
                    <Link to="/login" style={{ color: "#6366f1", fontWeight: 600, textDecoration: "none" }}>
                        Log In
                    </Link>
                </p>

                <p style={{ textAlign: "center", marginTop: "0.5rem", fontSize: "0.8rem", color: "#94a3b8" }}>
                    Looking for a job instead?{" "}
                    <Link to="/register" style={{ color: "#94a3b8", textDecoration: "underline" }}>
                        Register as Candidate
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RecruiterRegister;
