# Implementation Plan: Public School Website (Phase 1 MVP)

## Overview

This plan implements Phase 1 MVP of the Habucho Preparatory School public website enhancement. The implementation follows a dependency-ordered approach: database migrations first (defining the schema), then backend models/middleware/controllers/routes (building the API), then frontend services/navigation/pages/dashboards/routing (building the UI). All new code extends existing patterns — numbered SQL migrations, Express routers/controllers/models, the shared axios `api` instance, `useFetch` hook, `react-hook-form`, `react-hot-toast`, `sendSuccess`/`sendError` helpers, `authenticateUser`/`authorizeRoles` middleware, and the `upload` multer middleware.

## Tasks

- [x] 1. Database migrations — Create 6 new migration files (011-016)
  - [x] 1.1 Create migration 011: events table
    - Create `server/migrations/011_create_events.sql` with the events table schema (id, title, content, event_date, category, status, image_path, created_by, created_at, updated_at), indexes on event_date DESC, category, and status, and the `update_events_updated_at` BEFORE UPDATE trigger using the existing `update_updated_at_column()` function
    - Follow the exact SQL from the design document's Migration 011 section
    - _Requirements: 9.1, 9.7, 9.8_

  - [x] 1.2 Create migration 012: gallery_images table
    - Create `server/migrations/012_create_gallery_images.sql` with the gallery_images table schema (id, title, caption, image_path, display_order, created_by, created_at, updated_at), indexes on display_order and created_at DESC, and the `update_gallery_images_updated_at` trigger
    - _Requirements: 9.2, 9.7, 9.8_

  - [x] 1.3 Create migration 013: admission_applications table
    - Create `server/migrations/013_create_admission_applications.sql` with the admission_applications table schema (id, reference_number UNIQUE, applicant_name, email, phone, date_of_birth, gender, grade_level, parent_name, parent_phone, address, previous_school, message, document_paths TEXT[], status, reviewed_by, reviewed_at, created_at, updated_at), indexes on reference_number, status, and created_at DESC, and the `update_admission_applications_updated_at` trigger
    - _Requirements: 9.3, 9.7, 9.8_

  - [x] 1.4 Create migration 014: staff_profiles table
    - Create `server/migrations/014_create_staff_profiles.sql` with the staff_profiles table schema (id, name, title, department, bio, photo_path, display_order, is_active, created_by, created_at, updated_at), indexes on display_order and is_active, and the `update_staff_profiles_updated_at` trigger
    - _Requirements: 9.4, 9.7, 9.8_

  - [x] 1.5 Create migration 015: academic_programs table
    - Create `server/migrations/015_create_academic_programs.sql` with the academic_programs table schema (id, name, description, category, display_order, is_active, created_by, created_at, updated_at), indexes on display_order, is_active, and category, and the `update_academic_programs_updated_at` trigger
    - _Requirements: 9.5, 9.7, 9.8_

  - [x] 1.6 Create migration 016: website_settings table
    - Create `server/migrations/016_create_website_settings.sql` with the website_settings table schema (id, key UNIQUE, value, description, updated_by, updated_at) and index on key
    - No updated_at trigger needed for this table per design (only has updated_at, no created_at)
    - _Requirements: 9.6, 9.8_

  - [ ]* 1.7 Write property test for updated_at trigger consistency
    - **Property 13: Updated_at trigger consistency** — For any row in events, gallery_images, admission_applications, staff_profiles, or academic_programs, updating any column SHALL set updated_at to a value greater than the previous updated_at
    - **Validates: Requirements 9.7**

