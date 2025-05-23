"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<{message: string, details?: string}>({ message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError({ message: "" });
    
    if (!name.trim()) {
      setError({ message: "El nombre es requerido" });
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError({ message: "Las contraseñas no coinciden" });
      setIsLoading(false);
      return;
    }

    try {
      // 1. Crear el usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name
          }
        }
      });

      if (authError) {
        throw new Error(JSON.stringify({
          step: "auth",
          message: authError.message,
          details: authError
        }));
      }

      if (!authData.user) {
        throw new Error(JSON.stringify({
          step: "auth",
          message: "No se pudo crear el usuario",
          details: "No user data returned"
        }));
      }

      // 2. Crear el perfil inicial del usuario
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email,
          full_name: name,
          language: "es",
          project_type: "",
          artist_name: "",
          members: [],
          guest_members: [],
          creative_team: [],
          distributor: "",
          label_status: "independent",
          label_name: "",
          onboarding_completed: false,
          socials: {
            instagram_followers: 0,
            spotify_monthly_listeners: 0,
            tiktok_followers: 0,
            youtube_subscribers: 0,
            mailing_list_size: 0
          },
          discography: {
            eps: [],
            singles_released: [],
            upcoming_releases: [],
            visual_concept: ""
          },
          live_history: {
            highlights: [],
            avg_capacity: 0,
            avg_ticket_price_ars: 0
          },
          financials: {
            annual_expenses_ars: 0,
            budget_per_launch_ars: 0
          }
        });

      if (profileError) {
        throw new Error(JSON.stringify({
          step: "profile",
          message: "Error al crear el perfil",
          details: profileError
        }));
      }

      // 3. Crear los créditos iniciales
      const { error: creditsError } = await supabase
        .from('credits')
        .insert({
          id: authData.user.id,
          amount: 3
        });

      if (creditsError) {
        throw new Error(JSON.stringify({
          step: "credits",
          message: "Error al crear los créditos iniciales",
          details: creditsError
        }));
      }

      // 4. Registrar la transacción inicial de créditos
      const { error: transactionError } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: authData.user.id,
          amount: 3,
          type: 'purchase',
          description: 'Welcome credits'
        });

      if (transactionError) {
        throw new Error(JSON.stringify({
          step: "transaction",
          message: "Error al registrar la transacción",
          details: transactionError
        }));
      }

      // 5. Redirigir al usuario al onboarding
      router.push('/');
      router.refresh();
    } catch (error: any) {
      console.error('Error completo:', error);
      
      let errorData;
      try {
        errorData = JSON.parse(error.message);
      } catch {
        errorData = {
          message: "Error desconocido",
          details: error.message || error
        };
      }
      
      setError({
        message: errorData.message,
        details: JSON.stringify(errorData.details, null, 2)
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-10 bg-card rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-primary">
            Be Kool
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Create your account to get started
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          {error.message && (
            <div className="text-red-500 text-sm">
              <p className="font-semibold">{error.message}</p>
              {error.details && (
                <pre className="mt-2 p-2 bg-red-50 rounded text-xs overflow-auto">
                  {error.details}
                </pre>
              )}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="text-sm font-medium text-secondary">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-medium text-secondary">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-medium text-secondary">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="text-sm font-medium text-secondary">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              disabled={isLoading}
            >
              {isLoading ? "Creando cuenta..." : "Create Account"}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium text-primary hover:text-primary/90">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 