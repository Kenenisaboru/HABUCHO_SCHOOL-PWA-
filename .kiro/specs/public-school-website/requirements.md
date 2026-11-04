# Requirements Document

## Introduction

This specification covers Phase 1 MVP of the Habucho Preparatory School public website enhancement. The project adds new public-facing pages (redesigned Homepage, Academics, Admissions, Gallery) and new admin CMS capabilities (News/Events management, Gallery management, Staff profile management) to the existing school management platform. All new features integrate into the existing React + Express + PostgreSQL architecture, extending the current migration-based database, route, and component patterns.

Phase 2 items (About redesign, News/Events public expansion, Contact redesign, Website Settings, Academic info management, Contact inquiries management) are explicitly deferred and excluded from this specification.

## Glossary

- **System**: The complete Habucho Preparatory School web application consisting of a React frontend and Express backend with a PostgreSQL database
- **Public_Site**: The unauthenticated, public-facing portion of the System accessible via routes in MainLayout (Homepage, Academics, Admissions, Gallery, existing pages)
- **Admin_Dashboard**: The authenticated admin portion of the System accessible under `/admin/*` with DashboardLayout and RoleGuard
- **Applicant**: A person who fills out and submits an online admission application form on the Public_Site
- **Reference_Number**: A unique alphanumeric tracking code assigned to each Admission_Application at creation, used by Applicants to check status
- **Admission_Application**: A record stored in the `admission_applications` table containing applicant data and uploaded documents submitted via the public Admissions page
- **Event**: A school news item or event record stored in the `events` table, managed by admins and displayed on the Public_Site
- **Gallery_Image**: An image record stored in the `gallery_images` table, managed by admins and displayed on the public Gallery page
- **Staff_Profile**: A public-facing staff member record stored in the `staff_profiles` table, separate from the `users` table, containing display information for the public website
- **Academic_Program**: A curriculum or program offering record stored in the `academic_programs` table, displayed on the public Academics page
- **Website_Settings**: Configurable key-value settings stored in the `website_settings` table for the Public_Site
- **Admin**: A user with the `admin` role in the System
- **api**: The axios-based service layer on the frontend that communicates with backend REST endpoints under `/api/*`
- **sendSuccess**: The standard response helper that returns `{ success: true, message, data }` with a status code
- **sendError**: The standard response helper that returns `{ success: false, message }` with a status code
- **upload**: The multer middleware that handles file uploads with image type validation (jpeg, png, gif, webp) and a 5 MB size limit

## Requirements

### Requirement 1: Homepage Redesign

**User Story:** As a prospective parent or student, I want a redesigned homepage that showcases the school's strengths and directs me to key information, so that I can quickly understand what the school offers and navigate to relevant pages.

#### Acceptance Criteria

1. THE Public_Site SHALL render a redesigned Homepage at the `/` route using MainLayout with a hero section, live statistics section, features section, and call-to-action links to Academics, Admissions, and Gallery pages
2. THE Public_Site SHALL display live student and teacher counts fetched from the existing `/api/public/stats` endpoint in the statistics section
3. WHEN the statistics endpoint fails or returns no data, THE Public_Site SHALL display a graceful fallback message in place of the statistics section
4. THE Public_Site SHALL include navigation links in the hero call-to-action that route to `/academics`, `/admissions`, and `/gallery`
5. THE Public_Site SHALL apply the existing emerald/slate dark theme with glassmorphism styling classes (glass-panel, card, btn-primary, btn-outline) consistent with the current design system
6. WHILE the Homepage is loading data from the api, THE Public_Site SHALL display skeleton loaders matching the existing SkeletonLoader and LoadingSpinner component patterns

### Requirement 2: Academics Page

**User Story:** As a prospective student or parent, I want to view the academic programs and curriculum offerings, so that I can understand what the school teaches and decide if it fits my educational goals.

#### Acceptance Criteria

