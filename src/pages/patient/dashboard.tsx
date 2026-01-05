import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function PatientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null as any);
  const [calls, setCalls] = useState([] as any[]);
  const [prescriptions, setPrescriptions] = useState([] as any[]);
  const [notifying, setNotifying] = useState(false);

  useEffect(() => {
    fetch('/api/auth', { credentials: 'include' }).then(r => r.ok ? r.json() : null).then(u => {
      if (!u || u.role !== 'patient') router.push('/login?role=patient'); else setUser(u);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    fetch('/api/calls', { credentials: 'include' }).then(r => r.json()).then(setCalls);
    fetch(`/api/prescriptions?patientId=${user.id}`).then(r => r.json()).then(setPrescriptions);
  }, [user]);

  async function notifyDoctor(call: any) {
    if (!user) return alert('Please login');
    setNotifying(true);
    const message = `Patient ${user.name || user.phone} requests attention for call ${call.id}`;
    try {
      const res = await fetch('/api/notifications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ to: call.hostId, message, callId: call.id }) });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || 'Failed to notify');
      }
      alert('Notified doctor');
    } catch (err: any) { alert(err?.message || 'Failed to notify'); }
    finally { setNotifying(false); }
  }

  return (
    <div>
      <h2>Patient dashboard</h2>
      <section>
        <h3>Upcoming Calls</h3>
        {calls.map((c: any) => (
          <div key={c.id} className="card" style={{ marginBottom: 8 }}>
            <div>Host: {c.hostId}</div>
            <div>{new Date(c.createdAt).toLocaleString()}</div>
            <button className="btn" onClick={() => window.open(c.url, '_blank')}>Open Meet</button>
            <button className="btn" style={{ marginLeft: 8 }} onClick={() => notifyDoctor(c)} disabled={notifying}>{notifying ? 'Notifying...' : 'Notify doctor'}</button>
          </div>
        ))}
      </section>

      <section style={{ marginTop: 20 }}>
        <h3>Prescriptions</h3>
        {prescriptions.map((p: any) => (
          <div key={p.id} className="card" style={{ marginBottom: 6 }}>
            <div><strong>From:</strong> {p.doctorId}</div>
            <div>{p.text}</div>
            <div className="small">{new Date(p.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
