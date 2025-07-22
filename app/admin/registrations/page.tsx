'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AvatarImage from '@/components/AvatarImage';

type RegistrationTab = 'pending' | 'approved' | 'incomplete' | 'discarded';

export default function AdminRegistrationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<RegistrationTab>('pending');

  // Cargar configuraciones guardadas
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('adminDarkMode');
    if (savedDarkMode !== null) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }
    
    // Listener para sincronizar el modo oscuro desde el sidebar
    const handleDarkModeChange = (event: CustomEvent) => {
      setIsDarkMode(event.detail.isDarkMode);
    };
    
    window.addEventListener('adminDarkModeChange', handleDarkModeChange as EventListener);
    
    return () => {
      window.removeEventListener('adminDarkModeChange', handleDarkModeChange as EventListener);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Verificar autorización
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user?.email !== 'angelomendiburu@gmail.com') {
      router.push('/');
      return;
    }
  }, [session, status, router]);

  const tabs = [
    { id: 'pending', label: 'Solicitudes Pendientes', icon: '⏳', count: 0 },
    { id: 'approved', label: 'Registros Aprobados', icon: '✅', count: 0 },
    { id: 'incomplete', label: 'Registros Incompletos', icon: '⚠️', count: 0 },
    { id: 'discarded', label: 'Registros Descartados', icon: '❌', count: 0 },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'pending':
        return (
          <div className={`rounded-lg shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Solicitudes Pendientes</h2>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Solicitudes en espera de evaluación</p>
            </div>
            <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <div className={`mx-auto h-16 w-16 mb-4 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <span className="text-2xl">⏳</span>
              </div>
              <p className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>No hay solicitudes pendientes</p>
              <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Las nuevas solicitudes aparecerán aquí</p>
            </div>
          </div>
        );

      case 'approved':
        return (
          <div className={`rounded-lg shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Registros Aprobados</h2>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Usuarios que han completado el proceso de registro exitosamente</p>
            </div>
            <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <div className={`mx-auto h-16 w-16 mb-4 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <span className="text-2xl">✅</span>
              </div>
              <p className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>No hay registros completados</p>
              <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Los registros aprobados aparecerán aquí</p>
            </div>
          </div>
        );

      case 'incomplete':
        return (
          <div className={`rounded-lg shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Registros Incompletos</h2>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Solicitudes que requieren más información del usuario</p>
            </div>
            <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <div className={`mx-auto h-16 w-16 mb-4 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <span className="text-2xl">⚠️</span>
              </div>
              <p className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>No hay registros incompletos</p>
              <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Los registros que necesiten información adicional aparecerán aquí</p>
            </div>
          </div>
        );

      case 'discarded':
        return (
          <div className={`rounded-lg shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Registros Descartados</h2>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Solicitudes rechazadas con comentarios de retroalimentación</p>
            </div>
            <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <div className={`mx-auto h-16 w-16 mb-4 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <span className="text-2xl">❌</span>
              </div>
              <p className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>No hay registros descartados</p>
              <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Los registros rechazados aparecerán aquí</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  if (!session || session.user?.email !== 'angelomendiburu@gmail.com') {
    return <div className="flex items-center justify-center min-h-screen">Acceso denegado</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      {/* Header */}
      <div className={`flex justify-between items-center mb-6 rounded-lg p-4 shadow-sm ${
        isDarkMode 
          ? 'bg-gray-800 border border-gray-700' 
          : 'bg-white border-l-4 border-l-green-600 shadow-lg'
      }`}>
        <div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Gestión de Registros</h1>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Administra todas las solicitudes de registro y su estado</p>
        </div>
        
        {/* Información del usuario */}
        {session && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <AvatarImage
                src={session.user?.image}
                alt={session.user?.name || 'Usuario'}
                size={32}
                fallback={session.user?.name?.charAt(0) || 'U'}
              />
              <div className="flex flex-col">
                <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {session.user?.name || 'Usuario'}
                </p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Admin - {session.user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className={`flex items-center justify-center h-8 px-3 text-xs font-medium rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-[#FF2D55] to-[#FF6A00] hover:from-[#FF2D55]/80 hover:to-[#FF6A00]/80 text-white' 
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className={`mb-6 rounded-lg shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as RegistrationTab)}
              className={`flex-1 min-w-0 py-4 px-6 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? isDarkMode
                    ? 'text-blue-400 border-blue-400 bg-gray-700'
                    : 'text-blue-600 border-blue-600 bg-blue-50'
                  : isDarkMode
                    ? 'text-gray-300 border-transparent hover:text-white hover:bg-gray-700'
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg">{tab.icon}</span>
                <span className="hidden sm:inline truncate">{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-800'
                      : isDarkMode
                        ? 'bg-gray-600 text-gray-200'
                        : 'bg-gray-200 text-gray-800'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {renderTabContent()}
      </div>
    </div>
  );
}
