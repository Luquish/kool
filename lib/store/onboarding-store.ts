import { create } from 'zustand';
import storage from '@/lib/storage';

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
    eps: string[];
    singles_released: string[];
    upcoming_releases: string[];
    visual_concept: string;
  };
  
  // Historia en vivo (paso 4)
  live_history: {
    highlights: string[];
    avg_capacity: number;
    avg_ticket_price_ars: number;
  };
  
  // Financieros
  financials: {
    annual_expenses_ars: number;
    budget_per_launch_ars: number;
  };
  
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
    eps: string[];
    singles_released: string[];
    upcoming_releases: string[];
    visual_concept: string;
  };
}

interface OnboardingLiveHistory {
  live_history: {
    highlights: string[];
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
  }
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
  setDiscography: (data) => set((state) => ({
    ...state,
    discography: {
      ...state.discography,
      ...data
    }
  })),
  
  // Método para actualizar historia en vivo (usado por LiveHistoryStep)
  setLiveHistory: (data) => set((state) => ({
    ...state,
    live_history: {
      ...state.live_history,
      ...data
    }
  })),
  
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
  
  // Cargar datos desde almacenamiento
  loadFromStorage: async (email) => {
    try {
      currentUserEmail = email;
      const profile = await storage.getUserProfile(email);
      
      if (profile) {
        // Actualizar estado con los datos del perfil
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
            ...state.live_history,
            ...(profile.live_history || {})
          },
          financials: {
            ...state.financials,
            ...(profile.financials || {})
          }
        }));
      }
    } catch (error) {
      console.error('Error cargando datos de onboarding:', error);
    }
  },
  
  // Guardar datos en almacenamiento
  saveToStorage: async () => {
    try {
      if (!currentUserEmail) {
        const email = await storage.getCurrentUser();
        if (!email) {
          throw new Error('No hay usuario autenticado');
        }
        currentUserEmail = email;
      }
      
      const state = get();
      const email = currentUserEmail; // Crear variable para asegurar que no es null
      
      if (!email) {
        throw new Error('No hay usuario autenticado');
      }
      
      // Preparar los datos a guardar
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
        financials: state.financials
      };
      
      // Guardar datos en el perfil del usuario
      await storage.saveOnboardingData(email, onboardingData);
      return true;
    } catch (error) {
      console.error('Error guardando datos de onboarding:', error);
      return false;
    }
  }
})); 