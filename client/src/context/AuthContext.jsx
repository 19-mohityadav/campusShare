import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize currentUser from localStorage
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  // Login a user
  const login = async (userData) => {
    const user = await authService.login(userData);
    setCurrentUser(user);
    return user;
  };

  // Register a new user
  const register = async (userData) => {
    const user = await authService.register(userData);
    setCurrentUser(user);
    return user;
  };

  // Send OTP
  const sendOTP = (identifier) => {
    return authService.sendOTP(identifier);
  };

  // Verify OTP
  const verifyOTP = async (identifier, otp) => {
    const user = await authService.verifyOTP(identifier, otp);
    setCurrentUser(user);
    return user;
  };

  // Logout a user
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  // Update a user's profile
  const updateProfile = async (userData) => {
    const updatedUser = await authService.updateProfile(userData);
    setCurrentUser(prevUser => ({ ...prevUser, ...updatedUser }));
    return updatedUser;
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    updateProfile,
    sendOTP,
    verifyOTP
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
