"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import storage from "@/lib/storage";

export default function ProfilePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const user = await storage.getItem("currentUser");
      if (!user) {
        router.push("/auth/login");
        return;
      }
      setCurrentUser(user);
    };
    checkUser();
  }, [router]);

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-card rounded-lg shadow-lg text-center space-y-4">
        <h1 className="text-3xl font-bold text-primary">¡Gracias por registrarte!</h1>
        <p className="text-muted-foreground">
          Estamos emocionados de tenerte como parte de la comunidad Kool.
        </p>
        <div className="pt-4">
          <button
            onClick={() => router.push("/onboarding")}
            className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Completar perfil
          </button>
        </div>
      </div>
    </div>
  );
} 