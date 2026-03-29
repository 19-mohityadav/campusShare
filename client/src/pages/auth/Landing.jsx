import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <main className="relative pt-20">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-primary/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-secondary/10 rounded-full blur-[150px]"></div>
                {/* Floating Icons Simulation */}
                <div className="absolute top-1/4 left-1/4 opacity-20 transform -rotate-12">
                    <span className="material-symbols-outlined text-6xl text-primary">menu_book</span>
                </div>
                <div className="absolute bottom-1/3 right-1/4 opacity-20 transform rotate-12">
                    <span className="material-symbols-outlined text-7xl text-secondary">calculate</span>
                </div>
                <div className="absolute top-1/2 right-10 opacity-10 transform -rotate-45">
                    <span className="material-symbols-outlined text-8xl text-tertiary">construction</span>
                </div>
            </div>

            {/* Hero Section */}
            <section className="relative z-10 max-w-7xl mx-auto px-8 py-16 md:py-32 flex flex-col items-center">
                <div className="glass-card p-8 md:p-16 rounded-2xl w-full max-w-4xl border border-outline-variant/15 flex flex-col items-center text-center">
                    <div className="mb-8 w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-2xl rotate-3">
                        <span className="material-symbols-outlined text-4xl text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>share</span>
                    </div>
                    <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight text-on-surface mb-6">
                        Share & Borrow <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-tertiary">Easily Within Your Campus</span>
                    </h1>
                    <p className="font-body text-lg md:text-xl text-on-surface-variant max-w-2xl mb-12">
                        Find books, tools & more from trusted students. Join the community and start lending or borrowing today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 items-center">
                        <Link to="/signup" className="bg-gradient-to-r from-primary to-secondary text-on-primary font-bold px-10 py-4 rounded-full text-lg hover:scale-105 transition-all duration-300 glow-button active:scale-95">
                            Get Started
                        </Link>
                        <div className="flex gap-4">
                            <Link to="/login" className="text-on-surface-variant hover:text-primary transition-colors font-medium">Login</Link>
                            <span className="text-outline">/</span>
                            <Link to="/signup" className="text-on-surface-variant hover:text-secondary transition-colors font-medium">Signup</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative z-10 max-w-7xl mx-auto px-8 py-24">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-xl">
                        <span className="font-label tracking-widest text-secondary font-bold uppercase text-xs">Features</span>
                        <h2 className="font-headline text-4xl font-bold text-on-surface mt-2">Everything You Need for Campus Life</h2>
                    </div>
                    <div className="h-px flex-1 bg-outline-variant/20 mx-8 hidden md:block"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Card 1 */}
                    <div className="glass-card p-8 rounded-2xl border border-outline-variant/10 hover:border-primary/30 transition-all duration-500 group">
                        <div className="w-14 h-14 bg-surface-container-highest rounded-xl flex items-center justify-center mb-8 group-hover:bg-primary/20 transition-colors">
                            <span className="material-symbols-outlined text-primary text-3xl">shopping_cart_checkout</span>
                        </div>
                        <h3 className="font-headline text-2xl font-bold text-on-surface mb-4">Borrow Easily</h3>
                        <p className="font-body text-on-surface-variant leading-relaxed">
                            Need a specific textbook or a power drill for a project? Browse your campus inventory and request it in seconds.
                        </p>
                        <Link to="/signup" className="mt-8 flex items-center text-primary font-medium text-sm cursor-pointer group-hover:gap-2 transition-all w-fit">
                            Learn more <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
                        </Link>
                    </div>

                    {/* Card 2 */}
                    <div className="glass-card p-8 rounded-2xl border border-outline-variant/10 hover:border-secondary/30 transition-all duration-500 group">
                        <div className="w-14 h-14 bg-surface-container-highest rounded-xl flex items-center justify-center mb-8 group-hover:bg-secondary/20 transition-colors">
                            <span className="material-symbols-outlined text-secondary text-3xl">volunteer_activism</span>
                        </div>
                        <h3 className="font-headline text-2xl font-bold text-on-surface mb-4">Lend Instantly</h3>
                        <p className="font-body text-on-surface-variant leading-relaxed">
                            Have gear sitting around? Help out your fellow students and earn campus credits by listing your items for borrow.
                        </p>
                        <Link to="/login" className="mt-8 flex items-center text-secondary font-medium text-sm cursor-pointer group-hover:gap-2 transition-all w-fit">
                            List an item <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
                        </Link>
                    </div>

                    {/* Card 3 */}
                    <div className="glass-card p-8 rounded-2xl border border-outline-variant/10 hover:border-tertiary/30 transition-all duration-500 group">
                        <div className="w-14 h-14 bg-surface-container-highest rounded-xl flex items-center justify-center mb-8 group-hover:bg-tertiary/20 transition-colors">
                            <span className="material-symbols-outlined text-tertiary text-3xl">verified_user</span>
                        </div>
                        <h3 className="font-headline text-2xl font-bold text-on-surface mb-4">Trusted Community</h3>
                        <p className="font-body text-on-surface-variant leading-relaxed">
                            Safety first. All users are verified students. Read reviews and see ratings before you commit to any exchange.
                        </p>
                        <div className="mt-8 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-tertiary animate-pulse shadow-[0_0_8px_rgba(125,233,255,0.8)]"></div>
                            <span className="text-tertiary font-label text-xs uppercase tracking-wider font-bold">100% Student Verified</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Visual Anchor Section (Asymmetric Bento) */}
            <section className="max-w-7xl mx-auto px-8 py-24">
                <div className="grid grid-cols-12 gap-6 h-[600px]">
                    <div className="col-span-12 md:col-span-8 relative overflow-hidden rounded-2xl">
                        <img className="absolute inset-0 w-full h-full object-cover" alt="A group of diverse university students collaborating in a modern library with books and digital tablets under warm lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxx7XWdW3rBBLVIOawOd0FoQn2mf4fB_f0_EgC4WYQuJtPHzt12NNNbv6-j3p6WcYxtcliyQQcuBpd0qcUFo4vmqfqJpjAEhfACOuMkBIZoVql-oi9NagpOIqnBu6MFgKBx63Z0DEHqpQQaoSw5YGDH2mUOiINJ-vw8oB36PS_LELTCcRe6yhAsLd_Ttsg0W2LdxTUoz2A9nlT62mX7uO205pc7bWsXW42NpzlUnzVZspduOMWZlnP4EH8gZAyBTfoZDvx49PKe2I"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
                        <div className="absolute bottom-8 left-8 max-w-md">
                            <h4 className="font-headline text-3xl font-bold text-on-surface">Built for the modern student.</h4>
                        </div>
                    </div>
                    <div className="col-span-12 md:col-span-4 bg-surface-container rounded-2xl flex flex-col justify-center p-8 border border-outline-variant/5">
                        <div className="mb-6">
                            <span className="text-6xl font-headline font-bold text-primary">5k+</span>
                            <p className="text-on-surface-variant mt-2">Active items shared this month across campuses nationwide.</p>
                        </div>
                        <div className="h-px bg-outline-variant/20 mb-6"></div>
                        <div>
                            <span className="text-6xl font-headline font-bold text-secondary">98%</span>
                            <p className="text-on-surface-variant mt-2">User satisfaction rating for item condition and safety.</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Landing;
