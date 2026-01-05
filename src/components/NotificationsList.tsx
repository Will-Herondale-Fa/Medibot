import { useEffect, useState } from 'react';

export default function NotificationsList() {
  const [list, setList] = useState([] as any[]);

  async function fetchList() {
    try {
      const r = await fetch('/api/notifications', { credentials: 'include' });
      if (!r.ok) { setList([]); return; }
      const data = await r.json(); setList(data);
    } catch {
      setList([]);
    }
  }

  useEffect(() => {
    fetchList();
    const id = setInterval(fetchList, 5000);
    return () => clearInterval(id);
  }, []);

  if (!list.length) return <div>No notifications</div>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>Notifications</strong>
        <button className="btn" onClick={fetchList} style={{ padding: '6px 10px' }}>Refresh</button>
      </div>
      {list.map((n: any) => (
        <div key={n.id} className="card">
          <div className="small">{new Date(n.createdAt).toLocaleString()}</div>
          <div>{n.message}</div>
        </div>
      ))}
    </div>
  );
}
