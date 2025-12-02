'use client';

import { ChatModal } from "@/components/chat-modal";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Accor Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* ALL Logo */}
            <div className="flex items-center">
              <svg className="h-8" viewBox="0 0 120 60" fill="none">
                <text x="10" y="40" fontFamily="Arial, sans-serif" fontSize="32" fontWeight="bold" fill="#1a1a1a">ALL</text>
                <text x="10" y="52" fontFamily="Arial, sans-serif" fontSize="8" fill="#1a1a1a">ACCOR</text>
              </svg>
            </div>
            <nav className="hidden md:flex gap-6 text-sm">
              <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">Stay</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">Loyalty program</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">Deals</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">Our partners</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">Activities</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">Meeting & Events</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">Professionals</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm text-gray-700 hover:text-gray-900">EN</button>
            <button className="text-sm text-gray-700 hover:text-gray-900">USD ($US)</button>
            <button className="px-6 py-2 rounded-full bg-[#1a1a4d] text-white text-sm font-medium hover:bg-[#15153d] transition-colors">
              Sign in / Sign up
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Hero Section with Search */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">
              Welcome to ALL, book at the best price
            </h1>

            {/* Search Box */}
            <div className="bg-white rounded-full shadow-lg p-4 flex items-center gap-4 mb-8">
              <div className="flex-1 flex items-center gap-2 px-4 border-r border-gray-200">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <div className="flex-1">
                  <div className="text-sm text-gray-600">Where do you want to travel? <span className="text-gray-400">(mandatory)</span></div>
                  <input type="text" placeholder="Destination, hotel name" className="w-full text-gray-900 outline-none" />
                </div>
              </div>

              <div className="flex-1 flex items-center gap-2 px-4 border-r border-gray-200">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div className="flex-1">
                  <div className="text-sm text-gray-600">When do you arrive?</div>
                  <div className="flex items-center gap-2 text-gray-900">
                    <span>December 01</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                    <span>December 02</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 px-4">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div className="flex-1">
                  <div className="text-sm text-gray-600">Rooms & Guests</div>
                  <div className="text-gray-900">1 Room(s) - 1 Guest(s)</div>
                </div>
              </div>

              <button className="px-8 py-3 rounded-full bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors">
                Search
              </button>
            </div>

            <div className="text-center mb-8">
              <button className="text-teal-600 hover:text-teal-700 text-sm flex items-center gap-1 mx-auto">
                Special rates
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Black Friday Banner */}
          <div className="relative rounded-lg overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&h=400&fit=crop"
              alt="ALL Accor Black Friday promotion"
              className="w-full h-[300px] object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-12">
              <h2 className="text-4xl font-bold text-white mb-4">ALL Accor Black Friday</h2>
              <p className="text-xl text-white mb-6">It's time to save—up to 40% off in the Americas!</p>
              <button className="px-8 py-3 rounded-full bg-white text-gray-900 font-medium hover:bg-gray-100 transition-colors w-fit">
                BOOK NOW
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Chat Modal */}
      <ChatModal />
    </div>
  );
}
