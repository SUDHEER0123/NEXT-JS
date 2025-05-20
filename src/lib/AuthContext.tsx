"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  isVerified: boolean | null;
  firestoreUid: string | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [firestoreUid, setFirestoreUid] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          // 🔹 Fetch verification status from the API
          const response = await fetch("/api/verifyStatus", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: firebaseUser.email }),
          });

          const data = await response.json();

          setIsVerified(data.verified);
          

          if(!data.verified) {
            auth.signOut();
            alert("User is not verified.");
          } else {
            setFirestoreUid(data.uid);
          }
        } catch (error) {
          console.error("Error fetching verification status:", error);
          setIsVerified(false);
        }
      } else {
        setIsVerified(null);
        router.push("/login");
      }

      setLoading(false); // Ensure loading state updates AFTER API fetch
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isVerified, firestoreUid }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
