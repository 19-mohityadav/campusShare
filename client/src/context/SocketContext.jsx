import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { currentUser } = useAuth();

    useEffect(() => {
        if (!currentUser) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
            return;
        }

        // Just mock the socket setup for the hackathon MVP if backend socket isn't running fully
        // or actually connect if we have it
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        
        try {
            const newSocket = io(API_URL, {
                query: { userId: currentUser._id },
                autoConnect: false // We will manually connect
            });

            // For now let's just create a dummy object so we don't crash on emitting events
            setSocket(newSocket);
        } catch (err) {
            console.warn("Socket connection unavailable");
            // Dummy socket fallback
            setSocket({
                on: () => {},
                off: () => {},
                emit: () => {},
                disconnect: () => {}
            });
        }

        return () => {
            if (socket) socket.disconnect();
        };
    }, [currentUser]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketContext;
