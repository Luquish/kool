import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import storage from '@/lib/storage';

interface CreditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreditModal({ isOpen, onClose, onSuccess }: CreditModalProps) {
  const [amount, setAmount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  if (!isOpen) return null;

  const handlePurchase = async () => {
    try {
      setIsLoading(true);

      // Obtener el usuario actual
      const currentUser = await storage.getCurrentUser();
      if (!currentUser) {
        throw new Error('Usuario no autenticado');
      }

      // Obtener los créditos actuales
      const creditsPath = `storage/${currentUser}/credits.json`;
      const currentCredits = await storage.getItem(creditsPath) || { credits: 0, transactions: [] };

      // Crear la nueva transacción
      const newTransaction = {
        date: new Date().toISOString(),
        amount: amount,
        type: 'purchase',
        description: `Compra de ${amount} crédito${amount !== 1 ? 's' : ''}`
      };

      // Actualizar los créditos
      const updatedCredits = {
        credits: currentCredits.credits + amount,
        transactions: [...currentCredits.transactions, newTransaction]
      };

      // Guardar los créditos actualizados
      await storage.saveItem(creditsPath, updatedCredits);
      
      toast({
        title: "¡Compra exitosa!",
        description: `Has comprado ${amount} crédito${amount !== 1 ? 's' : ''} por $${amount * 3} USD`,
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error en la compra:', error);
      toast({
        title: "Error",
        description: "No se pudo procesar la compra. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          disabled={isLoading}
        >
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold mb-4">Buy Credits</h2>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-2">1 credit = $3 USD</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setAmount(Math.max(1, amount - 1))}
              className="px-3 py-1 border rounded-md"
              disabled={isLoading}
            >
              -
            </button>
            <span className="text-xl font-semibold">{amount} credit{amount !== 1 ? 's' : ''}</span>
            <button
              onClick={() => setAmount(amount + 1)}
              className="px-3 py-1 border rounded-md"
              disabled={isLoading}
            >
              +
            </button>
          </div>
          <p className="text-lg font-semibold mt-2">Total: ${amount * 3} USD</p>
        </div>

        <Button
          onClick={handlePurchase}
          className="w-full bg-primary text-white hover:bg-primary/90"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            'Confirm Purchase'
          )}
        </Button>
      </div>
    </div>
  );
} 