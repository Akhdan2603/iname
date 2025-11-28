import React from 'react';

const About = () => {
    return (
        <div className="about-page" style={{background: 'white', padding: '2rem', borderRadius: '8px'}}>
            <h1 style={{color: 'var(--primary-color)', marginBottom: '1.5rem'}}>Tentang Kami</h1>
            <p style={{marginBottom: '1rem'}}>
                KonsultanKita adalah perusahaan konsultan yang bergerak di bidang perencanaan dan pengawasan pembangunan.
                Kami berdedikasi untuk memberikan solusi terbaik bagi setiap kebutuhan klien kami, mulai dari perencanaan
                infrastruktur hingga manajemen proyek yang kompleks.
            </p>
            <p style={{marginBottom: '1rem'}}>
                Dengan dukungan tim yang solid dan berpengalaman, kami telah dipercaya oleh berbagai instansi seperti
                Dinas Perhubungan dan Dinas Kelautan untuk menangani berbagai proyek krusial.
            </p>
            <h3 style={{marginTop: '2rem', marginBottom: '1rem', color: 'var(--primary-color)'}}>Visi</h3>
            <p>Menjadi konsultan terdepan yang memberikan dampak positif bagi pembangunan bangsa.</p>

            <h3 style={{marginTop: '2rem', marginBottom: '1rem', color: 'var(--primary-color)'}}>Misi</h3>
            <ul style={{listStyle: 'disc', paddingLeft: '2rem'}}>
                <li>Memberikan layanan konsultasi berkualitas tinggi.</li>
                <li>Menjaga integritas dan profesionalisme dalam setiap pekerjaan.</li>
                <li>Berinovasi dalam memberikan solusi teknis.</li>
            </ul>
        </div>
    );
};

export default About;
