# 🎓 Final Year Project: Full-Stack Job Portal with AI Mock Interviews
## Comprehensive Project Report & Technical Overview

---

## 📋 Executive Summary

This project is a **comprehensive, production-ready full-stack web application** designed to fundamentally bridge the gap between job seekers and employers. Built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js), it goes beyond traditional job portals by integrating **Generative Artificial Intelligence (AI)** to help candidates practice and prepare for technical interviews. The platform features strict role-based access control, secure local file uploading capabilities for resumes, and an intelligent interactive mock interview engine.

---

## 🎯 Project Objectives

1. Create a centralized, highly secure platform for job listings, resumes, and applications.
2. Implement strict role-based access control (RBAC) preventing unauthorized access across Admin, Recruiter, and Job Seeker portals.
3. Integrate advanced **Generative AI** to act as a dynamic technical interviewer for candidates.
4. Establish a secure `multipart/form-data` pipeline to allow candidates to natively upload physical PDF/DOCX resumes to the server.
5. Provide recruiters with a streamlined dashboard to instantly view uploaded applicant resumes and manage job postings.
6. Ensure robust data protection using HTTP-only JSON Web Tokens (JWT) for authentication.

---

## 🛠️ Technology Stack

### **Frontend Frameworks & Libraries**
| Technology | Purpose in Project |
|-----------|---------|
| **React.js 18** | Core UI library for building dynamic, interactive user interfaces |
| **React Router DOM** | Client-side routing specifically used to render different Dashboard Layouts based on user roles |
| **Tailwind CSS / Styled Components** | Utility-first and component-scoped CSS for a highly responsive, modern aesthetic |
| **React Query (TanStack)** | Server state management, data fetching, and automated caching |
| **Axios** | Handling HTTP REST API requests to the Node.js backend |
| **React Hook Form** | Efficient un-controlled form state management and error handling |

### **Backend Frameworks & APIs**
| Technology | Purpose in Project |
|-----------|---------|
| **Node.js & Express.js** | Server environment and web framework powering our internal RESTful APIs |
| **MongoDB Atlas** | Cloud-based NoSQL database for highly scalable data persistence |
| **Mongoose ODM** | Object Data Modeling to enforce strict Schemas and relational data mapping (`.populate()`) |
| **Google Gemini API** | External 3rd-Party LLM API (`@google/genai`) used to dynamically generate mock interview questions and grade candidate answers |
| **Multer** | Middleware for handling physical file uploads (intercepting candidate PDF resumes) |
| **JWT & Bcrypt** | Generating secure authentication tokens and hashing passwords |

---

## 💻 Frontend Architecture & Implementation

### **Role-Based Dashboards & Routing**
We built a highly dynamic routing system. Depending on whether the user logs in as a Candidate, Recruiter, or Admin, the exact same URL (`/dashboard`) dynamically renders completely different navigation sidebars and components to enforce security.

### **State Management & Data Fetching**
We utilized standard React Hooks alongside `Context API` (UserContext, JobContext) to wrap the entire application and securely distribute the user's logged-in state without "prop drilling". Furthermore, we integrated **React Query** to seamlessly handle asynchronous data fetching, loading states, and caching when retrieving thousands of job listings from the backend.

### **Candidate Application System**
The frontend utilizes a customized application flow. When a candidate edits their profile, they interact with a `<input type="file">`. Submitting this form sends binary data via `FormData` to the backend. When applying for a job, a single click of the "Apply Now" button cross-references the candidate's uploaded resume with the job ID and instantly submits the application.

---

## ⚙️ Backend Architecture & Database

### **MVC (Model-View-Controller) Pattern**
The Node/Express backend was constructed strictly adhering to the MVC pattern, completely separating our business logic (Controllers) from our API endpoints (Routers) and database schemas (Models). 

### **The File Upload Pipeline**
To handle candidate resumes, we engineered a dedicated binary upload pipeline. Using the **Multer** library, the backend intercepts incoming `multipart/form-data` requests. When a user uploads a PDF, the Node server extracts the file, generates a highly unique cryptographic timestamp for the filename, saves it securely to a local `public/uploads/resumes` directory, and serves it statically to the recruiting frontend.

