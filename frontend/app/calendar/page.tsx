'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { emotionsAPI } from '@/lib/api';

export default function CalendarPage() {
  const [user, setUser] = useState<any>(null);
  const [emotionsByDay, setEmotionsByDay] = useState<Record<string, string>>({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadEmotions();
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const loadEmotions = async () => {
    try {
      const response = await emotionsAPI.getCalendar();
      setEmotionsByDay(response.data);
    } catch (error) {
      console.error('Error loading calendar:', error);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getDateKey = (day: number) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${month}-${dayStr}`;
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="gradient-primary text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/home')}
            className="flex items-center gap-2 hover:bg-white/20 px-3 py-2 rounded-lg transition"
          >
            <span>←</span>
            <span>Volver</span>
          </button>
          <h1 className="text-xl font-bold">📅 Calendario de Emociones</h1>
          <div></div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto">
          {/* Controls */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={previousMonth}
              className="gradient-primary text-white w-10 h-10 rounded-full flex items-center justify-center hover:opacity-90 transition"
            >
              ←
            </button>
            <h2 className="text-2xl font-bold text-gray-800">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={nextMonth}
              className="gradient-primary text-white w-10 h-10 rounded-full flex items-center justify-center hover:opacity-90 transition"
            >
              →
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {dayNames.map(day => (
              <div key={day} className="text-center font-semibold text-purple-600 py-2">
                {day}
              </div>
            ))}
            
            {[...Array(startingDayOfWeek)].map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square"></div>
            ))}
            
            {[...Array(daysInMonth)].map((_, index) => {
              const day = index + 1;
              const dateKey = getDateKey(day);
              const emotion = emotionsByDay[dateKey];
              
              return (
                <div
                  key={day}
                  className="aspect-square border-2 border-gray-200 rounded-xl flex flex-col items-center justify-center hover:border-purple-500 transition cursor-pointer"
                >
                  <span className="text-sm text-gray-600">{day}</span>
                  {emotion && <span className="text-2xl mt-1">{emotion}</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
