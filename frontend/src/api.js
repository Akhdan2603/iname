import axios from 'axios';

// Ganti URL ini sesuai dengan URL backend Anda saat deploy
// Untuk development lokal, biasanya http://localhost:8000
const API_URL = 'http://localhost:8000';

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
