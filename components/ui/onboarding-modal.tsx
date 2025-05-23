'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  const handleButtonClick = () => {
    if (onClose) {
      onClose();
    }
    router.push('/onboarding');
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm" onClick={handleBackdropClick}>
      <div className="fixed left-[50%] top-[50%] z-[101] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200">
        <div className="flex flex-col space-y-4 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">
            Complete the onboarding process
          </h2>
          <p className="text-muted-foreground">
            To use this function, you need to complete the onboarding process
          </p>
          <Button 
            onClick={handleButtonClick}
            className="mx-auto"
          >
            Take me there
          </Button>
        </div>
      </div>
    </div>
  );
} 