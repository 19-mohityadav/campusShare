import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Landing from '../pages/auth/Landing'
import Login from '../pages/auth/Login'
import Signup from '../pages/auth/Signup'
import MainLayout from '../components/layout/MainLayout'
import Dashboard from '../pages/dashboard/Dashboard'
import ItemDetails from '../pages/dashboard/ItemDetails'
import Profile from '../pages/profile/Profile'
import ChatPage from '../pages/chat/ChatPage'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/item/:id" element={<ItemDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chat" element={<ChatPage />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
