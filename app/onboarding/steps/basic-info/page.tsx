"use client";

import { useState } from "react";
import { useOnboardingStore } from "@/lib/store/onboarding-store";

export default function BasicInfoStep() {
  const store = useOnboardingStore();
  const [formData, setFormData] = useState({
    language: store.language || "en",
    project_type: store.project_type || "",
    artist_name: store.artist_name || "",
    members: store.members || [],
    guest_members: store.guest_members || [],
    creative_team: store.creative_team || [],
    distributor: store.distributor || "",
    label_status: store.label_status || "independent",
    label_name: store.label_name || "",
  });

  const [newMember, setNewMember] = useState("");
  const [newGuestMember, setNewGuestMember] = useState("");
  const [newCreativeTeamMember, setNewCreativeTeamMember] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    store.setBasicInfo({ [name]: value });
  };

  const handleAddMember = (type: "members" | "guest_members" | "creative_team", value: string) => {
    if (!value.trim()) return;
    
    const updatedMembers = [...formData[type], value];
    setFormData((prev) => ({ ...prev, [type]: updatedMembers }));
    store.setBasicInfo({ [type]: updatedMembers });

    // Reset the corresponding input
    switch (type) {
      case "members":
        setNewMember("");
        break;
      case "guest_members":
        setNewGuestMember("");
        break;
      case "creative_team":
        setNewCreativeTeamMember("");
        break;
    }
  };

  const handleRemoveMember = (type: "members" | "guest_members" | "creative_team", index: number) => {
    const updatedMembers = formData[type].filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, [type]: updatedMembers }));
    store.setBasicInfo({ [type]: updatedMembers });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Basic Information</h2>
        <p className="text-muted-foreground">Tell us about your project and team</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Language</label>
            <select
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md bg-background"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Project Type</label>
            <select
              name="project_type"
              value={formData.project_type}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md bg-background"
            >
              <option value="">Select type...</option>
              <option value="solo">Solo Artist</option>
              <option value="band">Band</option>
              <option value="duo">Duo</option>
              <option value="collective">Collective</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Artist/Band Name</label>
          <input
            type="text"
            name="artist_name"
            value={formData.artist_name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md bg-background"
            placeholder="Enter artist or band name"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Core Members</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newMember}
              onChange={(e) => setNewMember(e.target.value)}
              className="flex-1 p-2 border rounded-md bg-background"
              placeholder="Add core member name"
            />
            <button
              onClick={() => handleAddMember("members", newMember)}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.members.map((member, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-secondary rounded-full flex items-center gap-2 text-white"
              >
                {member}
                <button
                  onClick={() => handleRemoveMember("members", index)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Guest Members</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newGuestMember}
              onChange={(e) => setNewGuestMember(e.target.value)}
              className="flex-1 p-2 border rounded-md bg-background"
              placeholder="Add guest member name"
            />
            <button
              onClick={() => handleAddMember("guest_members", newGuestMember)}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.guest_members.map((member, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-secondary rounded-full flex items-center gap-2 text-white"
              >
                {member}
                <button
                  onClick={() => handleRemoveMember("guest_members", index)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Creative Team</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newCreativeTeamMember}
              onChange={(e) => setNewCreativeTeamMember(e.target.value)}
              className="flex-1 p-2 border rounded-md bg-background"
              placeholder="Add creative team member"
            />
            <button
              onClick={() => handleAddMember("creative_team", newCreativeTeamMember)}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.creative_team.map((member, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-secondary rounded-full flex items-center gap-2 text-white"
              >
                {member}
                <button
                  onClick={() => handleRemoveMember("creative_team", index)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Distributor</label>
          <input
            type="text"
            name="distributor"
            value={formData.distributor}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md bg-background"
            placeholder="Enter your music distributor"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Label Status</label>
          <select
            name="label_status"
            value={formData.label_status}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md bg-background"
          >
            <option value="independent">Independent</option>
            <option value="signed">Signed</option>
          </select>
        </div>

        {formData.label_status === "signed" && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Label Name</label>
            <input
              type="text"
              name="label_name"
              value={formData.label_name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md bg-background"
              placeholder="Enter label name"
            />
          </div>
        )}
      </div>
    </div>
  );
} 