import Link from 'next/link';

export default function CallCard({ call }: { call: any }) {
  return (
    <div className="card">
      <div><strong>Call</strong> {call.id}</div>
      <div>Host: {call.hostId}</div>
      {call.room && <div>Room: {call.room}</div>}
      <div>Participants: {call.patientIds?.join(', ')}</div>
      <div className="small">{new Date(call.createdAt).toLocaleString()}</div>
      <div style={{ marginTop: 8 }}>
        <button className="btn" onClick={() => window.open(call.url, '_blank')}>Open Jitsi</button>
        <Link href={`/call/${call.id}`}><button className="btn" style={{ marginLeft: 8 }}>Join</button></Link>
      </div>
    </div>
  );
}
