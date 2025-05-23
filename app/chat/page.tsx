'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase, getChatHistory, getProfile, getUserCredits } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Send, 
  Lock,
  Share2,
  Music2,
  Target,
  Copyright,
  Mic2,
  FileText,
  HelpCircle
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
import { TypingIndicator } from '@/components/TypingIndicator';

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
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentAgent, setCurrentAgent] = useState<AgentType>('free');
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // Obtener el usuario actual y su perfil
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        
        setCurrentUser(user);
        
        if (user) {
          const profile = await getProfile(user.id);
          setUserProfile(profile);
          
          // Recuperar historial de chat
          try {
            const chatHistory = await getChatHistory(user.id);
            if (chatHistory) {
              const formattedMessages = chatHistory.map((msg: any) => ({
                role: msg.role,
                content: msg.content,
                timestamp: new Date(msg.created_at),
                agent: {
                  type: msg.agent_type,
                  name: msg.agent_name
                }
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

  // Desplazar al último mensaje cuando se añade uno nuevo o cuando está escribiendo
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      const lastMessage = scrollArea.querySelector('[data-message]:last-child');
      const typingIndicator = scrollArea.querySelector('[data-typing-indicator]');
      
      // Scroll al último elemento (ya sea un mensaje o el indicador de escritura)
      const elementToScrollTo = typingIndicator || lastMessage;
      
      if (elementToScrollTo) {
        elementToScrollTo.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end'
        });
      }
    }
    // Mantener el foco en el input
    inputRef.current?.focus();
  }, [messages, isTyping]);

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
    return !userProfile?.onboarding_completed; // Si hay usuario pero no completó onboarding, están bloqueados
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
    
    console.log('🚀 [Chat] Iniciando envío de mensaje:', {
      mensaje: message.trim(),
      agente: currentAgent,
      usuario: currentUser?.id,
      estadoActual: {
        isLoading,
        isTyping,
        mensajesActuales: messages.length
      }
    });

    setIsLoading(true);
    setIsTyping(true);

    const userMessage: Message = {
      role: 'user',
      content: message.trim(),
      timestamp: new Date(),
      agent: {
        type: currentAgent,
        name: AGENTS[currentAgent].name
      }
    };

    console.log('📝 [Chat] Mensaje del usuario creado:', userMessage);

    setMessage('');
    setMessages(prev => [...prev, userMessage]);
    
    try {
      console.log('📤 [Chat] Obteniendo sesión y token...');
      const { data: { session } } = await supabase.auth.getSession();
      
      console.log('🔑 [Chat] Token obtenido:', session?.access_token ? 'Presente' : 'Ausente');
      
      console.log('📡 [Chat] Enviando solicitud a /api/chat');
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || ''}`
        },
        body: JSON.stringify({
          message: userMessage.content,
          agentType: currentAgent
        }),
      });
      
      console.log('📥 [Chat] Respuesta recibida:', {
        status: response.status,
        ok: response.ok
      });
      
      if (!response.ok) {
        const error = await response.json();
        console.error('❌ [Chat] Error en la respuesta:', error);
        throw new Error(error.error || 'Error al enviar mensaje');
      }
      
      const data = await response.json();
      console.log('✅ [Chat] Datos recibidos:', {
        tieneError: !!data.error,
        tieneRespuesta: !!data.response,
        respuestaLength: data.response?.length
      });

      if (data.error) {
        console.error('⚠️ [Chat] Error en los datos:', data.error);
        toast({
          title: 'Error',
          description: data.error,
          variant: 'destructive'
        });
        return;
      }
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        agent: {
          type: currentAgent,
          name: AGENTS[currentAgent].name
        }
      };
      
      console.log('💬 [Chat] Mensaje del asistente creado:', assistantMessage);
      
      setIsTyping(false);
      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (error: any) {
      console.error('🔥 [Chat] Error en la conversación:', {
        mensaje: error.message,
        error: error
      });
      setIsTyping(false);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo procesar tu mensaje. Inténtalo de nuevo.',
        variant: 'destructive'
      });
    } finally {
      console.log('🏁 [Chat] Finalizando proceso de mensaje');
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
    <div className="px-4 sm:px-6 md:px-8 lg:px-40 xl:px-60 2xl:px-96 pt-16 pb-16">
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
                    data-message 
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
                      <div 
                        className="text-sm whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: msg.content }}
                      />
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
                {isTyping && (
                  <div 
                    data-typing-indicator 
                    className="flex gap-3 justify-start"
                  >
                    <Avatar className="h-8 w-8">
                      <div className="bg-primary text-white rounded-full h-8 w-8 flex items-center justify-center">
                        {AGENTS[currentAgent].name[0]}
                      </div>
                    </Avatar>
                    <div className="max-w-[80%] rounded-lg p-4 bg-muted flex items-center">
                      <TypingIndicator />
                    </div>
                  </div>
                )}
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
              ref={inputRef}
              placeholder="Start your conversation..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1"
              disabled={isLoading || (AGENTS[currentAgent].isPaid && !userProfile?.onboarding_completed)}
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
                            const isLocked = AGENTS[key as AgentType].isPaid && (!currentUser || (currentUser && !userProfile?.onboarding_completed));
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
                    ) : !userProfile?.onboarding_completed ? (
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
              disabled={isLoading || !message.trim() || (AGENTS[currentAgent].isPaid && !userProfile?.onboarding_completed)}
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