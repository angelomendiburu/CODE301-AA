'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AvatarImage from '@/components/AvatarImage';

interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  description: string;
  metadata?: {
    fileName?: string;
    fileType?: string;
    fileSize?: number;
    fileUrl?: string;
    documentUrl?: string;
    observationId?: string;
    responseId?: string;
    metricId?: string;
    ipAddress?: string;
    userAgent?: string;
  };
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
}

export default function AdminActivityPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('7days');

  // Cargar configuraciones guardadas
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('isDarkMode');
    const savedSidebarCollapsed = localStorage.getItem('adminSidebarCollapsed');
    
    if (savedDarkMode !== null) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }
    if (savedSidebarCollapsed !== null) {
      setSidebarCollapsed(JSON.parse(savedSidebarCollapsed));
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('isDarkMode', JSON.stringify(newDarkMode));
  };

  // Toggle sidebar collapsed state
  const toggleSidebarCollapsed = () => {
    const newSidebarCollapsed = !sidebarCollapsed;
    setSidebarCollapsed(newSidebarCollapsed);
    localStorage.setItem('adminSidebarCollapsed', JSON.stringify(newSidebarCollapsed));
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Cargar actividades
  const loadActivities = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('action', filter);
      if (dateRange !== 'all') params.append('dateRange', dateRange);
      
      const response = await fetch(`/api/admin/activity?${params}`);
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      } else {
        console.error('Failed to load activities:', response.status);
        setActivities([]);
      }
    } catch (error) {
      console.error('Error loading activities:', error);
      setActivities([]);
    } finally {
      setIsLoading(false);
    }
  }, [filter, dateRange]);

  // Manejar clic en documento
  const handleDocumentClick = (fileUrl: string, fileName: string) => {
    if (fileUrl) {
      // Abrir documento en nueva ventana
      window.open(fileUrl, '_blank');
    } else {
      alert(`Documento "${fileName}" no disponible`);
    }
  };

  // Manejar clic en observación
  const handleObservationClick = (observationId: string) => {
    // Redirigir a la página de observaciones con filtro específico
    router.push(`/admin/observations?observationId=${observationId}`);
  };

  // Manejar clic en métrica
  const handleMetricClick = (userId: string) => {
    // Redirigir a la vista de métricas del usuario
    router.push(`/admin/miproyecto?userId=${userId}`);
  };

  useEffect(() => {
    if (session?.user?.email === 'angelomendiburu@gmail.com') {
      loadActivities();
    }
  }, [session, filter, dateRange, loadActivities]);

  // Función para obtener el icono según la acción
  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'login':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
        );
      case 'logout':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        );
      case 'upload_metric':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'upload_document':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'upload_image':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'create_observation':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        );
      case 'respond_observation':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  // Función para obtener el color según la acción
  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'login':
        return 'text-green-600';
      case 'logout':
        return 'text-red-600';
      case 'upload_metric':
      case 'upload_document':
      case 'upload_image':
        return 'text-blue-600';
      case 'create_observation':
      case 'respond_observation':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  // Función para formatear el nombre de la acción
  const formatActionName = (action: string) => {
    const actionNames: { [key: string]: string } = {
      'login': 'Inicio de Sesión',
      'logout': 'Cierre de Sesión',
      'upload_metric': 'Subir Métrica',
      'upload_document': 'Subir Documento',
      'upload_image': 'Subir Imagen',
      'create_observation': 'Crear Observación',
      'respond_observation': 'Responder Observación',
    };
    return actionNames[action.toLowerCase()] || action;
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
          : 'bg-white border-l-4 border-l-purple-600 shadow-lg'
      }`}>
          {/* Header con degradado */}
          <div className={`${isDarkMode ? 'bg-gradient-to-r from-[#D000FF] via-[#FF007B] via-[#FF2D55] via-[#FF6A00] to-[#FF8C00]' : 'bg-gradient-to-r from-[#D000FF]/10 via-[#FF007B]/10 via-[#FF2D55]/10 via-[#FF6A00]/10 to-[#FF8C00]/10 border border-[#D000FF]/20 shadow-md'} p-4 rounded-xl mb-8 ${sidebarCollapsed ? 'hidden' : 'block'}`}>
            {/* Logo y título */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`h-10 w-10 rounded-full overflow-hidden flex items-center justify-center shadow-lg ${
                isDarkMode 
                  ? 'bg-black ring-2 ring-white/20' 
                  : 'bg-white ring-2 ring-black/20'
              }`}>
                <Image 
                  src="/logos/logo.png" 
                  alt="Start UPC Logo" 
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Start UPC</h1>
                <p className={`text-xs ${isDarkMode ? 'text-white/70' : 'text-gray-600'}`}>Admin Panel</p>
              </div>
            </div>
            
            {/* Toggle de modo oscuro */}
            <button
              onClick={toggleDarkMode}
              className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-white/10 hover:bg-white/20 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {isDarkMode ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                  </svg>
                  Modo Claro
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  Modo Noche
                </>
              )}
            </button>
          </div>

          {/* Modo colapsado - Solo logo */}
          {sidebarCollapsed && (
            <div className="flex flex-col items-center mb-8 space-y-4">
              <div className={`h-10 w-10 rounded-full overflow-hidden flex items-center justify-center shadow-lg ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-[#D000FF] to-[#FF8C00]' 
                  : 'bg-white ring-2 ring-black/20'
              }`}>
                <Image 
                  src="/logos/logo.png" 
                  alt="Start UPC Logo" 
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              
              {/* Toggle de modo oscuro compacto */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors hover:scale-105 ${
                  isDarkMode 
                    ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
                title={isDarkMode ? 'Modo Claro' : 'Modo Noche'}
              >
                {isDarkMode ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>
          )}

          {/* Menú de navegación */}
          <nav className="space-y-2">
            <a
              href="/admin/metrics"
              className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-lg transition-colors text-sm lg:text-base group ${
                isDarkMode 
                  ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                  : 'text-gray-600 hover:bg-gradient-to-r hover:from-[#D000FF]/5 hover:to-[#FF8C00]/5 hover:text-[#D000FF] hover:border-l-2 hover:border-l-[#FF007B]'
              }`}
              title={sidebarCollapsed ? 'Dashboard' : ''}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v4H8V5z" />
              </svg>
              {!sidebarCollapsed && <span>Dashboard</span>}
            </a>
            
            <a
              href="/admin/users"
              className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-lg transition-colors text-sm lg:text-base group ${
                isDarkMode 
                  ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                  : 'text-gray-600 hover:bg-gradient-to-r hover:from-[#FF007B]/5 hover:to-[#FF2D55]/5 hover:text-[#FF007B] hover:border-l-2 hover:border-l-[#FF2D55]'
              }`}
              title={sidebarCollapsed ? 'Usuarios' : ''}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              {!sidebarCollapsed && <span>Usuarios</span>}
            </a>

            <a
              href="/admin/metrics"
              className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-lg transition-colors text-sm lg:text-base group ${
                isDarkMode 
                  ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                  : 'text-gray-600 hover:bg-gradient-to-r hover:from-[#FF2D55]/5 hover:to-[#FF6A00]/5 hover:text-[#FF2D55] hover:border-l-2 hover:border-l-[#FF6A00]'
              }`}
              title={sidebarCollapsed ? 'Métricas' : ''}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {!sidebarCollapsed && <span>Métricas</span>}
            </a>

            <a
              href="/admin/observations"
              className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-lg transition-colors text-sm lg:text-base group ${
                isDarkMode 
                  ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                  : 'text-gray-600 hover:bg-gradient-to-r hover:from-[#FF6A00]/5 hover:to-[#FF8C00]/5 hover:text-[#FF6A00] hover:border-l-2 hover:border-l-[#FF8C00]'
              }`}
              title={sidebarCollapsed ? 'Observaciones' : ''}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {!sidebarCollapsed && <span>Observaciones</span>}
            </a>

            <a
              href="/admin/activity"
              className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-lg font-medium text-sm lg:text-base group ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-[#D000FF]/20 to-[#FF8C00]/20 text-white border border-white/10' 
                  : 'bg-gradient-to-r from-[#D000FF]/10 to-[#FF8C00]/10 text-[#D000FF] border border-[#D000FF]/20 shadow-md'
              }`}
              title={sidebarCollapsed ? 'Actividad' : ''}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {!sidebarCollapsed && <span>Actividad</span>}
            </a>

            <a
              href="/admin/metrics-documents"
              className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-lg transition-colors text-sm lg:text-base group ${
                isDarkMode 
                  ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                  : 'text-gray-600 hover:bg-gradient-to-r hover:from-[#FF8C00]/5 hover:to-[#FFB800]/5 hover:text-[#FF8C00] hover:border-l-2 hover:border-l-[#FFB800]'
              }`}
              title={sidebarCollapsed ? 'Documentos' : ''}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {!sidebarCollapsed && <span>Documentos</span>}
            </a>

            <a
              href="#"
              className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-lg transition-colors text-sm lg:text-base group ${
                isDarkMode 
                  ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              title={sidebarCollapsed ? 'Configuración' : ''}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {!sidebarCollapsed && <span>Configuración</span>}
            </a>
          </nav>
          
          {/* Botón de colapsar discreto en la parte inferior */}
          <div className={`${sidebarCollapsed ? 'flex justify-center pt-4' : 'flex justify-end pt-4'}`}>
            <button
              onClick={toggleSidebarCollapsed}
              className={`p-2 rounded-lg transition-colors hover:scale-105 ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              title={sidebarCollapsed ? 'Expandir menú' : 'Colapsar menú'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                {sidebarCollapsed ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7M19 19l-7-7 7-7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-6">
            {/* Header */}
            <div className={`flex justify-between items-center mb-6 rounded-lg p-4 shadow-sm ${
              isDarkMode 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-white border-l-4 border-l-purple-600 shadow-lg'
            }`}>
              <div>
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Registro de Actividad</h1>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Monitoreo de todas las acciones de los usuarios</p>
              </div>
              
              {/* Información del usuario y botón de cerrar sesión */}
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
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-[#141414]'}`}>
                        {session.user?.name || 'Usuario'}
                      </p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-neutral-500'}`}>
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

            {/* Filtros */}
            <div className={`mb-6 p-4 rounded-lg shadow-sm ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="flex flex-wrap gap-4 items-center">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className={`px-3 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="all">Todas las acciones</option>
                  <option value="login">Inicios de sesión</option>
                  <option value="logout">Cierres de sesión</option>
                  <option value="upload_metric">Subidas de métricas</option>
                  <option value="upload_document">Subidas de documentos</option>
                  <option value="upload_image">Subidas de imágenes</option>
                  <option value="create_observation">Observaciones creadas</option>
                  <option value="respond_observation">Respuestas a observaciones</option>
                </select>

                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className={`px-3 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="all">Todo el tiempo</option>
                  <option value="1day">Último día</option>
                  <option value="7days">Últimos 7 días</option>
                  <option value="30days">Últimos 30 días</option>
                  <option value="90days">Últimos 90 días</option>
                </select>

                <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Total: {activities.length} actividades
                </div>
              </div>
            </div>

            {/* Lista de actividades */}
            <div className="space-y-4">
              {isLoading ? (
                <div className={`text-center py-12 rounded-lg ${
                  isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'
                }`}>
                  Cargando actividades...
                </div>
              ) : activities.length === 0 ? (
                <div className={`text-center py-12 rounded-lg ${
                  isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'
                }`}>
                  No hay actividades registradas.
                </div>
              ) : (
                activities.map((activity) => (
                  <div key={activity.id} className={`p-4 rounded-lg shadow-sm ${
                    isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
                  }`}>
                    <div className="flex items-start gap-4">
                      {/* Icono de acción */}
                      <div className={`p-2 rounded-full ${getActionColor(activity.action)} bg-opacity-10`}>
                        <div className={getActionColor(activity.action)}>
                          {getActionIcon(activity.action)}
                        </div>
                      </div>

                      {/* Contenido */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex flex-col">
                            <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {activity.user.name || 'Usuario'}
                            </span>
                            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {activity.user.email}
                            </span>
                          </div>
                          <span className={`text-sm px-2 py-1 rounded-full ${
                            isDarkMode 
                              ? 'bg-gray-700 text-gray-300' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {formatActionName(activity.action)}
                          </span>
                        </div>
                        
                        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                          {activity.description}
                        </p>

                        {/* Metadata adicional */}
                        {activity.metadata && (
                          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} space-y-1`}>
                            {/* Información de archivo/documento */}
                            {activity.metadata.fileName && (
                              <div className="flex items-center gap-2">
                                <span>Archivo:</span>
                                {activity.metadata.fileUrl || activity.metadata.documentUrl ? (
                                  <button
                                    onClick={() => handleDocumentClick(
                                      activity.metadata?.fileUrl || activity.metadata?.documentUrl || '',
                                      activity.metadata?.fileName || ''
                                    )}
                                    className={`font-medium underline hover:no-underline transition-colors ${
                                      isDarkMode 
                                        ? 'text-blue-400 hover:text-blue-300' 
                                        : 'text-blue-600 hover:text-blue-800'
                                    }`}
                                  >
                                    📄 {activity.metadata.fileName}
                                  </button>
                                ) : (
                                  <span>{activity.metadata.fileName}</span>
                                )}
                              </div>
                            )}
                            {activity.metadata.fileType && (
                              <div>Tipo: {activity.metadata.fileType}</div>
                            )}
                            {activity.metadata.fileSize && (
                              <div>Tamaño: {(activity.metadata.fileSize / 1024 / 1024).toFixed(2)} MB</div>
                            )}
                            
                            {/* Enlaces a observaciones */}
                            {activity.metadata.observationId && (
                              <div className="flex items-center gap-2">
                                <span>Observación:</span>
                                <button
                                  onClick={() => handleObservationClick(activity.metadata?.observationId || '')}
                                  className={`font-medium underline hover:no-underline transition-colors flex items-center gap-1 ${
                                    isDarkMode 
                                      ? 'text-green-400 hover:text-green-300' 
                                      : 'text-green-600 hover:text-green-800'
                                  }`}
                                >
                                  👁️ Ver observación
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                </button>
                              </div>
                            )}
                            
                            {/* Enlaces a métricas */}
                            {activity.metadata.metricId && (
                              <div className="flex items-center gap-2">
                                <span>Métrica:</span>
                                <button
                                  onClick={() => handleMetricClick(activity.userId)}
                                  className={`font-medium underline hover:no-underline transition-colors flex items-center gap-1 ${
                                    isDarkMode 
                                      ? 'text-purple-400 hover:text-purple-300' 
                                      : 'text-purple-600 hover:text-purple-800'
                                  }`}
                                >
                                  📊 Ver métricas del usuario
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        <div className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {new Date(activity.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
