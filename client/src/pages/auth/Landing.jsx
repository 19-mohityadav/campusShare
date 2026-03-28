import React from 'react'
import { Link } from 'react-router-dom'

const Landing = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-6xl font-black bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
        CampusShare
      </h1>
      <p className="mt-4 text-zinc-400 text-lg max-w-xl">
        Share, borrow, and connect with your campus community. The smarter way to manage academic resources.
      </p>
      <div className="mt-8 flex gap-4">
        <Link to="/login" className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-full font-bold transition-all shadow-lg shadow-indigo-500/20">
          Get Started
        </Link>
        <Link to="/signup" className="px-8 py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-full font-bold transition-all">
          Sign Up
        </Link>
      </div>
    </div>
  )
}

export default Landing
