import { createPrescription, getPrescriptionsForPatient, getUserByToken } from '../../lib/db';

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
  if (req.method === 'POST') {
    const cookies = parseCookies(req);
    const user = getUserByToken(cookies['medibot_token']);
    const { patientId, text } = req.body;
    if (!user || user.role !== 'doctor') return res.status(401).end();
    if (!patientId || !text) return res.status(400).json({ error: 'patientId and text required' });
    const p = createPrescription(user.id, patientId, text);
    return res.json(p);
  }

  if (req.method === 'GET') {
    const patientId = String(req.query.patientId || '');
    if (!patientId) return res.status(400).json([]);
    const list = getPrescriptionsForPatient(patientId);
    return res.json(list);
  }

  res.status(405).end();
}
