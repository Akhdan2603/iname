import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { getBaseUrl } from '../api';

const AdminEditProject = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const baseUrl = getBaseUrl();

    const [clients, setClients] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        client_id: ''
    });
    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);

    useEffect(() => {
        // Load Data
        const loadData = async () => {
            try {
                const [clientsRes, projectRes] = await Promise.all([
                    api.get('/clients'),
                    api.get(`/projects/${id}`)
                ]);

                setClients(clientsRes.data);

                const p = projectRes.data;
                setFormData({
                    title: p.title,
                    description: p.description,
                    date: p.date,
                    client_id: p.client_id
                });
                setExistingImages(p.images || []);

            } catch (err) {
                console.error(err);
                alert('Gagal memuat data.');
                navigate('/admin/dashboard');
            }
        };
        loadData();
    }, [id, navigate]);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleFileChange = (e) => {
        setNewImages(e.target.files);
    };

    const handleDeleteImage = async (imgId) => {
        if (window.confirm('Hapus foto ini?')) {
            try {
                await api.delete(`/project-images/${imgId}`); // The router handles /project-images/:id DELETE
                setExistingImages(existingImages.filter(img => img.id !== imgId));
            } catch (err) {
                console.error(err);
                alert('Gagal menghapus gambar.');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Update Text Data
            await api.put(`/projects/${id}`, formData);

            // Upload New Images
            if (newImages.length > 0) {
                for (let i = 0; i < newImages.length; i++) {
                    const formDataImg = new FormData();
                    formDataImg.append('image', newImages[i]);
                    await api.post(`/projects/${id}/upload-image`, formDataImg, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                }
            }

            alert('Proyek berhasil diperbarui!');
            // Reload to show new images or redirect
            // For now redirect
            navigate('/admin/dashboard');
        } catch (err) {
            console.error(err);
            alert('Gagal memperbarui proyek.');
        }
    };

    return (
        <div className="form-container">
            <h2>Edit Proyek</h2>
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
                    <label>Foto Dokumentasi Saat Ini</label>
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px'}}>
                        {existingImages.map(img => (
                            <div key={img.id} style={{position: 'relative'}}>
                                <img
                                    src={`${baseUrl}/${img.image_path}`}
                                    alt="thumb"
                                    style={{width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px'}}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleDeleteImage(img.id)}
                                    style={{
                                        position: 'absolute', top: 0, right: 0,
                                        background: 'red', color: 'white', border: 'none',
                                        cursor: 'pointer', padding: '2px 5px', fontSize: '0.7rem'
                                    }}
                                >X</button>
                            </div>
                        ))}
                        {existingImages.length === 0 && <p style={{color: '#999'}}>Tidak ada foto.</p>}
                    </div>
                </div>

                <div className="form-group">
                    <label>Tambah Foto Baru</label>
                    <input
                        type="file"
                        className="form-control"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>

                <div style={{display: 'flex', gap: '1rem'}}>
                    <button type="submit" className="btn">Simpan Perubahan</button>
                    <button type="button" onClick={() => navigate('/admin/dashboard')} className="btn btn-secondary">Batal</button>
                </div>
            </form>
        </div>
    );
};

export default AdminEditProject;
