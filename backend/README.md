# SevaSetu AI Backend

Production-oriented Node.js/Express REST API for the SevaSetu AI public-service complaint platform.

## Architecture

Routes → validation/auth middleware → controllers → services → Sequelize models → MySQL. External AI classification is isolated in `src/services/aiService.js` and is optional: when `AI_SERVICE_URL` is empty or unavailable, complaint creation continues using validated user/default values.

## Requirements

- Node.js 20 LTS or newer
- MySQL 8.0+
- npm 10+

## Install

```bash
cd backend
cp .env.example .env
npm install
```

Create the database with `mysql -u root -p < ../database/schema.sql`, then load development data with `mysql -u root -p sevasetu < ../database/seed.sql`.

Edit `.env` for DB credentials and strong JWT secrets. Do not commit `.env`.

## Run

Development: `npm run dev`
Production: `NODE_ENV=production npm start`

The API is available at `http://localhost:5000/api`. React/Vite on `http://localhost:5173` is allowed by default.

`AUTO_SYNC=true` may be used only for local development when you want Sequelize to create/update tables. For production, use the reviewed SQL schema and controlled migrations.

## Authentication

Register/login returns a short-lived access JWT and a database-backed refresh JWT. Refresh rotates the stored token and revokes the previous token. Logout revokes the supplied refresh token. Access tokens carry `sub`, `role`, and `type=access`.

Never expose password hashes or refresh-token records through API responses.

## Roles

- CITIZEN: own complaints/profile/notifications; can reopen resolved/rejected complaints.
- OFFICER: assigned complaints and workflow updates.
- ADMIN: complaints, assignments, departments, users, statistics.
- SUPER_ADMIN: all administrative operations including department deactivation.

## Complaint workflow

`SUBMITTED → UNDER_REVIEW → ASSIGNED → IN_PROGRESS → RESOLVED/REJECTED`; citizens may reopen a resolved/rejected complaint. Every actual status change creates `complaint_status_history` and a notification.

Category-to-department mapping is name-based, not ID-based: ROADS→Public Works, GARBAGE/SANITATION→Sanitation, WATER→Water Supply, DRAINAGE→Drainage, ELECTRICITY/STREET_LIGHT→Electricity, PUBLIC_PROPERTY→Municipal Services, TRAFFIC→Roads, OTHER→Municipal Services.

## API endpoints

### Auth
- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/auth/refresh`
- POST `/api/auth/logout`
- GET `/api/auth/me`

### Complaints
- POST `/api/complaints`
- GET `/api/complaints?page=1&limit=10&status=IN_PROGRESS&category=ROADS&priority=HIGH&department_id=<uuid>&search=pothole&sort=created_at&order=DESC`
- GET `/api/complaints/:id`
- PATCH `/api/complaints/:id`
- DELETE `/api/complaints/:id` (ADMIN/SUPER_ADMIN)
- PATCH `/api/complaints/:id/status`
- POST `/api/complaints/:id/assign` (ADMIN/SUPER_ADMIN)
- POST `/api/complaints/:id/reopen`
- GET `/api/complaints/:id/history`
- POST `/api/complaints/:id/images` multipart field `image`

### Users
- GET/PATCH `/api/users/me`
- GET `/api/users` (ADMIN/SUPER_ADMIN)
- GET `/api/users/:id` (ADMIN/SUPER_ADMIN)
- PATCH `/api/users/:id/status` (ADMIN/SUPER_ADMIN)

### Departments
- GET `/api/departments`
- GET `/api/departments/:id`
- POST/PATCH `/api/departments/:id` management (ADMIN/SUPER_ADMIN)
- DELETE `/api/departments/:id` (SUPER_ADMIN; soft-deactivates)

### Notifications
- GET `/api/notifications`
- PATCH `/api/notifications/:id/read`
- PATCH `/api/notifications/read-all`

### Admin
- GET `/api/admin/dashboard`
- GET `/api/admin/statistics`

### Health
- GET `/api/health` performs a real Sequelize `authenticate()` check and returns HTTP 503 when the DB is unavailable.

## File uploads

Images are stored under `uploads/`, use UUID filenames, accept only JPEG/PNG/WebP MIME types, and default to a 5 MiB per-file limit. Original filenames are not trusted. Uploaded files are served under `/uploads/<filename>`.

For production, use private/object storage and signed URLs if required by deployment policy.

## AI service contract

Set `AI_SERVICE_URL` to the Member 3 HTTP endpoint and optionally `AI_SERVICE_API_KEY`. The backend sends JSON containing `title`, `description`, `category`, `latitude`, `longitude`, and `address`. Expected JSON response:

```json
{"category":"ROADS","subcategory":"POTHOLE","severity":"HIGH","priority":"URGENT","confidence":0.95,"summary":"Road surface damage reported."}
```

The AI response is validated for confidence range. AI errors/timeouts do not crash the API or prevent complaint persistence. No fake AI result is generated.

## Testing

`npm test` runs real Jest + Supertest tests against an in-memory SQLite Sequelize database. This avoids requiring a separate MySQL server for CI while exercising the same ORM models, routes, authentication, validation, transactions, and authorization. Production remains MySQL.

## Development credentials

After loading `database/seed.sql`, use password `password` for the four local-only seeded accounts documented in `../database/README.md`.

## Troubleshooting

- `ECONNREFUSED 3306`: start MySQL and check DB_HOST/DB_PORT.
- `Unknown database sevasetu`: run `schema.sql`.
- `Access denied`: verify DB_USER/DB_PASSWORD.
- CORS error: set `CORS_ORIGIN` to the exact frontend origin(s), comma-separated.
- Upload rejection: send multipart/form-data with field name `image` and JPEG/PNG/WebP content.
- AI unavailable: leave `AI_SERVICE_URL` empty during local development; complaints continue without AI enrichment.
