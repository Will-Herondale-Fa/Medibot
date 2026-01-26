-- MediBot PostgreSQL Schema
-- Run this in your Render PostgreSQL database

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    display_name TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS calls (
    id SERIAL PRIMARY KEY,
    doctor_id TEXT NOT NULL,
    patient_id TEXT NOT NULL,
    room TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS prescriptions (
    id SERIAL PRIMARY KEY,
    doctor_id TEXT NOT NULL,
    patient_id TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    to_user_id TEXT NOT NULL,
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    room TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Optional: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_calls_doctor ON calls(doctor_id);
CREATE INDEX IF NOT EXISTS idx_calls_patient ON calls(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(to_user_id);