1. THE Public_Site SHALL render an Academics page at the `/academics` route using MainLayout
2. THE Public_Site SHALL fetch Academic_Program records from a public API endpoint and display them in a structured layout showing program name, description, and category
3. WHEN no Academic_Program records exist or the API returns an empty list, THE Public_Site SHALL display a message indicating that academic program information will be available soon
4. IF the Academics API endpoint returns an error, THE Public_Site SHALL display an error message with a retry option
5. WHILE Academic_Program data is loading, THE Public_Site SHALL display skeleton loaders for each program card
6. THE Public_Site SHALL include a call-to-action linking to the Admissions page from the Academics page

### Requirement 3: Admissions Page — Public Form

**User Story:** As an Applicant, I want to fill out an online admission application form and upload required documents, so that I can apply to the school without visiting in person.

#### Acceptance Criteria

1. THE Public_Site SHALL render an Admissions page at the `/admissions` route using MainLayout with an online application form built with react-hook-form
2. THE Public_Site SHALL collect the following fields in the application form: applicant full name, email, phone, date of birth, gender, grade level applying for, parent or guardian name, parent or guardian phone, address, previous school, and a message field
3. THE Public_Site SHALL allow the Applicant to upload one or more document files (transcripts, ID, photos) via the form using the upload middleware with image and PDF file type validation and a 5 MB per-file limit
4. WHEN the Applicant submits the form with valid data, THE System SHALL create an Admission_Application record in the `admission_applications` table and return a Reference_Number to the Applicant
5. WHEN the Applicant submits the form with missing required fields, THE System SHALL display validation errors next to each invalid field without submitting the form
6. IF the document upload fails due to file size exceeding the limit or invalid file type, THE System SHALL display an error message identifying the rejected file
7. THE System SHALL generate a unique Reference_Number for each submitted Admission_Application and display it to the Applicant on a confirmation screen after successful submission
8. THE Public_Site SHALL display the school's admission requirements and process steps on the Admissions page alongside the application form

### Requirement 4: Admissions Page — Status Tracking

**User Story:** As an Applicant, I want to check the status of my submitted application using my Reference_Number, so that I can know whether my application is pending, under review, approved, or rejected.

#### Acceptance Criteria

1. THE Public_Site SHALL provide a status lookup form on the Admissions page where the Applicant enters a Reference_Number
2. WHEN the Applicant submits a valid Reference_Number, THE System SHALL query the `admission_applications` table and return the current status of the corresponding Admission_Application
3. WHEN the Applicant submits a Reference_Number that does not match any Admission_Application, THE System SHALL display a message indicating that no application was found for that Reference_Number
4. THE System SHALL display the Admission_Application status as one of: `pending`, `under_review`, `approved`, or `rejected`
5. THE Public_Site SHALL display the applicant name and submission date alongside the status result for verification

### Requirement 5: Gallery Page

**User Story:** As a website visitor, I want to browse a gallery of school photos, so that I can see campus life, events, and facilities.

#### Acceptance Criteria

1. THE Public_Site SHALL render a Gallery page at the `/gallery` route using MainLayout
2. THE Public_Site SHALL fetch Gallery_Image records from a public API endpoint and display them in a responsive grid layout with a lightbox or modal view on image click
3. WHEN no Gallery_Image records exist, THE Public_Site SHALL display a placeholder message indicating that photos will be available soon
4. IF the Gallery API endpoint returns an error, THE Public_Site SHALL display an error message with a retry option
5. WHILE Gallery_Image data is loading, THE Public_Site SHALL display skeleton loaders in the grid layout
6. THE Public_Site SHALL display each Gallery_Image with its title and optional caption text below or overlaid on the image

### Requirement 6: News/Events Management — Admin

**User Story:** As an Admin, I want to create, edit, and delete school news items and events, so that I can keep the Public_Site updated with current information.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL provide a News and Events management page accessible via a sidebar link under the "Website Management" group at `/admin/events`
2. THE Admin_Dashboard SHALL display a paginated table of all Event records with columns for title, date, category, status, and action buttons (edit, delete)
3. WHEN the Admin submits a new Event form with title, content, event date, category, and optional image, THE System SHALL create an Event record in the `events` table
4. WHEN the Admin edits an existing Event and saves changes, THE System SHALL update the corresponding Event record in the `events` table
5. WHEN the Admin clicks delete on an Event, THE System SHALL remove the Event record from the `events` table after a confirmation prompt
6. IF the Admin submits an Event form with missing required fields, THE System SHALL display validation errors without saving
7. THE Admin_Dashboard SHALL display a count of total Event records at the top of the management page

