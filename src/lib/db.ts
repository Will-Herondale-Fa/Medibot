declare const process: any;
import fs from 'fs';
import { join } from 'path';
import crypto from 'crypto';

const DB_FILE = join(process.cwd(), 'data', 'db.json');

type Role = 'patient' | 'doctor';
export type User = { id: string; role: Role; phone: string; name?: string; nmc?: string; token?: string };
export type Call = { id: string; hostId: string; patientIds: string[]; url: string; room?: string; createdAt: string };
export type Prescription = { id: string; doctorId: string; patientId: string; text: string; createdAt: string };
export type NotificationItem = { id: string; fromId: string; toId: string; message: string; callId?: string; createdAt: string };

interface DB {
  users: User[];
  calls: Call[];
  prescriptions: Prescription[];
  notifications: NotificationItem[];
}

function read(): DB {
  if (!fs.existsSync(DB_FILE)) return { users: [], calls: [], prescriptions: [], notifications: [] };
  try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); } catch { return { users: [], calls: [], prescriptions: [], notifications: [] }; }
}

function write(state: DB) {
  fs.mkdirSync(join(process.cwd(), 'data'), { recursive: true });
  fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2));
}

function genId() { return Date.now().toString(36) + '-' + crypto.randomBytes(3).toString('hex'); }

export function createOrGetUser({ phone, role, name, nmc }: { phone: string; role: Role; name?: string; nmc?: string }) {
  const db = read();
  let user = db.users.find(u => u.phone === phone && u.role === role);
  if (!user) {
    user = { id: genId(), phone, role, name, nmc };
    db.users.push(user);
    write(db);
  }
  return user;
}

export function createSession(userId: string) {
  const db = read();
  const user = db.users.find(u => u.id === userId);
  if (!user) return null;
  const token = crypto.randomBytes(16).toString('hex');
  user.token = token;
  write(db);
  return token;
}

export function getUserByToken(token?: string | undefined) {
  if (!token) return null;
  const db = read();
  return db.users.find(u => u.token === token) || null;
}

export function listPatients() {
  const db = read();
  return db.users.filter(u => u.role === 'patient');
}

export function createCall(hostId: string, patientIds: string[], url: string, room?: string) {
  const db = read();
  const call: Call = { id: genId(), hostId, patientIds, url, room, createdAt: new Date().toISOString() };
  db.calls.push(call);
  write(db);
  return call;
}

export function getCallById(id: string) {
  const db = read();
  return db.calls.find(c => c.id === id) || null;
}

export function findCallByParticipants(patientIds: string[]) {
  const db = read();
  return db.calls.find(c => c.patientIds.length === patientIds.length && patientIds.every(id => c.patientIds.includes(id))) || null;
}

export function getCallsForUser(userId: string) {
  const db = read();
  return db.calls.filter(c => c.hostId === userId || c.patientIds.includes(userId));
}

export function createPrescription(doctorId: string, patientId: string, text: string) {
  const db = read();
  const p: Prescription = { id: genId(), doctorId, patientId, text, createdAt: new Date().toISOString() };
  db.prescriptions.push(p);
  write(db);
  return p;
}

export function getPrescriptionsForPatient(patientId: string) {
  const db = read();
  return db.prescriptions.filter(p => p.patientId === patientId);
}

export function addNotification(fromId: string, toId: string, message: string, callId?: string) {
  const db = read();
  const n: NotificationItem = { id: genId(), fromId, toId, message, callId, createdAt: new Date().toISOString() };
  db.notifications.push(n);
  write(db);
  return n;
}

export function getNotificationsForUser(userId: string) {
  const db = read();
  return db.notifications.filter(n => n.toId === userId);
}

export function findUserByPhoneAndRole(phone: string, role: Role) {
  const db = read();
  return db.users.find(u => u.phone === phone && u.role === role) || null;
}

export function findUserByNmc(nmc?: string) {
  if (!nmc) return null;
  const db = read();
  return db.users.find(u => u.nmc === nmc) || null;
}
