# Design Document — Public School Website (Phase 1 MVP)

## Overview

This document describes the technical design for Phase 1 MVP of the Habucho Preparatory School public website enhancement. The design extends the existing React + Express + PostgreSQL architecture with new public-facing pages (Homepage redesign, Academics, Admissions, Gallery) and admin CMS capabilities (News/Events management, Gallery management, Staff profile management).

All new features integrate into existing patterns: numbered SQL migrations, Express routers/controllers/models, the shared axios `api` instance, `useFetch` hook, `react-hook-form`, `react-hot-toast`, `sendSuccess`/`sendError` response helpers, `authenticateUser`/`authorizeRoles` middleware, and the `upload` multer middleware.

---

## Architecture

### High-Level Integration

The new features add two layers to the existing system:

1. **Public Layer** — New public pages rendered inside `MainLayout` (Navbar + Footer), accessible without authentication. New routes (`/academics`, `/admissions`, `/gallery`) are registered alongside existing public routes in `App.jsx`. These pages consume new public API endpoints under `/api/public/*` which require no auth but are rate-limited via the existing `apiLimiter`.

2. **Admin CMS Layer** — New admin dashboard pages rendered inside `DashboardLayout` with `RoleGuard("admin")`, accessible at `/admin/events`, `/admin/gallery`, `/admin/staff`. These pages consume new admin API endpoints under `/api/events`, `/api/gallery`, `/api/staff`, `/api/admissions` which require `authenticateUser` + `authorizeRoles("admin")`.

The existing Homepage (`/`) is redesigned in place — the `Home.jsx` component is updated to add CTA links to the new pages and restructured sections, while retaining the existing stats fetch from `/api/public/stats`.

### Request Flow

```
Public Page (e.g., Academics.jsx)
  → useFetch(getAcademicPrograms)
    → publicService.js: api.get("/public/programs")
      → publicRoutes.js (apiLimiter applied)
        → publicController.js
          → publicModel.js (pool.query)
            → PostgreSQL: academic_programs table

Admin Page (e.g., AdminEvents.jsx)
  → eventService.js: api.get("/events")
    → eventRoutes.js (authenticateUser + authorizeRoles("admin"))
      → eventController.js
        → eventModel.js (pool.query)
          → PostgreSQL: events table
```

### File Organization

New backend files follow the existing `routes/ → controllers/ → models/` structure:

```
server/
  migrations/
    011_create_events.sql
    012_create_gallery_images.sql
    013_create_admission_applications.sql
    014_create_staff_profiles.sql
    015_create_academic_programs.sql
    016_create_website_settings.sql
  routes/
    publicRoutes.js          (extended — add new public endpoints)
    eventRoutes.js           (new)
    galleryRoutes.js         (new)
    staffRoutes.js           (new)
    admissionRoutes.js       (new)
  controllers/
    publicController.js      (extended — add new public handlers)
    eventController.js       (new)
    galleryController.js      (new)
    staffController.js       (new)
    admissionController.js    (new)
  models/
    publicModel.js           (extended — add program/gallery/event queries)
    eventModel.js             (new)
    galleryModel.js           (new)
    staffModel.js             (new)
    admissionModel.js         (new)
  middleware/
    upload.js                 (extended — add documentUpload variant for PDFs)
    validate.js               (extended — add validation rules for new entities)
  app.js                      (extended — register new route files)
```

New frontend files follow the existing `pages/`, `dashboards/admin/`, `services/` structure:

```
client/src/
  pages/
    Academics.jsx             (new)
    Admissions.jsx             (new)
    Gallery.jsx                (new)
    Home.jsx                   (modified — add CTA links, restructure)
  dashboards/admin/
    AdminEvents.jsx            (new)
    AdminGallery.jsx            (new)
    AdminStaff.jsx              (new)
  services/
    publicService.js           (extended — add program/gallery/event/admission functions)
    eventService.js            (new)
    galleryService.js           (new)
    staffService.js             (new)
    admissionService.js         (new)
  config/
    navLinks.js                (modified — add section grouping to adminLinks)
  components/
    Navbar.jsx                 (modified — add /academics, /admissions, /gallery links)
    Sidebar.jsx                (modified — render section labels)
  App.jsx                      (modified — add new lazy-loaded routes)
```

---

## Components and Interfaces

### Existing Components (reused)

| Component | Location | Usage in New Features |
|-----------|----------|----------------------|
| `MainLayout` | `layouts/MainLayout.jsx` | Wraps all new public pages (Academics, Admissions, Gallery) |
| `DashboardLayout` | `layouts/DashboardLayout.jsx` | Wraps all new admin pages (AdminEvents, AdminGallery, AdminStaff) |
| `Navbar` | `components/Navbar.jsx` | Modified — add /academics, /admissions, /gallery links |
| `Sidebar` | `components/Sidebar.jsx` | Modified — render section labels for grouped navLinks |
| `Reveal` | `components/Reveal.jsx` | Scroll animations on public page sections |
| `SkeletonLoader` | `components/SkeletonLoader.jsx` | Loading states for public and admin pages |
| `LoadingSpinner` | `components/LoadingSpinner.jsx` | Suspense fallback for lazy-loaded routes |
| `Pagination` | `components/Pagination.jsx` | Paginated admin event/admission tables |
| `StatCard` | `components/StatCard.jsx` | Count displays at top of admin management pages |
| `PageHeader` | `components/PageHeader.jsx` | Hero sections on public pages |
| `ProtectedRoute` | `components/ProtectedRoute.jsx` | Auth guard for admin routes (existing, no changes) |
| `RoleGuard` | `components/RoleGuard.jsx` | Role guard for admin routes (existing, no changes) |

### New Page Components

#### Academics.jsx (`client/src/pages/Academics.jsx`)

```jsx
// Interface: no props, fetches data internally via useFetch
const Academics = () => {
  const { data: programs, loading, error, execute } = useFetch(getAcademicPrograms, []);
  // Renders: MainLayout > PageHeader > content grid or empty/error/loading state
  // CTA: Link to /admissions
};
```

#### Admissions.jsx (`client/src/pages/Admissions.jsx`)

```jsx
// Interface: no props, manages two forms internally
const Admissions = () => {
  // Application form: react-hook-form with 11 fields + file upload
  // Status lookup form: single reference number input
  // State: submittedRef (string|null), statusResult (object|null)
  // Renders: MainLayout > two-column layout (requirements + form)
};
```

#### Gallery.jsx (`client/src/pages/Gallery.jsx`)

```jsx
// Interface: no props, fetches images via useFetch
const Gallery = () => {
  const { data: images, loading, error, execute } = useFetch(getGalleryImages, []);
  const [lightboxImage, setLightboxImage] = useState(null);
  // Renders: MainLayout > responsive grid + lightbox modal
};
```

