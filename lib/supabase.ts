import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Cache temporal para optimizar rendimiento
const cache = {
  profiles: new Map<string, any>(),
  credits: new Map<string, number>(),
  lastUpdated: new Map<string, number>()
};

const CACHE_DURATION = 5000; // 5 segundos

// Helper para verificar si el caché es válido
const isCacheValid = (key: string) => {
  const lastUpdated = cache.lastUpdated.get(key);
  return lastUpdated && Date.now() - lastUpdated < CACHE_DURATION;
};

// Helpers para manejo de créditos
export async function getUserCredits(userId: string) {
  const cacheKey = `credits-${userId}`;
  
  // Verificar caché
  if (isCacheValid(cacheKey) && cache.credits.has(userId)) {
    return cache.credits.get(userId);
  }

  try {
    const { data, error } = await supabase
      .from('credits')
      .select('amount')
      .eq('id', userId)
      .single();

    if (error) throw error;
    
    const credits = data?.amount || 0;
    
    // Actualizar caché
    cache.credits.set(userId, credits);
    cache.lastUpdated.set(cacheKey, Date.now());
    
    return credits;
  } catch (error) {
    console.error('Error fetching credits:', error);
    return cache.credits.get(userId) || 0; // Fallback a caché si existe
  }
}

export async function updateCredits(userId: string, amount: number, type: 'purchase' | 'use', description: string) {
  try {
    const { data: credits, error: creditsError } = await supabase
      .from('credits')
      .select('amount')
      .eq('id', userId)
      .single();

    if (creditsError) throw creditsError;

    const newAmount = type === 'purchase' 
      ? (credits?.amount || 0) + amount 
      : (credits?.amount || 0) - amount;

    // Actualizar caché optimistamente
    cache.credits.set(userId, newAmount);
    cache.lastUpdated.set(`credits-${userId}`, Date.now());

    const { error: updateError } = await supabase
      .from('credits')
      .upsert({ id: userId, amount: newAmount });

    if (updateError) {
      // Revertir caché si hay error
      cache.credits.set(userId, credits?.amount || 0);
      throw updateError;
    }

    const { error: transactionError } = await supabase
      .from('credit_transactions')
      .insert({
        user_id: userId,
        amount,
        type,
        description
      });

    if (transactionError) throw transactionError;

    return newAmount;
  } catch (error) {
    console.error('Error updating credits:', error);
    throw error;
  }
}

// Helpers para chat
export async function saveChatMessage(
  userId: string, 
  content: string, 
  role: 'user' | 'assistant',
  agentType: string,
  agentName: string
) {
  const { error } = await supabase
    .from('chat_messages')
    .insert({
      user_id: userId,
      content,
      role,
      agent_type: agentType,
      agent_name: agentName
    });

  if (error) throw error;
}

export async function getChatHistory(userId: string) {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

// Helpers para perfil
export async function getProfile(userId: string) {
  const cacheKey = `profile-${userId}`;
  
  // Verificar caché
  if (isCacheValid(cacheKey) && cache.profiles.has(userId)) {
    return cache.profiles.get(userId);
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    
    // Actualizar caché
    cache.profiles.set(userId, data);
    cache.lastUpdated.set(cacheKey, Date.now());
    
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return cache.profiles.get(userId); // Fallback a caché si existe
  }
}

export async function updateProfile(userId: string, profile: any) {
  try {
    // Actualizar caché optimistamente
    cache.profiles.set(userId, { ...cache.profiles.get(userId), ...profile });
    cache.lastUpdated.set(`profile-${userId}`, Date.now());

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        ...profile,
        updated_at: new Date().toISOString()
      });

    if (error) {
      // Invalidar caché si hay error
      cache.profiles.delete(userId);
      throw error;
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}

// Función para limpiar caché
export function clearCache() {
  cache.profiles.clear();
  cache.credits.clear();
  cache.lastUpdated.clear();
} 