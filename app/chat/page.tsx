'use client';

import { useState, useEffect, useRef } from 'react';
import storage from '@/lib/storage';
import { getUserCredits } from '@/lib/credits';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Send, 
  Lock,
  Share2, // Social
  Music2, // Spotify
  Target, // Marketing
  Copyright, // Publishing
  Mic2, // Live
  FileText, // Contracts
  HelpCircle // Free
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { AGENTS, AgentType } from '@/lib/agent-prompts';
import { useOnboardingStore } from '@/lib/store/onboarding-store';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { OnboardingModal } from "@/components/ui/onboarding-modal";

// Mapa de iconos para cada agente
const AGENT_ICONS: Record<AgentType, React.ReactNode> = {
  free: <HelpCircle className="h-4 w-4" />,
  social: <Share2 className="h-4 w-4" />,
  spotify: <Music2 className="h-4 w-4" />,
  marketing: <Target className="h-4 w-4" />,
  publishing: <Copyright className="h-4 w-4" />,
  live: <Mic2 className="h-4 w-4" />,
  contracts: <FileText className="h-4 w-4" />
};

// Interfaz para mensaje
interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  agent?: {
    type: AgentType;
    name: string;
  };
}

export default function ChatPage() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentAgent, setCurrentAgent] = useState<AgentType>('free');
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);
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

  // Función para actualizar los créditos en el header
  const updateHeaderCredits = async () => {
    if (currentUser) {
      const userCredits = await getUserCredits(currentUser);
      // Emitir un evento personalizado para actualizar los créditos
      const event = new CustomEvent('updateCredits', { 
        detail: { credits: userCredits.credits }
      });
      window.dispatchEvent(event);
    }
  };

  // Función para verificar si un agente está bloqueado
  const isAgentLocked = (agentType: AgentType): boolean => {
    if (!AGENTS[agentType].isPaid) return false; // Los agentes gratuitos siempre están disponibles
    if (!currentUser) return true; // Si no hay usuario, todos los agentes pagos están bloqueados
    return !userProfile?.isOnboardingCompleted; // Si hay usuario pero no completó onboarding, están bloqueados
  };

  // Función para manejar el cambio de agente
  const handleAgentChange = (value: AgentType) => {
    if (isAgentLocked(value)) {
      setShowOnboardingModal(true);
      return;
    }
    setCurrentAgent(value);
  };

  // Enviar mensaje
  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;
    setIsLoading(true);

    const userMessage: Message = {
      role: 'user',
      content: message.trim(),
      timestamp: new Date(),
      agent: {
        type: currentAgent,
        name: AGENTS[currentAgent].name
      }
    };

    // Limpiar el input y actualizar mensajes localmente
    setMessage('');
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    
    try {
      // Solo guardar mensajes si el usuario está autenticado y es un agente pago
      if (currentUser && AGENTS[currentAgent].isPaid) {
        await saveMessages(updatedMessages);
      }
      
      // Enviar mensaje a la API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          agentType: currentAgent,
          userEmail: currentUser
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al enviar mensaje');
      }
      
      const data = await response.json();

      if (data.error) {
        toast({
          title: 'Error',
          description: data.error,
          variant: 'destructive'
        });
        return;
      }
      
      // Añadir respuesta del asistente
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        agent: {
          type: currentAgent,
          name: AGENTS[currentAgent].name
        }
      };
      
      const newMessages = [...updatedMessages, assistantMessage];
      setMessages(newMessages);
      
      // Solo guardar mensajes y actualizar créditos si el usuario está autenticado y es un agente pago
      if (currentUser && AGENTS[currentAgent].isPaid) {
        await saveMessages(newMessages);
        await updateHeaderCredits();
      }
    } catch (error: any) {
      console.error('Error en la conversación:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo procesar tu mensaje. Inténtalo de nuevo.',
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

  return (
    <div className="container mx-auto py-8 flex flex-col h-[calc(100vh-200px)]">
      <OnboardingModal isOpen={showOnboardingModal} onClose={() => setShowOnboardingModal(false)} />
      
      <Breadcrumb 
        items={[{ href: '/chat', label: 'Chat' }]}
        className="mb-4" 
      />
      
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {AGENTS[currentAgent].description}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {AGENTS[currentAgent].features.map((feature, index) => (
              <span 
                key={index}
                className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
              >
                {feature}
              </span>
            ))}
          </div>
          <Separator className="mt-2" />
        </CardHeader>
        <CardContent className="flex-1 p-0 relative">
          <ScrollArea className="h-[calc(100vh-450px)] px-4" ref={scrollAreaRef}>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <p className="text-muted-foreground">
                  {!currentUser 
                    ? 'You are talking to the free assistant' 
                    : `You are talking to the agent of ${AGENTS[currentAgent].name}`}
                </p>
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
                          {msg.agent?.name[0] || 'K'}
                        </div>
                      </Avatar>
                    )}
                    <div className={`max-w-[80%] rounded-lg p-3 ${
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}>
                      {msg.role === 'assistant' && msg.agent && (
                        <div className="text-xs text-primary mb-1">
                          {msg.agent.name}
                        </div>
                      )}
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
        <CardFooter className="pt-4">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex w-full gap-2 items-center"
          >
            <Input
              placeholder="Start your conversation..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1"
              disabled={isLoading || (AGENTS[currentAgent].isPaid && !userProfile?.isOnboardingCompleted)}
            />
            <div className="relative group">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Select
                        value={currentAgent}
                        onValueChange={handleAgentChange}
                      >
                        <SelectTrigger className="w-[42px] px-2">
                          {AGENT_ICONS[currentAgent]}
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(AGENTS).map(([key, agent]) => {
                            const isLocked = AGENTS[key as AgentType].isPaid && (!currentUser || (currentUser && !userProfile?.isOnboardingCompleted));
                            return (
                              <SelectItem 
                                key={key} 
                                value={key}
                                className={`flex items-center justify-between ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isLocked ? true : undefined}
                              >
                                <div className="flex items-center gap-2">
                                  {AGENT_ICONS[key as AgentType]}
                                  <span>{agent.name}</span>
                                  {agent.credits > 0 && (
                                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full ml-2">
                                      {agent.credits} credit{agent.credits !== 1 ? 's' : ''}
                                    </span>
                                  )}
                                  {isLocked && <Lock size={16} className="ml-2" />}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {!currentUser ? (
                      <p>Sign in to unlock all agents</p>
                    ) : !userProfile?.isOnboardingCompleted ? (
                      <p>Complete onboarding to unlock all agents</p>
                    ) : (
                      <p>Select an agent to chat with</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Button 
              type="submit" 
              size="icon"
              disabled={isLoading || !message.trim() || (AGENTS[currentAgent].isPaid && !userProfile?.isOnboardingCompleted)}
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