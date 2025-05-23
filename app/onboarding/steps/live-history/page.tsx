"use client";

import { useState } from "react";
import { useOnboardingStore } from "@/lib/store/onboarding-store";

interface LiveHighlight {
  venue: string;
  note: string;
}

export default function LiveHistoryStep() {
  const store = useOnboardingStore();

  // Convertir los highlights a formato correcto si existen
  const existingHighlights = store.live_history?.highlights 
    ? (store.live_history.highlights as unknown as LiveHighlight[]) 
    : [];

  const [formData, setFormData] = useState({
    live_highlights: existingHighlights,
    avg_capacity: store.live_history?.avg_capacity || "",
    avg_ticket_price_ars: store.live_history?.avg_ticket_price_ars || "",
    annual_expenses_ars: store.financials?.annual_expenses_ars || "",
    budget_per_launch_ars: store.financials?.budget_per_launch_ars || ""
  });

  const [newHighlight, setNewHighlight] = useState<LiveHighlight>({ venue: "", note: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Eliminar cualquier signo de pesos y espacios
    const cleanValue = value.replace(/[^\d]/g, '');
    // Convertir a número para almacenar en el store (0 si está vacío)
    const numericValue = cleanValue === "" ? 0 : parseInt(cleanValue, 10);
    
    // Para los campos monetarios, almacenamos en el estado el valor limpio
    setFormData((prev) => ({ ...prev, [name]: cleanValue }));
    
    // Determinar si el campo pertenece a live_history o financials
    if (name === 'annual_expenses_ars' || name === 'budget_per_launch_ars') {
      store.setLiveHistory({ 
        financials: { 
          ...store.financials, 
          [name]: numericValue 
        } 
      });
    } else if (name === 'avg_capacity' || name === 'avg_ticket_price_ars') {
      store.setLiveHistory({ 
        live_history: { 
          ...store.live_history, 
          [name]: numericValue 
        } 
      });
    }
  };

  const handleAddHighlight = () => {
    if (!newHighlight.venue || !newHighlight.note) return;
    
    const updatedHighlights = [...formData.live_highlights, newHighlight];
    
    setFormData((prev) => ({ 
      ...prev, 
      live_highlights: updatedHighlights 
    }));
    
    store.setLiveHistory({ 
      live_history: { 
        ...store.live_history, 
        highlights: updatedHighlights 
      } 
    });
    
    setNewHighlight({ venue: "", note: "" });
  };

  const handleRemoveHighlight = (index: number) => {
    const updatedHighlights = formData.live_highlights.filter((_, i) => i !== index);
    
    setFormData((prev) => ({ 
      ...prev, 
      live_highlights: updatedHighlights 
    }));
    
    store.setLiveHistory({ 
      live_history: { 
        ...store.live_history, 
        highlights: updatedHighlights 
      } 
    });
  };

  // Función para formatear el valor con signo de pesos
  const formatCurrency = (value: string) => {
    if (value === "") return "";
    return `$ ${value}`;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Live Show History</h2>
        <p className="text-muted-foreground">Tell us about your live performances</p>
      </div>

      <div className="space-y-8">
        {/* Highlights */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Featured Shows</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={newHighlight.venue}
              onChange={(e) => setNewHighlight((prev) => ({ ...prev, venue: e.target.value }))}
              className="p-2 border rounded-md bg-background"
              placeholder="Venue name"
            />
            <input
              type="text"
              value={newHighlight.note}
              onChange={(e) => setNewHighlight((prev) => ({ ...prev, note: e.target.value }))}
              className="p-2 border rounded-md bg-background"
              placeholder="Important note or detail"
            />
          </div>
          <button
            onClick={handleAddHighlight}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Add Featured Show
          </button>
          <div className="mt-4">
            {formData.live_highlights.map((highlight, index) => (
              <div key={index} className="flex items-center gap-2 bg-secondary/20 p-2 rounded-md mb-2">
                <span className="flex-1">
                  <strong>{highlight.venue}</strong> - {highlight.note}
                </span>
                <button
                  onClick={() => handleRemoveHighlight(index)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Show Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Average Capacity</label>
              <input
                type="text"
                name="avg_capacity"
                value={formData.avg_capacity}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md bg-background"
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Average Ticket Price</label>
              <div className="relative">
                <input
                  type="text"
                  name="avg_ticket_price_ars"
                  value={formData.avg_ticket_price_ars}
                  onChange={handleInputChange}
                  className="w-full p-2 pl-6 border rounded-md bg-background"
                  placeholder="0"
                />
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">$</span>
              </div>
            </div>
          </div>
        </div>

        {/* Expenses */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Finances</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Estimated Annual Expenses</label>
              <div className="relative">
                <input
                  type="text"
                  name="annual_expenses_ars"
                  value={formData.annual_expenses_ars}
                  onChange={handleInputChange}
                  className="w-full p-2 pl-6 border rounded-md bg-background"
                  placeholder="0"
                />
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">$</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Includes production, rehearsal, equipment costs, etc.
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Budget per Release</label>
              <div className="relative">
                <input
                  type="text"
                  name="budget_per_launch_ars"
                  value={formData.budget_per_launch_ars}
                  onChange={handleInputChange}
                  className="w-full p-2 pl-6 border rounded-md bg-background"
                  placeholder="0"
                />
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">$</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                How much you invest in each music release
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 