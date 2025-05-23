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
          title: "Perfil actualizado",
          description: "Tus cambios se han guardado correctamente.",
          variant: "default",
        });
      } else {
        throw new Error("Error al guardar el perfil");
      }
    } catch (error) {
      console.error("Error al guardar el perfil:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar tu perfil. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary">Cargando perfil...</div>
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
        <OnboardingModal isOpen={showOnboardingModal} />
      </div>
    );
  }

  return (
    <div className="container py-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>
      
      <div className="flex justify-end mb-4">
        <Button 
          onClick={saveProfile} 
          disabled={saving}
          className="flex items-center gap-2"
        >
          <Save size={16} />
          {saving ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>

      <Tabs defaultValue="info">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="info">Información Básica</TabsTrigger>
          <TabsTrigger value="socials">Redes Sociales</TabsTrigger>
          <TabsTrigger value="discography">Discografía</TabsTrigger>
          <TabsTrigger value="live">Historia en Vivo</TabsTrigger>
          <TabsTrigger value="financials">Financiero</TabsTrigger>
        </TabsList>

        {/* Información Básica */}
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
              <CardDescription>
                Actualiza tu información personal y detalles del proyecto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
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
                  <Label htmlFor="language">Idioma</Label>
                  <Select 
                    value={profile.language} 
                    onValueChange={(value) => handleInputChange("root", "language", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">Inglés</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project_type">Tipo de Proyecto</Label>
                  <Input 
                    id="project_type" 
                    value={profile.project_type} 
                    onChange={(e) => handleInputChange("root", "project_type", e.target.value)} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="artist_name">Nombre Artístico</Label>
                <Input 
                  id="artist_name" 
                  value={profile.artist_name} 
                  onChange={(e) => handleInputChange("root", "artist_name", e.target.value)} 
                />
              </div>
              
              <Separator />
              
              {/* Miembros */}
              <div className="space-y-4">
                <Label>Miembros</Label>
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
                    placeholder="Añadir miembro" 
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
              
              {/* Miembros Invitados */}
              <div className="space-y-4">
                <Label>Miembros Invitados</Label>
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
                    placeholder="Añadir miembro invitado" 
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
              
              {/* Equipo Creativo */}
              <div className="space-y-4">
                <Label>Equipo Creativo</Label>
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
                    placeholder="Añadir miembro al equipo creativo" 
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
                  <Label htmlFor="distributor">Distribuidor</Label>
                  <Input 
                    id="distributor" 
                    value={profile.distributor} 
                    onChange={(e) => handleInputChange("root", "distributor", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="label_status">Estado de Sello</Label>
                  <Select 
                    value={profile.label_status} 
                    onValueChange={(value) => handleInputChange("root", "label_status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="independent">Independiente</SelectItem>
                      <SelectItem value="signed">Firmado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {profile.label_status === "signed" && (
                <div className="space-y-2">
                  <Label htmlFor="label_name">Nombre del Sello</Label>
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

        {/* Redes Sociales */}
        <TabsContent value="socials">
          <Card>
            <CardHeader>
              <CardTitle>Redes Sociales</CardTitle>
              <CardDescription>
                Actualiza tus métricas en plataformas sociales
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="instagram_followers">Seguidores en Instagram</Label>
                  <Input 
                    id="instagram_followers" 
                    type="number"
                    value={profile.socials.instagram_followers} 
                    onChange={(e) => handleNumberInputChange("socials", "instagram_followers", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spotify_monthly_listeners">Oyentes Mensuales en Spotify</Label>
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
                  <Label htmlFor="tiktok_followers">Seguidores en TikTok</Label>
                  <Input 
                    id="tiktok_followers" 
                    type="number"
                    value={profile.socials.tiktok_followers} 
                    onChange={(e) => handleNumberInputChange("socials", "tiktok_followers", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtube_subscribers">Suscriptores en YouTube</Label>
                  <Input 
                    id="youtube_subscribers" 
                    type="number"
                    value={profile.socials.youtube_subscribers} 
                    onChange={(e) => handleNumberInputChange("socials", "youtube_subscribers", e.target.value)} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mailing_list_size">Tamaño de Lista de Correo</Label>
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

        {/* Discografía */}
        <TabsContent value="discography">
          <Card>
            <CardHeader>
              <CardTitle>Discografía</CardTitle>
              <CardDescription>
                Información sobre tus lanzamientos musicales
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
                    <p className="text-sm text-muted-foreground">No hay EPs registrados</p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <Input 
                      placeholder="Añadir nuevo EP"
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
                <Label>Singles Lanzados</Label>
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
                    <p className="text-sm text-muted-foreground">No hay singles registrados</p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <Input 
                      placeholder="Añadir nuevo single"
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
                <Label>Próximos Lanzamientos</Label>
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
                    <p className="text-sm text-muted-foreground">No hay próximos lanzamientos registrados</p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <Input 
                      placeholder="Añadir próximo lanzamiento"
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
                <Label htmlFor="visual_concept">Concepto Visual</Label>
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

        {/* Historia en Vivo */}
        <TabsContent value="live">
          <Card>
            <CardHeader>
              <CardTitle>Historia en Vivo</CardTitle>
              <CardDescription>
                Detalles sobre tus actuaciones en vivo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Momentos Destacados</Label>
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
                    <p className="text-sm text-muted-foreground">No hay momentos destacados registrados</p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <Input 
                      placeholder="Añadir momento destacado"
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
                  <Label htmlFor="avg_capacity">Capacidad Promedio</Label>
                  <Input 
                    id="avg_capacity" 
                    type="number"
                    value={profile.live_history.avg_capacity} 
                    onChange={(e) => handleNumberInputChange("live_history", "avg_capacity", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avg_ticket_price_ars">Precio Promedio de Entradas (ARS)</Label>
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

        {/* Financiero */}
        <TabsContent value="financials">
          <Card>
            <CardHeader>
              <CardTitle>Información Financiera</CardTitle>
              <CardDescription>
                Detalles sobre tu presupuesto y gastos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="annual_expenses_ars">Gastos Anuales (ARS)</Label>
                  <Input 
                    id="annual_expenses_ars" 
                    type="number"
                    value={profile.financials.annual_expenses_ars} 
                    onChange={(e) => handleNumberInputChange("financials", "annual_expenses_ars", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget_per_launch_ars">Presupuesto por Lanzamiento (ARS)</Label>
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