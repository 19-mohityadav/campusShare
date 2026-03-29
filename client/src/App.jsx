import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Lazy-loaded pages
const Landing = lazy(() => import('./pages/auth/Landing'));
const Login = lazy(() => import('./pages/auth/Login'));
const Signup = lazy(() => import('./pages/auth/Signup'));
const Onboarding = lazy(() => import('./pages/auth/Onboarding'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const ItemDetails = lazy(() => import('./pages/items/ItemDetails'));
const AddItem = lazy(() => import('./pages/items/AddItem'));
const ActivityPage = lazy(() => import('./pages/activity/ActivityPage'));
const ChatPage = lazy(() => import('./pages/chat/ChatPage'));
const Profile = lazy(() => import('./pages/users/Profile'));

// Full-screen loader
const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#060e20' }}>
        <div className="flex flex-col items-center gap-4">
            <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-primary/20 animate-spin border-t-primary"></div>
            </div>
            <p className="text-on-surface-variant text-sm font-label uppercase tracking-widest animate-pulse">CampusShare</p>
        </div>
    </div>
);

const ProtectedRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();
    if (loading) return <PageLoader />;
    if (!currentUser) return <Navigate to="/login" replace />;
    return children;
};

const LandingLayout = () => (
    <div className="bg-background text-on-surface min-h-screen">
        <Navbar />
        <Landing />
        <Footer />
    </div>
);

function AppRoutes() {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                {/* Public */}
                <Route path="/" element={<LandingLayout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/onboarding" element={<Onboarding />} />

                {/* Protected */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/items/:id" element={<ProtectedRoute><ItemDetails /></ProtectedRoute>} />
                <Route path="/add-item" element={<ProtectedRoute><AddItem /></ProtectedRoute>} />
                <Route path="/requests" element={<ProtectedRoute><ActivityPage /></ProtectedRoute>} />
                <Route path="/activity" element={<ProtectedRoute><ActivityPage /></ProtectedRoute>} />
                <Route path="/chat/:id" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
                <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    );
}

function App() {
    return (
        <ToastProvider>
            <AuthProvider>
                <Router>
                    <AppRoutes />
                </Router>
            </AuthProvider>
        </ToastProvider>
    );
}

export default App;
