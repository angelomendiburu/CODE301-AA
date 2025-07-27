'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminRegisterDiscardedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user.role !== 'admin') {
      router.push('/');
    }
  }, [session, status, router]);

  if (status === 'loading' || !session || session.user.role !== 'admin') {
    return <div>Cargando...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Registros Descartados</h1>
        <p className="text-gray-600 mt-2">Gestiona registros rechazados con retroalimentación</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Solicitudes Descartadas</h2>
          <p className="text-gray-600">Solicitudes rechazadas con comentarios de retroalimentación</p>
        </div>
        
        <div className="text-center text-gray-500 py-8">
          <p>No hay registros descartados en este momento</p>
        </div>
      </div>
    </div>
  );
}
