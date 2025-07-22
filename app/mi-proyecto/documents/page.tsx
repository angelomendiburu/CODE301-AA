'use client';
import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AvatarImage from '@/components/AvatarImage';

interface Metric {
  id: string;
  title: string;
  description?: string;
  comment: string;
  imageUrl: string;
  documentUrl: string;
  sales?: number;
  expenses?: number;
  createdAt: string;
}

export default function DocumentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isDarkMode] = useState(false);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  // Redirect admin to admin panel
  useEffect(() => {
    if (session && session.user?.email === 'angelomendiburu@gmail.com') {
      router.push('/admin/metrics');
    }
  }, [session, router]);

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Cargar métricas del usuario
  const loadMetrics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/metrics');
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      }
    } catch (error) {
      console.error('Error loading metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session && session.user?.email !== 'angelomendiburu@gmail.com') {
      loadMetrics();
    }
  }, [session]);

  const handleDownloadDocument = (url: string, title: string) => {
    window.open(url, '_blank');
  };

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className={`flex size-full min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-neutral-50'}`}>
      {/* Panel lateral */}
      <div className={`w-64 flex-shrink-0 border-r ${
        isDarkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg h-8 w-8"
              style={{ backgroundImage: 'url("/placeholders/logo.svg")' }}
            />
            <div>
              <h1 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Mi Proyecto
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Panel de usuario
              </p>
            </div>
          </div>

          {/* Navegación */}
          <nav className="space-y-2">
            <a
              href="/mi-proyecto"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m8 7 4-4 4 4" />
              </svg>
              Dashboard
            </a>

            <a
              href="/mi-proyecto/documents"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-blue-500 text-white'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Documentos
            </a>
          </nav>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className={`border-b px-6 py-4 ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-xl font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Mis Documentos
            </h2>
            
            <div className="flex items-center gap-4">
              {/* Perfil del usuario */}
              <div className="flex items-center gap-3">
                <AvatarImage
                  src={session.user?.image}
                  alt={session.user?.name || 'Usuario'}
                  size={32}
                  fallback={session.user?.name?.charAt(0) || 'U'}
                />
                <div className="flex flex-col">
                  <p className={`text-sm font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {session.user?.name || 'Usuario'}
                  </p>
                  <p className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {session.user?.email}
                  </p>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                className="flex items-center justify-center h-8 px-3 text-xs font-medium rounded-lg transition-colors bg-gradient-to-r from-[#FF2D55] to-[#FF6A00] hover:from-[#FF2D55]/80 hover:to-[#FF6A00]/80 text-white"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </header>

        {/* Contenido de documentos */}
        <main className={`flex-1 p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="max-w-6xl mx-auto">
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className={`ml-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Cargando documentos...
                </span>
              </div>
            ) : metrics.length === 0 ? (
              <div className="text-center py-12">
                <div className={`mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <svg className={`w-8 h-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  No tienes documentos
                </h3>
                <p className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Los documentos de tus métricas aparecerán aquí cuando subas tu primera métrica.
                </p>
                <a
                  href="/mi-proyecto"
                  className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
                >
                  Ir al Dashboard
                </a>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {metrics
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((metric) => (
                    <div key={metric.id} className={`rounded-lg border shadow-sm overflow-hidden transition-shadow hover:shadow-md ${
                      isDarkMode 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-white border-gray-200'
                    }`}>
                      {/* Vista previa de la imagen */}
                      <div className="aspect-video bg-gray-200 overflow-hidden relative">
                        <Image
                          src={metric.imageUrl}
                          alt={metric.title}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center hidden">
                          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                      
                      {/* Información del documento */}
                      <div className="p-4">
                        <h3 className={`font-semibold mb-2 truncate ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {metric.title}
                        </h3>
                        
                        <p className={`text-sm mb-3 line-clamp-2 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {metric.comment}
                        </p>
                        
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            isDarkMode 
                              ? 'bg-gray-700 text-gray-300' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {new Date(metric.createdAt).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                          
                          {(metric.sales || metric.expenses) && (
                            <div className="flex gap-2 text-xs">
                              {metric.sales && (
                                <span className="text-green-600 font-medium">
                                  +${metric.sales.toLocaleString()}
                                </span>
                              )}
                              {metric.expenses && (
                                <span className="text-red-600 font-medium">
                                  -${metric.expenses.toLocaleString()}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {/* Botón para descargar documento */}
                        <button
                          onClick={() => handleDownloadDocument(metric.documentUrl, metric.title)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Ver Documento
                        </button>
                      </div>
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