### New Admin Dashboard Components

#### AdminEvents.jsx (`client/src/dashboards/admin/AdminEvents.jsx`)

```jsx
// Interface: no props, uses usePagination hook + eventService
const AdminEvents = () => {
  // State: events[], pagination, modalOpen, editingEvent, formData
  // Form: react-hook-form with title, content, event_date, category, image
  // Table columns: title, date, category, status, actions (edit, delete)
  // Renders: StatCard (count) + table + Pagination + modal form
};
```

#### AdminGallery.jsx (`client/src/dashboards/admin/AdminGallery.jsx`)

```jsx
// Interface: no props, uses galleryService
const AdminGallery = () => {
  // State: images[], modalOpen, formData
  // Upload form: title, caption, image file (multer upload)
  // Grid: thumbnails with title + delete button
  // Renders: StatCard (count) + upload form + image grid
};
```

#### AdminStaff.jsx (`client/src/dashboards/admin/AdminStaff.jsx`)

```jsx
// Interface: no props, uses staffService
const AdminStaff = () => {
  // State: staff[], modalOpen, editingStaff, formData
  // Form: react-hook-form with name, title, department, bio, photo, display_order
  // Table columns: name, title, department, display_order, actions (edit, delete)
  // Renders: StatCard (count) + table + modal form
};
```

### Component Interaction Diagram

```
App.jsx
├── Public Routes (no auth)
│   ├── Home.jsx → MainLayout → Navbar → stats from /api/public/stats
│   ├── Academics.jsx → MainLayout → useFetch(getAcademicPrograms)
│   ├── Admissions.jsx → MainLayout → react-hook-form → submitAdmission()
│   ├── Gallery.jsx → MainLayout → useFetch(getGalleryImages) → lightbox
│   └── (existing: About, Announcements, Schedule, Contact, Login)
│
└── Protected Routes (auth + role guard)
    └── Admin Portal
        └── DashboardLayout (links=adminLinks with sections)
            ├── AdminDashboard.jsx (existing)
            ├── AdminUsers.jsx (existing)
            ├── AdminSchedules.jsx (existing)
            ├── AdminAnnouncements.jsx (existing)
            ├── AdminMessages.jsx (existing)
            ├── Profile.jsx (existing)
            ├── AdminEvents.jsx (new) → eventService → /api/events
            ├── AdminGallery.jsx (new) → galleryService → /api/gallery
            └── AdminStaff.jsx (new) → staffService → /api/staff
```

### Backend Interface Contracts

#### Controller → Model Interface

Each controller imports its corresponding model as a namespace (`import * as Model from "../models/model.js"`) and calls exported async functions. All model functions return plain objects/arrays from `pool.query` results.

#### Route → Controller Interface

Routes map HTTP methods + paths to controller functions. Middleware is applied in order: `authenticateUser` → `authorizeRoles("admin")` → optional validators → `upload.single("file")` → controller.

#### Service → API Interface

Frontend services export functions that return `api.get/post/put/delete` promises. The shared `api` axios instance handles base URL, cookies, and token refresh. Services for file uploads pass `FormData` with `multipart/form-data` content type header.

---

## Data Models

### Database Tables

All tables use the existing PostgreSQL conventions: `SERIAL PRIMARY KEY` for id, `TIMESTAMP DEFAULT CURRENT_TIMESTAMP` for created_at/updated_at, `INTEGER REFERENCES users(id) ON DELETE SET NULL` for audit columns, and the `update_updated_at_column()` trigger function for automatic timestamp updates.

#### events

| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| title | VARCHAR(255) | NOT NULL |
| content | TEXT | |
| event_date | DATE | |
| category | VARCHAR(50) | |
| status | VARCHAR(20) | DEFAULT 'published' |
| image_path | VARCHAR(500) | |
| created_by | INTEGER | REFERENCES users(id) ON DELETE SET NULL |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

Indexes: `idx_events_event_date` (event_date DESC), `idx_events_category` (category), `idx_events_status` (status)
Trigger: `update_events_updated_at` BEFORE UPDATE

#### gallery_images

| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| title | VARCHAR(255) | NOT NULL |
| caption | TEXT | |
| image_path | VARCHAR(500) | NOT NULL |
| display_order | INTEGER | DEFAULT 0 |
| created_by | INTEGER | REFERENCES users(id) ON DELETE SET NULL |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

Indexes: `idx_gallery_display_order` (display_order), `idx_gallery_created_at` (created_at DESC)
Trigger: `update_gallery_images_updated_at` BEFORE UPDATE

#### admission_applications

| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| reference_number | VARCHAR(50) | UNIQUE NOT NULL |
| applicant_name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(100) | NOT NULL |
| phone | VARCHAR(20) | |
| date_of_birth | DATE | |
| gender | VARCHAR(10) | |
| grade_level | VARCHAR(20) | |
| parent_name | VARCHAR(100) | |
| parent_phone | VARCHAR(20) | |
| address | TEXT | |
| previous_school | VARCHAR(150) | |
| message | TEXT | |
| document_paths | TEXT[] | (PostgreSQL array) |
| status | VARCHAR(20) | DEFAULT 'pending' |
| reviewed_by | INTEGER | REFERENCES users(id) ON DELETE SET NULL |
| reviewed_at | TIMESTAMP | |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

Indexes: `idx_admissions_reference_number` (reference_number), `idx_admissions_status` (status), `idx_admissions_created_at` (created_at DESC)
Trigger: `update_admission_applications_updated_at` BEFORE UPDATE

#### staff_profiles

| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| name | VARCHAR(100) | NOT NULL |
| title | VARCHAR(100) | NOT NULL |
| department | VARCHAR(100) | |
| bio | TEXT | |
| photo_path | VARCHAR(500) | |
| display_order | INTEGER | DEFAULT 0 |
| is_active | BOOLEAN | DEFAULT TRUE |
| created_by | INTEGER | REFERENCES users(id) ON DELETE SET NULL |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

Indexes: `idx_staff_display_order` (display_order), `idx_staff_is_active` (is_active)
Trigger: `update_staff_profiles_updated_at` BEFORE UPDATE

#### academic_programs

| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| name | VARCHAR(255) | NOT NULL |
| description | TEXT | |
| category | VARCHAR(100) | |
| display_order | INTEGER | DEFAULT 0 |
| is_active | BOOLEAN | DEFAULT TRUE |
| created_by | INTEGER | REFERENCES users(id) ON DELETE SET NULL |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

Indexes: `idx_programs_display_order` (display_order), `idx_programs_is_active` (is_active), `idx_programs_category` (category)
Trigger: `update_academic_programs_updated_at` BEFORE UPDATE

