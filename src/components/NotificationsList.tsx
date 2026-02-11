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

  if (!list.length) return (
    <div className="empty-state">
      <p>No notifications</p>
    </div>
  );

  return (
    <div className="notifications-list">
      <div className="notifications-header">
        <span className="badge">{list.length}</span>
        <button className="btn btn-outline-sm" onClick={fetchList}>Refresh</button>
      </div>
      <div className="card-list">
        {list.map((n: any) => (
          <div key={n.id} className="card notification-card">
            <div className="notification-dot" />
            <div className="notification-content">
              <p className="notification-message">{n.message}</p>
              <span className="small">{new Date(n.createdAt).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
