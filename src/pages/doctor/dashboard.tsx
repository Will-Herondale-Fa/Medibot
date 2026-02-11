import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PrescriptionForm from '../../components/PrescriptionForm';
import NotificationsList from '../../components/NotificationsList';

export default function DoctorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null as any);
  const [patients, setPatients] = useState([] as any[]);
  const [selected, setSelected] = useState([] as string[]);
  const [calls, setCalls] = useState([] as any[]);
  const [loading, setLoading] = useState(true);
  const [rxPatient, setRxPatient] = useState(null as string | null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredPatients = patients.filter((p: any) => {
    const q = searchQuery.toLowerCase();
    return (p.name || '').toLowerCase().includes(q) || (p.phone || '').includes(q);
  });

  async function createCall() {
    if (!selected.length) return alert('Select at least one patient');
    const res = await fetch('/api/calls', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientIds: selected, reuse: true }),
    });
    const call = await res.json();
    setCalls((prev: any[]) => {
      const exists = prev.some(c => c.id === call.id);
      if (exists) return [call, ...prev.filter(c => c.id !== call.id)];
      return [call, ...prev];
    });

    const msg = 'Dr. ' + (user.name || user.phone) + ' started a call';
    selected.forEach((pid: string) =>
      fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ to: pid, message: msg, callId: call.id }),
      })
    );
    router.push('/call/' + call.id);
  }

  function togglePatient(id: string, checked: boolean) {
    setSelected((prev: string[]) => checked ? [...prev, id] : prev.filter((x: string) => x !== id));
  }

  if (loading) return (
    <div className="loading-screen">
      <div className="loading-spinner" />
      <p>Loading dashboard...</p>
    </div>
  );

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2 className="dashboard-title">Doctor Dashboard</h2>
          <p className="dashboard-subtitle">Welcome, Dr. {user?.name || user?.phone}</p>
        </div>
        <div className="dashboard-actions">
          <button className="btn" onClick={createCall} disabled={!selected.length}>
            Start Call ({selected.length})
          </button>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-section">
          <div className="section-header">
            <h3 className="section-title">Patients</h3>
            <span className="badge">{patients.length}</span>
          </div>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search patients by name or phone..."
              value={searchQuery}
              onChange={(e: any) => setSearchQuery(e.target.value)}
            />
          </div>
          {filteredPatients.length === 0 ? (
            <div className="empty-state"><p>No patients found</p></div>
          ) : (
            <div className="patient-list">
              {filteredPatients.map((p: any) => (
                <div key={p.id} className={'patient-item' + (selected.includes(p.id) ? ' selected' : '')}>
                  <label className="patient-select">
                    <input
                      type="checkbox"
                      checked={selected.includes(p.id)}
                      onChange={(e: any) => togglePatient(p.id, e.target.checked)}
                    />
                    <span className="patient-avatar">{(p.name || p.phone || '?')[0].toUpperCase()}</span>
                    <div className="patient-info">
                      <span className="patient-name">{p.name || 'Patient'}</span>
                      <span className="patient-phone">{p.phone}</span>
                    </div>
                  </label>
                  <button
                    className="btn btn-outline-sm"
                    onClick={() => setRxPatient(rxPatient === p.id ? null : p.id)}
                  >
                    {rxPatient === p.id ? 'Close' : 'Write Rx'}
                  </button>
                  {rxPatient === p.id && (
                    <div className="rx-form-container">
                      <PrescriptionForm patientId={p.id} onSaved={() => setRxPatient(null)} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="dashboard-section">
          <div className="section-header">
            <h3 className="section-title">Recent Calls</h3>
            <span className="badge">{calls.length}</span>
          </div>
          {calls.length === 0 ? (
            <div className="empty-state"><p>No calls yet</p></div>
          ) : (
            <div className="card-list">
              {calls.map((c: any) => (
                <div key={c.id} className="card call-card">
                  <div className="call-card-header">
                    <span className="call-status-dot active" />
                    <span className="small">Call #{c.id.slice(0, 8)}</span>
                  </div>
                  <div className="call-card-info">
                    <span className="small">{c.patientIds.length} participant(s)</span>
                    <span className="small">{new Date(c.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="call-card-actions">
                    <button className="btn btn-sm" onClick={() => router.push('/call/' + c.id)}>Rejoin</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="dashboard-section">
        <h3 className="section-title">Notifications</h3>
        <NotificationsList />
      </section>
    </div>
  );
}
