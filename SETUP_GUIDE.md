# ⚡ Quick Start Setup Guide

Follow this guide **step-by-step** to get Habucho School Management System running in **15 minutes**.

---

## 🎯 What You'll Do

1. ✅ Install PostgreSQL database
2. ✅ Set up backend server
3. ✅ Set up frontend client
4. ✅ Start both servers
5. ✅ Login and test

---

## 📋 Requirements

- **Node.js 18+** → Download: https://nodejs.org/
- **PostgreSQL 12+** → Download: https://www.postgresql.org/
- **VS Code** (optional) → Download: https://code.visualstudio.com/

### Verify Installation

Open **Command Prompt** (Windows) or **Terminal** (Mac/Linux) and run:

```bash
node --version
npm --version
psql --version
```

All should show version numbers (v18+, v9+, v12+).

---

## 🗄️ Step 1: Set Up PostgreSQL Database

### Windows

1. **Open pgAdmin** (installed with PostgreSQL)
2. **Right-click "Databases"** → **Create** → **Database**
3. **Name it:** `habucho_school`
4. **Click Create**

### Mac/Linux

Open Terminal and run:
```bash
psql -U postgres -c "CREATE DATABASE habucho_school;"
```

### Verify

Open **Command Prompt/Terminal** and run:
```bash
psql -U postgres -d habucho_school
\dt
\q
```

If no errors, database is ready! ✅

---

## 🚀 Step 2: Set Up Backend Server

### 2.1 Open Terminal and Navigate to Server

```bash
cd path/to/Habucho-School-System/server
```

Example:
```bash
cd "C:\Users\YourName\Documents\HBUCHO_PPSCHOOL\server"
```

### 2.2 Install Dependencies

```bash
npm install
```

Wait for all packages to download (~1-2 minutes).

### 2.3 Configure Environment

Copy `.env.example` to `.env`:

**Windows:**
```bash
copy .env.example .env
```

**Mac/Linux:**
```bash
cp .env.example .env
```

### 2.4 Edit `.env` File

Open `.env` in VS Code or Notepad and update:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/habucho_school
JWT_SECRET=habucho_school_secret_key_2026_super_secret
NODE_ENV=development
```

**IMPORTANT:** Replace `your_password` with your PostgreSQL password.

### 2.5 Run Database Migrations

```bash
npm run migrate
```

Expected output:
```
✅ PostgreSQL connected successfully
📦 Running 5 migration(s)...
  ✅ 001_create_users.sql
  ✅ 002_create_announcements.sql
  ✅ 003_create_schedules.sql
  ✅ 004_create_grades.sql
  ✅ 005_create_contact_messages.sql
✅ All migrations completed successfully.
```

### 2.6 Seed Demo Data

```bash
npm run seed
```

This creates demo accounts.

### 2.7 Start Backend Server

```bash
npm run dev
```

Expected output:
```
✅ PostgreSQL connected successfully
🚀 Habucho School API running on http://localhost:5000
📚 Environment: development
```

**✅ Leave this terminal open and running!**

---

## 💻 Step 3: Set Up Frontend Client

### 3.1 Open a **NEW Terminal** and Navigate to Client

```bash
cd path/to/Habucho-School-System/client
```

Example:
```bash
cd "C:\Users\YourName\Documents\HBUCHO_PPSCHOOL\client"
```

### 3.2 Install Dependencies

```bash
npm install
```

Wait for installation (~1-2 minutes).

### 3.3 Create Environment File

Create a file named `.env.local` in the client folder:

**Windows (Command Prompt):**
```bash
echo VITE_API_URL=http://localhost:5000/api > .env.local
```

**Windows (PowerShell):**
```bash
"VITE_API_URL=http://localhost:5000/api" | Out-File -FilePath .env.local
```

**Mac/Linux:**
```bash
echo "VITE_API_URL=http://localhost:5000/api" > .env.local
```

Or manually create `.env.local` file with content:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3.4 Start Frontend Dev Server

```bash
npm run dev
```

Expected output:
```
  VITE v6.0.7  ready in 345 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

