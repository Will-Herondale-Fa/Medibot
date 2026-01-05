import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import CallCard from '../../components/CallCard';
import PrescriptionForm from '../../components/PrescriptionForm';
import NotificationsList from '../../components/NotificationsList';

export default function DoctorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null as any);
  const [patients, setPatients] = useState([] as any[]);
  const [selected, setSelected] = useState([] as string[]);
  const [calls, setCalls] = useState([] as any[]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth', { credentials: 'include' }).then(r => r.ok ? r.json() : null).then(u => {
      if (!u || u.role !== 'doctor') router.push('/login?role=doctor'); else setUser(u);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    Promise.all([
      fetch('/api/users').then(r => r.json()),
      fetch('/api/calls', { credentials: 'include' }).then(r => r.json())
    ]).then(([p, c]) => { setPatients(p); setCalls(c); setLoading(false); });
  }, [user]);

  async function createCall() {
    if (!selected.length) return alert('Pick at least one patient');
    const res = await fetch('/api/calls', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ patientIds: selected, reuse: true }) });
    const call = await res.json();
    setCalls((prev: any[]) => {
      const exists = prev.some(c => c.id === call.id);
      if (exists) return [call, ...prev.filter(c => c.id !== call.id)];
      return [call, ...prev];
    });
    const joinedMsg = `Doctor ${user.name || user.phone} joined a call`;
    const startedMsg = `Doctor ${user.name || user.phone} started a call`;
    const msg = calls.some((c: any) => c.id === call.id) ? joinedMsg : startedMsg;
    selected.forEach((pid: string) => fetch('/api/notifications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ to: pid, message: msg, callId: call.id }) }));
    router.push(`/call/${call.id}`);
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Doctor dashboard</h2>
      <section>
        <h3>Pick patients (multi)</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {patients.map((p: any) => (
            <label key={p.id} style={{ border: '1px solid #ddd', padding: 8 }}>
              <input type="checkbox" checked={selected.includes(p.id)} onChange={(e: any) => setSelected((prev: string[]) => e.target.checked ? [...prev, p.id] : prev.filter((id: string) => id !== p.id))} /> {p.name || p.phone}
              <div style={{ marginTop: 6 }}>
                <PrescriptionForm patientId={p.id} onSaved={() => {}} />
              </div>
            </label>
          ))}
        </div>
        <div style={{ marginTop: 8 }}>
          <button className="btn" onClick={createCall}>Create call + notify</button>
        </div>
      </section>

      <section style={{ marginTop: 24 }}>
        <h3>Calls</h3>
        {calls.map((c: any) => (
          <div key={c.id}>
            <CallCard call={c} />
          </div>
        ))}
      </section>

      <section style={{ marginTop: 24 }}>
        <h3>Notifications</h3>
        <NotificationsList />
      </section>
    </div>
  );
}
