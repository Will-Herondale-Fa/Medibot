import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import JitsiEmbed from '../../components/JitsiEmbed';
import NotificationsList from '../../components/NotificationsList';

export default function CallPage() {
  const router = useRouter();
  const { id } = router.query;
  const [call, setCall] = useState(null as any);
  const [user, setUser] = useState(null as any);
  const [notifying, setNotifying] = useState(false);
  const [notified, setNotified] = useState(false);

  useEffect(() => {
    fetch('/api/auth', { credentials: 'include' }).then(r => r.ok ? r.json() : null).then(setUser).catch(() => setUser(null));
  }, []);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/calls?id=${id}`).then(r => r.ok ? r.json() : null).then(setCall);
  }, [id]);

  if (!id) return (
    <div className="loading-screen"><p>Missing call ID</p></div>
  );
  if (!call) return (
    <div className="loading-screen">
      <div className="loading-spinner" />
      <p>Connecting to call...</p>
    </div>
  );

  async function notifyAll() {
    if (!user) return;
    setNotifying(true);
    const message = `Dr. ${user.name || user.phone} started a call`;
    try {
      for (const pid of call.patientIds) {
        await fetch('/api/notifications', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
          body: JSON.stringify({ to: pid, message, callId: call.id })
        });
      }
      setNotified(true);
      setTimeout(() => setNotified(false), 3000);
    } catch {} finally { setNotifying(false); }
  }

  async function notifyDoctor() {
    if (!user) return;
    setNotifying(true);
    const message = `Patient ${user.name || user.phone} needs attention`;
    try {
      await fetch('/api/notifications', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ to: call.hostId, message, callId: call.id })
      });
      setNotified(true);
      setTimeout(() => setNotified(false), 3000);
    } catch {} finally { setNotifying(false); }
  }

  const canNotify = user?.id === call.hostId;
  const isPatient = user?.role === 'patient' && user?.id !== call.hostId;

  return (
    <div className="call-page">
      <div className="call-toolbar">
        <div className="call-info">
          <span className="call-status-dot active" />
          <span>Call #{(call.id as string).slice(0, 8)}</span>
          <span className="small">{call.patientIds.length} participant(s)</span>
        </div>
        <div className="call-actions">
          {canNotify && (
            <button className="btn btn-sm" onClick={notifyAll} disabled={notifying}>
              {notifying ? 'Sending...' : 'Notify Patients'}
            </button>
          )}
          {isPatient && (
            <button className="btn btn-sm" onClick={notifyDoctor} disabled={notifying}>
              {notifying ? 'Sending...' : 'Notify Doctor'}
            </button>
          )}
          <button className="btn btn-outline-sm" onClick={() => router.push(user?.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard')}>
            Leave Call
          </button>
        </div>
      </div>

      {notified && <div className="toast">Notification sent successfully</div>}

      <div className="call-video-container">
        <JitsiEmbed room={call.room || call.id} />
      </div>

      <div className="call-sidebar">
        <h3 className="section-title">Notifications</h3>
        <NotificationsList />
      </div>
    </div>
  );
}
