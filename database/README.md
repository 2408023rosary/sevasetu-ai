# SevaSetu Database

MySQL 8.0+ database schema for the SevaSetu AI backend. Database name: `sevasetu`.

## Setup

1. Create the schema: `mysql -u root -p < database/schema.sql`
2. Load development data: `mysql -u root -p sevasetu < database/seed.sql`
3. Configure `backend/.env` with the same DB credentials.

The SQL schema mirrors the Sequelize models in `backend/src/models/`.

## Development credentials

All seeded accounts use password `password` and local-only addresses/contacts:
- citizen@sevasetu.local — CITIZEN
- officer@sevasetu.local — OFFICER
- admin@sevasetu.local — ADMIN
- superadmin@sevasetu.local — SUPER_ADMIN

Change or remove seed credentials before any real deployment.
