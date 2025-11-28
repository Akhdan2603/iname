import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('adminToken');

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="logo">PT Iname Utama</Link>
            <div className="nav-links">
                <Link to="/">Beranda</Link>
                <Link to="/about">Tentang Kami</Link>
                <Link to="/projects">Proyek</Link>
                {token ? (
                    <>
                        <Link to="/admin/dashboard">Dashboard</Link>
                        <button onClick={handleLogout} className="btn btn-danger" style={{padding: '5px 10px', fontSize: '0.9rem'}}>Logout</button>
                    </>
                ) : (
                    <Link to="/admin/login" className="nav-admin">Admin</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
