import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { insertUser } from '../lib/api';

function RoleSelect() {
    console.log('RoleSelect rendering');
    const [displayName, setDisplayName] = useState('');
    const navigate = useNavigate();

    const handleRole = async (role) => {
        if (!displayName.trim()) {
            alert('Please enter a display name');
            return;
        }
        await insertUser(displayName, role);
        navigate(role === 'doctor' ? '/doctor' : '/patient');
    };

    return (
        <div className="container">
            <h1>Welcome to MediBot</h1>
            <p>Select your role:</p>
            <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Display Name"
                required
            />
            <button onClick={() => handleRole('doctor')}>Doctor</button>
            <button onClick={() => handleRole('patient')}>Patient</button>
        </div>
    );
}

export default RoleSelect;