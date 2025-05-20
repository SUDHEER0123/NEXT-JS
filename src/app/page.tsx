'use client';

import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Root() {
  const router = useRouter();
  const { user, loading, isVerified } = useAuth();

  useEffect(() => {
    if(!loading && user && isVerified) {
      router.push('/home');
    }
  },[user, loading, router])

  return (
    <div className="h-screen w-full" />
  );
}
