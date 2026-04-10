# Full Stack Job Portal - Backend Technical Report

**Project Name:** Full Stack Job Portal  
**Technology Stack:** Node.js, Express.js, MongoDB  
**Author:** [Your Name]  
**Date:** March 2026  
**Purpose:** College Project Submission  

---

## 📋 Table of Contents
1. [Executive Summary](#executive-summary)
2. [Project Overview](#project-overview)
3. [Technology Stack & Architecture](#technology-stack--architecture)
4. [Database Design](#database-design)
5. [System Architecture & Design Patterns](#system-architecture--design-patterns)
6. [API Endpoints Documentation](#api-endpoints-documentation)
7. [Key Features & Implementation](#key-features--implementation)
8. [Security & Authentication](#security--authentication)
9. [Validation & Error Handling](#validation--error-handling)
10. [Deployment & Configuration](#deployment--configuration)
11. [Viva Voice Q&A Guide](#viva-voice-qa-guide)

---

## Executive Summary

This backend is a **RESTful API server** built with **Node.js and Express.js** that powers a comprehensive job portal application. It provides robust functionality for job seekers, recruiters, and administrators including:

- **User Authentication & Authorization** with JWT tokens
- **Job Management** (create, read, update, delete jobs)
- **Application Tracking** (apply for jobs, track applications)
- **User Profiles** (resume upload, profile management)
- **Admin Dashboard** (user management, job moderation)
- **Mock Interview Module** (practice interviews with AI feedback)
- **Role-Based Access Control** (user, recruiter, admin roles)

**Key Statistics:**
- ✅ 5 Main Controllers for different functionalities
- ✅ 7 MongoDB Schemas for data management
- ✅ 6 API Route Modules
- ✅ 2 Custom Middleware layers
- ✅ 3 User Roles with role-based access
- ✅ JWT-based authentication system

---

## Project Overview

### Purpose
The Job Portal Backend provides a secure, scalable backend infrastructure for a full-stack job portal application that connects job seekers, recruiters, and administrators on a single platform.

### Project Scope
The backend handles all business logic, data processing, and API endpoints for:
- User registration, login, and profile management
- Job posting, editing, and deletion by recruiters
- Job application submission and tracking
- Mock interview practice sessions
- Administrative controls and user management
- Role-based access and permissions

### Key Objectives
1. **Security:** Secure authentication using JWT and password hashing with bcrypt
2. **Scalability:** MongoDB for flexible data storage and horizontal scaling
3. **Performance:** Efficient API endpoints with proper error handling
4. **Maintainability:** Clean code structure with MVC (Model-View-Controller) architecture
5. **User Experience:** Comprehensive validation and meaningful error messages

---

## Technology Stack & Architecture

### Backend Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | Latest | JavaScript runtime environment |
| **Express.js** | 4.18.2 | Web application framework |
| **MongoDB** | 8.0 | NoSQL database |
| **Mongoose** | 8.0.0 | MongoDB object modeling |
| **JWT (jsonwebtoken)** | 9.0.2 | Token-based authentication |
| **bcrypt** | 5.1.1 | Password hashing & encryption |
| **CORS** | 2.8.5 | Cross-origin resource sharing |
| **Express Validator** | 7.0.1 | Data validation middleware |
| **Cookie Parser** | 1.4.6 | Cookie parsing middleware |
| **Dotenv** | 16.3.1 | Environment configuration |
| **Nodemon** | 3.1.14 | Development auto-reload |

### Architecture Pattern: MVC (Model-View-Controller)

```
Backend Structure:
├── Models/          → Database schemas (MongoDB)
├── Controllers/     → Business logic & API handlers
├── Routes/          → API endpoints definition
├── Middleware/      → Authentication, validation, error handling
├── Utils/           → Helper functions & database connection
└── Validation/      → Input validation rules
```

### System Flow Diagram

```
Client Request
      ↓
   Express App
      ↓
   CORS & Cookie Parser (Middleware)
      ↓
   Authentication Middleware (JWT verification)
      ↓
   Route Handler
      ↓
   Input Validation (Express Validator)
      ↓
   Controller (Business Logic)
      ↓
   MongoDB Model Query
      ↓
   Database Operation
      ↓
   Response to Client (JSON)
```

---

## Database Design

### MongoDB Collections Overview

We use **7 MongoDB Collections** to store all application data:

#### 1. **User Collection**
Stores information about all users (job seekers, recruiters, admins)

```
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String (hashed),
  location: String,
  gender: String,
  role: String (enum: ["admin", "recruiter", "user"]),
  resume: String (file path/URL),
  timestamps: { createdAt, updatedAt }
}
```

**Key Features:**
- Password is automatically hashed using bcrypt (16 salt rounds) before storage
- Role-based access control (3 roles: admin, recruiter, user)
- Resume field stores path to uploaded resume document
- Timestamps automatically track creation and modification dates

#### 2. **Job Collection**
Stores job postings created by recruiters

```
{
  _id: ObjectId,
  company: String,
  position: String,
  jobStatus: String (enum: ["pending", "active", "closed"]),
  jobType: String (enum: ["fulltime", "parttime", "contract", "internship"]),
  jobLocation: String,
  createdBy: ObjectId (reference to User),
  jobVacancy: String,
  jobSalary: String,
  jobDeadline: String,
  timestamps: { createdAt, updatedAt }
}
```

**Key Features:**
- Linked to User (recruiter) via `createdBy` reference
- Job status tracks if posting is pending, active, or closed
- Job type indicates employment type
- Validation ensures all required fields are present

#### 3. **Application Collection**
Tracks job applications submitted by users

```
{
  _id: ObjectId,
  applicantId: ObjectId (reference to User - job seeker),
  recruiterId: ObjectId (reference to User - recruiter),
  jobId: ObjectId (reference to Job),
  status: String (enum: ["pending", "accepted", "rejected"]),
  resume: String (path to resume),
  dateOfApplication: Date,
  dateOfJoining: Date (optional),
  timestamps: { createdAt, updatedAt }
}
```

**Key Features:**
- Links job seeker, recruiter, and job posting
- Status tracks application state
- Validation ensures dateOfJoining >= dateOfApplication
- Automatic timestamp on application date

#### 4. **Interview-Related Collections**
Store data for the mock interview practice module:

**InterviewQuestion Collection:**
```
{
  category: String,
  questions: Array,
  difficulty: String
}
```

**InterviewSession Collection:**
```
{
  userId: ObjectId,
  category: String,
  questions: Array,
  status: String,
  score: Number,
  startTime: Date,
  endTime: Date
}
```

**UserAnswer Collection:**
```
{
  sessionId: ObjectId,
  userId: ObjectId,
  questionId: ObjectId,
  answer: String,
  isCorrect: Boolean,
  feedback: String
}
```

**InterviewProgress Collection:**
```
{
  userId: ObjectId,
  category: String,
  averageScore: Number,
  totalAttempts: Number,
  history: Array
}
```

### Database Relationships

```
User
├── createdJob (1-to-Many) → Job
├── submittedApplication (1-to-Many) → Application
└── interviewProgress (1-to-Many) → InterviewProgress

Job
├── createdBy (Many-to-1) → User
└── receivedApplications (1-to-Many) → Application

Application
├── applicantId (Many-to-1) → User
├── recruiterId (Many-to-1) → User
└── jobId (Many-to-1) → Job
```

### Why MongoDB?

1. **Flexible Schema:** Easy to add new fields without migrations
2. **JSON-like Documents:** Perfect alignment with JavaScript objects
3. **Excellent with Node.js:** Native MongoDB driver works seamlessly
4. **Scalability:** Built for distributed data across servers
5. **Indexing:** Fast querying with proper index creation
6. **Rapid Development:** No strict schema enforcement for faster iterations

---

## System Architecture & Design Patterns

### 1. MVC Pattern Implementation

**Model Layer** (`Model/` folder)
- Defines database schemas using Mongoose
- Includes validation rules at schema level
- Pre-hooks for password hashing

**View Layer** (Frontend API)
- React frontend consumes JSON responses
- Handles data presentation

**Controller Layer** (`Controller/` folder)
- Contains business logic
- Handles requests and responses
- Interacts with models for data operations

### 2. Middleware Architecture

```
Request Flow with Middleware:
┌─────────────┐
│   Request   │
└──────┬──────┘
       ↓
┌──────────────────────┐
│ Body Parser / CORS   │ (Global Middleware)
└──────┬───────────────┘
       ↓
┌──────────────────────┐
│ Authentication Check │ (Route-level Middleware)
└──────┬───────────────┘
       ↓
┌──────────────────────┐
│ Input Validation     │ (Conditional Middleware)
└──────┬───────────────┘
       ↓
┌──────────────────────┐
│ Controller Logic     │
└──────┬───────────────┘
       ↓
┌──────────────────────┐
│ Error Handler        │ (Global Error Middleware)
└──────┬───────────────┘
       ↓
┌─────────────┐
│  Response   │
└─────────────┘
```

### 3. Authentication Flow

```
User Login Request
        ↓
Validate Credentials (Email & Password)
        ↓
Compare Password with Bcrypt
        ↓
Generate JWT Token
        ↓
Store in Signed Cookie
        ↓
Return Token to Client
        ↓
Subsequent Requests with Token
        ↓
Verify Token Signature
        ↓
Extract User ID & Role
        ↓
Fetch User from Database
        ↓
Attach to Request Object (req.user)
        ↓
Allow Access to Protected Routes
```

### 4. Error Handling Strategy

```
Error Types:
├── Validation Errors → 400 Bad Request
├── Authentication Errors → 401 Unauthorized
├── Authorization Errors → 403 Forbidden
├── Not Found Errors → 404 Not Found
├── Server Errors → 500 Internal Server Error
└── Custom HTTP Errors → Using http-errors library
```

---

## API Endpoints Documentation

### Base URL
```
Production: https://your-api-domain.com/api/v1
Development: http://localhost:3000/api/v1
```

### Authentication Endpoints (`/api/v1/Auth`)

#### 1. Register New User
```
POST /Auth/register
Content-Type: application/json

Request Body:
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "location": "New York",
  "gender": "Male",
  "role": "user"
}

Response (201 Created):
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "64a9b3c4d8e2f1a2b3c4d5e6",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}

Error (400):
{
  "message": "Validation error - Email already exists"
}
```

#### 2. User Login
```
POST /Auth/login
Content-Type: application/json

Request Body:
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}

Response (200 OK):
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64a9b3c4d8e2f1a2b3c4d5e6",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### 3. Get Current User Profile
```
GET /Auth/me
Authentication: Required (JWT Token)

Response (200 OK):
{
  "_id": "64a9b3c4d8e2f1a2b3c4d5e6",
  "username": "john_doe",
  "email": "john@example.com",
  "role": "user",
  "location": "New York",
  "resume": "path/to/resume.pdf"
}
```

#### 4. User Logout
```
POST /Auth/logout
Authentication: Required

Response (200 OK):
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Job Management Endpoints (`/api/v1/Jobs`)

#### 1. Get All Jobs
```
GET /Jobs?page=1&limit=10&search=developer
Authentication: Required

Query Parameters:
- page: Page number (default: 1)
- limit: Items per page (default: 10)
- search: Search by position/company

Response (200 OK):
{
  "success": true,
  "jobs": [
    {
      "_id": "64a9b3c4d8e2f1a2b3c4d5e6",
      "company": "Tech Corp",
      "position": "Senior Developer",
      "jobLocation": "San Francisco",
      "jobType": "fulltime",
      "jobSalary": "120000-150000",
      "jobVacancy": "5",
      "jobDeadline": "2024-04-30",
      "createdBy": {...}
    }
  ],
  "totalJobs": 45,
  "totalPages": 5,
  "currentPage": 1
}
```

#### 2. Get Single Job Details
```
GET /Jobs/:jobId
Authentication: Required

Response (200 OK):
{
  "_id": "64a9b3c4d8e2f1a2b3c4d5e6",
  "company": "Tech Corp",
  "position": "Senior Developer",
  "jobDescription": "...",
  "jobLocation": "San Francisco",
  "jobType": "fulltime",
  "jobSalary": "120000-150000",
  "createdBy": {
    "_id": "64a9b3c4d8e2f1a2b3c4d5e7",
    "username": "recruiter_name",
    "company": "Tech Corp"
  },
  "applications": 12
}
```

#### 3. Create New Job (Recruiter Only)
```
POST /Jobs
Authentication: Required
Authorization: Recruiter/Admin

Request Body:
{
  "company": "Tech Corp",
  "position": "Senior Developer",
  "jobType": "fulltime",
  "jobLocation": "San Francisco",
  "jobVacancy": "5",
  "jobSalary": "120000-150000",
  "jobDeadline": "2024-04-30"
}

Response (201 Created):
{
  "success": true,
  "message": "Job created successfully",
  "job": {
    "_id": "64a9b3c4d8e2f1a2b3c4d5e6",
    "company": "Tech Corp",
    "position": "Senior Developer",
    ...
  }
}
```

#### 4. Update Job Details (Recruiter Only)
```
PUT /Jobs/:jobId
Authentication: Required
Authorization: Recruiter (must be creator)

Request Body:
{
  "jobSalary": "130000-160000",
  "jobVacancy": "8"
}

Response (200 OK):
{
  "success": true,
  "message": "Job updated successfully"
}
```

#### 5. Delete Job (Recruiter Only)
```
DELETE /Jobs/:jobId
Authentication: Required
Authorization: Recruiter (must be creator)

Response (200 OK):
{
  "success": true,
  "message": "Job deleted successfully"
}
```

---

### Application Endpoints (`/api/v1/Application`)

#### 1. Submit Job Application
```
POST /Application
Authentication: Required
Authorization: Job Seeker

Request Body:
{
  "jobId": "64a9b3c4d8e2f1a2b3c4d5e6",
  "resume": "path/to/resume.pdf"
}

Response (201 Created):
{
  "success": true,
  "message": "Application submitted successfully"
}

Validations:
- Duplicate applications are prevented
- User cannot apply to own posted jobs
```

#### 2. Get My Applications (Job Seeker)
```
GET /Application/user/me
Authentication: Required

Response (200 OK):
{
  "applications": [
    {
      "_id": "64a9b3c4d8e2f1a2b3c4d5e6",
      "jobId": {
        "company": "Tech Corp",
        "position": "Developer"
      },
      "status": "pending",
      "dateOfApplication": "2024-03-10"
    }
  ]
}
```

#### 3. Get Applications for Job (Recruiter)
```
GET /Application/recruiter/:jobId
Authentication: Required
Authorization: Recruiter

Response (200 OK):
{
  "applications": [
    {
      "_id": "...",
      "applicantId": {
        "username": "john_doe",
        "email": "john@example.com"
      },
      "status": "pending",
      "resume": "path/to/resume.pdf",
      "dateOfApplication": "2024-03-10"
    }
  ]
}
```

#### 4. Update Application Status (Recruiter)
```
PUT /Application/:applicationId
Authentication: Required
Authorization: Recruiter

Request Body:
{
  "status": "accepted",
  "dateOfJoining": "2024-05-01"
}

Response (200 OK):
{
  "success": true,
  "message": "Application status updated"
}
```

---

### User Profile Endpoints (`/api/v1/Users`)

#### 1. Get User Profile
```
GET /Users/:userId
Authentication: Required

Response (200 OK):
{
  "_id": "64a9b3c4d8e2f1a2b3c4d5e6",
  "username": "john_doe",
  "email": "john@example.com",
  "location": "New York",
  "gender": "Male",
  "role": "user",
  "resume": "path/to/resume.pdf",
  "appliedJobs": 5,
  "joinsCount": 1
}
```

#### 2. Update Profile
```
PUT /Users/:userId
Authentication: Required
Authorization: Own profile or Admin

Request Body:
{
  "location": "Boston",
  "gender": "Female",
  "resume": "new/path/to/resume.pdf"
}

Response (200 OK):
{
  "success": true,
  "message": "Profile updated successfully"
}
```

#### 3. Update Password
```
PUT /Users/:userId/password
Authentication: Required

Request Body:
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword123"
}

Response (200 OK):
{
  "success": true,
  "message": "Password updated successfully"
}
```

---

### Admin Endpoints (`/api/v1/Admin`)

#### 1. Get All Users (Admin Only)
```
GET /Admin/users
Authentication: Required
Authorization: Admin

Query Parameters:
- role: Filter by role (admin, recruiter, user)
- page: Pagination

Response (200 OK):
{
  "users": [
    {
      "_id": "...",
      "username": "user_name",
      "email": "email@example.com",
      "role": "user",
      "applicationCount": 3
    }
  ],
  "total": 150
}
```

#### 2. Delete User (Admin Only)
```
DELETE /Admin/users/:userId
Authentication: Required
Authorization: Admin

Response (200 OK):
{
  "success": true,
  "message": "User deleted successfully"
}
```

#### 3. Get Dashboard Statistics (Admin)
```
GET /Admin/stats
Authentication: Required
Authorization: Admin

Response (200 OK):
{
  "totalUsers": 500,
  "totalJobs": 145,
  "totalApplications": 3200,
  "activeSeekers": 320,
  "activeRecruiters": 85,
  "jobsByType": {
    "fulltime": 50,
    "parttime": 35,
    "internship": 60
  }
}
```

---

### Interview Endpoints (`/`)

#### 1. Get Interview Categories
```
GET /interviews/categories
Authentication: Not Required

Response (200 OK):
{
  "categories": [
    {
      "id": 1,
      "name": "JavaScript",
      "questionCount": 25
    },
    {
      "id": 2,
      "name": "React",
      "questionCount": 20
    }
  ]
}
```

#### 2. Get Interview Questions
```
GET /interviews/questions?category=javascript
Authentication: Required

Response (200 OK):
{
  "questions": [
    {
      "_id": "64a9b3c4d8e2f1a2b3c4d5e6",
      "question": "What is closure in JavaScript?",
      "category": "javascript",
      "difficulty": "medium"
    }
  ]
}
```

#### 3. Start Interview Session
```
POST /interviews/session
Authentication: Required

Request Body:
{
  "category": "javascript",
  "totalQuestions": 10
}

Response (201 Created):
{
  "sessionId": "64a9b3c4d8e2f1a2b3c4d5e6",
  "questions": [...],
  "startTime": "2024-03-18T10:30:00Z"
}
```

#### 4. Submit Answer & Get Feedback
```
POST /interviews/session/:sessionId/answer
Authentication: Required

Request Body:
{
  "questionId": "64a9b3c4d8e2f1a2b3c4d5e6",
  "answer": "A closure is a function that has access to its outer scope"
}

Response (200 OK):
{
  "feedback": "Good explanation!",
  "score": 85,
  "nextQuestion": {...}
}
```

#### 5. Complete Interview Session
```
POST /interviews/session/:sessionId/complete
Authentication: Required

Response (200 OK):
{
  "sessionId": "64a9b3c4d8e2f1a2b3c4d5e6",
  "totalScore": 82,
  "categoryImprovement": "javascript",
  "timeTaken": "15:30",
  "nextSteps": "Review advanced concepts"
}
```

---

## Key Features & Implementation

### 1. User Authentication System

**What it does:**
- Secure user registration with validation
- Encrypted password storage
- JWT-based session management
- Automatic session verification on protected routes

**How it works:**

```javascript
// Registration Process:
1. User submits email, username, password
2. Validation checks:
   - Email format is valid
   - Password strength (min 6 chars, special chars)
   - Username is unique
3. Password is hashed with bcrypt (16 salt rounds)
4. User document saved to MongoDB
5. JWT token generated and sent in signed cookie

// Login Process:
1. User submits email and password
2. Find user by email in database
3. Compare provided password with stored hash using bcrypt
4. If match: Generate JWT token with userId and role
5. Token stored in signed, httpOnly cookie
6. Token sent in response

// Token Verification:
1. On protected routes, middleware checks for token in cookies
2. Token signature verified using JWT_SECRET
3. Decode token to get userId and role
4. Fetch fresh user data from database
5. Attach user to request object
6. Process request with user context
```

**Security Measures:**
- ✅ Passwords hashed with bcrypt (salting)
- ✅ JWT tokens expire after set duration
- ✅ Signed, httpOnly cookies (CSRF protection)
- ✅ CORS restricted to approved domains
- ✅ Sensitive fields excluded (password not returned)

### 2. Job Management System

**What it does:**
- Recruiters post new job openings
- Jobs can be edited/deleted by creator
- Full-text search across jobs
- Filtering by location, type, salary range
- Automatic status management

**Implementation Details:**

```javascript
Job Creation (Recruiter):
1. Validate all required fields
2. Ensure job position meets min/max length
3. Company name validation
4. Set default status: PENDING (admin approval)
5. Attach recruiter ID as creator
6. Save to database
7. Return created job with ID

Job Filtering:
1. Support multiple filters:
   - Search by position or company
   - Filter by job type (fulltime/parttime/internship/contract)
   - Filter by location
   - Filter by salary range
2. Pagination support (10 items per page)
3. Return with recruiter details

Job Status Workflow:
PENDING → ACTIVE → CLOSED
- PENDING: New job awaiting admin approval
- ACTIVE: Live and accepting applications
- CLOSED: No longer accepting applications
```

**Database Validation:**
- Company name: 5-100 characters
- Position: 5-200 characters
- All date fields required
- Vacancy and salary as strings for flexibility

### 3. Application Tracking System

**What it does:**
- Users apply for jobs with resume
- Track application status (pending/accepted/rejected)
- Recruiters review and respond to applications
- Prevent duplicate applications
- Track joining date when hired

**Workflow:**

```javascript
Application Submission:
1. Check if user already applied for this job (prevent duplicates)
2. Validate job still active
3. Check user cannot apply to own jobs
4. Store applicant ID, recruiter ID, job ID, resume
5. Set initial status: PENDING
6. Record application date automatically

Application Review (Recruiter):
1. Recruiter views all applications for their jobs
2. Can see applicant details and resume
3. Can accept/reject applications
4. If accepted, record joining date
5. Validation: dateOfJoining must be after application date

Job Seeker Tracking:
1. User can view all their submitted applications
2. See status of each application
3. View recruiter feedback
4. See which jobs they've applied to
```

**Database Relationships:**
```
Application
├── Links to User (applicant)
├── Links to User (recruiter)
└── Links to Job
```

### 4. User Profile & Resume Management

**Features:**
- Complete user profile (location, gender, role)
- Resume upload and storage
- Profile editing by user
- Admin can view all profiles
- Resume associated with applications

**Profile Update Flow:**
```javascript
1. User submits profile updates
2. Validate email uniqueness (if changed)
3. Update allowed fields:
   - location, gender, resume URL
4. Created dates preserved
5. Updated timestamp recorded
6. Return updated profile
```

### 5. Role-Based Access Control (RBAC)

**Three User Roles:**

```
User (Job Seeker):
├── Sign up and login
├── View all jobs
├── Apply for jobs
├── Track applications
├── View own profile
└── Edit own resume

Recruiter:
├── All User permissions
├── Create new job postings
├── Edit own jobs
├── Delete own jobs
├── View applications for own jobs
├── Accept/reject applications
└── View applicant profilesAdmin:
├── All Recruiter permissions
├── View all users
├── Delete users
├── Access admin dashboard
├── View system statistics
└── Moderate all job postings
```

**Implementation:**
```javascript
// Middleware checks role from JWT token
authenticateUser Middleware:
1. Extract token from signed cookie
2. Verify JWT signature
3. Decode to get userId and role
4. Attach to request object

// Route-level authorization
- Job creation: Check role === "recruiter" || role === "admin"
- User deletion: Check role === "admin"
- Own job editing: Check createdBy === currentUserId
```

### 6. Mock Interview Module

**Components:**
1. **Interview Questions:** Database of questions by category
2. **Interview Sessions:** Tracks practice interview attempts
3. **User Answers:** Stores responses with feedback
4. **Interview Progress:** Maintains stats and improvement tracking

**Interview Flow:**
```
1. User selects category
2. System retrieves questions
3. Session created with timestamp
4. User answers question
5. Answer sent to backend
6. AI/Rule-based evaluation
7. Feedback provided
8. Score calculated
9. Progress updated
10. Session completed with overall score
```

**Features:**
- Multiple attempts allowed
- Category-wise progress tracking
- Difficulty levels (easy/medium/hard)
- Score history
- Performance analytics
- Timed sessions

### 7. Error Handling & Validation

**Validation Layers:**

```
Layer 1: Schema Validation (Mongoose)
- Type checking
- Required fields
- Min/max lengths
- Enum validation

Layer 2: Express Validator Middleware
- Custom validation rules
- Email format
- Password strength
- Unique field checks

Layer 3: Controller Logic
- Business logic validation
- Relationship checks
- Status workflow validation
- Permission checks
```

**Error Responses:**

```javascript
400 Bad Request - Validation fails
{
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}

401 Unauthorized - No/invalid token
{
  "message": "Unauthorized User"
}

403 Forbidden - No permission
{
  "message": "You don't have permission to perform this action"
}

404 Not Found
{
  "message": "Job not found"
}

500 Server Error
{
  "message": "Something went wrong"
}
```

---

## Security & Authentication

### JWT (JSON Web Tokens) Explained

**What is JWT?**
A JWT is a secure token that contains encoded user information. It's stateless (server doesn't need to store it) and signed (cannot be modified).

**JWT Structure:**
```
Header.Payload.Signature

Header: Algorithm used (HS256)
Payload: User ID, Role (encoded but NOT encrypted)
Signature: Ensures token wasn't tampered (server can verify)
```

**Example JWT:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJJRCI6IjY0YTliM2M0ZDhlMmYxYTJiM2M0ZDVlNiIsInJvbGUiOiJ1c2VyIn0.
kXp5YzCvJ0z8J9K12mN4q0r7sT8uV9wX0yZ1aB2cD3
```

**Advantages:**
- ✅ Stateless (no server-side session storage)
- ✅ Scalable (multiple servers can verify)
- ✅ Secure (digitally signed)
- ✅ Standard format (widely supported)
- ✅ Can be passed via headers or cookies

### Password Security

**Bcrypt Hashing:**
```
Plain Password: "MyPassword123"
                    ↓
            Salt rounds: 16
                    ↓
      Hash: $2b$16$H8zGJ9K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7A8B9C0D1E2F3G4H5
```

**Why Bcrypt?**
- Intentionally slow (resistant to brute force)
- Each hash unique (different salt each time)
- Adaptive (can increase rounds as compute improves)
- Industry standard

**Implementation:**
```javascript
// Registration
password → bcrypt.hash(password, saltRounds) → stored hash

// Login
providedPassword + storedHash → bcrypt.compare() → true/false
```

### CORS (Cross-Origin Resource Sharing)

**What it prevents:**
Blocks unauthorized cross-domain requests from browsers

**Implementation:**
```javascript
CORS configured to allow only:
- https://mern-job-portal-seven.vercel.app (production frontend)
- http://localhost:5173 (development frontend)

Allowed Methods: GET, POST, DELETE, PUT, PATCH
Credentials: Required (for cookies)
```

### Environment Variables

**Sensitive data stored in `.env` file:**
```
DB_STRING=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your-super-secret-key-here
COOKIE_SECRET=another-secret-key
COOKIE_NAME=jobPortalToken
PORT=3000
```

**Never commit `.env` to Git!** Add to `.gitignore`

### Additional Security Practices

1. **Signed Cookies:** httpOnly flag prevents JavaScript access
2. **HTTPS Only:** In production, force HTTPS/TLS encryption
3. **Rate Limiting:** Can be added to prevent brute force attacks
4. **Input Sanitization:** Mongoose validates input types
5. **SQL Injection Prevention:** Using MongoDB (NoSQL) inherently safe
6. **XSS Prevention:** JSON responses (not HTML rendering)

---

## Validation & Error Handling

### Input Validation Strategy

**Validation Rules Applied:**

```javascript
User Registration:
✓ Email: Required, valid format, unique
✓ Password: Min 6 chars, at least 1 special char
✓ Username: Required, 3-50 chars, alphanumeric
✓ Role: Must be "admin", "recruiter", or "user"

Job Creation:
✓ Company: Required, 5-100 characters
✓ Position: Required, 5-200 characters
✓ Location: Required, non-empty
✓ Salary: Required, valid format
✓ Vacancy: Required, numeric
✓ Deadline: Required, valid date format

Application:
✓ Job ID: Must exist in database
✓ Resume: Required, valid path
✓ No duplicate applications from same user for same job
```

### Error Handling Flow

```
Request Processing
        ↓
Validation Check
        ├→ FAIL: Send 400 error response
        ↓
Controller Logic
        ├→ ERROR: Catch with try-catch
        ↓
Send successful response
        OR
Send error response

Global Error Handler:
- Catches all unhandled errors
- Logs to console/file
- Returns JSON error response
- Prevents server crash
```

### Example Error Responses

**Registration Validation Error:**
```json
{
  "success": false,
  "errors": [
    {
      "field": "email",
      "message": "Email already exists"
    },
    {
      "field": "password",
      "message": "Password must contain special characters"
    }
  ]
}
```

**Authentication Error:**
```json
{
  "status": 401,
  "message": "Unauthorized User",
  "error": "Invalid or expired token"
}
```

**Authorization Error:**
```json
{
  "status": 403,
  "message": "You don't have permission to delete this job"
}
```

---

## Deployment & Configuration

### Environment Setup

**Local Development:**
```bash
# Install dependencies
npm install

# Create .env file with:
DB_STRING=mongodb+srv://user:pass@cluster.mongodb.net/job-portal-dev
JWT_SECRET=dev-secret-key-change-in-production
COOKIE_SECRET=dev-cookie-secret
COOKIE_NAME=jobPortalToken
PORT=3000

# Run development server
npm run dev  # Uses nodemon for auto-reload
```

**Production Setup:**
```bash
# Environment variables in production:
DB_STRING=production-mongodb-atlas-connection-string
JWT_SECRET=strong-random-secret-key-min-32-chars
COOKIE_SECRET=another-strong-secret
COOKIE_NAME=jobPortalToken
PORT=3000 (or use process.env.PORT)
NODE_ENV=production
```

### Database Connection

**MongoDB Atlas (Cloud):**
```javascript
Connection String Format:
mongodb+srv://username:password@cluster-url/database-name?retryWrites=true&w=majority

Benefits:
- Cloud hosting (no local database needed)
- Automatic backups
- Scalable
- Free tier available (512 MB)
```

**Connection Code:**
```javascript
// Utils/DBconnect.js
async function DBConnectionHandler() {
    try {
        await mongoose.connect(process.env.DB_STRING);
        console.log("DB connected successfully");
    } catch (err) {
        console.error(`Database Error: ${err.message}`);
        process.exit(1);
    }
}
```

### Server Startup

```javascript
// Server.js
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
```

### Vercel Deployment

**Configuration File (vercel.json):**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "Server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "Server.js"
    }
  ],
  "env": {
    "DB_STRING": "@db_string",
    "JWT_SECRET": "@jwt_secret"
  }
}
```

**Deployment Steps:**
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy on push to main branch
4. API available at vercel-domain.vercel.app

### Performance Considerations

**Current Implementation:**
- ✅ Efficient MongoDB queries with indexing
- ✅ Pagination to limit large results
- ✅ JWT validation caching in memory
- ✅ Error handling prevents server crashes

**Future Optimizations:**
- Add Redis caching for hot queries
- Implement request rate limiting
- Add database query optimization/indexing
- Use connection pooling for MongoDB
- Implement API response compression
- Add monitoring and logging

---

## Viva Voice Q&A Guide

### Frequently Asked Questions for College Viva

#### 1. **Project Overview Questions**

**Q: What is your project about?**
A: It's a full-stack job portal web application where job seekers can search and apply for jobs, recruiters can post job openings, and admins can manage the platform. It includes features like user authentication, job management, application tracking, and mock interviews for practice.

**Q: Why did you choose Node.js and Express for the backend?**
A: Node.js is lightweight and uses JavaScript (same as frontend), making it easier for full-stack development. Express is simple, fast, and has great community support. Together they're perfect for building scalable RESTful APIs.

**Q: What is MongoDB and why did you choose it?**
A: MongoDB is a NoSQL database that stores data in JSON-like documents. I chose it because:
- Flexible schema (easy to add fields)
- Perfect with Node.js (JSON compatibility)
- Scalable for large datasets
- Quick development (no schema migration needed)

---

#### 2. **Architecture & Design Questions**

**Q: Explain the MVC architecture used in your project.**
A: 
- **Model:** MongoDB schemas define the structure (User, Job, Application)
- **View:** Frontend (React) that users interact with
- **Controller:** Contains business logic, handles requests, and communicates with models
This separation makes code organized, maintainable, and testable.

**Q: What middleware are you using in your application?**
A:
1. Body parser (parse JSON requests)
2. CORS (allow requests from frontend)
3. Cookie parser (handle cookies)
4. Authentication middleware (verify JWT tokens)
5. Input validation middleware (validate data)
6. Error handling middleware (catch errors)

**Q: Explain the request/response flow in your application.**
A: 
1. Client sends HTTP request with data
2. Server receives through Express
3. CORS middleware checks if origin allowed
4. Authentication middleware verifies token (if protected route)
5. Validation middleware checks data
6. Controller processes business logic
7. Model queries/updates database
8. Response sent back as JSON
9. Client receives and updates UI

---

#### 3. **Authentication & Security Questions**

**Q: How does JWT authentication work in your project?**
A: 
1. User logs in with email and password
2. Server checks credentials
3. If valid, generates JWT token containing userId and role
4. Token sent to client in signed cookie
5. For protected routes, middleware verifies token signature
6. If valid, user data fetched and attached to request
7. If invalid, returns 401 Unauthorized

**Q: Why is password hashing important?**
A: If database is breached, attackers get hashes, not actual passwords. Hashing is one-way (can't reverse), so original password remains safe. Bcrypt uses salting - adding random data before hashing - making even identical passwords have different hashes.

**Q: What is CORS and how is it implemented?**
A: CORS (Cross-Origin Resource Sharing) prevents unauthorized requests from other domains. I configured it to only allow:
- Production frontend (vercel.app)
- Development frontend (localhost:5173)
This prevents malicious websites from accessing our API.

**Q: What security measures are implemented?**
A:
- Password hashing with bcrypt
- JWT tokens with expiration
- Signed, httpOnly cookies
- CORS restrictions
- Input validation
- Error messages don't expose sensitive info
- Sensitive fields excluded from responses

---

#### 4. **Database Questions**

**Q: Describe the database schema used.**
A: Seven main collections:
1. **Users:** Store user info, credentials, roles
2. **Jobs:** Job postings by recruiters
3. **Applications:** Track job applications
4. **InterviewQuestions:** Question bank
5. **InterviewSessions:** Practice sessions
6. **UserAnswers:** Responses and feedback
7. **InterviewProgress:** Stats and tracking

**Q: What are the relationships between collections?**
A:
- User creates multiple Jobs (1-to-Many)
- User submits multiple Applications (1-to-Many)
- Application references one Job, one Applicant, one Recruiter

**Q: How is data validation done at database level?**
A: Using Mongoose schema:
- Type checking (string, number, etc.)
- Required fields (can't be null)
- Min/max length validation
- Enum validation (only specific values)
- Custom validators (unique email, date logic)
- Pre-hooks for password hashing

---

#### 5. **API Endpoints Questions**

**Q: What are the main API endpoints?**
A:
- `/api/v1/Auth` - Login, register, logout
- `/api/v1/Jobs` - Job CRUD operations
- `/api/v1/Application` - Apply, track applications
- `/api/v1/Users` - Profile management
- `/api/v1/Admin` - User management, statistics
- `/interviews` - Interview questions and sessions

**Q: What is the difference between HTTP methods?**
A:
- **GET:** Retrieve data (safe, doesn't modify)
- **POST:** Create new data
- **PUT/PATCH:** Update existing data
- **DELETE:** Remove data

**Q: How does pagination work?**
A: Large datasets returned in pages:
- Query parameters: `?page=1&limit=10`
- Return 10 items per page
- Include total count and total pages
- Reduces data transfer and improves performance

---

#### 6. **Features & Implementation Questions**

**Q: How does the job application system work?**
A:
1. User views job listing
2. Clicks apply button
3. Backend checks:
   - User hasn't already applied
   - Job still active
   - User isn't the recruiter
4. Saves application with status "pending"
5. Recruiter sees applications on their job dashboard
6. Can accept/reject applications
7. User gets notification of status

**Q: What is role-based access control (RBAC)?**
A: Different users have different permissions:
- **User:** Apply for jobs, view profiles
- **Recruiter:** Post jobs, review applications
- **Admin:** Manage users, view statistics
Implemented by checking user role in middleware before allowing action.

**Q: How are mock interviews implemented?**
A:
1. User selects interview category
2. System generates/retrieves questions
3. Session created with timestamp
4. User answers each question
5. Answers evaluated (rule-based or AI)
6. Feedback provided
7. Score calculated and session completed
8. Progress tracked for improvement

---

#### 7. **Error Handling Questions**

**Q: How errors are handled in your application?**
A:
- Input validation errors: Return 400 Bad Request
- Authentication errors: Return 401 Unauthorized
- Permission errors: Return 403 Forbidden
- Not found errors: Return 404 Not Found
- Server errors: Return 500 Internal Server Error
- All errors return JSON for consistent handling

**Q: What happens if database connection fails?**
A: The connection function catches error and calls `process.exit(1)` to stop server. This prevents serving requests without database. In production, monitoring tools alert about failure.

**Q: How are validation errors handled?**
A: Express-validator middleware catches validation failures and returns error array with field names and messages. Client displays these errors to user for correction.

---

#### 8. **Performance & Scalability Questions**

**Q: How is your application scalable?**
A:
- Stateless API (no session storage)
- MongoDB Atlas for cloud database
- Pagination for large datasets
- Index database queries for speed
- Vercel for serverless deployment (auto-scaling)

**Q: What improvements could be made for better performance?**
A:
- Add Redis caching for frequently accessed data
- Implement database query optimization
- Add request rate limiting
- Use CDN for static files
- Implement logging and monitoring
- Add API response compression

---

#### 9. **Deployment Questions**

**Q: How is the backend deployed?**
A: Using Vercel:
1. Connect GitHub repository
2. Set environment variables in Vercel dashboard
3. Vercel automatically builds and deploys on push
4. API available at custom domain
5. Zero-downtime deployments

**Q: What environment variables are needed?**
A:
- `DB_STRING:` MongoDB connection
- `JWT_SECRET:` For signing tokens
- `COOKIE_SECRET:` For signing cookies
- `PORT:` Server port
- `NODE_ENV:` development/production

---

#### 10. **Problem-Solving Questions**

**Q: How did you handle the duplicate application issue?**
A: Before saving application, query database to check if user already applied for that job. If exists, return error. This prevents duplicate records.

**Q: How do you ensure only recruiters can post jobs?**
A: In job creation controller, check if user role is "recruiter" or "admin". If not, return 403 Forbidden error.

**Q: How do you verify token expiry?**
A: JWT tokens can have expiration set. On each request, middleware verifies token signature and checks expiration. If expired, returns 401 Unauthorized.

---

#### 11. **Learnings & Challenges**

**Q: What challenges did you face and how did you solve them?**
A: Key challenges:
1. **Database Relationships:** Solved using Mongoose refs for linking documents
2. **Password Security:** Implemented bcrypt hashing for security
3. **Authentication:** Used JWT tokens for stateless auth
4. **CORS Issues:** Configured CORS to allow only frontend domains
5. **Error Handling:** Created global error handler middleware

**Q: What did you learn from this project?**
A: 
- Backend architecture and API design
- Database design with MongoDB
- Security best practices (hashing, JWT, CORS)
- RESTful API principles
- Error handling and validation
- Deployment and DevOps basics
- Testing and debugging

---

#### 12. **General Backend Questions**

**Q: What is REST API?**
A: REST (Representational State Transfer) uses HTTP methods to perform operations:
- GET: Read
- POST: Create
- PUT: Update
- DELETE: Delete
My API follows REST principles for clean, standard design.

**Q: What is the difference between SQL and NoSQL databases?**
A:
| SQL | NoSQL |
|-----|-------|
| Structured schema | Flexible schema |
| Tables | Collections |
| Joins for relationships | Embedded/referenced docs |
| ACID guaranteed | Eventual consistency |
| MySQL, PostgreSQL | MongoDB, Redis |

**Q: Explain the concept of middleware.**
A: Middleware functions have access to request and response objects. They can:
- Process requests before controller
- Modify request/response
- Perform validation
- Handle errors
- Chain multiple middlewares
Example: Authentication, validation, logging middleware

**Q: What is async/await?**
A: Modern JavaScript syntax for handling asynchronous operations:
```javascript
// Without async/await (callbacks)
db.findUser(id, function(err, user) { ... })

// With async/await (cleaner)
const user = await User.findById(id);
```
Makes asynchronous code look synchronous and easier to read.

---

## Summary of Key Points

### What You've Built
✅ A complete **Node.js/Express backend** with **MongoDB**
✅ **RESTful API** with proper HTTP methods
✅ **JWT authentication** with role-based access
✅ **Database design** with proper relationships
✅ **Error handling** and validation
✅ **Scalable architecture** ready for production

### Technologies Mastered
- Node.js runtime
- Express.js framework
- MongoDB & Mongoose
- JWT authentication
- Bcrypt password hashing
- CORS & middleware
- RESTful API design
- Vercel deployment

### Skills Demonstrated
- Full-stack development
- Backend architecture design
- Database modeling
- Security implementation
- API design
- Error handling
- Problem-solving
- Deployment

---

## Conclusion

This backend system demonstrates a solid understanding of modern backend development. The project is production-ready with proper security, validation, error handling, and scalability measures. It successfully integrates with the React frontend to create a complete, functional job portal application.

---

**Report Created:** March 2026  
**Total Endpoints:** 30+  
**Collections:** 7  
**Security Layers:** 4  
**Ready for:** College Submission & Viva Presentation
