'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { chatAPI } from '@/lib/api';
import Navigation from '@/components/Navigation';

interface Message {
  text: string;
  isUser: boolean;
}

export default function ChatPage() {
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadHistory();
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadHistory = async () => {
    try {
      const response = await chatAPI.getHistory(10);
      if (response.data.length === 0) {
        setMessages([{
          text: `Hola, soy Zenith, tu asistente psicológico virtual. ¿En qué puedo ayudarte hoy?`,
          isUser: false
        }]);
      } else {
        const formattedMessages = response.data.map((msg: any) => ({
          text: msg.text,
          isUser: msg.is_user_message
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setLoading(true);

    try {
      const response = await chatAPI.sendMessage(userMessage);
      setMessages(prev => [...prev, { text: response.data.response, isUser: false }]);
    } catch (error: any) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        text: `Lo siento, hubo un error: ${error.response?.data?.error || error.message}`,
        isUser: false
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    if (window.confirm('¿Estás seguro de que quieres borrar el historial?')) {
      try {
        await chatAPI.clearHistory();
        setMessages([{
          text: `Hola, soy Zenith, tu asistente psicológico virtual. ¿En qué puedo ayudarte hoy?`,
          isUser: false
        }]);
      } catch (error) {
        console.error('Error clearing history:', error);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-zenith-light">
      {/* Header */}
      <Navigation user={user}>
        <button
          onClick={handleClear}
          className="hover:bg-white/20 px-3 py-2 rounded-lg transition text-sm font-medium"
        >
          Limpiar
        </button>
      </Navigation>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-2xl px-4 py-3 ${msg.isUser
                ? 'bg-[#02B396] text-white'
                : 'bg-white shadow-md text-gray-800'
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white shadow-md rounded-2xl px-4 py-3">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="container mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe tu mensaje..."
            disabled={loading}
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-full focus:border-[#02B396] focus:outline-none transition"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-[#02B396] text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
