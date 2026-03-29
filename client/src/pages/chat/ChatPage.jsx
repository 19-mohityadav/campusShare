import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ChatPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    // Mock Directory for verification
    const mockChats = {
        "1": { name: "Raj", item: "Scientific Calculator", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBNXm2ykQL9wkxlf1kNHjSM1LDeDBDaknGm4yPYfh4MMC0ypA6E8FMNTPDitOTva0x8LWTLHOQf9Dc36vHsHU2ay4T9KxYJYGymgpjrrSHeyi-VjC3PDgk0eQxa9Lxrp3ngZ3MxaYCSyRkW-JXDOiS96rJusRjORm0jJwJG3zXQ_WN-vlidtMwTRuxWAZ10VEQ42ijEbmc2iafaSWRlYDb3a0MlqcdjOYviGymSq44jIxjuhajENBc6UCnyxiWRjnF1bT8Ut5K1C0g" },
        "2": { name: "Aman", item: "Drawing Kit", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBcdwcX5jDufwv9hdez8h5gHBzuGujzWG8sfQtZbhM67v4vJmvzEJzkPvWMvUrlZ1Q-3s0uYOuSamqndxDyybFjGxyKbh838rfV8KCYJ_y8bMrDiNENdkLOAE6zMPeVMrkZKFo-NXGwoqqL3xhTEu5wxvF82ltATu8jCSH1nc3gCKKgMb34IBmMrXGEOkSadhfecSWS85FTUkVZJ67YnRYAKpP3KBGNzkG-LRxjtOK8YXV8y9iFkZKJlXHG5FX6ZHOjKWk_0Fi3Aw4" }
    };

    const chatData = mockChats[id] || mockChats["1"];

    const [messages, setMessages] = useState([
        { id: 1, text: `Hi, is the ${chatData.item} available?`, sent: false, time: '10:42 AM' },
        { id: 2, text: 'Tomorrow evening 👍', sent: true, time: '10:45 AM' },
        { id: 3, text: 'Great, see you then!', sent: false, time: '10:46 AM' },
    ]);

    const sendMessage = () => {
        if (!message.trim()) return;
        setMessages(prev => [...prev, {
            id: Date.now(),
            text: message,
            sent: true,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setMessage('');
    };

    return (
        <div className="flex flex-col h-screen bg-[#060e20] text-[#dee5ff] font-body">
            {/* Background glows */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] -z-10 rounded-full"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 blur-[120px] -z-10 rounded-full"></div>

            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-[#060e20]/80 backdrop-blur-xl border-b border-[#40485d]/15 shadow-[0_20px_40px_rgba(190,131,250,0.1)] px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="text-primary hover:scale-105 transition-transform duration-300 active:scale-95">
                        <span className="material-symbols-outlined text-2xl">arrow_back</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            {chatData.avatar ? (
                                <img
                                    alt={`${chatData.name}'s Profile`}
                                    className="w-10 h-10 rounded-full object-cover border border-[#9fa7ff]/30"
                                    src={chatData.avatar}
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full border border-[#9fa7ff]/30 bg-surface-container flex items-center justify-center text-sm font-black text-primary">
                                    {chatData.name?.charAt(0).toUpperCase() || '?'}
                                </div>
                            )}
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-tertiary rounded-full border-2 border-[#060e20] shadow-[0_0_8px_#7de9ff]"></span>
                        </div>
                        <div>
                            <h1 className="font-headline font-bold text-lg leading-tight tracking-tight">{chatData.name}</h1>
                            <p className="text-[10px] font-label uppercase tracking-widest text-tertiary">Online</p>
                        </div>
                    </div>
                </div>

                <div className="hidden md:flex flex-col items-end">
                    <span className="text-[10px] font-label uppercase tracking-widest text-[#dee5ff]/50 mb-1">Inquiring About</span>
                    <div className="flex items-center gap-2 bg-surface-container-highest/40 px-3 py-1.5 rounded-full border border-outline-variant/15">
                        <span className="material-symbols-outlined text-[#9fa7ff] text-sm">inventory_2</span>
                        <span className="text-xs font-medium text-[#dee5ff]">{chatData.item}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="text-[#dee5ff]/70 hover:scale-105 transition-transform duration-300">
                        <span className="material-symbols-outlined">call</span>
                    </button>
                    <button className="text-[#dee5ff]/70 hover:scale-105 transition-transform duration-300">
                        <span className="material-symbols-outlined">more_vert</span>
                    </button>
                </div>
            </header>

            {/* Chat Messages */}
            <main className="flex-1 overflow-y-auto pt-24 pb-32 px-6 space-y-6 max-w-4xl mx-auto w-full">
                <div className="flex justify-center my-8">
                    <span className="px-4 py-1 rounded-full bg-surface-container-low text-[#dee5ff]/40 text-[10px] font-label uppercase tracking-widest border border-outline-variant/10">
                        Today
                    </span>
                </div>

                {messages.map(msg => (
                    msg.sent ? (
                        <div key={msg.id} className="flex flex-col items-end gap-1 max-w-[85%] ml-auto">
                            <div className="p-4 rounded-2xl rounded-tr-none shadow-[0_10px_30px_rgba(159,167,255,0.2)]" style={{ background: 'linear-gradient(135deg, #9fa7ff, #be83fa)' }}>
                                <p className="font-body text-sm leading-relaxed text-[#000a7b] font-medium">{msg.text}</p>
                            </div>
                            <div className="flex items-center gap-1 mr-1">
                                <span className="text-[10px] text-[#dee5ff]/30">{msg.time}</span>
                                <span className="material-symbols-outlined text-xs text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>done_all</span>
                            </div>
                        </div>
                    ) : (
                        <div key={msg.id} className="flex flex-col items-start gap-1 max-w-[85%]">
                            <div className="p-4 rounded-2xl rounded-tl-none border border-outline-variant/10 shadow-sm" style={{ background: 'rgba(64, 72, 93, 0.3)', backdropFilter: 'blur(10px)' }}>
                                <p className="font-body text-sm leading-relaxed text-[#dee5ff]">{msg.text}</p>
                            </div>
                            <span className="text-[10px] text-[#dee5ff]/30 ml-1">{msg.time}</span>
                        </div>
                    )
                ))}
            </main>

            {/* Input Bar */}
            <footer className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-surface via-surface/95 to-transparent">
                <div className="max-w-4xl mx-auto flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-surface-container-low/80 backdrop-blur-xl border border-outline-variant/15 p-1 rounded-2xl">
                        <button className="p-2 text-[#dee5ff]/60 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined">attach_file</span>
                        </button>
                        <button className="p-2 text-[#dee5ff]/60 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined">mood</span>
                        </button>
                    </div>
                    <div className="flex-1 relative">
                        <input
                            className="w-full bg-surface-container-high/50 backdrop-blur-xl border border-outline-variant/20 rounded-2xl py-3.5 px-5 text-sm font-body text-[#dee5ff] placeholder:text-[#dee5ff]/30 focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/40 transition-all duration-300 shadow-inner"
                            placeholder="Type message..."
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        />
                    </div>
                    <button
                        onClick={sendMessage}
                        className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-[0_10px_20px_rgba(159,167,255,0.3)] hover:scale-105 active:scale-90 transition-all duration-200"
                    >
                        <span className="material-symbols-outlined text-[#000a7b]" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default ChatPage;
