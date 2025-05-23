'use client';

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase, updateCredits } from '@/lib/supabase';
import { useEffect, useState } from "react";

interface CreditModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onSuccess: () => void;
}

export default function CreditModal({ isOpen, onClose, onSuccess }: CreditModalProps) {
  const [amount, setAmount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && onClose && !isLoading) {
      onClose();
    }
  };

  const handlePurchase = async () => {
    try {
      setIsLoading(true);

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('Usuario no autenticado');
      }

      await updateCredits(
        user.id,
        amount,
        'purchase',
        `Compra de ${amount} crédito${amount !== 1 ? 's' : ''}`
      );
      
      toast({
        title: "¡Compra exitosa!",
        description: `Has comprado ${amount} crédito${amount !== 1 ? 's' : ''} por $${amount * 3} USD`,
      });

      onSuccess();
      if (onClose) onClose();
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
    <>
      <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm" onClick={handleBackdropClick}>
        <div className="fixed left-[50%] top-[50%] z-[101] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200">
          <div className="flex flex-col space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Buy Credits</h2>
            
            <div className="space-y-4">
              <p className="text-muted-foreground">1 credit = $3 USD</p>
              
              <div className="flex items-center justify-center gap-4">
                <Button
                  onClick={() => setAmount(Math.max(1, amount - 1))}
                  disabled={isLoading}
                  variant="outline"
                  size="icon"
                >
                  -
                </Button>
                <span className="text-xl font-semibold min-w-[100px] text-center">
                  {amount} credit{amount !== 1 ? 's' : ''}
                </span>
                <Button
                  onClick={() => setAmount(amount + 1)}
                  disabled={isLoading}
                  variant="outline"
                  size="icon"
                >
                  +
                </Button>
              </div>
              
              <p className="text-lg font-semibold text-center">
                Total: ${amount * 3} USD
              </p>
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
      </div>
    </>
  );
} 