'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Cargando...</div>
      </div>
    );
  }

  const features = [
    { 
      icon: '💬', 
      title: 'Chat IA', 
      description: 'Habla con Zenith, tu asistente personal', 
      path: '/chat', 
      color: 'from-blue-500 to-purple-600',
      iconBg: 'bg-blue-100'
    },
    { 
      icon: '📝', 
      title: 'Diario', 
      description: 'Registra tus pensamientos y emociones', 
      path: '/diary', 
      color: 'from-pink-500 to-rose-600',
      iconBg: 'bg-pink-100'
    },
    { 
      icon: '📅', 
      title: 'Calendario', 
      description: 'Visualiza tu estado emocional', 
      path: '/calendar', 
      color: 'from-green-500 to-teal-600',
      iconBg: 'bg-green-100'
    },
    { 
      icon: '🧘', 
      title: 'Meditación', 
      description: 'Relájate con ejercicios guiados', 
      path: '/meditation', 
      color: 'from-indigo-500 to-blue-600',
      iconBg: 'bg-indigo-100'
    },
    { 
      icon: '👨‍⚕️', 
      title: 'Psicólogos', 
      description: 'Encuentra profesionales cerca de ti', 
      path: '/psychologists', 
      color: 'from-orange-500 to-red-600',
      iconBg: 'bg-orange-100'
    },
    { 
      icon: '💡', 
      title: 'Consejos', 
      description: 'Descubre tips para tu bienestar', 
      path: '/tips', 
      color: 'from-yellow-500 to-orange-600',
      iconBg: 'bg-yellow-100'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <header className="gradient-primary text-white shadow-material-3">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                <div className="text-4xl">🧘</div>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Zenith</h1>
                <p className="text-sm opacity-90">Tu bienestar mental</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                <p className="text-xs opacity-90">Hola,</p>
                <p className="font-semibold">{user?.displayName || user?.email?.split('@')[0]}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-smooth backdrop-blur-sm btn-material"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-3">
            ¡Bienvenido, {user?.displayName || 'Usuario'}! 👋
          </h2>
          <p className="text-gray-600 text-lg">¿Cómo te sientes hoy?</p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-10">
          {features.map((feature, index) => (
            <button
              key={index}
              onClick={() => router.push(feature.path)}
              className="card-elevated shadow-material-2 overflow-hidden text-left group"
            >
              <div className={`h-40 bg-gradient-to-br ${feature.color} flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-smooth"></div>
                <div className={`${feature.iconBg} p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-smooth relative z-10`}>
                  <div className="text-5xl">{feature.icon}</div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-smooth">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Motivational Quote */}
        <div className="max-w-3xl mx-auto">
          <div className="card-elevated shadow-material-3 p-8 text-center bg-gradient-to-br from-white to-purple-50">
            <div className="inline-block p-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full mb-4">
              <div className="text-5xl">✨</div>
            </div>
            <p className="text-2xl text-gray-700 font-medium mb-2">
              "La salud mental es tan importante como la salud física"
            </p>
            <p className="text-gray-500 text-sm">— Organización Mundial de la Salud</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-10">
          <div className="card-elevated shadow-material-1 p-4 text-center">
            <div className="text-3xl mb-2">📊</div>
            <p className="text-sm text-gray-600">Estadísticas</p>
          </div>
          <div className="card-elevated shadow-material-1 p-4 text-center">
            <div className="text-3xl mb-2">🎯</div>
            <p className="text-sm text-gray-600">Objetivos</p>
          </div>
          <div className="card-elevated shadow-material-1 p-4 text-center">
            <div className="text-3xl mb-2">🏆</div>
            <p className="text-sm text-gray-600">Logros</p>
          </div>
          <div className="card-elevated shadow-material-1 p-4 text-center">
            <div className="text-3xl mb-2">⭐</div>
            <p className="text-sm text-gray-600">Progreso</p>
          </div>
        </div>
      </main>
    </div>
  );
}
