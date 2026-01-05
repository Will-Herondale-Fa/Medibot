import fs from 'fs';
import { join } from 'path';

declare const process: any;

const DB_FILE = join(process.cwd(), 'data', 'db.json');

const db = {
  users: [
    { id: 'doc-1', role: 'doctor', phone: '9991112222', name: 'Dr. A', nmc: 'NMC123' },
    { id: 'pat-1', role: 'patient', phone: '9001110001', name: 'Patient One' },
    { id: 'pat-2', role: 'patient', phone: '9001110002', name: 'Patient Two' }
  ],
  calls: [],
  prescriptions: [],
  notifications: []
};

fs.mkdirSync(join(process.cwd(), 'data'), { recursive: true });
fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
console.log('Seeded', DB_FILE);
