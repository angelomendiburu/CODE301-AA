'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import AvatarImage from '../../../components/AvatarImage';

interface Document {
  id: string;
  fileName: string;
  originalName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
  metricId: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
  metric: {
    id: string;
    type: string;
    amount: number;
  };
}

interface UserMetrics {
  id: string;
  name: string;
  email: string;
  image: string | null;
  documents: Document[];
  _count: {
    metrics: number;
  };
}

export default function AdminMetricsDocuments() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const [usersWithDocuments, setUsersWithDocuments] = useState<UserMetrics[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Load dark mode preference from localStorage on mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('adminDarkMode');
    if (savedDarkMode !== null) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }
    
    // Load sidebar collapsed state from localStorage
    const savedSidebarCollapsed = localStorage.getItem('adminSidebarCollapsed');
    if (savedSidebarCollapsed !== null) {
      setSidebarCollapsed(JSON.parse(savedSidebarCollapsed));
    }
  }, []);

  // Save dark mode preference to localStorage when it changes
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('adminDarkMode', JSON.stringify(newDarkMode));
  };

  // Toggle sidebar collapsed state and save to localStorage
  const toggleSidebarCollapsed = () => {
    const newSidebarCollapsed = !sidebarCollapsed;
    setSidebarCollapsed(newSidebarCollapsed);
    localStorage.setItem('adminSidebarCollapsed', JSON.stringify(newSidebarCollapsed));
  };

  useEffect(() => {
    if (session && session.user?.email !== 'angelomendiburu@gmail.com') {
      router.push('/');
      return;
    }
    if (session && session.user?.email === 'angelomendiburu@gmail.com') {
      fetchUsersWithDocuments();
    }
  }, [session, router]);

  // Auto-seleccionar usuario si viene de la URL
  useEffect(() => {
    if (userId && usersWithDocuments.length > 0) {
      const userToSelect = usersWithDocuments.find(user => user.id === userId);
      if (userToSelect) {
        setSelectedUser(userToSelect);
      }
    }
  }, [userId, usersWithDocuments]);

  const fetchUsersWithDocuments = async () => {
    try {
      const response = await fetch('/api/admin/metrics-documents');
      if (response.ok) {
        const data = await response.json();
        console.log('Documents data received:', data); // Debug log
        setUsersWithDocuments(data.users || data);
      } else {
        console.error('Error response:', response.status, await response.text());
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number | null | undefined) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isImage = (fileType: string) => {
    return fileType.startsWith('image/');
  };

  const getFileIcon = (fileType: string) => {
    if (isImage(fileType)) {
      return (
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    }
    
    if (fileType.includes('pdf')) {
      return (
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    }
    
    return (
      <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  };

  if (!session || session.user?.email !== 'angelomendiburu@gmail.com') {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  return (
    <div className={`flex h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-slate-50'} relative`}>
      {/* Overlay para cerrar sidebar en móvil */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Panel lateral izquierdo */}
      <div className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } fixed lg:relative z-30 lg:z-auto ${sidebarCollapsed ? 'w-16' : 'w-64'} h-full shadow-lg transition-all duration-300 ease-in-out ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className={`${sidebarCollapsed ? 'p-2' : 'p-6'} transition-all duration-300`}>
          {/* Botón de cerrar sidebar en móvil */}
          <div className="flex justify-between items-center mb-6 lg:hidden">
            <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Menú
            </h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className={`p-2 rounded-lg ${
                isDarkMode 
                  ? 'text-gray-300 hover:bg-gray-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

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
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
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
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v4H8V5z" />
              </svg>
              {!sidebarCollapsed && <span className="truncate">Dashboard</span>}
              {sidebarCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50">
                  Dashboard
                </div>
              )}
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
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              {!sidebarCollapsed && <span className="truncate">Usuarios</span>}
              {sidebarCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50">
                  Usuarios
                </div>
              )}
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
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {!sidebarCollapsed && <span className="truncate">Métricas</span>}
              {sidebarCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50">
                  Métricas
                </div>
              )}
            </a>

            <a
              href="/admin/observations"
              className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-lg transition-colors text-sm lg:text-base group ${
                isDarkMode 
                  ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              title={sidebarCollapsed ? 'Observaciones' : ''}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {!sidebarCollapsed && <span className="truncate">Observaciones</span>}
              {sidebarCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50">
                  Observaciones
                </div>
              )}
            </a>

            <a
              href="/admin/activity"
              className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-lg transition-colors text-sm lg:text-base group ${
                isDarkMode 
                  ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                  : 'text-gray-600 hover:bg-gradient-to-r hover:from-[#FF6A00]/5 hover:to-[#FF8C00]/5 hover:text-[#FF6A00] hover:border-l-2 hover:border-l-[#FF8C00]'
              }`}
              title={sidebarCollapsed ? 'Actividad' : ''}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {!sidebarCollapsed && <span className="truncate">Actividad</span>}
              {sidebarCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50">
                  Actividad
                </div>
              )}
            </a>

            <a
              href="/admin/metrics-documents"
              className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-lg font-medium text-sm lg:text-base group ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-[#D000FF]/20 to-[#FF8C00]/20 text-white border border-white/10' 
                  : 'bg-gradient-to-r from-[#D000FF]/10 to-[#FF8C00]/10 text-[#D000FF] border border-[#D000FF]/20 shadow-md'
              }`}
              title={sidebarCollapsed ? 'Documentos' : ''}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {!sidebarCollapsed && <span className="truncate">Documentos</span>}
              {sidebarCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50">
                  Documentos
                </div>
              )}
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
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {!sidebarCollapsed && <span className="truncate">Configuración</span>}
              {sidebarCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50">
                  Configuración
                </div>
              )}
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
      <div className={`flex-1 lg:ml-0 ${sidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300 ease-in-out overflow-auto ${isDarkMode ? 'bg-gray-900' : 'bg-slate-50'}`}>
        {/* Header móvil con botón de menú */}
        <div className={`lg:hidden sticky top-0 z-10 flex items-center justify-between p-4 shadow-sm ${
          isDarkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-white border-b border-gray-200'
        }`}>
          <button
            onClick={() => setSidebarOpen(true)}
            className={`p-2 rounded-lg ${
              isDarkMode 
                ? 'text-gray-300 hover:bg-gray-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Documentos
          </h1>
          <div className="w-10"></div> {/* Spacer para centrar el título */}
        </div>

        <div className="p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
          {/* Header simplificado con usuario */}
          <div className={`flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 rounded-lg p-4 shadow-sm space-y-4 lg:space-y-0 ${
            isDarkMode 
              ? 'bg-gray-800 border border-gray-700' 
              : 'bg-white border-l-4 border-l-amber-500 shadow-lg bg-gradient-to-r from-amber-50/30 to-orange-50/30'
          }`}>
            <div>
              <h1 className={`text-xl lg:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {userId && selectedUser ? `Documentos de ${selectedUser.name}` : 'Gestión de Documentos'}
              </h1>
              <p className={`text-sm lg:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {userId && selectedUser 
                  ? `Visualiza todos los documentos subidos por ${selectedUser.name}`
                  : 'Panel de administración de documentos del sistema'
                }
              </p>
            </div>
            
            {/* Información del usuario y botón de cerrar sesión */}
            {session && (
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                <div className="flex items-center gap-3">
                  <AvatarImage
                    src={session.user?.image}
                    alt={session.user?.name || 'Usuario'}
                    size={32}
                  />
                  <div className="text-sm">
                    <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {session.user?.name}
                    </div>
                    <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {session.user?.email}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => router.push('/')}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors font-medium ${
                    isDarkMode 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>

          {/* Header Gradient */}
          <div className="relative overflow-hidden rounded-lg shadow-lg mb-6">
            {/* Base gradient layer */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-700 via-gray-700 via-slate-600 to-gray-600 soft-pulse"></div>
            
            {/* Animated color layer */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 via-orange-500/15 via-rose-600/20 to-slate-700/25 subtle-animated-header"></div>
            
            {/* Floating overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent gentle-overlay"></div>
            
            <div className="relative p-4 lg:p-6 z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-2 lg:space-y-0">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-white drop-shadow-lg">Panel de Documentos</h2>
                  <p className="text-gray-200 mt-1 drop-shadow-md text-sm lg:text-base">Gestiona y supervisa todos los documentos del sistema</p>
                </div>
                <div className="text-gray-200 drop-shadow-md text-sm lg:text-base">
                  Total: {usersWithDocuments.reduce((acc, user) => acc + user.documents.length, 0)} documentos
                </div>
              </div>
            </div>
          </div>

          {/* Controles de vista - Solo mostrar cuando hay un usuario seleccionado */}
          {selectedUser && (
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                    viewMode === 'grid' 
                      ? isDarkMode 
                        ? 'bg-gradient-to-r from-[#D000FF] to-[#FF8C00] text-white' 
                        : 'bg-blue-500 text-white'
                      : isDarkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span className="hidden sm:inline">Grid</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                    viewMode === 'list' 
                      ? isDarkMode 
                        ? 'bg-gradient-to-r from-[#D000FF] to-[#FF8C00] text-white' 
                        : 'bg-blue-500 text-white'
                      : isDarkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  <span className="hidden sm:inline">Lista</span>
                </button>
              </div>
            </div>
          )}

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Cargando documentos...
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Debug info */}
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'}`}>
                <h3 className="font-bold mb-2 text-sm lg:text-base">Debug Info:</h3>
                <div className="space-y-1 text-xs lg:text-sm">
                  <p>Usuarios encontrados: {usersWithDocuments.length}</p>
                  <p>Total de documentos: {usersWithDocuments.reduce((acc, user) => acc + user.documents.length, 0)}</p>
                  {usersWithDocuments.length === 0 && (
                    <p className="text-red-500 mt-2 text-xs lg:text-sm">
                      No se encontraron usuarios con documentos. Verifica que haya métricas con imageUrl o documentUrl en la base de datos.
                    </p>
                  )}
                </div>
              </div>
              
              {usersWithDocuments.map((user) => (
                <div key={user.id} className={`rounded-xl p-4 lg:p-6 shadow-lg ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                  {/* Usuario header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <AvatarImage
                        src={user.image}
                        alt={user.name}
                        size={48}
                        fallback={user.name.charAt(0)}
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className={`text-lg lg:text-xl font-bold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {user.name}
                        </h3>
                        <p className={`text-sm truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {user.email} • {user.documents.length} documentos
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedUser(selectedUser?.id === user.id ? null : user)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                        isDarkMode 
                          ? 'bg-gradient-to-r from-[#FF007B] to-[#FF6A00] text-white hover:from-[#FF007B]/80 hover:to-[#FF6A00]/80' 
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {(selectedUser?.id === user.id || (userId && user.id === userId)) ? 'Ocultar' : 'Ver documentos'}
                    </button>
                  </div>

                  {/* Documentos del usuario */}
                  {(selectedUser?.id === user.id || (userId && user.id === userId)) && (
                    <div className={`mt-4 ${
                      viewMode === 'grid' 
                        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6' 
                        : 'space-y-4'
                    }`}>
                      {user.documents.map((doc) => (
                        <div 
                          key={doc.id} 
                          className={`border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 ${
                            viewMode === 'list' ? 'flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-4' : 'flex flex-col bg-card'
                          } ${
                            isDarkMode 
                              ? 'border-gray-600 bg-gray-700 hover:bg-gray-600' 
                              : 'border-[#FF8C00]/20 bg-white hover:bg-gradient-to-br hover:from-white hover:to-[#FF8C00]/5 hover:border-[#FF8C00]/30 hover:shadow-xl'
                          }`}
                        >
                          {/* Vista previa del documento */}
                          {viewMode === 'grid' && (
                            <div className={`aspect-video relative overflow-hidden ${
                              isDarkMode ? 'bg-gray-600' : 'bg-gradient-to-br from-[#D000FF]/5 to-[#FF8C00]/5'
                            }`}>
                              {isImage(doc.fileType) ? (
                                <Image 
                                  src={doc.fileName}
                                  alt={doc.originalName}
                                  width={400}
                                  height={225}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    const fallbackElement = e.currentTarget.parentElement?.querySelector('.fallback-icon') as HTMLElement;
                                    if (fallbackElement) {
                                      fallbackElement.style.display = 'flex';
                                    }
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  {getFileIcon(doc.fileType)}
                                </div>
                              )}
                              <div className={`fallback-icon hidden w-full h-full flex items-center justify-center ${
                                isDarkMode ? 'bg-gray-600' : 'bg-gray-100'
                              }`}>
                                {getFileIcon(doc.fileType)}
                              </div>
                              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                                <a
                                  href={doc.fileName}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`opacity-0 hover:opacity-100 px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 shadow-lg ${
                                    isDarkMode 
                                      ? 'bg-gray-800 text-white hover:bg-gradient-to-r hover:from-[#D000FF] hover:to-[#FF8C00]' 
                                      : 'bg-white text-gray-900 hover:bg-gradient-to-r hover:from-[#D000FF] hover:to-[#FF8C00] hover:text-white border border-gray-200'
                                  }`}
                                >
                                  Ver
                                </a>
                              </div>
                            </div>
                          )}
                          
                          <div className={`flex-shrink-0 ${viewMode === 'list' ? '' : 'p-4 flex-1 flex flex-col'}`}>
                            {viewMode === 'list' && (
                              <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${
                                isDarkMode ? 'bg-gray-600' : 'bg-gray-100'
                              }`}>
                                {getFileIcon(doc.fileType)}
                              </div>
                            )}
                          </div>
                          
                          <div className={`${viewMode === 'list' ? 'flex-1 min-w-0' : 'p-4 flex-1 flex flex-col'}`}>
                            <h4 className={`font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{doc.originalName}</h4>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{formatFileSize(doc.fileSize) || 'Tamaño desconocido'}</p>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              {new Date(doc.uploadedAt).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                            
                            {/* Spacer para empujar el badge y botón hacia abajo en vista grid */}
                            {viewMode === 'grid' && <div className="flex-1"></div>}
                            
                            <div className={`${viewMode === 'grid' ? 'mt-auto space-y-2' : 'mt-2'}`}>
                              <div>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  isDarkMode 
                                    ? 'bg-gradient-to-r from-[#FF007B]/20 to-[#FF6A00]/20 text-[#FF007B]' 
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {doc.metric.type} - ${doc.metric.amount.toLocaleString()}
                                </span>
                              </div>
                              
                              {viewMode === 'grid' && (
                                <a
                                  href={doc.fileName}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`block w-full text-center px-3 py-2 rounded text-sm font-medium transition-colors ${
                                    isDarkMode 
                                      ? 'bg-gradient-to-r from-[#FF2D55]/20 to-[#FF8C00]/20 text-[#FF2D55] hover:from-[#FF2D55]/30 hover:to-[#FF8C00]/30' 
                                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                  }`}
                                >
                                  Ver documento
                                </a>
                              )}
                            </div>
                          </div>
                          
                          {viewMode === 'list' && (
                            <div className="flex-shrink-0">
                              <a
                                href={doc.fileName}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                  isDarkMode 
                                    ? 'bg-gradient-to-r from-[#FF007B]/20 to-[#FF6A00]/20 text-[#FF007B] hover:from-[#FF007B]/30 hover:to-[#FF6A00]/30' 
                                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                }`}
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                Ver
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
