import axios from 'axios';

// LOGIKA OTOMATIS:
// 1. Jika sedang coding di Laptop (Development), pakai '/api' agar masuk ke Proxy Vite.
// 2. Jika sudah di-upload ke InfinityFree (Production), pakai URL asli.
const API_URL = import.meta.env.DEV 
    ? '/api' 
    : 'https://iname.page.gd/api'; 

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    // Tambahkan ini agar cookie/session aman (opsional tapi bagus)
    withCredentials: false 
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