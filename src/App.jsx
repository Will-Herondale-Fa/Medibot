import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getCurrentUser } from './lib/api';
import RoleSelect from './pages/RoleSelect';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import Call from './pages/Call';
import './App.css';

function App() {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = () => {
        const currentUser = getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
            setRole(currentUser.role);
        }
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={user ? <Navigate to={role === 'doctor' ? '/doctor' : '/patient'} /> : <RoleSelect />} />
                <Route path="/doctor" element={user && role === 'doctor' ? <DoctorDashboard /> : <Navigate to="/" />} />
                <Route path="/patient" element={user && role === 'patient' ? <PatientDashboard /> : <Navigate to="/" />} />
                <Route path="/call/:room" element={<Call />} />
            </Routes>
        </Router>
    );
}

export default App;
