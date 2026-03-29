import React from 'react';

const Loader = ({ fullScreen = false, text = 'Loading...' }) => {
    const content = (
        <div className="flex flex-col items-center justify-center gap-4 p-8">
            <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-primary/20 animate-spin border-t-primary"></div>
            </div>
            {text && (
                <p className="text-on-surface-variant text-sm font-label uppercase tracking-widest animate-pulse">
                    {text}
                </p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background pointer-events-none z-[100] fixed inset-0">
                {content}
            </div>
        );
    }

    return content;
};

export default Loader;
