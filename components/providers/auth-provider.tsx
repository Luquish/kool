"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: any
  profile: any
  credits: number | null
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  credits: null,
  isLoading: true
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [credits, setCredits] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      try {
        console.log('Checking user...')
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        console.log('Auth response:', { user, authError })
        
        if (authError || !user) {
          console.log('No user found or error:', authError)
          setUser(null)
          setIsLoading(false)
          return
        }

        setUser(user)
        
        const [profileResponse, creditsResponse] = await Promise.all([
          supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single(),
          supabase
            .from('credits')
            .select('amount')
            .eq('id', user.id)
            .single()
        ])

        console.log('Profile response:', profileResponse)
        console.log('Profile data details:', {
          id: profileResponse.data?.id,
          onboarding_completed: profileResponse.data?.onboarding_completed,
          full_profile: profileResponse.data
        })
        console.log('Credits response:', creditsResponse)

        if (!profileResponse.error) {
          setProfile(profileResponse.data)
        }
        if (!creditsResponse.error) {
          setCredits(creditsResponse.data?.amount || 0)
        }
      } catch (error) {
        console.error("Error loading user data:", error)
      } finally {
        console.log('Setting isLoading to false')
        setIsLoading(false)
      }
    }

    // Check initial user
    checkUser()

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user)
        const [profileResponse, creditsResponse] = await Promise.all([
          supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single(),
          supabase
            .from('credits')
            .select('amount')
            .eq('id', session.user.id)
            .single()
        ])

        if (!profileResponse.error) {
          setProfile(profileResponse.data)
        }
        if (!creditsResponse.error) {
          setCredits(creditsResponse.data?.amount || 0)
        }
      } else {
        setUser(null)
        setProfile(null)
        setCredits(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, profile, credits, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
} 