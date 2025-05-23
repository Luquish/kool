"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import storage from "@/lib/storage";
import bcrypt from "bcryptjs";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError("El nombre es requerido");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      // 1. Verificar si el usuario ya existe
      const userExists = await storage.checkUserExists(email);
      
      if (userExists) {
        setError("Este email ya está registrado");
        return;
      }

      // 2. Hash de la contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // 3. Crear el perfil inicial del usuario
      const initialProfile = {
        name,
        email,
        password: hashedPassword,
        language: "es",
        project_type: "",
        artist_name: "",
        members: [],
        guest_members: [],
        creative_team: [],
        distributor: "",
        label_status: "independent",
        label_name: "",
        isOnboardingCompleted: false,
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
      };

      try {
        // 4. Guardar el perfil del usuario
        await storage.saveUserProfile(email, initialProfile);
        
        // 5. Crear los créditos iniciales
        await storage.saveItem(`storage/${email}/credits.json`, {
          credits: 3,
          transactions: [{
            date: new Date().toISOString(),
            amount: 3,
            type: 'purchase',
            description: 'Welcome credits'
          }]
        });
        
        // 6. Establecer el usuario actual
        await storage.setCurrentUser(email);
        
        // 7. Redirigir al usuario al onboarding
        router.push('/');
      } catch (error) {
        console.error('Error al guardar datos:', error);
        setError('Hubo un error al crear tu cuenta. Por favor, intenta de nuevo.');
      }
    } catch (err) {
      setError("Error al crear la cuenta");
      console.error(err);
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
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
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
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Create Account
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