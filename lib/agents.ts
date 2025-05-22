import { AGENTS, AgentType } from './agent-prompts';
import storage from './storage';

export async function processMessage(message: string, agentType: AgentType, userEmail: string): Promise<string | null> {
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

    // Cargar datos del usuario
    const userProfile = await storage.getItem(`storage/${userEmail}/profile.json`);
    const userStrategy = await storage.getItem(`storage/${userEmail}/strategy.json`);

    // Obtener el prompt del agente
    const agent = AGENTS[agentType];
    const systemPrompt = `${agent.systemPrompt}

A continuación están los datos del perfil y la estrategia del artista:

PERFIL DEL ARTISTA:
${JSON.stringify(userProfile || {}, null, 2)}

ESTRATEGIA DEL ARTISTA:
${JSON.stringify(userStrategy || {}, null, 2)}`;

    // Llamar a la API de OpenAI
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
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
      return null;
    }

    const openaiData = await openaiResponse.json();
    return openaiData.choices[0].message.content;
  } catch (error) {
    console.error('Error al procesar mensaje:', error);
    return null;
  }
} 