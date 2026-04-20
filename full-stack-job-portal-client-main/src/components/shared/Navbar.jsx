import styled from "styled-components";
import Logo from "../Logo";
import { NavLink, useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import axios from "axios";
import Swal from "sweetalert2";
import { buildApiUrl } from "../../utils/api";

const Navbar = ({ navbarRef }) => {
    const { user, userLoading, handleFetchMe } = useUserContext();
    const navigate = useNavigate();
    const isLoggedIn = !!user?._id;
    const isRecruiter = user?.role === "recruiter" || user?.role === "admin";

    const handleLogout = async () => {
        try {
            const response = await axios.post(
                buildApiUrl("/auth/logout"),
                {},
                { withCredentials: true }
            );

            await handleFetchMe();
            Swal.fire({
                icon: "success",
                title: "Logged Out",
                text: response?.data?.message || "Logout done",
                confirmButtonColor: "#247BF7",
                timer: 1500,
                showConfirmButton: false,
            });
            navigate("/");
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Logout Failed",
                text: error?.response?.data?.message || error?.response?.data || "Something went wrong",
                confirmButtonColor: "#247BF7",
            });
        }
    };

    return (
        <Wrapper ref={navbarRef}>
            <div className="container">
                <Logo />
                <div className="flex justify-end items-center">
                    <NavLink className="nav-item" to="/all-jobs">
                        Jobs
                    </NavLink>
                    <NavLink className="nav-item hidden sm:block" to="/mock-interview">
                        Mock Interview
                    </NavLink>
                    <NavLink className="nav-item hidden sm:block" to="/dashboard">
                        Dashboard
                    </NavLink>
                    {!userLoading && !isLoggedIn && (
                        <NavLink className="nav-item" to="/login">
                            <span className="bg-[#247BF7] text-white px-6 py-2 rounded">Login</span>
                        </NavLink>
                    )}
                    {!userLoading && isLoggedIn && isRecruiter && (
                        <NavLink className="nav-item" to="/dashboard/add-jobs">
                            <span className="bg-[#247BF7] text-white px-6 py-2 rounded">Post Job</span>
                        </NavLink>
                    )}
                    {!userLoading && isLoggedIn && (
                        <button className="logout-btn" onClick={handleLogout}>
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    box-shadow: 0 5px 5px var(--shadow-light);
    padding: 1rem 0;
    .container {
        width: 100%;
        max-width: 1200px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .container .nav-item {
        font-size: 16px;
        font-weight: 500;
        text-transform: capitalize;
        margin-left: 20px;
        color: var(--color-black);
    }
    .container .nav-item.active {
        color: var(--color-primary);
    }
    .logout-btn {
        margin-left: 20px;
        background: #eef2ff;
        color: #4338ca;
        border: 1px solid #c7d2fe;
        border-radius: 8px;
        padding: 8px 16px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    .logout-btn:hover {
        background: #e0e7ff;
    }
    @media screen and (max-width: 1200px) {
        padding: 1rem 2rem;
    }
    @media screen and (max-width: 600px) {
        padding: 1.2rem 1rem;
        .container {
            display: flex;
        }
    }
`;

export default Navbar;
