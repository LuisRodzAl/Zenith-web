'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { tipsAPI } from '@/lib/api';
import Navigation from '@/components/Navigation';

interface Tip {
  texto: string;
  imagen: string;
}

export default function TipsPage() {
  const [user, setUser] = useState<any>(null);
  const [tips, setTips] = useState<Tip[]>([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadTips();
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const loadTips = async () => {
    try {
      const response = await tipsAPI.getAll();
      setTips(response.data);
    } catch (error) {
      console.error('Error loading tips:', error);
    }
  };

  return (
    <div className="min-h-screen bg-zenith-light">
      <Navigation user={user} />

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={tip.imagen}
                  alt="Consejo"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Zenith';
                  }}
                />
              </div>
              <div className="p-6">
                <p className="text-gray-700 text-center font-medium leading-relaxed">
                  {tip.texto}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
