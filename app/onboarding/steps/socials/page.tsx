"use client";

import { useState } from "react";
import { useOnboardingStore } from "@/lib/store/onboarding-store";

export default function SocialsStep() {
  const store = useOnboardingStore();
  const [formData, setFormData] = useState({
    instagram_followers: store.socials?.instagram_followers || "",
    spotify_monthly_listeners: store.socials?.spotify_monthly_listeners || "",
    tiktok_followers: store.socials?.tiktok_followers || "",
    youtube_subscribers: store.socials?.youtube_subscribers || "",
    mailing_list_size: store.socials?.mailing_list_size || "",
    budget_per_launch_ars: store.financials?.budget_per_launch_ars || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Permitir valor vacío o número
    const newValue = value === "" ? "" : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    
    // Solo actualizar el store si hay un valor numérico
    if (value !== "") {
      const numericValue = parseInt(value, 10);
      
      if (name === 'budget_per_launch_ars') {
        // Si es el presupuesto, actualizar en financials
        store.setLiveHistory({
          financials: {
            ...store.financials,
            budget_per_launch_ars: numericValue
          }
        });
      } else {
        // Si es otro campo, actualizar en socials
        store.setSocials({ [name]: numericValue });
      }
    } else {
      // Valor por defecto para el store
      if (name === 'budget_per_launch_ars') {
        store.setLiveHistory({
          financials: {
            ...store.financials,
            budget_per_launch_ars: 0
          }
        });
      } else {
        store.setSocials({ [name]: 0 });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Social Media Presence</h2>
        <p className="text-muted-foreground">Tell us about your reach on social media</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Instagram Followers</label>
            <input
              type="number"
              name="instagram_followers"
              value={formData.instagram_followers}
              onChange={handleInputChange}
              min="0"
              placeholder="0"
              className="w-full p-2 border rounded-md bg-background"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Spotify Monthly Listeners</label>
            <input
              type="number"
              name="spotify_monthly_listeners"
              value={formData.spotify_monthly_listeners}
              onChange={handleInputChange}
              min="0"
              placeholder="0"
              className="w-full p-2 border rounded-md bg-background"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">TikTok Followers</label>
            <input
              type="number"
              name="tiktok_followers"
              value={formData.tiktok_followers}
              onChange={handleInputChange}
              min="0"
              placeholder="0"
              className="w-full p-2 border rounded-md bg-background"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">YouTube Subscribers</label>
            <input
              type="number"
              name="youtube_subscribers"
              value={formData.youtube_subscribers}
              onChange={handleInputChange}
              min="0"
              placeholder="0"
              className="w-full p-2 border rounded-md bg-background"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Mailing List Size</label>
            <input
              type="number"
              name="mailing_list_size"
              value={formData.mailing_list_size}
              onChange={handleInputChange}
              min="0"
              placeholder="0"
              className="w-full p-2 border rounded-md bg-background"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 