# Zenith Web - Aplicación de Salud Mental 🧘

Versión web de la aplicación Zenith con Flask (backend) y Next.js (frontend).

## ✨ Características

- 🔐 Autenticación con Firebase (Email/Password y Google)
- 💬 Chat con IA psicológica (Google Gemini)
- 📅 Calendario de emociones
- 🧘 Ejercicios de meditación y respiración
- 📝 Diario personal con emociones
- 👨‍⚕️ Directorio de psicólogos
- 💡 Consejos de salud mental
- 🎨 Interfaz moderna con Next.js y Tailwind CSS
- 🚀 Optimizado para Vercel

## 🚀 Inicio Rápido

### Terminal 1 - Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Terminal 2 - Frontend

```bash
cd frontend-nextjs
npm install
npm run dev
```

Abre `http://localhost:3000`

**⚠️ IMPORTANTE:** Si el backend muestra advertencias sobre Firebase, necesitas:
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Proyecto: **myzenith-db12d** → Settings → Service Accounts
3. "Generate new private key" → Guarda como `backend/firebase-credentials.json`

Ver `INICIO_RAPIDO.md` para más detalles.

## 🌐 Deploy en Vercel

```bash
cd frontend-nextjs
npm install -g vercel
vercel
```

O sigue la guía completa en `DEPLOY_VERCEL.md`

## ✅ Configuración Actual

Las credenciales ya están configuradas:

### Backend
- ✅ API Key de Gemini configurada
- ✅ Project ID de Firebase configurado
- ⚠️ Solo falta el archivo `firebase-credentials.json`

### Frontend
- ✅ Todas las credenciales de Firebase configuradas
- ✅ API URL del backend configurada
- ✅ TypeScript + Tailwind CSS

## 📁 Estructura del Proyecto

```
zenith-web/
├── backend/
│   ├── app.py              # API Flask
│   ├── models.py           # Modelos de datos
│   ├── config.py           # Configuración
│   ├── .env                # Variables de entorno ✅
│   └── requirements.txt    # Dependencias Python
└── frontend-nextjs/
    ├── app/
    │   ├── login/          # Página de login
    │   ├── home/           # Dashboard
    │   ├── chat/           # Chat con IA
    │   ├── diary/          # Diario
    │   ├── calendar/       # Calendario
    │   ├── meditation/     # Meditación
    │   ├── psychologists/  # Psicólogos
    │   └── tips/           # Consejos
    ├── lib/
    │   ├── firebase.ts     # Config Firebase
    │   └── api.ts          # Cliente API
    └── .env.local          # Variables ✅
```

## 🎨 Mejoras vs React

1. **Mejor SEO** - Server-side rendering
2. **Carga más rápida** - Optimización automática
3. **TypeScript** - Type safety
4. **Tailwind CSS** - Estilos modernos
5. **Deploy fácil** - Optimizado para Vercel
6. **Mejor UX** - Transiciones suaves

## 📱 Páginas Implementadas

- ✅ Login/Registro
- ✅ Home (Dashboard)
- ✅ Chat con IA
- ✅ Diario emocional
- ✅ Calendario de emociones
- ✅ Meditación
- ✅ Directorio de psicólogos
- ✅ Consejos motivacionales

## 📱 Proyecto Original

Esta es la versión web del proyecto Android Zenith ubicado en la carpeta raíz.
