import { listPatients } from '../../lib/db';

export default function handler(req: any, res: any) {
  if (req.method === 'GET') {
    const patients = listPatients();
    return res.json(patients);
  }
  res.status(405).end();
}
