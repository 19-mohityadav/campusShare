import React from 'react'

const Footer = () => {
    return (
        <footer className="w-full bg-zinc-950 border-t border-zinc-900 px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col gap-2">
                <span className="text-xl font-bold font-mono tracking-tighter text-indigo-400">CS_</span>
                <p className="text-zinc-500 text-sm max-w-md">The modern campus sharing platform for sustainable academic local community resources.</p>
            </div>
            
            <div className="flex gap-12">
                <div className="flex flex-col gap-4 text-sm">
                    <h4 className="font-bold text-zinc-300">Community</h4>
                    <span className="text-zinc-500 hover:text-zinc-200 cursor-pointer transition-colors">Safety Guides</span>
                    <span className="text-zinc-500 hover:text-zinc-200 cursor-pointer transition-colors">Terms of Service</span>
                </div>
                <div className="flex flex-col gap-4 text-sm">
                    <h4 className="font-bold text-zinc-300">Resources</h4>
                    <span className="text-zinc-500 hover:text-zinc-200 cursor-pointer transition-colors">Bug Reports</span>
                    <span className="text-zinc-500 hover:text-zinc-200 cursor-pointer transition-colors">Help Center</span>
                </div>
            </div>
            
            <div className="text-sm text-zinc-500 font-medium">
                © 2026 CampusShare. Powered by modern web tech.
            </div>
        </footer>
    )
}

export default Footer
