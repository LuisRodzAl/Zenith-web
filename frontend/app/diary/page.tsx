'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { notesAPI, emotionsAPI } from '@/lib/api';

interface Emotion {
  name: string;
  emoji: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  emotion_name: string;
  emotion_emoji: string;
  timestamp: string;
}

export default function DiaryPage() {
  const [user, setUser] = useState<any>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    emotion_name: '',
    emotion_emoji: ''
  });
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadNotes();
        loadEmotions();
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const loadNotes = async () => {
    try {
      const response = await notesAPI.getAll();
      setNotes(response.data);
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const loadEmotions = async () => {
    try {
      const response = await emotionsAPI.getAll();
      setEmotions(response.data);
    } catch (error) {
      console.error('Error loading emotions:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await notesAPI.create(formData);
      setFormData({ title: '', content: '', emotion_name: '', emotion_emoji: '' });
      setShowForm(false);
      await loadNotes();
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta nota?')) {
      try {
        await notesAPI.delete(id);
        loadNotes();
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  const selectEmotion = (emotion: Emotion) => {
    setFormData({
      ...formData,
      emotion_name: emotion.name,
      emotion_emoji: emotion.emoji
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="gradient-primary text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/home')}
            className="flex items-center gap-2 hover:bg-white/20 px-3 py-2 rounded-lg transition"
          >
            <span>←</span>
            <span>Volver</span>
          </button>
          <h1 className="text-xl font-bold">📝 Mi Diario</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition"
          >
            {showForm ? 'Cancelar' : '+ Nueva'}
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Título"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition"
                required
              />
              <textarea
                placeholder="¿Cómo te sientes hoy?"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition min-h-[120px]"
                required
              />
              
              <div>
                <p className="font-semibold mb-3">Selecciona tu emoción:</p>
                <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
                  {emotions.map((emotion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => selectEmotion(emotion)}
                      className={`flex flex-col items-center p-3 rounded-xl border-2 transition ${
                        formData.emotion_emoji === emotion.emoji
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <span className="text-3xl mb-1">{emotion.emoji}</span>
                      <span className="text-xs">{emotion.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={!formData.emotion_emoji}
                className="w-full gradient-primary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                Guardar Nota
              </button>
            </form>
          </div>
        )}

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              No tienes notas aún. ¡Crea tu primera nota!
            </div>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-800 flex-1">{note.title}</h3>
                    <span className="text-4xl">{note.emotion_emoji}</span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-3">{note.content}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">
                      {note.timestamp ? new Date(note.timestamp).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'Hoy'}
                    </span>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