- [ ] 2. Backend models — Create/extend model files for new entities
  - [ ] 2.1 Extend publicModel.js with program, gallery, and event queries
    - Add `getActivePrograms()`, `getGalleryImages()`, and `getPublishedEvents()` functions to `server/models/publicModel.js` following the existing `pool.query` pattern
    - `getActivePrograms`: SELECT from academic_programs WHERE is_active = TRUE ORDER BY display_order, id
    - `getGalleryImages`: SELECT from gallery_images ORDER BY display_order, id
    - `getPublishedEvents`: SELECT from events WHERE status = 'published' ORDER BY event_date DESC, id
    - _Requirements: 11.1, 11.2, 11.3_

  - [x] 2.2 Create eventModel.js with CRUD functions
    - Create `server/models/eventModel.js` importing `pool` from `config/db.js`
    - Export: `getAllEvents({ limit, offset })` (paginated with count), `getEventById(id)`, `createEvent({ title, content, event_date, category, status, image_path, created_by })`, `updateEvent(id, fields)` using COALESCE pattern, `deleteEvent(id)`, `countEvents()`
    - Follow the exact queries from the design document's eventModel.js section
    - _Requirements: 6.3, 6.4, 6.5, 12.1_

  - [x] 2.3 Create galleryModel.js with CRUD functions
    - Create `server/models/galleryModel.js` importing `pool` from `config/db.js`
    - Export: `getAllGalleryImages()`, `createGalleryImage({ title, caption, image_path, display_order, created_by })`, `deleteGalleryImage(id)` (returns image_path for file cleanup), `countGalleryImages()`
    - _Requirements: 7.3, 7.4, 12.2_

  - [x] 2.4 Create staffModel.js with CRUD functions
    - Create `server/models/staffModel.js` importing `pool` from `config/db.js`
    - Export: `getAllStaffProfiles()`, `getStaffProfileById(id)`, `createStaffProfile({ name, title, department, bio, photo_path, display_order, created_by })`, `updateStaffProfile(id, fields)` using COALESCE pattern including is_active, `deleteStaffProfile(id)` (returns photo_path for file cleanup), `countStaffProfiles()`
    - _Requirements: 8.3, 8.4, 8.5, 12.3_

  - [x] 2.5 Create admissionModel.js with application CRUD functions
    - Create `server/models/admissionModel.js` importing `pool` from `config/db.js`
    - Export: `getAllApplications({ limit, offset })` (paginated with count), `getApplicationById(id)`, `getByReferenceNumber(referenceNumber)`, `createApplication(data)` (inserts all 13 fields + document_paths array + status 'pending'), `updateStatus(id, { status, reviewed_by, reviewed_at })`
    - _Requirements: 3.4, 4.2, 12.4, 12.5_

  - [ ]* 2.6 Write property test for event CRUD round-trip
    - **Property 7: Event CRUD round-trip** — For any valid Event data, creating persists it, updating reflects new values, deleting removes it
    - **Validates: Requirements 6.3, 6.4, 6.5**

  - [ ]* 2.7 Write property test for gallery image CRUD round-trip
    - **Property 9: Gallery image CRUD round-trip** — Creating stores file path, deleting removes both record and file
    - **Validates: Requirements 7.3, 7.4**

  - [ ]* 2.8 Write property test for staff profile CRUD round-trip
    - **Property 11: Staff profile CRUD round-trip** — Creating persists it, updating reflects new values (including photo), deleting removes it
    - **Validates: Requirements 8.3, 8.4, 8.5, 8.7**

  - [ ]* 2.9 Write property test for reference number uniqueness
    - **Property 4: Reference number uniqueness** — For any two distinct valid admission submissions, generated Reference_Numbers SHALL be different
    - **Validates: Requirements 3.7**

