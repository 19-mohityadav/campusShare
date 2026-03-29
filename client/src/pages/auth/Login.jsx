import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login, sendOTP, verifyOTP } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    
    // OTP Mode States
    const [isOtpMode, setIsOtpMode] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await login({ email, password });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred during login');
            setLoading(false);
        }
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!email) {
            setError('Please enter your email or phone number');
            return;
        }
        setError(null);
        setLoading(true);
        try {
            await sendOTP(email);
            setOtpSent(true);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP');
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await verifyOTP(email, otp);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired OTP');
            setLoading(false);
        }
    };


    return (
        <div className="bg-mesh min-h-screen flex items-center justify-center p-6 text-on-surface overflow-hidden relative">
            {/* Floating Background Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="floating-icon absolute top-[15%] left-[10%] opacity-20 text-primary" style={{ animationDelay: '0s' }}>
                    <span className="material-symbols-outlined text-6xl">menu_book</span>
                </div>
                <div className="floating-icon absolute top-[60%] left-[5%] opacity-10 text-secondary" style={{ animationDelay: '1s' }}>
                    <span className="material-symbols-outlined text-8xl">calculate</span>
                </div>
                <div className="floating-icon absolute top-[20%] right-[12%] opacity-15 text-tertiary" style={{ animationDelay: '2s' }}>
                    <span className="material-symbols-outlined text-7xl">construction</span>
                </div>
                <div className="floating-icon absolute bottom-[15%] right-[8%] opacity-20 text-primary" style={{ animationDelay: '1.5s' }}>
                    <span className="material-symbols-outlined text-6xl">laptop_mac</span>
                </div>
            </div>

            {/* Main Container */}
            <div className="w-full max-w-md z-10">
                {/* Logo Branding */}
                <div className="flex flex-col items-center mb-10">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-primary text-4xl">hub</span>
                        <span className="text-3xl font-headline font-bold tracking-tighter text-primary">CampusShare</span>
                    </div>
                    <div className="h-px w-12 bg-primary/30 rounded-full"></div>
                </div>

                {/* Glass Card */}
                <div className="glass-panel rounded-2xl p-8 md:p-10 shadow-2xl relative">
                    {/* Subtle accent glow */}
                    <div className="absolute -top-12 -left-12 w-24 h-24 bg-primary/20 blur-3xl rounded-full"></div>

                    {/* Welcome Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-headline font-bold tracking-tight text-on-surface mb-2">Welcome Back 👋</h1>
                        <p className="text-on-surface-variant font-body text-sm leading-relaxed">Login to continue sharing resources within your community.</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-6 text-sm flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">error</span>
                            {error}
                        </div>
                    )}

                    {/* Forms */}
                    {!isOtpMode ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-xs font-label uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="email">Email</label>
                                <div className="relative group">
                                    <input
                                        className="w-full bg-surface-container-highest/50 border-none rounded-xl py-3.5 px-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/40 focus:bg-surface-bright/80 transition-all outline-none"
                                        id="email"
                                        name="email"
                                        placeholder="example@college.edu"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
    
                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="block text-xs font-label uppercase tracking-widest text-on-surface-variant" htmlFor="password">Password</label>
                                    <a className="text-xs font-medium text-secondary hover:text-secondary-dim transition-colors" href="#">Forgot Password?</a>
                                </div>
                                <div className="relative group">
                                    <input
                                        className="w-full bg-surface-container-highest/50 border-none rounded-xl py-3.5 px-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/40 focus:bg-surface-bright/80 transition-all outline-none"
                                        id="password"
                                        name="password"
                                        placeholder="••••••••"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
    
                            <button
                                className="w-full bg-gradient-to-r from-primary to-secondary text-on-primary-container font-headline font-bold py-4 rounded-xl shadow-[0px_20px_40px_rgba(190,131,250,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:pointer-events-none"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-6">
                            {!otpSent ? (
                                <div className="space-y-2">
                                    <label className="block text-xs font-label uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="identifier">Email / Phone</label>
                                    <div className="relative group">
                                        <input
                                            className="w-full bg-surface-container-highest/50 border-none rounded-xl py-3.5 px-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/40 focus:bg-surface-bright/80 transition-all outline-none"
                                            id="identifier"
                                            name="identifier"
                                            placeholder="johndoe@example.com or +1234567890"
                                            type="text"
                                            value={email} // Using email state for identifier to keep it simple
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <label className="block text-xs font-label uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="otp">Enter 6-digit OTP</label>
                                    <div className="relative group">
                                        <input
                                            className="w-full bg-surface-container-highest/50 border-none rounded-xl py-3.5 px-4 text-on-surface text-center tracking-widest font-mono text-xl focus:ring-2 focus:ring-primary/40 focus:bg-surface-bright/80 transition-all outline-none"
                                            id="otp"
                                            name="otp"
                                            placeholder="------"
                                            maxLength={6}
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <p className="text-xs text-on-surface-variant text-center mt-2">OTP sent to {email}</p>
                                </div>
                            )}
    
                            <button
                                className="w-full bg-gradient-to-r from-secondary to-tertiary text-on-primary-container font-headline font-bold py-4 rounded-xl shadow-[0px_20px_40px_rgba(255,160,180,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:pointer-events-none"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : (otpSent ? 'Verify OTP & Login' : 'Send OTP')}
                            </button>
                        </form>
                    )}

                    {/* Divider */}
                    <div className="relative my-8">
                        <div aria-hidden="true" className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-outline-variant/20"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-widest font-label">
                            <span className="bg-transparent px-4 text-on-surface-variant/60 backdrop-blur-md">or continue with</span>
                        </div>
                    </div>

                    {/* Alternative Logins */}
                    <div className="w-full">
                        <button type="button" onClick={() => {
                            setError(null);
                            if (isOtpMode) {
                                setIsOtpMode(false);
                                setOtpSent(false);
                            } else {
                                setIsOtpMode(true);
                            }
                        }} className="w-full flex items-center justify-center gap-2 bg-surface-container-high/40 border border-outline-variant/10 rounded-xl py-3 px-4 hover:bg-surface-container-highest transition-all group">
                            <span className="material-symbols-outlined text-secondary text-xl">{isOtpMode ? 'password' : 'vibration'}</span>
                            <span className="text-sm font-medium text-on-surface">{isOtpMode ? 'Use Password' : 'OTP Login'}</span>
                        </button>
                    </div>

                    {/* Footer Link */}
                    <div className="mt-10 text-center">
                        <p className="text-sm text-on-surface-variant">
                            Don't have an account?{' '}
                            <Link className="text-primary font-bold ml-1 hover:underline underline-offset-4 transition-all inline-flex items-center gap-1 group" to="/signup">
                                Sign Up <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                        </p>
                    </div>
                </div>

                {/* System Footer */}
                <footer className="mt-8 text-center opacity-40 hover:opacity-100 transition-opacity duration-500">
                    <p className="font-label text-[10px] uppercase tracking-[0.3em] text-on-surface-variant">
                        © 2024 CampusShare • THE ETHEREAL ARCHIVE
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default Login;
