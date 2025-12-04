'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { psychologistsAPI } from '@/lib/api';
import Navigation from '@/components/Navigation';

interface Psychologist {
  id: string;
  nombre: string;
  especialidad: string;
  telefonoCelular: string;
  telefonoOficina: string;
  correoElectronico: string;
  direccion: string;
  ubicacionUrl: string;
  fotoUrl: string;
}

export default function PsychologistsPage() {
  const [user, setUser] = useState<any>(null);
  const [psychologists, setPsychologists] = useState<Psychologist[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '', especialidad: '', telefonoCelular: '', telefonoOficina: '',
    correoElectronico: '', direccion: '', ubicacionUrl: '', fotoUrl: ''
  });
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadPsychologists();
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const loadPsychologists = async () => {
    try {
      const response = await psychologistsAPI.getAll();
      setPsychologists(response.data);
    } catch (error) {
      console.error('Error loading psychologists:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await psychologistsAPI.create(formData);
      setFormData({
        nombre: '', especialidad: '', telefonoCelular: '', telefonoOficina: '',
        correoElectronico: '', direccion: '', ubicacionUrl: '', fotoUrl: ''
      });
      setShowForm(false);
      loadPsychologists();
    } catch (error) {
      console.error('Error creating psychologist:', error);
    }
  };

  return (
    <div className="min-h-screen bg-zenith-light">
      <Navigation user={user}>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition font-medium"
        >
          {showForm ? 'Cancelar' : '+ Agregar'}
        </button>
      </Navigation>

      <div className="container mx-auto px-4 py-6">
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Nombre completo" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#02B396] focus:outline-none" required />
              <input type="text" placeholder="Especialidad" value={formData.especialidad} onChange={(e) => setFormData({ ...formData, especialidad: e.target.value })} className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#02B396] focus:outline-none" required />
              <input type="tel" placeholder="Teléfono celular" value={formData.telefonoCelular} onChange={(e) => setFormData({ ...formData, telefonoCelular: e.target.value })} className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#02B396] focus:outline-none" />
              <input type="tel" placeholder="Teléfono oficina" value={formData.telefonoOficina} onChange={(e) => setFormData({ ...formData, telefonoOficina: e.target.value })} className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#02B396] focus:outline-none" />
              <input type="email" placeholder="Correo electrónico" value={formData.correoElectronico} onChange={(e) => setFormData({ ...formData, correoElectronico: e.target.value })} className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#02B396] focus:outline-none" required />
              <input type="url" placeholder="URL de ubicación" value={formData.ubicacionUrl} onChange={(e) => setFormData({ ...formData, ubicacionUrl: e.target.value })} className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#02B396] focus:outline-none" />
              <textarea placeholder="Dirección" value={formData.direccion} onChange={(e) => setFormData({ ...formData, direccion: e.target.value })} className="md:col-span-2 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#02B396] focus:outline-none" />
              <button type="submit" className="md:col-span-2 bg-[#02B396] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition">Guardar</button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {psychologists.map((psy) => (
            <div key={psy.id} className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-[#02B396] flex items-center justify-center text-3xl">
                  {psy.fotoUrl ? <img src={psy.fotoUrl} alt={psy.nombre} className="w-full h-full rounded-full object-cover" /> : '👨‍⚕️'}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{psy.nombre}</h3>
                  <p className="text-gray-600 text-sm">{psy.especialidad}</p>
                </div>
              </div>
              {psy.direccion && <p className="text-sm text-gray-600 mb-3">📍 {psy.direccion}</p>}
              <div className="flex flex-wrap gap-2 mb-4">
                {psy.telefonoCelular && <a href={`tel:${psy.telefonoCelular}`} className="px-3 py-1 bg-[#02B396]/10 text-[#02B396] rounded-full text-sm hover:bg-[#02B396]/20 transition">📱 Celular</a>}
                {psy.correoElectronico && <a href={`mailto:${psy.correoElectronico}`} className="px-3 py-1 bg-[#02B396]/10 text-[#02B396] rounded-full text-sm hover:bg-[#02B396]/20 transition">✉️ Email</a>}
                {psy.ubicacionUrl && <a href={psy.ubicacionUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-[#02B396]/10 text-[#02B396] rounded-full text-sm hover:bg-[#02B396]/20 transition">🗺️ Ubicación</a>}
              </div>

              <div className="space-y-2 border-t pt-3 border-gray-100">
                {psy.telefonoCelular && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="min-w-[20px]">📱</span>
                    <span className="select-all font-medium hover:text-[#02B396] transition cursor-text">{psy.telefonoCelular}</span>
                  </div>
                )}
                {psy.telefonoOficina && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="min-w-[20px]">📞</span>
                    <span className="select-all font-medium hover:text-[#02B396] transition cursor-text">{psy.telefonoOficina}</span>
                  </div>
                )}
                {psy.correoElectronico && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="min-w-[20px]">✉️</span>
                    <span className="select-all font-medium hover:text-[#02B396] transition cursor-text break-all">{psy.correoElectronico}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
