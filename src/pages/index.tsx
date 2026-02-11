import Link from 'next/link';

export default function Home() {
  return (
    <>
      <div className="hero">
        <div className="hero-content">
          <h1 className="hero-title">MediBot</h1>
          <p className="hero-subtitle">Telemedicine for rural clinics</p>
          <p className="hero-description">Connect patients and doctors through secure video calls, manage prescriptions, and send real-time notifications — all in one platform.</p>
          <div className="hero-buttons">
            <Link href="/login?role=patient"><button className="btn btn-primary">Patient Login</button></Link>
            <Link href="/login?role=doctor"><button className="btn btn-secondary">Doctor Login</button></Link>
          </div>
        </div>
      </div>

      <section className="features-section">
        <h2 className="features-heading">How It Works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14" /><rect x="1" y="6" width="14" height="12" rx="2" ry="2" />
              </svg>
            </div>
            <h3>Video Consultations</h3>
            <p>Secure, browser-based video calls between doctors and patients. No downloads required.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <h3>Digital Prescriptions</h3>
            <p>Doctors can write and send prescriptions digitally. Patients can view them anytime.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
            </div>
            <h3>Real-Time Alerts</h3>
            <p>Instant notifications keep both parties informed about calls, updates, and prescriptions.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <h3>Vitals Monitoring</h3>
            <p>Track patient vitals including heart rate, temperature, SpO2, and blood pressure.</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to get started?</h2>
        <p>Create an account and connect with healthcare providers today.</p>
        <Link href="/register"><button className="btn btn-primary">Create Account</button></Link>
      </section>
    </>
  );
}
