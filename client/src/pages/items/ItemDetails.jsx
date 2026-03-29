import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import itemService, { MOCK_ITEMS } from '../../services/itemService';
import requestService from '../../services/requestService';

const StarRating = ({ rating, size = 'text-sm' }) => (
    <div className="flex text-amber-400">
        {[1, 2, 3, 4, 5].map(star => (
            <span key={star} className={`material-symbols-outlined ${size}`} style={{ fontVariationSettings: `'FILL' ${star <= Math.floor(rating) ? 1 : star - 0.5 <= rating ? '0.5' : 0}` }}>
                {star <= rating ? 'star' : star - 0.5 <= rating ? 'star_half' : 'star_border'}
            </span>
        ))}
    </div>
);

const ItemDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const toast = useToast();

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [requesting, setRequesting] = useState(false);
    const [message, setMessage] = useState('');
    const [showMessageBox, setShowMessageBox] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await itemService.getItemById(id);
                setItem(data);
            } catch (err) {
                setItem(MOCK_ITEMS[0]);
                toast.warning('Using demo data');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    const handleRequest = async () => {
        if (!currentUser) {
            toast.error('Please login to request items');
            navigate('/login');
            return;
        }
        if (item?.owner?._id === currentUser?._id) {
            toast.warning("You can't request your own item");
            return;
        }
        if (item?.status !== 'available') {
            toast.warning('This item is currently not available');
            return;
        }

        setRequesting(true);
        try {
            await requestService.createRequest(item._id, message || `Hi, I'd like to borrow your ${item.title}`);
            toast.success('Request sent successfully! 🎉');
            setShowMessageBox(false);
            setItem(prev => ({ ...prev, status: 'requested' }));
        } catch (err) {
            const errMsg = err.response?.data?.message || 'Failed to send request';
            if (errMsg.includes('already have an active request')) {
                toast.warning('You already requested this item!');
            } else if (id.startsWith('mock-')) {
                toast.success('Request sent! (Demo mode) 🎉');
            } else {
                toast.error(errMsg);
            }
        } finally {
            setRequesting(false);
        }
    };

    const isOwner = item?.owner?._id?.toString() === currentUser?._id?.toString();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#060e20] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-2 border-primary/20 animate-spin border-t-primary"></div>
                    <p className="text-on-surface-variant text-sm">Loading item...</p>
                </div>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="min-h-screen bg-[#060e20] flex flex-col items-center justify-center gap-4">
                <span className="material-symbols-outlined text-6xl text-on-surface-variant">search_off</span>
                <p className="text-on-surface-variant">Item not found</p>
                <button onClick={() => navigate('/dashboard')} className="text-primary hover:underline">Back to Dashboard</button>
            </div>
        );
    }

    return (
        <div className="bg-surface text-on-surface font-body selection:bg-primary selection:text-on-primary min-h-screen">
            {/* Top Nav */}
            <nav className="fixed top-0 w-full z-50 bg-[#060e20]/60 backdrop-blur-xl shadow-[0px_20px_40px_rgba(190,131,250,0.05)]">
                <div className="flex items-center justify-between px-6 h-16 w-full max-w-7xl mx-auto">
                    <button onClick={() => navigate(-1)} className="text-[#dee5ff]/70 hover:scale-105 transition-transform duration-300 active:scale-95">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div className="font-headline tracking-tight text-xl font-bold text-[#dee5ff] uppercase">Item Details</div>
                    <div className="flex gap-4">
                        <button className="text-[#dee5ff]/70 hover:scale-105 transition-transform duration-300 active:scale-95">
                            <span className="material-symbols-outlined">bookmark</span>
                        </button>
                        <button className="text-[#dee5ff]/70 hover:scale-105 transition-transform duration-300 active:scale-95">
                            <span className="material-symbols-outlined">share</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Background Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[20%] right-[-5%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px]"></div>
            </div>

            <main className="pt-20 pb-36 px-4 max-w-3xl mx-auto space-y-8">
                {/* Hero Image */}
                <section className="relative aspect-[4/3] w-full group overflow-hidden rounded-2xl">
                    <img
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        src={item.image}
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-60"></div>
                    {/* Status Badge */}
                    <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${item.status === 'available' ? 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/30' : 'bg-orange-400/20 text-orange-400 border border-orange-400/30'}`}>
                            <span className={`w-2 h-2 rounded-full animate-pulse ${item.status === 'available' ? 'bg-emerald-400' : 'bg-orange-400'}`}></span>
                            {item.status || 'Available'}
                        </span>
                    </div>
                </section>

                {/* Primary Info Card */}
                <section className="glass-panel p-8 rounded-2xl relative overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="space-y-2">
                            <h1 className="text-3xl md:text-4xl font-headline font-bold text-on-surface leading-tight tracking-tight">
                                {item.title}
                            </h1>
                            <div className="flex items-center gap-3">
                                <StarRating rating={item.owner?.rating || 4.5} />
                                <span className="text-on-surface-variant font-label text-sm uppercase tracking-widest">
                                    {item.owner?.rating || '4.5'} ({item.owner?.reviewCount || 0} REVIEWS)
                                </span>
                            </div>
                            <span className="text-xs font-label text-on-surface-variant uppercase tracking-widest bg-surface-container px-3 py-1 rounded-full inline-block">{item.category}</span>
                        </div>
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-tertiary/10 border border-tertiary/20 flex-shrink-0">
                            <span className="w-2 h-2 rounded-full bg-tertiary mr-2 animate-pulse shadow-[0_0_8px_#7de9ff]"></span>
                            <span className="text-tertiary font-label text-xs font-bold uppercase tracking-wider">
                                Trust Score: {item.owner?.trustScore || 90}%
                            </span>
                        </div>
                    </div>

                    {/* Owner Section */}
                    <div className="mt-8 flex items-center justify-between p-4 rounded-xl bg-surface-container-low border border-outline-variant/10">
                        <div className="flex items-center gap-4">
                                {item.owner?.avatar ? (
                                    <img
                                        alt="Owner Profile"
                                        className="w-12 h-12 rounded-full object-cover border border-primary/30"
                                        src={item.owner.avatar}
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full border border-primary/30 bg-surface-container flex items-center justify-center text-sm font-black text-primary">
                                        {item.owner?.name?.charAt(0).toUpperCase() || '?'}
                                    </div>
                                )}
                            <div>
                                <div className="font-headline font-bold text-lg">{item.owner?.name || 'Campus Member'}</div>
                                <div className="flex items-center text-on-surface-variant text-sm gap-1">
                                    <span className="material-symbols-outlined text-sm">location_on</span>
                                    {item.location}
                                </div>
                            </div>
                        </div>
                        {!isOwner && (
                            <button
                                onClick={() => navigate(`/chat/${id}`)}
                                className="px-6 py-2 rounded-full border border-outline-variant hover:bg-surface-bright hover:border-primary/50 transition-all duration-300 font-label text-sm uppercase tracking-widest text-on-surface"
                            >
                                Chat
                            </button>
                        )}
                    </div>
                </section>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <section className="glass-panel p-6 rounded-2xl space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">description</span>
                            <h2 className="font-headline font-bold text-xl tracking-tight uppercase">Description</h2>
                        </div>
                        <p className="text-on-surface-variant leading-relaxed">{item.description}</p>
                    </section>

                    <section className="glass-panel p-6 rounded-2xl space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <span className="material-symbols-outlined text-primary">event_available</span>
                            </div>
                            <div>
                                <div className="text-xs font-label uppercase text-on-surface-variant tracking-widest mb-1">Availability</div>
                                <div className="text-on-surface font-medium">{item.availability || 'Contact owner for details'}</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-lg bg-secondary/10">
                                <span className="material-symbols-outlined text-secondary">location_on</span>
                            </div>
                            <div>
                                <div className="text-xs font-label uppercase text-on-surface-variant tracking-widest mb-1">Pickup Location</div>
                                <div className="text-on-surface font-medium">{item.location}</div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Message Box */}
                {showMessageBox && !isOwner && (
                    <section className="glass-panel p-6 rounded-2xl space-y-4">
                        <h3 className="font-headline font-bold text-lg">Add a message (optional)</h3>
                        <textarea
                            className="w-full bg-surface-container/50 rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/40 outline-none resize-none"
                            rows={3}
                            placeholder={`Hi, I'd like to borrow your ${item.title}...`}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </section>
                )}
            </main>

            {/* Bottom Action Bar */}
            <footer className="fixed bottom-0 left-0 w-full p-6 bg-[#060e20]/80 backdrop-blur-2xl border-t border-[#40485d]/15 z-50">
                <div className="w-full max-w-lg mx-auto space-y-3">
                    {isOwner ? (
                        <div className="text-center text-on-surface-variant text-sm py-3">
                            This is your item • <button onClick={() => navigate('/requests')} className="text-primary hover:underline">View requests</button>
                        </div>
                    ) : (
                        <>
                            {!showMessageBox && (
                                <button
                                    onClick={() => setShowMessageBox(true)}
                                    className="w-full text-sm text-on-surface-variant hover:text-on-surface text-center py-2 transition-colors"
                                >
                                    + Add a message to your request
                                </button>
                            )}
                            <button
                                onClick={handleRequest}
                                disabled={requesting || item?.status !== 'available'}
                                className="w-full py-5 px-8 flex items-center justify-center gap-3 bg-gradient-to-r from-[#9fa7ff] to-[#be83fa] rounded-full shadow-[0px_20px_40px_rgba(190,131,250,0.2)] hover:brightness-110 hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-60 disabled:pointer-events-none"
                            >
                                {requesting ? (
                                    <svg className="animate-spin h-5 w-5 text-[#060e20]" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                    </svg>
                                ) : (
                                    <>
                                        <span className="font-body font-bold text-sm uppercase tracking-[0.2em] text-[#060e20]">
                                            {item.status === 'available' ? 'Request Item' : 'Not Available'}
                                        </span>
                                        {item.status === 'available' && <span className="material-symbols-outlined text-[#060e20]">arrow_forward</span>}
                                    </>
                                )}
                            </button>
                        </>
                    )}
                </div>
            </footer>
        </div>
    );
};

export default ItemDetails;
