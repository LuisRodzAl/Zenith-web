'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { notesAPI } from '@/lib/api';
import Navigation from '@/components/Navigation';

interface Note {
  id: string;
  title: string;
  content: string;
  emotion_name: string;
  emotion_emoji: string;
  timestamp: string;
}

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
      const response = await notesAPI.getAll();
      const notes: Note[] = response.data;

      const emotionsMap: Record<string, string[]> = {};

      notes.forEach(note => {
        if (!note.timestamp || !note.emotion_emoji) return;

        const date = new Date(note.timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateKey = `${year}-${month}-${day}`;

        if (!emotionsMap[dateKey]) {
          emotionsMap[dateKey] = [];
        }
        emotionsMap[dateKey].push(note.emotion_emoji);
      });

      const finalEmotions: Record<string, string> = {};

      Object.keys(emotionsMap).forEach(dateKey => {
        const emojis = emotionsMap[dateKey];
        const counts: Record<string, number> = {};
        let maxCount = 0;
        let mostFrequentEmoji = emojis[0];

        emojis.forEach(emoji => {
          counts[emoji] = (counts[emoji] || 0) + 1;
          if (counts[emoji] > maxCount) {
            maxCount = counts[emoji];
            mostFrequentEmoji = emoji;
          }
        });

        finalEmotions[dateKey] = mostFrequentEmoji;
      });

      setEmotionsByDay(finalEmotions);
    } catch (error) {
      console.error('Error loading calendar data:', error);
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
    <div className="min-h-screen bg-zenith-light">
      <Navigation user={user} />

      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto">
          {/* Controls */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={previousMonth}
              className="bg-[#02B396] text-white w-10 h-10 rounded-full flex items-center justify-center hover:opacity-90 transition"
            >
              ←
            </button>
            <h2 className="text-2xl font-bold text-gray-800">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={nextMonth}
              className="bg-[#02B396] text-white w-10 h-10 rounded-full flex items-center justify-center hover:opacity-90 transition"
            >
              →
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {dayNames.map(day => (
              <div key={day} className="text-center font-semibold text-[#02B396] py-2">
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
                  className="aspect-square border-2 border-gray-200 rounded-xl flex flex-col items-center justify-center hover:border-[#02B396] transition cursor-pointer"
                >
                  <span className="text-sm text-gray-600">{day}</span>
                  {emotion && <span className="text-2xl mt-1">{emotion}</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div >
    </div >
  );
}
