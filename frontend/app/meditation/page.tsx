'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

import Navigation from '@/components/Navigation';

export default function MeditationPage() {
  const [user, setUser] = useState<any>(null);
  const [duration, setDuration] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showInhale, setShowInhale] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            stopMeditation();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (isActive) {
      const breathInterval = setInterval(() => {
        setShowInhale(prev => !prev);
      }, 5000);
      return () => clearInterval(breathInterval);
    }
  }, [isActive]);

  const startMeditation = () => {
    const seconds = parseInt(duration);
    if (seconds > 0) {
      setTimeLeft(seconds);
      setIsActive(true);
      setShowInhale(true);
    }
  };

  const stopMeditation = () => {
    setIsActive(false);
    setTimeLeft(0);
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-zenith-light">
      <Navigation user={user} />

      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-center text-zenith-dark mb-6">
            Ejercicio de Respiración
          </h2>

          {!isActive ? (
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Duración en segundos:
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Ej: 60"
                  min="1"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#02B396] focus:outline-none transition"
                />
              </div>
              <button
                onClick={startMeditation}
                disabled={!duration}
                className="w-full bg-[#02B396] text-white py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition disabled:opacity-50"
              >
                Comenzar
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-[#02B396] mb-6">
                  {formatTime(timeLeft)}
                </div>

                <div className="flex items-center justify-center mb-6">
                  <div className={`w-32 h-32 rounded-full bg-[#02B396] transition-all duration-[5000ms] ${showInhale ? 'scale-150 opacity-80' : 'scale-100 opacity-100'
                    }`}></div>
                </div>

                <div className="text-3xl font-bold text-gray-800 mb-2">
                  {showInhale ? 'Inhala 🌬️' : 'Exhala 💨'}
                </div>
              </div>

              <button
                onClick={stopMeditation}
                className="w-full bg-red-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-red-600 transition"
              >
                Detener
              </button>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="font-bold text-gray-800 mb-3">Consejos:</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-[#02B396]">✓</span>
                <span>Encuentra un lugar tranquilo</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#02B396]">✓</span>
                <span>Siéntate cómodamente</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#02B396]">✓</span>
                <span>Respira profundamente</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#02B396]">✓</span>
                <span>Concéntrate en tu respiración</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
