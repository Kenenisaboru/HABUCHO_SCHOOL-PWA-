# 🧪 API Testing Guide

A comprehensive guide for testing all API endpoints using **cURL** or **Postman**.

---

## 📋 Prerequisites

- Backend server running on `http://localhost:5000`
- Valid JWT token from login

---

## 🔑 Getting Authentication Token

First, login to get a JWT token:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@habucho.edu",
    "password": "Password123!"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "Admin User",
      "role": "admin"
    }
  }
}
```

**Save the token for next requests:**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## ✅ Health Check

Verify backend is running:

```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Habucho School API is running"
}
```

---

## 🔐 Authentication Endpoints

### Register New User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Jane Doe",
    "email": "jane@habucho.edu",
    "password": "SecurePass123!",
    "role": "student"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@habucho.edu",
    "password": "Password123!"
  }'
```

### Get Profile

```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

---

## 👥 User Management Endpoints

### Get Dashboard Statistics

```bash
curl -X GET http://localhost:5000/api/users/stats \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "students": 150,
    "teachers": 25,
    "announcements": 45,
    "schedules": 60
  }
}
```

### List All Users (Admin)

```bash
curl -X GET "http://localhost:5000/api/users?page=1&limit=10&search=&role=" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Query Parameters:**
- `page` — Page number (default: 1)
- `limit` — Items per page (default: 10)
- `search` — Search by name or email
- `role` — Filter by role (admin, teacher, student)

### List Students Only

```bash
curl -X GET "http://localhost:5000/api/users/students?limit=50" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

### Get User by ID

```bash
curl -X GET http://localhost:5000/api/users/5 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

### Create User (Admin)

```bash
curl -X POST http://localhost:5000/api/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Doe",
    "email": "john@habucho.edu",
    "password": "Password123!",
    "role": "teacher"
  }'
```

### Update User (Admin)

```bash
curl -X PUT http://localhost:5000/api/users/5 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Updated",
    "email": "john.updated@habucho.edu",
    "role": "teacher"
  }'
```

### Delete User (Admin)

```bash
curl -X DELETE http://localhost:5000/api/users/5 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

---

## 📢 Announcements Endpoints

### List Announcements

```bash
curl -X GET "http://localhost:5000/api/announcements?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

### Create Announcement (Admin, Teacher)

```bash
curl -X POST http://localhost:5000/api/announcements \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Important: Exam Schedule",
    "content": "Final exams will start on June 1st. Please review syllabus."
  }'
```

### Update Announcement

```bash
curl -X PUT http://localhost:5000/api/announcements/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated: Exam Schedule",
    "content": "Final exams will start on June 5th."
  }'
```

### Delete Announcement

```bash
curl -X DELETE http://localhost:5000/api/announcements/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

---

## 📅 Schedules Endpoints

### List Schedules

```bash
curl -X GET "http://localhost:5000/api/schedules?page=1&limit=10&grade_level=11" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Query Parameters:**
- `page` — Page number
- `limit` — Items per page
- `grade_level` — Filter by grade

### Create Schedule (Admin)

```bash
curl -X POST http://localhost:5000/api/schedules \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "grade_level": "11",
    "subject": "Mathematics",
    "teacher_id": 2,
    "day": "Monday",
    "start_time": "08:00",
    "end_time": "09:30"
  }'
```

### Update Schedule (Admin)

```bash
curl -X PUT http://localhost:5000/api/schedules/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Physics",
    "start_time": "09:00",
    "end_time": "10:30"
  }'
```

### Delete Schedule (Admin)

```bash
curl -X DELETE http://localhost:5000/api/schedules/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

---

## 📝 Grades Endpoints

### List Grades

```bash
curl -X GET "http://localhost:5000/api/grades?page=1&limit=20" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Note:** Students see only their own grades.

### Create Grade (Teacher, Admin)

```bash
curl -X POST http://localhost:5000/api/grades \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": 5,
    "subject": "Mathematics",
    "score": 88.5,
    "semester": "Semester 1"
  }'
```

**Validation:**
- `score` must be 0-100
- All fields are required

### Update Grade

```bash
curl -X PUT http://localhost:5000/api/grades/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "score": 92
  }'
```

### Delete Grade

