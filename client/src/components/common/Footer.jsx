import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-[#091328] w-full py-12 px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 w-full max-w-7xl mx-auto">
                <div className="flex flex-col gap-2 items-center md:items-start">
                    <span className="font-headline font-bold text-primary text-xl">CampusShare</span>
                    <p className="font-body text-sm tracking-wide text-on-surface-variant/60">© 2024 CampusShare. The Ethereal Archive.</p>
                </div>
                <div className="flex gap-8">
                    <a className="font-body text-sm tracking-wide text-on-surface-variant/60 hover:text-secondary transition-colors" href="#">Privacy Policy</a>
                    <a className="font-body text-sm tracking-wide text-on-surface-variant/60 hover:text-secondary transition-colors" href="#">Terms of Service</a>
                    <a className="font-body text-sm tracking-wide text-on-surface-variant/60 hover:text-secondary transition-colors" href="#">Contact Support</a>
                </div>
                <div className="flex gap-4">
                    <span className="material-symbols-outlined text-on-surface-variant/60 hover:text-primary transition-colors cursor-pointer">language</span>
                    <span className="material-symbols-outlined text-on-surface-variant/60 hover:text-primary transition-colors cursor-pointer">hub</span>
                    <span className="material-symbols-outlined text-on-surface-variant/60 hover:text-primary transition-colors cursor-pointer">help_center</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
