# Entity-Relationship Diagram

## Habucho Preparatory School Database

```mermaid
erDiagram
    USERS {
        int id PK
        varchar full_name
        varchar email UK
        varchar password
        varchar role
        varchar profile_picture
        timestamp created_at
    }

    ANNOUNCEMENTS {
        int id PK
        varchar title
        text content
        int created_by FK
        timestamp created_at
    }

    SCHEDULES {
        int id PK
        varchar grade_level
        varchar subject
        int teacher_id FK
        varchar day
        time start_time
        time end_time
    }

    GRADES {
        int id PK
        int student_id FK
        int teacher_id FK
        varchar subject
        numeric score
        varchar semester
    }

    CONTACT_MESSAGES {
        int id PK
        varchar name
        varchar email
        text message
        timestamp created_at
    }

    USERS ||--o{ ANNOUNCEMENTS : "creates"
    USERS ||--o{ SCHEDULES : "teaches"
    USERS ||--o{ GRADES : "receives (student)"
    USERS ||--o{ GRADES : "assigns (teacher)"
```

## Relationships

| Relationship | Type | Description |
|---|---|---|
| users → announcements | One-to-Many | A user (admin/teacher) can create many announcements |
| users → schedules | One-to-Many | A teacher can have many scheduled classes |
| users → grades (student) | One-to-Many | A student can have many grade records |
| users → grades (teacher) | One-to-Many | A teacher can assign many grades |
| contact_messages | Independent | No foreign keys — public submissions |

## Role Values

- `admin` — Full system access
- `teacher` — Manage grades, create announcements, view schedules
- `student` — View own grades, schedules, announcements; submit contact messages
