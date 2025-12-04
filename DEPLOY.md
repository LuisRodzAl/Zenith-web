# Guía de Despliegue en Vercel

Esta aplicación está configurada para ser desplegada en Vercel como un "monorepo" (Frontend + Backend juntos).

## Pasos para Desplegar

### 1. Preparación
Asegúrate de tener tu código subido a un repositorio de GitHub (o GitLab/Bitbucket).

### 2. Crear Proyecto en Vercel
1. Ve a [vercel.com](https://vercel.com) e inicia sesión.
2. Haz clic en **"Add New..."** -> **"Project"**.
3. Importa tu repositorio de GitHub.

### 3. Configuración del Proyecto
Vercel detectará automáticamente la configuración gracias al archivo `vercel.json` que hemos creado.
- **Framework Preset:** Déjalo como está (o selecciona "Other" si pregunta, pero `vercel.json` manda).
- **Root Directory:** Déjalo en `./` (la raíz).

### 4. Variables de Entorno (Environment Variables)
Esta es la parte más importante. Necesitas configurar las siguientes variables en la sección "Environment Variables" antes de desplegar:

| Nombre | Valor | Descripción |
|--------|-------|-------------|
| `GEMINI_API_KEY` | `tu_clave_api_aqui` | Tu clave de Google Gemini AI. |
| `FIREBASE_CREDENTIALS` | *Contenido del JSON* | Copia y pega TODO el contenido de tu archivo `firebase-credentials.json`. |
| `SECRET_KEY` | `una_clave_secreta_larga` | Una cadena aleatoria para seguridad de Flask. |

**Nota sobre `FIREBASE_CREDENTIALS`:**
No subas el archivo `.json` a GitHub. En su lugar, abre el archivo en tu computadora, copia todo el texto (desde `{` hasta `}`) y pégalo como valor de la variable de entorno en Vercel. El backend ha sido actualizado para leer este JSON directamente.

### 5. Desplegar
Haz clic en **"Deploy"**.

Vercel construirá:
1. El Frontend (Next.js)
2. El Backend (Python/Flask)

Una vez termine, tu aplicación estará en vivo en `https://tu-proyecto.vercel.app`.

## Solución de Problemas

- **Error 500 en /api/**: Verifica los logs de Vercel (pestaña "Logs"). Generalmente es por credenciales de Firebase mal copiadas.
- **Frontend no carga datos**: Verifica que no hayas puesto una URL incorrecta en `NEXT_PUBLIC_API_URL`. Para producción, es mejor dejar esa variable vacía (el código la detectará automáticamente).
