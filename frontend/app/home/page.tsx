'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Image from 'next/image';
import { User } from 'firebase/auth';
import { MeditationIcon } from '../../components/icons/MeditationIcon';
import { HelpIcon } from '../../components/icons/HelpIcon';
import { ChatIcon } from '../../components/icons/ChatIcon';
import { HomeIcon } from '../../components/icons/HomeIcon';
import { CalendarIcon } from '../../components/icons/CalendarIcon';
import { NotesIcon } from '../../components/icons/NotesIcon';
import { PhoneIcon } from '../../components/icons/PhoneIcon';
import { ZenithLogoIcon } from '../../components/icons/ZenithLogoIcon';
import Navigation from '@/components/Navigation';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const carouselData = [
    { src: '/carousel/img1.png', text: 'Cada día es una oportunidad para crecer' },
    { src: '/carousel/img2.png', text: 'Tu paz mental es tu prioridad' },
    { src: '/carousel/img3.png', text: 'Respira profundo y sigue adelante' },
    { src: '/carousel/img4.png', text: 'Eres más fuerte de lo que crees' },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-zenith-light"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zenith-teal"></div></div>;

  const quickActions = [
    {
      name: 'Meditation',
      component: <MeditationIcon className="w-12 h-12 text-zenith-dark" />,
      action: () => router.push('/meditation')
    },
    {
      name: 'Tips',
      component: <HelpIcon className="w-12 h-12 text-zenith-dark" />,
      action: () => router.push('/tips')
    },
    {
      name: 'Diary',
      component: <NotesIcon className="w-12 h-12" />,
      action: () => router.push('/diary')
    },
    {
      name: 'Calendar',
      component: <CalendarIcon className="w-12 h-12" />,
      action: () => router.push('/calendar')
    }
  ];

  return (
    <div className="min-h-screen bg-zenith-light flex flex-col relative">
      <Navigation user={user}>
        <button onClick={handleLogout} className="text-white text-base font-medium">
          Cerrar sesión
        </button>
      </Navigation>

      {/* Logo Section */}
      <div className="bg-zenith-light py-8 flex justify-center items-center">
        <div className="flex items-center gap-3">
          <ZenithLogoIcon className="w-16 h-16" />
          <span className="text-zenith-teal text-4xl font-bold tracking-wider">ZENITH</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-around px-4 py-4 mb-4 border-y border-gray-200 bg-white">
        {quickActions.map((action, index) => (
          <button key={index} onClick={action.action} className="flex flex-col items-center gap-2 p-2 w-1/4">
            {action.component}
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col px-4 pb-28">
        {/* Hero Card / Carousel */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex h-56 mb-8 relative">
          <div className="w-1/2 relative bg-[#FFF8E1]">
            {carouselData.map((item, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
              >
                <Image
                  src={item.src}
                  alt="Motivation"
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-contain object-center"
                />
              </div>
            ))}
          </div>
          <div className="w-1/2 bg-[#02B396] p-6 flex items-center justify-center text-center">
            <p className="text-white italic font-medium leading-relaxed text-lg">
              {carouselData[currentImageIndex].text}
            </p>
          </div>
        </div>

        {/* Welcome Character Section */}
        <div className="flex items-end gap-4 mt-auto">
          <div className="w-1/3 relative h-48">
            <Image
              src="/bunny.png"
              alt="Zenith Bunny"
              fill
              sizes="(max-width: 768px) 33vw, 20vw"
              className="object-contain object-bottom"
            />
          </div>
          <div className="bg-[#02B396] text-white p-6 rounded-2xl rounded-bl-none mb-10 flex-1 shadow-md">
            <p className="text-xl">¡Bienvenido, {user?.displayName || user?.email?.split('@')[0] || 'Usuario'}!</p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-zenith-light border-t border-gray-200 p-4 flex justify-around items-end z-20 h-20">
        <button onClick={() => router.push('/chat')} className="flex flex-col items-center gap-1 mb-2">
          <ChatIcon className="w-12 h-12" />
        </button>
        <button className="flex flex-col items-center gap-1 -mt-10">
          <div className="rounded-full p-3 shadow-xl">
            <HomeIcon className="w-10 h-10" />
          </div>
        </button>
        <button onClick={() => router.push('/psychologists')} className="flex flex-col items-center gap-1 mb-2">
          <PhoneIcon className="w-12 h-12" />
        </button>
      </div>
    </div>
  );
}
