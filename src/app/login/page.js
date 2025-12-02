"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // TOGGLE STATE

  const handleAuth = (e) => {
    e.preventDefault();
    setLoading(true);

    // SIMULATE SERVER DELAY
    setTimeout(() => {
      // Create a fake session
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', 'demo@finhub.com');
      
      // Force a hard refresh to update the Layout (Navbar)
      window.location.href = "/"; 
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 bg-[url('https://assets.coincap.io/assets/icons/btc@2x.png')] bg-no-repeat bg-center bg-fixed">
      {/* Overlay to dim background */}
      <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 transition-all duration-300">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg transform rotate-3">
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
               <path d="M12 20V10" />
               <path d="M18 20V4" />
               <path d="M6 20v-4" />
             </svg>
          </div>
          
          {/* DYNAMIC TITLE */}
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {isSignUp ? "Join the Global Finance Hub" : "Sign in to your Dashboard"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          
          {/* FULL NAME FIELD (Only shows during Sign Up) */}
          {isSignUp && (
            <div className="animate-fade-in-down">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
              <input 
                type="text" 
                required={isSignUp}
                placeholder="John Doe"
                className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              placeholder="demo@finhub.com"
              className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-70 disabled:scale-100"
          >
            {loading ? 'Authenticating...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        {/* TOGGLE BUTTON */}
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="ml-2 font-bold text-blue-600 hover:text-blue-500 hover:underline transition"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}