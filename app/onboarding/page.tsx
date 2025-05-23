"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import storage from "@/lib/storage";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import BasicInfoStep from "./steps/basic-info/page";
import SocialsStep from "./steps/socials/page";
import DiscographyStep from "./steps/discography/page";
import LiveHistoryStep from "./steps/live-history/page";
import { toast } from "@/components/ui/use-toast";

const steps = [
  { id: 1, title: "Basic Info", description: "Project and artist details" },
  { id: 2, title: "Social Media", description: "Your online presence" },
  { id: 3, title: "Discography", description: "Your music and releases" },
  { id: 4, title: "Live History", description: "Shows and financials" }
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const { reset, loadFromStorage, saveToStorage, finishOnboarding } = useOnboardingStore();

  useEffect(() => {
    const checkUser = async () => {
      const user = await storage.getCurrentUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }
      setCurrentUser(user);
      
      // Cargar datos existentes del perfil si existen
      await loadFromStorage(user);
    };
    checkUser();
  }, [router, reset, loadFromStorage]);

  useEffect(() => {
    setProgress((currentStep / steps.length) * 100);
  }, [currentStep]);

  // Guardar cambios en cada paso
  useEffect(() => {
    if (currentUser && currentStep > 1) {
      // Solo guardamos automáticamente después del primer paso
      // Guardamos el progreso temporal, no el definitivo
      saveToStorage();
    }
  }, [currentStep, currentUser, saveToStorage]);

  const handleFinishOnboarding = async () => {
    if (!currentUser) return;
    
    try {
      // Obtener el perfil actual
      const currentProfile = await storage.getUserProfile(currentUser);
      
      if (!currentProfile) {
        throw new Error('No se encontró el perfil del usuario');
      }
      
      // Actualizar el perfil con los datos del onboarding y marcar como completado
      const updatedProfile = {
        ...currentProfile,
        ...useOnboardingStore.getState(),
        isOnboardingCompleted: true
      };
      
      // Guardar el perfil actualizado
      await storage.saveUserProfile(currentUser, updatedProfile);
      
      // Redirigir al dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error al finalizar onboarding:', error);
      toast({
        title: 'Error',
        description: 'No se pudo completar el proceso de onboarding',
        variant: 'destructive'
      });
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleFinishOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header with progress */}
      <div className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="relative">
            {/* Progress bar */}
            <div className="h-2 bg-secondary rounded-full">
              <div
                className="h-2 bg-primary rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            {/* Steps */}
            <div className="mt-4 grid grid-cols-4 gap-4">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`text-center ${
                    currentStep === step.id
                      ? "text-primary"
                      : currentStep > step.id
                      ? "text-muted-foreground"
                      : "text-muted-foreground/50"
                  }`}
                >
                  <div className="flex items-center justify-center mb-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        currentStep === step.id
                          ? "bg-primary text-white"
                          : currentStep > step.id
                          ? "bg-primary/20 text-primary"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {step.id}
                    </div>
                  </div>
                  <div className="text-sm font-medium">{step.title}</div>
                  <div className="text-xs hidden sm:block">{step.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Step content */}
          <div className="min-h-[500px]">
            {currentStep === 1 && <BasicInfoStep />}
            {currentStep === 2 && <SocialsStep />}
            {currentStep === 3 && <DiscographyStep />}
            {currentStep === 4 && <LiveHistoryStep />}
          </div>

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            <button
              onClick={prevStep}
              className={`px-6 py-3 rounded-md text-sm font-medium ${
                currentStep === 1
                  ? "invisible"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/90"
              }`}
            >
              Previous
            </button>
            <button
              onClick={currentStep === steps.length ? handleFinishOnboarding : nextStep}
              className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 text-sm font-medium"
            >
              {currentStep === steps.length ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 