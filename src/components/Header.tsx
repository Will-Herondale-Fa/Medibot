import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Header() {
  const [user, setUser] = useState(null as any);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth', { credentials: 'include' }).then(r => r.ok ? r.json() : null).then(setUser);

    const handle = () => fetch('/api/auth', { credentials: 'include' }).then(r => r.ok ? r.json() : null).then(setUser);
    (router.events as any).on('routeChangeComplete', handle);
    return () => (router.events as any).off('routeChangeComplete', handle);
  }, [router.events]);

  async function logout() {
    await fetch('/api/auth', { method: 'DELETE', credentials: 'include' });
    setUser(null);
    setMenuOpen(false);
    router.push('/');
  }

  return (
    <header className="header">
      <Link href="/" className="header-brand">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
        <span>MediBot</span>
      </Link>

      <button className="mobile-menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
        <span className={`hamburger ${menuOpen ? 'open' : ''}`} />
      </button>

      <nav className={`header-nav ${menuOpen ? 'nav-open' : ''}`}>
        {user ? (
          <>
            <div className="user-info">
              <span className="user-avatar">{(user.name || user.phone || '?')[0].toUpperCase()}</span>
              <span className="user-name">{user.name || user.phone}</span>
              <span className={`user-badge ${user.role}`}>{user.role}</span>
            </div>
            <Link href={user.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'} className="nav-link" onClick={() => setMenuOpen(false)}>
              Dashboard
            </Link>
            <button className="btn btn-outline-sm" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link href="/login" className="nav-link" onClick={() => setMenuOpen(false)}>Login</Link>
            <Link href="/register" onClick={() => setMenuOpen(false)}>
              <button className="btn btn-sm">Register</button>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