### Requirement 7: Gallery Management — Admin

**User Story:** As an Admin, I want to upload, organize, and delete gallery images, so that I can curate the photos displayed on the public Gallery page.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL provide a Gallery management page accessible via a sidebar link under the "Website Management" group at `/admin/gallery`
2. THE Admin_Dashboard SHALL display a grid of all Gallery_Image records with thumbnail previews, titles, and delete buttons
3. WHEN the Admin uploads an image with a title and optional caption through the upload form, THE System SHALL store the file using the upload middleware and create a Gallery_Image record in the `gallery_images` table
4. WHEN the Admin clicks delete on a Gallery_Image, THE System SHALL remove the Gallery_Image record from the `gallery_images` table and delete the associated uploaded file after a confirmation prompt
5. IF the Admin uploads a file that exceeds 5 MB or is not an image type (jpeg, png, gif, webp), THE System SHALL display an error message and reject the upload
6. THE Admin_Dashboard SHALL display a count of total Gallery_Image records at the top of the management page

### Requirement 8: Staff Profile Management — Admin

**User Story:** As an Admin, I want to create, edit, and manage public-facing staff profiles, so that visitors can learn about the school's teachers and leadership on the Public_Site.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL provide a Staff Profiles management page accessible via a sidebar link under the "Website Management" group at `/admin/staff`
2. THE Admin_Dashboard SHALL display a table of all Staff_Profile records with columns for name, title, department, display order, and action buttons (edit, delete)
3. WHEN the Admin submits a new Staff_Profile form with name, title, department, bio, optional photo, and display order, THE System SHALL create a Staff_Profile record in the `staff_profiles` table
4. WHEN the Admin edits an existing Staff_Profile and saves changes, THE System SHALL update the corresponding Staff_Profile record in the `staff_profiles` table
5. WHEN the Admin clicks delete on a Staff_Profile, THE System SHALL remove the Staff_Profile record from the `staff_profiles` table after a confirmation prompt
6. IF the Admin submits a Staff_Profile form with missing required fields, THE System SHALL display validation errors without saving
7. THE Admin_Dashboard SHALL allow the Admin to upload a profile photo for a Staff_Profile using the upload middleware with image type validation and a 5 MB size limit

### Requirement 9: Database Schema — New Tables

**User Story:** As a developer, I want dedicated database tables for each new entity, so that the data is properly structured and queryable without overloading existing tables.

#### Acceptance Criteria

