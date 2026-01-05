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

  useEffect(() => {
    fetch('/api/auth', { credentials: 'include' }).then(r => r.ok ? r.json() : null).then(setUser).catch(()=>setUser(null));
  }, []);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/calls?id=${id}`).then(r => r.ok ? r.json() : null).then(setCall);
  }, [id]);

  if (!id) return <div>Missing id</div>;
  if (!call) return <div>Loading call...</div>;

  async function notifyAll() {
    if (!user) return alert('Please login');
    setNotifying(true);
    const message = `Doctor started a call (${call.id})`;
    try {
      for (const pid of call.patientIds) {
        const res = await fetch('/api/notifications', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
          body: JSON.stringify({ to: pid, message, callId: call.id })
        });
        if (!res.ok) throw new Error('Failed to send');
      }
      alert('Notified');
    } catch (err: any) {
      alert(err?.message || 'Failed to notify');
    } finally { setNotifying(false); }
  }

  const canNotify = user?.id === call.hostId;
  const isPatient = user?.role === 'patient' && user?.id !== call.hostId;

  async function notifyDoctor() {
    if (!user) return alert('Please login');
    setNotifying(true);
    const message = `Patient ${user.name || user.phone} wants the doctor's attention (call ${call.id})`;
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ to: call.hostId, message, callId: call.id })
      });
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
      <h2>Call {call.id}</h2>
      <div>Host: {call.hostId}</div>
      <div>Participants: {call.patientIds?.join(', ')}</div>
      <div style={{ marginTop: 12 }}>
        <JitsiEmbed room={call.room || call.id} />
      </div>
      <div style={{ marginTop: 12 }}>
        {canNotify && <button className="btn" onClick={notifyAll} disabled={notifying}>{notifying ? 'Notifying...' : 'Notify participants'}</button>}
        {isPatient && <button className="btn" style={{ marginLeft: 8 }} onClick={notifyDoctor} disabled={notifying}>{notifying ? 'Notifying...' : 'Notify doctor'}</button>}
        <button style={{ marginLeft: 8 }} onClick={() => router.push('/')}>Leave</button>
      </div>

      <section style={{ marginTop: 20 }}>
        <h3>Notifications</h3>
        <NotificationsList />
      </section>
    </div>
  );
}
