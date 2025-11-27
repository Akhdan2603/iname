import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const AdminAddProject = () => {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        client_id: ''
    });

    // Untuk upload gambar
    const [images, setImages] = useState([]);

    useEffect(() => {
        // Fetch clients for dropdown
        const fetchClients = async () => {
            try {
                const res = await api.get('/clients');
                setClients(res.data);
            } catch (err) {
                console.error("Gagal memuat clients", err);
            }
        };
        fetchClients();
    }, []);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleFileChange = (e) => {
        setImages(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 1. Create Project
            const res = await api.post('/projects', formData);
            const projectId = res.data.id;

            // 2. Upload Images if any
            if (images.length > 0) {
                // Upload satu per satu karena API handle per file,
                // atau kita bisa loop request
                for (let i = 0; i < images.length; i++) {
                    const formDataImg = new FormData();
                    formDataImg.append('image', images[i]);
                    await api.post(`/projects/${projectId}/upload-image`, formDataImg, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                }
            }

            alert('Proyek berhasil ditambahkan!');
            navigate('/admin/dashboard');
        } catch (err) {
            console.error(err);
            alert('Terjadi kesalahan saat menyimpan proyek.');
        }
    };

    return (
        <div className="form-container">
            <h2>Tambah Proyek Baru</h2>
            <form onSubmit={handleSubmit} style={{marginTop: '2rem'}}>
                <div className="form-group">
                    <label>Judul Proyek</label>
                    <input
                        type="text"
                        name="title"
                        className="form-control"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Klien</label>
                    <select
                        name="client_id"
                        className="form-control"
                        value={formData.client_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Pilih Klien --</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>{client.name}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Tanggal Pengerjaan</label>
                    <input
                        type="date"
                        name="date"
                        className="form-control"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Deskripsi Lengkap</label>
                    <textarea
                        name="description"
                        className="form-control"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>

                <div className="form-group">
                    <label>Upload Foto Dokumentasi (Bisa pilih banyak)</label>
                    <input
                        type="file"
                        className="form-control"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>

                <div style={{display: 'flex', gap: '1rem'}}>
                    <button type="submit" className="btn">Simpan Proyek</button>
                    <button type="button" onClick={() => navigate('/admin/dashboard')} className="btn btn-secondary">Batal</button>
                </div>
            </form>
        </div>
    );
};

export default AdminAddProject;
