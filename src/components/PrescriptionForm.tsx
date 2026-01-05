import { useState } from 'react';

export default function PrescriptionForm({ patientId, onSaved }: { patientId: string; onSaved?: () => void }) {
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);

  async function submit(e: any) {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/prescriptions', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ patientId, text })
    });
    setText(''); setSaving(false); onSaved && onSaved();
    alert('Saved');
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <textarea rows={3} value={text} onChange={(e: any) => setText(e.target.value)} placeholder="Prescription / notes" required />
      <button className="btn" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Rx'}</button>
    </form>
  );
}
