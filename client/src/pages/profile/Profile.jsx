import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import itemService from '../../services/itemService';
import requestService from '../../services/requestService';
import { Link } from 'react-router-dom';
import Cropper from 'react-easy-crop';

const Profile = () => {
    const { currentUser, updateProfile } = useAuth();
    const [myItems, setMyItems] = useState([]);
    const [borrowingRequests, setBorrowingRequests] = useState([]);
    const [lendingRequests, setLendingRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('postings');
    
    // Avatar Upload States
    const [image, setImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [showCropper, setShowCropper] = useState(false);
    const [uploading, setUploading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [items, borrowing, lending] = await Promise.all([
                itemService.getMyItems(),
                requestService.getMyRequests('borrowing'),
                requestService.getMyRequests('lending')
            ]);
            setMyItems(items);
            setBorrowingRequests(borrowing);
            setLendingRequests(lending);
        } catch (error) {
            console.error('Error fetching profile data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.onload = () => {
                setImage(reader.result);
                setShowCropper(true);
            };
        }
    };

    const createImage = (url) =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (error) => reject(error));
            image.setAttribute('crossOrigin', 'anonymous');
            image.src = url;
        });

    const getCroppedImg = async (imageSrc, pixelCrop) => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        const ctx = canvas.getContext('2d');

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
        setUploading(true);
        try {
            const croppedBlob = await getCroppedImg(image, croppedAreaPixels);
            const file = new File([croppedBlob], "avatar.jpg", { type: "image/jpeg" });
            
            // 1. Upload to Cloudinary
            const imageUrl = await itemService.uploadImage(file);
            
            // 2. Update Backend Profile
            await updateProfile({ avatar: imageUrl });
            
            setShowCropper(false);
            setImage(null);
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleUpdateStatus = async (requestId, status) => {
        try {
            await requestService.updateStatus(requestId, status);
            fetchData();
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    if (!currentUser) return null;

    const userInitial = currentUser.name?.charAt(0).toUpperCase() || '?';

    return (
        <div className="min-h-screen pt-24 pb-32 px-6 max-w-6xl mx-auto space-y-12">
            {/* Header / Profile Card */}
            <div className="flex flex-col md:flex-row items-center gap-8 bg-surface-container/30 backdrop-blur-xl p-10 rounded-[3rem] border border-outline-variant/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -z-10"></div>
                
                {/* Profile Image Section */}
                <div className="relative group">
                    <div className="w-40 h-40 rounded-full border-4 border-primary/20 p-1 bg-surface-container flex items-center justify-center overflow-hidden">
                        {currentUser.avatar ? (
                            <img 
                                src={currentUser.avatar} 
                                alt={currentUser.name} 
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            <span className="text-6xl font-black text-primary/40">{userInitial}</span>
                        )}
                    </div>
                    
                    <label className="absolute bottom-1 right-1 bg-primary text-on-primary p-2.5 rounded-full cursor-pointer shadow-xl hover:scale-110 active:scale-90 transition-all z-20">
                        <span className="material-symbols-outlined text-lg">photo_camera</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>

                    {showCropper && (
                        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 sm:p-10">
                            <h2 className="text-white text-2xl font-black mb-8 uppercase tracking-widest">Adjust Profile Photo</h2>
                            <div className="relative w-full max-w-xl aspect-square bg-surface-container/10 rounded-[3rem] overflow-hidden">
                                <Cropper
                                    image={image}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                    cropShape="round"
                                />
                            </div>
                            <div className="w-full max-w-xs mt-10 space-y-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-white/50 text-[10px] items-center font-bold uppercase tracking-widest">
                                        <span>Zoom</span>
                                        <span>{Math.round(zoom * 100)}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        value={zoom}
                                        min={1}
                                        max={3}
                                        step={0.1}
                                        onChange={(e) => setZoom(e.target.value)}
                                        className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary"
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => setShowCropper(false)}
                                        className="flex-1 py-4 text-white/50 font-bold uppercase tracking-widest text-xs hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleUpload}
                                        disabled={uploading}
                                        className="flex-[2] py-4 bg-primary text-on-primary rounded-2xl font-bold uppercase tracking-widest text-xs shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                                    >
                                        {uploading ? 'Saving...' : 'Set Profile Photo'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex-1 text-center md:text-left space-y-2">
                    <h1 className="text-4xl font-headline font-black text-on-surface tracking-tighter">{currentUser.name}</h1>
                    <p className="text-secondary font-label text-xs tracking-[0.3em] uppercase font-black opacity-60">ID: {currentUser.email?.split('@')[0] || 'Member'}</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-8">
                        <StatCard val={myItems.length} label="Postings" color="text-primary" />
                        <StatCard val={lendingRequests.filter(r => r.status === 'completed').length} label="Lent" color="text-secondary" />
                        <StatCard val={currentUser.trustScore || '4.9'} label="Trust" color="text-tertiary" />
                    </div>
                </div>
                <Link to="/add-item" className="px-8 py-4 bg-surface-container-highest/40 text-on-surface border border-outline-variant/10 rounded-2xl font-bold shadow-xl hover:bg-primary hover:text-on-primary transition-all active:scale-95 flex items-center gap-2 group">
                    <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">add</span> New Post
                </Link>
            </div>

            {/* List Body (Tabs & Items) */}
            <div className="space-y-8">
                <div className="flex gap-6 border-b border-outline-variant/5">
                    {['postings', 'lending', 'borrowing'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === tab ? 'text-primary' : 'text-on-surface-variant/30'}`}
                        >
                            {tab}
                            {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary"></div>}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    {loading ? (
                        [1,2,3].map(i => <div key={i} className="h-28 bg-surface-container/20 rounded-[2rem] animate-pulse"></div>)
                    ) : (
                        <TabContent 
                            activeTab={activeTab} 
                            data={{ myItems, lendingRequests, borrowingRequests }} 
                            onUpdate={handleUpdateStatus} 
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ val, label, color }) => (
    <div className="bg-surface-container/40 px-6 py-4 rounded-3xl border border-outline-variant/5 text-center min-w-[100px]">
        <span className={`block text-2xl font-black ${color} leading-none mb-1`}>{val}</span>
        <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">{label}</span>
    </div>
);

const TabContent = ({ activeTab, data, onUpdate }) => {
    const { myItems, lendingRequests, borrowingRequests } = data;
    
    if (activeTab === 'postings') {
        return myItems.length === 0 ? <p className="text-center py-20 text-on-surface-variant/40 italic">Nothing posted yet...</p> : 
            myItems.map(item => (
                <div key={item._id} className="group flex items-center gap-6 p-5 bg-surface-container/20 rounded-[2.5rem] border border-outline-variant/10 hover:bg-surface-container/40 transition-all">
                    <img src={item.image} className="w-20 h-20 rounded-[1.5rem] object-cover" alt="" />
                    <div className="flex-1">
                        <h3 className="font-bold text-on-surface group-hover:text-primary transition-colors">{item.title}</h3>
                        <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-50">{item.category}</p>
                    </div>
                </div>
            ));
    }

    if (activeTab === 'lending') {
        return lendingRequests.length === 0 ? <p className="text-center py-20 text-on-surface-variant/40 italic">No incoming requests.</p> :
            lendingRequests.map(req => (
                <div key={req._id} className="p-6 bg-surface-container/20 rounded-[2.5rem] border border-outline-variant/10 flex flex-col sm:flex-row items-center gap-6">
                    <div className="flex items-center gap-4 flex-1">
                        <img src={req.item?.image} className="w-16 h-16 rounded-2xl object-cover" alt="" />
                        <div>
                            <h3 className="font-bold text-on-surface text-sm">{req.item?.title}</h3>
                            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-black opacity-50">From: {req.borrower?.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {req.status === 'pending' && (
                            <div className="flex gap-2">
                                <button onClick={() => onUpdate(req._id, 'accepted')} className="px-5 py-2.5 bg-tertiary/20 text-tertiary rounded-xl text-[10px] font-black uppercase tracking-widest border border-tertiary/30 hover:bg-tertiary transition-colors hover:text-on-tertiary">Accept</button>
                                <button onClick={() => onUpdate(req._id, 'rejected')} className="px-5 py-2.5 bg-red-500/20 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-500/30 hover:bg-red-500 transition-colors hover:text-white">Reject</button>
                            </div>
                        )}
                        {req.status === 'accepted' && (
                            <button onClick={() => onUpdate(req._id, 'completed')} className="px-5 py-2.5 bg-secondary/20 text-secondary rounded-xl text-[10px] font-black uppercase tracking-widest border border-secondary/30 hover:bg-secondary transition-colors hover:text-on-secondary">Mark Returned</button>
                        )}
                        <span className="px-4 py-1.5 bg-surface-container text-[8px] font-black rounded-full uppercase tracking-widest border border-outline-variant/10">{req.status}</span>
                    </div>
                </div>
            ));
    }

    return borrowingRequests.length === 0 ? <p className="text-center py-20 text-on-surface-variant/40 italic">No items borrowed.</p> :
        borrowingRequests.map(req => (
            <div key={req._id} className="p-6 bg-surface-container/20 rounded-[2.5rem] border border-outline-variant/10 flex items-center gap-6">
                <img src={req.item?.image} className="w-16 h-16 rounded-2xl object-cover" alt="" />
                <div className="flex-1">
                    <h3 className="font-bold text-on-surface text-sm">{req.item?.title}</h3>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-black opacity-50">Owner: {req.lender?.name}</p>
                </div>
                <span className="px-4 py-1.5 bg-surface-container text-[8px] font-black rounded-full uppercase tracking-widest border border-outline-variant/10">{req.status}</span>
            </div>
        ));
};

export default Profile;
