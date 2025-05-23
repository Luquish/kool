export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          onboarding_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          onboarding_completed?: boolean
          updated_at?: string
        }
      }
      credits: {
        Row: {
          id: string
          amount: number
          updated_at: string
        }
        Insert: {
          id: string
          amount?: number
          updated_at?: string
        }
        Update: {
          id?: string
          amount?: number
          updated_at?: string
        }
      }
      credit_transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          type: 'purchase' | 'use'
          description: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          type: 'purchase' | 'use'
          description: string
          created_at?: string
        }
        Update: {
          user_id?: string
          amount?: number
          type?: 'purchase' | 'use'
          description?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          user_id: string
          role: 'user' | 'assistant'
          content: string
          agent_type: string
          agent_name: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: 'user' | 'assistant'
          content: string
          agent_type: string
          agent_name: string
          created_at?: string
        }
        Update: {
          user_id?: string
          role?: 'user' | 'assistant'
          content?: string
          agent_type?: string
          agent_name?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 