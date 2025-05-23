import { NextRequest, NextResponse } from 'next/server';
import { supabase, getProfile } from '@/lib/supabase';

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
  console.log('[Backend] Iniciando POST /api/strategy');
  
  try {
    // Obtener el token de autorización del header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('[Backend] Token de autorización no encontrado');
      return NextResponse.json({ 
        error: 'Token de autorización no proporcionado' 
      }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    
    // Verificar el token y obtener el usuario
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    console.log('[Backend] Resultado auth.getUser:', {
      user: user ? { id: user.id, email: user.email } : null,
      error: authError ? { message: authError.message, status: authError.status } : null
    });
    
    if (authError) {
      console.error('[Backend] Error de autenticación:', authError);
      return NextResponse.json({ 
        error: 'Error de autenticación', 
        details: authError.message 
      }, { status: 401 });
    }

    if (!user) {
      console.error('[Backend] Usuario no encontrado en la sesión');
      return NextResponse.json({ 
        error: 'Usuario no autenticado',
        details: 'No se encontró información del usuario en la sesión'
      }, { status: 401 });
    }

    // Comprobar que la API key existe
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('[Backend] API key de OpenAI no encontrada');
      return NextResponse.json({ 
        error: 'API key de OpenAI no configurada' 
      }, { status: 500 });
    }

    // Obtener el perfil del usuario
    console.log('[Backend] Intentando obtener perfil del usuario:', user.id);
    const userProfile = await getProfile(user.id);
    console.log('[Backend] Perfil obtenido:', {
      id: userProfile?.id,
      socials: userProfile?.socials,
      discography: userProfile?.discography,
      live_history: userProfile?.live_history,
      financials: userProfile?.financials
    });

    if (!userProfile) {
      console.error('[Backend] Perfil no encontrado para usuario:', user.id);
      return NextResponse.json({ error: 'Perfil no encontrado' }, { status: 404 });
    }

    // Obtener la fecha actual y calcular las fechas para el calendario
    const currentDate = new Date();
    const startDate = new Date(currentDate);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 3); // 3 meses de calendario

    // Construir el prompt con los datos del perfil de usuario y las fechas
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
   - "channel"      : IG/TikTok / YT / Live / Email / PR / Other  
   - "effort_hours" : integer estimate  
   - "goal"         : brand / engagement / conversion / data-driven  
   - "budget"   : number (0 if organic)

IMPORTANT TIMING INSTRUCTIONS:
• Start date: ${startDate.toISOString().split('T')[0]}
• End date: ${endDate.toISOString().split('T')[0]}
• All dates in the calendar MUST be within this range
• Distribute tasks evenly across these dates
• DO NOT generate dates outside this range

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
${JSON.stringify(userProfile, null, 2)}

########################
##  END OF PROFILE    ##
########################

<<Now generate the personalised calendar and task tracker JSON starting from ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}>>`;

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

    const openaiData = await openaiResponse.json();
    const content = openaiData.choices[0].message.content;
    
    // Extraer el JSON si viene en formato markdown
    const cleanedContent = extractJsonFromMarkdown(content);
    
    let generatedStrategy;
    try {
      generatedStrategy = JSON.parse(cleanedContent);
    } catch (error) {
      console.error("Error al parsear JSON:", error);
      return NextResponse.json({ 
        error: 'Error al parsear la respuesta JSON del modelo', 
        rawContent: content.substring(0, 1000) 
      }, { status: 500 });
    }

    // Guardar la estrategia en Supabase
    const { error: strategyError } = await supabase
      .from('strategies')
      .upsert({
        user_id: user.id,
        calendar: generatedStrategy.calendar,
        task_tracker: generatedStrategy.task_tracker,
        updated_at: new Date().toISOString()
      });

    if (strategyError) {
      console.error('Error al guardar estrategia:', strategyError);
      return NextResponse.json({ error: 'Error al guardar la estrategia' }, { status: 500 });
    }

    return NextResponse.json({ success: true, strategy: generatedStrategy });
  } catch (error) {
    console.error('Error del servidor:', error);
    return NextResponse.json({ error: 'Error del servidor', details: String(error) }, { status: 500 });
  }
} 