import bcrypt from "bcryptjs";
import logger from "../utils/logger.js";
import { recalculateRankings } from "./academicCalculationEngine.js";

const DEMO_PASSWORD = "Password123!";

export const seedDemoData = async (pool) => {
  try {
    const studentCountRes = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'student'");
    const currentStudentCount = parseInt(studentCountRes.rows[0].count, 10);

    if (currentStudentCount >= 40) {
      // Ensure academic rankings and summaries are generated if not yet populated
      const summaryCountRes = await pool.query("SELECT COUNT(*) FROM student_academic_summaries");
      const summaryCount = parseInt(summaryCountRes.rows[0].count, 10);
      if (summaryCount === 0) {
        await pool.query(
          "UPDATE grades SET submission_status = 'approved' WHERE submission_status IS NULL OR submission_status = 'draft'"
        );
        await recalculateRankings("2024/2025", "Semester 1", "All");
        logger.info("Auto-populated student academic summaries & Ethiopian rankings for existing students.");
      }
      return;
    }

    logger.info("Seeding comprehensive demo dataset for Grades 9 to 12 (40 students, 4 teachers, schedules, grades)...");
    const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);

    // 1. Demo Administrator
    await pool.query(
      `INSERT INTO users (full_name, email, password, role)
       VALUES ('Demo Administrator', 'admin@habucho.edu', $1, 'admin')
       ON CONFLICT (email) DO NOTHING`,
      [hashedPassword]
    );

    // 2. Demo Teachers
    const teachersData = [
      { name: "Sarah Johnson", email: "teacher@habucho.edu", phone: "+251 91 123 4567" },
      { name: "Michael Chen", email: "teacher2@habucho.edu", phone: "+251 92 234 5678" },
      { name: "Aster Belachew", email: "teacher3@habucho.edu", phone: "+251 93 345 6780" },
      { name: "Daniel Gebre", email: "teacher4@habucho.edu", phone: "+251 94 456 7891" },
    ];

    const teacherIds = [];
    for (const t of teachersData) {
      const res = await pool.query(
        `INSERT INTO users (full_name, email, password, role, phone)
         VALUES ($1, $2, $3, 'teacher', $4)
         ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name, role = 'teacher'
         RETURNING id`,
        [t.name, t.email, hashedPassword, t.phone]
      );
      teacherIds.push(res.rows[0].id);
    }

    const [tMath, tPhysics, tEnglish, tBio] = teacherIds;

    // 3. 40 Demo Students across Grade 9, 10, 11, 12 (10 per grade)
    const studentsData = [
      // Grade 9
      { name: "Abebe Bikila", email: "abebe.b@habucho.edu", grade: "9", sec: "A", stream: "General", gender: "Male", id: "HPS-G09-001", dob: "2010-01-15", parent: "Bikila Kebede", phone: "+251 91 001 0001", blood: "A+" },
      { name: "Chaltu Gemechu", email: "chaltu.g@habucho.edu", grade: "9", sec: "A", stream: "General", gender: "Female", id: "HPS-G09-002", dob: "2010-03-22", parent: "Gemechu Tufa", phone: "+251 91 001 0002", blood: "O+" },
      { name: "Dawit Tadesse", email: "dawit.t@habucho.edu", grade: "9", sec: "A", stream: "General", gender: "Male", id: "HPS-G09-003", dob: "2010-05-18", parent: "Tadesse Hailu", phone: "+251 91 001 0003", blood: "B+" },
      { name: "Eden Haile", email: "eden.h@habucho.edu", grade: "9", sec: "A", stream: "General", gender: "Female", id: "HPS-G09-004", dob: "2010-07-09", parent: "Haile Wolde", phone: "+251 91 001 0004", blood: "AB+" },
      { name: "Fikadu Bekele", email: "fikadu.b@habucho.edu", grade: "9", sec: "A", stream: "General", gender: "Male", id: "HPS-G09-005", dob: "2010-09-30", parent: "Bekele Kassa", phone: "+251 91 001 0005", blood: "O-" },
      { name: "Genet Alemu", email: "genet.a@habucho.edu", grade: "9", sec: "B", stream: "General", gender: "Female", id: "HPS-G09-006", dob: "2010-02-14", parent: "Alemu Desta", phone: "+251 91 001 0006", blood: "A-" },
      { name: "Henok Girma", email: "henok.g@habucho.edu", grade: "9", sec: "B", stream: "General", gender: "Male", id: "HPS-G09-007", dob: "2010-06-25", parent: "Girma Assefa", phone: "+251 91 001 0007", blood: "B-" },
      { name: "Ilham Jemal", email: "ilham.j@habucho.edu", grade: "9", sec: "B", stream: "General", gender: "Female", id: "HPS-G09-008", dob: "2010-08-11", parent: "Jemal Abdi", phone: "+251 91 001 0008", blood: "O+" },
      { name: "Jonathan Kassa", email: "jonathan.k@habucho.edu", grade: "9", sec: "B", stream: "General", gender: "Male", id: "HPS-G09-009", dob: "2010-10-04", parent: "Kassa Mengistu", phone: "+251 91 001 0009", blood: "A+" },
      { name: "Kalkidan Melaku", email: "kalkidan.m@habucho.edu", grade: "9", sec: "B", stream: "General", gender: "Female", id: "HPS-G09-010", dob: "2010-12-19", parent: "Melaku Tesfaye", phone: "+251 91 001 0010", blood: "B+" },

      // Grade 10
      { name: "Leul Solomon", email: "leul.s@habucho.edu", grade: "10", sec: "A", stream: "General", gender: "Male", id: "HPS-G10-001", dob: "2009-01-20", parent: "Solomon Tefera", phone: "+251 92 002 0001", blood: "O+" },
      { name: "Meron Desta", email: "meron.d@habucho.edu", grade: "10", sec: "A", stream: "General", gender: "Female", id: "HPS-G10-002", dob: "2009-03-14", parent: "Desta Worku", phone: "+251 92 002 0002", blood: "A+" },
      { name: "Natnael Getachew", email: "natnael.g@habucho.edu", grade: "10", sec: "A", stream: "General", gender: "Male", id: "HPS-G10-003", dob: "2009-05-29", parent: "Getachew Zewdu", phone: "+251 92 002 0003", blood: "B+" },
      { name: "Olivia Brown", email: "olivia.b@habucho.edu", grade: "10", sec: "A", stream: "General", gender: "Female", id: "HPS-G10-004", dob: "2009-07-02", parent: "David Brown", phone: "+251 92 002 0004", blood: "O-" },
      { name: "Petros Tesfaye", email: "petros.t@habucho.edu", grade: "10", sec: "A", stream: "General", gender: "Male", id: "HPS-G10-005", dob: "2009-09-17", parent: "Tesfaye Negash", phone: "+251 92 002 0005", blood: "AB+" },
      { name: "Rahel Worku", email: "rahel.w@habucho.edu", grade: "10", sec: "B", stream: "General", gender: "Female", id: "HPS-G10-006", dob: "2009-02-08", parent: "Worku Bogale", phone: "+251 92 002 0006", blood: "A+" },
      { name: "Samuel Negash", email: "samuel.n@habucho.edu", grade: "10", sec: "B", stream: "General", gender: "Male", id: "HPS-G10-007", dob: "2009-04-19", parent: "Negash Hailu", phone: "+251 92 002 0007", blood: "B+" },
      { name: "Tigist Kebede", email: "tigist.k@habucho.edu", grade: "10", sec: "B", stream: "General", gender: "Female", id: "HPS-G10-008", dob: "2009-06-30", parent: "Kebede Tolessa", phone: "+251 92 002 0008", blood: "O+" },
      { name: "Usman Abdurrahman", email: "usman.a@habucho.edu", grade: "10", sec: "B", stream: "General", gender: "Male", id: "HPS-G10-009", dob: "2009-08-23", parent: "Abdurrahman Seid", phone: "+251 92 002 0009", blood: "A-" },
      { name: "Welela Mengistu", email: "welela.m@habucho.edu", grade: "10", sec: "B", stream: "General", gender: "Female", id: "HPS-G10-010", dob: "2009-11-12", parent: "Mengistu Haile", phone: "+251 92 002 0010", blood: "O+" },

      // Grade 11
      { name: "Emily Davis", email: "student@habucho.edu", grade: "11", sec: "A", stream: "Natural Science", gender: "Female", id: "HPS-G11-001", dob: "2008-05-14", parent: "Robert Davis", phone: "+251 93 003 0001", blood: "O+" },
      { name: "James Wilson", email: "student2@habucho.edu", grade: "11", sec: "A", stream: "Natural Science", gender: "Male", id: "HPS-G11-002", dob: "2008-08-22", parent: "Thomas Wilson", phone: "+251 93 003 0002", blood: "A+" },
      { name: "Yared Assefa", email: "yared.a@habucho.edu", grade: "11", sec: "A", stream: "Natural Science", gender: "Male", id: "HPS-G11-003", dob: "2008-01-10", parent: "Assefa Tadesse", phone: "+251 93 003 0003", blood: "B+" },
      { name: "Zeineba Nuru", email: "zeineba.n@habucho.edu", grade: "11", sec: "A", stream: "Natural Science", gender: "Female", id: "HPS-G11-004", dob: "2008-03-27", parent: "Nuru Kedir", phone: "+251 93 003 0004", blood: "AB+" },
      { name: "Aaron Demissie", email: "aaron.d@habucho.edu", grade: "11", sec: "A", stream: "Natural Science", gender: "Male", id: "HPS-G11-005", dob: "2008-06-15", parent: "Demissie Bikila", phone: "+251 93 003 0005", blood: "O-" },
      { name: "Bethelhem Zewdu", email: "bethelhem.z@habucho.edu", grade: "11", sec: "B", stream: "Social Science", gender: "Female", id: "HPS-G11-006", dob: "2008-02-18", parent: "Zewdu Mekonnen", phone: "+251 93 003 0006", blood: "A+" },
      { name: "Caleb Tarekegn", email: "caleb.t@habucho.edu", grade: "11", sec: "B", stream: "Social Science", gender: "Male", id: "HPS-G11-007", dob: "2008-04-09", parent: "Tarekegn Bekele", phone: "+251 93 003 0007", blood: "B+" },
      { name: "Danait Berhe", email: "danait.b@habucho.edu", grade: "11", sec: "B", stream: "Social Science", gender: "Female", id: "HPS-G11-008", dob: "2008-07-21", parent: "Berhe Gebru", phone: "+251 93 003 0008", blood: "O+" },
      { name: "Eyob Moges", email: "eyob.m@habucho.edu", grade: "11", sec: "B", stream: "Social Science", gender: "Male", id: "HPS-G11-009", dob: "2008-09-12", parent: "Moges Tefera", phone: "+251 93 003 0009", blood: "A-" },
      { name: "Feven Wolde", email: "feven.w@habucho.edu", grade: "11", sec: "B", stream: "Social Science", gender: "Female", id: "HPS-G11-010", dob: "2008-11-28", parent: "Wolde Kassa", phone: "+251 93 003 0010", blood: "B-" },

      // Grade 12
      { name: "Aisha Mohammed", email: "student3@habucho.edu", grade: "12", sec: "A", stream: "Natural Science", gender: "Female", id: "HPS-G12-001", dob: "2007-11-03", parent: "Mohammed Ali", phone: "+251 94 004 0001", blood: "B+" },
      { name: "Bereket Tolessa", email: "bereket.t@habucho.edu", grade: "12", sec: "A", stream: "Natural Science", gender: "Male", id: "HPS-G12-002", dob: "2007-01-25", parent: "Tolessa Gemechu", phone: "+251 94 004 0002", blood: "O+" },
      { name: "Christiana Taylor", email: "christiana.t@habucho.edu", grade: "12", sec: "A", stream: "Natural Science", gender: "Female", id: "HPS-G12-003", dob: "2007-04-14", parent: "George Taylor", phone: "+251 94 004 0003", blood: "A+" },
      { name: "Daniel Kidane", email: "daniel.k@habucho.edu", grade: "12", sec: "A", stream: "Natural Science", gender: "Male", id: "HPS-G12-004", dob: "2007-06-19", parent: "Kidane Assefa", phone: "+251 94 004 0004", blood: "AB+" },
      { name: "Eleni Yohannes", email: "eleni.y@habucho.edu", grade: "12", sec: "A", stream: "Natural Science", gender: "Female", id: "HPS-G12-005", dob: "2007-08-30", parent: "Yohannes Haile", phone: "+251 94 004 0005", blood: "O-" },
      { name: "Fasil Tefera", email: "fasil.t@habucho.edu", grade: "12", sec: "B", stream: "Social Science", gender: "Male", id: "HPS-G12-006", dob: "2007-02-17", parent: "Tefera Bekele", phone: "+251 94 004 0006", blood: "A+" },
      { name: "Grace Miller", email: "grace.m@habucho.edu", grade: "12", sec: "B", stream: "Social Science", gender: "Female", id: "HPS-G12-007", dob: "2007-05-11", parent: "Charles Miller", phone: "+251 94 004 0007", blood: "B+" },
      { name: "Habtamu Bogale", email: "habtamu.b@habucho.edu", grade: "12", sec: "B", stream: "Social Science", gender: "Male", id: "HPS-G12-008", dob: "2007-07-23", parent: "Bogale Worku", phone: "+251 94 004 0008", blood: "O+" },
      { name: "Kidist Shenkute", email: "kidist.s@habucho.edu", grade: "12", sec: "B", stream: "Social Science", gender: "Female", id: "HPS-G12-009", dob: "2007-09-08", parent: "Shenkute Desta", phone: "+251 94 004 0009", blood: "A-" },
      { name: "Liam Anderson", email: "liam.a@habucho.edu", grade: "12", sec: "B", stream: "Social Science", gender: "Male", id: "HPS-G12-010", dob: "2007-12-05", parent: "Mark Anderson", phone: "+251 94 004 0010", blood: "AB+" },
    ];

    const studentRecords = [];
    for (const s of studentsData) {
      const res = await pool.query(
        `INSERT INTO users (
          full_name, email, password, role, student_id, gender, grade_level, section, stream,
          date_of_birth, parent_name, parent_phone, address, academic_year, blood_group
        ) VALUES (
          $1, $2, $3, 'student', $4, $5, $6, $7, $8,
          $9, $10, $11, 'Addis Ababa', '2024/2025', $12
        ) ON CONFLICT (email) DO UPDATE SET
          full_name = EXCLUDED.full_name,
          student_id = EXCLUDED.student_id,
          grade_level = EXCLUDED.grade_level,
          section = EXCLUDED.section,
          stream = EXCLUDED.stream,
          role = 'student'
        RETURNING id, grade_level, section, stream`,
        [s.name, s.email, hashedPassword, s.id, s.gender, s.grade, s.sec, s.stream, s.dob, s.parent, s.phone, s.blood]
      );
      studentRecords.push(res.rows[0]);
    }

    // 4. Schedules for Grades 9, 10, 11, and 12
    await pool.query("DELETE FROM schedules");
    const schedulesList = [
      // Grade 9
      ['9', 'Mathematics', tMath, 'Monday', '08:30:00', '10:00:00'],
      ['9', 'English', tEnglish, 'Monday', '10:15:00', '11:45:00'],
      ['9', 'Physics', tPhysics, 'Tuesday', '08:30:00', '10:00:00'],
      ['9', 'Biology', tBio, 'Wednesday', '08:30:00', '10:00:00'],
      ['9', 'Chemistry', tBio, 'Thursday', '08:30:00', '10:00:00'],

      // Grade 10
      ['10', 'Mathematics', tMath, 'Monday', '10:15:00', '11:45:00'],
      ['10', 'Physics', tPhysics, 'Tuesday', '10:15:00', '11:45:00'],
      ['10', 'English', tEnglish, 'Wednesday', '10:15:00', '11:45:00'],
      ['10', 'Chemistry', tBio, 'Thursday', '10:15:00', '11:45:00'],
      ['10', 'Biology', tBio, 'Friday', '08:30:00', '10:00:00'],

      // Grade 11
      ['11', 'Mathematics', tMath, 'Monday', '08:30:00', '10:00:00'],
      ['11', 'Physics', tPhysics, 'Tuesday', '08:30:00', '10:00:00'],
      ['11', 'English', tEnglish, 'Wednesday', '08:30:00', '10:00:00'],
      ['11', 'Chemistry', tBio, 'Thursday', '08:30:00', '10:00:00'],
      ['11', 'Biology', tBio, 'Friday', '10:15:00', '11:45:00'],

      // Grade 12
      ['12', 'Mathematics', tMath, 'Tuesday', '10:15:00', '11:45:00'],
      ['12', 'Physics', tPhysics, 'Wednesday', '08:30:00', '10:00:00'],
      ['12', 'English', tEnglish, 'Thursday', '10:15:00', '11:45:00'],
      ['12', 'Chemistry', tBio, 'Friday', '08:30:00', '10:00:00'],
    ];

    for (const [grade, subj, teacher, day, start, end] of schedulesList) {
      await pool.query(
        `INSERT INTO schedules (grade_level, subject, teacher_id, day, start_time, end_time)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [grade, subj, teacher, day, start, end]
      );
    }

    // 5. Grades / Marks for Students across all grades
    await pool.query("DELETE FROM grades");
    const subjectsByGrade = {
      "9": [
        { subject: "Mathematics", teacher: tMath },
        { subject: "English", teacher: tEnglish },
        { subject: "Physics", teacher: tPhysics },
        { subject: "Biology", teacher: tBio },
      ],
      "10": [
        { subject: "Mathematics", teacher: tMath },
        { subject: "English", teacher: tEnglish },
        { subject: "Physics", teacher: tPhysics },
        { subject: "Chemistry", teacher: tBio },
      ],
      "11": [
        { subject: "Mathematics", teacher: tMath },
        { subject: "English", teacher: tEnglish },
        { subject: "Physics", teacher: tPhysics },
        { subject: "Biology", teacher: tBio },
      ],
      "12": [
        { subject: "Mathematics", teacher: tMath },
        { subject: "English", teacher: tEnglish },
        { subject: "Physics", teacher: tPhysics },
        { subject: "Chemistry", teacher: tBio },
      ],
    };

    for (let i = 0; i < studentRecords.length; i++) {
      const student = studentRecords[i];
      const subjects = subjectsByGrade[student.grade_level] || subjectsByGrade["11"];

      for (const subj of subjects) {
        // Generate realistic scores between 72 and 98
        const baseScore = 75 + ((i * 7 + subj.subject.length * 3) % 24);
        await pool.query(
          `INSERT INTO grades (
            student_id, teacher_id, subject, score, semester, academic_year,
            grade_level, section, assessment_type, total_marks, comments,
            submission_status, approved_at
          ) VALUES (
            $1, $2, $3, $4, 'Semester 1', '2024/2025',
            $5, $6, 'Final Exam', 100, 'Demonstrates consistent academic effort and good mastery.',
            'approved', CURRENT_TIMESTAMP
          )`,
          [student.id, subj.teacher, subj.subject, baseScore, student.grade_level, student.section]
        );
      }
    }

    // Populate academic summaries and calculate ranking for demo data
    try {
      await recalculateRankings("2024/2025", "Semester 1", "All");
      logger.info("Demo student rankings and academic summaries calculated successfully.");
    } catch (calcErr) {
      logger.warn(`Academic ranking calculation notice: ${calcErr.message}`);
    }

    // 6. Announcements
    const existingAnnounce = await pool.query("SELECT COUNT(*) FROM announcements");
    if (parseInt(existingAnnounce.rows[0].count, 10) === 0) {
      await pool.query(
        `INSERT INTO announcements (title, content, created_by) VALUES
         ('Welcome to 2024/2025 Academic Year', 'Habucho Preparatory School warmly welcomes all Grades 9-12 students, guardians, and faculty.', $1),
         ('Midterm Examination Dates Announced', 'First semester midterm examinations will commence next month across all grades 9 through 12.', $1),
         ('Science & Tech Club Orientation', 'Students interested in robotics and coding can attend the club meeting every Wednesday in Lab 2.', $2),
         ('National Examination Preparation for Grade 12', 'Special remedial tutorial sessions for Grade 12 college entrance exam start this Saturday.', $1)`,
        [tMath, tPhysics]
      );
    }

    // 7. Staff Profiles (visible on the public website — will impress your teacher!)
    const existingStaff = await pool.query("SELECT COUNT(*) FROM staff_profiles");
    if (parseInt(existingStaff.rows[0].count, 10) === 0) {
      await pool.query(
        `INSERT INTO staff_profiles (name, title, department, bio, display_order, is_active) VALUES
         ('Dr. Alemayehu Bekele', 'School Director / Principal', 'Administration',
          'Dr. Alemayehu holds a PhD in Educational Leadership from Addis Ababa University. With over 25 years of experience in Ethiopian education, he has led Habucho Preparatory School since its founding, fostering a culture of academic excellence and holistic student development.', 1, true),
         ('Mrs. Tsehay Gebremedhin', 'Vice Principal – Academic Affairs', 'Administration',
          'Mrs. Tsehay oversees the academic curriculum and teacher development. She holds an MA in Curriculum Design and has been instrumental in achieving the school''s consistently high national exam pass rates.', 2, true),
         ('Mr. Tesfaye Abebe', 'Head of Natural Sciences', 'Natural Sciences',
          'Mr. Tesfaye is a dedicated physics and chemistry educator with 18 years of experience. He established the school''s advanced science laboratory and mentors students for the National Science Olympiad.', 3, true),
         ('Mrs. Sarah Johnson', 'Senior Mathematics Teacher', 'Mathematics',
          'Mrs. Johnson brings a passion for making mathematics accessible and engaging. She has developed innovative teaching methods that have significantly improved student performance across all grade levels.', 4, true),
         ('Mr. Michael Chen', 'Physics Teacher & ICT Coordinator', 'Natural Sciences',
          'Mr. Chen integrates technology into science education and manages the school''s computer labs. He leads the Science and Technology Club and has guided students to win regional competitions.', 5, true),
         ('Mrs. Aster Belachew', 'English Language & Literature', 'Languages',
          'Mrs. Aster is an accomplished linguist fluent in English, Amharic, and Afaan Oromo. She coordinates the school''s debating society and creative writing program.', 6, true),
         ('Mr. Daniel Gebre', 'Biology Teacher & Lab Manager', 'Natural Sciences',
          'Mr. Daniel manages the biology laboratory and organizes field study trips. His hands-on teaching approach has inspired many students to pursue careers in medicine and environmental science.', 7, true),
         ('Mrs. Hiwot Tadesse', 'School Counselor', 'Student Services',
          'Mrs. Hiwot provides academic and emotional counseling to students. She holds a degree in Psychology and ensures every student has the support they need to thrive.', 8, true),
         ('Mr. Kebede Worku', 'Physical Education & Sports Director', 'Sports',
          'Mr. Kebede is a former national athlete who now channels his passion into training the next generation. Under his guidance, the school''s athletics team has won multiple inter-school championships.', 9, true),
         ('Mrs. Fatima Abdi', 'Librarian & Resource Center Manager', 'Library',
          'Mrs. Fatima manages the school''s extensive library and digital resource center with over 12,000 books and online databases, fostering a love of reading and independent research among students.', 10, true)`
      );
    }

    // 8. School Events (upcoming and past — shows a vibrant school life)
    const existingEvents = await pool.query("SELECT COUNT(*) FROM events");
    if (parseInt(existingEvents.rows[0].count, 10) === 0) {
      await pool.query(
        `INSERT INTO events (title, content, event_date, category, status) VALUES
         ('Annual Science Fair 2025', 'Grade 11 and 12 Natural Science students will present their innovative research projects. Topics include renewable energy solutions, water purification, and AI in agriculture. Open to all parents and community members.', '2025-01-20', 'Academic', 'published'),
         ('Inter-School Athletics Championship', 'Habucho School hosts the regional athletics meet. Over 500 student athletes from 12 schools will compete in track and field, volleyball, and football.', '2025-02-15', 'Sports', 'published'),
         ('Ethiopian National Day Celebration', 'Join us for cultural performances, traditional music, poetry recitals, and a special address by the school director honoring Ethiopia''s rich heritage.', '2025-03-02', 'Cultural', 'published'),
         ('Parent-Teacher Conference – Semester 1', 'Parents are invited to review their children''s academic progress, meet with subject teachers, and discuss strategies for continued improvement.', '2025-01-25', 'Meeting', 'published'),
         ('Grade 12 University Guidance Workshop', 'University admissions officers from Addis Ababa University, Jimma University, and Hawassa University will present information about programs, scholarships, and application procedures.', '2025-02-08', 'Academic', 'published'),
         ('World Environment Day – Tree Planting', 'Students and staff will plant 500 indigenous trees in the school compound and nearby community areas as part of our commitment to environmental sustainability.', '2025-06-05', 'Community', 'published'),
         ('Habucho School Graduation Ceremony 2025', 'Celebrating the achievements of our Grade 12 graduating class. Ceremony includes keynote speakers, award presentations, and cultural performances by students.', '2025-07-10', 'Ceremony', 'published'),
         ('National Exam Prep Bootcamp – Grade 12', 'An intensive 2-week preparation program covering all examination subjects with practice tests, time management strategies, and study techniques.', '2025-04-01', 'Academic', 'published')`
      );
    }

    // 9. Academic Programs (showcased on the public website)
    const existingPrograms = await pool.query("SELECT COUNT(*) FROM academic_programs");
    if (parseInt(existingPrograms.rows[0].count, 10) === 0) {
      await pool.query(
        `INSERT INTO academic_programs (name, description, category, display_order, is_active) VALUES
         ('Natural Science Stream', 'A rigorous program covering Mathematics, Physics, Chemistry, and Biology. Prepares students for university programs in engineering, medicine, technology, and scientific research. Features fully equipped laboratories and hands-on experimental learning.', 'Preparatory', 1, true),
         ('Social Science Stream', 'Comprehensive study of History, Geography, Economics, and Civics. Prepares students for careers in law, business, public administration, journalism, and international relations.', 'Preparatory', 2, true),
         ('General Secondary Education (Grade 9–10)', 'Foundation program that builds strong academic skills across all core subjects including Mathematics, English, Amharic, Sciences, and Social Studies. Students are prepared for the national Grade 10 examination.', 'Secondary', 3, true),
         ('English Language Excellence Program', 'An intensive English program featuring debate clubs, creative writing workshops, public speaking competitions, and Cambridge English preparation to build globally competitive communication skills.', 'Enrichment', 4, true),
         ('Science & Technology Club', 'Extracurricular program where students explore robotics, coding with Python, 3D printing, and participate in national science olympiads and innovation competitions.', 'Extracurricular', 5, true),
         ('Athletics & Physical Education', 'Comprehensive sports program including track and field, football, volleyball, and basketball. Regular inter-school competitions develop teamwork, discipline, and physical fitness.', 'Extracurricular', 6, true),
         ('Community Service & Leadership', 'Students develop leadership skills through community outreach projects including tutoring younger students, environmental cleanup campaigns, and visits to local charities.', 'Extracurricular', 7, true),
         ('University Preparation & Career Guidance', 'Dedicated counseling and mentorship program for Grade 12 students. Includes mock entrance exams, university application workshops, scholarship guidance, and career aptitude assessments.', 'Support', 8, true)`
      );
    }

    // 10. Website Settings (school branding and info)
    const existingSettings = await pool.query("SELECT COUNT(*) FROM website_settings");
    if (parseInt(existingSettings.rows[0].count, 10) === 0) {
      await pool.query(
        `INSERT INTO website_settings (key, value, description) VALUES
         ('school_name', 'Habucho Preparatory School', 'Official school name'),
         ('school_motto', 'Excellence Through Knowledge, Character Through Discipline', 'School motto displayed on the website'),
         ('school_phone', '+251 46 220 1234', 'Main school phone number'),
         ('school_email', 'info@habuchoschool.edu.et', 'Official school email address'),
         ('school_address', 'Habucho Town, West Arsi Zone, Oromia Region, Ethiopia', 'School physical address'),
         ('school_founded', '2005', 'Year the school was established'),
         ('school_students_count', '480', 'Approximate number of enrolled students'),
         ('school_teachers_count', '32', 'Number of teaching staff'),
         ('school_description', 'Habucho Preparatory School is a premier educational institution committed to nurturing academically excellent and morally upright students. Our modern facilities, dedicated faculty, and comprehensive curriculum prepare students for success in national examinations and beyond.', 'About the school paragraph'),
         ('school_vision', 'To be the leading preparatory school in the Oromia region, producing graduates who excel in higher education and contribute meaningfully to the development of Ethiopia and the world.', 'School vision statement'),
         ('school_mission', 'To provide quality education in a safe and inclusive learning environment, developing students'' intellectual abilities, critical thinking, and ethical values through innovative teaching and holistic development programs.', 'School mission statement')`
      );
    }

    // 11. Contact Messages (makes the admin inbox look realistic)
    const existingContacts = await pool.query("SELECT COUNT(*) FROM contact_messages");
    if (parseInt(existingContacts.rows[0].count, 10) === 0) {
      await pool.query(
        `INSERT INTO contact_messages (name, email, message) VALUES
         ('Ato Bekele Hailu', 'bekele.h@gmail.com', 'I am interested in enrolling my daughter for Grade 9 starting next academic year. Could you please share the admission requirements and deadlines?'),
         ('W/ro Mulu Tadesse', 'mulu.t@yahoo.com', 'Thank you for the excellent education my son has received at Habucho. His grades have improved tremendously since joining. We are truly grateful to all his teachers.'),
         ('Dr. Hassen Abdulla', 'hassen.a@gmail.com', 'I am a university professor and would like to offer a guest lecture on Environmental Science for your Grade 12 students. Please let me know if this would be possible.'),
         ('Ato Girma Tolessa', 'girma.t@outlook.com', 'We recently moved to the area and are looking for a quality preparatory school for our two children (Grades 10 and 11). Can we schedule a school tour?'),
         ('W/ro Sara Ahmed', 'sara.ahmed@gmail.com', 'The parent-teacher conference was very well organized. I appreciate the transparent communication about my child''s progress. Keep up the great work!')`
      );
    }

    // 12. Admission Applications (shows the admissions pipeline)
    const existingAdmissions = await pool.query("SELECT COUNT(*) FROM admission_applications");
    if (parseInt(existingAdmissions.rows[0].count, 10) === 0) {
      await pool.query(
        `INSERT INTO admission_applications (reference_number, applicant_name, email, phone, date_of_birth, gender, grade_level, parent_name, parent_phone, address, previous_school, message, status, document_paths) VALUES
         ('HPS-ADM-2025-001', 'Hanna Tekle', 'hanna.tekle@gmail.com', '+251 91 777 1234', '2010-04-15', 'Female', '9', 'Tekle Woldegiorgis', '+251 91 777 1235', 'Shashemene, West Arsi', 'Shashemene Primary School', 'My daughter has consistently been top of her class and we believe Habucho is the best school for her preparatory education.', 'pending', '{}'),
         ('HPS-ADM-2025-002', 'Yonas Berhane', 'yonas.b@gmail.com', '+251 92 888 2345', '2010-07-22', 'Male', '9', 'Berhane Gebremedhin', '+251 92 888 2346', 'Hawassa, Sidama', 'Hawassa International Academy', 'We are relocating to Habucho town and would like Yonas to continue his education at your prestigious school.', 'approved', '{}'),
         ('HPS-ADM-2025-003', 'Tsion Alemu', 'tsion.a@yahoo.com', '+251 93 999 3456', '2009-12-08', 'Female', '10', 'Alemu Desta', '+251 93 999 3457', 'Dodola, West Arsi', 'Dodola Secondary School', 'Tsion is passionate about science and would thrive in your Natural Science stream.', 'approved', '{}'),
         ('HPS-ADM-2025-004', 'Kedir Mohammed', 'kedir.m@gmail.com', '+251 94 111 4567', '2008-09-30', 'Male', '11', 'Mohammed Abdi', '+251 94 111 4568', 'Robe, Bale', 'Robe Preparatory School', 'Requesting transfer to Habucho for the Social Science stream. Kedir has strong academic records.', 'pending', '{}'),
         ('HPS-ADM-2025-005', 'Meti Gemechu', 'meti.g@outlook.com', '+251 95 222 5678', '2010-01-18', 'Female', '9', 'Gemechu Hundessa', '+251 95 222 5679', 'Kofele, West Arsi', 'Kofele Primary School', 'We have heard wonderful things about your school from the community. Excited to apply!', 'rejected', '{}')`
      );
    }

    logger.info("🎉 Full demo data populated: 40 students, 4 teachers, 10 staff profiles, 8 events, 8 programs, 5 admissions, 5 contact messages, and school settings.");
  } catch (error) {
    logger.error(`Error seeding demo data: ${error.message}`);
  }
};
