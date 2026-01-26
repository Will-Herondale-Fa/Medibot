export const getCurrentUser = () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return null;
    return {
        id: userId,
        displayName: localStorage.getItem('displayName'),
        role: localStorage.getItem('role')
    };
};

export const setUser = (displayName, role) => {
    const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('userId', userId);
    localStorage.setItem('displayName', displayName);
    localStorage.setItem('role', role);
    return { id: userId, displayName, role };
};

// Defensive helper: ensures a user is present before DB operations
export const ensureUser = () => {
    const u = getCurrentUser();
    if (!u || !u.id) throw new Error('No userId: please enter a display name and select a role');
    return u;
};

export const insertUser = async (displayName, role) => {
    const user = setUser(displayName, role);
    await fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: user.id, displayName, role }) });
    return user;
};

export const getPatients = async () => {
    const res = await fetch('/api/patients');
    if (!res.ok) throw new Error('Failed to load patients');
    return res.json();
};

export const startCall = async (patientId) => {
    const user = ensureUser();
    const res = await fetch('/api/calls', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: user.id, patientId }) });
    if (!res.ok) throw new Error('Failed to start call');
    const data = await res.json();
    return data.room;
};

export const createPrescription = async (patientId, text) => {
    const user = ensureUser();
    const res = await fetch('/api/prescriptions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: user.id, patientId, text }) });
    if (!res.ok) throw new Error('Failed to create prescription');
    return res.json();
};

export const getNotifications = async () => {
    const user = ensureUser();
    const res = await fetch(`/api/notifications?userId=${encodeURIComponent(user.id)}`);
    if (!res.ok) throw new Error('Failed to load notifications');
    return res.json();
};

export const getPrescriptions = async () => {
    const user = ensureUser();
    const res = await fetch(`/api/prescriptions?patientId=${encodeURIComponent(user.id)}`);
    if (!res.ok) throw new Error('Failed to load prescriptions');
    return res.json();
};

export const getCalls = async () => {
    const user = ensureUser();
    const res = await fetch(`/api/calls?doctorId=${encodeURIComponent(user.id)}`);
    if (!res.ok) throw new Error('Failed to load calls');
    return res.json();
};