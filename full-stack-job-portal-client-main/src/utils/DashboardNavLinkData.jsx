import React from "react";

import { IoIosStats } from "react-icons/io";
import { RiMenuAddFill } from "react-icons/ri";
import { FiUser } from "react-icons/fi";
import { FaUserShield } from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";
import { FaBriefcase } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import { BiMicrophone } from "react-icons/bi";

const AdminLinks = [
    {
        text: "profile",
        path: ".",
        icon: <FiUser />,
    },
    {
        text: "mock interview",
        path: "/mock-interview",
        icon: <BiMicrophone />,
    },
    {
        text: "stats",
        path: "stats",
        icon: <IoIosStats />,
    },
    {
        text: "admin",
        path: "admin",
        icon: <FaUserShield />,
    },
    {
        text: "manage users",
        path: "manage-users",
        icon: <FaUsers />,
    },
    {
        text: "manage jobs",
        path: "manage-jobs",
        icon: <MdManageAccounts />,
    },
    {
        text: "applications",
        path: "my-jobs",
        icon: <FaBriefcase />,
    },
];

const RecruiterLinks = [
    {
        text: "profile",
        path: ".",
        icon: <FiUser />,
    },
    {
        text: "mock interview",
        path: "/mock-interview",
        icon: <BiMicrophone />,
    },
    {
        text: "add job",
        path: "add-jobs",
        icon: <RiMenuAddFill />,
    },
    {
        text: "manage jobs",
        path: "manage-jobs",
        icon: <MdManageAccounts />,
    },
    {
        text: "Applications",
        path: "my-jobs",
        icon: <FaBriefcase />,
    },
];

const UserLinks = [
    {
        text: "profile",
        path: ".",
        icon: <FiUser />,
    },
    {
        text: "mock interview",
        path: "/mock-interview",
        icon: <BiMicrophone />,
    },
    {
        text: "all jobs",
        path: "/all-jobs",
        icon: <FaBriefcase />,
    },
    {
        text: "Applications",
        path: "my-jobs",
        icon: <FaBriefcase />,
    },
];

export { AdminLinks, RecruiterLinks, UserLinks };
