'use client';

import Button from "@/components/ui/Button/Button";
import { JSX, useCallback, useEffect, useState } from "react";
import QRModal from "./components/QRModal";
import { auth, googleProvider } from "../../lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { Loader } from "@/components/ui/Loader/Loader";

export default function Login(): JSX.Element {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const { user, loading, isVerified } = useAuth();
  const router = useRouter();

  const handleGoogleSignIn = useCallback(async () => {
    await signInWithPopup(auth, googleProvider);
  },[isVerified, router]);

  useEffect(() => {
    if (!loading && user && isVerified) {
      router.push("/home");
    }
  }, [user, loading, router, isVerified]);

  if(loading) {
    return <></>;
  }

  return (
    <div className="relative w-full h-screen">
      <div className="absolute bottom-0 left-0 ml-24 mb-24 text-white">
        <p className="text-2xl leading-8 mb-2">LAGONDA</p>
        <p className="text-5xl font-bold leading-[56px] mb-4">Aston Martin Dealer Application</p>
        <p className="font-thin">Your Digital Retail and Service Companion for providing a luxury</p>
        <p className="font-thin mb-8">customer experience.</p>
        <Button className="text-base w-[261px] h-[60px]" variant="primary" size="md" onClick={() => handleGoogleSignIn()}>Google Authenticator Login</Button>
        <QRModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(!isQRModalOpen)} isSetup={true} />
      </div>
    </div>
  );
}