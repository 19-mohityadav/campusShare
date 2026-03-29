import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import requestService from '../../services/requestService';
import authService from '../../services/authService';

const STATUS_CONFIG = {
    pending: { color: 'text-amber-400 bg-amber-400/10 border-amber-400/20', icon: 'schedule', label: 'Pending' },
    accepted: { color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', icon: 'check_circle', label: 'Accepted' },
    rejected: { color: 'text-red-400 bg-red-400/10 border-red-400/20', icon: 'cancel', label: 'Rejected' },
    completed: { color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', icon: 'task_alt', label: 'Completed' },
    cancelled: { color: 'text-gray-400 bg-gray-400/10 border-gray-400/20', icon: 'remove_circle', label: 'Cancelled' },
};

const RequestCard = ({ req, currentUserId, onStatusUpdate }) => {
    const navigate = useNavigate();
    const toast = useToast();
    const [updating, setUpdating] = useState(false);

    const isBorrower = req.borrower?._id === currentUserId || req.borrower?._id === 'current-user';
    const isLender = req.lender?._id === currentUserId || req.lender?._id === 'current-user';
    const config = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending;

    const handleUpdate = async (status) => {
        setUpdating(true);
        try {
            await requestService.updateStatus(req._id, status);
            toast.success(`Request ${status}!`);
            onStatusUpdate(req._id, status);
        } catch (err) {
            if (req._id.startsWith('mock-')) {
                toast.success(`Request ${status}! (Demo mode)`);
                onStatusUpdate(req._id, status);
            } else {
                toast.error(err.response?.data?.message || 'Update failed');
            }
        } finally {
            setUpdating(false);
        }
    };

    const timeAgo = (dateStr) => {
        const diff = Date.now() - new Date(dateStr);
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        return `${Math.floor(hrs / 24)}d ago`;
    };

    return (
        <div className="glass-panel rounded-2xl p-5 space-y-4 border border-outline-variant/10">
            {/* Item Info */}
            <div className="flex items-center gap-4">
                <img
                    alt={req.item?.title}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                    src={req.item?.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'; }}
                />
                <div className="flex-1 min-w-0">
                    <h3 className="font-headline font-bold text-on-surface truncate">{req.item?.title || 'Item'}</h3>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                        {isBorrower ? `From ${req.lender?.name || 'Lender'}` : `By ${req.borrower?.name || 'Borrower'}`}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                        <div className="w-5 h-5 rounded-full overflow-hidden border border-primary/20 flex items-center justify-center bg-surface-container text-[8px] font-black text-primary">
                            {(isBorrower ? req.lender?.avatar : req.borrower?.avatar) ? (
                                <img 
                                    src={isBorrower ? req.lender?.avatar : req.borrower?.avatar} 
                                    alt="User" 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span>{(isBorrower ? req.lender?.name : req.borrower?.name)?.charAt(0).toUpperCase() || '?'}</span>
                            )}
                        </div>
                        <p className="text-xs text-on-surface-variant/50">{timeAgo(req.createdAt)}</p>
                    </div>
                </div>
                {/* Status Badge */}
                <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${config.color}`}>
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>{config.icon}</span>
                    {config.label}
                </span>
            </div>

            {/* Message */}
            {req.message && (
                <p className="text-sm text-on-surface-variant italic bg-surface-container/30 rounded-xl px-4 py-2">
                    "{req.message}"
                </p>
            )}

            {/* Actions */}
            <div className="flex gap-3 flex-wrap">
                {/* Lender actions on pending */}
                {isLender && req.status === 'pending' && (
                    <>
                        <button
                            onClick={() => handleUpdate('accepted')}
                            disabled={updating}
                            className="flex-1 py-2.5 rounded-xl bg-emerald-400/20 border border-emerald-400/30 text-emerald-400 text-sm font-bold hover:bg-emerald-400/30 transition-all disabled:opacity-50"
                        >
                            ✓ Accept
                        </button>
                        <button
                            onClick={() => handleUpdate('rejected')}
                            disabled={updating}
                            className="flex-1 py-2.5 rounded-xl bg-red-400/20 border border-red-400/30 text-red-400 text-sm font-bold hover:bg-red-400/30 transition-all disabled:opacity-50"
                        >
                            ✗ Reject
                        </button>
                    </>
                )}
                {/* Lender mark complete */}
                {isLender && req.status === 'accepted' && (
                    <button
                        onClick={() => handleUpdate('completed')}
                        disabled={updating}
                        className="flex-1 py-2.5 rounded-xl bg-blue-400/20 border border-blue-400/30 text-blue-400 text-sm font-bold hover:bg-blue-400/30 transition-all disabled:opacity-50"
                    >
                        ✓ Mark Complete
                    </button>
                )}
                {/* Borrower cancel */}
                {isBorrower && req.status === 'pending' && (
                    <button
                        onClick={() => handleUpdate('cancelled')}
                        disabled={updating}
                        className="flex-1 py-2.5 rounded-xl bg-surface-container border border-outline-variant/20 text-on-surface-variant text-sm font-bold hover:bg-surface-bright transition-all disabled:opacity-50"
                    >
                        Cancel Request
                    </button>
                )}
                {/* Chat */}
                <button
                    onClick={() => navigate(`/chat/${req.item?._id || 'general'}`)}
                    className="px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant/20 text-on-surface-variant text-sm hover:bg-surface-bright transition-all"
                >
                    <span className="material-symbols-outlined text-base">chat</span>
                </button>
            </div>
        </div>
    );
};

const ActivityPage = () => {
    const { currentUser } = useAuth();
    const toast = useToast();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all'); // all, borrowing, lending

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await requestService.getMyRequests(activeTab === 'all' ? '' : activeTab);
                setRequests(data);
            } catch (err) {
                toast.warning('Using demo data');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [activeTab]);

    const handleStatusUpdate = (requestId, newStatus) => {
        setRequests(prev => prev.map(r => r._id === requestId ? { ...r, status: newStatus } : r));
    };

    const filteredRequests = requests;

    return (
        <div className="min-h-screen text-on-surface font-body" style={{ background: 'radial-gradient(circle at 0% 0%, #0f1930 0%, #060e20 50%)' }}>
            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-[#060e20]/80 backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center justify-between px-6 py-4 max-w-screen-lg mx-auto">
                    <div>
                        <h1 className="font-headline text-2xl font-bold bg-gradient-to-r from-[#9fa7ff] to-[#be83fa] bg-clip-text text-transparent">Activity</h1>
                        <p className="text-xs text-on-surface-variant">Your borrowing & lending history</p>
                    </div>
                    <Link to="/dashboard" className="p-2 rounded-full bg-surface-container-highest/50 text-on-surface-variant hover:text-on-surface transition-colors">
                        <span className="material-symbols-outlined">home</span>
                    </Link>
                </div>
            </header>

            <main className="pt-24 pb-12 px-6 max-w-screen-lg mx-auto space-y-6">
                {/* Tabs */}
                <div className="flex gap-2 bg-surface-container/40 rounded-2xl p-1.5">
                    {[
                        { id: 'all', label: 'All', icon: 'list' },
                        { id: 'borrowing', label: 'Borrowing', icon: 'download' },
                        { id: 'lending', label: 'Lending', icon: 'upload' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-primary/20 text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                        >
                            <span className="material-symbols-outlined text-base">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="glass-panel rounded-2xl p-5 animate-pulse">
                                <div className="flex gap-4">
                                    <div className="w-16 h-16 rounded-xl bg-surface-container/70"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-surface-container/70 rounded w-3/4"></div>
                                        <div className="h-3 bg-surface-container/50 rounded w-1/2"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredRequests.length === 0 ? (
                    <div className="text-center py-20">
                        <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4 block">inbox</span>
                        <p className="text-on-surface-variant font-medium">No activity yet</p>
                        <p className="text-on-surface-variant/50 text-sm mt-1">Browse items to start borrowing!</p>
                        <Link to="/dashboard" className="mt-6 inline-block bg-gradient-to-r from-primary to-secondary text-on-primary px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform">
                            Browse Items
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredRequests.map(req => (
                            <RequestCard
                                key={req._id}
                                req={req}
                                currentUserId={currentUser?._id}
                                onStatusUpdate={handleStatusUpdate}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* Bottom Nav */}
            <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-8 pt-3 bg-[#0f1930]/70 backdrop-blur-lg rounded-t-3xl z-50 shadow-[0_-10px_30px_rgba(6,14,32,0.8)] border-t border-[#40485d]/15">
                <Link to="/dashboard" className="flex flex-col items-center justify-center text-[#dee5ff]/40 p-2 hover:bg-[#1f2b49]/50 transition-colors active:scale-90 duration-200">
                    <span className="material-symbols-outlined">home</span>
                    <span className="text-[10px] uppercase tracking-widest font-bold mt-1">Home</span>
                </Link>
                <Link to="/add-item" className="flex flex-col items-center justify-center text-[#dee5ff]/40 p-2 hover:bg-[#1f2b49]/50 transition-colors active:scale-90 duration-200">
                    <span className="material-symbols-outlined">add_circle</span>
                    <span className="text-[10px] uppercase tracking-widest font-bold mt-1">Add</span>
                </Link>
                <Link to="/chat" className="flex flex-col items-center justify-center text-[#dee5ff]/40 p-2 hover:bg-[#1f2b49]/50 transition-colors active:scale-90 duration-200">
                    <span className="material-symbols-outlined">chat_bubble</span>
                    <span className="text-[10px] uppercase tracking-widest font-bold mt-1">Chat</span>
                </Link>
                <Link to="/requests" className="flex flex-col items-center justify-center bg-gradient-to-br from-[#9fa7ff]/20 to-[#be83fa]/20 text-[#9fa7ff] rounded-2xl p-2 shadow-[0_0_15px_rgba(159,167,255,0.3)] transition-all duration-200 active:scale-90">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>local_activity</span>
                    <span className="text-[10px] uppercase tracking-widest font-bold mt-1">Activity</span>
                </Link>
                <Link to="/profile" className="flex flex-col items-center justify-center text-[#dee5ff]/40 p-2 hover:bg-[#1f2b49]/50 transition-colors active:scale-90 duration-200">
                    <span className="material-symbols-outlined">person</span>
                    <span className="text-[10px] uppercase tracking-widest font-bold mt-1">Profile</span>
                </Link>
            </nav>
        </div>
    );
};

export default ActivityPage;
