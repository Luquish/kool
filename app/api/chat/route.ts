import { NextRequest, NextResponse } from 'next/server';
import { supabase, getUserCredits, updateCredits, saveChatMessage } from '@/lib/supabase';
import { processMessage } from '@/lib/agents';
import { AGENTS, AgentType } from '@/lib/agent-prompts';

export async function POST(request: NextRequest) {
  console.log('[Backend] Iniciando POST /api/chat');
  
  try {
    // Obtener el token de autorización del header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('[Backend] Token de autorización no encontrado');
      return NextResponse.json({ 
        error: 'Usuario no autenticado' 
      }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    
    // Verificar el token y obtener el usuario
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    console.log('[Backend] Resultado auth.getUser:', {
      user: user ? { id: user.id, email: user.email } : null,
      error: authError ? { message: authError.message, status: authError.status } : null
    });

    const { message, agentType } = await request.json() as { message: string; agentType: AgentType };
    console.log('[Backend] Datos recibidos:', { message, agentType, isPaid: AGENTS[agentType].isPaid });

    // Si es un agente pago, verificar autenticación y créditos
    if (AGENTS[agentType].isPaid) {
      console.log('[Backend] Verificando requisitos para agente pago');
      
      if (authError || !user) {
        console.error('[Backend] Usuario no autenticado para agente pago');
        return NextResponse.json({ 
          error: 'Usuario no autenticado',
          details: 'No se encontró información del usuario en la sesión'
        }, { status: 401 });
      }

      // Verificar si el usuario tiene suficientes créditos
      const credits = await getUserCredits(user.id);
      const hasCredits = credits >= AGENTS[agentType].credits;
      console.log('[Backend] Verificación de créditos:', { 
        userCredits: credits, 
        requiredCredits: AGENTS[agentType].credits,
        hasEnoughCredits: hasCredits 
      });
      
      if (!hasCredits) {
        console.error('[Backend] Créditos insuficientes');
        return NextResponse.json(
          { error: `No tienes suficientes créditos (${AGENTS[agentType].credits} requeridos)` },
          { status: 402 }
        );
      }
    }

    // Procesar el mensaje con el agente seleccionado
    const response = await processMessage(message, agentType, user?.id || null);

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
    console.error('[Backend] Error en el chat:', error);
    return NextResponse.json(
      { error: 'Error en el servidor', details: String(error) },
      { status: 500 }
    );
  }
} 