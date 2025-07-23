'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PendingApprovalPage() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F2F3F5] via-[#E8F4FD] to-[#D1E9FF]">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 m-4">
        {/* Header con icono animado */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg mb-6">
            <svg className="h-10 w-10 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Registro Completado!</h1>
          <p className="text-lg text-gray-600">Tu proyecto está en evaluación</p>
        </div>

        {/* Información del usuario */}
        {session?.user && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Datos del solicitante:</h3>
            <p className="text-gray-900 font-semibold">{session.user.name}</p>
            <p className="text-gray-600">{session.user.email}</p>
          </div>
        )}
        
        {/* Estado actual */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Estado: En Evaluación</h3>
              <p className="text-blue-700 mb-4">
                Tu solicitud de registro se encuentra actualmente en proceso de evaluación por nuestro equipo administrativo de StartUPC.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-blue-600">
                  <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <strong>Tiempo estimado:</strong> 2-3 días hábiles
                </div>
                <div className="flex items-center text-blue-600">
                  <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <strong>Notificación:</strong> Recibirás un email con la decisión
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Próximos pasos */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-green-800 mb-3">¿Qué sucede ahora?</h3>
          <div className="space-y-3 text-green-700">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="h-2 w-2 bg-green-400 rounded-full"></div>
              </div>
              <p className="ml-3 text-sm">Nuestro equipo revisará tu proyecto y documentación</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="h-2 w-2 bg-green-400 rounded-full"></div>
              </div>
              <p className="ml-3 text-sm">Te notificaremos por email sobre la decisión</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="h-2 w-2 bg-green-400 rounded-full"></div>
              </div>
              <p className="ml-3 text-sm">Si es aprobado, podrás acceder al panel de tu proyecto</p>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="w-full sm:w-auto">
            <button className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium">
              Volver al Inicio
            </button>
          </Link>
          
          <button 
            onClick={() => window.location.reload()} 
            className="w-full sm:w-auto px-6 py-3 bg-[#ff2d5b] text-white rounded-lg hover:bg-[#ff1f4f] transition-colors duration-200 font-medium"
          >
            Actualizar Estado
          </button>
        </div>

        {/* Información de contacto */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500 mb-2">
            ¿Tienes preguntas? Contáctanos:
          </p>
          <p className="text-sm font-medium text-gray-700">
            📧 soporte@startupc.pe | 📱 WhatsApp: +51 999 888 777
          </p>
        </div>
      </div>
    </div>
  );
}
