import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const roleQuery = typeof router.query.role === 'string' ? router.query.role : 'patient';
  const [role, setRole] = useState(roleQuery === 'doctor' ? 'doctor' : 'patient');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null as any);
  const [loading, setLoading] = useState(false);

  useEffect(() => { setRole(roleQuery === 'doctor' ? 'doctor' : 'patient'); }, [roleQuery]);

  async function submit(e: any) {
    e.preventDefault();
    setError(null);
    if (!phone || phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid phone number (min 10 digits)');
      return;
    }
    setLoading(true);
    try {
      if (!password) {
        setError('Please enter your password');
        setLoading(false);
        return;
      }
      const body = { intent: 'login', role, phone: phone.replace(/\D/g, ''), password };
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error || 'Login failed. Please check your credentials.');
        return;
      }
      const user = await res.json();
      router.push(user.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard');
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome back</h2>
        <p className="auth-subtitle">Sign in to your MediBot account</p>

        <form onSubmit={submit}>
          {error && <div className="error-banner">{error}</div>}

          <div className="form-group">
            <label htmlFor="role">Account Type</label>
            <select
              id="role"
              value={role}
              onChange={(e: any) => { setRole(e.target.value); setError(null); }}
            >
              <option value="patient">Patient</option>
              <option value="doctor">Healthcare Provider</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              placeholder="Enter your registered phone number"
              value={phone}
              onChange={(e: any) => { setPhone(e.target.value); setError(null); }}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e: any) => { setPassword(e.target.value); setError(null); }}
                required
              />
              <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password">
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link href="/register">Create one</Link></p>
        </div>
      </div>
    </div>
  );
}
