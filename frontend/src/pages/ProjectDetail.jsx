import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { getBaseUrl } from '../api';

const ProjectDetail = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await api.get(`/projects/${id}`);
                setProject(response.data);
            } catch (err) {
                console.error(err);
                setError('Gagal memuat detail proyek.');
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id]);

    if (loading) return <p style={{textAlign: 'center'}}>Memuat...</p>;
    if (error || !project) return <p style={{textAlign: 'center', color: 'red'}}>{error || 'Proyek tidak ditemukan'}</p>;

    const baseUrl = getBaseUrl();

    return (
        <div className="project-detail">
            <Link to="/projects" style={{display: 'inline-block', marginBottom: '1rem', color: '#666'}}>&larr; Kembali ke Daftar Proyek</Link>

            <div className="detail-header">
                <span className="client-badge">{project.client_name}</span>
                <h1 style={{color: 'var(--primary-color)', margin: '0.5rem 0'}}>{project.title}</h1>
                <p className="project-date">Tanggal Proyek: {new Date(project.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            <div style={{whiteSpace: 'pre-line', lineHeight: '1.8', color: '#444'}}>
                {project.description}
            </div>

            <h3 style={{marginTop: '2rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem'}}>Dokumentasi Proyek</h3>
            <div className="detail-gallery">
                {project.images && project.images.length > 0 ? (
                    project.images.map((img) => (
                        <a key={img.id} href={`${baseUrl}/${img.image_path}`} target="_blank" rel="noreferrer">
                            <img
                                src={`${baseUrl}/${img.image_path}`}
                                alt="Dokumentasi"
                                className="gallery-img"
                            />
                        </a>
                    ))
                ) : (
                    <p>Tidak ada foto dokumentasi.</p>
                )}
            </div>
        </div>
    );
};

export default ProjectDetail;
