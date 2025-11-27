import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="home-page">
            <section className="hero">
                <h1>Solusi Konsultasi Profesional</h1>
                <p>Kami membantu instansi pemerintah dan swasta dalam merencanakan masa depan yang lebih baik.</p>
                <div style={{display: 'flex', gap: '1rem', justifyContent: 'center'}}>
                    <Link to="/projects" className="btn">Lihat Proyek</Link>
                    <Link to="/about" className="btn btn-secondary">Tentang Kami</Link>
                </div>
            </section>

            <section style={{marginTop: '4rem', textAlign: 'center'}}>
                <h2 style={{color: 'var(--primary-color)', marginBottom: '1rem'}}>Mengapa Memilih Kami?</h2>
                <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem'}}>
                    <div style={{maxWidth: '300px', padding: '1rem'}}>
                        <h3>Berpengalaman</h3>
                        <p>Lebih dari 10 tahun menangani proyek strategis nasional.</p>
                    </div>
                    <div style={{maxWidth: '300px', padding: '1rem'}}>
                        <h3>Tim Ahli</h3>
                        <p>Didukung oleh tenaga ahli bersertifikasi di berbagai bidang.</p>
                    </div>
                    <div style={{maxWidth: '300px', padding: '1rem'}}>
                        <h3>Terpercaya</h3>
                        <p>Mitra resmi berbagai dinas dan kementerian.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
