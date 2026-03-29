
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import itemService, { MOCK_ITEMS } from '../../services/itemService';

const CATEGORIES = [
    { icon: 'menu_book', label: 'Books' },
    { icon: 'calculate', label: 'Calculator' },
    { icon: 'biotech', label: 'Lab Tools' },
    { icon: 'computer', label: 'Electronics' },
    { icon: 'devices_other', label: 'Gadgets' },
    { icon: 'chair', label: 'Essentials' },
];

const BottomNav = () => (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-8 pt-3 bg-[#0f1930]/70 backdrop-blur-lg rounded-t-3xl z-50 shadow-[0_-10px_30px_rgba(6,14,32,0.8)] border-t border-[#40485d]/15">
        <Link to="/dashboard" className="flex flex-col items-center justify-center bg-gradient-to-br from-[#9fa7ff]/20 to-[#be83fa]/20 text-[#9fa7ff] rounded-2xl p-2 shadow-[0_0_15px_rgba(159,167,255,0.3)] transition-all duration-200 active:scale-90">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
            <span className="text-[10px] uppercase tracking-widest font-bold mt-1">Home</span>
        </Link>
        <Link to="/add-item" className="flex flex-col items-center justify-center text-[#dee5ff]/40 p-2 hover:bg-[#1f2b49]/50 transition-colors active:scale-90 duration-200">
            <span className="material-symbols-outlined">add_circle</span>
            <span className="text-[10px] uppercase tracking-widest font-bold mt-1">Add</span>
        </Link>
        <Link to="/chat" className="flex flex-col items-center justify-center text-[#dee5ff]/40 p-2 hover:bg-[#1f2b49]/50 transition-colors active:scale-90 duration-200">
            <div className="relative">
                <span className="material-symbols-outlined">chat_bubble</span>
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-secondary rounded-full"></span>
            </div>
            <span className="text-[10px] uppercase tracking-widest font-bold mt-1">Chat</span>
        </Link>
        <Link to="/requests" className="flex flex-col items-center justify-center text-[#dee5ff]/40 p-2 hover:bg-[#1f2b49]/50 transition-colors active:scale-90 duration-200">
            <span className="material-symbols-outlined">local_activity</span>
            <span className="text-[10px] uppercase tracking-widest font-bold mt-1">Activity</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center justify-center text-[#dee5ff]/40 p-2 hover:bg-[#1f2b49]/50 transition-colors active:scale-90 duration-200">
            <span className="material-symbols-outlined">person</span>
            <span className="text-[10px] uppercase tracking-widest font-bold mt-1">Profile</span>
        </Link>
    </nav>
);

const ItemCard = ({ item, onClick }) => {
    const isAvailable = item.status === 'available';
    return (
        <div
            onClick={onClick}
            className="group relative flex-shrink-0 w-[280px] sm:w-[320px] bg-surface-container/50 backdrop-blur-md rounded-[2.5rem] overflow-hidden border border-outline-variant/10 hover:shadow-[0_40px_80px_rgba(6,14,32,0.7)] hover:-translate-y-2 transition-all duration-500 cursor-pointer"
        >
            <div className="relative h-[220px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-surface-dim/80 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <img
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    src={item.image}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'; }}
                />
                <div className="absolute top-5 left-5 z-20">
                    <span className={`px-4 py-1.5 bg-surface-dim/80 backdrop-blur-xl rounded-full text-[10px] font-bold ${isAvailable ? 'text-tertiary' : 'text-orange-400'} uppercase tracking-[0.2em] flex items-center gap-2 border border-outline-variant/10 shadow-lg`}>
                        <span className={`w-2 h-2 ${isAvailable ? 'bg-tertiary' : 'bg-orange-400'} rounded-full animate-pulse shadow-[0_0_8px_currentColor]`}></span>
                        {isAvailable ? 'Available' : item.status}
                    </span>
                </div>
                <div className="absolute bottom-5 right-5 z-20 scale-0 group-hover:scale-100 transition-transform duration-500 delay-100">
                    <div className="bg-primary text-on-primary p-3 rounded-2xl shadow-xl hover:rotate-6 active:scale-90 transition-all">
                        <span className="material-symbols-outlined text-xl">arrow_outward</span>
                    </div>
                </div>
            </div>
            <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                    <div className="flex-1 mr-2">
                        <h3 className="font-headline font-bold text-xl text-on-surface line-clamp-1 group-hover:text-primary transition-colors duration-300">{item.title}</h3>
                        <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest mt-1.5">{item.category}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-surface-container-highest/60 px-2 py-1 rounded-lg">
                        <span className="material-symbols-outlined text-sm text-yellow-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="text-[10px] font-bold text-on-surface">4.8</span>
                    </div>
                </div>
                
                <div className="h-px w-full bg-outline-variant/10"></div>
                
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                         <div className="relative">
                            {item.owner?.avatar ? (
                                <img
                                    alt={item.owner?.name}
                                    className="w-9 h-9 rounded-full border border-primary/20 p-0.5 object-cover"
                                    src={item.owner?.avatar}
                                />
                            ) : (
                                <div className="w-9 h-9 rounded-full border border-primary/20 bg-surface-container flex items-center justify-center text-[10px] font-black text-primary">
                                    {item.owner?.name?.charAt(0).toUpperCase() || '?'}
                                </div>
                            )}
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-tertiary border-2 border-[#060e20] rounded-full"></div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-on-surface font-bold line-clamp-1">{item.owner?.name || 'Unknown'}</span>
                            <span className="text-[10px] text-on-surface-variant font-medium">Owner</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-secondary">
                        <span className="material-symbols-outlined text-base">location_on</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider">{item.location}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const toast = useToast();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('');
    const [searching, setSearching] = useState(false);

    const fetchItems = useCallback(async (keyword = '', category = '') => {
        setSearching(true);
        try {
            const data = await itemService.getItems({ keyword, category });
            setItems(data);
        } catch (err) {
            setItems(MOCK_ITEMS);
            toast.warning('Using demo data — API unavailable');
        } finally {
            setLoading(false);
            setSearching(false);
        }
    }, []);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchItems(searchQuery, activeCategory);
    };

    const handleCategoryClick = (cat) => {
        const newCat = activeCategory === cat ? '' : cat;
        setActiveCategory(newCat);
        fetchItems(searchQuery, newCat);
    };

    const firstName = currentUser?.name?.split(' ')[0] || 'Friend';
    const userInitial = currentUser?.name?.charAt(0).toUpperCase() || '?';

    return (
        <div className="font-body text-on-surface selection:bg-primary/30 selection:text-primary min-h-screen" style={{ background: 'radial-gradient(circle at 0% 0%, #0f1930 0%, #060e20 50%), radial-gradient(circle at 100% 100%, #192540 0%, #060e20 50%)' }}>
            {/* Background Decorative */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-20 left-10 text-primary/10 rotate-12 scale-150">
                    <span className="material-symbols-outlined text-8xl">menu_book</span>
                </div>
                <div className="absolute bottom-40 right-10 text-secondary/10 -rotate-12 scale-150">
                    <span className="material-symbols-outlined text-9xl">calculate</span>
                </div>
                <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[100px]"></div>
            </div>

            {/* Top Navigation Bar */}
            <header className="fixed top-0 w-full z-50 bg-[#060e20]/80 backdrop-blur-xl shadow-[0_20px_40px_rgba(190,131,250,0.1)]">
                <div className="flex justify-between items-center px-6 py-4 w-full max-w-screen-2xl mx-auto">
                    <div className="flex flex-col">
                        <span className="font-headline text-2xl font-bold bg-gradient-to-r from-[#9fa7ff] to-[#be83fa] bg-clip-text text-transparent">CampusShare</span>
                        <span className="text-on-surface-variant text-xs font-medium tracking-wide">Hi {firstName} 👋</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/requests" className="p-2.5 rounded-full bg-surface-container-highest/50 text-[#9fa7ff] hover:scale-105 transition-all duration-300 active:scale-95">
                            <span className="material-symbols-outlined">notifications</span>
                        </Link>
                        <Link to="/profile" className="w-10 h-10 rounded-full border-2 border-primary/30 overflow-hidden hover:scale-105 transition-transform duration-300 flex items-center justify-center bg-surface-container">
                            {currentUser?.avatar ? (
                                <img alt="User Profile" className="w-full h-full object-cover" src={currentUser.avatar} />
                            ) : (
                                <span className="text-sm font-black text-primary">{userInitial}</span>
                            )}
                        </Link>
                    </div>
                </div>
                <div className="bg-[#192540]/15 h-[1px] w-full"></div>
            </header>

            <main className="pt-24 pb-32 px-6 max-w-screen-2xl mx-auto space-y-10">
                {/* Hero Search Section */}
                <section className="mt-8">
                    <form onSubmit={handleSearch}>
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative flex items-center bg-surface-container/60 backdrop-blur-md rounded-2xl px-6 py-4 border border-outline-variant/15">
                                <span className="material-symbols-outlined text-on-surface-variant mr-4">search</span>
                                <input
                                    className="bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/50 w-full text-lg font-medium outline-none"
                                    placeholder="Search items, books, tools..."
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {searchQuery && (
                                    <button type="button" onClick={() => { setSearchQuery(''); fetchItems('', activeCategory); }} className="text-on-surface-variant hover:text-on-surface mr-2">
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                )}
                                <button type="submit" className="text-primary hover:rotate-12 transition-transform">
                                    <span className="material-symbols-outlined">tune</span>
                                </button>
                            </div>
                        </div>
                    </form>
                </section>

                {/* Categories Strip */}
                <section className="space-y-4">
                    <div className="flex justify-between items-end">
                        <h2 className="font-headline text-2xl font-bold text-on-surface tracking-tight">Categories</h2>
                        <button onClick={() => { setActiveCategory(''); fetchItems(searchQuery, ''); }} className="text-sm font-label text-primary hover:text-secondary transition-colors uppercase tracking-widest font-bold">
                            See All
                        </button>
                    </div>
                    <div className="flex gap-4 overflow-x-auto hide-scrollbar py-2 -mx-6 px-6">
                        {CATEGORIES.map(({ icon, label }) => (
                            <button
                                key={label}
                                onClick={() => handleCategoryClick(label)}
                                className={`flex-shrink-0 flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all duration-300 cursor-pointer group ${activeCategory === label ? 'bg-primary/20 border-primary/40 scale-105' : 'bg-surface-container/40 border-outline-variant/10 hover:bg-surface-bright/60 hover:scale-105'}`}
                            >
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors ${activeCategory === label ? 'bg-primary/30 text-primary' : 'bg-primary/10 text-primary'}`}>
                                    <span className="material-symbols-outlined text-3xl">{icon}</span>
                                </div>
                                <span className="text-xs font-bold font-label tracking-widest uppercase text-on-surface-variant group-hover:text-on-surface">{label}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Quick Actions Bento */}
                <section className="grid grid-cols-2 gap-4">
                    <button onClick={() => navigate('/add-item')} className="relative group overflow-hidden rounded-2xl aspect-[4/3] flex flex-col items-center justify-center bg-gradient-to-br from-primary/20 to-primary-container/20 border border-primary/20 hover:border-primary/40 transition-all active:scale-95">
                        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity"></div>
                        <span className="material-symbols-outlined text-4xl text-primary mb-2 group-hover:scale-125 transition-transform duration-300">add_circle</span>
                        <span className="font-headline font-bold text-lg text-primary">Add Item</span>
                    </button>
                    <button onClick={() => navigate('/requests')} className="relative group overflow-hidden rounded-2xl aspect-[4/3] flex flex-col items-center justify-center bg-gradient-to-br from-secondary/20 to-secondary-container/20 border border-secondary/20 hover:border-secondary/40 transition-all active:scale-95">
                        <div className="absolute inset-0 bg-secondary/10 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity"></div>
                        <span className="material-symbols-outlined text-4xl text-secondary mb-2 group-hover:scale-125 transition-transform duration-300">pending_actions</span>
                        <span className="font-headline font-bold text-lg text-secondary">View Requests</span>
                    </button>
                </section>

                {/* Recommended Section (Horizontal) */}
                <section className="space-y-6">
                    <div className="flex justify-between items-end">
                        <div className="max-w-[70%]">
                            <h2 className="font-headline text-3xl font-bold text-on-surface tracking-tight">Recommended</h2>
                            <p className="text-on-surface-variant text-sm font-medium mt-1">Based on your campus activity</p>
                        </div>
                        <button className="text-xs font-label text-primary hover:text-secondary transition-colors uppercase tracking-[0.2em] font-bold flex items-center gap-2 group">
                            Explore <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                    </div>

                    <div className="relative group/scroll">
                        <div className="flex gap-8 overflow-x-auto pb-10 pt-4 -mx-6 px-6 hide-scrollbar snap-x snap-mandatory">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <div key={i} className="flex-shrink-0 w-[300px] rounded-[2.5rem] overflow-hidden border border-outline-variant/10 animate-pulse">
                                        <div className="h-[220px] bg-surface-container/50"></div>
                                        <div className="p-6 space-y-4">
                                            <div className="h-6 bg-surface-container/70 rounded-full w-3/4"></div>
                                            <div className="h-4 bg-surface-container/50 rounded-full w-1/2"></div>
                                        </div>
                                    </div>
                                ))
                            ) : items.length === 0 ? (
                                <div className="w-full text-center py-10 bg-surface-container/20 rounded-3xl border border-dashed border-outline-variant/30">
                                    <span className="material-symbols-outlined text-5xl opacity-20 mb-3">inventory_2</span>
                                    <p className="text-on-surface-variant font-medium uppercase tracking-widest text-[10px]">No items yet</p>
                                </div>
                            ) : (
                                items.map(item => (
                                    <div key={item._id} className="snap-center">
                                        <ItemCard
                                            item={item}
                                            onClick={() => navigate(`/items/${item._id}`)}
                                        />
                                    </div>
                                ))
                            )}
                        </div>
                        {/* Subtle fade effect at edges */}
                        <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-[#060e20] to-transparent pointer-events-none z-10"></div>
                    </div>
                </section>

                {/* Trending This Week Section (Horizontal) */}
                <section className="space-y-6">
                    <div className="flex justify-between items-end">
                        <div>
                            <h2 className="font-headline text-3xl font-bold text-on-surface tracking-tight">Trending Items 🔥</h2>
                            <p className="text-on-surface-variant text-sm font-medium mt-1">What's popular right now</p>
                        </div>
                    </div>

                    <div className="relative group/scroll">
                        <div className="flex gap-8 overflow-x-auto pb-10 pt-4 -mx-6 px-6 hide-scrollbar snap-x snap-mandatory">
                            {/* Reusing mock items or subset for trending for demo variety */}
                            {(loading ? [1,2,3] : (items.length > 0 ? [...items].reverse() : [])).map((item, idx) => (
                                <div key={item._id || idx} className="snap-center">
                                    {loading ? (
                                        <div className="flex-shrink-0 w-[300px] rounded-[2.5rem] overflow-hidden border border-outline-variant/10 animate-pulse">
                                            <div className="h-[220px] bg-surface-container/50"></div>
                                        </div>
                                    ) : (
                                        <ItemCard
                                            item={item}
                                            onClick={() => navigate(`/items/${item._id}`)}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-[#060e20] to-transparent pointer-events-none z-10"></div>
                    </div>
                </section>

                {/* Search Results / Full Listing Section */}
                {(activeCategory || searchQuery) && (
                    <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex items-center gap-4">
                            <div className="h-px flex-1 bg-outline-variant/20"></div>
                            <h2 className="font-headline text-xl font-bold text-on-surface tracking-tight whitespace-nowrap px-4 py-2 rounded-full bg-surface-container-highest/40 border border-outline-variant/10">
                                {activeCategory ? `Category: ${activeCategory}` : 'Search Results'}
                            </h2>
                            <div className="h-px flex-1 bg-outline-variant/20"></div>
                        </div>

                        {items.length === 0 ? (
                            <div className="text-center py-20 bg-surface-container/10 rounded-[3rem] border border-outline-variant/5">
                                <span className="material-symbols-outlined text-7xl text-on-surface-variant/20 mb-6 block">search_off</span>
                                <p className="text-on-surface-variant font-headline text-lg italic">The ethereal archive has no such record...</p>
                                <button 
                                    onClick={() => { setSearchQuery(''); setActiveCategory(''); fetchItems(); }} 
                                    className="mt-8 px-8 py-3 bg-primary/20 text-primary border border-primary/30 rounded-full font-bold hover:bg-primary/30 transition-all active:scale-95"
                                >
                                    Reset Selection
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-10">
                                {items.map(item => (
                                    <div key={item._id} className="flex justify-center">
                                        <ItemCard
                                            item={item}
                                            onClick={() => navigate(`/items/${item._id}`)}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}
            </main>

            <BottomNav />
        </div>
    );
};

export default Dashboard;
