import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Header() {
  const [user, setUser] = useState(null as any);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth', { credentials: 'include' }).then(r => r.ok ? r.json() : null).then(setUser);

    const handle = () => fetch('/api/auth', { credentials: 'include' }).then(r => r.ok ? r.json() : null).then(setUser);
    // re-check auth when route changes (so Header updates after login/register)
    (router.events as any).on('routeChangeComplete', handle);
    return () => (router.events as any).off('routeChangeComplete', handle);
  }, [router.events]);

  async function logout() {
    await fetch('/api/auth', { method: 'DELETE', credentials: 'include' });
    setUser(null);
    router.push('/');
  }

  return (
    <header>
      <div><Link href="/"><strong>MediBot</strong></Link></div>
      <nav style={{ display: 'flex', gap: 8 }}>
        {user ? (
          <>
            <div>{user.name || user.phone} ({user.role})</div>
            <Link href={user.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'}><button>Dashboard</button></Link>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link href="/login"><button>Login</button></Link>
            <Link href="/register"><button>Register</button></Link>
          </>
        )}
      </nav>
    </header>
  );
}
