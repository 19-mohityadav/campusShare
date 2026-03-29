import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import itemService from '../../services/itemService';

const CATEGORIES = ['Books', 'Calculator', 'Lab Tools', 'Electronics', 'Gadgets', 'Essentials', 'Other'];

const AddItem = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const toast = useToast();

    const [form, setForm] = useState({
        title: '',
        description: '',
        category: '',
        location: '',
        availability: '',
        image: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image must be less than 5MB');
            return;
        }
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.title || !form.description || !form.category || !form.location) {
            toast.error('Please fill all required fields');
            return;
        }

        setLoading(true);

        try {
            // Upload image first if provided
            let imageUrl = form.image;
            if (imageFile) {
                setUploading(true);
                imageUrl = await itemService.uploadImage(imageFile);
                setUploading(false);
            }

            // Use a placeholder if no image
            if (!imageUrl) {
                imageUrl = `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400`;
            }

            const itemToCreate = {
                title: form.title,
                description: form.description,
                category: form.category,
                location: form.location,
                availability: form.availability,
                image: imageUrl
            };

            await itemService.createItem(itemToCreate);

            toast.success('Item listed successfully! 🎉');
            navigate('/dashboard');
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to add item';
            toast.error(msg);
        } finally {
            setLoading(false);
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen text-on-surface font-body" style={{ background: 'radial-gradient(circle at 0% 0%, #0f1930 0%, #060e20 60%)' }}>
            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-[#060e20]/80 backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center justify-between px-6 py-4 max-w-2xl mx-auto">
                    <button onClick={() => navigate(-1)} className="text-on-surface-variant hover:text-on-surface transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="font-headline text-xl font-bold text-on-surface">List an Item</h1>
                    <div className="w-8"></div>
                </div>
            </header>

            {/* Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[10%] left-[-10%] w-[35%] h-[35%] bg-secondary/5 rounded-full blur-[100px]"></div>
            </div>

            <main className="pt-24 pb-12 px-6 max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Image Upload */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Item Photo</label>
                        <div
                            className="relative group w-full aspect-video rounded-2xl overflow-hidden border-2 border-dashed border-outline-variant/30 hover:border-primary/50 transition-colors cursor-pointer bg-surface-container/30"
                            onClick={() => document.getElementById('imageInput').click()}
                        >
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full gap-3 py-12">
                                    <span className="material-symbols-outlined text-4xl text-primary/60">add_photo_alternate</span>
                                    <p className="text-on-surface-variant text-sm">Click to upload photo</p>
                                    <p className="text-on-surface-variant/50 text-xs">Max 5MB • JPG, PNG, WebP</p>
                                </div>
                            )}
                            {imagePreview && (
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="material-symbols-outlined text-white text-3xl">edit</span>
                                </div>
                            )}
                        </div>
                        <input id="imageInput" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        <p className="text-xs text-on-surface-variant/60">Or paste an image URL below</p>
                        <input
                            type="url"
                            placeholder="https://example.com/image.jpg"
                            className="w-full bg-surface-container-highest/40 border-none rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/40 outline-none text-sm"
                            value={form.image}
                            onChange={(e) => {
                                setForm({ ...form, image: e.target.value });
                                if (e.target.value) setImagePreview(e.target.value);
                            }}
                        />
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Item Title *</label>
                        <input
                            required
                            type="text"
                            placeholder="e.g. Scientific Calculator, Physics Book..."
                            className="w-full bg-surface-container-highest/40 border-none rounded-xl px-4 py-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/40 outline-none"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Description *</label>
                        <textarea
                            required
                            rows={3}
                            placeholder="Describe the item condition, usage, and any important notes..."
                            className="w-full bg-surface-container-highest/40 border-none rounded-xl px-4 py-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/40 outline-none resize-none"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Category *</label>
                        <div className="grid grid-cols-3 gap-3">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setForm({ ...form, category: cat })}
                                    className={`py-3 rounded-xl text-sm font-bold transition-all ${form.category === cat ? 'bg-primary/25 border-primary/50 text-primary border' : 'bg-surface-container/40 border border-outline-variant/15 text-on-surface-variant hover:border-primary/30'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Pickup Location *</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">location_on</span>
                            <input
                                required
                                type="text"
                                placeholder="e.g. Hostel Block B, Library Gate..."
                                className="w-full bg-surface-container-highest/40 border-none rounded-xl pl-12 pr-4 py-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/40 outline-none"
                                value={form.location}
                                onChange={(e) => setForm({ ...form, location: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Availability */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Availability</label>
                        <input
                            type="text"
                            placeholder="e.g. Available this week, Weekdays only, After 5PM..."
                            className="w-full bg-surface-container-highest/40 border-none rounded-xl px-4 py-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/40 outline-none"
                            value={form.availability}
                            onChange={(e) => setForm({ ...form, availability: e.target.value })}
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-gradient-to-r from-primary to-secondary rounded-2xl font-headline font-bold text-on-primary text-lg shadow-[0_10px_30px_rgba(159,167,255,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:pointer-events-none"
                    >
                        {uploading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                </svg>
                                Uploading Image...
                            </span>
                        ) : loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                </svg>
                                Listing Item...
                            </span>
                        ) : '+ List This Item'}
                    </button>
                </form>
            </main>
        </div>
    );
};

export default AddItem;
