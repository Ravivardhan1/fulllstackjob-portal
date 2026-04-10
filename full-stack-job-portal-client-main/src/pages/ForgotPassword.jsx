/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import styled from "styled-components";
import Logo from "../components/Logo";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const errs = {};
        if (!email) errs.email = "Email is required";
        if (!newPassword || newPassword.length < 6)
            errs.newPassword = "Password must be at least 6 characters";
        if (newPassword !== confirmPassword)
            errs.confirmPassword = "Passwords do not match";
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }
        setErrors({});
        setIsLoading(true);
        try {
            const response = await axios.post(
                "http://localhost:3000/api/v1/auth/reset-password",
                { email, newPassword }
            );
            if (response.data.status) {
                Swal.fire({
                    icon: "success",
                    title: "Password Reset!",
                    text: response.data.message,
                    confirmButtonColor: "#3b82f6",
                }).then(() => navigate("/login"));
            }
        } catch (error) {
            const errMsg =
                error?.response?.data?.message ||
                "Something went wrong. Please try again.";
            Swal.fire({
                icon: "error",
                title: "Reset Failed",
                text: errMsg,
                confirmButtonColor: "#3b82f6",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Wrapper>
            <div className="container">
                <div className="flex justify-center">
                    <Logo />
                </div>
                <h1>Reset Password</h1>
                <p className="subtitle">
                    Enter your registered email and choose a new password.
                </p>

                <form onSubmit={handleSubmit} autoComplete="off">
                    {/* Email */}
                    <div className="row">
                        <label htmlFor="fp-email">Email Address</label>
                        <input
                            id="fp-email"
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && (
                            <span className="err">{errors.email}</span>
                        )}
                    </div>

                    {/* New Password */}
                    <div className="row">
                        <label htmlFor="fp-new-pass">New Password</label>
                        <input
                            id="fp-new-pass"
                            type="password"
                            placeholder="Min. 6 characters"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        {errors.newPassword && (
                            <span className="err">{errors.newPassword}</span>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="row">
                        <label htmlFor="fp-confirm-pass">Confirm New Password</label>
                        <input
                            id="fp-confirm-pass"
                            type="password"
                            placeholder="Repeat your new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {errors.confirmPassword && (
                            <span className="err">{errors.confirmPassword}</span>
                        )}
                    </div>

                    <div className="flex justify-center">
                        <button type="submit" className="submit-btn" disabled={isLoading}>
                            {isLoading ? "Resetting..." : "Reset Password"}
                        </button>
                    </div>
                </form>

                <p className="back-link">
                    Remembered your password?{" "}
                    <Link to="/login" className="link">
                        Back to Login
                    </Link>
                </p>
            </div>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    width: 100%;
    min-height: 100vh;
    background: #f9faff;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 30px 0;

    .container {
        background: var(--color-white);
        max-width: 380px;
        width: 100%;
        padding: 50px 44px;
        border: 1px solid #e1e2f0;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(42, 45, 48, 0.1);
    }

    h1 {
        margin-top: 20px;
        text-align: center;
        font-size: calc(1rem + 0.5vw);
        font-weight: 700;
        color: var(--color-primary);
    }

    .subtitle {
        text-align: center;
        font-size: 12px;
        color: #64748b;
        margin-top: 6px;
        margin-bottom: 24px;
    }

    form {
        margin-top: 10px;
    }

    .row {
        display: flex;
        flex-direction: column;
        margin-bottom: 18px;
    }

    .row label {
        font-size: 12px;
        color: var(--color-black);
        font-weight: 500;
        margin-bottom: 4px;
    }

    .row input {
        padding: 9px 12px;
        border: 1px solid #d6d8e6;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 500;
        transition: all 0.2s ease-out;
    }

    .row input:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
    }

    .row input::placeholder {
        color: #94a3b8;
    }

    .err {
        font-size: 10px;
        font-weight: 600;
        color: #dc2626;
        margin-top: 4px;
        padding-left: 2px;
        letter-spacing: 0.03em;
    }

    .submit-btn {
        width: 100%;
        padding: 11px;
        font-size: 15px;
        font-weight: 600;
        letter-spacing: 0.5px;
        background: var(--color-accent);
        color: var(--color-white);
        border: none;
        border-radius: 6px;
        cursor: pointer;
        margin-top: 10px;
        transition: background 0.2s ease-out;
    }

    .submit-btn:hover {
        background: var(--color-primary);
    }

    .submit-btn:disabled {
        background: var(--color-gray);
        color: var(--color-black);
        cursor: not-allowed;
    }

    .back-link {
        text-align: center;
        font-size: 11px;
        font-weight: 600;
        margin-top: 20px;
        color: #64748b;
    }

    .back-link .link {
        color: var(--color-primary);
        margin-left: 4px;
    }

    .back-link .link:hover {
        text-decoration: underline;
    }

    @media (max-width: 458px) {
        .container {
            width: 90%;
            padding: 30px 20px;
        }
    }
`;

export default ForgotPassword;
