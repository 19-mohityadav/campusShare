import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Onboarding = () => {
    const navigate = useNavigate();
    const [selected, setSelected] = useState(['Calculators', 'Electronics']);

    const categories = [
        { icon: 'menu_book', label: 'Books', color: 'text-primary' },
        { icon: 'calculate', label: 'Calculators', color: 'text-primary' },
        { icon: 'science', label: 'Lab Tools', color: 'text-tertiary' },
        { icon: 'laptop_mac', label: 'Electronics', color: 'text-primary' },
        { icon: 'smartphone', label: 'Gadgets', color: 'text-secondary' },
        { icon: 'chair', label: 'Essentials', color: 'text-on-surface-variant' },
    ];

    const toggle = (label) => {
        setSelected(prev =>
            prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
        );
    };

    return (
        <div className="min-h-screen text-on-surface flex items-center justify-center p-6 relative overflow-hidden bg-[#060e20]">
            {/* Background Decor */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]"></div>
                <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-secondary/20 rounded-full blur-[120px]"></div>
                <div className="absolute top-20 left-20 opacity-20 animate-bounce">
                    <span className="material-symbols-outlined text-6xl text-primary">auto_stories</span>
                </div>
                <div className="absolute bottom-40 left-10 opacity-10 rotate-12">
                    <span className="material-symbols-outlined text-8xl text-secondary">architecture</span>
                </div>
                <div className="absolute top-1/4 right-10 opacity-15 -rotate-12">
                    <span className="material-symbols-outlined text-7xl text-tertiary">devices</span>
                </div>
                <div className="absolute bottom-20 right-1/4 opacity-10">
                    <span className="material-symbols-outlined text-9xl text-primary">biotech</span>
                </div>
            </div>

            {/* Main Onboarding Card */}
            <main className="z-10 w-full max-w-2xl glass-card rounded-2xl border border-white/5 p-8 md:p-12 shadow-2xl relative overflow-hidden">
                {/* Header */}
                <div className="flex flex-col items-center text-center mb-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-on-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
                    </div>
                    <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-on-surface mb-3">
                        What are you looking for? 🎯
                    </h1>
                    <p className="font-body text-on-surface-variant text-lg max-w-md">
                        Select your interests to personalize your CampusShare experience and find exactly what you need.
                    </p>
                </div>

                {/* Category Grid */}
                <section className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    {categories.map(({ icon, label, color }) => {
                        const isActive = selected.includes(label);
                        return (
                            <button
                                key={label}
                                onClick={() => toggle(label)}
                                className={`flex flex-col items-center justify-center p-6 rounded-xl relative transition-all duration-300 ${
                                    isActive
                                        ? 'category-card-active'
                                        : 'border border-white/5 bg-surface-container/50 hover:bg-surface-variant'
                                }`}
                            >
                                {isActive && (
                                    <div className="absolute top-2 right-2">
                                        <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                    </div>
                                )}
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${isActive ? 'bg-primary/20' : 'bg-surface-container-highest'} transition-transform group-hover:scale-110`}>
                                    <span className={`material-symbols-outlined text-2xl ${isActive ? 'text-primary' : color}`}>{icon}</span>
                                </div>
                                <span className={`font-label text-sm uppercase tracking-wide ${isActive ? 'text-primary font-bold' : 'font-medium'}`}>{label}</span>
                            </button>
                        );
                    })}
                </section>

                {/* Selection Status */}
                <div className="flex items-center justify-center gap-2 mb-10">
                    <div className="h-[1px] flex-1 bg-white/5"></div>
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-surface-container-highest/50 rounded-full border border-white/10">
                        <span className="w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_#9fa7ff]"></span>
                        <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
                            Selected: <span className="text-primary font-bold">{selected.length} categories</span>
                        </p>
                    </div>
                    <div className="h-[1px] flex-1 bg-white/5"></div>
                </div>

                {/* CTA */}
                <div className="flex flex-col items-center gap-6">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full py-4 px-8 bg-gradient-to-r from-primary to-secondary text-on-primary font-headline font-bold text-lg rounded-full shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        Continue
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="font-body text-on-surface-variant hover:text-on-surface transition-colors text-sm font-medium"
                    >
                        Skip for now
                    </button>
                </div>
            </main>

            {/* Progress Indicator */}
            <div className="fixed bottom-10 flex gap-2 z-10">
                <div className="w-8 h-1 bg-primary rounded-full"></div>
                <div className="w-2 h-1 bg-white/20 rounded-full"></div>
                <div className="w-2 h-1 bg-white/20 rounded-full"></div>
            </div>
        </div>
    );
};

export default Onboarding;
