import { NextRequest, NextResponse } from 'next/server';
import { supabase, getUserCredits, updateCredits } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Usuario no autenticado' }, { status: 401 });
    }

    const credits = await getUserCredits(user.id);
    
    if (credits === 0) {
      // Si no existen créditos, crear los iniciales
      await updateCredits(user.id, 3, 'purchase', 'Welcome credits');
      return NextResponse.json({ credits: 3 });
    }
    
    return NextResponse.json({ credits });
  } catch (error) {
    console.error('Error al obtener créditos:', error);
    return NextResponse.json(
      { error: 'Error al obtener créditos', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Usuario no autenticado' }, { status: 401 });
    }
    
    const { amount, type, description } = await request.json();
    
    if (!amount || amount < 1) {
      return NextResponse.json({ error: 'Cantidad inválida' }, { status: 400 });
    }

    const newAmount = await updateCredits(user.id, amount, type, description);
    return NextResponse.json({ credits: newAmount });
  } catch (error) {
    console.error('Error al procesar la operación:', error);
    return NextResponse.json(
      { error: 'Error al procesar la operación', details: (error as Error).message },
      { status: 500 }
    );
  }
} 