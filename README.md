# Zenith - Frontend Next.js

Versión mejorada del frontend de Zenith usando Next.js 15, optimizada para Vercel.

## 🚀 Características

- **Next.js 15** con App Router
- **TypeScript** para type safety
- **Tailwind CSS** para estilos modernos
- **Firebase Authentication** integrado
- **Diseño mejorado** inspirado en Material Design
- **Optimizado para Vercel** con SSR y SSG
- **Responsive** para móviles y desktop

## 📦 Instalación

```bash
npm install
```

## 🔧 Configuración

El archivo `.env.local` ya está configurado con las credenciales de Firebase.

## 🏃 Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🌐 Deploy en Vercel

### Opción 1: Desde la CLI

```bash
npm install -g vercel
vercel
```

### Opción 2: Desde GitHub

1. Sube el proyecto a GitHub
2. Ve a [vercel.com](https://vercel.com)
3. Importa tu repositorio
4. Configura las variables de entorno:
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
5. Deploy!

## 📁 Estructura

```
frontend-nextjs/
├── app/
│   ├── login/          # Página de login
│   ├── home/           # Dashboard principal
│   ├── chat/           # Chat con IA
│   ├── diary/          # Diario emocional
│   ├── calendar/       # Calendario de emociones
│   ├── meditation/     # Ejercicios de meditación
│   ├── psychologists/  # Directorio de psicólogos
│   ├── tips/           # Consejos motivacionales
│   ├── layout.tsx      # Layout principal
│   └── page.tsx        # Página de inicio
├── lib/
│   ├── firebase.ts     # Configuración de Firebase
│   └── api.ts          # Cliente API
└── .env.local          # Variables de entorno
```

## 🎨 Mejoras vs React

1. **Mejor SEO** - Server-side rendering
2. **Carga más rápida** - Optimización automática
3. **Mejor UX** - Transiciones suaves
4. **Diseño mejorado** - Inspirado en Material Design
5. **TypeScript** - Menos errores en producción
6. **Tailwind CSS** - Estilos más mantenibles

## 🔗 Backend

El backend Flask debe estar corriendo en `http://localhost:5000` para desarrollo.

Para producción, actualiza `NEXT_PUBLIC_API_URL` con la URL de tu backend desplegado.

## 📱 Páginas Implementadas

- ✅ Login/Registro
- ✅ Home (Dashboard)
- ⏳ Chat (próximamente)
- ⏳ Diario (próximamente)
- ⏳ Calendario (próximamente)
- ⏳ Meditación (próximamente)
- ⏳ Psicólogos (próximamente)
- ⏳ Consejos (próximamente)

## 🎯 Próximos Pasos

1. Implementar las páginas restantes
2. Agregar animaciones con Framer Motion
3. Implementar PWA para instalación
4. Agregar notificaciones push
5. Optimizar imágenes con Next/Image
