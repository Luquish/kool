import { AGENTS, AgentType } from './agent-prompts';
import storage from './storage';

export async function processMessage(message: string, agentType: AgentType, userEmail: string | null): Promise<{ response: string | null; error?: string }> {
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

    // Solo cargar datos del usuario si está autenticado y no es el agente social
    if (userEmail && agentType !== 'social') {
      try {
        const userProfile = await storage.getItem(`storage/${userEmail}/profile.json`);
        const userStrategy = await storage.getItem(`storage/${userEmail}/strategy.json`);

        // Verificar si el onboarding está completo
        if (userProfile?.is_onboarding_in_progress) {
          return {
            response: null,
            error: 'Debes completar el onboarding para usar este agente personalizado'
          };
        }

        // Añadir datos del usuario al prompt del sistema
        systemPrompt = `${systemPrompt}

DATOS DEL ARTISTA:
${JSON.stringify({
  nombre_artista: userProfile?.artist_name,
  tipo_proyecto: userProfile?.project_type,
  miembros: userProfile?.members,
  equipo_creativo: userProfile?.creative_team,
  distribuidor: userProfile?.distributor,
  estado_sello: userProfile?.label_status,
  nombre_sello: userProfile?.label_name,
  idioma: userProfile?.language,
  redes_sociales: userProfile?.socials,
  discografia: userProfile?.discography,
  historia_vivo: userProfile?.live_history,
  finanzas: userProfile?.financials
}, null, 2)}

ESTRATEGIA DEL ARTISTA:
${JSON.stringify(userStrategy || {}, null, 2)}`;
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
        return {
          response: null,
          error: 'Error al cargar datos del usuario'
        };
      }
    }

    // Para el agente social, asegurarse de que sea una experiencia genérica
    if (agentType === 'social') {
      systemPrompt = `${AGENTS.social.systemPrompt}
NOTA: Esta es una conversación con un usuario no registrado. Proporciona consejos y recomendaciones generales sobre redes sociales para músicos.`;
    }

    // Llamar a la API de OpenAI
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
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