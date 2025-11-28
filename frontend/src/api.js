import axios from 'axios';

// Logic Penentuan URL API:
// 1. Jika ada VITE_API_URL di .env, gunakan itu.
// 2. Jika mode DEVELOPMENT (npm run dev), gunakan localhost:8000.
// 3. Jika mode PRODUCTION (build), gunakan '/api' (relative path di domain yang sama).
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'development' ? 'http://localhost:8000' : '/api');

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor untuk menambahkan token ke setiap request jika ada
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const getBaseUrl = () => API_URL;

export default api;
