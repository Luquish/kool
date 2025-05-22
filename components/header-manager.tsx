"use client";

import { usePathname } from 'next/navigation';
import MagazineHeader from '@/components/magazine-header';

export default function HeaderManager() {
  const pathname = usePathname();
  const isAuthRoute = pathname?.startsWith('/auth/');
  const isOnboardingRoute = pathname?.startsWith('/onboarding');
  
  if (isAuthRoute || isOnboardingRoute) {
    return null;
  }
  
  return (
    <>
      <MagazineHeader />
      <div className="pt-28" />
    </>
  );
} 