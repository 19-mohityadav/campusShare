import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

const ICONS = {
    success: 'check_circle',
    error: 'error',
    warning: 'warning',
    info: 'info'
};

const COLORS = {
    success: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    error: 'text-red-400 bg-red-400/10 border-red-400/20',
    warning: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    info: 'text-blue-400 bg-blue-400/10 border-blue-400/20'
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 3500) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const toast = {
        success: (msg) => addToast(msg, 'success'),
        error: (msg) => addToast(msg, 'error'),
        warning: (msg) => addToast(msg, 'warning'),
        info: (msg) => addToast(msg, 'info'),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            {/* Toast Container */}
            <div
                aria-live="polite"
                className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none max-w-sm w-full"
            >
                {toasts.map(({ id, message, type }) => (
                    <div
                        key={id}
                        className={`flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl pointer-events-auto animate-slide-in ${COLORS[type]}`}
                        style={{ animation: 'slideIn 0.3s ease-out' }}
                    >
                        <span className="material-symbols-outlined text-xl flex-shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                            {ICONS[type]}
                        </span>
                        <p className="text-sm font-medium flex-1 leading-relaxed">{message}</p>
                        <button
                            onClick={() => removeToast(id)}
                            className="opacity-60 hover:opacity-100 transition-opacity flex-shrink-0"
                        >
                            <span className="material-symbols-outlined text-base">close</span>
                        </button>
                    </div>
                ))}
            </div>
            <style>{`
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(100%); }
                    to { opacity: 1; transform: translateX(0); }
                }
            `}</style>
        </ToastContext.Provider>
    );
};

export default ToastContext;
