"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import storage from "@/lib/storage";
import bcrypt from "bcryptjs";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userPath = `storage/${email}/profile.json`;
      const userData = await storage.getItem(userPath);
      
      if (!userData) {
        setError("User not found");
        return;
      }

      // Verificar la contraseña hasheada
      const isValidPassword = await bcrypt.compare(password, userData.password);
      
      if (isValidPassword) {
        await storage.saveItem("currentUser", email);
        // Establecer el usuario actual
        await storage.setCurrentUser(email);
        
        router.push("/");
      } else {
        setError("Incorrect password");
      }
    } catch (err) {
      setError("Error logging in");
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
            Login to continue
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-foreground">
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
              <label htmlFor="password" className="text-sm font-medium text-foreground">
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
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Login
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="font-medium text-primary hover:text-primary/90">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 