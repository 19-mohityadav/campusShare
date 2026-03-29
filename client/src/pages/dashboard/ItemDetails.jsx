import React from 'react'
import { useParams } from 'react-router-dom'

const ItemDetails = () => {
    const { id } = useParams()
    return (
        <div className="flex flex-col gap-10 max-w-7xl mx-auto py-12 px-6">
            <header className="flex items-center gap-4 text-xs font-label uppercase tracking-widest text-[#9fa7ff] font-extrabold">
                Browse Items <span className="text-[#40485d]">/</span> ITEM_{id || 'NOT_FOUND'}
            </header>
            
            <div className="flex flex-col lg:flex-row gap-16 item-start">
                <main className="flex-1 space-y-10">
                    <div className="aspect-video bg-surface-container-highest rounded-3xl overflow-hidden shadow-2xl saturate-150 brightness-110">
                        {/* Image Placeholder */}
                    </div>
                </main>
                <aside className="w-full lg:w-[420px] shrink-0 sticky top-32 glass-card p-10 border border-outline-variant/15 rounded-3xl shadow-2xl backdrop-blur-3xl transition-all">
                    <h2 className="text-4xl font-headline font-bold text-on-surface mb-4">Item Title Here</h2>
                    <p className="text-on-surface-variant font-body mb-10 leading-relaxed">Detailed description for the item goes here. Inform about condition, availability, etc.</p>
                    <button className="w-full bg-gradient-to-r from-primary to-secondary text-surface font-black py-4 rounded-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
                        Request to Borrow
                    </button>
                </aside>
            </div>
        </div>
    )
}

export default ItemDetails
