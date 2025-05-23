"use client";

import { useState } from "react";
import { useOnboardingStore } from "@/lib/store/onboarding-store";

interface Release {
  title: string;
  tracks?: number;
  year?: number;
  type?: string;
  concept?: string;
}

export default function DiscographyStep() {
  const store = useOnboardingStore();
  
  // Convertir los datos almacenados a tipo Release si existen
  const existingEPs = store.discography?.eps 
    ? (store.discography.eps as unknown as Release[]) 
    : [];
  
  const existingSingles = store.discography?.singles_released 
    ? (store.discography.singles_released as unknown as Release[]) 
    : [];
  
  const existingUpcoming = store.discography?.upcoming_releases 
    ? (store.discography.upcoming_releases as unknown as Release[]) 
    : [];
  
  const [formData, setFormData] = useState({
    eps: existingEPs,
    singles_released: existingSingles,
    upcoming_releases: existingUpcoming,
    visual_concept: store.discography?.visual_concept || "",
  });

  // Estados temporales para nuevos lanzamientos
  const [newEP, setNewEP] = useState<Release>({ title: "", tracks: undefined, year: undefined });
  const [newSingle, setNewSingle] = useState<Release>({ title: "", year: undefined });
  const [newUpcoming, setNewUpcoming] = useState<Release>({ title: "", type: "", concept: "" });
  const [upcomingError, setUpcomingError] = useState<string>("");

  const handleVisualConceptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, visual_concept: value }));
    store.setDiscography({ visual_concept: value });
  };

  const handleAddEP = () => {
    if (!newEP.title) return;
    const updatedEPs = [...formData.eps, newEP];
    setFormData((prev) => ({ ...prev, eps: updatedEPs }));
    store.setDiscography({ discography: { ...store.discography, eps: updatedEPs } });
    setNewEP({ title: "", tracks: undefined, year: undefined });
  };

  const handleAddSingle = () => {
    if (!newSingle.title) return;
    const updatedSingles = [...formData.singles_released, newSingle];
    setFormData((prev) => ({ ...prev, singles_released: updatedSingles }));
    store.setDiscography({ discography: { ...store.discography, singles_released: updatedSingles } });
    setNewSingle({ title: "", year: undefined });
  };

  const handleAddUpcoming = () => {
    setUpcomingError("");
    
    if (!newUpcoming.title && !newUpcoming.type) {
      setUpcomingError("Please enter the title and select the release type");
      return;
    }
    
    if (!newUpcoming.title) {
      setUpcomingError("Please enter the title of the release");
      return;
    }
    
    if (!newUpcoming.type) {
      setUpcomingError("Please select the release type");
      return;
    }
    
    const updatedUpcoming = [...formData.upcoming_releases, newUpcoming];
    setFormData((prev) => ({ ...prev, upcoming_releases: updatedUpcoming }));
    store.setDiscography({ discography: { ...store.discography, upcoming_releases: updatedUpcoming } });
    setNewUpcoming({ title: "", type: "", concept: "" });
  };

  const handleRemoveRelease = (type: "eps" | "singles_released" | "upcoming_releases", index: number) => {
    const updatedReleases = formData[type].filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, [type]: updatedReleases }));
    store.setDiscography({ discography: { ...store.discography, [type]: updatedReleases }});
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Discography</h2>
        <p className="text-muted-foreground">Tell us about your music and releases</p>
      </div>

      <div className="space-y-8">
        {/* EPs */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">EPs</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              value={newEP.title}
              onChange={(e) => setNewEP((prev) => ({ ...prev, title: e.target.value }))}
              className="p-2 border rounded-md bg-background"
              placeholder="EP Title"
            />
            <input
              type="number"
              value={newEP.tracks || ""}
              onChange={(e) => setNewEP((prev) => ({ ...prev, tracks: parseInt(e.target.value) || undefined }))}
              className="p-2 border rounded-md bg-background"
              placeholder="Number of tracks"
            />
            <input
              type="number"
              value={newEP.year || ""}
              onChange={(e) => setNewEP((prev) => ({ ...prev, year: parseInt(e.target.value) || undefined }))}
              className="p-2 border rounded-md bg-background"
              placeholder="Year"
            />
          </div>
          <button
            onClick={handleAddEP}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Add EP
          </button>
          <div className="mt-4">
            {formData.eps.map((ep, index) => (
              <div key={index} className="flex items-center gap-2 bg-secondary/20 p-2 rounded-md mb-2">
                <span className="flex-1">
                  {ep.title} ({ep.tracks} tracks, {ep.year})
                </span>
                <button
                  onClick={() => handleRemoveRelease("eps", index)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Singles */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Singles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={newSingle.title}
              onChange={(e) => setNewSingle((prev) => ({ ...prev, title: e.target.value }))}
              className="p-2 border rounded-md bg-background"
              placeholder="Single Title"
            />
            <input
              type="number"
              value={newSingle.year || ""}
              onChange={(e) => setNewSingle((prev) => ({ ...prev, year: parseInt(e.target.value) || undefined }))}
              className="p-2 border rounded-md bg-background"
              placeholder="Year"
            />
          </div>
          <button
            onClick={handleAddSingle}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Add Single
          </button>
          <div className="mt-4">
            {formData.singles_released.map((single, index) => (
              <div key={index} className="flex items-center gap-2 bg-secondary/20 p-2 rounded-md mb-2">
                <span className="flex-1">
                  {single.title} ({single.year})
                </span>
                <button
                  onClick={() => handleRemoveRelease("singles_released", index)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Releases */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Upcoming Releases</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              value={newUpcoming.title}
              onChange={(e) => {
                setUpcomingError("");
                setNewUpcoming((prev) => ({ ...prev, title: e.target.value }));
              }}
              className={`p-2 border rounded-md bg-background ${!newUpcoming.title && upcomingError ? 'border-red-500' : ''}`}
              placeholder="Title"
            />
            <select
              value={newUpcoming.type}
              onChange={(e) => {
                setUpcomingError("");
                setNewUpcoming((prev) => ({ ...prev, type: e.target.value }));
              }}
              className={`p-2 border rounded-md bg-background ${!newUpcoming.type && upcomingError ? 'border-red-500' : ''}`}
            >
              <option value="">Release Type</option>
              <option value="single">Single</option>
              <option value="ep">EP</option>
              <option value="album">Album</option>
            </select>
            <input
              type="text"
              value={newUpcoming.concept}
              onChange={(e) => setNewUpcoming((prev) => ({ ...prev, concept: e.target.value }))}
              className="p-2 border rounded-md bg-background"
              placeholder="Concept"
            />
          </div>
          {upcomingError && (
            <p className="text-sm text-red-500 mt-1">Please enter the title and select the release type</p>
          )}
          <button
            onClick={handleAddUpcoming}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Add Upcoming Release
          </button>
          <div className="mt-4">
            {formData.upcoming_releases.map((release, index) => (
              <div key={index} className="flex items-center gap-2 bg-secondary/20 p-2 rounded-md mb-2">
                <span className="flex-1">
                  {release.title} ({release.type}) - {release.concept}
                </span>
                <button
                  onClick={() => handleRemoveRelease("upcoming_releases", index)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Concept */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Visual Concept</h3>
          <textarea
            value={formData.visual_concept}
            onChange={handleVisualConceptChange}
            className="w-full p-2 border rounded-md bg-background h-32"
            placeholder="Describe the visual concept of your project..."
          />
        </div>
      </div>
    </div>
  );
} 