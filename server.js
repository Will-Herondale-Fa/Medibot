import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const { Pool } = pg;

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL not set');
  process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL, ssl: (process.env.NODE_ENV === 'production') ? { rejectUnauthorized: false } : false });

// Helper
const ensureUserBody = (req, res, next) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId required in body' });
  next();
};

// API routes
app.post('/api/users', async (req, res) => {
  const { userId, displayName, role } = req.body;
  if (!userId || !displayName || !role) return res.status(400).json({ error: 'userId, displayName and role are required' });
  try {
    await pool.query('INSERT INTO users (id, display_name, role) VALUES ($1, $2, $3) ON CONFLICT (id) DO UPDATE SET display_name = EXCLUDED.display_name, role = EXCLUDED.role', [userId, displayName, role]);
    res.json({ id: userId, displayName, role });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/patients', async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT id, display_name, role FROM users WHERE role = 'patient'");
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/calls', ensureUserBody, async (req, res) => {
  const { userId: doctor_id, patientId } = req.body;
  if (!patientId) return res.status(400).json({ error: 'patientId required' });
  const room = `medibot-${doctor_id}-${patientId}-${Date.now()}`;
  try {
    await pool.query('INSERT INTO calls (doctor_id, patient_id, room) VALUES ($1, $2, $3)', [doctor_id, patientId, room]);
    await pool.query('INSERT INTO notifications (to_user_id, type, message, room) VALUES ($1, $2, $3, $4)', [patientId, 'call', 'Doctor started a call', room]);
    res.json({ room });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/prescriptions', ensureUserBody, async (req, res) => {
  const { userId: doctor_id, patientId, text } = req.body;
  if (!patientId || !text) return res.status(400).json({ error: 'patientId and text required' });
  try {
    await pool.query('INSERT INTO prescriptions (doctor_id, patient_id, text) VALUES ($1, $2, $3)', [doctor_id, patientId, text]);
    await pool.query('INSERT INTO notifications (to_user_id, type, message) VALUES ($1, $2, $3)', [patientId, 'prescription', 'New prescription available']);
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/notifications', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'userId required' });
  try {
    const { rows } = await pool.query('SELECT * FROM notifications WHERE to_user_id = $1 ORDER BY created_at DESC', [userId]);
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/prescriptions', async (req, res) => {
  const { patientId } = req.query;
  if (!patientId) return res.status(400).json({ error: 'patientId required' });
  try {
    const { rows } = await pool.query('SELECT * FROM prescriptions WHERE patient_id = $1 ORDER BY created_at DESC', [patientId]);
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/calls', async (req, res) => {
  const { doctorId } = req.query;
  if (!doctorId) return res.status(400).json({ error: 'doctorId required' });
  try {
    const { rows } = await pool.query('SELECT * FROM calls WHERE doctor_id = $1 ORDER BY created_at DESC', [doctorId]);
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// Serve static build
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});