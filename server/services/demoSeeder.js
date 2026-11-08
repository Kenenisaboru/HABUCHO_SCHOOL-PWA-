import bcrypt from "bcryptjs";
import logger from "../utils/logger.js";

const DEMO_PASSWORD = "Password123!";

export const seedDemoData = async (pool) => {
  try {
    const studentCountRes = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'student'");
    const currentStudentCount = parseInt(studentCountRes.rows[0].count, 10);

    if (currentStudentCount >= 40) {
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
            grade_level, section, assessment_type, total_marks, comments
          ) VALUES (
            $1, $2, $3, $4, 'Semester 1', '2024/2025',
            $5, $6, 'Final Exam', 100, 'Demonstrates consistent academic effort and good mastery.'
          )`,
          [student.id, subj.teacher, subj.subject, baseScore, student.grade_level, student.section]
        );
      }
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

    logger.info("Demo data populated successfully: 40 students (10 in each Grade 9, 10, 11, 12), 4 teachers, full schedules, and grade records.");
  } catch (error) {
    logger.error(`Error seeding demo data: ${error.message}`);
  }
};
