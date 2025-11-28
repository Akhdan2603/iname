import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/admin/login', { username, password });
            const { token, username: user } = response.data;
            localStorage.setItem('adminToken', token);
            localStorage.setItem('adminUser', user);
            navigate('/admin/dashboard');
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Login gagal. Periksa koneksi atau server.');
            }
        }
    };

    return (
        <div className="form-container">
            <h2 style={{textAlign: 'center', marginBottom: '1.5rem', color: 'var(--primary-color)'}}>Login Admin</h2>
            {error && <div style={{backgroundColor: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '4px', marginBottom: '1rem'}}>{error}</div>}
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn" style={{width: '100%'}}>Masuk</button>
            </form>
        </div>
    );
};

export default AdminLogin;
