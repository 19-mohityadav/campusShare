import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const Signup = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const toast = useToast();
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', terms: false });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirm) {
            setError('Passwords do not match');
            return;
        }
        if (!form.terms) {
            setError('Please agree to the terms');
            return;
        }
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setError(null);
        setLoading(true);

        try {
            await register({
                name: form.name,
                email: form.email,
                password: form.password
            });
            toast.success('Account created! Welcome to CampusShare 🎉');
            navigate('/onboarding');
        } catch (err) {
            const msg = err.response?.data?.message || 'Registration failed. Please try again.';
            setError(msg);
            toast.error(msg);
            setLoading(false);
        }
    };

    return (
        <div className="bg-ethereal min-h-screen text-on-surface font-body overflow-x-hidden selection:bg-primary/30 relative">
            {/* Floating Background Decorative Icons */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-20 left-[10%] opacity-20 floating-icon">
                    <span className="material-symbols-outlined text-6xl text-primary">menu_book</span>
                </div>
                <div className="absolute bottom-40 right-[15%] opacity-15 floating-icon">
                    <span className="material-symbols-outlined text-8xl text-secondary">calculate</span>
                </div>
                <div className="absolute top-[40%] right-[5%] opacity-10 floating-icon">
                    <span className="material-symbols-outlined text-5xl text-tertiary">handyman</span>
                </div>
                <div className="absolute bottom-10 left-[20%] opacity-10 floating-icon">
                    <span className="material-symbols-outlined text-7xl text-primary">laptop_chromebook</span>
                </div>
            </div>

            <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
                {/* Branding */}
                <div className="mb-10 text-center">
                    <h1 className="font-headline text-3xl font-bold bg-gradient-to-r from-primary-fixed to-secondary-dim bg-clip-text text-transparent tracking-tight">
                        CampusShare
                    </h1>
                </div>

                {/* Signup Card */}
                <div className="w-full max-w-lg glass-panel rounded-[2rem] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-outline-variant/15">
                    <header className="mb-8 text-center md:text-left">
                        <h2 className="font-headline text-4xl font-bold text-on-surface mb-2 tracking-tight">
                            Create Account 🚀
                        </h2>
                        <p className="text-on-surface-variant font-medium">Join your campus network</p>
                    </header>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-6 text-sm flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">error</span>
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Name Field */}
                        <div className="space-y-2">
                            <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-on-surface-variant ml-1">Full Name</label>
                            <input
                                className="w-full bg-surface-container-highest/40 border-none rounded-xl px-4 py-4 text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary/40 transition-all duration-300 outline-none"
                                placeholder="John Doe"
                                type="text"
                                required
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-on-surface-variant ml-1">College Email</label>
                            <input
                                className="w-full bg-surface-container-highest/40 border-none rounded-xl px-4 py-4 text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary/40 transition-all duration-300 outline-none"
                                placeholder="example@college.edu"
                                type="email"
                                required
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />
                        </div>

                        {/* Password Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-on-surface-variant ml-1">Password</label>
                                <input
                                    className="w-full bg-surface-container-highest/40 border-none rounded-xl px-4 py-4 text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary/40 transition-all duration-300 outline-none"
                                    placeholder="••••••••"
                                    type="password"
                                    required
                                    minLength={6}
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-on-surface-variant ml-1">Confirm</label>
                                <input
                                    className="w-full bg-surface-container-highest/40 border-none rounded-xl px-4 py-4 text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary/40 transition-all duration-300 outline-none"
                                    placeholder="••••••••"
                                    type="password"
                                    required
                                    value={form.confirm}
                                    onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="flex items-center space-x-3 ml-1">
                            <div className="relative flex items-center justify-center">
                                <input
                                    className="peer appearance-none w-5 h-5 rounded-md border-2 border-outline-variant bg-transparent checked:bg-primary checked:border-primary transition-all duration-200"
                                    id="terms"
                                    type="checkbox"
                                    checked={form.terms}
                                    onChange={(e) => setForm({ ...form, terms: e.target.checked })}
                                />
                                <span className="material-symbols-outlined absolute text-[14px] text-on-primary opacity-0 peer-checked:opacity-100 pointer-events-none">check</span>
                            </div>
                            <label className="text-sm text-on-surface-variant" htmlFor="terms">
                                I agree to <a className="text-primary hover:underline transition-all" href="#">Terms & Privacy</a>
                            </label>
                        </div>

                        {/* CTA Button */}
                        <button
                            className="w-full py-4 px-6 bg-gradient-to-r from-primary to-secondary text-on-primary-fixed font-bold rounded-full text-lg shadow-[0_10px_30px_-5px_rgba(159,167,255,0.4)] hover:shadow-[0_15px_40px_-5px_rgba(159,167,255,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:pointer-events-none"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                    </svg>
                                    Creating Account...
                                </span>
                            ) : 'Create Account'}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-10 text-center">
                        <Link className="text-on-surface-variant hover:text-primary transition-colors text-sm font-medium flex items-center justify-center group" to="/login">
                            Already have an account? <span className="ml-1 text-primary group-hover:translate-x-1 transition-transform">Login →</span>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Signup;
