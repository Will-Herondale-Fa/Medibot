import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Register() {
  const router = useRouter();
  const [role, setRole] = useState('patient' as any);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [nmc, setNmc] = useState('');
  const [error, setError] = useState(null as any);

  async function submit(e: any) {
    e.preventDefault();
    if (!phone || phone.trim().length < 4) { setError('Please enter a valid phone'); return; }
    if (role === 'doctor' && (!name || !nmc)) { setError('Doctor name and NMC required'); return; }
    const body: any = { intent: 'register', role, phone, name, nmc };
    const res = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(body) });
    if (!res.ok) { const txt = await res.text(); setError(txt || 'Failed to register'); return; }
    const user = await res.json();
    router.push(user.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard');
  }

  return (
    <div style={{ maxWidth: 560 }}>
      <h2>Register</h2>
      <form onSubmit={submit}>
        <label>
          Role
          <select value={role} onChange={(e: any) => setRole(e.target.value as any)}>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>
        </label>

        <label>Phone<input value={phone} onChange={(e: any) => setPhone(e.target.value)} required /></label>

        {role === 'doctor' && <>
          <label>Name<input value={name} onChange={(e: any) => setName(e.target.value)} required /></label>
          <label>NMC ID<input value={nmc} onChange={(e: any) => setNmc(e.target.value)} required /></label>
        </>}

        <div style={{ marginTop: 8 }}>
          <button className="btn" type="submit">Register</button>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}
