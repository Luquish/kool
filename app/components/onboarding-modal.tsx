'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface OnboardingModalProps {
  isOpen: boolean;
}

export function OnboardingModal({ isOpen }: OnboardingModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
        <div className="flex flex-col space-y-4 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">
            Complete the onboarding process
          </h2>
          <p className="text-muted-foreground">
            To use this function, you need to complete the onboarding process
          </p>
          <Button 
            onClick={() => router.push('/onboarding')}
            className="mx-auto"
          >
            Let's be Kool
          </Button>
        </div>
      </div>
    </div>
  );
} 