import Link from 'next/link';

export default function CallCard({ call }: { call: any }) {
  return (
    <div className="card call-card">
      <div className="call-card-header">
        <span className="call-status-dot active" />
        <span>Call #{(call.id as string).slice(0, 8)}</span>
      </div>
      <div className="call-card-info">
        <span className="small">Host: {(call.hostId as string).slice(0, 8)}</span>
        <span className="small">{call.patientIds?.length || 0} participant(s)</span>
        <span className="small">{new Date(call.createdAt).toLocaleString()}</span>
      </div>
      <div className="call-card-actions">
        <Link href={`/call/${call.id}`}><button className="btn btn-sm">Join Call</button></Link>
      </div>
    </div>
  );
}