#### website_settings

| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| key | VARCHAR(100) | UNIQUE NOT NULL |
| value | TEXT | |
| description | VARCHAR(255) | |
| updated_by | INTEGER | REFERENCES users(id) ON DELETE SET NULL |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

Index: `idx_website_settings_key` (key)

### Frontend Data Shapes

```typescript
// Academic Program (public)
interface AcademicProgram {
  id: number;
  name: string;
  description: string;
  category: string;
  display_order: number;
  is_active: boolean;
}

// Gallery Image (public)
interface GalleryImage {
  id: number;
  title: string;
  caption: string | null;
  image_path: string;
  display_order: number;
}

// Event (public + admin)
interface Event {
  id: number;
  title: string;
  content: string;
  event_date: string;
  category: string;
  status: "published" | "draft";
  image_path: string | null;
  created_at: string;
  updated_at: string;
}

// Staff Profile (admin)
interface StaffProfile {
  id: number;
  name: string;
  title: string;
  department: string;
  bio: string;
  photo_path: string | null;
  display_order: number;
  is_active: boolean;
}

// Admission Application (public submit + admin review)
interface AdmissionApplication {
  id: number;
  reference_number: string;
  applicant_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  grade_level: string;
  parent_name: string;
  parent_phone: string;
  address: string;
  previous_school: string;
  message: string;
  document_paths: string[];
  status: "pending" | "under_review" | "approved" | "rejected";
  reviewed_by: number | null;
  reviewed_at: string | null;
  created_at: string;
}

// Admission Status Response (public lookup)
interface AdmissionStatus {
  status: "pending" | "under_review" | "approved" | "rejected";
  applicantName: string;
  submittedAt: string;
}
```

---

## Database Design

### Migration Strategy

Six new migration files following the existing `NNN_description.sql` naming convention, starting at `011`. Each migration is automatically picked up by `runMigrations.js` which reads all `.sql` files from the migrations directory, filters out already-applied ones, and runs pending ones in sorted order within a single transaction.

### Migration 011: events table

```sql
-- Migration 011: Create events table for school news and events

CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  event_date DATE,
  category VARCHAR(50),
  status VARCHAR(20) DEFAULT 'published',
  image_path VARCHAR(500),
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date DESC);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);

DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Migration 012: gallery_images table

```sql
-- Migration 012: Create gallery_images table for school photo gallery

