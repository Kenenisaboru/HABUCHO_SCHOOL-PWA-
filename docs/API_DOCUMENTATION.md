# API Documentation

Base URL: `http://localhost:5000/api`

All protected routes require header: `Authorization: Bearer <token>`

Error response format:
```json
{ "success": false, "message": "Error message" }
```

Success response format:
```json
{ "success": true, "message": "Success", "data": { ... } }
```

---

## Authentication

### POST /auth/register
Register a new user.

**Body:**
```json
{
  "full_name": "John Doe",
  "email": "john@habucho.edu",
  "password": "Password123!",
  "role": "student"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbG...",
    "user": { "id": 1, "name": "John Doe", "role": "student" }
  }
}
```

### POST /auth/login
Login with email and password.

**Body:**
```json
{ "email": "admin@habucho.edu", "password": "Password123!" }
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbG...",
    "user": { "id": 1, "name": "Admin User", "role": "admin" }
  }
}
```

### GET /auth/profile
Get current user profile. **Auth required.**

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "full_name": "Admin User",
    "email": "admin@habucho.edu",
    "role": "admin"
  }
}
```

---

## Users (Admin Only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /users/stats | Dashboard statistics |
| GET | /users | List users (search, filter, pagination) |
| GET | /users/students | List students (admin, teacher) |
| GET | /users/:id | Get user by ID |
| POST | /users | Create user |
| PUT | /users/:id | Update user |
| DELETE | /users/:id | Delete user |

**Query params for GET /users:**
- `search` — Search by name or email
- `role` — Filter by role (`admin`, `teacher`, `student`)
- `page` — Page number (default: 1)
- `limit` — Items per page (default: 10)

**Query params for GET /users/students:**
- `search` — Search student by name or email
- `page` — Page number
- `limit` — Items per page (default: 100)

**Body (POST /users):**
```json
{
  "full_name": "Jane Smith",
  "email": "jane@habucho.edu",
  "password": "Password123!",
  "role": "teacher"
}
```

**Body (PUT /users/:id):**
```json
{
  "full_name": "Jane Smith",
  "email": "jane@habucho.edu",
  "role": "teacher",
  "password": "NewPassword123!"
}
```

**Response examples:**
- `GET /users/stats` returns counts for students, teachers, announcements, and schedules.
- `GET /users` returns paginated `users` with `pagination` metadata.

---

## Announcements

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /announcements | Authenticated users | List announcements |
| POST | /announcements | Admin, Teacher | Create announcement |
| PUT | /announcements/:id | Admin, Teacher | Update announcement |
| DELETE | /announcements/:id | Admin, Teacher | Delete announcement |

**Body (POST/PUT):**
```json
{
  "title": "Title",
  "content": "Content text"
}
```

---

## Schedules

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /schedules | Admin, Teacher, Student | List schedules |
| POST | /schedules | Admin | Create schedule |
| PUT | /schedules/:id | Admin | Update schedule |
| DELETE | /schedules/:id | Admin | Delete schedule |

**Query params for GET /schedules:**
- `grade_level` — Filter by grade level
- `page` — Page number (default: 1)
- `limit` — Items per page (default: 10)

**Behavior notes:**
- Teachers only see schedules assigned to their own `teacher_id`.
- Students and admins can view all applicable schedules.

**Body (POST):**
```json
{
  "grade_level": "11",
  "subject": "Mathematics",
  "teacher_id": 2,
  "day": "Monday",
  "start_time": "08:00",
  "end_time": "09:30"
}
```

---

## Grades

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /grades | Authenticated users | List grades |
| POST | /grades | Admin, Teacher | Create grade |
| PUT | /grades/:id | Admin, Teacher | Update grade |
| DELETE | /grades/:id | Admin, Teacher | Delete grade |

**Query params for GET /grades:**
- `student_id` — Filter by student (admin and teacher only)
- `page` — Page number (default: 1)
- `limit` — Items per page (default: 10)

**Behavior notes:**
- Students see only their own grades.
- Teachers see grades for their own `teacher_id`, and may filter by `student_id`.
- Admins can view all grades and filter by `student_id`.

**Body (POST):**
```json
{
  "student_id": 4,
  "subject": "Mathematics",
  "score": 88.5,
  "semester": "Semester 1"
}
```

---

## Contact

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /contact | Authenticated | Submit message |
| GET | /contact | Admin | View all messages |
| DELETE | /contact/:id | Admin | Delete message |

**Query params for GET /contact:**
- `page` — Page number (default: 1)
- `limit` — Items per page (default: 10)

**Body (POST):**
```json
{
  "name": "John",
  "email": "john@email.com",
  "message": "Hello"
}
```

---

## Health Check

### GET /health
```json
{ "success": true, "message": "Habucho School API is running" }
```

---

## Sample Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@habucho.edu | Password123! |
| Teacher | teacher@habucho.edu | Password123! |
| Student | student@habucho.edu | Password123! |
