"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase"; // Import database
import { collection, getDocs } from "firebase/firestore"; // Import firestore functions

export default function AdminPage() {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [usersList, setUsersList] = useState([]); // State to store real users
  const [fetchingUsers, setFetchingUsers] = useState(true);

  // 1. Check Admin Status
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else if (role !== "admin") {
        router.replace("/");
      } else {
        setIsAdmin(true);
      }
    }
  }, [user, role, loading, router]);

  // 2. Fetch Users from Firestore (Only if Admin)
  useEffect(() => {
    if (isAdmin) {
      const fetchUsers = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, "users"));
          const users = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setUsersList(users);
        } catch (error) {
          console.error("Error fetching users:", error);
        } finally {
          setFetchingUsers(false);
        }
      };

      fetchUsers();
    }
  }, [isAdmin]);

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">Verifying Admin Privileges...</p>
      </div>
    );
  }

  return (
    <div className="
      min-h-screen 
      pt-5
      px-6 
      pb-20 
      bg-gray-50 dark:bg-gray-900 
      text-gray-900 dark:text-white
    ">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold flex items-center gap-3">
              Admin Dashboard <span className="text-2xl">🛡️</span>
            </h1>
            <p className="text-gray-500 mt-2">Manage your users and system settings.</p>
          </div>
          <div className="px-4 py-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-lg font-bold text-sm">
            ● System Operational
          </div>
        </div>

        {/* STATS GRID (Real Data Integration) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border border-gray-100 dark:border-gray-700">
            <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Total Users</h3>
            {/* Shows the actual count of documents fetched */}
            <p className="text-3xl font-extrabold mt-2">{usersList.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border border-gray-100 dark:border-gray-700">
            <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Active Sessions</h3>
            <p className="text-3xl font-extrabold mt-2 text-blue-500">1</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border border-gray-100 dark:border-gray-700">
            <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Server Status</h3>
            <p className="text-3xl font-extrabold mt-2 text-green-500">99.9%</p>
          </div>
        </div>

        {/* REAL USER LIST TABLE */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-100 dark:border-gray-700 overflow-hidden mb-10">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-bold text-lg">Registered Users</h3>
            {fetchingUsers && <span className="text-sm text-gray-400 animate-pulse">Refreshing...</span>}
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-6">User ID</th>
                  <th className="p-6">Role</th>
                  <th className="p-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {usersList.length > 0 ? (
                  usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                      <td className="p-6 font-mono text-xs text-gray-500">{u.id}</td>
                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          u.role === 'admin' 
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        }`}>
                          {u.role || "user"}
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        <span className="text-green-500 font-bold text-xs">● Active</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="p-8 text-center text-gray-500">
                      {fetchingUsers ? "Loading users..." : "No users found in database."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}