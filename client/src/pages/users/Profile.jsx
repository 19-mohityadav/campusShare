import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import requestService from '../../services/requestService';
import api from '../../services/api';

const Profile = () => {
    const navigate = useNavigate();
    const { currentUser, logout, updateProfile } = useAuth();
    const toast = useToast();

    const [stats, setStats] = useState({ borrowed: 0, lent: 0, active: 0, completed: 0 });
    const [recentActivity, setRecentActivity] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editName, setEditName] = useState('');
    const [saving, setSaving] = useState(false);

    // Image Upload & Crop State
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [showCropper, setShowCropper] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const all = await requestService.getMyRequests();
                const borrowed = all.filter(r => r.borrower?._id === currentUser?._id || r.borrower?._id === 'current-user').length;
                const lent = all.filter(r => r.lender?._id === currentUser?._id || r.lender?._id === 'current-user').length;
                const active = all.filter(r => r.status === 'accepted').length;
                const completed = all.filter(r => r.status === 'completed').length;
                setStats({ borrowed, lent, active, completed });
                setRecentActivity(all.slice(0, 3));
            } catch (err) {
                // Stats defaults are fine
            }
        };
        if (currentUser) {
            setEditName(currentUser.name || '');
            loadStats();
        }
    }, [currentUser]);

    const onCropComplete = useCallback((_croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleFileChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImageSrc(reader.result);
                setShowCropper(true);
            });
            reader.readAsDataURL(file);
        }
    };

    const getCroppedImg = async (imageSrc, pixelCrop) => {
        const image = new Image();
        image.src = imageSrc;
        await new Promise((resolve) => (image.onload = resolve));

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob);
            }, 'image/jpeg');
        });
    };

    const handleUpload = async () => {
        if (!croppedAreaPixels) return;
        setUploading(true);
        try {
            const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
            const formData = new FormData();
            formData.append('image', croppedBlob, 'avatar.jpg');

            const res = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data.imageUrl) {
                await updateProfile({ avatar: res.data.imageUrl });
                toast.success('Profile picture updated! ✨');
                setShowCropper(false);
                setImageSrc(null);
            }
        } catch (err) {
            toast.error('Upload failed. Try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            await updateProfile({ name: editName });
            toast.success('Profile updated!');
            setEditMode(false);
        } catch (err) {
            toast.error('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        logout();
        toast.info('Logged out successfully');
        navigate('/login');
    };

    const firstName = currentUser?.name?.split(' ')[0] || 'User';
    const userInitial = currentUser?.name?.charAt(0).toUpperCase() || '?';

    const statItems = [
        { icon: 'book_2', value: stats.borrowed, label: 'Borrowed', color: 'text-primary', bg: 'bg-primary/10' },
        { icon: 'send_to_mobile', value: stats.lent, label: 'Lent', color: 'text-secondary', bg: 'bg-secondary/10' },
        { icon: 'sync_alt', value: stats.active, label: 'Active', color: 'text-tertiary', bg: 'bg-tertiary/10' },
        { icon: 'check_circle', value: stats.completed, label: 'Completed', color: 'text-on-surface-variant', bg: 'bg-on-surface/5' },
    ];

    const achievements = [
        { icon: 'military_tech', title: 'Trusted User', desc: 'Joined CampusShare', gradient: 'from-yellow-400 to-orange-500' },
        { icon: 'bolt', title: 'Fast Connector', desc: 'Listed first item', gradient: 'from-primary to-indigo-600' },
        { icon: 'stars', title: 'Campus Hero', desc: 'Helped 3+ students', gradient: 'from-secondary to-purple-700' },
    ];

    return (
        <div className="bg-background text-on-surface font-body selection:bg-primary selection:text-on-primary min-h-screen">
            {/* Image Cropper Modal */}
            {showCropper && (
                <div className="fixed inset-0 z-[100] bg-[#060e20]/95 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="glass-panel w-full max-w-lg aspect-square relative rounded-3xl overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 pb-20">
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                                cropShape="round"
                                showGrid={false}
                            />
                        </div>
                        <div className="absolute bottom-0 w-full p-6 bg-[#060e20]/80 backdrop-blur-xl border-t border-white/5 space-y-4">
                            <div className="flex items-center gap-4">
                                <span className="material-symbols-outlined text-primary text-sm">zoom_in</span>
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    onChange={(e) => setZoom(e.target.value)}
                                    className="flex-1 accent-primary h-1.5 bg-surface-container rounded-full appearance-none cursor-pointer"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowCropper(false)}
                                    className="flex-1 py-3 rounded-2xl bg-surface-container border border-outline-variant/30 text-sm font-bold hover:bg-white/5 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpload}
                                    disabled={uploading}
                                    className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-primary to-secondary text-[#060e20] text-sm font-black uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {uploading ? 'Finalizing...' : 'Set Avatar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Top Navigation Bar */}
            <nav className="fixed top-0 w-full z-50 bg-[#060e20]/80 backdrop-blur-xl border-b border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
                <div className="flex justify-between items-center px-6 py-4 w-full max-w-7xl mx-auto">
                    <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#9fa7ff] to-[#be83fa] font-headline tracking-tight">CampusShare</div>
                    <div className="hidden md:flex gap-8 items-center font-headline">
                        <Link to="/dashboard" className="text-[#dee5ff]/70 hover:text-[#9fa7ff] transition-colors duration-300">Home</Link>
                        <Link to="/requests" className="text-[#dee5ff]/70 hover:text-[#9fa7ff] transition-colors duration-300">Activity</Link>
                        <span className="text-[#9fa7ff]">Profile</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={handleLogout} className="text-on-surface-variant hover:text-red-400 transition-colors" title="Logout">
                            <span className="material-symbols-outlined">logout</span>
                        </button>
                        <div className="w-8 h-8 rounded-full border border-primary overflow-hidden flex items-center justify-center bg-surface-container">
                            {currentUser?.avatar ? (
                                <img alt="User profile" className="w-full h-full object-cover" src={currentUser.avatar} />
                            ) : (
                                <span className="text-[10px] font-black text-primary">{userInitial}</span>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="pt-20 pb-32">
                {/* Profile Header & Banner */}
                <section className="relative px-6 max-w-7xl mx-auto mt-8">
                    <div className="relative h-48 w-full rounded-2xl overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#060e20] via-[#192540] to-[#62259b] opacity-80"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
                    </div>

                    <div className="relative -mt-20 flex flex-col items-center">
                        <div className="relative group">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary to-secondary blur-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative w-32 h-32 rounded-full border-4 border-surface p-1 bg-gradient-to-tr from-primary to-secondary flex items-center justify-center overflow-hidden shadow-2xl">
                                {currentUser?.avatar ? (
                                    <img alt="Profile" className="w-full h-full rounded-full object-cover" src={currentUser.avatar} />
                                ) : (
                                    <span className="text-4xl font-black text-on-primary">{userInitial}</span>
                                )}
                                
                                {/* Overlay Upload Trigger */}
                                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-[2px]">
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                    <span className="material-symbols-outlined text-white text-3xl">add_a_photo</span>
                                </label>
                            </div>
                        </div>

                        <div className="mt-4 text-center">
                            {editMode ? (
                                <div className="flex items-center gap-2 mt-2">
                                    <input
                                        className="bg-surface-container rounded-xl px-3 py-2 text-on-surface font-headline font-bold text-xl text-center outline-none focus:ring-2 focus:ring-primary/40"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        autoFocus
                                    />
                                    <button onClick={handleSaveProfile} disabled={saving} className="text-primary hover:text-secondary transition-colors">
                                        <span className="material-symbols-outlined">{saving ? 'hourglass_empty' : 'check'}</span>
                                    </button>
                                    <button onClick={() => setEditMode(false)} className="text-on-surface-variant hover:text-on-surface transition-colors">
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>
                            ) : (
                                <h1 className="font-headline text-3xl font-bold text-on-surface tracking-tight">{firstName} 👋</h1>
                            )}
                            <p className="text-on-surface-variant text-sm mt-1">{currentUser?.email}</p>
                            <div className="flex items-center justify-center gap-3 mt-2">
                                <div className="flex items-center text-yellow-400">
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    <span className="ml-1 font-bold text-on-surface">{currentUser?.rating?.toFixed(1) || '5.0'}</span>
                                    <span className="ml-1 text-on-surface-variant text-sm">({currentUser?.reviewCount || 0} reviews)</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary/10 border border-tertiary/20">
                                    <span className="material-symbols-outlined text-tertiary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                                    <span className="text-tertiary text-xs font-bold uppercase tracking-wider">Trust: {currentUser?.trustScore || 100}%</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap justify-center gap-4 mt-6">
                            <button
                                onClick={() => setEditMode(true)}
                                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-primary to-secondary text-on-primary font-bold shadow-[0px_10px_30px_rgba(190,131,250,0.2)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 text-sm"
                            >
                                <span className="material-symbols-outlined text-base">edit</span>
                                Edit Profile
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-6 py-2.5 rounded-full bg-surface-container border border-outline-variant/30 text-on-surface font-bold hover:bg-red-500/10 hover:border-red-400/30 hover:text-red-400 transition-all flex items-center gap-2 text-sm"
                            >
                                <span className="material-symbols-outlined text-base">logout</span>
                                Logout
                            </button>
                        </div>
                    </div>
                </section>

                {/* Stats Dashboard */}
                <section className="px-6 max-w-7xl mx-auto mt-12">
                    <h2 className="font-headline text-2xl font-bold mb-6 flex items-center gap-2">
                        <span className="w-8 h-1 bg-primary rounded-full"></span> Stats Overview
                    </h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {statItems.map(({ icon, value, label, color, bg }) => (
                            <div key={label} className="glass-panel p-5 rounded-2xl relative group overflow-hidden">
                                <span className={`material-symbols-outlined ${color} mb-3 block`}>{icon}</span>
                                <div className="text-3xl font-bold font-headline">{value}</div>
                                <div className="text-on-surface-variant text-xs font-label uppercase tracking-widest mt-1">{label}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Achievements */}
                <section className="px-6 max-w-7xl mx-auto mt-12">
                    <h2 className="font-headline text-2xl font-bold mb-6 flex items-center gap-2">
                        <span className="w-8 h-1 bg-secondary rounded-full"></span> Achievements
                    </h2>
                    <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar">
                        {achievements.map(({ icon, title, desc, gradient }) => (
                            <div key={title} className="flex-none w-44 glass-panel p-5 rounded-2xl flex flex-col items-center text-center">
                                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center mb-3 shadow-lg`}>
                                    <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                                </div>
                                <h3 className="font-bold text-sm">{title}</h3>
                                <p className="text-xs text-on-surface-variant mt-1">{desc}</p>
                            </div>
                        ))}
                        <div className="flex-none w-44 glass-panel p-5 rounded-2xl flex flex-col items-center text-center opacity-40 grayscale">
                            <div className="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center mb-3">
                                <span className="material-symbols-outlined text-on-surface-variant text-2xl">lock</span>
                            </div>
                            <h3 className="font-bold text-sm">Lending Titan</h3>
                            <p className="text-xs text-on-surface-variant mt-1">Lend 10+ items</p>
                        </div>
                    </div>
                </section>

                {/* Recent Activity */}
                <section className="px-6 max-w-7xl mx-auto mt-12 mb-24">
                    <h2 className="font-headline text-2xl font-bold mb-6 flex items-center gap-2">
                        <span className="w-8 h-1 bg-tertiary rounded-full"></span> Recent Activity
                    </h2>
                    {recentActivity.length > 0 ? (
                        <div className="glass-panel rounded-2xl divide-y divide-white/5 overflow-hidden">
                            {recentActivity.map((req) => {
                                const isBorrowing = req.borrower?._id === currentUser?._id || req.borrower?._id === 'current-user';
                                return (
                                    <div key={req._id} className="p-5 flex items-center justify-between hover:bg-white/5 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-primary">{isBorrowing ? 'download' : 'upload'}</span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{isBorrowing ? 'Borrowed' : 'Lent'} {req.item?.title}</p>
                                                <p className="text-xs text-on-surface-variant">{isBorrowing ? req.lender?.name : req.borrower?.name}</p>
                                            </div>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full ${req.status === 'completed' ? 'text-emerald-400 bg-emerald-400/10' : req.status === 'pending' ? 'text-amber-400 bg-amber-400/10' : 'text-blue-400 bg-blue-400/10'}`}>
                                            {req.status}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="glass-panel rounded-2xl p-8 text-center text-on-surface-variant">
                            <span className="material-symbols-outlined text-4xl mb-2 block">inbox</span>
                            No activity yet. Start by browsing items!
                        </div>
                    )}
                    <Link to="/requests" className="block w-full mt-4 py-4 rounded-xl border border-white/5 text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all text-sm font-medium text-center">
                        View Full Activity →
                    </Link>
                </section>
            </main>

            {/* Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 bg-[#0f1930]/70 backdrop-blur-2xl rounded-t-[1.5rem] z-50 shadow-[0_-10px_40px_rgba(190,131,250,0.15)]">
                <Link to="/dashboard" className="flex flex-col items-center text-[#dee5ff]/50 px-4 py-2 hover:bg-white/5 rounded-xl transition-all">
                    <span className="material-symbols-outlined">home</span><span className="font-headline text-[10px] uppercase tracking-[0.05em] mt-1">Home</span>
                </Link>
                <Link to="/add-item" className="flex flex-col items-center text-[#dee5ff]/50 px-4 py-2 hover:bg-white/5 rounded-xl transition-all">
                    <span className="material-symbols-outlined">add_circle</span><span className="font-headline text-[10px] uppercase tracking-[0.05em] mt-1">Add</span>
                </Link>
                <Link to="/chat" className="flex flex-col items-center text-[#dee5ff]/50 px-4 py-2 hover:bg-white/5 rounded-xl transition-all">
                    <span className="material-symbols-outlined">chat_bubble</span><span className="font-headline text-[10px] uppercase tracking-[0.05em] mt-1">Chat</span>
                </Link>
                <Link to="/requests" className="flex flex-col items-center text-[#dee5ff]/50 px-4 py-2 hover:bg-white/5 rounded-xl transition-all">
                    <span className="material-symbols-outlined">explore</span><span className="font-headline text-[10px] uppercase tracking-[0.05em] mt-1">Activity</span>
                </Link>
                <button className="flex flex-col items-center bg-gradient-to-b from-[#192540] to-[#0f1930] text-[#9fa7ff] rounded-xl px-4 py-2 border border-white/5 transition-all">
                    <span className="material-symbols-outlined">person</span><span className="font-headline text-[10px] uppercase tracking-[0.05em] mt-1">Profile</span>
                </button>
            </nav>
        </div>
    );
};

export default Profile;
