"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, role } = useAuth();
  
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) {
      setDarkMode(true);
    }
  }, []);

  /* ---------- AUTH PROTECTION ---------- */
  useEffect(() => {
    if (!loading) {
      if (!user && pathname !== "/login") {
        router.replace("/login");
      }
      if (user && pathname === "/login") {
        router.replace("/");
      }
    }
  }, [user, loading, pathname, router]);

  /* ---------- TOGGLE THEME ---------- */
  const toggleTheme = () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  /* ---------- SIGN OUT ---------- */
  const handleSignOut = async () => {
    try {
      
      await signOut(auth);
    } catch (error) {
      console.error("Sign out error", error);
    }
  };

  if (pathname === "/login") {
    return <main>{children}</main>;
  }

  return (
    <>
      {/* THEME BUTTON */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 p-3 rounded-full bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 z-[100] text-2xl hover:scale-110 transition-transform"
        title="Toggle Theme"
      >
        {darkMode ? "🌙" : "☀️"}
      </button>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          
          <div className="grid grid-cols-3 h-16 items-center">
            
            {/* COL 1: BRAND (Align Left) */}
            <div className="flex items-center justify-start gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 20V16" />
                  <path d="M12 20V10" />
                  <path d="M18 20V4" />
                </svg>
              </div>
              <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                FinHub
              </span>
            </div>

            {/* COL 2: LINKS (Align Center) */}
            <div className="hidden md:flex justify-center space-x-8">
              <Link href="/" className={`font-medium transition-colors ${pathname === "/" ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400 hover:text-blue-500"}`}>
                Crypto 
              </Link>
              <Link href="/stocks" className={`font-medium transition-colors ${pathname === "/stocks" ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400 hover:text-blue-500"}`}>
                Stocks 
              </Link>
              <Link href="/forex" className={`font-medium transition-colors ${pathname === "/forex" ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400 hover:text-blue-500"}`}>
                Forex 
              </Link>
            </div>

            {/* COL 3: AUTH (Align Right) */}
            <div className="flex justify-end items-center gap-4">
              {role === "admin" && (
                <Link href="/admin" className="hidden md:block font-bold text-sm text-red-500 mr-4">
                  Admin
                </Link>
              )}
              
              {user && (
                <button onClick={handleSignOut} className="hidden md:block text-sm font-bold text-red-500 hover:text-red-600 transition">
                  Sign Out
                </button>
              )}
            </div>
          </div>

          {/* MOBILE NAV */}
          <div className="md:hidden flex justify-around py-3 border-t border-gray-100 dark:border-gray-800">
            <Link href="/" className="font-medium text-sm">Crypto</Link>
            <Link href="/stocks" className="font-medium text-sm">Stocks</Link>
            <Link href="/forex" className="font-medium text-sm">Forex</Link>
            
            {/* ADMIN LINK - Only visible if role is 'admin' */}
{role === "admin" && (
  <Link 
    href="/admin" 
    className={`font-bold transition-colors ${
      pathname === "/admin" 
        ? "text-red-600 dark:text-red-400" 
        : "text-red-500 hover:text-red-700"
    }`}
  >
    Admin Panel 
  </Link>
)}
            
            {user && (
              <button onClick={handleSignOut} className="text-sm font-bold text-red-500">Exit</button>
            )}
          </div>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      {children}
    </>
  );
}