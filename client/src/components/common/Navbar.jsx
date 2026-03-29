import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <header className="fixed top-0 w-full z-50 bg-surface/60 backdrop-blur-xl">
            <nav className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-headline font-bold tracking-tighter text-primary">CampusShare</span>
                </div>
                <div className="hidden md:flex items-center gap-8">
                    <a className="text-primary font-bold border-b-2 border-primary pb-1 font-body text-sm" href="#features">Features</a>
                    <a className="text-on-surface-variant/80 hover:text-primary transition-colors font-body text-sm" href="#">How it Works</a>
                    <a className="text-on-surface-variant/80 hover:text-primary transition-colors font-body text-sm" href="#">Community</a>
                </div>
                <div className="flex items-center gap-6">
                    <Link to="/login" className="text-on-surface-variant/80 hover:text-primary transition-colors font-body font-medium text-sm">Login</Link>
                    <Link to="/signup" className="bg-gradient-to-r from-primary to-secondary text-on-primary font-bold px-6 py-2 rounded-full hover:scale-105 transition-all duration-300 text-sm glow-button">Signup</Link>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