---

## 🌐 Step 4: Open Application

Open your web browser (Chrome, Firefox, Edge) and go to:

```
http://localhost:5173/
```

You should see the **Habucho School** home page! 🎉

---

## 🔐 Step 5: Login with Demo Accounts

### Create Account or Login

On the home page, click **"Student Portal"** or navigate to `/login`

### Demo Credentials

Try these accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@habucho.edu | Password123! |
| Teacher | teacher@habucho.edu | Password123! |
| Student | student@habucho.edu | Password123! |

### Test Each Role

1. **Login as Admin** → `/admin` → See User Management & Analytics
2. **Logout** → Login as **Teacher** → `/teacher` → See Grade Management
3. **Logout** → Login as **Student** → `/student` → See Your Grades

---

## 📱 Step 6: Try PWA Features (Optional)

### Install as App (Chrome)

1. Open http://localhost:5173/
2. Look for **install icon** (top-right of address bar)
3. Click and select **"Install"**
4. App appears on your desktop! 📲

### Try Offline Mode

1. Open DevTools: **F12** or **Ctrl+Shift+I**
2. Go to **Network** tab
3. Check **"Offline"** checkbox
4. Navigate app → Most features still work!
5. Try API call → See "Offline" message

---

## ✅ All Set!

### Two Terminals Should Be Running

**Terminal 1 (Backend):**
```
🚀 Habucho School API running on http://localhost:5000
```

**Terminal 2 (Frontend):**
```
➜  Local:   http://localhost:5173/
```

### Common Commands

```bash
# Backend
npm run dev          # Start dev server
npm run migrate      # Run migrations
npm run seed         # Seed demo data

# Frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

---

## 🐛 Troubleshooting

### Problem: "Cannot connect to PostgreSQL"

**Solution:**
1. Open **pgAdmin** or **SQL Shell**
2. Verify PostgreSQL is running
3. Check username/password in `.env`
4. Create database: `CREATE DATABASE habucho_school;`

### Problem: "npm ERR! 404 Not Found"

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Try install again
npm install
```

### Problem: "Port 5000 already in use"

**Solution:**
Find and kill process:

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### Problem: "Module not found"

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Problem: "CORS error"

**Solution:**
- Ensure backend is running on port 5000
- Check VITE_API_URL in `.env.local`
- Restart both servers

---

## 🎓 What to Show During Project Defense

1. **Home Page** → About → Features
2. **Login** → Admin → Users Management
3. **Create New User** → Edit → Delete
4. **View Analytics** → Charts
5. **Announcements** → Create New
6. **Logout** → Login as Teacher
7. **Teacher Dashboard** → Enter Grades
8. **Logout** → Login as Student
9. **Student Grades** → PDF Export
10. **Dark Mode** Toggle
11. **Mobile Responsive** (F12 → Toggle Device Mode)
12. **Offline** Mode (Network tab → Offline checkbox)

---

## 📚 Next Steps

1. ✅ Read [README.md](README.md) for full documentation
2. ✅ Check [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) for API details
3. ✅ Review source code in `client/src/` and `server/`
4. ✅ Practice project defense
5. ✅ Test all features thoroughly

---

## 🎉 Success!

You now have a fully functional **Production-Ready PWA** for school management!

### Key Features Ready:
- ✅ Role-based authentication
- ✅ Dashboard analytics
- ✅ User management
- ✅ Schedule tracking
- ✅ Grade management
- ✅ Announcements
- ✅ Contact messages
- ✅ Offline support
- ✅ Installable app
- ✅ Dark mode

---

## ❓ Questions?

Check:
- `README.md` — Full documentation
- `docs/API_DOCUMENTATION.md` — API details
- `docs/ER_DIAGRAM.md` — Database structure
- Source code comments

---

**Happy Coding! 🚀**
