import { listPatients, listDoctors } from '../../lib/db';

export default function handler(req: any, res: any) {
  if (req.method === 'GET') {
    if (req.query.role === 'doctor') {
      return res.json(listDoctors());
    }
    const patients = listPatients();
    return res.json(patients);
  }
  res.status(405).end();
}
