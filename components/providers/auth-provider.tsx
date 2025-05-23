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
      console.log('🔄 [Auth] Iniciando carga de datos del usuario:', userId)
      setIsLoading(true)

      // 1. Cargar perfil primero para verificar onboarding
      const profileResponse = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profileResponse.error) {
        console.error('❌ [Auth] Error cargando perfil:', profileResponse.error)
      } else {
        console.log('👤 [Auth] Perfil cargado:', {
          id: profileResponse.data.id,
          onboarding_completed: profileResponse.data.onboarding_completed
        })
        setProfile(profileResponse.data)
      }

      // 2. Cargar créditos
      const creditsResponse = await supabase
        .from('credits')
        .select('amount')
        .eq('id', userId)
        .single()

      if (creditsResponse.error) {
        console.error('❌ [Auth] Error cargando créditos:', creditsResponse.error)
      } else {
        const newCredits = creditsResponse.data?.amount || 0
        console.log('💰 [Auth] Créditos cargados:', newCredits)
        setCredits(newCredits)
      }

      // 3. Cargar estrategia
      const strategyResponse = await supabase
        .from('strategies')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (strategyResponse.error) {
        if (strategyResponse.error.code === 'PGRST116') {
          console.log('📊 [Auth] No se encontró estrategia para el usuario')
          setStrategy(null)
        } else {
          console.error('❌ [Auth] Error cargando estrategia:', strategyResponse.error)
        }
      } else if (strategyResponse.data) {
        console.log('📈 [Auth] Estrategia cargada')
        const formattedCalendar = strategyResponse.data.calendar.map((event: any) => ({
          ...event,
          date: new Date(event.date).toISOString()
        }))
        setStrategy({
          calendar: formattedCalendar,
          task_tracker: strategyResponse.data.task_tracker
        })
      }

    } catch (error) {
      console.error('❌ [Auth] Error general cargando datos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Configurar suscripciones y estado inicial
  useEffect(() => {
    let profileSubscription: RealtimeChannel | null = null
    let creditsSubscription: RealtimeChannel | null = null
    let strategySubscription: RealtimeChannel | null = null
    let authSubscription: any = null

    const init = async () => {
      try {
        console.log('🚀 [Auth] Iniciando configuración')
        
        // 1. Verificar sesión actual
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('❌ [Auth] Error obteniendo sesión:', sessionError)
          setUser(null)
          setIsLoading(false)
          setIsInitializing(false)
          return
        }

        // Si no hay sesión activa, establecer estado inicial
        if (!session) {
          console.log('👤 [Auth] No hay sesión activa')
          setUser(null)
          setProfile(null)
          setCredits(null)
          setStrategy(null)
          setIsLoading(false)
          setIsInitializing(false)
          return
        }

        // Si hay sesión, configurar todo
        const currentUser = session.user
        console.log('👤 [Auth] Usuario autenticado:', currentUser.id)
        setUser(currentUser)

        // 2. Cargar datos iniciales
        await loadUserData(currentUser.id)

        // 3. Configurar suscripciones en tiempo real
        console.log('📡 [Auth] Configurando suscripciones...')

        // Suscripción a cambios en el perfil
        profileSubscription = supabase
          .channel('profile-changes')
          .on('postgres_changes' as any, {
            event: '*',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${currentUser.id}`
          }, async (payload: RealtimePostgresChangesPayload<any>) => {
            console.log('👤 [Auth] Cambio en perfil detectado:', {
              onboarding_completed: payload.new?.onboarding_completed
            })
            if (payload.new) {
              setProfile(payload.new)
            }
          })
          .subscribe((status) => {
            console.log('📡 [Auth] Estado de suscripción a perfil:', status)
          })

        // Suscripción a cambios en créditos
        creditsSubscription = supabase
          .channel('credits-changes')
          .on('postgres_changes' as any, {
            event: '*',
            schema: 'public',
            table: 'credits',
            filter: `id=eq.${currentUser.id}`
          }, async (payload: RealtimePostgresChangesPayload<any>) => {
            console.log('💰 [Auth] Cambio en créditos detectado:', payload.new?.amount)
            if (payload.new && 'amount' in payload.new) {
              setCredits(payload.new.amount)
            }
          })
          .subscribe((status) => {
            console.log('📡 [Auth] Estado de suscripción a créditos:', status)
          })

        // Suscripción a cambios en estrategia
        strategySubscription = supabase
          .channel('strategy-changes')
          .on('postgres_changes' as any, {
            event: '*',
            schema: 'public',
            table: 'strategies',
            filter: `user_id=eq.${currentUser.id}`
          }, async (payload: any) => {
            console.log('📈 [Auth] Cambio en estrategia detectado')
            if (payload.new) {
              const formattedCalendar = payload.new.calendar.map((event: any) => ({
                ...event,
                date: new Date(event.date).toISOString()
              }))
              setStrategy({
                calendar: formattedCalendar,
                task_tracker: payload.new.task_tracker
              })
            }
          })
          .subscribe((status) => {
            console.log('📡 [Auth] Estado de suscripción a estrategia:', status)
          })

        // 4. Suscripción a cambios de autenticación
        authSubscription = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('🔐 [Auth] Cambio de estado de autenticación:', event)
          
          if (event === 'SIGNED_OUT') {
            console.log('👋 [Auth] Usuario cerró sesión')
            setUser(null)
            setProfile(null)
            setCredits(null)
            setStrategy(null)
            return
          }

          const currentUser = session?.user
          if (currentUser) {
            console.log('🔑 [Auth] Usuario autenticado:', currentUser.id)
            setUser(currentUser)
            await loadUserData(currentUser.id)
          }
        })

      } catch (error) {
        console.error('❌ [Auth] Error en configuración:', error)
        setUser(null)
        setProfile(null)
        setCredits(null)
        setStrategy(null)
      } finally {
        console.log('✅ [Auth] Finalizando inicialización')
        setIsInitializing(false)
        setIsLoading(false)
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

  // Log del estado actual para debugging
  useEffect(() => {
    console.log('🎯 [Auth] Estado actual:', {
      isInitializing,
      isLoading,
      hasUser: !!user,
      hasProfile: !!profile,
      onboardingCompleted: profile?.onboarding_completed,
      hasStrategy: !!strategy,
      credits
    })
  }, [isInitializing, isLoading, user, profile, strategy, credits])

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