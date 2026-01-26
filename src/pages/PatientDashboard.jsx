import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotifications, getPrescriptions } from '../lib/api';

function PatientDashboard() {
    const [notifications, setNotifications] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [lastUpdated, setLastUpdated] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setNotifications(await getNotifications());
        setPrescriptions(await getPrescriptions());
        setLastUpdated(new Date().toLocaleString());
    };

    const handleJoinCall = (room) => {
        navigate(`/call/${room}`);
    };

    const logout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('displayName');
        localStorage.removeItem('role');
        window.location.href = '/';
    };

    return (
        <div className="container">
            <h1>Patient Dashboard</h1>
            <p>Last updated: {lastUpdated}</p>
            <h2>Notifications</h2>
            <ul>
                {notifications.map(n => (
                    <li key={n.id}>
                        {n.message} ({new Date(n.createdAt).toLocaleString()})
                        {n.type === 'call' && <button onClick={() => handleJoinCall(n.room)}>Join Call</button>}
                    </li>
                ))}
            </ul>
            <h2>Prescriptions</h2>
            <ul>
                {prescriptions.map(p => (
                    <li key={p.id}>{p.text}</li>
                ))}
            </ul>
            <button onClick={loadData}>Refresh</button>
            <button onClick={logout}>Logout</button>
        </div>
    );
}

export default PatientDashboard;