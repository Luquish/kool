import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { message, email } = await request.json();
    
    if (!message || !email) {
      return NextResponse.json({ error: 'Se requiere mensaje y email' }, { status: 400 });
    }

    // Comprobar que la API key existe
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'API key de OpenAI no configurada.' 
      }, { status: 500 });
    }

    // Cargar datos del usuario
    let userProfile = {};
    let userStrategy = {};
    
    try {
      // Cargar perfil del usuario
      const profilePath = path.join(process.cwd(), 'storage', email, 'profile.json');
      if (fs.existsSync(profilePath)) {
        const profileData = fs.readFileSync(profilePath, 'utf8');
        userProfile = JSON.parse(profileData);
      }
      
      // Cargar estrategia del usuario
      const strategyPath = path.join(process.cwd(), 'storage', email, 'strategy.json');
      if (fs.existsSync(strategyPath)) {
        const strategyData = fs.readFileSync(strategyPath, 'utf8');
        userStrategy = JSON.parse(strategyData);
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    }

    // Construir el prompt para OpenAI
    const systemPrompt = `Eres KoolAI, un asistente multilingüe especializado en músicos independientes de LATAM. 
Tu objetivo es ayudar al artista con su estrategia de crecimiento, marketing y lanzamientos.

Tienes acceso a dos fuentes de información sobre el artista:
1. Su perfil (información personal, proyecto, seguidores, lanzamientos, etc.)
2. Su estrategia (calendario de acciones y seguimiento de tareas)

Contesta siempre en el mismo idioma que se te pregunta. Sé amable, directo y proporciona consejos prácticos.
Si necesitas detalles específicos que no están en el perfil o la estrategia, puedes preguntar al usuario.

A continuación están los datos del perfil y la estrategia del artista:

PERFIL DEL ARTISTA:
${JSON.stringify(userProfile, null, 2)}

ESTRATEGIA DEL ARTISTA:
${JSON.stringify(userStrategy, null, 2)}`;

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
      return NextResponse.json({ error: 'Error al generar respuesta' }, { status: 500 });
    }

    const openaiData = await openaiResponse.json();
    const response = openaiData.choices[0].message.content;

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error del servidor:', error);
    return NextResponse.json({ error: 'Error del servidor', details: String(error) }, { status: 500 });
  }
} 