CREATE TABLE IF NOT EXISTS gallery_images (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  caption TEXT,
  image_path VARCHAR(500) NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_gallery_display_order ON gallery_images(display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_created_at ON gallery_images(created_at DESC);

DROP TRIGGER IF EXISTS update_gallery_images_updated_at ON gallery_images;
CREATE TRIGGER update_gallery_images_updated_at
  BEFORE UPDATE ON gallery_images
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Migration 013: admission_applications table

```sql
-- Migration 013: Create admission_applications table for online admissions

CREATE TABLE IF NOT EXISTS admission_applications (
  id SERIAL PRIMARY KEY,
  reference_number VARCHAR(50) UNIQUE NOT NULL,
  applicant_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  date_of_birth DATE,
  gender VARCHAR(10),
  grade_level VARCHAR(20),
  parent_name VARCHAR(100),
  parent_phone VARCHAR(20),
  address TEXT,
  previous_school VARCHAR(150),
  message TEXT,
  document_paths TEXT[],
  status VARCHAR(20) DEFAULT 'pending',
  reviewed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_admissions_reference_number ON admission_applications(reference_number);
CREATE INDEX IF NOT EXISTS idx_admissions_status ON admission_applications(status);
CREATE INDEX IF NOT EXISTS idx_admissions_created_at ON admission_applications(created_at DESC);

DROP TRIGGER IF EXISTS update_admission_applications_updated_at ON admission_applications;
CREATE TRIGGER update_admission_applications_updated_at
  BEFORE UPDATE ON admission_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Migration 014: staff_profiles table

```sql
-- Migration 014: Create staff_profiles table for public staff directory

CREATE TABLE IF NOT EXISTS staff_profiles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  title VARCHAR(100) NOT NULL,
  department VARCHAR(100),
  bio TEXT,
  photo_path VARCHAR(500),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_staff_display_order ON staff_profiles(display_order);
CREATE INDEX IF NOT EXISTS idx_staff_is_active ON staff_profiles(is_active);

DROP TRIGGER IF EXISTS update_staff_profiles_updated_at ON staff_profiles;
CREATE TRIGGER update_staff_profiles_updated_at
  BEFORE UPDATE ON staff_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Migration 015: academic_programs table

```sql
-- Migration 015: Create academic_programs table for public academics page

CREATE TABLE IF NOT EXISTS academic_programs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_programs_display_order ON academic_programs(display_order);
CREATE INDEX IF NOT EXISTS idx_programs_is_active ON academic_programs(is_active);
CREATE INDEX IF NOT EXISTS idx_programs_category ON academic_programs(category);

DROP TRIGGER IF EXISTS update_academic_programs_updated_at ON academic_programs;
CREATE TRIGGER update_academic_programs_updated_at
  BEFORE UPDATE ON academic_programs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Migration 016: website_settings table

```sql
-- Migration 016: Create website_settings table for configurable site settings

CREATE TABLE IF NOT EXISTS website_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  description VARCHAR(255),
  updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_website_settings_key ON website_settings(key);
```

Note: `website_settings` has no `updated_at` trigger in the requirements because it only has `updated_at` (no separate `created_at`), and the trigger function `update_updated_at_column()` is designed for `BEFORE UPDATE`. A trigger can still be added if needed, but the requirements specify only the `updated_at` column. Since there's no `created_at` column and the function sets `updated_at` on update, a trigger is not strictly necessary for this table in Phase 1 as it's not part of the active feature set.

### Reference Number Generation

The reference number is generated server-side in the admission controller using a format like `HAB-YYYY-XXXXXX` where `XXXXXX` is a random alphanumeric string. The generation uses `crypto.randomUUID()` (already imported in `upload.js`) or a combination of timestamp + random characters to ensure uniqueness. The `UNIQUE` constraint on `reference_number` in the database serves as the final guarantee — if a collision occurs (extremely unlikely), the insert fails and the controller can retry with a new number.

```javascript
// In admissionController.js
import crypto from "crypto";

const generateReferenceNumber = () => {
  const year = new Date().getFullYear();
  const random = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `HAB-${year}-${random}`;
};
```

---

## API Design

### Public API Endpoints (no auth, rate-limited via apiLimiter)

All new public endpoints are registered in the existing `publicRoutes.js` router, which already applies `apiLimiter` via `router.use(apiLimiter)`.

| Method | Path | Controller | Description |
|--------|------|------------|-------------|
| GET | `/api/public/programs` | `getPublicPrograms` | Returns active academic programs ordered by display_order |
| GET | `/api/public/gallery` | `getPublicGallery` | Returns gallery images ordered by display_order |
| GET | `/api/public/events` | `getPublicEvents` | Returns published events ordered by event_date DESC |
| POST | `/api/public/admissions` | `submitAdmission` | Creates admission application, returns reference number |
| GET | `/api/public/admissions/status/:referenceNumber` | `getAdmissionStatus` | Returns status, applicant name, submission date |

**Response format** (existing `sendSuccess`):
```json
{ "success": true, "message": "Success", "data": { ... } }
```

**POST /api/public/admissions** uses `multipart/form-data` with the `documentUpload` middleware (multer configured for images + PDFs). The controller extracts form fields from `req.body` and file paths from `req.files`, generates a reference number, inserts into `admission_applications`, and returns the reference number.

```javascript
// publicController.js — new handlers

export const getPublicPrograms = async (_req, res, next) => {
  try {
    const programs = await PublicModel.getActivePrograms();
    return sendSuccess(res, programs);
  } catch (err) { next(err); }
};

export const getPublicGallery = async (_req, res, next) => {
  try {
    const images = await PublicModel.getGalleryImages();
    return sendSuccess(res, images);
  } catch (err) { next(err); }
};

export const getPublicEvents = async (_req, res, next) => {
  try {
    const events = await PublicModel.getPublishedEvents();
    return sendSuccess(res, events);
  } catch (err) { next(err); }
};

export const submitAdmission = async (req, res, next) => {
  try {
    const documentPaths = (req.files || []).map(f => f.path);
    const referenceNumber = generateReferenceNumber();
    const application = await AdmissionModel.createApplication({
      ...req.body,
      document_paths: documentPaths,
      reference_number: referenceNumber,
    });
    return sendSuccess(res, { referenceNumber }, "Application submitted successfully", 201);
  } catch (err) { next(err); }
};

export const getAdmissionStatus = async (req, res, next) => {
  try {
    const application = await AdmissionModel.getByReferenceNumber(req.params.referenceNumber);
    if (!application) return sendError(res, "No application found for that reference number", 404);
    return sendSuccess(res, {
      status: application.status,
      applicantName: application.applicant_name,
      submittedAt: application.created_at,
    });
  } catch (err) { next(err); }
};
```

### Admin API Endpoints (auth + role guard)

New route files registered in `app.js` following the existing `app.use("/api/<resource>", routes)` pattern.

#### Events — `/api/events`

| Method | Path | Middleware | Controller |
|--------|------|------------|------------|
| GET | `/` | authenticateUser, authorizeRoles("admin") | `getEvents` (paginated) |
| GET | `/:id` | authenticateUser, authorizeRoles("admin") | `getEventById` |
| POST | `/` | authenticateUser, authorizeRoles("admin"), upload.single("image"), validateEvent | `createEvent` |
| PUT | `/:id` | authenticateUser, authorizeRoles("admin"), upload.single("image"), validateUpdateEvent | `updateEvent` |
| DELETE | `/:id` | authenticateUser, authorizeRoles("admin") | `deleteEvent` |

#### Gallery — `/api/gallery`

| Method | Path | Middleware | Controller |
|--------|------|------------|------------|
| GET | `/` | authenticateUser, authorizeRoles("admin") | `getGalleryImages` |
| POST | `/` | authenticateUser, authorizeRoles("admin"), upload.single("image") | `createGalleryImage` |
| DELETE | `/:id` | authenticateUser, authorizeRoles("admin") | `deleteGalleryImage` |

#### Staff — `/api/staff`

| Method | Path | Middleware | Controller |
|--------|------|------------|------------|
| GET | `/` | authenticateUser, authorizeRoles("admin") | `getStaffProfiles` |
| GET | `/:id` | authenticateUser, authorizeRoles("admin") | `getStaffProfileById` |
| POST | `/` | authenticateUser, authorizeRoles("admin"), upload.single("photo"), validateStaff | `createStaffProfile` |
| PUT | `/:id` | authenticateUser, authorizeRoles("admin"), upload.single("photo"), validateUpdateStaff | `updateStaffProfile` |
| DELETE | `/:id` | authenticateUser, authorizeRoles("admin") | `deleteStaffProfile` |

#### Admissions — `/api/admissions`

| Method | Path | Middleware | Controller |
|--------|------|------------|------------|
| GET | `/` | authenticateUser, authorizeRoles("admin") | `getAdmissions` (paginated) |
| GET | `/:id` | authenticateUser, authorizeRoles("admin") | `getAdmissionById` |
| PUT | `/:id/status` | authenticateUser, authorizeRoles("admin"), validateAdmissionStatus | `updateAdmissionStatus` |

The status update handler sets `status`, `reviewed_by` (from `req.user.id`), and `reviewed_at` (current timestamp):

```javascript
export const updateAdmissionStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "under_review", "approved", "rejected"];
    if (!validStatuses.includes(status)) {
      return sendError(res, "Invalid status value", 400);
    }
    const application = await AdmissionModel.updateStatus(req.params.id, {
      status,
      reviewed_by: req.user.id,
      reviewed_at: new Date(),
    });
    if (!application) return sendError(res, "Application not found", 404);
    return sendSuccess(res, application, "Status updated");
  } catch (err) { next(err); }
};
```

### Upload Middleware Extension

The existing `upload` middleware in `upload.js` only accepts image types (jpeg, png, gif, webp). The admissions form requires accepting PDFs as well. A new `documentUpload` export is added to the same file:

```javascript
// Extended upload.js — add document upload variant

const DOCUMENT_ALLOWED_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
]);

const documentFileFilter = async (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const extAllowed = /\.(jpe?g|png|gif|webp|pdf)$/.test(ext);
  if (!extAllowed) {
    return cb(new Error("Only image and PDF files are allowed"), false);
  }
  // ... magic byte validation (existing pattern, extended for PDF)
  // PDF magic bytes: %PDF
  try {
    const buffer = Buffer.alloc(4100);
    const fd = await import("fs").then((fs) => fs.promises.open(file.path, "r"));
    const { bytesRead } = await fd.read(buffer, 0, 4100, 0);
    await fd.close();
    const type = await fileTypeFromBuffer(buffer.subarray(0, bytesRead));
    if (type && DOCUMENT_ALLOWED_MIMES.has(type.mime)) {
      cb(null, true);
    } else if (DOCUMENT_ALLOWED_MIMES.has(file.mimetype)) {
      cb(null, true);
    } else if (buffer.subarray(0, 4).toString("ascii") === "%PDF") {
      cb(null, true); // PDF magic bytes
    } else {
      cb(new Error("File content does not match allowed types"), false);
    }
  } catch {
    if (DOCUMENT_ALLOWED_MIMES.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Could not verify file type"), false);
    }
  }
};

