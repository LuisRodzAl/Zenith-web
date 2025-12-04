'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { ZenithLogoIcon } from '../../components/icons/ZenithLogoIcon';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push('/home');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
      router.push('/home');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zenith-light flex flex-col items-center justify-center p-6 relative overflow-hidden">

      {/* Logo Section */}
      <div className="flex flex-col items-center mb-10">
        <ZenithLogoIcon className="w-24 h-24 text-zenith-teal opacity-80" />
        <h1 className="text-5xl font-normal text-gray-700 mt-4 tracking-wide">Zenith</h1>
        <p className="text-gray-500 mt-4 text-lg font-medium">
          {isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleEmailAuth} className="w-full max-w-sm space-y-6">
        <div className="relative">
          <input
            type="email"
            placeholder="Correo electronico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-transparent border border-zenith-teal/30 rounded-lg focus:border-zenith-teal focus:outline-none placeholder-gray-500 text-gray-700"
            required
          />
        </div>

        <div className="relative">
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-transparent border border-zenith-teal/30 rounded-lg focus:border-zenith-teal focus:outline-none placeholder-gray-500 text-gray-700 pr-10"
            required
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg text-center">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white/60 hover:bg-white/80 text-zenith-dark py-3 rounded-full font-medium shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Cargando...' : (isRegister ? 'Registrarse' : 'Iniciar sesion')}
        </button>
      </form>

      {/* Divider */}
      <div className="my-6 text-gray-500 font-medium">-o-</div>

      {/* Google Button */}
      <button
        onClick={handleGoogleAuth}
        disabled={loading}
        className="w-full max-w-sm bg-white text-gray-700 py-3 rounded-full font-medium shadow-md flex items-center justify-center gap-2 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="font-medium">Iniciar con Google</span>
      </button>

      {/* Forgot Password */}
      <button className="mt-8 text-gray-700 font-bold text-sm hover:underline">
        ¿Olvido su contraseña?
      </button>

      {/* Register Toggle */}
      <button
        onClick={() => setIsRegister(!isRegister)}
        className="mt-8 text-gray-700 font-bold text-lg hover:text-zenith-teal transition-colors"
      >
        {isRegister ? 'Inicia sesión' : 'Registrate'}
      </button>
    </div>
  );
}