- [x] 3. Backend middleware — Extend upload and validation middleware
  - [x] 3.1 Extend upload.js with documentUpload for PDF support
    - Add `documentUpload` export to `server/middleware/upload.js` — a new multer instance accepting images (jpeg, png, gif, webp) AND PDFs with the same 5 MB limit
    - Add `DOCUMENT_ALLOWED_MIMES` set including `application/pdf`, `documentFileFilter` with magic-byte validation extended for PDF (%PDF prefix), and export `documentUpload`
    - Keep existing `upload` export unchanged
    - _Requirements: 3.3, 3.6_

  - [x] 3.2 Extend validate.js with validation rules for events, staff, and admissions
    - Add to `server/middleware/validate.js`: `validateEvent`, `validateUpdateEvent`, `validateStaff`, `validateUpdateStaff`, `validateAdmissionStatus` following the existing `body()` + `handleValidationErrors` pattern
    - validateEvent: title required (max 255), content optional (max 10000), event_date optional ISO8601, category optional (max 50)
    - validateStaff: name required (max 100), title required (max 100), department/bio optional, display_order optional int
    - validateAdmissionStatus: status must be one of pending, under_review, approved, rejected
    - _Requirements: 6.6, 8.6, 12.5_

  - [ ]* 3.3 Write property test for form validation rejection
    - **Property 3: Form validation rejects incomplete submissions** — For any form submission with missing required fields, the system SHALL display validation errors and SHALL NOT create or modify any database record
    - **Validates: Requirements 3.5, 6.6, 8.6**