export const documentUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: documentFileFilter,
});
```

### Validation Rules (validate.js extensions)

New validation rules added to `validate.js` following the existing `body()` + `handleValidationErrors` pattern:

```javascript
export const validateEvent = [
  body("title").trim().notEmpty().withMessage("Title is required")
    .isLength({ max: 255 }).withMessage("Title must not exceed 255 characters"),
  body("content").optional().isLength({ max: 10000 }),
  body("event_date").optional().isISO8601().withMessage("Invalid date format"),
  body("category").optional().isLength({ max: 50 }),
  handleValidationErrors,
];

export const validateUpdateEvent = [
  body("title").optional().trim().isLength({ max: 255 }),
  body("content").optional().isLength({ max: 10000 }),
  body("event_date").optional().isISO8601(),
  body("category").optional().isLength({ max: 50 }),
  body("status").optional().isIn(["published", "draft"]).withMessage("Status must be published or draft"),
  handleValidationErrors,
];

export const validateStaff = [
  body("name").trim().notEmpty().withMessage("Name is required")
    .isLength({ max: 100 }),
  body("title").trim().notEmpty().withMessage("Title is required")
    .isLength({ max: 100 }),
  body("department").optional().isLength({ max: 100 }),
  body("bio").optional().isLength({ max: 5000 }),
  body("display_order").optional().isInt({ min: 0 }),
  handleValidationErrors,
];

export const validateUpdateStaff = [
  body("name").optional().trim().isLength({ max: 100 }),
  body("title").optional().trim().isLength({ max: 100 }),
  body("department").optional().isLength({ max: 100 }),
  body("bio").optional().isLength({ max: 5000 }),
  body("display_order").optional().isInt({ min: 0 }),
  body("is_active").optional().isBoolean(),
  handleValidationErrors,
];

export const validateAdmissionStatus = [
  body("status").isIn(["pending", "under_review", "approved", "rejected"])
    .withMessage("Status must be pending, under_review, approved, or rejected"),
  handleValidationErrors,
];
```

### app.js Registration

New route files imported and registered in `app.js`:

```javascript
import eventRoutes from "./routes/eventRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
import admissionRoutes from "./routes/admissionRoutes.js";

// ... existing registrations ...

app.use("/api/events", eventRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/admissions", admissionRoutes);
```

---

## Frontend Design

### Route Registration (App.jsx)

New public routes added alongside existing public routes (no auth, rendered directly, not wrapped in MainLayout since each page imports MainLayout itself — matching existing pattern where `Home.jsx` imports `MainLayout`):

```jsx
// New public pages (lazy-loaded)
const Academics = lazy(() => import("./pages/Academics"));
const Admissions = lazy(() => import("./pages/Admissions"));
const Gallery = lazy(() => import("./pages/Gallery"));

// New admin dashboards (lazy-loaded)
const AdminEvents = lazy(() => import("./dashboards/admin/AdminEvents"));
const AdminGallery = lazy(() => import("./dashboards/admin/AdminGallery"));
const AdminStaff = lazy(() => import("./dashboards/admin/AdminStaff"));

// In <Routes>:
{/* New Public Routes */}
<Route path="/academics" element={<Academics />} />
<Route path="/admissions" element={<Admissions />} />
<Route path="/gallery" element={<Gallery />} />

{/* Inside admin RoleGuard + DashboardLayout */}
<Route path="/admin/events" element={<AdminEvents />} />
<Route path="/admin/gallery" element={<AdminGallery />} />
<Route path="/admin/staff" element={<AdminStaff />} />
```

### Navbar Updates (Navbar.jsx)

Add three new links to the `navLinks` array in the Navbar component:

```jsx
import { Home, School, Megaphone, CalendarDays, MessageSquare, BookOpen, GraduationCap, Images } from "lucide-react";

const navLinks = [
  { to: "/", label: "Home", icon: Home },
  { to: "/about", label: "About", icon: School },
  { to: "/academics", label: "Academics", icon: BookOpen },
  { to: "/admissions", label: "Admissions", icon: GraduationCap },
  { to: "/gallery", label: "Gallery", icon: Images },
  { to: "/announcements", label: "News", icon: Megaphone },
  { to: "/schedule", label: "Schedule", icon: CalendarDays },
  { to: "/contact", label: "Contact", icon: MessageSquare },
];
```

### Admin Sidebar Restructure (navLinks.js + Sidebar.jsx)

The `adminLinks` array is restructured to support section grouping. Each link gets an optional `section` field. The `Sidebar` component is updated to render section labels as non-clickable group headers.

**navLinks.js changes:**

```jsx
import {
  LayoutDashboard, Users, CalendarDays, Megaphone, Mail, User,
  Newspaper, Images, UsersRound,
} from "lucide-react";

export const adminLinks = [
  // School Operations section
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true, section: "School Operations" },
  { to: "/admin/users", label: "Manage Users", icon: Users, section: "School Operations" },
  { to: "/admin/schedules", label: "Class Schedules", icon: CalendarDays, section: "School Operations" },
  { to: "/admin/announcements", label: "Announcements", icon: Megaphone, section: "School Operations" },
  { to: "/admin/messages", label: "Messages", icon: Mail, section: "School Operations" },
  { to: "/admin/profile", label: "Profile", icon: User, section: "School Operations" },
  // Website Management section
  { to: "/admin/events", label: "News & Events", icon: Newspaper, section: "Website Management" },
  { to: "/admin/gallery", label: "Gallery", icon: Images, section: "Website Management" },
  { to: "/admin/staff", label: "Staff Profiles", icon: UsersRound, section: "Website Management" },
];
```

**Sidebar.jsx changes:**

The Sidebar component groups links by their `section` field and renders a section label header before each group:

```jsx
// Group links by section
const groupedLinks = links.reduce((acc, link) => {
  const section = link.section || "Navigation";
  if (!acc[section]) acc[section] = [];
  acc[section].push(link);
  return acc;
}, {});

