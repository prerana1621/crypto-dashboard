"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Login() {
  const router = useRouter();

  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{6,}$/;

  useEffect(() => {
    // Only access localStorage after component mounts (client-side)
    const savedEmail = localStorage.getItem("rememberEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRemember(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isSignup && !passwordRegex.test(password)) {
      setError(
        "Password must be at least 6 characters and include letters, numbers & special characters"
      );
      return;
    }

    try {
      if (isSignup) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(cred.user);
        alert("Verification email sent. Please verify first.");
        setIsSignup(false);
      } else {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        if (!cred.user.emailVerified) {
          setError("Please verify your email first.");
          return;
        }

        if (remember) {
          localStorage.setItem("rememberEmail", email);
        } else {
          localStorage.removeItem("rememberEmail");
        }

        router.replace("/");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const resetPassword = async () => {
    if (!email) {
      alert("Enter your email first");
      return;
    }
    await sendPasswordResetEmail(auth, email);
    alert("Password reset email sent");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-[#020617]">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#020617] border border-gray-200 dark:border-white/10 shadow-xl p-8">
        {/* HEADER */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg rotate-[-6deg]">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
               <path d="M12 20V10" />
               <path d="M18 20V4" />
               <path d="M6 20v-4" />
             </svg>
          </div>

          <h1 className="text-2xl font-bold mt-4 text-gray-900 dark:text-gray-100">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h1>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {isSignup ? "Join the Global Finance Hub" : "Sign in to your Dashboard"}
          </p>
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* EMAIL */}
          <div className="rounded-lg border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-[#0b1220] focus-within:ring-2 focus-within:ring-blue-500">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="custom-caret w-full p-3 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 outline-none"
            />
          </div>

          {/* PASSWORD */}
          <div className="rounded-lg border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-[#0b1220] focus-within:ring-2 focus-within:ring-blue-500">
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="new-password"
              className="custom-caret w-full p-3 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 outline-none"
            />
          </div>

          {!isSignup && (
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="accent-blue-600"
              />
              Remember me
            </label>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:opacity-90 transition"
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          {isSignup ? "Already have an account? " : "Don't have an account? "}
          <span
            onClick={() => setIsSignup(!isSignup)}
            className="text-blue-500 font-medium cursor-pointer"
          >
            {isSignup ? "Sign in" : "Sign up"}
          </span>

          {!isSignup && (
            <p
              onClick={resetPassword}
              className="mt-2 cursor-pointer hover:text-blue-500"
            >
              Forgot password?
            </p>
          )}
        </div>
      </div>
    </div>
  );
}