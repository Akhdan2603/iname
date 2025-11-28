import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const AdminDashboard = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await api.get('/projects');
            
            // --- TAMBAHKAN LOG INI ---
            console.log("DATA DARI SERVER:", response.data);
            console.log("TIPE DATA:", typeof response.data);
            // -------------------------

            // Logika Penanganan Data yang Lebih Aman
            if (Array.isArray(response.data)) {
                // Kasus 1: Backend kirim langsung [ {...}, {...} ]
                setProjects(response.data);
            } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
                // Kasus 2: Backend kirim { status: "success", data: [ ... ] }
                setProjects(response.data.data);
            } else {
                // Kasus 3: Backend error atau kirim HTML
                console.error("Format data salah, diubah ke array kosong.");
                setProjects([]); 
            }

        } catch (err) {
            console.error(err);
            setProjects([]); // Pastikan tetap array kosong kalau error
            alert('Gagal memuat data proyek.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus proyek ini?')) {
            try {
                await api.delete(`/projects/${id}`);
                setProjects(projects.filter(p => p.id !== id));
            } catch (err) {
                console.error(err);
                alert('Gagal menghapus proyek.');
            }
        }
    };

    if (loading) return <p style={{textAlign: 'center'}}>Memuat dashboard...</p>;

    return (
        <div className="dashboard">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
                <h1>Dashboard Admin</h1>
                <Link to="/admin/projects/add" className="btn">Tambah Proyek Baru</Link>
            </div>

            <div style={{overflowX: 'auto'}}>
                <table className="dashboard-table">
                    <thead>
                        <tr>
                            <th>Judul</th>
                            <th>Klien</th>
                            <th>Tanggal</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(projects) && projects.map((project) => (
                            <tr key={project.id}>
                                <td>{project.title}</td>
                                <td>{project.client_name}</td>
                                <td>{project.date}</td>
                                <td>
                                    <div className="actions">
                                        <Link to={`/admin/projects/edit/${project.id}`} className="btn btn-secondary" style={{padding: '5px 10px', fontSize: '0.8rem'}}>Edit</Link>
                                        <button onClick={() => handleDelete(project.id)} className="btn btn-danger" style={{padding: '5px 10px', fontSize: '0.8rem'}}>Hapus</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {projects.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{textAlign: 'center'}}>Belum ada data proyek.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
