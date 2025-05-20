"use client";

import { useAuth } from "../lib/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader } from "./ui/Loader/Loader";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) return <h1>Loading...</h1>; // Show loading while checking auth

  return <>{user ? children : null}</>;
}
