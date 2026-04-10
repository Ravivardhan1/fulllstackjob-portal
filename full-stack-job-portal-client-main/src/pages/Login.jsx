/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import styled from "styled-components";
import Logo from "../components/Logo";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import { useUserContext } from "../context/UserContext";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

const Login = () => {
    const { handleFetchMe } = useUserContext();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const [isLoading, setIsLoading] = useState(false);
    const [loginRole, setLoginRole] = useState("user"); // "user" or "recruiter"

    let navigate = useNavigate();
    let location = useLocation();
    let from = location.state?.from?.pathname || "/"; // to navigate right location after login

    const onSubmit = async (data) => {
        setIsLoading(true);
        // password: A@1abcde

        // posting
        try {
            const response = await axios.post(
                `${API_BASE_URL}/auth/login`,
                data,
                {
                    withCredentials: true,
                }
            );
            const actualRole = response?.data?.role;

            // Block if someone selects Employer tab but isn't a recruiter/admin
            if (loginRole === "recruiter" && actualRole !== "recruiter" && actualRole !== "admin") {
                Swal.fire({
                    icon: "error",
                    title: "Access Denied",
                    text: "This account is not registered as an Employer/Recruiter.",
                    confirmButtonColor: "#3b82f6",
                });
                return;
            }

            // Block if a recruiter tries to log in on the Candidate tab
            if (loginRole === "user" && actualRole === "recruiter") {
                Swal.fire({
                    icon: "error",
                    title: "Access Denied",
                    text: "This account is registered as an Employer. Please use the Employer tab to log in.",
                    confirmButtonColor: "#3b82f6",
                });
                return;
            }

            // Role validated — show welcome and proceed
            Swal.fire({
                icon: "success",
                title: "Welcome Back!",
                text: response?.data?.message,
                confirmButtonColor: "#3b82f6",
                timer: 1500,
                showConfirmButton: false,
            });
            await handleFetchMe();

            // Redirect based on the tab the user selected
            if (loginRole === "recruiter") {
                navigate("/dashboard/add-jobs");
            } else {
                navigate("/");
            }
            reset();
        } catch (error) {
            const errMsg = error?.response?.data?.message || error?.response?.data || "Something went wrong. Please try again.";
            Swal.fire({
                icon: "error",
                title: "Login Failed",
                text: errMsg,
                confirmButtonColor: "#3b82f6",
            });
        }
        setIsLoading(false);
    };

    return (
        <Wrapper>
            <div className="container">
                <div className="flex justify-center">
                    <Logo />
                </div>
                <h1>Login</h1>
                
                {/* Role Toggle Tabs */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '25px', marginTop: '15px', gap: '10px' }}>
                    <button 
                        type="button" 
                        onClick={() => setLoginRole("user")}
                        style={loginRole === "user" ? activeTabStyle : inactiveTabStyle}
                    >
                        Candidate
                    </button>
                    <button 
                        type="button" 
                        onClick={() => setLoginRole("recruiter")}
                        style={loginRole === "recruiter" ? activeTabStyle : inactiveTabStyle}
                    >
                        Employer
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                    <div className="row">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email@example.com"
                            {...register("email", {
                                required: {
                                    value: true,
                                    message: "A valid email is required",
                                },
                            })}
                        />
                        {errors?.email && (
                            <span className="text-[10px] font-semibold text-red-600 mt-1 pl-1 tracking-wider">
                                {errors?.email?.message}
                            </span>
                        )}
                    </div>
                    <div className="row">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Type Here"
                            {...register("password", {
                                required: {
                                    value: true,
                                    message: "Password is required",
                                },
                            })}
                        />
                        {errors?.password && (
                            <span className="text-[10px] font-semibold text-red-600 mt-1 pl-1 tracking-wider">
                                {errors?.password?.message}
                            </span>
                        )}
                    </div>
                    {/* Forgot Password Link */}
                    <div style={{ textAlign: 'right', marginTop: '-12px', marginBottom: '10px' }}>
                        <Link
                            to="/forgot-password"
                            style={{ fontSize: '11px', color: '#3b82f6', fontWeight: 600, textDecoration: 'none' }}
                            onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                            onMouseLeave={e => e.target.style.textDecoration = 'none'}
                        >
                            Forgot Password?
                        </Link>
                    </div>
                    <div className="flex justify-center">
                        <button type="submit" className="submit-btn" disabled={isLoading}>
                            {isLoading ? "Loading..." : `Login as ${loginRole === 'recruiter' ? 'Employer' : 'Candidate'}`}
                        </button>
                    </div>
                </form>
                <div className="">
                    <p className="text-center text-[11px] font-semibold opacity-9 mt-4">
                        Don't have an account? 
                        {loginRole === "recruiter" ? (
                            <Link className="ml-1 link" to="/recruiter/register">
                                Register as Employer
                            </Link>
                        ) : (
                            <Link className="ml-1 link" to="/register">
                                Create Candidate Account
                            </Link>
                        )}
                    </p>
                </div>
            </div>
        </Wrapper>
    );
};

const activeTabStyle = {
    padding: "8px 16px",
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    margin: "0"
};

const inactiveTabStyle = {
    padding: "8px 16px",
    background: "#f1f5f9",
    color: "#64748b",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "13px",
    margin: "0"
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
        max-width: 360px;
        width: 100%;
        padding: 58px 44px;
        border: 1px solid #e1e2f0;
        border-radius: 4px;
        box-shadow: 0 0 5px 0 rgba(42, 45, 48, 0.12);
        transition: all 0.3s ease;
    }
    h1 {
        margin-top: 20px;
        text-align: center;
        text-transform: capitalize;
        font-size: calc(1rem + 0.5vw);
        font-weight: 600;
        color: var(--color-primary);
    }
    form {
        margin-top: calc(1rem + 0.9vw);
    }

    .row {
        display: flex;
        flex-direction: column;
        margin-bottom: 20px;
    }

    .row label {
        font-size: 12px;
        color: var(--color-black);
        font-weight: 400;
        margin-bottom: 2px;
    }

    .row input {
        flex: 1;
        padding: 8px 10px;
        border: 1px solid #d6d8e6;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
        transition: all 0.2s ease-out;
    }

    .row input:focus {
        outline: none;
        box-shadow: inset 2px 2px 5px 0 rgba(42, 45, 48, 0.12);
    }

    .row input::placeholder {
        color: var(--color-black);
        opacity: 0.7;
    }

    .submit-btn {
        width: 100%;
        min-width: 90px;
        padding: 10px;
        font-size: 15px;
        font-weight: 600;
        letter-spacing: 1px;
        background: var(--color-accent);
        color: var(--color-white);
        border: none;
        border-radius: 6px;
        cursor: pointer;
        margin: 15px auto 0;
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

    @media (max-width: 458px) {
        .container {
            width: 90%;
            padding: 30px 0;
        }
        form {
            padding: 0 20px;
        }
    }
    p .link {
        text-transform: capitalize;
        color: var(--color-primary);
    }
    p .link:hover {
        text-decoration: underline;
    }
`;

export default Login;
