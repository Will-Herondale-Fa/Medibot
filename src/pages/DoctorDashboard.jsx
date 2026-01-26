import { useState, useEffect } from 'react';
import { getPatients, getCalls, getPrescriptions, startCall, createPrescription } from '../lib/api';

function DoctorDashboard() {
    const [patients, setPatients] = useState([]);
    const [calls, setCalls] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [lastUpdated, setLastUpdated] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setPatients(await getPatients());
        setCalls(await getCalls());
        setPrescriptions(await getPrescriptions());
        setLastUpdated(new Date().toLocaleString());
    };

    const handleStartCall = async (patientId) => {
        await startCall(patientId);
        loadData();
        alert('Call started, patient notified');
    };

    const handleCreatePrescription = async (patientId) => {
        const text = prompt('Enter prescription text');
        if (text) {
            await createPrescription(patientId, text);
            loadData();
            alert('Prescription created');
        }
    };

    const logout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('displayName');
        localStorage.removeItem('role');
        window.location.href = '/';
    };

    return (
        <div className="container">
            <h1>Doctor Dashboard</h1>
            <p>Last updated: {lastUpdated}</p>
            <h2>Patients</h2>
            <ul>
                {patients.map(p => (
                    <li key={p.id}>
                        {p.displayName}
                        <button onClick={() => handleStartCall(p.id)}>Start Call</button>
                        <button onClick={() => handleCreatePrescription(p.id)}>Create Prescription</button>
                    </li>
                ))}
            </ul>
            <h2>Active Calls</h2>
            <ul>
                {calls.map(c => (
                    <li key={c.id}>Call with patient {c.patient_id} - Room: {c.room}</li>
                ))}
            </ul>
            <h2>Prescriptions</h2>
            <ul>
                {prescriptions.map(p => (
                    <li key={p.id}>Prescription for patient {p.patient_id}: {p.text}</li>
                ))}
            </ul>
            <button onClick={loadData}>Refresh</button>
            <button onClick={logout}>Logout</button>
        </div>
    );
}

export default DoctorDashboard;