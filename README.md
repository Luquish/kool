# Kool AI 🚀

## Descripción
Kool AI es una plataforma de gestión musical impulsada por IA, diseñada específicamente para artistas independientes. La aplicación combina inteligencia artificial avanzada con experiencia en la industria musical para proporcionar una suite completa de herramientas de gestión y desarrollo artístico.

## Tecnologías Principales 🛠️
- **Frontend**: Next.js 15.2.4
- **UI/UX**: 
  - Tailwind CSS
  - Radix UI (componentes accesibles)
  - Componentes personalizados
- **Backend**:
  - Supabase (base de datos y autenticación)
  - OpenAI GPT-4 (motor de IA)
- **Autenticación**: Sistema integrado con Supabase
- **Estado Global**: Zustand
- **Formularios**: React Hook Form con validación Zod
- **Estilizado**: 
  - Tailwind CSS
  - CSS Modules
  - CSS-in-JS solutions

## Características Principales ✨
- 🤖 **Agentes de IA Especializados**:
  - Asistente Gratuito: Consejos básicos y orientación general
  - Estrategia de Redes Sociales: Optimización de presencia digital
  - Especialista en Spotify: Optimización de perfil y estrategia de playlists
  - Estrategia de Marketing: Planes personalizados de marketing
  - Gestión de Derechos: Asesoramiento en publishing y royalties
  - Planificación de Shows: Organización de eventos en vivo
  - Contratos: Plantillas y guías de negociación
- 📊 **Panel de Control Personalizado**
- 📈 **Análisis de Rendimiento**
- 📅 **Planificación de Lanzamientos**
- 👥 **Gestión de Comunidad**
- 💰 **Optimización de Ingresos**

## Estructura del Proyecto 📁
```
kool/
├── app/                    # Directorio principal de la aplicación
│   ├── api/               # Endpoints de la API
│   ├── auth/              # Componentes de autenticación
│   ├── chat/              # Funcionalidad de chat con IA
│   ├── dashboard/         # Panel de control
│   ├── onboarding/       # Proceso de onboarding
│   ├── profile/          # Gestión de perfil
│   └── tutorials/        # Sección de tutoriales
├── components/            # Componentes reutilizables
├── hooks/                # Custom hooks
├── lib/                  # Utilidades y helpers
├── public/              # Archivos estáticos
├── supabase/            # Configuración de Supabase
└── types/               # Definiciones de TypeScript
```

## Requisitos Previos 📋
- Node.js (versión LTS recomendada)
- PNPM como gestor de paquetes
- Una cuenta en Supabase para la base de datos
- Una cuenta en OpenAI para acceso a la API

## Instalación 🔧
1. Clonar el repositorio:
\`\`\`bash
git clone [URL_DEL_REPOSITORIO]
\`\`\`

2. Instalar dependencias:
\`\`\`bash
pnpm install
\`\`\`

3. Configurar variables de entorno:
   Crear un archivo \`.env.local\` con las siguientes variables:
\`\`\`env
OPENAI_API_KEY=tu_api_key_de_openai
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
\`\`\`

4. Iniciar el servidor de desarrollo:
\`\`\`bash
pnpm dev
\`\`\`

## Scripts Disponibles 📜
- \`pnpm dev\`: Inicia el servidor de desarrollo
- \`pnpm build\`: Construye la aplicación para producción
- \`pnpm start\`: Inicia la aplicación en modo producción
- \`pnpm lint\`: Ejecuta el linter

## Sistema de Créditos 💳
- Los agentes gratuitos están disponibles sin restricciones
- Los agentes especializados requieren créditos para su uso
- Cada consulta con un agente especializado consume 1 crédito
- Los créditos se pueden adquirir o ganar mediante acciones específicas

## Personalización 🎨
El proyecto utiliza Tailwind CSS para los estilos, que puede ser configurado en:
- \`tailwind.config.ts\`: Configuración principal de Tailwind
- \`app/globals.css\`: Estilos globales
- \`components.json\`: Configuración de componentes

## Contribución 🤝
1. Fork el proyecto
2. Crea una rama para tu feature (\`git checkout -b feature/AmazingFeature\`)
3. Commit tus cambios (\`git commit -m 'Add some AmazingFeature'\`)
4. Push a la rama (\`git push origin feature/AmazingFeature\`)
5. Abre un Pull Request