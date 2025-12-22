"use client";

import "./globals.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

/* ---------------- INNER LAYOUT ---------------- */
function LayoutContent({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, role } = useAuth();

  const [darkMode, setDarkMode] = useState(false);

  /* ---------- AUTH PROTECTION ---------- */
  useEffect(() => {
    if (!loading && !user && pathname !== "/login") {
      router.replace("/login");
    }

    if (!loading && user && pathname === "/login") {
      router.replace("/");
    }
  }, [user, loading, pathname, router]);

  /* ---------- THEME INIT ---------- */
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  /* ---------- TOGGLE THEME ---------- */
  const toggleTheme = () => {
    if (darkMode) {
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
      // freeze UI during sign-out
      document.body.style.pointerEvents = "none";
  
      await signOut(auth);
  
      // hard navigation prevents intermediate re-render
      window.location.href = "/login";
    } finally {
      document.body.style.pointerEvents = "auto";
    }
  };
  

  /* ---------- HIDE NAVBAR ON LOGIN ---------- */
  if (pathname === "/login") {
    return (
      <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
        {children}
      </body>
    );
  }

  return (
    <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-300">

      {/* THEME BUTTON */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 p-3 rounded-full bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 z-[100] text-2xl"
        title="Toggle Theme"
      >
        {darkMode ? "🌙" : "☀️"}
      </button>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">

            {/* BRAND */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" stroke="white" strokeWidth="3" fill="none">
                  <path d="M12 20V10" />
                  <path d="M18 20V4" />
                  <path d="M6 20v-4" />
                </svg>
              </div>
              <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                FinHub
              </span>
            </div>

            {/* LINKS */}
            <div className="hidden md:flex space-x-8">
  <Link
    href="/"
    className={`font-medium transition ${
      pathname === "/" ? "text-blue-600 dark:text-blue-400" : "hover:text-blue-500"
    }`}
  >
    Crypto ₿
  </Link>

  <Link
    href="/stocks"
    className={`font-medium transition ${
      pathname === "/stocks" ? "text-blue-600 dark:text-blue-400" : "hover:text-blue-500"
    }`}
  >
    Stocks 📈
  </Link>

  <Link
    href="/forex"
    className={`font-medium transition ${
      pathname === "/forex" ? "text-blue-600 dark:text-blue-400" : "hover:text-blue-500"
    }`}
  >
    Forex 🌍
  </Link>
</div>


            {/* SIGN OUT */}
            {user && (
              <button
              onClick={handleSignOut}
              className={`hidden md:block text-sm font-bold text-red-500 hover:text-red-600 transition ${
                user ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              Sign Out
            </button>
            
            )}
          </div>

          {/* MOBILE */}
          <div className="md:hidden flex justify-around py-3 border-t border-gray-100 dark:border-gray-800">
          <Link href="/" className={`font-medium ${pathname === '/' ? 'text-blue-600 dark:text-blue-400' : 'hover:text-blue-500'}`}>
            Crypto ₿
          </Link>

          <Link href="/stocks" className={`font-medium ${pathname === '/stocks' ? 'text-blue-600 dark:text-blue-400' : 'hover:text-blue-500'}`}>
            Stocks 📈
          </Link>

          <Link href="/forex" className={`font-medium ${pathname === '/forex' ? 'text-blue-600 dark:text-blue-400' : 'hover:text-blue-500'}`}>
            Forex 🌍
          </Link>

            {role === "admin" && (
    <Link
      href="/admin"
      className="font-bold text-red-500 hover:text-red-600"
    >
      Admin Panel
    </Link>
  )}
            {user && (
              <button onClick={handleSignOut} className="text-red-500">
                Exit
              </button>
            )}
          </div>
        </div>
      </nav>

      {children}
    </body>
  );
}

/* ---------------- ROOT LAYOUT ---------------- */
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AuthProvider>
        <LayoutContent>{children}</LayoutContent>
      </AuthProvider>
    </html>
  );
}
