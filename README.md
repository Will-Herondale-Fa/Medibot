# MediBot MVP

A minimal telemedicine demo app for rural clinics.

## Setup (Local / Render PostgreSQL)

1. Create a PostgreSQL database (Render Postgres or local Postgres). For Render: create a service and copy the **DATABASE_URL**.
2. Ensure the environment variable `DATABASE_URL` is set (Render -> Environment > Add `DATABASE_URL`).
3. Run these SQL commands (in psql or Render SQL Editor) to create tables (snake_case recommended):

   ```sql
   CREATE TABLE users (
       id TEXT PRIMARY KEY,
       display_name TEXT,
       role TEXT
   );

   CREATE TABLE calls (
       id SERIAL PRIMARY KEY,
       doctor_id TEXT,
       patient_id TEXT,
       room TEXT,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE prescriptions (
       id SERIAL PRIMARY KEY,
       doctor_id TEXT,
       patient_id TEXT,
       text TEXT,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE notifications (
       id SERIAL PRIMARY KEY,
       to_user_id TEXT,
       type TEXT,
       message TEXT,
       room TEXT,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

4. For demo, disable Row Level Security (RLS) on Render if enabled. This project assumes RLS is off for demo simplicity.

5. Run `npm install` then `npm start` to build (postinstall builds) and start the server.

**Demo mode:** This project is configured for quick demos: RLS is disabled and `DATABASE_URL` is used for convenience. **Do not** use this configuration in production — your data and connection string are not secure.

6. Visit your Render service URL to view the app.

## Data Shapes

- **users**: id, display_name, role
- **notifications**: to_user_id, type, message, room (for calls), created_at
- **prescriptions**: doctor_id, patient_id, text, created_at
- **calls**: doctor_id, patient_id, room, created_at

## Known Limitations

- Row Level Security (RLS) is turned **off** for demo convenience; this is insecure for production.
- PostgreSQL column names are case-sensitive — prefer **snake_case** (e.g., `doctor_id`, `created_at`) and keep discipline.
- There is no authentication layer for this demo; identity is simulated using `localStorage` and passed to the server in API calls. This is intentionally minimal for a PoC.
- The database connection string (`DATABASE_URL`) is required and must be kept secret in production; for demo it's in Render environment variables.

## Usage

- Open the app, enter display name, select role (anonymous login).
- Doctor: See patients by name, start calls, create prescriptions.
- Patient: See notifications with timestamps, join calls, view prescriptions.

## Final MVP Feature List

- Role selection + display name (anonymous auth)
- Doctor: View patients, start video call (Jitsi), create prescription
- Patient: View notifications (calls/prescriptions), join video call, view prescriptions

## What Was Intentionally Left Out and Why

- Real-time updates: Manual refresh with timestamps; no WebSockets for MVP.
- User profiles: Display name only; minimal for demo.
- Call history/end calls: Start/join only; core flow.
- Advanced auth/security: Anonymous; no passwords or permissions.
- Production features: Error handling, validation, UI polish.
- Custom backend: Appwrite BaaS.
- Extra features: Chat, file uploads, etc.; minimal viable.

## Page Structure and Flow

- **/**: RoleSelect (name + role) → anonymous auth → `/doctor` or `/patient`
- **/doctor**: DoctorDashboard (patients/calls/prescriptions + actions)
- **/patient**: PatientDashboard (notifications/prescriptions + join call)
- **/call/:room**: Call (Jitsi embed)

**Flow**: Enter name → Select role → Dashboard → Refresh → Actions.

Flow: Select role → Dashboard → Actions (start/join calls, create/view prescriptions).

Optimized for easy deploy (Vite build to static) and demo (SPA with routing).
