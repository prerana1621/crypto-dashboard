"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
  const { user, role, loading } = useAuth();
    const router = useRouter();
    const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{6,}$/;

if (!passwordRegex.test(password)) {
  alert(
    "Password must be at least 6 characters and include letters, numbers & special characters"
  );
  return;
}

  useEffect(() => {
    if (!loading && (!user || role !== "admin")) {
      router.replace("/");
    }
  }, [user, role, loading, router]);

  if (loading) return null;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Admin Dashboard 👑</h1>
    </div>
  );
}
