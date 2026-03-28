import React from 'react'
import { Link } from 'react-router-dom'
import { Search, Bell, UserCircle } from 'lucide-react'

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-900 shadow-xl shadow-zinc-950/20">
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="text-xl font-bold font-mono tracking-tighter text-indigo-400">
          CS_
        </Link>
        <div className="relative group min-w-[320px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 transition-colors group-focus-within:text-zinc-200" />
          <input 
            type="text" 
            placeholder="Search items, categories, or keywords..." 
            className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-zinc-700"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded-full transition-all">
          <Bell className="w-5 h-5" />
        </button>
        <Link to="/profile" className="flex items-center gap-2 p-1 pl-3 bg-zinc-900 border border-zinc-800 rounded-full hover:border-zinc-700 transition-all">
          <span className="text-xs font-medium text-zinc-300">My Profile</span>
          <UserCircle className="w-8 h-8 text-indigo-500" />
        </Link>
      </div>
    </nav>
  )
}

export default Navbar
