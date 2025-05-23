import { AGENTS, AgentType } from './agent-prompts';
import { getProfile } from './supabase';

export async function processMessage(message: string, agentType: AgentType, userId: string | null): Promise<{ response: string | null; error?: string }> {
  try {
    // Verificar que el tipo de agente es válido
    if (!Object.keys(AGENTS).includes(agentType)) {
      throw new Error('Tipo de agente inválido');
    }

    // Comprobar que la API key existe
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('API key de OpenAI no configurada');
    }

    let systemPrompt = AGENTS[agentType].systemPrompt;

    // Solo cargar datos del usuario si está autenticado y es un agente pago
    if (userId && AGENTS[agentType].isPaid) {
      try {
        const userProfile = await getProfile(userId);

        // Verificar si el onboarding está completo para agentes pagos
        if (!userProfile?.onboarding_completed) {
          return {
            response: null,
            error: 'Debes completar el onboarding para usar este agente personalizado'
          };
        }

        // Añadir datos del usuario al prompt del sistema
        systemPrompt = `${systemPrompt}

DATOS DEL ARTISTA:
${JSON.stringify({
  nombre_artista: userProfile.artist_name,
  tipo_proyecto: userProfile.project_type,
  miembros: userProfile.members,
  invitados: userProfile.guest_members,
  equipo_creativo: userProfile.creative_team,
  distribuidor: userProfile.distributor,
  estado_sello: userProfile.label_status,
  nombre_sello: userProfile.label_name,
  idioma: userProfile.language,
  redes_sociales: userProfile.socials,
  discografia: userProfile.discography,
  historia_vivo: userProfile.live_history,
  finanzas: userProfile.financials
}, null, 2)}

INSTRUCCIONES ADICIONALES:
- Usa el nombre del artista "${userProfile.artist_name}" en tus respuestas cuando sea relevante
- Adapta tus consejos al tipo de proyecto "${userProfile.project_type}"
- Ten en cuenta el tamaño del equipo: ${userProfile.members.length} miembros principales y ${userProfile.guest_members.length} invitados
- Considera el nivel de desarrollo en redes: ${userProfile.socials.instagram_followers} seguidores en Instagram, ${userProfile.socials.spotify_monthly_listeners} oyentes en Spotify
- Ajusta recomendaciones financieras al presupuesto: $${userProfile.financials.budget_per_launch_ars} ARS por lanzamiento
- Usa el idioma preferido: ${userProfile.language}`;

      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
        return {
          response: null,
          error: 'Error al cargar datos del usuario'
        };
      }
    }

    // Para el agente gratuito, asegurarse de que sea una experiencia genérica
    if (!AGENTS[agentType].isPaid) {
      systemPrompt = `${AGENTS[agentType].systemPrompt}
NOTA: Esta es una conversación con el agente gratuito. Proporciona consejos y recomendaciones generales sobre la industria musical.`;
    }

    // Llamar a la API de OpenAI
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error('Error de OpenAI:', errorData);
      return { 
        response: null, 
        error: 'Error al procesar el mensaje' 
      };
    }

    const openaiData = await openaiResponse.json();
    return { 
      response: openaiData.choices[0].message.content 
    };
  } catch (error) {
    console.error('Error al procesar mensaje:', error);
    return { 
      response: null, 
      error: 'Error al procesar el mensaje' 
    };
  }
} 