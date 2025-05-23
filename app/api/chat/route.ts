import { NextRequest, NextResponse } from 'next/server';
import { supabase, getUserCredits, updateCredits, saveChatMessage } from '@/lib/supabase';
import { processMessage } from '@/lib/agents';
import { AGENTS, AgentType } from '@/lib/agent-prompts';

export async function POST(request: NextRequest) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    const { message, agentType } = await request.json() as { message: string; agentType: AgentType };

    // Si es un agente pago, verificar autenticación y créditos
    if (AGENTS[agentType].isPaid) {
      if (authError || !user) {
        return NextResponse.json(
          { error: 'Usuario no autenticado' },
          { status: 401 }
        );
      }

      // Verificar si el usuario tiene suficientes créditos
      const credits = await getUserCredits(user.id);
      const hasCredits = credits >= AGENTS[agentType].credits;
      
      if (!hasCredits) {
        return NextResponse.json(
          { error: `No tienes suficientes créditos (${AGENTS[agentType].credits} requeridos)` },
          { status: 402 }
        );
      }
    }

    // Procesar el mensaje con el agente seleccionado
    const response = await processMessage(message, agentType, user?.email || null);

    if (response && user && AGENTS[agentType].isPaid) {
      // Descontar créditos solo si la respuesta fue exitosa y es un agente pago
      await updateCredits(
        user.id, 
        AGENTS[agentType].credits, 
        'use', 
        `Chat con agente ${AGENTS[agentType].name}`
      );

      // Guardar los mensajes en la base de datos
      await saveChatMessage(
        user.id,
        message,
        'user',
        agentType,
        AGENTS[agentType].name
      );

      await saveChatMessage(
        user.id,
        response.response || 'No response',
        'assistant',
        agentType,
        AGENTS[agentType].name
      );
    }

    return NextResponse.json({
      response: response.response,
      success: true,
      agent: {
        type: agentType,
        name: AGENTS[agentType].name
      }
    });
  } catch (error) {
    console.error('Error en el chat:', error);
    return NextResponse.json(
      { error: 'Error en el servidor' },
      { status: 500 }
    );
  }
} 