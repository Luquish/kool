import storage from './storage';

export interface Transaction {
  date: string;
  amount: number;
  type: 'purchase' | 'use';
  description: string;
}

export interface UserCredits {
  credits: number;
  transactions: Transaction[];
}

export async function getUserCredits(email: string): Promise<UserCredits> {
  try {
    const creditsPath = `storage/${email}/credits.json`;
    const credits = await storage.getItem(creditsPath);
    
    if (!credits) {
      throw new Error('Error al obtener créditos');
    }
    
    return credits;
  } catch (error) {
    console.error('Error al leer créditos:', error);
    return { credits: 0, transactions: [] };
  }
}

export async function updateUserCredits(email: string, amount: number, type: 'purchase' | 'use', description: string): Promise<UserCredits> {
  try {
    const creditsPath = `storage/${email}/credits.json`;
    const currentCredits = await storage.getItem(creditsPath);
    
    if (!currentCredits) {
      throw new Error('No se encontraron créditos para el usuario');
    }

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
    return updatedCredits;
  } catch (error) {
    console.error('Error al actualizar créditos:', error);
    throw error;
  }
}

export async function hasEnoughCredits(email: string, amount: number): Promise<boolean> {
  try {
    const { credits } = await getUserCredits(email);
    return credits >= amount;
  } catch (error) {
    console.error('Error al verificar créditos:', error);
    return false;
  }
} 