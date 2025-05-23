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

// Helpers para manejo de créditos
export async function getUserCredits(userId: string) {
  const { data, error } = await supabase
    .from('credits')
    .select('amount')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data?.amount || 0;
}

export async function updateCredits(userId: string, amount: number, type: 'purchase' | 'use', description: string) {
  const { data: credits, error: creditsError } = await supabase
    .from('credits')
    .select('amount')
    .eq('id', userId)
    .single();

  if (creditsError) throw creditsError;

  const newAmount = type === 'purchase' 
    ? (credits?.amount || 0) + amount 
    : (credits?.amount || 0) - amount;

  const { error: updateError } = await supabase
    .from('credits')
    .upsert({ id: userId, amount: newAmount });

  if (updateError) throw updateError;

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
export async function updateProfile(userId: string, profile: any) {
  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      ...profile,
      updated_at: new Date().toISOString()
    });

  if (error) throw error;
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
} 