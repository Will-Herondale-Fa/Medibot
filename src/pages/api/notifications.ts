import { addNotification, getNotificationsForUser, getUserByToken } from '../../lib/db';

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
    const { to, message, callId } = req.body;
    if (!user) return res.status(401).end();
    if (!to || !message) return res.status(400).json({ error: 'to and message required' });
    const n = addNotification(user.id, to, message, callId);
    return res.json(n);
  }

  if (req.method === 'GET') {
    const cookies = parseCookies(req);
    const user = getUserByToken(cookies['medibot_token']);
    if (!user) return res.status(401).end();
    const list = getNotificationsForUser(user.id);
    return res.json(list);
  }

  res.status(405).end();
}
