import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();
  const roleQuery = typeof router.query.role === 'string' ? router.query.role : 'patient';
  const [role, setRole] = useState(roleQuery === 'doctor' ? 'doctor' : 'patient');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState(null as any);

  useEffect(() => { setRole(roleQuery === 'doctor' ? 'doctor' : 'patient'); }, [roleQuery]);

  async function submit(e: any) {
    e.preventDefault();
    if (!phone || phone.trim().length < 4) { setError('Please enter a valid phone'); return; }
    const body: any = { intent: 'login', role, phone };
    const res = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(body) });
    if (!res.ok) { setError('Failed to login'); return; }
    const user = await res.json();
    router.push(user.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard');
  }

  return (
    <div style={{ maxWidth: 560 }}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <label>
          Role
          <select value={role} onChange={(e: any) => setRole(e.target.value as any)}>
            <option value="patient">Patient (phone)</option>
            <option value="doctor">Doctor (phone)</option>
          </select>
        </label>

        <label>Phone<input value={phone} onChange={(e: any) => setPhone(e.target.value)} required /></label>

        <div style={{ marginTop: 8 }}>
          <button className="btn" type="submit">Login</button>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}
