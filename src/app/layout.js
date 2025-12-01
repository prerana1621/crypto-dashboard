"use client";
import "./globals.css";
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function RootLayout({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  // 1. Check Theme on Load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    // Default to dark mode if saved or if system is dark
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
        
        {/* GLOBAL FLOATING THEME BUTTON (Visible on ALL pages) */}
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
              {/* Logo */}
              <Link href="/" className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 cursor-pointer">
                FinHub
              </Link>

              {/* Centered Links */}
              <div className="hidden md:flex space-x-8 mr-12">
                <Link href="/" className="font-medium hover:text-blue-500 transition py-1">Crypto ₿</Link>
                <Link href="/stocks" className="font-medium hover:text-blue-500 transition py-1">Stocks 📈</Link>
                <Link href="/forex" className="font-medium hover:text-blue-500 transition py-1">Forex 🌍</Link>
              </div>
            </div>
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}