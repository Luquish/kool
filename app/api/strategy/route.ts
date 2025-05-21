import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Función para extraer JSON de un posible formato markdown
function extractJsonFromMarkdown(content: string): string {
  // Si la respuesta viene en formato markdown con bloques de código
  if (content.includes('```json') || content.includes('```')) {
    // Extrae el contenido entre los marcadores de código
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    return jsonMatch ? jsonMatch[1].trim() : content;
  }
  
  return content;
}

export async function POST(request: NextRequest) {
  try {
    const { email, profileData } = await request.json();
    
    if (!email || !profileData) {
      return NextResponse.json({ error: 'Se requiere email y profileData' }, { status: 400 });
    }

    // Comprobar que la API key existe
    const apiKey = process.env.OPENAI_API_KEY;
    console.log("¿API Key definida?:", !!apiKey);
    
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'API key de OpenAI no configurada. Por favor, configure OPENAI_API_KEY en las variables de entorno.' 
      }, { status: 500 });
    }

    // Construir el prompt con los datos del perfil de usuario
    const systemPrompt = `##########################
##  SYSTEM INSTRUCTIONS ##
##########################
You are **KoolAI**, a multilingual digital manager specialised in independent musicians from LATAM.  
Your job is to read the artist profile provided below and generate a personalised growth roadmap: marketing strategy, release plan, content calendar and actionable tasks.  
Always reply in the language indicated by \`language\`.

⚠️ **Output MUST be valid JSON with *two* top-level keys that mirror each other:**

1. **"calendar"** - array of objects (one per action) with:
   - "id"           : unique slug or integer, reused in task_tracker  
   - "date"         : ISO-8601 string (YYYY-MM-DD)  
   - "title"        : short action name  
   - "description"  : what to do, written for a human artist/manager  
   - "channel"      : IG / TikTok / YT / Live / Email / PR / Other  
   - "effort_hours" : integer estimate  
   - "goal"         : reach / engagement / conversion / brand / other  
   - "budget_ars"   : number (0 if organic)

2. **"task_tracker"** - array **in the same order and length** as *calendar*; each object shares the same \`"id"\` and \`"title"\`, and adds:
   - "status"       : pending / in-progress / done  
   - "owner"        : default "artist" unless otherwise assigned  
   - "dependencies" : array of task \`"id"\`s it depends on (may be empty)

> This 1-to-1 structure lets the frontend render a dual-view dashboard (calendar & kanban) similar to Notion without extra joins.

General guidelines:
• Respect real constraints (budget, team size, avg. capacity).  
• Prioritise high-ROI tactics for early growth; propose low-cost TikTok/UGC tests if presence is weak.  
• Sync release cadence with upcoming singles/albums.  
• Leverage narrative/visual concepts when proposing content ideas.  
• Distribute workload realistically; max 3 high-effort tasks per week.  
• Include at least one data-driven iteration checkpoint per month.  
• Mark optional suggestions with \`"is_optional": true\`.

IMPORTANT: Reply ONLY with the JSON object, no markdown formatting, no code blocks, no explanations.`;

    const userPrompt = `########################
##  USER (PROFILE)    ##
########################
Profile:
${JSON.stringify(profileData, null, 2)}

########################
##  END OF PROFILE    ##
########################

<<Now generate the personalised 12-week calendar and task tracker JSON>>`;

    console.log("Enviando solicitud a OpenAI");
    
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
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error('Error de OpenAI:', errorData);
      return NextResponse.json({ error: 'Error al generar la estrategia' }, { status: 500 });
    }

    console.log("Respuesta recibida de OpenAI");
    const openaiData = await openaiResponse.json();
    const content = openaiData.choices[0].message.content;
    
    // Debug para ver la respuesta
    console.log("Contenido de la respuesta:", content.substring(0, 200) + "...");
    
    // Extraer el JSON si viene en formato markdown
    const cleanedContent = extractJsonFromMarkdown(content);
    console.log("Contenido limpio:", cleanedContent.substring(0, 200) + "...");
    
    let generatedStrategy;
    try {
      generatedStrategy = JSON.parse(cleanedContent);
    } catch (error) {
      console.error("Error al parsear JSON:", error);
      console.error("Contenido que causó el error:", cleanedContent);
      return NextResponse.json({ 
        error: 'Error al parsear la respuesta JSON del modelo', 
        rawContent: content.substring(0, 1000) 
      }, { status: 500 });
    }

    // Guardar la estrategia en el sistema de archivos
    const strategyDir = path.join(process.cwd(), 'storage', email);
    
    // Asegurar que el directorio existe
    if (!fs.existsSync(strategyDir)) {
      fs.mkdirSync(strategyDir, { recursive: true });
    }
    
    const strategyPath = path.join(strategyDir, 'strategy.json');
    fs.writeFileSync(strategyPath, JSON.stringify(generatedStrategy, null, 2));
    console.log("Estrategia guardada en:", strategyPath);

    return NextResponse.json({ success: true, strategy: generatedStrategy });
  } catch (error) {
    console.error('Error del servidor:', error);
    return NextResponse.json({ error: 'Error del servidor', details: String(error) }, { status: 500 });
  }
} 