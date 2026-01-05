import { createOrGetUser, createSession, getUserByToken, findUserByPhoneAndRole, findUserByNmc } from '../../lib/db';

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
    const { intent = 'login', role, phone, name, nmc } = req.body;
    if (!role || !phone) return res.status(400).json({ error: 'role and phone required' });

    if (intent === 'register') {
      if (role === 'doctor' && (!name || !nmc)) return res.status(400).json({ error: 'name and nmc required for doctors' });
      if (findUserByPhoneAndRole(phone, role)) return res.status(400).json({ error: 'user already exists' });
      if (role === 'doctor' && findUserByNmc(nmc)) return res.status(400).json({ error: 'NMC already in use' });
      const user = createOrGetUser({ phone, role, name, nmc });
      const token = createSession(user.id);
      res.setHeader('Set-Cookie', `medibot_token=${token}; Path=/; HttpOnly; SameSite=Lax`);
      const safe = { ...user } as any; delete safe.token; return res.json(safe);
    }

    // login
    const user = findUserByPhoneAndRole(phone, role);
    if (!user) return res.status(404).json({ error: 'user not found; please register' });
    const token = createSession(user.id);
    res.setHeader('Set-Cookie', `medibot_token=${token}; Path=/; HttpOnly; SameSite=Lax`);
    const safe = { ...user } as any; delete safe.token; return res.json(safe);
  }

  if (req.method === 'GET') {
    const cookies = parseCookies(req);
    const user = getUserByToken(cookies['medibot_token']);
    if (!user) return res.status(401).end();
    const safe = { ...user } as any;
    delete safe.token;
    return res.json(safe);
  }

  if (req.method === 'DELETE') {
    res.setHeader('Set-Cookie', `medibot_token=; Path=/; HttpOnly; Max-Age=0`);
    return res.json({ ok: true });
  }

  res.status(405).end();
}
