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

    // No real vitals data yet
    const vitals = {
      patientId,
      temperature: '-',
      bpm: '-',
      spo2: '-',
      bloodPressure: '-',
      respiratoryRate: '-',
      timestamp: new Date().toISOString()
    };
    return res.json(vitals);
  }

  res.status(405).end();
}