// In the nav section:
{Object.entries(groupedLinks).map(([sectionName, sectionLinks]) => (
  <div key={sectionName}>
    <p className="mb-2 mt-4 px-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">
      {sectionName}
    </p>
    <div className="space-y-0.5">
      {sectionLinks.map((link) => (
        <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
          {/* ... existing link rendering ... */}
        </NavLink>
      ))}
    </div>
  </div>
))}
```

### Public Page Components

#### Academics.jsx

```jsx
import MainLayout from "../layouts/MainLayout";
import Reveal from "../components/Reveal";
import SkeletonLoader from "../components/SkeletonLoader";
import useFetch from "../hooks/useFetch";
import { getAcademicPrograms } from "../services/publicService";
import { Link } from "react-router-dom";
import { BookOpen, GraduationCap } from "lucide-react";

const Academics = () => {
  const { data: programs, loading, error, execute } = useFetch(getAcademicPrograms, []);

  return (
    <MainLayout>
      {/* Hero section with PageHeader pattern */}
      {/* Loading: <SkeletonLoader count={3} /> */}
      {/* Error: error message + retry button calling execute() */}
      {/* Empty: "Academic program information will be available soon" */}
      {/* Data: grid of program cards with name, description, category */}
      {/* CTA: Link to /admissions */}
    </MainLayout>
  );
};
```

#### Admissions.jsx

```jsx
import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { submitAdmission, checkAdmissionStatus } from "../services/publicService";

const Admissions = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [submittedRef, setSubmittedRef] = useState(null);
  const [statusResult, setStatusResult] = useState(null);

  const onSubmit = async (data) => {
    // Build FormData with fields + files
    // Call submitAdmission(formData)
    // On success: setSubmittedRef(ref), reset form, toast.success
    // On error: toast.error
  };

  const onStatusCheck = async (data) => {
    // Call checkAdmissionStatus(refNumber)
    // On success: setStatusResult(result)
    // On 404: setStatusResult({ notFound: true })
  };

  return (
    <MainLayout>
      {/* Left column: Requirements + process steps */}
      {/* Right column: Application form (react-hook-form) */}
      {/* Status lookup form (separate) */}
      {/* Confirmation screen when submittedRef is set */}
    </MainLayout>
  );
};
```

The form uses `FormData` for multipart submission since it includes file uploads:

```jsx
const onSubmit = async (data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });
  // Append files from file input
  const files = fileInputRef.current?.files;
  if (files) {
    Array.from(files).forEach(file => formData.append("documents", file));
  }
  try {
    const res = await submitAdmission(formData);
    setSubmittedRef(res.data.data.referenceNumber);
    reset();
    toast.success("Application submitted!");
  } catch (err) {
    toast.error(err.response?.data?.message || "Submission failed");
  }
};
```

#### Gallery.jsx

```jsx
import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import SkeletonLoader from "../components/SkeletonLoader";
import useFetch from "../hooks/useFetch";
import { getGalleryImages } from "../services/publicService";

const Gallery = () => {
  const { data: images, loading, error, execute } = useFetch(getGalleryImages, []);
  const [lightboxImage, setLightboxImage] = useState(null);

  return (
    <MainLayout>
      {/* Hero section */}
      {/* Loading: skeleton grid */}
      {/* Error: message + retry */}
      {/* Empty: "Photos will be available soon" */}
      {/* Data: responsive grid of images with title + caption */}
      {/* Lightbox modal on image click */}
    </MainLayout>
  );
};
```

### Admin Dashboard Components

#### AdminEvents.jsx

```jsx
import { useState } from "react";
import usePagination from "../../hooks/usePagination";
import Pagination from "../../components/Pagination";
import { getEvents, createEvent, updateEvent, deleteEvent } from "../../services/eventService";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const AdminEvents = () => {
  // Paginated table of events
  // Create/edit modal with form (title, content, event_date, category, image upload)
  // Delete with confirmation
  // Count display at top
  // Uses StatCard for count, Pagination for table
};
```

#### AdminGallery.jsx

```jsx
import { getGalleryImages, createGalleryImage, deleteGalleryImage } from "../../services/galleryService";

const AdminGallery = () => {
  // Grid of gallery images with thumbnails, titles, delete buttons
  // Upload form (title, caption, image file)
  // Count display at top
  // Delete with confirmation + file cleanup
};
```

#### AdminStaff.jsx

```jsx
import { getStaffProfiles, createStaffProfile, updateStaffProfile, deleteStaffProfile } from "../../services/staffService";

const AdminStaff = () => {
  // Table of staff profiles (name, title, department, display_order, actions)
  // Create/edit modal with form (name, title, department, bio, photo, display_order)
  // Delete with confirmation
  // Count display at top
};
```

### Service Layer

#### publicService.js (extended)

```javascript
import api from "./api";

// Existing
export const getPublicStats = () => api.get("/public/stats");

