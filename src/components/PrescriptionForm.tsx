import { useState } from 'react';

export default function PrescriptionForm({ patientId, onSaved }: { patientId: string; onSaved?: () => void }) {
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  async function submit(e: any) {
    e.preventDefault();
    if (!text.trim()) return;
    setSaving(true);
    try {
      await fetch('/api/prescriptions', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ patientId, text })
      });
      setText('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
      onSaved && onSaved();
    } catch {} finally { setSaving(false); }
  }

  return (
    <form onSubmit={submit} className="rx-form">
      <textarea
        className="rx-textarea"
        rows={3}
        value={text}
        onChange={(e: any) => setText(e.target.value)}
        placeholder="Write prescription or clinical notes..."
        required
      />
      <div className="rx-actions">
        <button className="btn btn-sm" type="submit" disabled={saving || !text.trim()}>
          {saving ? 'Saving...' : 'Save Prescription'}
        </button>
        {success && <span className="success-text">Saved!</span>}
      </div>
    </form>
  );
}
