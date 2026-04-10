# Backend Project - Quick Reference Card

## 🎯 Project Overview
**Full Stack Job Portal Backend** - Node.js + Express + MongoDB

### Key Purpose
RESTful API powering a job portal with job posting, application tracking, and mock interviews.

---

## 🛠️ Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Runtime | Node.js | Latest |
| Framework | Express.js | 4.18.2 |
| Database | MongoDB | 8.0 |
| Auth | JWT + Bcrypt | 9.0.2 + 5.1.1 |
| Validation | Express Validator | 7.0.1 |

---

## 📁 Project Structure

```
Backend/
├── Model/          → 7 MongoDB Schemas
├── Controller/     → 5 Business Logic Files
├── Router/         → 6 API Route Modules
├── Middleware/     → Authentication & Validation
├── Utils/          → DB Connection & Helpers
├── Validation/     → Input Validation Rules
├── Server.js       → Entry Point
└── App.js          → Express App Config
```

---

## 🔐 Authentication Flow

```
Login → Password Hash Compare → JWT Token → Signed Cookie
                ↓
Protected Request → Middleware → Verify JWT → Attach User → Process
```

**JWT Contains:** User ID + Role (stateless)

---

## 📊 Database Collections (7 Total)

| Collection | Purpose | Key Fields |
|-----------|---------|-----------|
| **Users** | User accounts | email, password (hashed), role |
| **Jobs** | Job postings | company, position, salary, createdBy |
| **Applications** | Job applications | applicantId, jobId, recruiterId, status |
| **InterviewQuestions** | Question bank | category, questions, difficulty |
| **InterviewSessions** | Practice sessions | userId, category, score, startTime |
| **UserAnswers** | Interview responses | sessionId, questionId, answer, feedback |
| **InterviewProgress** | Stats tracking | userId, category, scores, attempts |

---

## 🚀 Main API Routes

### Authentication (`/api/v1/Auth`)
- `POST /Register` → Create account
- `POST /Login` → Get JWT token
- `GET /Me` → Current user profile
- `POST /Logout` → Clear token

### Jobs (`/api/v1/Jobs`)
- `GET /` → List all jobs (paginated)
- `GET /:jobId` → Job details
- `POST /` → Create job (Recruiter)
- `PUT /:jobId` → Update job (Recruiter)
- `DELETE /:jobId` → Delete job (Recruiter)

### Applications (`/api/v1/Application`)
- `POST /` → Apply for job
- `GET /user/me` → My applications
- `GET /recruiter/:jobId` → Applications for a job
- `PUT /:appId` → Update status (Recruiter)

### Users (`/api/v1/Users`)
- `GET /:userId` → User profile
- `PUT /:userId` → Update profile
- `PUT /:userId/password` → Change password

### Admin (`/api/v1/Admin`)
- `GET /users` → All users
- `DELETE /users/:userId` → Delete user
- `GET /stats` → Dashboard statistics

### Interviews
- `GET /interviews/categories` → Categories
- `GET /interviews/questions` → Questions
- `POST /interviews/session` → Start session
- `POST /interviews/session/:id/answer` → Submit answer
- `POST /interviews/session/:id/complete` → Finish

---

## 🔒 Security Features

✅ **Password:** Bcrypt hashing (16 salt rounds)
✅ **Tokens:** JWT signed & verified
✅ **Cookies:** Signed, httpOnly, CSRF safe
✅ **CORS:** Restricted to frontend domains only
✅ **Validation:** Multi-layer input checks
✅ **Error Messages:** Don't expose sensitive info

---

## 👥 User Roles & Permissions

| Role | Can Do |
|------|--------|
| **User (Seeker)** | Apply, view profile, track apps |
| **Recruiter** | Post jobs, review apps, delete own jobs |
| **Admin** | All + delete users, view stats |

---

## ✅ Validation Rules

**User Registration:**
- Email: Valid format + unique
- Password: Min 6 chars + special char
- Username: 3-50 alphanumeric

**Job Creation:**
- Company: 5-100 characters
- Position: 5-200 characters
- All date fields required

**Application:**
- No duplicate applications
- Job must be active
- Can't apply to own jobs

---

## 🔗 Database Relationships

```
User ──1:Many──> Job
User ──1:Many──> Application
Job  ──1:Many──> Application
```

---

## 📝 Error Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Success |
| 400 | Bad Request | Validation fails |
| 401 | Unauthorized | No/invalid token |
| 403 | Forbidden | No permission |
| 404 | Not Found | Resource missing |
| 500 | Server Error | Unexpected error |

---

## 🚀 Deployment

**Platform:** Vercel  
**Environment Variables:** DB_STRING, JWT_SECRET, COOKIE_SECRET, PORT  
**Auto Deploy:** On Git push  
**URL:** vercel-domain.vercel.app

---

## 📋 Current Status

✅ All CRUD operations working
✅ Authentication fully implemented
✅ Role-based access control active
✅ Database relationships complete
✅ Error handling in place
✅ Validation active
✅ Deployed on Vercel
✅ CORS configured
✅ Ready for production

---

## 🎯 What Makes This Professional

1. **Proper Separation of Concerns** (MVC)
2. **Security Best Practices** (Hashing, JWT, CORS)
3. **Input Validation** (Multiple layers)
4. **Error Handling** (Global error handler)
5. **Scalable Architecture** (Stateless API)
6. **Clean Code** (Organized structure)
7. **Production Ready** (Error logs, validation)
8. **Proper HTTP Methods** (RESTful)

---

## 💡 Quick Answers for Viva

**Q: Why Node.js?**
A: Lightweight, JavaScript-based, great for APIs, has Express.

**Q: Why MongoDB?**
A: Flexible schema, JSON documents, perfect with Node, scalable.

**Q: How is security handled?**
A: Bcrypt passwords, JWT tokens, CORS, input validation.

**Q: What's MVC?**
A: Model (DB), View (Frontend), Controller (Logic) - organized structure.

**Q: How do you handle errors?**
A: Try-catch blocks, validation middleware, global error handler.

**Q: What is JWT?**
A: Encoded token with user ID and role - secure, stateless authentication.

**Q: How does authentication work?**
A: User logs in → Verify password → Generate JWT → Store in cookie → Verify on each request.

**Q: What are the 3 roles?**
A: User (apply for jobs), Recruiter (post jobs), Admin (manage all).

**Q: How is password stored?**
A: Hashed with bcrypt (16 salt rounds) - original password not stored.

**Q: What is CORS?**
A: Allows only specified frontend domains to access API - prevents unauthorized access.

---

**Ready for:**
✅ College Submission
✅ Viva Questions
✅ Project Defense
✅ Interview Questions
✅ Production Deployment