1. THE System SHALL create an `events` table via a new numbered migration file following the existing `NNN_description.sql` pattern with columns: id (SERIAL PRIMARY KEY), title (VARCHAR 255 NOT NULL), content (TEXT), event_date (DATE), category (VARCHAR 50), status (VARCHAR 20 DEFAULT 'published'), image_path (VARCHAR 500), created_by (INTEGER REFERENCES users(id) ON DELETE SET NULL), created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP), updated_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
2. THE System SHALL create a `gallery_images` table via a new numbered migration file with columns: id (SERIAL PRIMARY KEY), title (VARCHAR 255 NOT NULL), caption (TEXT), image_path (VARCHAR 500) NOT NULL, display_order (INTEGER DEFAULT 0), created_by (INTEGER REFERENCES users(id) ON DELETE SET NULL), created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP), updated_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
3. THE System SHALL create an `admission_applications` table via a new numbered migration file with columns: id (SERIAL PRIMARY KEY), reference_number (VARCHAR 50 UNIQUE NOT NULL), applicant_name (VARCHAR 100 NOT NULL), email (VARCHAR 100 NOT NULL), phone (VARCHAR 20), date_of_birth (DATE), gender (VARCHAR 10), grade_level (VARCHAR 20), parent_name (VARCHAR 100), parent_phone (VARCHAR 20), address (TEXT), previous_school (VARCHAR 150), message (TEXT), document_paths (TEXT[]), status (VARCHAR 20 DEFAULT 'pending'), reviewed_by (INTEGER REFERENCES users(id) ON DELETE SET NULL), reviewed_at (TIMESTAMP), created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP), updated_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
4. THE System SHALL create a `staff_profiles` table via a new numbered migration file with columns: id (SERIAL PRIMARY KEY), name (VARCHAR 100 NOT NULL), title (VARCHAR 100 NOT NULL), department (VARCHAR 100), bio (TEXT), photo_path (VARCHAR 500), display_order (INTEGER DEFAULT 0), is_active (BOOLEAN DEFAULT TRUE), created_by (INTEGER REFERENCES users(id) ON DELETE SET NULL), created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP), updated_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
5. THE System SHALL create an `academic_programs` table via a new numbered migration file with columns: id (SERIAL PRIMARY KEY), name (VARCHAR 255 NOT NULL), description (TEXT), category (VARCHAR 100), display_order (INTEGER DEFAULT 0), is_active (BOOLEAN DEFAULT TRUE), created_by (INTEGER REFERENCES users(id) ON DELETE SET NULL), created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP), updated_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
6. THE System SHALL create a `website_settings` table via a new numbered migration file with columns: id (SERIAL PRIMARY KEY), key (VARCHAR 100 UNIQUE NOT NULL), value (TEXT), description (VARCHAR 255), updated_by (INTEGER REFERENCES users(id) ON DELETE SET NULL), updated_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
7. THE System SHALL add `updated_at` triggers for each new table using the existing `update_updated_at_column()` function following the pattern established in migration 006
8. THE System SHALL add appropriate indexes on each new table for frequently queried columns following the existing index pattern (e.g., reference_number on admission_applications, display_order on gallery_images and staff_profiles, category on events)
9. WHERE a migration file is created, THE System SHALL follow the existing numbered naming convention starting at `011` and register each file to run via the existing `runMigrations.js` pattern

### Requirement 10: Admin Sidebar Navigation Restructure

**User Story:** As an Admin, I want the admin sidebar organized into grouped sections, so that I can quickly find existing school operations tools and new website management features.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL group existing admin sidebar items (Dashboard, Manage Users, Class Schedules, Announcements, Messages, Profile) under a "School Operations" section label
2. THE Admin_Dashboard SHALL add new admin sidebar items (News and Events at `/admin/events`, Gallery at `/admin/gallery`, Staff Profiles at `/admin/staff`) under a "Website Management" section label
3. THE Admin_Dashboard SHALL render section labels as non-clickable group headers in the Sidebar component above their respective link items
4. THE Admin_Dashboard SHALL use lucide-react icons for each new sidebar link item consistent with the existing icon pattern in navLinks.js
5. THE Admin_Dashboard SHALL maintain the existing sidebar link structure format (`{ to, label, icon, end? }`) while adding an optional `section` or grouping field to support the section labels

### Requirement 11: Public API Endpoints

**User Story:** As a developer, I want public API endpoints for the new public pages, so that the frontend can fetch academic programs, gallery images, events, and admission data without authentication.

#### Acceptance Criteria

1. THE System SHALL expose a `GET /api/public/programs` endpoint that returns all active Academic_Program records ordered by display_order without requiring authentication
2. THE System SHALL expose a `GET /api/public/gallery` endpoint that returns all Gallery_Image records ordered by display_order without requiring authentication
3. THE System SHALL expose a `GET /api/public/events` endpoint that returns all published Event records ordered by event_date descending without requiring authentication
4. THE System SHALL expose a `POST /api/public/admissions` endpoint that accepts application form data and uploaded documents, creates an Admission_Application record, generates a Reference_Number, and returns the Reference_Number to the caller without requiring authentication
5. THE System SHALL expose a `GET /api/public/admissions/status/:referenceNumber` endpoint that returns the status, applicant name, and submission date for a given Reference_Number without requiring authentication
6. THE System SHALL apply the existing `apiLimiter` rate limiting middleware to all public endpoints to prevent abuse
7. THE System SHALL register all new public routes in the existing `publicRoutes.js` router file
8. THE System SHALL use the existing `sendSuccess` and `sendError` response helpers for all new public endpoint responses

