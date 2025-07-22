'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import AvatarImage from '../../../components/AvatarImage';

interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  status: 'active' | 'blocked';
  createdAt: string;
  _count?: {
    observations: number;
  };
}

export default function AdminUsers() {
  const { data: session } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
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
      fetchUsers();
    }
  }, [session, router]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string) => {
    setActionLoading(userId);
    try {
      const response = await fetch(`/api/admin/users/${userId}/toggle-status`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) return;
    
    setActionLoading(userId);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setActionLoading(null);
    }
  };

  if (!session || session.user?.email !== 'angelomendiburu@gmail.com') {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      {/* Header simplificado con usuario */}
      <div className={`flex justify-between items-center mb-6 rounded-lg p-4 shadow-sm ${
        isDarkMode 
          ? 'bg-gray-800 border border-gray-700' 
          : 'bg-white border-l-4 border-l-blue-600 shadow-lg'
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
              className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-lg transition-colors group ${
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
              className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-lg font-medium text-sm lg:text-base group ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-[#D000FF]/20 to-[#FF8C00]/20 text-white border border-white/10' 
                  : 'bg-gradient-to-r from-[#D000FF]/10 to-[#FF8C00]/10 text-[#D000FF] border border-[#D000FF]/20 shadow-md'
              }`}
              title={sidebarCollapsed ? 'Usuarios' : ''}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              {!sidebarCollapsed && <span>Usuarios</span>}
            </a>

            <a
              href="/admin/registrations"
              className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-lg transition-colors group ${
                isDarkMode 
                  ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                  : 'text-gray-600 hover:bg-gradient-to-r hover:from-[#D000FF]/5 hover:to-[#FF007B]/5 hover:text-[#D000FF] hover:border-l-2 hover:border-l-[#FF007B]'
              }`}
              title={sidebarCollapsed ? 'Registros' : ''}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              {!sidebarCollapsed && <span>Registros</span>}
            </a>

            <a
              href="/admin/metrics"
              className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-lg transition-colors group ${
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
              className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-lg transition-colors group ${
                isDarkMode 
                  ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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
              className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-lg transition-colors group ${
                isDarkMode 
                  ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                  : 'text-gray-600 hover:bg-gradient-to-r hover:from-[#FF6A00]/5 hover:to-[#FF8C00]/5 hover:text-[#FF6A00] hover:border-l-2 hover:border-l-[#FF8C00]'
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
              className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-lg transition-colors group ${
                isDarkMode 
                  ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                  : 'text-gray-600 hover:bg-gradient-to-r hover:from-[#FF6A00]/5 hover:to-[#FF8C00]/5 hover:text-[#FF6A00] hover:border-l-2 hover:border-l-[#FF8C00]'
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
              className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-lg transition-colors group ${
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
            {/* Header simplificado con usuario */}
            <div className={`flex justify-between items-center mb-6 rounded-lg p-4 shadow-sm ${
              isDarkMode 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-white border-l-4 border-l-blue-600 shadow-lg'
            }`}>
              <div>
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Gestión de Usuarios</h1>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Panel de administración de usuarios del sistema</p>
              </div>
              
              {/* Información del usuario y botón de cerrar sesión */}
              {session && (
                <div className="flex items-center gap-4">
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
                    onClick={() => signOut()}
                    className={`ml-2 px-4 py-2 text-sm rounded-lg transition-colors font-medium ${
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
              {/* Base gradient layer - subtle colors */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-700 via-gray-700 via-slate-600 to-gray-600 soft-pulse"></div>
              
              {/* Animated color layer - very subtle */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-indigo-500/15 via-purple-600/20 to-slate-700/25 subtle-animated-header"></div>
              
              {/* Floating overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent gentle-overlay"></div>
              
              <div className="relative p-6 z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-white drop-shadow-lg">Panel de Usuarios</h2>
                    <p className="text-gray-200 mt-1 drop-shadow-md">Gestiona y supervisa todos los usuarios del sistema</p>
                  </div>
                  <div className="text-gray-200 drop-shadow-md">
                    Total: {users.length} usuarios
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Cargando usuarios...
                </div>
              </div>
            ) : (
              <div className={`rounded-lg shadow-xl overflow-hidden ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                      <tr>
                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-500'
                        }`}>
                          Usuario
                        </th>
                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-500'
                        }`}>
                          Email
                        </th>
                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-500'
                        }`}>
                          Rol
                        </th>
                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-500'
                        }`}>
                          Estado
                        </th>
                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-500'
                        }`}>
                          Observaciones
                        </th>
                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-500'
                        }`}>
                          Fecha de Registro
                        </th>
                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-500'
                        }`}>
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${
                      isDarkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'
                    }`}>
                      {users.map((user) => (
                        <tr key={user.id} className={`transition-colors duration-200 ${
                          isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                        }`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <AvatarImage
                                  src={user.image}
                                  alt={user.name}
                                  size={40}
                                  fallback={user.name.charAt(0).toUpperCase()}
                                />
                              </div>
                              <div className="ml-4">
                                <div className={`text-sm font-medium ${
                                  isDarkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {user.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm ${
                              isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              {user.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-[#FF6A00] to-[#FF8C00] text-white">
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {user.status === 'active' ? 'Activo' : 'Bloqueado'}
                            </span>
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {user._count?.observations || 0}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => toggleUserStatus(user.id)}
                                disabled={actionLoading === user.id}
                                className={`px-3 py-1 rounded text-xs font-medium transition-colors duration-200 ${
                                  user.status === 'active'
                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                    : 'bg-green-600 hover:bg-green-700 text-white'
                                } disabled:opacity-50`}
                              >
                                {actionLoading === user.id ? 'Procesando...' : (
                                  user.status === 'active' ? 'Bloquear' : 'Activar'
                                )}
                              </button>
                              <button
                                onClick={() => deleteUser(user.id)}
                                disabled={actionLoading === user.id}
                                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium transition-colors duration-200 disabled:opacity-50"
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {users.length === 0 && (
                  <div className="text-center py-12">
                    <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      No se encontraron usuarios.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
