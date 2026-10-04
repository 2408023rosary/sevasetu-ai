# Member 4 — Database

## CitizenCare Complaint Management System

This folder is the database deliverable for **Member 4**. It contains the database architecture, table definitions, relationships, demo/seed data, and database documentation.

### Files

- `schema.sql` — Creates the MySQL database, tables, constraints, indexes, and relationships.
- `seed.sql` — Inserts demo administrators, departments, employees, and complaints.
- `README.md` — Database documentation and setup instructions.

## Database

**DBMS:** MySQL 8+

**Database name:** `citizen_complaints`

### Tables

1. **admins** — administrator login/account data.
2. **departments** — government/service departments.
3. **employees** — workers assigned to departments.
4. **complaints** — citizen complaints, status, assignment, priority, and AI classification results.

### Relationships

- `employees.department_id` → `departments.id`
- `complaints.department_id` → `departments.id`
- `complaints.employee_id` → `employees.id`

The foreign keys use `ON DELETE SET NULL`, so removing a department or employee does not delete historical complaints.

### Complaint / AI fields

The `complaints` table stores:

- Citizen name and email
- Complaint title and description
- Original category
- `ai_category` for AI classification
- `severity` (`Low`, `Medium`, `High`, `Critical`)
- `priority_score` (0–100)
- Location and optional image path
- Complaint status (`Pending`, `In Progress`, `Resolved`, `Rejected`, `Reopened`)
- Department and employee assignment
- Created and resolved timestamps

### User storage

The current backend has two account types:

- `admins` for administrators
- `employees` for workers

Citizen identity/contact information is currently stored with each complaint (`citizen_name`, `citizen_email`) because the existing backend does not use a separate citizen account table. This keeps the schema compatible with the current APIs.

## Setup in MySQL / XAMPP

1. Start **MySQL** in XAMPP.
2. Open phpMyAdmin or the MySQL command line.
3. Run `schema.sql` first.
4. Run `seed.sql` second.
5. Configure the backend `.env` values:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_PORT=3306
DB_NAME=citizen_complaints
```

6. Start the backend from the `backend` folder.

The existing `backend/db.js` also creates the MySQL schema automatically when `initializeDatabase()` is used.

## Demo accounts

Admin:

- Email: `admin@gmail.com`
- Password: `admin123`

Demo worker password:

- `worker123`

## Backend coordination note

The schema intentionally matches the current MySQL structure used by `backend/db.js` and the complaint/auth/worker/dashboard API queries. Before changing columns, status values, or foreign-key relationships, coordinate with the Backend member because those API queries depend on these names and values.

### Important current-project note

The repository also contains `backend/server.js`, which includes a separate SQLite implementation (`backend/data/citizencare.sqlite`). The MySQL schema in this folder is aligned with `backend/db.js` and the Express route files. The team should use **one database implementation consistently** before the final integration/demo; do not maintain MySQL and SQLite as two competing production databases.
