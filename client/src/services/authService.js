import api from './api';
import { MOCK_USER } from './mockData';

// ─── Helper ────────────────────────────────────────────────────────────────
const persist = (data) => {
    if (data && data.token) {
        localStorage.setItem('user', JSON.stringify(data));
    }
    return data;
};

// ─── Console OTP store (hackathon fallback) ─────────────────────────────────
const _otpStore = {};

const authService = {
    // ── Register ──────────────────────────────────────────────────────────────
    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            return persist(response.data);
        } catch (err) {
            // If network is completely down, surface a useful error
            if (!err.response) throw new Error('Network error — server may be offline');
            throw err;
        }
    },

    // ── Login (email + password) ──────────────────────────────────────────────
    login: async (userData) => {
        try {
            const response = await api.post('/auth/login', userData);
            return persist(response.data);
        } catch (err) {
            if (!err.response) {
                // Network failure — use demo mock login for hackathon
                console.warn('[CampusShare] Auth server offline — using mock login');
                const mockUser = { ...MOCK_USER, email: userData.email };
                return persist(mockUser);
            }
            throw err;
        }
    },

    // ── Send OTP ──────────────────────────────────────────────────────────────

    sendOTP: async (identifier) => {
        try {
            const response = await api.post('/auth/send-otp', { identifier });
            if (response.data?.mockOtp) {
                console.log(`%c[CampusShare Server Mock OTP] ${identifier} -> ${response.data.mockOtp}`, 'background:#192540;color:#9fa7ff;padding:4px 8px;border-radius:4px;font-size:14px;font-weight:bold;');
            }
            return response.data;
        } catch (err) {
            if (!err.response) {
                // Hackathon fallback: generate mock OTP in-browser
                const otp = String(Math.floor(100000 + Math.random() * 900000));
                _otpStore[identifier] = otp;
                console.log(`%c[CampusShare Mock OTP] ${identifier} → ${otp}`, 'background:#192540;color:#9fa7ff;padding:4px 8px;border-radius:4px;font-size:14px;font-weight:bold;');
                return { message: `OTP sent (check console): ${otp}`, mockOtp: otp };
            }
            throw err;
        }
    },

    // ── Verify OTP ────────────────────────────────────────────────────────────
    verifyOTP: async (identifier, otp) => {
        try {
            const response = await api.post('/auth/verify-otp', { identifier, otp });
            return persist(response.data);
        } catch (err) {
            if (!err.response) {
                // Validate against in-memory OTP store
                if (_otpStore[identifier] && _otpStore[identifier] === otp) {
                    delete _otpStore[identifier];
                    const mockUser = { ...MOCK_USER, email: identifier };
                    return persist(mockUser);
                }
                throw new Error('Invalid OTP — check browser console for the mock OTP');
            }
            throw err;
        }
    },

    // ── Profile ───────────────────────────────────────────────────────────────
    getProfile: async () => {
        try {
            const response = await api.get('/users/profile');
            return response.data;
        } catch (_) {
            return MOCK_USER;
        }
    },

    updateProfile: async (userData) => {
        try {
            const response = await api.put('/users/profile', userData);
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const updatedUser = { ...currentUser, ...response.data };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return response.data;
        } catch (_) {
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const updated = { ...currentUser, ...userData };
            localStorage.setItem('user', JSON.stringify(updated));
            return updated;
        }
    },

    // ── Logout ────────────────────────────────────────────────────────────────
    logout: () => {
        localStorage.removeItem('user');
    },

    // ── Get current user from localStorage ────────────────────────────────────
    getCurrentUser: () => {
        try {
            return JSON.parse(localStorage.getItem('user'));
        } catch (_) {
            return null;
        }
    },
};

export default authService;
