# 🎓 Habucho Preparatory School - Management System (PWA)

A modern, production-ready **Progressive Web Application** for managing a Grade 11–12 school system. Built with **React 19**, **Tailwind CSS**, **Node.js/Express**, and **PostgreSQL**.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Database Setup](#database-setup)
- [API Endpoints](#api-endpoints)
- [User Roles & Access Control](#user-roles--access-control)
- [PWA Features](#pwa-features)
- [Key Components](#key-components)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)
- [Project Defense Guide](#project-defense-guide)
- [Contributing](#contributing)

---

## ✨ Features

### 🎯 Core Functionality
- **Role-Based Access Control (RBAC)** — Admin, Teacher, Student roles with JWT authentication
- **User Management** — Create, update, delete users; search and filter
- **Announcements** — Create, read, update, delete; role-based visibility
- **Schedule Management** — Manage class timetables and teacher assignments
- **Grade Tracking** — Teachers create grades; students view their own
- **Contact System** — Students submit messages; admins view and manage
- **Dashboard Analytics** — Statistics and charts using Chart.js

### 🌐 Progressive Web App (PWA)
- **Installable** — Install on desktop and mobile devices
- **Offline Support** — Service Worker caches static assets
- **Responsive Design** — Works seamlessly on all screen sizes
- **Dark Mode** — Built-in theme switching

### 🔒 Security
- **JWT Authentication** — Secure token-based auth
- **Password Hashing** — bcryptjs encryption
- **Protected Routes** — Frontend and backend route protection
- **Role-Based Authorization** — Fine-grained access control

---

## 🛠 Tech Stack

### Frontend
- **React 19** — UI library
- **Vite** — Fast build tool and dev server
- **Tailwind CSS** — Utility-first styling
- **React Router DOM** — Client-side routing
- **React Hook Form** — Form state management
- **Zustand** — Global state management
- **Axios** — HTTP client with interceptors
- **React Hot Toast** — Notifications
- **Chart.js + react-chartjs-2** — Data visualization
- **vite-plugin-pwa** — PWA plugin for offline support

### Backend
- **Node.js** — JavaScript runtime
- **Express.js** — Web framework
- **PostgreSQL** — Relational database
- **JWT** — Authentication
- **bcryptjs** — Password hashing
- **Multer** — File uploads
- **CORS** — Cross-origin requests
- **dotenv** — Environment variables

---

## 📁 Project Structure

```
Habucho-School-System/
│
├── client/                          # Frontend (React)
│   ├── public/
│   │   ├── manifest.json            # PWA manifest
│   │   ├── service-worker.js        # Offline caching
│   │   └── icons/                   # App icons
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── RoleGuard.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── StatCard.jsx
│   │   │   └── ...
│   │   ├── pages/                   # Public pages
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Contact.jsx
│   │   │   └── ...
│   │   ├── dashboards/              # Role-specific dashboards
│   │   │   ├── admin/
│   │   │   ├── teacher/
│   │   │   └── student/
│   │   ├── services/                # API calls
│   │   │   ├── api.js               # Axios config
│   │   │   └── authService.js       # API functions
│   │   ├── context/                 # Global state
│   │   │   ├── authStore.js         # Zustand auth
│   │   │   └── ThemeContext.jsx     # Dark mode
│   │   ├── utils/                   # Helper functions
│   │   ├── layouts/                 # Layout wrappers
│   │   └── App.jsx                  # Main router
│   ├── vite.config.js               # Vite + PWA config
│   ├── tailwind.config.js           # Tailwind config
│   ├── package.json
│   └── index.html
│
├── server/                          # Backend (Node.js + Express)
│   ├── config/
│   │   └── db.js                    # PostgreSQL pool
│   ├── controllers/                 # Business logic
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── announcementController.js
│   │   ├── scheduleController.js
│   │   ├── gradeController.js
│   │   └── contactController.js
│   ├── routes/                      # API endpoints
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   └── ...
│   ├── models/                      # Database queries
│   │   ├── userModel.js
│   │   ├── announcementModel.js
│   │   └── ...
│   ├── middleware/                  # Express middleware
│   │   ├── auth.js                  # JWT verification
│   │   ├── errorHandler.js
│   │   └── upload.js                # File handling
│   ├── migrations/                  # Database setup
│   │   ├── 001_create_users.sql
│   │   ├── 002_create_announcements.sql
│   │   ├── ...
│   │   ├── runMigrations.js
│   │   └── seed.js
│   ├── utils/
│   │   ├── jwt.js                   # Token generation
│   │   └── response.js              # Response formatting
│   ├── app.js                       # Express config
│   ├── server.js                    # Entry point
│   ├── .env.example
│   └── package.json
│
├── docs/                            # Documentation
│   ├── API_DOCUMENTATION.md
│   ├── ER_DIAGRAM.md
│   └── schema.sql
│
└── README.md                        # This file

```

---

## 📦 Prerequisites

- **Node.js** v18+ (download from https://nodejs.org/)
- **PostgreSQL** v12+ (download from https://www.postgresql.org/)
- **npm** or **yarn** package manager
- **Git** for version control (optional)

### Verify Installation
```bash
node --version    # Should be v18 or higher
npm --version     # Should be v9 or higher
psql --version    # Should be v12 or higher
```

---

## 🚀 Installation & Setup

### Step 1: Clone the Repository (or extract ZIP)
```bash
cd Habucho-School-System
```

### Step 2: Set Up Database (PostgreSQL)

1. **Open PostgreSQL command prompt** or terminal
2. **Create a new database:**
   ```sql
   CREATE DATABASE habucho_school;
   ```
3. **Verify creation:**
   ```sql
   \l  -- List all databases
   ```

### Step 3: Install Backend Dependencies
```bash
cd server
npm install
```

### Step 4: Configure Environment Variables (Server)

1. **Copy `.env.example` to `.env`:**
   ```bash
   cp .env.example .env
   ```
2. **Edit `.env` file** (use notepad or VS Code):
   ```env
   PORT=5000
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/habucho_school
   JWT_SECRET=your_very_secure_secret_key_12345
   NODE_ENV=development
   ```
   - Replace `your_password` with your PostgreSQL password
   - Keep `JWT_SECRET` long and random for production

### Step 5: Run Database Migrations
```bash
npm run migrate
```
Expected output:
```
✅ PostgreSQL connected successfully
📦 Running 5 migration(s)...
  ✅ 001_create_users.sql
  ✅ 002_create_announcements.sql
  ... (and so on)
✅ All migrations completed successfully.
```

### Step 6: Seed Demo Data
```bash
npm run seed
```
This creates 3 demo accounts: admin, teacher, student

### Step 7: Start Backend Server
```bash
npm run dev
```
Expected output:
```
✅ PostgreSQL connected successfully
🚀 Habucho School API running on http://localhost:5000
📚 Environment: development
```
Keep this terminal open.

### Step 8: Install Frontend Dependencies
In a **new terminal**, navigate to the client folder:
```bash
cd ../client
npm install
```

### Step 9: Create Frontend Environment File
In the **client** folder, create `.env.local`:
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 10: Start Frontend Dev Server
```bash
npm run dev
```
Expected output:
```
  VITE v6.0.7  ready in 345 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Step 11: Access the Application
Open your browser and go to:
```
http://localhost:5173/
```

---

## ▶️ Running the Application

### Start Backend (Terminal 1)
```bash
cd server
npm run dev
```

### Start Frontend (Terminal 2)
```bash
cd client
npm run dev
```

### Both Running?
- Frontend: http://localhost:5173/
- Backend API: http://localhost:5000/api/

---

## 🗄️ Database Setup

### Manual Database Creation (If using GUI tool)

1. Open **pgAdmin** or **DBeaver**
2. Create a new database: `habucho_school`
3. Connect to it
4. Run all migration SQL files in order (001 through 005)
5. Run the seed script

### Verify Database

Connect to the database and check tables:
```sql
\c habucho_school        -- Connect to database
\dt                      -- List all tables
SELECT * FROM users;     -- View demo data
```

### Reset Database (If Needed)
```bash
# Drop and recreate
psql -U postgres -c "DROP DATABASE habucho_school;"
psql -U postgres -c "CREATE DATABASE habucho_school;"

# Rerun migrations
npm run migrate
npm run seed
```

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:5000/api
```

All protected endpoints require:
```
Authorization: Bearer <your_jwt_token>
```

### Authentication
```
POST   /auth/register    — Register new user
POST   /auth/login       — Login (returns JWT token)
GET    /auth/profile     — Get current user (protected)
```

### Users (Admin Only)
```
GET    /users            — List users (search, filter, paginate)
GET    /users/stats      — Dashboard statistics
GET    /users/students   — List students (admin, teacher)
GET    /users/:id        — Get user by ID
POST   /users            — Create user
PUT    /users/:id        — Update user
DELETE /users/:id        — Delete user
```

### Announcements
```
GET    /announcements    — List announcements
POST   /announcements    — Create (admin, teacher only)
PUT    /announcements/:id  — Update (admin, teacher only)
DELETE /announcements/:id  — Delete (admin, teacher only)
```

### Schedules
```
GET    /schedules        — List schedules
POST   /schedules        — Create (admin only)
PUT    /schedules/:id    — Update (admin only)
DELETE /schedules/:id    — Delete (admin only)
```

### Grades
```
GET    /grades           — List grades (students see own)
POST   /grades           — Create (admin, teacher)
PUT    /grades/:id       — Update (admin, teacher)
DELETE /grades/:id       — Delete (admin, teacher)
```

### Contact
```
POST   /contact          — Submit message (authenticated)
GET    /contact          — View messages (admin only)
DELETE /contact/:id      — Delete message (admin only)
```

### Health
```
GET    /health           — API status check
```

### Example API Call (cURL)
```bash
curl -X GET http://localhost:5000/api/users/stats \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json"
```

---

## 🛡️ User Roles & Access Control

### Three Main Roles

| Role | Features | Access |
|------|----------|--------|
| **Admin** | Manage users, schedules, announcements, view all messages | Full system access |
| **Teacher** | Create/manage grades, view assigned schedules, create announcements | Dashboard, grade management |
| **Student** | View own grades, schedules, announcements; submit contact messages | Read-only for most features |

### Default Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@habucho.edu | Password123! |
| Teacher | teacher@habucho.edu | Password123! |
| Student | student@habucho.edu | Password123! |

### Role-Based Routes

After login, users are redirected to their role's dashboard:
- Admin: `/admin`
- Teacher: `/teacher`
- Student: `/student`

---

## 📱 PWA Features

### What Is a PWA?
A Progressive Web App is a web application that provides an app-like experience:
- ✅ Works offline
- ✅ Installable on desktop and mobile
- ✅ Fast loading
- ✅ Responsive design

### How to Install

#### On Desktop (Chrome)
1. Open http://localhost:5173 in Chrome
2. Click the **install icon** (top-right corner)
3. Click **Install**

#### On Mobile (Android)
1. Open http://localhost:5173 in mobile Chrome
2. Tap **⋮ (menu) → Install app**
3. Tap **Install**

#### On iOS
1. Open http://localhost:5173 in Safari
2. Tap **Share → Add to Home Screen**

### Offline Support
- The service worker caches static assets (CSS, JS, images)
- Static content loads offline
- API calls fail gracefully with "Offline" message
- When reconnected, app syncs data

### Service Worker
- Located: `/client/public/service-worker.js`
- Caches everything except API calls
- Automatically updated by vite-plugin-pwa

---

## 🧩 Key Components

### Frontend Components (Reusable)

#### ProtectedRoute
Wraps routes to require authentication. Redirects to login if not authenticated.
```jsx
<ProtectedRoute>
  <AdminDashboard />
</ProtectedRoute>
```

#### RoleGuard
Enforces role-based access. Shows access denied if role doesn't match.
```jsx
<RoleGuard allowedRoles={["admin"]}>
  <AdminDashboard />
</RoleGuard>
```

#### Sidebar
Navigation sidebar with links based on role. Collapsible on mobile.
```jsx
<Sidebar links={adminLinks} />
```

#### StatCard
Displays a statistic with icon and color. Used in dashboards.
```jsx
<StatCard title="Students" value={500} icon="🎓" color="blue" />
```

#### LoadingSpinner
Shows loading state while data fetches.
```jsx
<LoadingSpinner className="py-20" />
```

#### DashboardLayout
Wraps authenticated pages. Includes sidebar, top bar, logout button.
```jsx
<DashboardLayout links={adminLinks} title="Dashboard">
  {/* content */}
</DashboardLayout>
```

### Global State Management

#### Zustand Store (authStore.js)
Manages authentication state (token, user, login/logout).
```js
import useAuthStore from "../context/authStore";
const { user, logout } = useAuthStore();
```

#### Theme Context
Manages dark mode toggle.
```js
import { useTheme } from "../context/ThemeContext";
const { darkMode, toggleTheme } = useTheme();
```

---

## ⚙️ Environment Variables

### Backend (.env)
```env
# Server Port
PORT=5000

# Database URL (PostgreSQL)
DATABASE_URL=postgresql://postgres:password@localhost:5432/habucho_school

# JWT Secret (keep this VERY secret in production!)
JWT_SECRET=your_super_secret_jwt_key_change_in_production

# Environment (development or production)
NODE_ENV=development
```

### Frontend (.env.local)
```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api
```

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to PostgreSQL"
**Solution:**
- Check if PostgreSQL is running
- Verify DATABASE_URL is correct
- Check username/password

### Issue: "Port 5000 already in use"
**Solution:**
```bash
# Kill the process using port 5000
# On Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -i :5000
kill -9 <PID>
```

### Issue: "CORS error" when making API calls
**Solution:**
- Ensure backend is running on port 5000
- Check CORS is enabled in app.js
- Verify VITE_API_URL is correct

### Issue: "Migrations failed"
**Solution:**
```bash
# Reset database
psql -U postgres -c "DROP DATABASE habucho_school;"
psql -U postgres -c "CREATE DATABASE habucho_school;"

# Rerun migrations
npm run migrate
npm run seed
```

### Issue: Dark mode not working
**Solution:**
- Clear browser cache
- Check ThemeContext.jsx is imported in main.jsx
- Check Tailwind `dark:` classes are in components

---

## 📚 Project Defense Guide

### What to Explain

#### 1. **Architecture Overview** (3-5 minutes)
- Explain separation into frontend (React) and backend (Node.js)
- Database schema and relationships
- How JWT authentication works
- Role-based access control flow

#### 2. **Key Files to Show** (5-7 minutes)
- `server/app.js` — Express setup
- `client/src/App.jsx` — React routing and role guards
- `server/middleware/auth.js` — Authentication middleware
- `server/models/userModel.js` — Database queries
- `client/src/dashboards/admin/AdminDashboard.jsx` — Complex component with charts

#### 3. **Database Schema** (2-3 minutes)
- Show ER diagram (docs/ER_DIAGRAM.md)
- Explain relationships between tables
- Show sample queries

#### 4. **PWA Features** (2-3 minutes)
- Explain manifest.json
- Show service worker caching strategy
- Demonstrate offline functionality
- Show installation on device

#### 5. **Live Demo** (5-10 minutes)
- Login as different roles
- Navigate to each dashboard
- Show data CRUD operations
- Show responsive design (resize browser)
- Show dark mode toggle
- Show form validation
- Show toast notifications

#### 6. **Code Quality** (2-3 minutes)
- Explain clean architecture (MVC pattern)
- Show comments and documentation
- Explain error handling
- Show security practices (password hashing, JWT)

### Demo Scenario Script

```
1. Start application (both servers)
2. Navigate to http://localhost:5173/
3. Show Home page → About → Features → Announcements
4. Click "Student Portal"
5. Login as student@habucho.edu / Password123!
6. Show Student Dashboard → Grades → Schedule → Announcements
7. Logout, then login as teacher@habucho.edu
8. Show Teacher Dashboard → Create Grade
9. Logout, then login as admin@habucho.edu
10. Show Admin Dashboard → User Management (Create/Update/Delete)
11. Show Admin Dashboard → Statistics and Charts
12. Open DevTools → Network tab → Try offline mode
13. Show responsive design on mobile
14. Show dark mode toggle
15. Explain codebase structure and key files
16. Answer questions
```

### Common Questions & Answers

**Q: Why use Zustand instead of Redux?**
A: Zustand is lightweight, easier to learn, and sufficient for our app's complexity. It has less boilerplate than Redux.

**Q: How does JWT authentication work?**
A: User logs in → server verifies password → server generates JWT token → token stored in localStorage → token sent with each API request → server verifies token signature.

**Q: Why separate frontend and backend?**
A: Separation of concerns, easier to scale, can deploy independently, frontend can be served from CDN, backend can handle multiple clients.

**Q: How is offline support implemented?**
A: Service Worker intercepts network requests → caches static assets → when offline, serves from cache → API calls fail gracefully.

**Q: How are passwords stored securely?**
A: Passwords are hashed with bcryptjs (salt rounds: 10) before storing in database. Passwords are never stored in plain text.

---

## 🤝 Contributing

To improve this project:
1. Create a new branch: `git checkout -b feature/your-feature`
2. Make changes and test thoroughly
3. Commit: `git commit -m "Add your feature"`
4. Push: `git push origin feature/your-feature`
5. Open a pull request

---

## 📄 License

This project is created for educational purposes. It's part of a Grade 11–12 school project.

---

## 📞 Support

For issues or questions:
- Check the Troubleshooting section
- Review API documentation in `docs/API_DOCUMENTATION.md`
- Check database schema in `docs/schema.sql`

---

## 🎉 Final Notes

### For Project Defense
- **Practice your demo** beforehand
- **Know your codebase** thoroughly
- **Be ready to explain decisions** (why React? Why PostgreSQL? etc.)
- **Show enthusiasm** about what you built
- **Test everything** before defense day
- **Have backup screenshots** in case live demo fails

### Performance Tips
- The PWA loads very fast due to caching
- Responsive design works on all devices
- Database indexes help with large datasets
- Service Worker reduces server load

### Security Reminders
- Change `JWT_SECRET` in production
- Use HTTPS in production
- Validate all inputs
- Sanitize database queries (we use parameterized queries)
- Never commit `.env` files with real secrets

---

**Built with ❤️ for Habucho Preparatory School**

**Version:** 1.0.0  
**Last Updated:** 2026  
**Grade Level:** 11-12
