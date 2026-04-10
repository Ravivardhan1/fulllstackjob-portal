import React, { useEffect, useRef } from "react";
import Wrapper from "../assets/css/wrappers/LandingPage";
import { Link } from "react-router-dom";
import photo from "../assets/media/LandingPage/hero.png";
import Navbar from "../components/shared/Navbar";
import PopularCategory from "../components/Home Page/PopularCategory";
import HowWorks from "../components/Home Page/HowWorks";
import Team from "../components/Home Page/Team";
import Brands from "../components/Home Page/Brands";
import Testimonial from "../components/Home Page/Testimonial";
import { useUserContext } from "../context/UserContext";

const Landing = () => {
    const navbarRef = useRef(null);
    const heroRef = useRef(null);
    const { user } = useUserContext();
    const showRecruiterBanner = user?.role !== "user";
    const isRecruiter = user?.role === "recruiter" || user?.role === "admin";

    useEffect(() => {
        const navbarHeight = navbarRef.current.getBoundingClientRect().height;
        heroRef.current.style.minHeight = `calc(100vh - ${navbarHeight}px)`;
    }, []);

    return (
        <>
            <Navbar navbarRef={navbarRef} />
            <Wrapper ref={heroRef}>
                <div className="hero-content">
                    <div className="text-content">
                        <h1>
                            Get Your <span className="fancy">Dream Job </span>
                            Today!
                        </h1>
                        <p>
                            Discover endless career opportunities with our Job Portal. Whether you are
                            looking for your first job, a career change, or top talent for your company,
                            we connect professionals with the best opportunities to shape the future.
                            Join us and take the next step in your professional journey today.
                        </p>
                        <div className="btn-grp">
                            {!isRecruiter && (
                                <Link className="btn" to="/all-jobs">
                                    Apply Now
                                </Link>
                            )}
                            {isRecruiter && (
                                <Link className="btn" to="/dashboard/add-jobs">
                                    Post Job
                                </Link>
                            )}
                        </div>
                    </div>
                    <div className="placeholder">
                        <img src={photo} alt="job viva photo" />
                    </div>
                </div>
            </Wrapper>
            <div>
                <PopularCategory />

                {showRecruiterBanner && (
                    <div
                        style={{
                            background: "linear-gradient(135deg, #1e293b 0%, #312e81 100%)",
                            padding: "3rem 2rem",
                            textAlign: "center",
                            margin: "2rem 0",
                        }}
                    >
                        <p
                            style={{
                                color: "#a5b4fc",
                                fontWeight: 600,
                                fontSize: "0.85rem",
                                letterSpacing: "0.05em",
                                marginBottom: "0.75rem",
                            }}
                        >
                            FOR COMPANIES AND RECRUITERS
                        </p>
                        <h2
                            style={{
                                color: "#fff",
                                fontSize: "clamp(1.4rem, 3vw, 2rem)",
                                fontWeight: 800,
                                marginBottom: "0.75rem",
                            }}
                        >
                            Want to Post a Job Vacancy?
                        </h2>
                        <p
                            style={{
                                color: "#cbd5e1",
                                marginBottom: "1.5rem",
                                fontSize: "1rem",
                            }}
                        >
                            Register as a recruiter and post vacancies to thousands of qualified
                            candidates completely free.
                        </p>
                        <Link
                            to="/recruiter"
                            style={{
                                display: "inline-block",
                                padding: "0.75rem 2rem",
                                borderRadius: "8px",
                                background: "#6366f1",
                                color: "#fff",
                                fontWeight: 700,
                                textDecoration: "none",
                                fontSize: "0.95rem",
                                boxShadow: "0 4px 15px rgba(99,102,241,0.4)",
                            }}
                        >
                            Post a Job
                        </Link>
                    </div>
                )}

                <HowWorks />
                <Team />
                <Testimonial />
                <Brands />
            </div>
        </>
    );
};

export default Landing;