### **Authentication Security**
When a user logs in, the backend generates a secure **JSON Web Token (JWT)**. Instead of sending this back as vulnerable plain text, it is injected directly into a secure, HTTP-only Cookie. This mechanism guarantees that the client’s browser remembers the session on every request, providing enterprise-grade protection against Cross-Site Scripting (XSS).

### **Database Relational Mapping**
Using **MongoDB Atlas** and **Mongoose**, we mapped complex relational data natively in NoSQL. By leveraging Mongoose's `.populate()` method, the backend seamlessly joins data collections. For example, when a Recruiter checks their job applicants, the database automatically fetches the candidate's profile data, email, and their uploaded Resume URL through strict `ObjectId` mapping.

---

## 🤖 AI Integration (The Mock Interview Engine)

To elevate this project beyond a standard CRUD application, we integrated a sophisticated **AI Mock Interview Engine**.

### **How the Integration Works:**
1. **The API Connection:** We connected to the **Google Gemini Generative AI API**.
2. **Dynamic Prompting:** When a candidate selects a mock interview category (e.g., "MERN Stack Developer"), our Node.js backend dynamically constructs a highly specific conversational "prompt". We send this over an encrypted HTTPS connection to Google's Language Models.
3. **AI Interviewer Generation:** The Gemini LLM assumes the persona of a Senior Software Engineer. It processes our prompt and returns 5 highly targeted technical questions, formatted strictly in JSON.
4. **Grading & Feedback:** When the candidate types or speaks their answer to a question, our server intercepts the response, wraps it in an evaluation prompt, and queries the Gemini API again. The AI analyzes the candidate's technical accuracy, returns a score out of 10, provides personalized constructive criticism, and outlines the "ideal answer."

---

## 🔄 Complete Project Workflow

### **1. The Employer (Recruiter) Flow**
- A Recruiter registers securely via the backend authentication routes.
- They access their dedicated Dashboard and post a "New Job Vacancy".
- The Node.js server validates the input and saves the listing to the MongoDB `Jobs` collection.

### **2. The Job Seeker (Candidate) Flow**
- A Candidate registers securely and navigates to `Edit Profile`.
- They upload their physical PDF resume. The Multer middleware captures the file, saves it to the static storage directory, and saves the file's generated URL string directly into the Candidate's MongoDB document.
- The Candidate utilizes the AI Mock Interview system to practice technical questions and improve their skills based on automated AI feedback.

### **3. The Application Tracking Flow**
- The Candidate browses jobs and clicks **"Apply Now"**. 
- The backend `ApplicationRoute` links the Applicant's `ObjectId`, the Job's `ObjectId`, and the Candidate's securely hosted Resume URL into a new `Application` document.
- The Recruiter logs back in, navigates to "Manage Applications", and instantly tracks all candidates. Clicking "View Resume" seamlessly serves the securely hosted PDF natively in the recruiter's browser.

---

## 🚀 Project Outcomes

1. **Centralized Job Hub:** Successfully created a secure, unified platform where companies can post job listings and candidates can apply concurrently.
2. **AI-Driven Skill Development:** Elevated the platform beyond a traditional job board by empowering candidates to practice and improve their technical interview skills autonomously using Generative AI.
3. **Streamlined ATS System:** Provided recruiters with a minimal-friction Applicant Tracking System (ATS) dashboard to instantly organize incoming applications and review physical candidate resumes.
4. **Advanced File Management:** Successfully engineered a secure `multipart/form-data` pipeline capable of intercepting, cryptographically renaming, and locally serving user-uploaded PDF/DOCX resume files.
5. **Strict Role-Based Security:** Guaranteed robust data isolation and protected API routing using JWT HTTP-only Cookies, strictly segregating Admin, Candidate, and Recruiter privileges.
6. **Production-Ready Architecture:** Demonstrated mastery of the MERN stack by fully separating Express backend business logic (MVC) from the modular React.js frontend UI components.
7. **Automated Asynchronous Caching:** Improved frontend performance dramatically by implementing TanStack React Query to fetch, cache, and sync large volumes of job listing data seamlessly without manual refreshes.
