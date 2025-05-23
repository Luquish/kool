import { create } from 'zustand';
import { supabase, getProfile, updateProfile } from '@/lib/supabase';

// Comprobar si estamos en el cliente (navegador)
const isClient = typeof window !== 'undefined';

// Definición de tipos para el estado del onboarding
interface OnboardingState {
  // Datos básicos (paso 1)
  project_type: string;
  artist_name: string;
  members: string[];
  guest_members: string[];
  creative_team: string[];
  distributor: string;
  label_status: string;
  label_name: string;
  language: string;
  
  // Redes sociales (paso 2)
  socials: {
    instagram_followers: number;
    spotify_monthly_listeners: number;
    tiktok_followers: number;
    youtube_subscribers: number;
    mailing_list_size: number;
  };
  
  // Discografía (paso 3)
  discography: {
    eps: any[];
    singles_released: any[];
    upcoming_releases: any[];
    visual_concept: string;
  };
  
  // Historia en vivo (paso 4)
  live_history: {
    highlights: any[];
    avg_capacity: number;
    avg_ticket_price_ars: number;
  };
  
  // Financieros
  financials: {
    annual_expenses_ars: number;
    budget_per_launch_ars: number;
  };
  
  // Variable para guardar si el onboarding está completo
  onboarding_completed: boolean;
  
  // Acciones
  reset: () => void;
  setBasicInfo: (data: Partial<OnboardingState>) => void;
  setSocials: (data: Partial<{[key: string]: number}>) => void;
  setDiscography: (data: Partial<{[key: string]: any}>) => void;
  setLiveHistory: (data: Partial<{[key: string]: any}>) => void;
  updateBasicInfo: (data: Partial<OnboardingBasicInfo>) => void;
  updateSocials: (data: Partial<OnboardingSocials>) => void;
  updateDiscography: (data: Partial<OnboardingDiscography>) => void;
  updateLiveHistory: (data: Partial<OnboardingLiveHistory>) => void;
  loadFromStorage: (email: string) => Promise<void>;
  saveToStorage: () => Promise<boolean>;
  finishOnboarding: () => Promise<boolean>;
}

// Tipos para cada sección
interface OnboardingBasicInfo {
  project_type: string;
  artist_name: string;
  members: string[];
  guest_members: string[];
  creative_team: string[];
  distributor: string;
  label_status: string;
  label_name: string;
  language: string;
}

interface OnboardingSocials {
  socials: {
    instagram_followers: number;
    spotify_monthly_listeners: number;
    tiktok_followers: number;
    youtube_subscribers: number;
    mailing_list_size: number;
  };
}

interface OnboardingDiscography {
  discography: {
    eps: any[];
    singles_released: any[];
    upcoming_releases: any[];
    visual_concept: string;
  };
}

interface OnboardingLiveHistory {
  live_history: {
    highlights: any[];
    avg_capacity: number;
    avg_ticket_price_ars: number;
  };
  financials: {
    annual_expenses_ars: number;
    budget_per_launch_ars: number;
  };
}

// Estado inicial
const initialState = {
  project_type: '',
  artist_name: '',
  members: [],
  guest_members: [],
  creative_team: [],
  distributor: '',
  label_status: 'independent',
  label_name: '',
  language: 'es',
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
    visual_concept: ''
  },
  live_history: {
    highlights: [],
    avg_capacity: 0,
    avg_ticket_price_ars: 0
  },
  financials: {
    annual_expenses_ars: 0,
    budget_per_launch_ars: 0
  },
  onboarding_completed: false
};