// New
export const getAcademicPrograms = () => api.get("/public/programs");
export const getGalleryImages = () => api.get("/public/gallery");
export const getPublicEvents = () => api.get("/public/events");
export const submitAdmission = (formData) =>
  api.post("/public/admissions", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const checkAdmissionStatus = (referenceNumber) =>
  api.get(`/public/admissions/status/${referenceNumber}`);
```

#### eventService.js (new)

```javascript
import api from "./api";

export const getEvents = (page = 1, limit = 10) =>
  api.get("/events", { params: { page, limit } });
export const getEventById = (id) => api.get(`/events/${id}`);
export const createEvent = (formData) =>
  api.post("/events", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const updateEvent = (id, formData) =>
  api.put(`/events/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteEvent = (id) => api.delete(`/events/${id}`);
```

#### galleryService.js (new)

```javascript
import api from "./api";

export const getGalleryImages = () => api.get("/gallery");
export const createGalleryImage = (formData) =>
  api.post("/gallery", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteGalleryImage = (id) => api.delete(`/gallery/${id}`);
```

#### staffService.js (new)

```javascript
import api from "./api";

export const getStaffProfiles = () => api.get("/staff");
export const getStaffProfileById = (id) => api.get(`/staff/${id}`);
export const createStaffProfile = (formData) =>
  api.post("/staff", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const updateStaffProfile = (id, formData) =>
  api.put(`/staff/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteStaffProfile = (id) => api.delete(`/staff/${id}`);
```

#### admissionService.js (new)

```javascript
import api from "./api";

export const getAdmissions = (page = 1, limit = 10) =>
  api.get("/admissions", { params: { page, limit } });
export const getAdmissionById = (id) => api.get(`/admissions/${id}`);
export const updateAdmissionStatus = (id, status) =>
  api.put(`/admissions/${id}/status`, { status });
```

---

## Model Layer

Each new model follows the existing pattern: import `pool` from `config/db.js`, export async functions that return query results.

### publicModel.js (extended)

```javascript
export const getActivePrograms = async () => {
  const { rows } = await pool.query(
    "SELECT * FROM academic_programs WHERE is_active = TRUE ORDER BY display_order, id"
  );
  return rows;
};

export const getGalleryImages = async () => {
  const { rows } = await pool.query(
    "SELECT * FROM gallery_images ORDER BY display_order, id"
  );
  return rows;
};

export const getPublishedEvents = async () => {
  const { rows } = await pool.query(
    "SELECT * FROM events WHERE status = 'published' ORDER BY event_date DESC, id"
  );
  return rows;
};
```

### eventModel.js (new)

```javascript
import pool from "../config/db.js";

export const getAllEvents = async ({ limit, offset }) => {
  const countResult = await pool.query("SELECT COUNT(*) FROM events");
  const total = parseInt(countResult.rows[0].count, 10);
  const result = await pool.query(
    "SELECT * FROM events ORDER BY event_date DESC, created_at DESC LIMIT $1 OFFSET $2",
    [limit, offset]
  );
  return { events: result.rows, total };
};

export const getEventById = async (id) => {
  const result = await pool.query("SELECT * FROM events WHERE id = $1", [id]);
  return result.rows[0];
};

export const createEvent = async ({ title, content, event_date, category, status, image_path, created_by }) => {
  const result = await pool.query(
    `INSERT INTO events (title, content, event_date, category, status, image_path, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [title, content, event_date, category, status || "published", image_path, created_by]
  );
  return result.rows[0];
};

export const updateEvent = async (id, fields) => {
  const { title, content, event_date, category, status, image_path } = fields;
  const result = await pool.query(
    `UPDATE events SET
       title = COALESCE($1, title),
       content = COALESCE($2, content),
       event_date = COALESCE($3, event_date),
       category = COALESCE($4, category),
       status = COALESCE($5, status),
       image_path = COALESCE($6, image_path)
     WHERE id = $7 RETURNING *`,
    [title, content, event_date, category, status, image_path, id]
  );
  return result.rows[0];
};

export const deleteEvent = async (id) => {
  const result = await pool.query("DELETE FROM events WHERE id = $1 RETURNING id", [id]);
  return result.rows[0];
};

export const countEvents = async () => {
  const result = await pool.query("SELECT COUNT(*) FROM events");
  return parseInt(result.rows[0].count, 10);
};
```

### galleryModel.js (new)

```javascript
import pool from "../config/db.js";

export const getAllGalleryImages = async () => {
  const result = await pool.query("SELECT * FROM gallery_images ORDER BY display_order, id");
  return result.rows;
};

export const createGalleryImage = async ({ title, caption, image_path, display_order, created_by }) => {
  const result = await pool.query(
    `INSERT INTO gallery_images (title, caption, image_path, display_order, created_by)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [title, caption, image_path, display_order || 0, created_by]
  );
  return result.rows[0];
};

export const deleteGalleryImage = async (id) => {
  const result = await pool.query("SELECT image_path FROM gallery_images WHERE id = $1", [id]);
  if (result.rows[0]) {
    const { image_path } = result.rows[0];
    await pool.query("DELETE FROM gallery_images WHERE id = $1 RETURNING id", [id]);
    return { id, image_path }; // controller deletes the file
  }
  return null;
};

export const countGalleryImages = async () => {
  const result = await pool.query("SELECT COUNT(*) FROM gallery_images");
  return parseInt(result.rows[0].count, 10);
};
```

### staffModel.js (new)

```javascript
import pool from "../config/db.js";

export const getAllStaffProfiles = async () => {
  const result = await pool.query("SELECT * FROM staff_profiles ORDER BY display_order, id");
  return result.rows;
};

export const getStaffProfileById = async (id) => {
  const result = await pool.query("SELECT * FROM staff_profiles WHERE id = $1", [id]);
  return result.rows[0];
};

export const createStaffProfile = async ({ name, title, department, bio, photo_path, display_order, created_by }) => {
  const result = await pool.query(
    `INSERT INTO staff_profiles (name, title, department, bio, photo_path, display_order, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [name, title, department, bio, photo_path, display_order || 0, created_by]
  );
  return result.rows[0];
};

export const updateStaffProfile = async (id, fields) => {
  const { name, title, department, bio, photo_path, display_order, is_active } = fields;
  const result = await pool.query(
    `UPDATE staff_profiles SET
       name = COALESCE($1, name),
       title = COALESCE($2, title),
       department = COALESCE($3, department),
       bio = COALESCE($4, bio),
       photo_path = COALESCE($5, photo_path),
       display_order = COALESCE($6, display_order),
       is_active = COALESCE($7, is_active)
     WHERE id = $8 RETURNING *`,
    [name, title, department, bio, photo_path, display_order, is_active, id]
  );
  return result.rows[0];
};

export const deleteStaffProfile = async (id) => {
  const result = await pool.query("SELECT photo_path FROM staff_profiles WHERE id = $1", [id]);
  if (result.rows[0]) {
    const { photo_path } = result.rows[0];
    await pool.query("DELETE FROM staff_profiles WHERE id = $1 RETURNING id", [id]);
    return { id, photo_path };
  }
  return null;
};

export const countStaffProfiles = async () => {
  const result = await pool.query("SELECT COUNT(*) FROM staff_profiles");
  return parseInt(result.rows[0].count, 10);
};
```

### admissionModel.js (new)

```javascript
import pool from "../config/db.js";

export const getAllApplications = async ({ limit, offset }) => {
  const countResult = await pool.query("SELECT COUNT(*) FROM admission_applications");
  const total = parseInt(countResult.rows[0].count, 10);
  const result = await pool.query(
    "SELECT * FROM admission_applications ORDER BY created_at DESC LIMIT $1 OFFSET $2",
    [limit, offset]
  );
  return { applications: result.rows, total };
};

export const getApplicationById = async (id) => {
  const result = await pool.query("SELECT * FROM admission_applications WHERE id = $1", [id]);
  return result.rows[0];
};

export const getByReferenceNumber = async (referenceNumber) => {
  const result = await pool.query(
    "SELECT * FROM admission_applications WHERE reference_number = $1",
    [referenceNumber]
  );
  return result.rows[0];
};

export const createApplication = async (data) => {
  const result = await pool.query(
    `INSERT INTO admission_applications
     (reference_number, applicant_name, email, phone, date_of_birth, gender,
      grade_level, parent_name, parent_phone, address, previous_school, message,
      document_paths, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'pending')
     RETURNING *`,
    [
      data.reference_number, data.applicant_name, data.email, data.phone,
      data.date_of_birth, data.gender, data.grade_level, data.parent_name,
      data.parent_phone, data.address, data.previous_school, data.message,
      data.document_paths || [],
    ]
  );
  return result.rows[0];
};

export const updateStatus = async (id, { status, reviewed_by, reviewed_at }) => {
  const result = await pool.query(
    `UPDATE admission_applications SET
       status = $1, reviewed_by = $2, reviewed_at = $3
     WHERE id = $4 RETURNING *`,
    [status, reviewed_by, reviewed_at, id]
  );
  return result.rows[0];
};
```

---

## Error Handling

All error handling follows existing patterns:

1. **Controller level**: `try/catch` with `next(err)` to pass errors to the global `errorHandler` middleware
2. **Response helpers**: `sendError(res, message, statusCode)` for business logic errors, `sendSuccess(res, data, message, statusCode)` for success
3. **Validation**: `express-validator` rules in `validate.js` with `handleValidationErrors` middleware returning 422 for invalid input
4. **Auth failures**: `authenticateUser` returns 401, `authorizeRoles` returns 403
5. **File upload errors**: Multer `fileFilter` throws errors caught by the global error handler; frontend displays via `react-hot-toast`
6. **Frontend errors**: `useFetch` hook shows `toast.error` on API failures; forms display field-level validation errors via `react-hook-form`
7. **Not found**: Controllers return `sendError(res, "not found", 404)` when records don't exist
8. **Upload file deletion**: When deleting gallery images or staff profiles, the controller uses `fs.unlink` to remove the physical file, catching errors gracefully (file may already be gone)

### Frontend Error States

Each public page handles three states following the existing `useFetch` pattern:
- **Loading**: `SkeletonLoader` or custom skeleton grid
- **Error**: Error message with retry button (calls `execute()` from `useFetch`)
- **Empty**: Placeholder message ("will be available soon")

Admin pages handle:
- **Loading**: `SkeletonLoader` with `type="table"` or grid
- **Error**: `toast.error` notification
- **Empty**: Empty state message in table/grid

---

## Correctness Properties

*Properties are characteristics that should hold true across all valid executions — formal statements about what the system should do.*

### Property 1: Academic program display completeness

For any set of active Academic_Program records returned by the API, the Academics page SHALL render each program with its name, description, and category visible in the output.

**Validates: Requirements 2.2**

### Property 2: Admission submission creates record with reference number

For any valid admission application form data, submitting the form SHALL create an Admission_Application record in the database and return a non-empty Reference_Number to the caller.

**Validates: Requirements 3.4**

### Property 3: Form validation rejects incomplete submissions

For any form submission (admission application, event, or staff profile) with missing required fields, the system SHALL display validation errors for each missing field and SHALL NOT create or modify any database record.

**Validates: Requirements 3.5, 6.6, 8.6**

### Property 4: Reference number uniqueness

For any two distinct valid admission application submissions, the generated Reference_Numbers SHALL be different.

**Validates: Requirements 3.7**

### Property 5: Admission status lookup correctness

For any existing Admission_Application, querying by its Reference_Number SHALL return the correct current status (one of: pending, under_review, approved, rejected), the applicant name, and the submission date.

**Validates: Requirements 4.2, 4.4, 4.5**

### Property 6: Gallery image display with metadata

For any set of Gallery_Image records returned by the API, the Gallery page SHALL render each image with its title displayed, and SHALL display its caption when a caption is present on the record.

**Validates: Requirements 5.2, 5.6**

### Property 7: Event CRUD round-trip

For any valid Event data, the system SHALL support the full CRUD lifecycle: creating an Event record persists it, updating the record reflects the new values, and deleting the record removes it from the database.

**Validates: Requirements 6.3, 6.4, 6.5**

### Property 8: Admin events table completeness

For any set of Event records in the database, the admin events management page SHALL display all records with columns for title, date, category, status, and action buttons.

**Validates: Requirements 6.2**

### Property 9: Gallery image CRUD round-trip

For any valid gallery image upload with a title, the system SHALL create a Gallery_Image record with the stored file path, and deleting the record SHALL remove both the database record and the associated uploaded file.

**Validates: Requirements 7.3, 7.4**

### Property 10: Admin gallery grid completeness

For any set of Gallery_Image records in the database, the admin gallery management page SHALL display all records with thumbnail previews, titles, and delete buttons.

**Validates: Requirements 7.2**

### Property 11: Staff profile CRUD round-trip

For any valid Staff_Profile data, the system SHALL support the full CRUD lifecycle: creating a Staff_Profile persists it, updating the record reflects new values (including optional photo upload), and deleting the record removes it from the database.

**Validates: Requirements 8.3, 8.4, 8.5, 8.7**

### Property 12: Admin staff table completeness

For any set of Staff_Profile records in the database, the admin staff management page SHALL display all records with columns for name, title, department, display order, and action buttons.

**Validates: Requirements 8.2**

### Property 13: Updated_at trigger consistency

For any row in the events, gallery_images, admission_applications, staff_profiles, or academic_programs tables, updating any column SHALL set the `updated_at` timestamp to a value greater than the previous `updated_at` (or greater than `created_at` for the first update).

**Validates: Requirements 9.7**

### Property 14: Admin admission status update sets review metadata

For any Admission_Application whose status is updated by an Admin, the system SHALL set the `status` field to the new value, the `reviewed_by` field to the Admin's user id, and the `reviewed_at` field to the current timestamp.

**Validates: Requirements 12.5**

---

## Testing Strategy

### Unit Tests (example-based)

- Homepage renders with hero, stats, features, and CTA links to correct routes
- Academics page renders with MainLayout and CTA to Admissions
- Admissions form contains all required fields
- Gallery page renders with MainLayout
- Admin pages render with correct table columns and counts
- Sidebar renders with "School Operations" and "Website Management" section labels
- Navbar contains links to /academics, /admissions, /gallery
- Service functions call correct API endpoints
- Fallback/empty states display correct messages
- Loading states display skeleton loaders

### Property-Based Tests

Each property above is tested with property-based testing (minimum 100 iterations):
- Generate random valid application data → submit → verify record created with reference number
- Generate multiple submissions → verify all reference numbers unique
- Generate submissions with random missing fields → verify validation errors and no record
- Generate random events → CRUD round-trip → verify persistence at each step
- Generate random gallery images → CRUD round-trip → verify record + file
- Generate random staff profiles → CRUD round-trip → verify persistence
- Create records → update → verify updated_at changed
- Update admission status → verify reviewed_by and reviewed_at set

### Integration Tests (1-3 examples)

- Full admission flow: fill form → upload files → submit → get reference number → check status
- Admin event management: login → create event → edit → delete → verify gone
- Database migration: run migrations → verify all 6 tables exist with correct columns and triggers

### Smoke Tests

- All 6 migration files run successfully via `runMigrations.js`
- Public endpoints accessible without auth (200 response)
- Admin endpoints return 401 without token, 403 with non-admin token
- Upload middleware rejects files > 5MB and non-image/PDF types