### Requirement 12: Admin API Endpoints

**User Story:** As a developer, I want admin API endpoints for managing events, gallery images, and staff profiles, so that the admin dashboard can perform CRUD operations on these entities.

#### Acceptance Criteria

1. THE System SHALL expose CRUD endpoints for Events under `/api/events` with `authenticateUser` and `authorizeRoles("admin")` middleware applied to all routes
2. THE System SHALL expose CRUD endpoints for Gallery_Images under `/api/gallery` with `authenticateUser` and `authorizeRoles("admin")` middleware applied to all routes
3. THE System SHALL expose CRUD endpoints for Staff_Profiles under `/api/staff` with `authenticateUser` and `authorizeRoles("admin")` middleware applied to all routes
4. THE System SHALL expose an endpoint under `/api/admissions` with `authenticateUser` and `authorizeRoles("admin")` middleware for listing all Admission_Application records, viewing a single application, and updating application status
5. WHEN an Admin updates an Admission_Application status, THE System SHALL set the `status` field, `reviewed_by` field to the Admin's user id, and `reviewed_at` field to the current timestamp
6. THE System SHALL register all new admin route files in `app.js` following the existing `app.use("/api/<resource>", <routes>)` pattern
7. THE System SHALL use the existing `getPagination` helper for list endpoints that return paginated results
8. THE System SHALL use the existing `upload` middleware for endpoints that accept file uploads (gallery images, staff profile photos, admission documents)
9. IF an unauthenticated user or non-admin user attempts to access any admin endpoint, THE System SHALL return a 401 or 403 error respectively using `sendError`

### Requirement 13: Frontend Route Registration

**User Story:** As a developer, I want new routes registered in App.jsx, so that users can navigate to the new public pages and admins can access the new management pages.

#### Acceptance Criteria

1. THE System SHALL register public routes for `/academics`, `/admissions`, and `/gallery` in App.jsx using lazy-loaded imports wrapped in MainLayout, consistent with existing public route registration
2. THE System SHALL register admin routes for `/admin/events`, `/admin/gallery`, and `/admin/staff` inside the existing admin RouteGuard and DashboardLayout wrapper in App.jsx
3. THE System SHALL create page components for each new public route in the `client/src/pages/` directory following the existing naming convention (Academics.jsx, Admissions.jsx, Gallery.jsx)
4. THE System SHALL create dashboard components for each new admin route in the `client/src/dashboards/admin/` directory following the existing naming convention (AdminEvents.jsx, AdminGallery.jsx, AdminStaff.jsx)
5. THE System SHALL add navigation links for `/academics`, `/admissions`, and `/gallery` to the Navbar component's `navLinks` array with appropriate lucide-react icons

### Requirement 14: Frontend Service Layer

**User Story:** As a developer, I want frontend service functions that call the new API endpoints, so that the page components can fetch and submit data through the existing axios-based api layer.

#### Acceptance Criteria

1. THE System SHALL add service functions to `publicService.js` for fetching academic programs, gallery images, events, submitting admission applications, and checking admission status
2. THE System SHALL create new service files for admin resources (e.g., `eventService.js`, `galleryService.js`, `staffService.js`, `admissionService.js`) in the `client/src/services/` directory following the existing service pattern of importing the shared `api` axios instance
3. THE System SHALL use the existing `useFetch` hook for read-only data fetching in public page components where applicable
4. THE System SHALL use react-hook-form for form submission in the Admissions application form and admin create/edit forms, consistent with the existing form pattern
5. THE System SHALL use react-hot-toast for success and error notifications on form submissions and CRUD operations, consistent with the existing notification pattern
