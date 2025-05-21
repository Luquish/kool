'use client';

import { useState, useEffect, useRef } from 'react';
import storage from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Breadcrumb } from '@/components/ui/breadcrumb';

// Interfaz para mensaje
interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Obtener el usuario actual y su perfil
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await storage.getCurrentUser();
        setCurrentUser(user);
        
        if (user) {
          const profile = await storage.getUserProfile(user);
          setUserProfile(profile);
          
          // Recuperar historial de chat si existe
          try {
            const chatData = await fetch(`/api/storage?path=storage/${user}/chat.json`);
            if (chatData.ok) {
              const data = await chatData.json();
              // Convertir las cadenas de fecha en objetos Date
              const formattedMessages = data.data.map((msg: any) => ({
                ...msg, 
                timestamp: new Date(msg.timestamp)
              }));
              setMessages(formattedMessages);
            }
          } catch (error) {
            console.warn('No se encontró historial de chat');
          }
        }
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
      }
    };
    
    fetchUserData();
  }, []);

  // Desplazar al último mensaje cuando se añade uno nuevo
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Guardar mensajes
  const saveMessages = async (newMessages: Message[]) => {
    if (!currentUser) return;
    
    try {
      await fetch('/api/storage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: `storage/${currentUser}/chat.json`,
          data: newMessages
        }),
      });
    } catch (error) {
      console.error('Error al guardar mensajes:', error);
    }
  };

  // Enviar mensaje
  const handleSendMessage = async () => {
    if (!message.trim() || !currentUser) return;
    
    // Añadir mensaje del usuario
    const userMessage: Message = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setMessage('');
    setIsLoading(true);
    
    try {
      // Guardar mensajes
      await saveMessages(updatedMessages);
      
      // Enviar mensaje a la API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          email: currentUser
        }),
      });
      
      if (!response.ok) {
        throw new Error('Error al enviar mensaje');
      }
      
      const data = await response.json();
      
      // Añadir respuesta del asistente
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };
      
      const newMessages = [...updatedMessages, assistantMessage];
      setMessages(newMessages);
      
      // Guardar mensajes actualizados
      await saveMessages(newMessages);
    } catch (error) {
      console.error('Error en la conversación:', error);
      toast({
        title: 'Error',
        description: 'No se pudo procesar tu mensaje. Inténtalo de nuevo.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Formatear fecha
  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Si no hay usuario, mostrar mensaje
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>No has iniciado sesión</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Por favor, inicia sesión para acceder al chat.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 flex flex-col h-[calc(100vh-200px)]">
      <Breadcrumb 
        items={[{ href: '/chat', label: 'Chat' }]}
        className="mb-4" 
      />
      
      <h1 className="text-3xl font-bold mb-4">Chat con KoolAI</h1>
      
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">
            {userProfile?.artist_name ? `Conversación con ${userProfile.artist_name}` : 'Tu conversación'}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Consulta cualquier duda sobre tu estrategia musical
          </p>
          <Separator className="mt-2" />
        </CardHeader>
        <CardContent className="flex-1 p-0 relative">
          <ScrollArea className="h-[calc(100vh-350px)] px-4" ref={scrollAreaRef}>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <p className="text-muted-foreground mb-2">No hay mensajes aún</p>
                <p className="text-muted-foreground">Comienza la conversación con KoolAI</p>
              </div>
            ) : (
              <div className="space-y-4 py-4">
                {messages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <Avatar className="h-8 w-8">
                        <div className="bg-primary text-white rounded-full h-8 w-8 flex items-center justify-center">
                          K
                        </div>
                      </Avatar>
                    )}
                    <div className={`max-w-[80%] rounded-lg p-3 ${
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}>
                      <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                      <div className={`text-xs mt-1 ${
                        msg.role === 'user' 
                          ? 'text-primary-foreground/80' 
                          : 'text-muted-foreground'
                      }`}>
                        {formatTimestamp(msg.timestamp)}
                      </div>
                    </div>
                    {msg.role === 'user' && (
                      <Avatar className="h-8 w-8">
                        <div className="bg-muted text-foreground rounded-full h-8 w-8 flex items-center justify-center">
                          {userProfile?.artist_name?.[0] || 'U'}
                        </div>
                      </Avatar>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
        <CardFooter className="pt-0">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex w-full gap-2 items-center"
          >
            <Input
              placeholder="Escribe tu mensaje..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              size="icon"
              disabled={isLoading || !message.trim()}
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : (
                <Send size={18} />
              )}
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
} 