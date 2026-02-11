import { createOrGetUser, createSession, getUserByToken, findUserByPhoneAndRole, findUserByNmc, findUserByEmail } from '../../lib/db';

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
    const { intent = 'login', role, phone, email, password, name, nmc } = req.body;
    
    // Validate required fields
    if (!role || !phone) {
      return res.status(400).json({ error: 'Role and phone are required' });
    }

    if (intent === 'register') {
      // Validate registration fields
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      if (role === 'doctor' && (!name || !nmc)) {
        return res.status(400).json({ error: 'Name and NMC ID are required for doctors' });
      }

      // Check for existing user
      if (findUserByPhoneAndRole(phone, role)) {
        return res.status(400).json({ error: 'Phone number already registered' });
      }

      if (findUserByEmail(email)) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      if (role === 'doctor' && findUserByNmc(nmc)) {
        return res.status(400).json({ error: 'NMC ID already registered' });
      }

      // Create user
      const user = createOrGetUser({ phone, role, name, nmc, email, password });
      const token = createSession(user.id);
      res.setHeader('Set-Cookie', `medibot_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`);
      const safe = { ...user } as any;
      delete safe.token;
      delete safe.password;
      return res.json(safe);
    }

    // test login — auto-create a demo account and log in
    if (intent === 'test-login') {
      const testPhone = role === 'doctor' ? '0000000001' : '0000000002';
      const testEmail = role === 'doctor' ? 'testdoctor@medibot.test' : 'testpatient@medibot.test';
      const testName = role === 'doctor' ? 'Test Doctor' : 'Test Patient';
      let testUser = findUserByPhoneAndRole(testPhone, role);
      if (!testUser) {
        testUser = createOrGetUser({ phone: testPhone, role, name: testName, email: testEmail, password: 'test123', nmc: role === 'doctor' ? 'MH0000001' : undefined });
      }
      const tk = createSession(testUser.id);
      res.setHeader('Set-Cookie', `medibot_token=${tk}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`);
      const s = { ...testUser } as any;
      delete s.token; delete s.password;
      return res.json(s);
    }

    // login
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }
    const user = findUserByPhoneAndRole(phone, role);
    if (!user) {
      return res.status(404).json({ error: 'User not found. Please register first.' });
    }
    if (user.password && user.password !== password) {
      return res.status(401).json({ error: 'Incorrect password' });
    }
    
    const token = createSession(user.id);
    res.setHeader('Set-Cookie', `medibot_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`);
    const safe = { ...user } as any;
    delete safe.token;
    delete safe.password;
    return res.json(safe);
  }

  if (req.method === 'GET') {
    const cookies = parseCookies(req);
    const user = getUserByToken(cookies['medibot_token']);
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const safe = { ...user } as any;
    delete safe.token;
    delete safe.password;
    return res.json(safe);
  }

  if (req.method === 'DELETE') {
    res.setHeader('Set-Cookie', `medibot_token=; Path=/; HttpOnly; Max-Age=0`);
    return res.json({ ok: true });
  }

  res.status(405).end();
}
