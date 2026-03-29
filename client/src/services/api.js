import axios from 'axios';

// Base URL — VITE_API_URL should be http://localhost:5000 (no /api suffix in .env)
const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

// Request interceptor — attach JWT
api.interceptors.request.use(
    (config) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user && user.token) {
                config.headers.Authorization = `Bearer ${user.token}`;
            }
        } catch (_) { /* ignore parse errors */ }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor — handle 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('user');
            // Dispatch a custom event so AuthContext can react
            window.dispatchEvent(new Event('auth:logout'));
        }
        return Promise.reject(error);
    }
);

/**
 * Helper: calls an API fn, returns result or fallback on any error.
 * Usage: withFallback(() => api.get('/items'), MOCK_ITEMS)
 */
export async function withFallback(apiFn, fallback) {
    try {
        const res = await apiFn();
        return res.data;
    } catch (err) {
        console.warn('[CampusShare] API call failed, using fallback data.', err?.message);
        return fallback;
    }
}

export default api;