// Usuario actual (correo electrónico)
let currentUserEmail: string | null = null;

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  ...initialState,
  
  // Reiniciar estado
  reset: () => set(initialState),
  
  // Método para actualizar información básica (usado por BasicInfoStep)
  setBasicInfo: (data) => set((state) => ({
    ...state,
    ...data
  })),
  
  // Método para actualizar redes sociales (usado por SocialsStep)
  setSocials: (data) => set((state) => ({
    ...state,
    socials: {
      ...state.socials,
      ...data
    }
  })),
  
  // Método para actualizar discografía (usado por DiscographyStep)
  setDiscography: (data) => set((state) => {
    // Si el dato contiene discography, actualizamos correctamente
    if (data.discography) {
      return {
        ...state,
        discography: {
          ...state.discography,
          ...data.discography
        }
      };
    }
    
    // Si no, asumimos que es una actualización directa a discography
    return {
      ...state,
      discography: {
        ...state.discography,
        ...data
      }
    };
  }),
  
  // Método para actualizar historia en vivo (usado por LiveHistoryStep)
  setLiveHistory: (data) => set((state) => {
    const newState = { ...state };
    
    // Si hay datos de live_history, actualizamos correctamente
    if (data.live_history) {
      newState.live_history = {
        ...state.live_history,
        ...data.live_history
      };
    }
    
    // Si hay datos de financials, actualizamos correctamente
    if (data.financials) {
      newState.financials = {
        ...state.financials,
        ...data.financials
      };
    }
    
    return newState;
  }),
  
  // Actualizar información básica
  updateBasicInfo: (data) => set((state) => ({
    ...state,
    ...data
  })),
  
  // Actualizar redes sociales
  updateSocials: (data) => set((state) => ({
    ...state,
    socials: {
      ...state.socials,
      ...data.socials
    }
  })),
  
  // Actualizar discografía
  updateDiscography: (data) => set((state) => ({
    ...state,
    discography: {
      ...state.discography,
      ...data.discography
    }
  })),
  
  // Actualizar historia en vivo
  updateLiveHistory: (data) => set((state) => ({
    ...state,
    live_history: {
      ...state.live_history,
      ...data.live_history
    },
    financials: {
      ...state.financials,
      ...data.financials
    }
  })),
  
  // Cargar datos desde Supabase
  loadFromStorage: async (email: string) => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('No hay usuario autenticado');
      
      const profile = await getProfile(user.id);
      
      if (profile) {
        set((state) => ({
          ...state,
          project_type: profile.project_type || state.project_type,
          artist_name: profile.artist_name || state.artist_name,
          members: profile.members || state.members,
          guest_members: profile.guest_members || state.guest_members,
          creative_team: profile.creative_team || state.creative_team,
          distributor: profile.distributor || state.distributor,
          label_status: profile.label_status || state.label_status,
          label_name: profile.label_name || state.label_name,
          language: profile.language || state.language,
          socials: {
            ...state.socials,
            ...(profile.socials || {})
          },
          discography: {
            ...state.discography,
            ...(profile.discography || {})
          },
          live_history: {
            highlights: profile.live_history?.highlights || state.live_history.highlights,
            avg_capacity: profile.live_history?.avg_capacity || state.live_history.avg_capacity,
            avg_ticket_price_ars: profile.live_history?.avg_ticket_price_ars || state.live_history.avg_ticket_price_ars
          },
          financials: {
            ...state.financials,
            ...(profile.financials || {})
          },
          onboarding_completed: profile.onboarding_completed || false
        }));
      }
    } catch (error) {
      console.error('Error cargando datos de onboarding:', error);
    }
  },
  
  // Guardar datos en Supabase (solo para guardar progreso temporal)
  saveToStorage: async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('No hay usuario autenticado');
      
      const state = get();
      
      // Guardar datos de progreso en localStorage solo mientras no está completado
      if (isClient && !state.onboarding_completed) {
        localStorage.setItem(`onboarding_progress_${user.id}`, JSON.stringify({
          project_type: state.project_type,
          artist_name: state.artist_name,
          members: state.members,
          guest_members: state.guest_members,
          creative_team: state.creative_team,
          distributor: state.distributor,
          label_status: state.label_status,
          label_name: state.label_name,
          language: state.language,
          socials: state.socials,
          discography: state.discography,
          live_history: state.live_history,
          financials: state.financials,
          onboarding_completed: false
        }));
      }
      
      return true;
    } catch (error) {
      console.error('Error guardando progreso temporal de onboarding:', error);
      return false;
    }
  },
  
  // Finalizar onboarding y guardar datos definitivos al perfil
  finishOnboarding: async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('No hay usuario autenticado');
      
      const state = get();
      
      // Preparar los datos finales a guardar
      const onboardingData = {
        project_type: state.project_type,
        artist_name: state.artist_name,
        members: state.members,
        guest_members: state.guest_members,
        creative_team: state.creative_team,
        distributor: state.distributor,
        label_status: state.label_status,
        label_name: state.label_name,
        language: state.language,
        socials: state.socials,
        discography: state.discography,
        live_history: state.live_history,
        financials: state.financials,
        onboarding_completed: true,
        updated_at: new Date().toISOString()
      };
      
      console.log('🔄 [Onboarding] Guardando datos finales:', onboardingData);
      
      // Guardar datos finales en el perfil del usuario
      const { error: updateError } = await supabase
        .from('profiles')
        .update(onboardingData)
        .eq('id', user.id);

      if (updateError) {
        console.error('❌ [Onboarding] Error actualizando perfil:', updateError);
        throw updateError;
      }

      console.log('✅ [Onboarding] Perfil actualizado correctamente');
      
      // Limpiar datos temporales
      if (isClient) {
        localStorage.removeItem(`onboarding_progress_${user.id}`);
      }
      
      // Actualizar estado local
      set({ onboarding_completed: true });
      
      return true;
    } catch (error) {
      console.error('❌ [Onboarding] Error finalizando onboarding:', error);
      return false;
    }
  }
})); 