"use client";
import "./globals.css";
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function RootLayout({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  // 1. Check Theme on Load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // 2. Toggle Function
  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
    }
  };

  return (
    <html lang="en">
      <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 min-h-screen">
        
        {/* GLOBAL FLOATING THEME BUTTON */}
        <button 
          onClick={toggleTheme}
          className="fixed top-6 right-6 p-3 rounded-full bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 hover:scale-110 transition z-[100] text-2xl"
          title="Toggle Dark Mode"
        >
          {darkMode ? '🌙' : '☀️'}
        </button>

        {/* NAVIGATION BAR */}
        <nav className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              
              {/* BRANDING (Attractive & Not Clickable) */}
              <div className="flex items-center gap-2 select-none cursor-default">
                {/* The Logo Icon */}
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-md">
                   {/* Simple "Chart" Graphic in White */}
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                     <path d="M12 20V10" />
                     <path d="M18 20V4" />
                     <path d="M6 20v-4" />
                   </svg>
                </div>
                {/* The Text */}
                <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 tracking-tight">
                  FinHub
                </span>
              </div>

              {/* Centered Links */}
              <div className="hidden md:flex space-x-8 mr-12">
                <Link href="/" className="font-medium hover:text-blue-500 transition py-1 relative group">
                  Crypto ₿
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full"></span>
                </Link>
                <Link href="/stocks" className="font-medium hover:text-blue-500 transition py-1 relative group">
                  Stocks 📈
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full"></span>
                </Link>
                <Link href="/forex" className="font-medium hover:text-blue-500 transition py-1 relative group">
                  Forex 🌍
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full"></span>
                </Link>
              </div>
            </div>
            
            {/* Mobile Menu (Bottom Row) */}
            <div className="md:hidden flex justify-around py-3 border-t border-gray-100 dark:border-gray-800 text-sm font-medium">
                <Link href="/" className="p-2 text-gray-600 dark:text-gray-300">Crypto</Link>
                <Link href="/stocks" className="p-2 text-gray-600 dark:text-gray-300">Stocks</Link>
                <Link href="/forex" className="p-2 text-gray-600 dark:text-gray-300">Forex</Link>
            </div>
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}