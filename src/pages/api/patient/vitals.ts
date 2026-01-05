import { getUserByToken } from '../../../lib/db';

function parseCookies(req: any) {
  const header = req.headers.cookie || '';
  const obj: Record<string, string> = {};
  header.split(';').forEach((p: string) => {
    const [k, v] = p.split('=').map((s: string | undefined) => s && s.trim());
    if (k) obj[k] = v as string;
  });
  return obj;
}

export default function handler(req: any, res: any) {
  const cookies = parseCookies(req);
  const user = getUserByToken(cookies['medibot_token']);
  if (!user) return res.status(401).end();

  if (req.method === 'GET') {
    // Doctor can request vitals for a patient via ?id=
    const patientId = String(req.query.id || user.id);
    if (user.role === 'doctor' && !req.query.id) return res.status(400).json({ error: 'patient id required' });

    // Dummy vitals right now
    const vitals = {
      patientId,
      temperature: 36.7 + Math.round(Math.random() * 10) / 10, // pseudo-random small variance
      bpm: 60 + Math.floor(Math.random() * 30),
      spo2: 96 + Math.floor(Math.random() * 3),
      bloodPressure: `${110 + Math.floor(Math.random() * 20)}/${70 + Math.floor(Math.random() * 10)}`,
      respiratoryRate: 14 + Math.floor(Math.random() * 6),
      timestamp: new Date().toISOString()
    };
    return res.json(vitals);
  }

  res.status(405).end();
}
