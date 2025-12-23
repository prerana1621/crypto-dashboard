"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase"; // Ensure 'db' is exported from your firebase config
import { onAuthStateChanged, signOut as fbSignOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // <--- NEW: State to store the user's role
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        // 1. User is logged in
        setUser(u);

        try {
          // 2. Fetch their role from Firestore (collection: "users", docId: u.uid)
          const userDocRef = doc(db, "users", u.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            // Get the role from database (default to "user" if missing)
            setRole(userDoc.data().role || "user");
            
            // 🚨 FOR TESTING ONLY: Uncomment the line below to FORCE yourself as Admin right now
            // setRole("admin"); 
          } else {
            // Document doesn't exist? They are just a regular user
            setRole("user");
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setRole("user");
        }
      } else {
        // User is logged out
        setUser(null);
        setRole(null);
      }
      
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const signOut = async () => {
    await fbSignOut(auth);
    setRole(null); // Clear role on sign out
    setUser(null);
  };

  return (
    // 3. Pass 'role' to the rest of the app
    <AuthContext.Provider value={{ user, role, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);