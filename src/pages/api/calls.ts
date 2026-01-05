import { createCall, getCallsForUser, getCallById, getUserByToken, findCallByParticipants } from '../../lib/db';
import { generateRoom, getRoomUrl } from '../../lib/meet';

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
    const hostId = user?.id || req.body.hostId;
    const patientIds = req.body.patientIds || [];
    // support reusing an existing call by id
    if (req.body.callId) {
      const c = getCallById(String(req.body.callId));
      if (!c) return res.status(404).end();
      return res.json(c);
    }

    // optional reuse by participant list
    const reuse = !!req.body.reuse;
    if (reuse && patientIds.length) {
      const existing = findCallByParticipants(patientIds);
      if (existing) return res.json(existing);
    }

    if (!hostId || !patientIds.length) return res.status(400).json({ error: 'hostId and patientIds required' });
    const room = generateRoom();
    const url = getRoomUrl(room);
    const call = createCall(hostId, patientIds, url, room);
    return res.json(call);
  }

  if (req.method === 'GET') {
    if (req.query.id) {
      const call = getCallById(String(req.query.id));
      if (!call) return res.status(404).end();
      return res.json(call);
    }
    const cookies = parseCookies(req);
    const user = getUserByToken(cookies['medibot_token']);
    if (!user) return res.status(401).end();
    const calls = getCallsForUser(user.id);
    return res.json(calls);
  }

  res.status(405).end();
}
