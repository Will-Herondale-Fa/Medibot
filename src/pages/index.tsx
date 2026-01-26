import Link from 'next/link';

export default function Home() {
  return (
    <div className="hero">
      <div className="hero-content">
        <h1 className="hero-title">MediBot</h1>
        <p className="hero-subtitle">Telemedicine platform for rural clinics</p>
        <p className="hero-description">Connect patients and doctors through secure video calls, manage prescriptions, and send notifications.</p>
        <div className="hero-buttons">
          <Link href="/login?role=patient"><button className="btn btn-primary">Patient Login</button></Link>
          <Link href="/login?role=doctor"><button className="btn btn-secondary">Doctor Login</button></Link>
        </div>
      </div>
    </div>
  );
}
