"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import storage from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Save } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { OnboardingModal } from "@/components/ui/onboarding-modal";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);
  const [newMember, setNewMember] = useState("");
  const [newGuestMember, setNewGuestMember] = useState("");
  const [newCreativeTeamMember, setNewCreativeTeamMember] = useState("");

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true);
        const email = await storage.getCurrentUser();
        
        if (!email) {
          router.push("/auth/login");
          return;
        }
        
        const userProfile = await storage.getUserProfile(email);
        if (userProfile) {
          setProfile(userProfile);
          // Si el onboarding no está completado, mostrar el modal
          if (!userProfile.isOnboardingCompleted) {
            setShowOnboardingModal(true);
          }
        } else {
          // Si no hay perfil, redirigir al onboarding
          router.push("/onboarding");
        }
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [router]);

  const handleInputChange = (section: string, field: string, value: any) => {
    if (section === "root") {
      setProfile({
        ...profile,
        [field]: value
      });
    } else {
      setProfile({
        ...profile,
        [section]: {
          ...profile[section],
          [field]: value
        }
      });
    }
  };

  const handleNumberInputChange = (section: string, field: string, value: string) => {
    const numValue = value === "" ? 0 : parseInt(value, 10);
    handleInputChange(section, field, numValue);
  };

  const addItemToArray = (arrayName: string, item: string) => {
    if (!item.trim()) return;
    
    setProfile({
      ...profile,
      [arrayName]: [...profile[arrayName], item.trim()]
    });
  };

  const removeItemFromArray = (arrayName: string, index: number) => {
    setProfile({
      ...profile,
      [arrayName]: profile[arrayName].filter((_: any, i: number) => i !== index)
    });
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      const email = await storage.getCurrentUser();
      
      if (!email) {
        router.push("/auth/login");
        return;
      }
      
      const success = await storage.saveUserProfile(email, profile);
      
      if (success) {
        toast({
          title: "Profile updated",
          description: "Your changes have been saved successfully.",
          variant: "default",
        });
      } else {
        throw new Error("Error saving profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Unable to save your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  // Si el onboarding no está completado, mostrar solo el modal
  if (!profile.isOnboardingCompleted) {
    return (
      <div className="min-h-screen bg-background">
        <OnboardingModal isOpen={showOnboardingModal} onClose={() => setShowOnboardingModal(false)} />
      </div>
    );
  }

  return (
    <div className="container py-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      
      <div className="flex justify-end mb-4">
        <Button 
          onClick={saveProfile} 
          disabled={saving}
          className="flex items-center gap-2"
        >
          <Save size={16} />
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </div>

      <Tabs defaultValue="info">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="info">Basic Info</TabsTrigger>
          <TabsTrigger value="socials">Social Media</TabsTrigger>
          <TabsTrigger value="discography">Discography</TabsTrigger>
          <TabsTrigger value="live">Live History</TabsTrigger>
          <TabsTrigger value="financials">Financial</TabsTrigger>
        </TabsList>

        {/* Basic Info */}
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Update your personal information and project details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    value={profile.name} 
                    onChange={(e) => handleInputChange("root", "name", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    value={profile.email}
                    disabled
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select 
                    value={profile.language} 
                    onValueChange={(value) => handleInputChange("root", "language", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project_type">Project Type</Label>
                  <Input 
                    id="project_type" 
                    value={profile.project_type} 
                    onChange={(e) => handleInputChange("root", "project_type", e.target.value)} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="artist_name">Artist Name</Label>
                <Input 
                  id="artist_name" 
                  value={profile.artist_name} 
                  onChange={(e) => handleInputChange("root", "artist_name", e.target.value)} 
                />
              </div>
              
              <Separator />
              
              {/* Members */}
              <div className="space-y-4">
                <Label>Members</Label>
                <div className="flex flex-wrap gap-2">
                  {profile.members.map((member: string, index: number) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {member}
                      <button 
                        onClick={() => removeItemFromArray("members", index)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X size={14} />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Add member" 
                    value={newMember}
                    onChange={(e) => setNewMember(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addItemToArray("members", newMember);
                        setNewMember("");
                      }
                    }}
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => {
                      addItemToArray("members", newMember);
                      setNewMember("");
                    }}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>
              
              {/* Guest Members */}
              <div className="space-y-4">
                <Label>Guest Members</Label>
                <div className="flex flex-wrap gap-2">
                  {profile.guest_members.map((member: string, index: number) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {member}
                      <button 
                        onClick={() => removeItemFromArray("guest_members", index)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X size={14} />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Add guest member" 
                    value={newGuestMember}
                    onChange={(e) => setNewGuestMember(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addItemToArray("guest_members", newGuestMember);
                        setNewGuestMember("");
                      }
                    }}
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => {
                      addItemToArray("guest_members", newGuestMember);
                      setNewGuestMember("");
                    }}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>
              
              {/* Creative Team */}
              <div className="space-y-4">
                <Label>Creative Team</Label>
                <div className="flex flex-wrap gap-2">
                  {profile.creative_team.map((member: string, index: number) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {member}
                      <button 
                        onClick={() => removeItemFromArray("creative_team", index)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X size={14} />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Add creative team member" 
                    value={newCreativeTeamMember}
                    onChange={(e) => setNewCreativeTeamMember(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addItemToArray("creative_team", newCreativeTeamMember);
                        setNewCreativeTeamMember("");
                      }
                    }}
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => {
                      addItemToArray("creative_team", newCreativeTeamMember);
                      setNewCreativeTeamMember("");
                    }}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="distributor">Distributor</Label>
                  <Input 
                    id="distributor" 
                    value={profile.distributor} 
                    onChange={(e) => handleInputChange("root", "distributor", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="label_status">Label Status</Label>
                  <Select 
                    value={profile.label_status} 
                    onValueChange={(value) => handleInputChange("root", "label_status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="independent">Independent</SelectItem>
                      <SelectItem value="signed">Signed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {profile.label_status === "signed" && (
                <div className="space-y-2">
                  <Label htmlFor="label_name">Label Name</Label>
                  <Input 
                    id="label_name" 
                    value={profile.label_name} 
                    onChange={(e) => handleInputChange("root", "label_name", e.target.value)} 
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media */}
        <TabsContent value="socials">
          <Card>
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
              <CardDescription>
                Update your social media metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="instagram_followers">Instagram Followers</Label>
                  <Input 
                    id="instagram_followers" 
                    type="number"
                    value={profile.socials.instagram_followers} 
                    onChange={(e) => handleNumberInputChange("socials", "instagram_followers", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spotify_monthly_listeners">Spotify Monthly Listeners</Label>
                  <Input 
                    id="spotify_monthly_listeners" 
                    type="number"
                    value={profile.socials.spotify_monthly_listeners} 
                    onChange={(e) => handleNumberInputChange("socials", "spotify_monthly_listeners", e.target.value)} 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="tiktok_followers">TikTok Followers</Label>
                  <Input 
                    id="tiktok_followers" 
                    type="number"
                    value={profile.socials.tiktok_followers} 
                    onChange={(e) => handleNumberInputChange("socials", "tiktok_followers", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtube_subscribers">YouTube Subscribers</Label>
                  <Input 
                    id="youtube_subscribers" 
                    type="number"
                    value={profile.socials.youtube_subscribers} 
                    onChange={(e) => handleNumberInputChange("socials", "youtube_subscribers", e.target.value)} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mailing_list_size">Mailing List Size</Label>
                <Input 
                  id="mailing_list_size" 
                  type="number"
                  value={profile.socials.mailing_list_size} 
                  onChange={(e) => handleNumberInputChange("socials", "mailing_list_size", e.target.value)} 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Discography */}
        <TabsContent value="discography">
          <Card>
            <CardHeader>
              <CardTitle>Discography</CardTitle>
              <CardDescription>
                Information about your music releases
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>EPs</Label>
                <div className="space-y-2">
                  {profile.discography.eps.length > 0 ? (
                    <div className="grid gap-2">
                      {profile.discography.eps.map((ep: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                          <div className="flex-grow">{ep}</div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              const newEps = [...profile.discography.eps];
                              newEps.splice(index, 1);
                              handleInputChange("discography", "eps", newEps);
                            }}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No EPs registered</p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <Input 
                      placeholder="Add new EP"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.currentTarget.value.trim()) {
                          handleInputChange("discography", "eps", [...profile.discography.eps, e.currentTarget.value]);
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={(e) => {
                        const input = e.currentTarget.previousSibling as HTMLInputElement;
                        if (input && input.value.trim()) {
                          handleInputChange("discography", "eps", [...profile.discography.eps, input.value]);
                          input.value = "";
                        }
                      }}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Label>Released Singles</Label>
                <div className="space-y-2">
                  {profile.discography.singles_released.length > 0 ? (
                    <div className="grid gap-2">
                      {profile.discography.singles_released.map((single: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                          <div className="flex-grow">{single}</div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              const newSingles = [...profile.discography.singles_released];
                              newSingles.splice(index, 1);
                              handleInputChange("discography", "singles_released", newSingles);
                            }}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No singles registered</p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <Input 
                      placeholder="Add new single"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.currentTarget.value.trim()) {
                          handleInputChange("discography", "singles_released", [...profile.discography.singles_released, e.currentTarget.value]);
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={(e) => {
                        const input = e.currentTarget.previousSibling as HTMLInputElement;
                        if (input && input.value.trim()) {
                          handleInputChange("discography", "singles_released", [...profile.discography.singles_released, input.value]);
                          input.value = "";
                        }
                      }}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Label>Upcoming Releases</Label>
                <div className="space-y-2">
                  {profile.discography.upcoming_releases.length > 0 ? (
                    <div className="grid gap-2">
                      {profile.discography.upcoming_releases.map((release: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                          <div className="flex-grow">{release}</div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              const newReleases = [...profile.discography.upcoming_releases];
                              newReleases.splice(index, 1);
                              handleInputChange("discography", "upcoming_releases", newReleases);
                            }}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No upcoming releases registered</p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <Input 
                      placeholder="Add upcoming release"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.currentTarget.value.trim()) {
                          handleInputChange("discography", "upcoming_releases", [...profile.discography.upcoming_releases, e.currentTarget.value]);
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={(e) => {
                        const input = e.currentTarget.previousSibling as HTMLInputElement;
                        if (input && input.value.trim()) {
                          handleInputChange("discography", "upcoming_releases", [...profile.discography.upcoming_releases, input.value]);
                          input.value = "";
                        }
                      }}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="visual_concept">Visual Concept</Label>
                <Textarea 
                  id="visual_concept" 
                  value={profile.discography.visual_concept} 
                  onChange={(e) => handleInputChange("discography", "visual_concept", e.target.value)} 
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Live History */}
        <TabsContent value="live">
          <Card>
            <CardHeader>
              <CardTitle>Live History</CardTitle>
              <CardDescription>
                Details about your live performances
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Highlights</Label>
                <div className="space-y-2">
                  {profile.live_history.highlights.length > 0 ? (
                    <div className="grid gap-2">
                      {profile.live_history.highlights.map((highlight: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                          <div className="flex-grow">{highlight}</div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              const newHighlights = [...profile.live_history.highlights];
                              newHighlights.splice(index, 1);
                              handleInputChange("live_history", "highlights", newHighlights);
                            }}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No highlights registered</p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <Input 
                      placeholder="Add highlight"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.currentTarget.value.trim()) {
                          handleInputChange("live_history", "highlights", [...profile.live_history.highlights, e.currentTarget.value]);
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={(e) => {
                        const input = e.currentTarget.previousSibling as HTMLInputElement;
                        if (input && input.value.trim()) {
                          handleInputChange("live_history", "highlights", [...profile.live_history.highlights, input.value]);
                          input.value = "";
                        }
                      }}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="avg_capacity">Average Capacity</Label>
                  <Input 
                    id="avg_capacity" 
                    type="number"
                    value={profile.live_history.avg_capacity} 
                    onChange={(e) => handleNumberInputChange("live_history", "avg_capacity", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avg_ticket_price_ars">Average Ticket Price</Label>
                  <Input 
                    id="avg_ticket_price_ars" 
                    type="number"
                    value={profile.live_history.avg_ticket_price_ars} 
                    onChange={(e) => handleNumberInputChange("live_history", "avg_ticket_price_ars", e.target.value)} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial */}
        <TabsContent value="financials">
          <Card>
            <CardHeader>
              <CardTitle>Financial Information</CardTitle>
              <CardDescription>
                Details about your budget and expenses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="annual_expenses_ars">Estimated Annual Expenses</Label>
                  <Input 
                    id="annual_expenses_ars" 
                    type="number"
                    value={profile.financials.annual_expenses_ars} 
                    onChange={(e) => handleNumberInputChange("financials", "annual_expenses_ars", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget_per_launch_ars">Budget per Release</Label>
                  <Input 
                    id="budget_per_launch_ars" 
                    type="number"
                    value={profile.financials.budget_per_launch_ars} 
                    onChange={(e) => handleNumberInputChange("financials", "budget_per_launch_ars", e.target.value)} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 