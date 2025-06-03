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

## Tutorial: Crear una base de datos en Supabase y gestionar migraciones 🗄️

A continuación, te explico cómo crear una base de datos en Supabase y cómo agregar y aplicar archivos de migración para gestionar el esquema de tu base de datos de forma profesional.

### 1. Crear un proyecto en Supabase
1. Ve a [https://app.supabase.com/](https://app.supabase.com/) y regístrate o inicia sesión.
2. Haz clic en "New project".
3. Completa los datos requeridos (nombre, contraseña, región, etc.) y espera a que se cree el proyecto.
4. Una vez creado, accede al panel de tu proyecto y copia el `Project Reference` (lo necesitarás más adelante).

### 2. Instalar Supabase CLI
Necesitas la CLI de Supabase para gestionar migraciones localmente.

```bash
npm install -g supabase
```

O con PNPM:
```bash
pnpm add -g supabase
```

### 3. Inicializar Supabase en tu proyecto
En la raíz de tu proyecto, ejecuta:

```bash
supabase init
```

Esto creará una carpeta `supabase/` con la configuración necesaria.

### 4. Iniciar sesión y vincular tu proyecto local con Supabase
Primero, inicia sesión:
```bash
supabase login
```
Sigue las instrucciones para autenticarte.

Luego, vincula tu proyecto local con el remoto:
```bash
supabase link --project-ref TU_PROJECT_REF
```
Reemplaza `TU_PROJECT_REF` por el valor copiado desde el panel de Supabase.

### 5. Crear un archivo de migración
Para crear un nuevo archivo de migración, ejecuta:
```bash
supabase migration new nombre_de_la_migracion
```
Esto generará un archivo SQL en `supabase/migrations/` donde puedes definir los cambios de esquema (tablas, columnas, etc.).

Ejemplo de contenido para una migración:
```sql
create table if not exists ejemplo (
  id serial primary key,
  nombre text not null
);
```

### 6. Aplicar las migraciones a la base de datos
Para aplicar todas las migraciones pendientes a tu base de datos remota:
```bash
supabase db push
```

Si quieres aplicar las migraciones en tu entorno local (por ejemplo, usando Docker):
```bash
supabase start
```

### 7. (Opcional) Poblar la base de datos con datos iniciales (seed)
Puedes crear un archivo `supabase/seed.sql` con datos de ejemplo:
```sql
insert into ejemplo (nombre) values ('Dato 1'), ('Dato 2');
```
Luego, para aplicar migraciones y poblar la base de datos:
```bash
supabase db reset --include-seed
```

### 8. Buenas prácticas
- Usa nombres descriptivos para tus migraciones.
- Revisa y prueba tus migraciones en desarrollo antes de aplicarlas en producción.
- Versiona tus archivos de migración en tu sistema de control de versiones (Git).

### Recursos útiles
- [Documentación oficial de Supabase sobre migraciones](https://supabase.com/docs/guides/deployment/database-migrations)
- [Guía rápida de Supabase CLI](https://supabase.com/docs/guides/cli)

¡Con esto tendrás tu base de datos en Supabase gestionada de forma profesional y lista para escalar! 🚀