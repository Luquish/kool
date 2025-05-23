"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { RealtimePostgresChangesPayload, RealtimeChannel } from '@supabase/supabase-js'

interface AuthContextType {
  user: any
  profile: any
  credits: number | null
  strategy: any | null
  isLoading: boolean
  isInitializing: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  credits: null,
  strategy: null,
  isLoading: true,
  isInitializing: true
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [credits, setCredits] = useState<number | null>(null)
  const [strategy, setStrategy] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitializing, setIsInitializing] = useState(true)

  // Función para cargar datos del usuario
  const loadUserData = async (userId: string) => {
    try {
      console.log('🔄 [Auth] Cargando datos del usuario:', userId)
      setIsLoading(true)
      const [profileResponse, creditsResponse, strategyResponse] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single(),
        supabase
          .from('credits')
          .select('amount')
          .eq('id', userId)
          .single(),
        supabase
          .from('strategies')
          .select('*')
          .eq('user_id', userId)
          .single()
      ])

      console.log('📊 [Auth] Respuestas recibidas:', {
        profile: profileResponse.error ? 'error' : 'ok',
        credits: creditsResponse.error ? 'error' : 'ok',
        strategy: strategyResponse.error ? 'error' : 'ok'
      })

      if (!profileResponse.error) {
        setProfile(profileResponse.data)
      }
      if (!creditsResponse.error) {
        setCredits(creditsResponse.data?.amount || 0)
      }
      if (!strategyResponse.error && strategyResponse.data) {
        const formattedCalendar = strategyResponse.data.calendar.map((event: any) => ({
          ...event,
          date: new Date(event.date).toISOString()
        }));
        setStrategy({
          calendar: formattedCalendar,
          task_tracker: strategyResponse.data.task_tracker
        });
      }
    } catch (error) {
      console.error('❌ [Auth] Error cargando datos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let profileSubscription: RealtimeChannel | null = null;
    let creditsSubscription: RealtimeChannel | null = null;
    let strategySubscription: RealtimeChannel | null = null;
    let authSubscription: any = null

    const init = async () => {
      try {
        console.log('🚀 [Auth] Iniciando configuración')
        
        // 1. Verificar sesión actual
        const { data: { user: currentUser }, error: sessionError } = await supabase.auth.getUser()
        if (sessionError) throw sessionError
        
        console.log('👤 [Auth] Usuario actual:', currentUser?.id || 'no autenticado')
        setUser(currentUser)

        if (currentUser) {
          // 2. Cargar datos del usuario
          await loadUserData(currentUser.id)

          // 3. Configurar suscripciones
          console.log('📡 [Auth] Configurando suscripciones...')
          profileSubscription = supabase
            .channel('profile-changes')
            .on('postgres_changes' as any, {
              event: '*',
              schema: 'public',
              table: 'profiles',
              filter: `id=eq.${currentUser.id}`
            }, async (payload: RealtimePostgresChangesPayload<{ onboarding_completed: boolean }>) => {
              console.log('👤 [Auth] Cambio en perfil detectado:', payload.new)
              if (payload.new) {
                setProfile(payload.new)
                if ('onboarding_completed' in payload.new) {
                  console.log('✅ [Auth] Estado de onboarding actualizado:', payload.new.onboarding_completed)
                }
              }
            })
            .subscribe()

          creditsSubscription = supabase
            .channel('credits-changes')
            .on('postgres_changes' as any, {
              event: '*',
              schema: 'public',
              table: 'credits',
              filter: `id=eq.${currentUser.id}`
            }, async (payload: RealtimePostgresChangesPayload<{ amount: number }>) => {
              console.log('💰 [Auth] Cambio en créditos detectado:', payload.new)
              if (payload.new && 'amount' in payload.new) {
                setCredits(payload.new.amount)
              }
            })
            .on('broadcast', { event: 'credits-update' }, async (payload) => {
              console.log('🔄 [Auth] Actualizando créditos por broadcast:', payload)
              if (payload.payload.userId === currentUser.id) {
                const { data, error } = await supabase
                  .from('credits')
                  .select('amount')
                  .eq('id', currentUser.id)
                  .single()
                
                if (!error && data) {
                  setCredits(data.amount)
                }
              }
            })
            .subscribe()

          strategySubscription = supabase
            .channel('strategy-changes')
            .on('postgres_changes' as any, {
              event: '*',
              schema: 'public',
              table: 'strategies',
              filter: `user_id=eq.${currentUser.id}`
            }, async (payload: any) => {
              console.log('📈 [Auth] Cambio en estrategia detectado:', payload.new)
              if (payload.new) {
                const formattedCalendar = payload.new.calendar.map((event: any) => ({
                  ...event,
                  date: new Date(event.date).toISOString()
                }));
                setStrategy({
                  calendar: formattedCalendar,
                  task_tracker: payload.new.task_tracker
                });
              }
            })
            .subscribe()
        }

        // 4. Configurar suscripción a cambios de autenticación
        authSubscription = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('🔐 [Auth] Cambio de estado de autenticación:', event)
          const currentUser = session?.user
          setUser(currentUser || null)
          
          if (currentUser) {
            await loadUserData(currentUser.id)
          } else {
            setProfile(null)
            setCredits(null)
            setStrategy(null)
          }
        })

      } catch (error) {
        console.error('❌ [Auth] Error en configuración:', error)
      } finally {
        console.log('✅ [Auth] Finalizando inicialización')
        setTimeout(() => {
          setIsInitializing(false)
        }, 500)
      }
    }

    // Iniciar configuración
    init()

    // Cleanup
    return () => {
      console.log('🧹 [Auth] Limpiando suscripciones')
      profileSubscription?.unsubscribe()
      creditsSubscription?.unsubscribe()
      strategySubscription?.unsubscribe()
      authSubscription?.unsubscribe?.()
    }
  }, [])

  console.log('🎯 [Auth] Estado actual:', {
    isInitializing,
    isLoading,
    hasUser: !!user,
    hasProfile: !!profile,
    hasStrategy: !!strategy,
    credits
  })

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-primary font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, profile, credits, strategy, isLoading, isInitializing }}>
      {children}
    </AuthContext.Provider>
  )
} 