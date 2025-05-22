import { NextRequest, NextResponse } from 'next/server';
import storage from '@/lib/storage';
import type { UserCredits, Transaction } from '@/lib/credits';

export async function GET(request: NextRequest) {
  try {
    const currentUser = await storage.getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Usuario no autenticado' }, { status: 401 });
    }

    const creditsPath = `storage/${currentUser}/credits.json`;
    const credits = await storage.getItem(creditsPath);
    
    if (!credits) {
      // Si no existen créditos, crear los iniciales
      const initialCredits: UserCredits = {
        credits: 3,
        transactions: [{
          date: new Date().toISOString(),
          amount: 3,
          type: 'purchase',
          description: 'Welcome credits'
        }]
      };
      
      await storage.saveItem(creditsPath, initialCredits);
      return NextResponse.json(initialCredits);
    }
    
    return NextResponse.json(credits);
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
    const currentUser = await storage.getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Usuario no autenticado' }, { status: 401 });
    }
    
    const { amount, type, description } = await request.json();
    
    if (!amount || amount < 1) {
      return NextResponse.json({ error: 'Cantidad inválida' }, { status: 400 });
    }

    const creditsPath = `storage/${currentUser}/credits.json`;
    const currentCredits = await storage.getItem(creditsPath) || {
      credits: 0,
      transactions: []
    };
    
    const newTransaction: Transaction = {
      date: new Date().toISOString(),
      amount,
      type,
      description
    };

    const updatedCredits: UserCredits = {
      credits: type === 'purchase' 
        ? currentCredits.credits + amount 
        : currentCredits.credits - amount,
      transactions: [...currentCredits.transactions, newTransaction]
    };

    await storage.saveItem(creditsPath, updatedCredits);
    return NextResponse.json(updatedCredits);
  } catch (error) {
    console.error('Error al procesar la operación:', error);
    return NextResponse.json(
      { error: 'Error al procesar la operación', details: (error as Error).message },
      { status: 500 }
    );
  }
} 