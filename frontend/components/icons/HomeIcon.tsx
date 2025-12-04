import React from 'react';

export const HomeIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 500 500"
        className={className}
    >
        {/* Contorno exterior blanco */}
        <path d="M250,50 L450,200 L450,450 L50,450 L50,200 Z" fill="#FFFFFF" opacity="0.2" />

        {/* Techo - Color naranja/rojo vibrante */}
        <path d="M250,80 L420,220 L420,240 L80,240 L80,220 Z" fill="#FF6B35" />

        {/* Sombra del techo */}
        <path d="M250,80 L420,220 L400,230 L250,110 L100,230 L80,220 Z" fill="#E85A2F" />

        {/* Paredes - Color amarillo cálido */}
        <path d="M90,240 L410,240 L410,430 L90,430 Z" fill="#FFD93D" />

        {/* Sombra lateral de la pared */}
        <path d="M410,240 L410,430 L390,430 L390,250 Z" fill="#F5C518" />

        {/* Puerta - Color turquesa/verde agua */}
        <path d="M200,300 L300,300 L300,430 L200,430 Z" fill="#6BCF8F" rx="10" />

        {/* Manija de puerta */}
        <circle cx="280" cy="365" r="8" fill="#FFFFFF" />

        {/* Ventana izquierda - Color celeste */}
        <rect x="120" y="280" width="60" height="60" rx="5" fill="#87CEEB" />
        <line x1="150" y1="280" x2="150" y2="340" stroke="#FFFFFF" strokeWidth="3" />
        <line x1="120" y1="310" x2="180" y2="310" stroke="#FFFFFF" strokeWidth="3" />

        {/* Ventana derecha - Color celeste */}
        <rect x="320" y="280" width="60" height="60" rx="5" fill="#87CEEB" />
        <line x1="350" y1="280" x2="350" y2="340" stroke="#FFFFFF" strokeWidth="3" />
        <line x1="320" y1="310" x2="380" y2="310" stroke="#FFFFFF" strokeWidth="3" />

        {/* Detalles decorativos - pequeñas flores/arbustos */}
        <circle cx="100" cy="420" r="15" fill="#90EE90" />
        <circle cx="400" cy="420" r="15" fill="#90EE90" />

        {/* Chimenea - Color ladrillo */}
        <rect x="340" y="140" width="40" height="80" fill="#C44536" />
        <rect x="335" y="135" width="50" height="15" fill="#A83A2C" rx="2" />

        {/* Humo de chimenea - Color gris claro */}
        <circle cx="360" cy="110" r="12" fill="#E0E0E0" opacity="0.7" />
        <circle cx="370" cy="95" r="10" fill="#E0E0E0" opacity="0.6" />
        <circle cx="355" cy="85" r="8" fill="#E0E0E0" opacity="0.5" />
    </svg>
);
