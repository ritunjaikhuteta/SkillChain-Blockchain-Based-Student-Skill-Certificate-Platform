# SkillChain API Documentation — Phase 1

Base URL: `http://localhost:8080/api`

All authenticated endpoints require an HTTP `Authorization` header formatted as:
```http
Authorization: Bearer <jwt-token>
```

---

## 1. Authentication Endpoints (`/api/auth`)

### 1.1 User Registration
- **Method / Path:** `POST /api/auth/register`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "fullName": "Jane Doe",
    "email": "jane@university.edu",
    "password": "Password@123",
    "role": "STUDENT" // Options: "STUDENT", "RECRUITER", "ADMIN"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "token": "eyJhbGciOi...",
    "type": "Bearer",
    "id": 1,
    "fullName": "Jane Doe",
    "email": "jane@university.edu",
    "role": "STUDENT"
  }
  ```

### 1.2 User Login
- **Method / Path:** `POST /api/auth/login`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "email": "jane@university.edu",
    "password": "Password@123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "token": "eyJhbGciOi...",
    "type": "Bearer",
    "id": 1,
    "fullName": "Jane Doe",
    "email": "jane@university.edu",
    "role": "STUDENT"
  }
  ```

### 1.3 Current User Info
- **Method / Path:** `GET /api/auth/me`
- **Access:** Authenticated (`STUDENT`, `RECRUITER`, `ADMIN`)
- **Response (200 OK):** User summary object with status and registration timestamp.

---

## 2. Student Profile Endpoints (`/api/student`)

### 2.1 Get Current Student Profile
- **Method / Path:** `GET /api/student/profile`
- **Access:** Authenticated (`STUDENT`, `ADMIN`)
- **Response (200 OK):** Complete student profile with embedded skills, projects, and certificates.

### 2.2 Update Student Profile
- **Method / Path:** `PUT /api/student/profile`
- **Access:** Authenticated (`STUDENT`, `ADMIN`)
- **Request Body:**
  ```json
  {
    "headline": "Distributed Systems Engineer",
    "bio": "Specializing in microservices and type-safe systems.",
    "phone": "+1 555-0192",
    "location": "San Francisco, CA",
    "institution": "Stanford University",
    "degree": "B.S. Computer Science",
    "graduationYear": "2026",
    "githubUrl": "https://github.com/janedoe",
    "linkedinUrl": "https://linkedin.com/in/janedoe",
    "portfolioUrl": "https://janedoe.dev"
  }
  ```

### 2.3 Get Student Dashboard Metrics
- **Method / Path:** `GET /api/student/stats`
- **Access:** Authenticated (`STUDENT`, `ADMIN`)
- **Response (200 OK):**
  ```json
  {
    "skillsCount": 5,
    "projectsCount": 2,
    "certificatesCount": 1,
    "profileCompletionPercentage": 95
  }
  ```

---

## 3. Skills Endpoints (`/api/student/skills`)

- `GET /api/student/skills`: List authenticated student's skills.
- `POST /api/student/skills`: Create skill (`name`, `category`, `proficiency`, `yearsOfExperience`).
- `PUT /api/student/skills/{id}`: Update skill.
- `DELETE /api/student/skills/{id}`: Delete skill.

---

## 4. Projects Endpoints (`/api/student/projects`)

- `GET /api/student/projects`: List authenticated student's projects.
- `POST /api/student/projects`: Add project (`title`, `description`, `techStack`, `liveDemoUrl`, `githubUrl`, `startDate`, `endDate`, `featured`).
- `PUT /api/student/projects/{id}`: Update project.
- `DELETE /api/student/projects/{id}`: Delete project.

---

## 5. Certificates Endpoints (`/api/student/certificates`)

- `GET /api/student/certificates`: List student's certificates.
- `POST /api/student/certificates`: Record certificate (`title`, `issuingOrganization`, `issueDate`, `expirationDate`, `credentialId`, `credentialUrl`).
- `PUT /api/student/certificates/{id}`: Update certificate.
- `DELETE /api/student/certificates/{id}`: Delete certificate.

---

## 6. Recruiter Endpoints (`/api/recruiter`)

- `GET /api/recruiter/students?query=...`: Search student talent by skill, name, or institution.
- `GET /api/recruiter/students/{profileId}`: View detailed candidate profile dossier.

---

## 7. Administrator Endpoints (`/api/admin`)

- `GET /api/admin/stats`: Aggregate platform telemetry (total accounts, students, recruiters, skills, projects).
- `GET /api/admin/users`: List all platform user accounts.
- `PUT /api/admin/users/{userId}/toggle-status`: Enable or disable a user account.
- `DELETE /api/admin/users/{userId}`: Irreversibly delete a user and associated data.

---

## 8. Health Endpoint (`/api/health`)

- `GET /api/health`: Service health and timestamp status check.
