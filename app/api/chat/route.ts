import { NextRequest, NextResponse } from 'next/server';
import storage from '@/lib/storage';
import { hasEnoughCredits, updateUserCredits } from '@/lib/credits';
import { processMessage } from '@/lib/agents';
import { AGENTS, AgentType } from '@/lib/agent-prompts';

export async function POST(request: NextRequest) {
  try {
    const currentUser = await storage.getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Usuario no autenticado' },
        { status: 401 }
      );
    }

    const { message, agentType } = await request.json() as { message: string; agentType: AgentType };

    // Verificar si el usuario tiene suficientes créditos
    const hasCredits = await hasEnoughCredits(currentUser, 1);
    
    if (!hasCredits) {
      return NextResponse.json(
        { error: 'No tienes suficientes créditos' },
        { status: 402 }
      );
    }

    // Procesar el mensaje con el agente seleccionado
    const response = await processMessage(message, agentType, currentUser);

    if (response) {
      // Descontar un crédito solo si la respuesta fue exitosa
      await updateUserCredits(currentUser, 1, 'use', `Chat con agente ${agentType}`);

      // Guardar el mensaje en el historial
      const chatPath = `storage/${currentUser}/chat.json`;
      const currentChat = await storage.getItem(chatPath) || [];
      
      const updatedChat = [
        ...currentChat,
        {
          role: 'user',
          content: message,
          timestamp: new Date().toISOString(),
          agent: {
            type: agentType,
            name: AGENTS[agentType].name
          }
        },
        {
          role: 'assistant',
          content: response,
          timestamp: new Date().toISOString(),
          agent: {
            type: agentType,
            name: AGENTS[agentType].name
          }
        }
      ];

      await storage.saveItem(chatPath, updatedChat);

      return NextResponse.json({
        response,
        success: true,
        agent: {
          type: agentType,
          name: AGENTS[agentType].name
        }
      });
    } else {
      return NextResponse.json(
        { error: 'Error al procesar el mensaje' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error en el chat:', error);
    return NextResponse.json(
      { error: 'Error en el servidor' },
      { status: 500 }
    );
  }
} 