import { NextRequest, NextResponse } from 'next/server';
import { supabase, getUserCredits, updateCredits, saveChatMessage } from '@/lib/supabase';
import { processMessage } from '@/lib/agents';
import { AGENTS, AgentType } from '@/lib/agent-prompts';

// Función para procesar el formato Markdown básico
function processMarkdownFormat(text: string): string {
  return text
    // Procesar negrita con doble asterisco
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Procesar cursiva con un asterisco
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Procesar listas con guiones
    .replace(/^- (.*)/gm, '• $1')
    // Procesar saltos de línea
    .replace(/\n/g, '<br>');
}

export async function POST(request: NextRequest) {
  console.log('🎯 [API] Iniciando POST /api/chat');
  
  try {
    const { message, agentType } = await request.json() as { message: string; agentType: AgentType };
    console.log('📦 [API] Datos recibidos:', { 
      mensaje: message,
      agente: agentType,
      agenteInfo: {
        nombre: AGENTS[agentType].name,
        esPago: AGENTS[agentType].isPaid,
        creditos: AGENTS[agentType].credits
      }
    });

    let user = null;
    let authError = null;

    // Solo verificar autenticación si es un agente pago
    if (AGENTS[agentType].isPaid) {
      console.log('🔒 [API] Verificando autenticación para agente pago');
      
      const authHeader = request.headers.get('Authorization');
      console.log('🔑 [API] Header de autorización:', authHeader ? 'Presente' : 'Ausente');

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.error('❌ [API] Token de autorización no encontrado o inválido');
        return NextResponse.json({ 
          error: 'Usuario no autenticado' 
        }, { status: 401 });
      }

      const token = authHeader.split(' ')[1];
      console.log('🎫 [API] Token extraído correctamente');
      
      const authResult = await supabase.auth.getUser(token);
      user = authResult.data.user;
      authError = authResult.error;

      console.log('👤 [API] Resultado autenticación:', {
        usuarioEncontrado: !!user,
        id: user?.id,
        email: user?.email,
        error: authError ? { mensaje: authError.message, estado: authError.status } : null
      });

      if (authError || !user) {
        console.error('❌ [API] Error de autenticación:', authError);
        return NextResponse.json({ 
          error: 'Usuario no autenticado',
          details: 'No se encontró información del usuario en la sesión'
        }, { status: 401 });
      }

      const credits = await getUserCredits(user.id);
      console.log('💰 [API] Verificación de créditos:', { 
        creditosUsuario: credits, 
        creditosRequeridos: AGENTS[agentType].credits,
        tieneCreditos: credits >= AGENTS[agentType].credits 
      });
      
      if (credits < AGENTS[agentType].credits) {
        console.error('💸 [API] Créditos insuficientes');
        return NextResponse.json(
          { error: `No tienes suficientes créditos (${AGENTS[agentType].credits} requeridos)` },
          { status: 402 }
        );
      }
    }

    console.log('🤖 [API] Procesando mensaje con el agente');
    const response = await processMessage(message, agentType, user?.id || null);
    console.log('✅ [API] Respuesta del agente recibida:', {
      tieneRespuesta: !!response?.response,
      longitudRespuesta: response?.response?.length
    });

    if (response?.response) {
      response.response = processMarkdownFormat(response.response);
      console.log('📝 [API] Formato markdown aplicado');
    }

    if (response && user && AGENTS[agentType].isPaid) {
      console.log('💳 [API] Actualizando créditos y guardando mensajes');
      
      await updateCredits(
        user.id, 
        AGENTS[agentType].credits, 
        'use', 
        `Chat con agente ${AGENTS[agentType].name}`
      );
      console.log('✅ [API] Créditos actualizados');

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
      console.log('✅ [API] Mensajes guardados en la base de datos');
    }

    console.log('🏁 [API] Enviando respuesta al cliente');
    return NextResponse.json({
      response: response.response,
      success: true,
      agent: {
        type: agentType,
        name: AGENTS[agentType].name
      }
    });
  } catch (error) {
    console.error('🔥 [API] Error en el procesamiento:', {
      error,
      mensaje: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { error: 'Error en el servidor', details: String(error) },
      { status: 500 }
    );
  }
} 