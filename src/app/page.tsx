'use client';

import { useState } from 'react';

export default function SimplePage() {
  const [message, setMessage] = useState('Cargando...');

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          DentalCare Pro - Test Simple
        </h1>
        <p className="text-gray-600 mb-4">
          {message}
        </p>
        <button
          onClick={() => setMessage('¡Funciona correctamente!')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Probar Botón
        </button>
      </div>
    </div>
  );
}