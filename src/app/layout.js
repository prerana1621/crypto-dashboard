"use client";
import "./globals.css";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation'; // Added Hooks

export default function RootLayout({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Auth State
  const pathname = usePathname(); // Get current URL
  const router = useRouter();

  // 1. Check Auth & Theme on Load
  useEffect(() => {
    // Theme Check
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Auth Check
    const auth = localStorage.getItem('isAuthenticated');
    setIsLoggedIn(!!auth);

    // PROTECTED ROUTE LOGIC
    // If NOT logged in, and NOT on login page -> Kick to Login
    if (!auth && pathname !== '/login') {
      router.push('/login');
    }
  }, [pathname, router]);

  // 2. Toggle Theme
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

  // 3. Logout Function
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsLoggedIn(false);
    router.push('/login');
  };

  // HIDE NAVBAR ON LOGIN PAGE
  if (pathname === '/login') {
    return (
      <html lang="en">
        <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 min-h-screen">
          {children}
        </body>
      </html>
    );
  }

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
              
              {/* BRANDING */}
              <div className="flex items-center gap-2 select-none cursor-default">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-md">
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                     <path d="M12 20V10" />
                     <path d="M18 20V4" />
                     <path d="M6 20v-4" />
                   </svg>
                </div>
                <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 tracking-tight">
                  FinHub
                </span>
              </div>

              {/* Centered Links */}
              <div className="hidden md:flex space-x-8 mr-12">
                <Link href="/" className={`font-medium transition py-1 relative group ${pathname === '/' ? 'text-blue-600 dark:text-blue-400' : 'hover:text-blue-500'}`}>
                  Crypto ₿
                </Link>
                <Link href="/stocks" className={`font-medium transition py-1 relative group ${pathname === '/stocks' ? 'text-blue-600 dark:text-blue-400' : 'hover:text-blue-500'}`}>
                  Stocks 📈
                </Link>
                <Link href="/forex" className={`font-medium transition py-1 relative group ${pathname === '/forex' ? 'text-blue-600 dark:text-blue-400' : 'hover:text-blue-500'}`}>
                  Forex 🌍
                </Link>
              </div>

              {/* LOGOUT BUTTON (Visible because we are logged in) */}
              <button 
                onClick={handleLogout}
                className="hidden md:block text-sm font-bold text-red-500 hover:text-red-600 transition"
              >
                Sign Out
              </button>

            </div>
            
            {/* Mobile Menu */}
            <div className="md:hidden flex justify-around py-3 border-t border-gray-100 dark:border-gray-800 text-sm font-medium">
                <Link href="/">Crypto</Link>
                <Link href="/stocks">Stocks</Link>
                <Link href="/forex">Forex</Link>
                <button onClick={handleLogout} className="text-red-500">Exit</button>
            </div>
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}