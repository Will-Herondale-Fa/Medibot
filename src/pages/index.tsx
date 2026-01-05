import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>MediBot</h1>
      <p>Video + prescriptions for rural clinics (minimal demo)</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <Link href="/login?role=patient"><button>Patient Login</button></Link>
        <Link href="/login?role=doctor"><button>Doctor Login</button></Link>
      </div>
    </div>
  );
}