- [ ] 4. Backend controllers — Create/extend controller files for new entities
  - [-] 4.1 Extend publicController.js with public endpoint handlers
    - Add to `server/controllers/publicController.js`: `getPublicPrograms`, `getPublicGallery`, `getPublicEvents`, `submitAdmission`, `getAdmissionStatus`
    - `submitAdmission` uses `documentUpload` middleware (applied in routes), extracts `req.body` fields and `req.files` paths, generates reference number via `generateReferenceNumber()` (crypto.randomBytes), calls `AdmissionModel.createApplication`, returns `{ referenceNumber }` with 201 status
    - `getAdmissionStatus` queries by `req.params.referenceNumber`, returns `{ status, applicantName, submittedAt }` or 404
    - Import `AdmissionModel` and `crypto` as needed; use existing `sendSuccess`/`sendError` helpers
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.8_

  - [-] 4.2 Create eventController.js with CRUD handlers
    - Create `server/controllers/eventController.js` importing `* as EventModel` and `sendSuccess`/`sendError`/`getPagination`
    - Export: `getEvents` (paginated), `getEventById`, `createEvent` (extracts image_path from `req.file`, sets `created_by` from `req.user.id`), `updateEvent` (extracts image_path from `req.file`), `deleteEvent`
    - `deleteEvent` should also `fs.unlink` the image file if one exists, catching errors gracefully
    - _Requirements: 6.3, 6.4, 6.5, 12.1, 12.7, 12.8_

  - [ ] 4.3 Create galleryController.js with CRUD handlers
    - Create `server/controllers/galleryController.js` importing `* as GalleryModel` and `sendSuccess`/`sendError`
    - Export: `getGalleryImages`, `createGalleryImage` (extracts image_path from `req.file`, sets `created_by` from `req.user.id`), `deleteGalleryImage` (uses model's returned `image_path` to `fs.unlink` the file)
    - _Requirements: 7.3, 7.4, 12.2, 12.8_

  - [~] 4.4 Create staffController.js with CRUD handlers
    - Create `server/controllers/staffController.js` importing `* as StaffModel` and `sendSuccess`/`sendError`
    - Export: `getStaffProfiles`, `getStaffProfileById`, `createStaffProfile` (extracts photo_path from `req.file`, sets `created_by` from `req.user.id`), `updateStaffProfile` (extracts photo_path from `req.file`), `deleteStaffProfile` (uses model's returned `photo_path` to `fs.unlink` the file)
    - _Requirements: 8.3, 8.4, 8.5, 8.7, 12.3, 12.8_

  - [~] 4.5 Create admissionController.js with application and status handlers
    - Create `server/controllers/admissionController.js` importing `* as AdmissionModel` and `sendSuccess`/`sendError`/`getPagination`
    - Export: `getAdmissions` (paginated), `getAdmissionById`, `updateAdmissionStatus`
    - `updateAdmissionStatus` validates status is one of pending/under_review/approved/rejected, sets `reviewed_by` to `req.user.id` and `reviewed_at` to `new Date()`, calls `AdmissionModel.updateStatus`
    - Include `generateReferenceNumber()` helper using `crypto.randomBytes(4).toString("hex").toUpperCase()` formatted as `HAB-YYYY-XXXXXX`
    - _Requirements: 3.7, 4.2, 4.3, 4.4, 12.4, 12.5_

  - [ ]* 4.6 Write property test for admission submission creates record with reference number
    - **Property 2: Admission submission creates record with reference number** — For any valid admission form data, submitting SHALL create a record and return a non-empty Reference_Number
    - **Validates: Requirements 3.4**

  - [ ]* 4.7 Write property test for admission status lookup correctness
    - **Property 5: Admission status lookup correctness** — For any existing Admission_Application, querying by Reference_Number SHALL return correct status, applicant name, and submission date
    - **Validates: Requirements 4.2, 4.4, 4.5**

  - [ ]* 4.8 Write property test for admission status update sets review metadata
    - **Property 14: Admin admission status update sets review metadata** — For any status update, the system SHALL set status, reviewed_by to Admin's user id, and reviewed_at to current timestamp
    - **Validates: Requirements 12.5**

- [ ] 5. Backend routes and app registration — Create route files and register in app.js
  - [~] 5.1 Extend publicRoutes.js with new public endpoints
    - Add to `server/routes/publicRoutes.js`: GET `/programs` → `getPublicPrograms`, GET `/gallery` → `getPublicGallery`, GET `/events` → `getPublicEvents`, POST `/admissions` → `submitAdmission` (with `documentUpload.array("documents", 10)` middleware), GET `/admissions/status/:referenceNumber` → `getAdmissionStatus`
    - All endpoints inherit the existing `apiLimiter` via `router.use(apiLimiter)`
    - Import the new handler functions from `publicController.js`
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 11.8_

  - [~] 5.2 Create eventRoutes.js
    - Create `server/routes/eventRoutes.js` with Router, applying `authenticateUser` + `authorizeRoles("admin")` to all routes
    - Routes: GET `/` → `getEvents`, GET `/:id` → `getEventById`, POST `/` → `createEvent` (with `upload.single("image")` + `validateEvent`), PUT `/:id` → `updateEvent` (with `upload.single("image")` + `validateUpdateEvent`), DELETE `/:id` → `deleteEvent`
    - _Requirements: 12.1, 12.6, 12.8, 12.9_

  - [~] 5.3 Create galleryRoutes.js
    - Create `server/routes/galleryRoutes.js` with Router, applying `authenticateUser` + `authorizeRoles("admin")` to all routes
    - Routes: GET `/` → `getGalleryImages`, POST `/` → `createGalleryImage` (with `upload.single("image")`), DELETE `/:id` → `deleteGalleryImage`
    - _Requirements: 12.2, 12.6, 12.8, 12.9_

  - [~] 5.4 Create staffRoutes.js
    - Create `server/routes/staffRoutes.js` with Router, applying `authenticateUser` + `authorizeRoles("admin")` to all routes
    - Routes: GET `/` → `getStaffProfiles`, GET `/:id` → `getStaffProfileById`, POST `/` → `createStaffProfile` (with `upload.single("photo")` + `validateStaff`), PUT `/:id` → `updateStaffProfile` (with `upload.single("photo")` + `validateUpdateStaff`), DELETE `/:id` → `deleteStaffProfile`
    - _Requirements: 12.3, 12.6, 12.8, 12.9_

  - [~] 5.5 Create admissionRoutes.js
    - Create `server/routes/admissionRoutes.js` with Router, applying `authenticateUser` + `authorizeRoles("admin")` to all routes
    - Routes: GET `/` → `getAdmissions` (paginated), GET `/:id` → `getAdmissionById`, PUT `/:id/status` → `updateAdmissionStatus` (with `validateAdmissionStatus`)
    - _Requirements: 12.4, 12.6, 12.7, 12.9_

  - [~] 5.6 Register new route files in app.js
    - Add imports for `eventRoutes`, `galleryRoutes`, `staffRoutes`, `admissionRoutes` to `server/app.js`
    - Add `app.use("/api/events", eventRoutes)`, `app.use("/api/gallery", galleryRoutes)`, `app.use("/api/staff", staffRoutes)`, `app.use("/api/admissions", admissionRoutes)` after existing route registrations
    - _Requirements: 12.6_

- [~] 6. Checkpoint — Backend complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Frontend services — Create/extend service files for API communication
  - [x] 7.1 Extend publicService.js with public API functions
    - Add to `client/src/services/publicService.js`: `getAcademicPrograms()`, `getGalleryImages()`, `getPublicEvents()`, `submitAdmission(formData)` (POST with multipart/form-data header), `checkAdmissionStatus(referenceNumber)` (GET)
    - Keep existing `getPublicStats` export unchanged
    - _Requirements: 14.1_

  - [x] 7.2 Create eventService.js
    - Create `client/src/services/eventService.js` importing `api` from `./api`
    - Export: `getEvents(page, limit)`, `getEventById(id)`, `createEvent(formData)` (POST multipart), `updateEvent(id, formData)` (PUT multipart), `deleteEvent(id)`
    - _Requirements: 14.2_

  - [x] 7.3 Create galleryService.js
    - Create `client/src/services/galleryService.js` importing `api` from `./api`
    - Export: `getGalleryImages()`, `createGalleryImage(formData)` (POST multipart), `deleteGalleryImage(id)`
    - _Requirements: 14.2_

  - [x] 7.4 Create staffService.js
    - Create `client/src/services/staffService.js` importing `api` from `./api`
    - Export: `getStaffProfiles()`, `getStaffProfileById(id)`, `createStaffProfile(formData)` (POST multipart), `updateStaffProfile(id, formData)` (PUT multipart), `deleteStaffProfile(id)`
    - _Requirements: 14.2_

  - [x] 7.5 Create admissionService.js
    - Create `client/src/services/admissionService.js` importing `api` from `./api`
    - Export: `getAdmissions(page, limit)`, `getAdmissionById(id)`, `updateAdmissionStatus(id, status)` (PUT with `{ status }` body)
    - _Requirements: 14.2_

- [x] 8. Frontend navigation and config — Update navigation for new pages and sections
  - [x] 8.1 Modify navLinks.js with section grouping for admin sidebar
    - Update `client/src/config/navLinks.js` `adminLinks` array: add `section: "School Operations"` to all existing items, add 3 new items with `section: "Website Management"` (News & Events at `/admin/events` with `Newspaper` icon, Gallery at `/admin/gallery` with `Images` icon, Staff Profiles at `/admin/staff` with `UsersRound` icon)
    - Import `Newspaper`, `Images`, `UsersRound` from lucide-react
    - Keep `teacherLinks` and `studentLinks` unchanged
    - _Requirements: 10.1, 10.2, 10.4, 10.5_

  - [x] 8.2 Modify Navbar.jsx with new public page links
    - Add to the `navLinks` array in `client/src/components/Navbar.jsx`: `{ to: "/academics", label: "Academics", icon: BookOpen }`, `{ to: "/admissions", label: "Admissions", icon: GraduationCap }`, `{ to: "/gallery", label: "Gallery", icon: Images }` between About and News
    - Import `BookOpen`, `GraduationCap`, `Images` from lucide-react
    - _Requirements: 13.5_

  - [x] 8.3 Modify Sidebar.jsx to render section labels
    - Update `client/src/components/Sidebar.jsx` to group `links` by their `section` field using `reduce`, then render each group with a non-clickable section label header (`<p>` with uppercase tracking-widest styling) above its links
    - Replace the single "Navigation" label and flat link list with the grouped rendering pattern from the design document
    - _Requirements: 10.3_

- [ ] 9. Frontend public pages — Create new public-facing pages and modify Homepage
  - [~] 9.1 Create Academics.jsx
    - Create `client/src/pages/Academics.jsx` using `MainLayout`, `PageHeader`, `Reveal`, `SkeletonLoader`, and `useFetch` with `getAcademicPrograms`
    - Render: hero section via PageHeader, loading state with SkeletonLoader, error state with retry button calling `execute()`, empty state "Academic program information will be available soon", data grid with program cards showing name, description, category, CTA Link to `/admissions`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [~] 9.2 Create Admissions.jsx
    - Create `client/src/pages/Admissions.jsx` using `MainLayout`, `react-hook-form` for the application form, `react-hot-toast` for notifications
    - Application form: 11 fields (applicant_name, email, phone, date_of_birth, gender, grade_level, parent_name, parent_phone, address, previous_school, message) with field-level validation errors, file input for documents
    - Submit handler: builds `FormData` with fields + files, calls `submitAdmission(formData)`, on success sets `submittedRef` state and shows confirmation screen with reference number, resets form
    - Status lookup form: single reference number input, calls `checkAdmissionStatus(refNumber)`, displays status/applicantName/submittedAt or "not found" message
    - Left column: admission requirements and process steps; right column: application form
    - _Requirements: 3.1, 3.2, 3.3, 3.5, 3.6, 3.7, 3.8, 4.1, 4.2, 4.3, 4.4, 4.5_

  - [~] 9.3 Create Gallery.jsx
    - Create `client/src/pages/Gallery.jsx` using `MainLayout`, `PageHeader`, `SkeletonLoader`, `useFetch` with `getGalleryImages`, and `useState` for lightbox
    - Render: hero section, loading skeleton grid, error with retry, empty "Photos will be available soon", responsive image grid with title and optional caption, lightbox modal on image click
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

  - [~] 9.4 Modify Home.jsx with CTA links to new pages
    - Update `client/src/pages/Home.jsx` hero section: add CTA links to `/academics`, `/admissions`, and `/gallery` alongside or replacing existing CTAs
    - Ensure statistics section fetches from existing `/api/public/stats` with graceful fallback (already implemented — verify it remains)
    - Apply existing emerald/slate dark theme with glassmorphism classes
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

  - [ ]* 9.5 Write property test for academic program display completeness
    - **Property 1: Academic program display completeness** — For any set of active Academic_Program records, the Academics page SHALL render each with name, description, and category visible
    - **Validates: Requirements 2.2**

  - [ ]* 9.6 Write property test for gallery image display with metadata
    - **Property 6: Gallery image display with metadata** — For any set of Gallery_Image records, the Gallery page SHALL render each image with title, and caption when present
    - **Validates: Requirements 5.2, 5.6**

- [ ] 10. Frontend admin dashboards — Create admin CMS management pages
  - [~] 10.1 Create AdminEvents.jsx
    - Create `client/src/dashboards/admin/AdminEvents.jsx` using `usePagination` hook, `Pagination` component, `StatCard` for count, `react-hook-form` for create/edit modal, `react-hot-toast` for notifications
    - Paginated table with columns: title, date, category, status, actions (edit, delete)
    - Create/edit modal: form with title, content, event_date, category, image upload (FormData)
    - Delete with `confirm()` prompt, calls `deleteEvent(id)`
    - StatCard at top showing total event count
    - Uses `eventService` functions: `getEvents`, `createEvent`, `updateEvent`, `deleteEvent`
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

  - [~] 10.2 Create AdminGallery.jsx
    - Create `client/src/dashboards/admin/AdminGallery.jsx` using `StatCard` for count, `react-hot-toast` for notifications
    - Upload form: title, caption, image file (FormData via `galleryService.createGalleryImage`)
    - Grid of gallery images with thumbnail previews, titles, and delete buttons
    - Delete with `confirm()` prompt, calls `deleteGalleryImage(id)`
    - StatCard at top showing total image count
    - Uses `galleryService` functions: `getGalleryImages`, `createGalleryImage`, `deleteGalleryImage`
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

  - [~] 10.3 Create AdminStaff.jsx
    - Create `client/src/dashboards/admin/AdminStaff.jsx` using `StatCard` for count, `react-hook-form` for create/edit modal, `react-hot-toast` for notifications
    - Table with columns: name, title, department, display_order, actions (edit, delete)
    - Create/edit modal: form with name, title, department, bio, photo upload, display_order (FormData)
    - Delete with `confirm()` prompt, calls `deleteStaffProfile(id)`
    - StatCard at top showing total staff count
    - Uses `staffService` functions: `getStaffProfiles`, `createStaffProfile`, `updateStaffProfile`, `deleteStaffProfile`
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

  - [ ]* 10.4 Write property test for admin events table completeness
    - **Property 8: Admin events table completeness** — For any set of Event records, the admin page SHALL display all with columns for title, date, category, status, and action buttons
    - **Validates: Requirements 6.2**

  - [ ]* 10.5 Write property test for admin gallery grid completeness
    - **Property 10: Admin gallery grid completeness** — For any set of Gallery_Image records, the admin page SHALL display all with thumbnails, titles, and delete buttons
    - **Validates: Requirements 7.2**

  - [ ]* 10.6 Write property test for admin staff table completeness
    - **Property 12: Admin staff table completeness** — For any set of Staff_Profile records, the admin page SHALL display all with columns for name, title, department, display order, and action buttons
    - **Validates: Requirements 8.2**

- [ ] 11. Frontend routing — Register new routes in App.jsx
  - [~] 11.1 Modify App.jsx with new lazy-loaded public and admin routes
    - Add lazy imports for `Academics`, `Admissions`, `Gallery` (from `./pages/`) and `AdminEvents`, `AdminGallery`, `AdminStaff` (from `./dashboards/admin/`)
    - Add public routes: `<Route path="/academics" element={<Academics />} />`, `<Route path="/admissions" element={<Admissions />} />`, `<Route path="/gallery" element={<Gallery />} />` alongside existing public routes
    - Add admin routes inside the existing admin `RoleGuard("admin")` + `DashboardLayout` wrapper: `<Route path="/admin/events" element={<AdminEvents />} />`, `<Route path="/admin/gallery" element={<AdminGallery />} />`, `<Route path="/admin/staff" element={<AdminStaff />} />`
    - _Requirements: 13.1, 13.2, 13.3, 13.4_

- [~] 12. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document (Properties 1-14)
- Unit tests validate specific examples and edge cases
- The implementation language is JavaScript (ES modules) for backend and JSX for frontend, matching the existing codebase
- All new backend code follows the existing `routes → controllers → models` pattern with `pool.query` from `config/db.js`
- All new frontend code follows the existing `services → hooks → components` pattern with the shared `api` axios instance
- File upload endpoints use `FormData` on the frontend and `multer` on the backend with the existing 5 MB limit
- The `runMigrations.js` runner automatically picks up new `.sql` files in sorted order — no manual registration needed

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3", "1.4", "1.5", "1.6", "3.1", "3.2", "7.1", "7.2", "7.3", "7.4", "7.5", "8.1", "8.2"] },
    { "id": 1, "tasks": ["1.7", "2.1", "2.2", "2.3", "2.4", "2.5", "3.3", "8.3"] },
    { "id": 2, "tasks": ["2.6", "2.7", "2.8", "2.9", "4.1", "4.2", "4.3", "4.4", "4.5"] },
    { "id": 3, "tasks": ["4.6", "4.7", "4.8", "5.1", "5.2", "5.3", "5.4", "5.5"] },
    { "id": 4, "tasks": ["5.6", "9.1", "9.2", "9.3", "9.4", "10.1", "10.2", "10.3"] },
    { "id": 5, "tasks": ["9.5", "9.6", "10.4", "10.5", "10.6", "11.1"] }
  ]
}
```
