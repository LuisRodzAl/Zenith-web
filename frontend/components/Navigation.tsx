'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { MeditationIcon } from './icons/MeditationIcon';
import { HelpIcon } from './icons/HelpIcon';
import { ChatIcon } from './icons/ChatIcon';
import { HomeIcon } from './icons/HomeIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { NotesIcon } from './icons/NotesIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { ZenithLogoIcon } from './icons/ZenithLogoIcon';

interface NavigationProps {
    user?: any;
    children?: React.ReactNode;
}

export default function Navigation({ user, children }: NavigationProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/login');
    };

    return (
        <>
            {/* Sidebar Menu Backdrop */}
            {menuOpen && (
                <div
                    className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-40 transition-opacity"
                    onClick={() => setMenuOpen(false)}
                />
            )}

            {/* Sidebar Menu */}
            <div className={`fixed inset-y-0 left-0 bg-white z-50 w-64 md:w-80 shadow-xl transform transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Menu Header */}
                    <div className="bg-zenith-teal p-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ZenithLogoIcon className="w-12 h-12" />
                            <span className="text-white text-2xl font-bold">ZENITH</span>
                        </div>
                        <button onClick={() => setMenuOpen(false)} className="text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* User Info */}
                    <div className="p-6 border-b border-gray-200">
                        <p className="text-lg font-semibold text-gray-800">
                            {user?.displayName || user?.email?.split('@')[0] || 'Usuario'}
                        </p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>

                    {/* Menu Items */}
                    <nav className="flex-1 overflow-y-auto">
                        <button
                            onClick={() => { router.push('/home'); setMenuOpen(false); }}
                            className="w-full px-6 py-4 text-left hover:bg-gray-100 flex items-center gap-3 transition-colors"
                        >
                            <HomeIcon className="w-6 h-6" />
                            <span className="text-gray-800 font-medium">Inicio</span>
                        </button>
                        <button
                            onClick={() => { router.push('/meditation'); setMenuOpen(false); }}
                            className="w-full px-6 py-4 text-left hover:bg-gray-100 flex items-center gap-3 transition-colors"
                        >
                            <MeditationIcon className="w-6 h-6 text-zenith-dark" />
                            <span className="text-gray-800 font-medium">Meditación</span>
                        </button>
                        <button
                            onClick={() => { router.push('/diary'); setMenuOpen(false); }}
                            className="w-full px-6 py-4 text-left hover:bg-gray-100 flex items-center gap-3 transition-colors"
                        >
                            <NotesIcon className="w-6 h-6" />
                            <span className="text-gray-800 font-medium">Diario</span>
                        </button>
                        <button
                            onClick={() => { router.push('/calendar'); setMenuOpen(false); }}
                            className="w-full px-6 py-4 text-left hover:bg-gray-100 flex items-center gap-3 transition-colors"
                        >
                            <CalendarIcon className="w-6 h-6" />
                            <span className="text-gray-800 font-medium">Calendario</span>
                        </button>
                        <button
                            onClick={() => { router.push('/tips'); setMenuOpen(false); }}
                            className="w-full px-6 py-4 text-left hover:bg-gray-100 flex items-center gap-3 transition-colors"
                        >
                            <HelpIcon className="w-6 h-6 text-zenith-dark" />
                            <span className="text-gray-800 font-medium">Tips</span>
                        </button>
                        <button
                            onClick={() => { router.push('/chat'); setMenuOpen(false); }}
                            className="w-full px-6 py-4 text-left hover:bg-gray-100 flex items-center gap-3 transition-colors"
                        >
                            <ChatIcon className="w-6 h-6" />
                            <span className="text-gray-800 font-medium">Chat</span>
                        </button>
                        <button
                            onClick={() => { router.push('/psychologists'); setMenuOpen(false); }}
                            className="w-full px-6 py-4 text-left hover:bg-gray-100 flex items-center gap-3 transition-colors"
                        >
                            <PhoneIcon className="w-6 h-6" />
                            <span className="text-gray-800 font-medium">Contactos</span>
                        </button>
                    </nav>

                    {/* Logout Button */}
                    <div className="p-6 border-t border-gray-200">
                        <button
                            onClick={() => { handleLogout(); setMenuOpen(false); }}
                            className="w-full px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                        >
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </div>

            {/* Header */}
            <header className="bg-zenith-teal p-4 flex justify-between items-center shadow-md z-10 h-16 text-white">
                <button onClick={() => setMenuOpen(true)} className="text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <div className="flex-1"></div>
                {children}
            </header>
        </>
    );
}
