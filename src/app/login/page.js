"use client";

import { useState } from "react";
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
  const [error, setError] = useState("");

  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{6,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isSignup && !passwordRegex.test(password)) {
      setError(
        "Password must be ≥6 chars, include letters, numbers & special characters"
      );
      return;
    }

    try {
      if (isSignup) {
        const cred = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await sendEmailVerification(cred.user);
        alert("Verification email sent. Please verify first.");
      } else {
        const cred = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        if (!cred.user.emailVerified) {
          setError("Please verify your email first.");
          return;
        }

        router.replace("/");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const resetPassword = async () => {
    if (!email) {
      alert("Enter email first");
      return;
    }
    await sendPasswordResetEmail(auth, email);
    alert("Password reset email sent");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-96 p-6 border rounded-xl">
        <h1 className="text-2xl font-bold mb-4">
          {isSignup ? "Create Account" : "Sign In"}
        </h1>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded mb-3"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded mb-3"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-blue-600 text-white py-3 rounded">
          {isSignup ? "Sign Up" : "Login"}
        </button>

        <p
          onClick={() => setIsSignup(!isSignup)}
          className="text-sm text-blue-500 mt-4 cursor-pointer"
        >
          {isSignup ? "Already have account?" : "Create account"}
        </p>

        <p
          onClick={resetPassword}
          className="text-sm text-gray-500 mt-2 cursor-pointer"
        >
          Forgot password?
        </p>
      </form>
    </div>
  );
}
