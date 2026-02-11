import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NotificationsList from '../../components/NotificationsList';

export default function PatientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null as any);
  const [calls, setCalls] = useState([] as any[]);
  const [prescriptions, setPrescriptions] = useState([] as any[]);
  const [vitals, setVitals] = useState(null as any);
  const [notifying, setNotifying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth', { credentials: 'include' }).then(r => r.ok ? r.json() : null).then(u => {
      if (!u || u.role !== 'patient') router.push('/login?role=patient'); else setUser(u);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    Promise.all([
      fetch('/api/calls', { credentials: 'include' }).then(r => r.json()),
      fetch('/api/prescriptions?patientId=' + user.id).then(r => r.json()),
      fetch('/api/patient/vitals', { credentials: 'include' }).then(r => r.json()),
    ]).then(([c, p, v]) => {
      setCalls(c);
      setPrescriptions(p);
      setVitals(v);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  async function notifyDoctor(call: any) {
    if (!user) return;
    setNotifying(true);
    const message = 'Patient ' + (user.name || user.phone) + ' requests attention for call ' + call.id;
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ to: call.hostId, message: message, callId: call.id }),
      });
      if (!res.ok) throw new Error('Failed');
      alert('Doctor notified successfully');
    } catch {
      alert('Failed to notify doctor');
    } finally {
      setNotifying(false);
    }
  }

  if (loading) return (
    <div className="loading-screen">
      <div className="loading-spinner" />
      <p>Loading your dashboard...</p>
    </div>
  );

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2 className="dashboard-title">Patient Dashboard</h2>
          <p className="dashboard-subtitle">Welcome back, {user?.name || user?.phone}</p>
        </div>
      </div>

      {vitals && (
        <section className="dashboard-section">
          <h3 className="section-title">Your Vitals</h3>
          <div className="vitals-grid">
            <div className="vital-card">
              <span className="vital-label">Temperature</span>
              <span className="vital-value">{vitals.temperature === '-' ? '-' : vitals.temperature + '°C'}</span>
            </div>
            <div className="vital-card">
              <span className="vital-label">Heart Rate</span>
              <span className="vital-value">{vitals.bpm === '-' ? '-' : vitals.bpm + ' bpm'}</span>
            </div>
            <div className="vital-card">
              <span className="vital-label">SpO2</span>
              <span className="vital-value">{vitals.spo2 === '-' ? '-' : vitals.spo2 + '%'}</span>
            </div>
            <div className="vital-card">
              <span className="vital-label">Blood Pressure</span>
              <span className="vital-value">{vitals.bloodPressure}</span>
            </div>
            <div className="vital-card">
              <span className="vital-label">Respiratory Rate</span>
              <span className="vital-value">{vitals.respiratoryRate === '-' ? '-' : vitals.respiratoryRate + ' /min'}</span>
            </div>
          </div>
        </section>
      )}

      <div className="dashboard-grid">
        <section className="dashboard-section">
          <h3 className="section-title">Upcoming Calls</h3>
          {calls.length === 0 ? (
            <div className="empty-state">
              <p>No upcoming calls scheduled</p>
            </div>
          ) : (
            <div className="card-list">
              {calls.map((c: any) => (
                <div key={c.id} className="card call-card">
                  <div className="call-card-header">
                    <span className="call-status-dot active" />
                    <span className="small">Call #{c.id.slice(0, 8)}</span>
                  </div>
                  <div className="call-card-info">
                    <span className="small">{new Date(c.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="call-card-actions">
                    <button className="btn btn-sm" onClick={() => router.push('/call/' + c.id)}>Join Call</button>
                    <button className="btn btn-outline-sm" onClick={() => notifyDoctor(c)} disabled={notifying}>
                      {notifying ? 'Sending...' : 'Notify Doctor'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="dashboard-section">
          <h3 className="section-title">Prescriptions</h3>
          {prescriptions.length === 0 ? (
            <div className="empty-state">
              <p>No prescriptions yet</p>
            </div>
          ) : (
            <div className="card-list">
              {prescriptions.map((p: any) => (
                <div key={p.id} className="card prescription-card">
                  <div className="prescription-header">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <span className="small">{new Date(p.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="prescription-text">{p.text}</p>
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