```bash
curl -X DELETE http://localhost:5000/api/grades/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

---

## 💬 Contact Endpoints

### Submit Message (Authenticated)

```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Student",
    "email": "john@email.com",
    "message": "I have a question about my grade."
  }'
```

### Get Messages (Admin Only)

```bash
curl -X GET "http://localhost:5000/api/contact?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

### Delete Message (Admin)

```bash
curl -X DELETE http://localhost:5000/api/contact/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

---

## 🧪 Error Scenarios

### Test: Invalid Token

```bash
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer invalid_token_here" \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### Test: Missing Authentication

```bash
curl -X GET http://localhost:5000/api/users \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "success": false,
  "message": "No token provided"
}
```

### Test: Insufficient Permissions

As student, try to access admin endpoint:

```bash
# First login as student
STUDENT_TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@habucho.edu","password":"Password123!"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# Then try admin-only endpoint
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "success": false,
  "message": "Access denied"
}
```

### Test: Invalid Input

```bash
curl -X POST http://localhost:5000/api/grades \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": 5,
    "subject": "Math",
    "score": 150,
    "semester": "S1"
  }'
```

**Response:**
```json
{
  "success": false,
  "message": "Score must be between 0 and 100"
}
```

---

## 🔄 Test Workflow

### Complete User Flow

```bash
# 1. Health check
curl http://localhost:5000/api/health

# 2. Login as admin
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@habucho.edu","password":"Password123!"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# 3. Get stats
curl -X GET http://localhost:5000/api/users/stats \
  -H "Authorization: Bearer $TOKEN"

# 4. Create new student
curl -X POST http://localhost:5000/api/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Test Student","email":"test@habucho.edu","password":"Pass123!","role":"student"}'

# 5. List users
curl -X GET "http://localhost:5000/api/users?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"

# 6. Create announcement
curl -X POST http://localhost:5000/api/announcements \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Announcement","content":"This is a test"}'

# 7. Get announcements
curl -X GET http://localhost:5000/api/announcements \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📮 Using Postman (Alternative to cURL)

### Import Postman Collection

1. Download [Postman](https://www.postman.com/)
2. Create new Collection: "Habucho API"
3. Create Requests:

**Request 1: Login**
- Method: POST
- URL: `http://localhost:5000/api/auth/login`
- Body (JSON):
```json
{
  "email": "admin@habucho.edu",
  "password": "Password123!"
}
```

**Request 2: Get Users**
- Method: GET
- URL: `http://localhost:5000/api/users?page=1&limit=10`
- Headers:
  - `Authorization: Bearer {{token}}`
  - `Content-Type: application/json`

4. Use Postman's **Pre-request Script** to save token:
```javascript
var jsonData = pm.response.json();
pm.environment.set("token", jsonData.data.token);
```

---

## ✅ Test Checklist

- [ ] Health endpoint responds
- [ ] Login returns valid token
- [ ] Get profile returns user data
- [ ] List users shows paginated results
- [ ] Create user works (admin)
- [ ] Update user works (admin)
- [ ] Delete user works (admin)
- [ ] List announcements works
- [ ] Create announcement works (admin/teacher)
- [ ] Update announcement works
- [ ] Delete announcement works
- [ ] List schedules works
- [ ] Create schedule works (admin only)
- [ ] List grades works (students see own)
- [ ] Create grade works (admin/teacher)
- [ ] Submit contact message works
- [ ] Get messages works (admin only)
- [ ] Invalid token returns error
- [ ] Missing auth returns error
- [ ] Invalid input returns validation error
- [ ] Access denied for insufficient permissions

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to server"
- Verify backend is running: `npm run dev`
- Check port 5000 is not in use

### Issue: "Invalid or expired token"
- Re-login to get fresh token
- Check token hasn't timed out

### Issue: "Database connection failed"
- Verify PostgreSQL is running
- Check DATABASE_URL in .env

### Issue: "Access denied"
- Verify you're using correct role
- Check endpoint requires admin/teacher role

---

## 📊 Performance Testing

### Load Test with Apache Bench

```bash
# Test concurrent requests (1000 requests, 100 concurrent)
ab -n 1000 -c 100 -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/users/stats
```

### Response Time Check

```bash
time curl http://localhost:5000/api/health
```

Should respond in < 100ms

---

**Happy testing! 🧪**
