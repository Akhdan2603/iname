import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getBaseUrl } from '../api';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await api.get('/projects');
                setProjects(response.data);
            } catch (err) {
                console.error(err);
                setError('Gagal memuat data proyek.');
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    if (loading) return <p style={{textAlign: 'center'}}>Memuat proyek...</p>;
    if (error) return <p style={{textAlign: 'center', color: 'red'}}>{error}</p>;

    const baseUrl = getBaseUrl();

    return (
        <div className="projects-page">
            <h1 style={{textAlign: 'center', color: 'var(--primary-color)'}}>Portofolio Proyek</h1>
            <div className="projects-grid">
                {projects.map((project) => (
                    <div key={project.id} className="project-card">
                        <div className="project-thumbnail-wrapper">
                            {project.thumbnail ? (
                                <img
                                    src={`${baseUrl}/${project.thumbnail}`}
                                    alt={project.title}
                                    className="project-thumbnail"
                                />
                            ) : (
                                <div className="project-thumbnail" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999'}}>
                                    No Image
                                </div>
                            )}
                        </div>
                        <div className="project-content">
                            <span className="client-badge">{project.client_name}</span>
                            <h3>{project.title}</h3>
                            <p className="project-date">{new Date(project.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <p>{project.description.substring(0, 100)}...</p>
                            <Link to={`/projects/${project.id}`} style={{display: 'inline-block', marginTop: '1rem', fontWeight: 'bold', color: 'var(--primary-color)'}}>
                                Lihat Detail &rarr;
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
            {projects.length === 0 && <p style={{textAlign: 'center', marginTop: '2rem'}}>Belum ada proyek yang ditampilkan.</p>}
        </div>
    );
};

export default Projects;
