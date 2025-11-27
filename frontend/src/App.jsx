import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminAddProject from './pages/AdminAddProject';
import AdminEditProject from './pages/AdminEditProject';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Komponen untuk memproteksi halaman admin
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }
    return children;
};

function App() {
  // Cek apakah sedang di halaman admin untuk layout berbeda jika diinginkan
  // Namun untuk simplisitas, kita gunakan layout global (Navbar/Footer)
  // dan mungkin menyembunyikannya di halaman login jika perlu.

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/projects/add"
                    element={
                        <ProtectedRoute>
                            <AdminAddProject />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/projects/edit/:id"
                    element={
                        <ProtectedRoute>
                            <AdminEditProject />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
