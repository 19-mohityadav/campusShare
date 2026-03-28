import React from 'react'
import { Home, Search, MessageSquare, User, Settings, Info, LogOut } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const Sidebar = () => {
  const location = useLocation()
  
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Search, label: 'Discovery', path: '/explore' },
    { icon: MessageSquare, label: 'Messages', path: '/chat' },
    { icon: User, label: 'Profile', path: '/profile' },
  ]

  return (
    <aside className="hidden md:flex flex-col w-64 bg-zinc-950 border-r border-zinc-900 px-4 py-8">
      <div className="px-4 mb-12">
        <h2 className="text-2xl font-black bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">CampusShare</h2>
      </div>
      
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              location.pathname === item.path 
                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-500/5' 
                : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
      
      <div className="pt-8 mt-8 border-t border-zinc-900 space-y-2">
        <button className="flex items-center gap-3 w-full px-4 py-3 text-zinc-500 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
