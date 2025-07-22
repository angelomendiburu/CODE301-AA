'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AvatarImage from '@/components/AvatarImage';
import { logActivity, ActivityTypes } from '@/utils/activityLogger';

interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  createdAt: string;
  _count: {
    metrics: number;
  };
}

interface Observation {
  id: string;
  content: string;
  response?: string | null;
  createdAt: string;
  updatedAt: string;
  targetUser: User | null;
  author: User;
  responses: {
    id: string;
    content: string;
    createdAt: string;
    author: {
      id: string;
      name: string;
      email: string;
      image: string | null;
    };
  }[];
}

export default function AdminObservationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [newObservation, setNewObservation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingObservation, setEditingObservation] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

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

  // Cargar usuarios
  const loadUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        // The API returns { users: [...] }
        const users = data.users || [];
        if (Array.isArray(users)) {
          setUsers(users);
        } else {
          console.error('Users API did not return an array:', users);
          setUsers([]);
        }
      } else {
        console.error('Failed to load users:', response.status);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    }
  };

  // Cargar observaciones
  const loadObservations = async (userId?: string) => {
    try {
      const url = userId ? `/api/observations?targetUserId=${userId}` : '/api/observations';
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setObservations(data);
      }
    } catch (error) {
      console.error('Error loading observations:', error);
    }
  };

  useEffect(() => {
    if (session?.user?.email === 'angelomendiburu@gmail.com') {
      loadUsers();
      loadObservations();
    }
  }, [session]);

  // Crear nueva observación
  const handleCreateObservation = async () => {
    if (!newObservation.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/observations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newObservation.trim(),
          targetUserId: selectedUser?.id || null,
        }),
      });

      if (response.ok) {
        const observation = await response.json();
        setObservations([observation, ...observations]);
        setNewObservation('');
        
        // Log activity
        await logActivity(
          ActivityTypes.CREATE_OBSERVATION,
          `Creó una nueva observación${selectedUser ? ` para ${selectedUser.name || selectedUser.email}` : ''}`,
          { 
            targetUserId: selectedUser?.id || null,
            targetUserName: selectedUser?.name || selectedUser?.email || null,
            observationId: observation.id
          }
        );
      } else {
        const error = await response.json();
        alert(error.error || 'Error al crear la observación');
      }
    } catch (error) {
      console.error('Error creating observation:', error);
      alert('Error al crear la observación');
    } finally {
      setIsLoading(false);
    }
  };

  // Editar observación
  const handleEditObservation = async (observationId: string) => {
    if (!editText.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/observations/${observationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editText.trim(),
        }),
      });

      if (response.ok) {
        const updatedObservation = await response.json();
        setObservations(observations.map(obs => 
          obs.id === observationId ? updatedObservation : obs
        ));
        setEditingObservation(null);
        setEditText('');
      } else {
        const error = await response.json();
        alert(error.error || 'Error al actualizar la observación');
      }
    } catch (error) {
      console.error('Error updating observation:', error);
      alert('Error al actualizar la observación');
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar observación
  const handleDeleteObservation = async (observationId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta observación?')) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/observations/${observationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setObservations(observations.filter(obs => obs.id !== observationId));
      } else {
        const error = await response.json();
        alert(error.error || 'Error al eliminar la observación');
      }
    } catch (error) {
      console.error('Error deleting observation:', error);
      alert('Error al eliminar la observación');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  if (!session || session.user?.email !== 'angelomendiburu@gmail.com') {
    return <div className="flex items-center justify-center min-h-screen">Acceso denegado</div>;
  }

  return (
    <div className={`flex h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-slate-50'}`}>
      {/* Panel lateral izquierdo */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} shadow-lg transition-all duration-300 ease-in-out ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className={`${sidebarCollapsed ? 'p-2' : 'p-6'} transition-all duration-300`}>
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
              className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-lg font-medium text-sm lg:text-base group ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-[#D000FF]/20 to-[#FF8C00]/20 text-white border border-white/10' 
                  : 'bg-gradient-to-r from-[#D000FF]/10 to-[#FF8C00]/10 text-[#D000FF] border border-[#D000FF]/20 shadow-md'
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
              className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-lg transition-colors text-sm lg:text-base group ${
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
              className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-lg transition-colors text-sm lg:text-base group ${
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
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Observaciones</h1>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Gestión de observaciones y respuestas de usuarios</p>
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
              <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Seleccionar Usuario
              </h3>
              <div className="flex flex-wrap gap-4 items-center">
                {/* Selector mejorado con fotos de perfil */}
                <div className={`relative min-w-64 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <select
                    value={selectedUser?.id || ''}
                    onChange={(e) => {
                      const userId = e.target.value;
                      const user = Array.isArray(users) ? users.find(u => u.id === userId) || null : null;
                      setSelectedUser(user);
                      loadObservations(userId || undefined);
                    }}
                    className={`w-full px-4 py-3 rounded-lg border appearance-none cursor-pointer ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="">👥 Todos los usuarios</option>
                    {Array.isArray(users) && users.map(user => (
                      <option key={user.id} value={user.id}>
                        📧 {user.name || 'Sin nombre'} ({user.email})
                      </option>
                    ))}
                  </select>
                  {/* Flecha personalizada */}
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Mostrar usuario seleccionado con su avatar */}
                {selectedUser && (
                  <div className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
                    isDarkMode ? 'bg-gray-700' : 'bg-blue-50'
                  }`}>
                    <AvatarImage
                      src={selectedUser.image}
                      alt={selectedUser.name || selectedUser.email}
                      size={32}
                      fallback={selectedUser.name?.charAt(0).toUpperCase() || selectedUser.email.charAt(0).toUpperCase()}
                    />
                    <div>
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {selectedUser.name || 'Sin nombre'}
                      </p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {selectedUser.email}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedUser(null);
                        loadObservations();
                      }}
                      className={`ml-2 p-1 rounded-full hover:bg-gray-300 ${
                        isDarkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
                      }`}
                      title="Limpiar selección"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Crear nueva observación */}
            <div className={`mb-6 p-4 rounded-lg shadow-sm ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Nueva Observación
              </h3>
              <div className="flex gap-3">
                <textarea
                  value={newObservation}
                  onChange={(e) => setNewObservation(e.target.value)}
                  placeholder="Escribe una nueva observación..."
                  rows={3}
                  className={`flex-1 px-3 py-2 rounded-lg border resize-none ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
                <button
                  onClick={handleCreateObservation}
                  disabled={isLoading || !newObservation.trim()}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creando...' : 'Crear'}
                </button>
              </div>
            </div>

            {/* Lista de observaciones */}
            <div className="space-y-4">
              {observations.length === 0 ? (
                <div className={`text-center py-12 rounded-lg ${
                  isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'
                }`}>
                  No hay observaciones {selectedUser ? `para ${selectedUser.name || selectedUser.email}` : 'disponibles'}.
                </div>
              ) : (
                observations.map((observation) => (
                  <div key={observation.id} className={`p-4 rounded-lg shadow-sm ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                  }`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        {/* Avatar del admin */}
                        {observation.author.email === 'angelomendiburu@gmail.com' ? (
                          <div
                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10 shrink-0"
                            style={{ backgroundImage: 'url("/placeholders/admin.jpg")' }}
                          ></div>
                        ) : (
                          <AvatarImage
                            src={observation.author.image}
                            alt={observation.author.name || observation.author.email}
                            size={40}
                            fallback={observation.author.name?.charAt(0).toUpperCase() || observation.author.email.charAt(0).toUpperCase()}
                          />
                        )}
                        
                        <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <div className="flex flex-col">
                              <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {observation.author.email === 'angelomendiburu@gmail.com' 
                                  ? `Admin ${observation.author.name || 'Administrator'}`
                                  : (observation.author.name || 'Usuario')
                                }
                              </span>
                              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                📧 {observation.author.email}
                              </span>
                            </div>                            {observation.targetUser && (
                              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                                isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'
                              }`}>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
                                </svg>
                                <span>Para: {observation.targetUser.name || observation.targetUser.email}</span>
                              </div>
                            )}
                            
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                            }`}>
                              {new Date(observation.createdAt).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: '2-digit',
                                year: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          {editingObservation === observation.id ? (
                            <div className="space-y-2">
                              <textarea
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                rows={3}
                                className={`w-full px-3 py-2 rounded-lg border resize-none ${
                                  isDarkMode 
                                    ? 'bg-gray-700 border-gray-600 text-white' 
                                    : 'bg-white border-gray-300 text-gray-900'
                                }`}
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditObservation(observation.id)}
                                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
                                >
                                  Guardar
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingObservation(null);
                                    setEditText('');
                                  }}
                                  className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className={`${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                              {observation.content}
                            </p>
                          )}
                          
                          {/* Respuestas de los usuarios */}
                          {observation.responses && observation.responses.length > 0 && (
                            <div className="mt-4 space-y-3">
                              <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                Respuestas de usuarios:
                              </div>
                              {observation.responses.map((response) => (
                                <div key={response.id} className={`p-4 rounded-lg border ${
                                  isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                                }`}>
                                  <div className="flex items-start gap-3">
                                    {/* Avatar del usuario que respondió */}
                                    <div className="flex-shrink-0">
                                      {response.author.email === 'angelomendiburu@gmail.com' ? (
                                        <div
                                          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-9 h-9"
                                          style={{ backgroundImage: 'url("/placeholders/admin.jpg")' }}
                                        ></div>
                                      ) : (
                                        <AvatarImage
                                          src={response.author.image}
                                          alt={response.author.name || response.author.email}
                                          size={36}
                                          fallback={response.author.name?.charAt(0).toUpperCase() || response.author.email.charAt(0).toUpperCase()}
                                        />
                                      )}
                                    </div>
                                    
                                    {/* Información del usuario y respuesta */}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                                        <div className="flex flex-col">
                                          <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {response.author.email === 'angelomendiburu@gmail.com' 
                                              ? `Admin ${response.author.name || 'Administrator'}`
                                              : (response.author.name || 'Sin nombre')
                                            }
                                          </p>
                                          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            📧 {response.author.email}
                                          </p>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1 sm:mt-0">
                                          <span className={`text-xs px-2 py-1 rounded-full ${
                                            isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'
                                          }`}>
                                            {new Date(response.createdAt).toLocaleDateString('es-ES', {
                                              day: '2-digit',
                                              month: '2-digit', 
                                              year: '2-digit',
                                              hour: '2-digit',
                                              minute: '2-digit'
                                            })}
                                          </span>
                                        </div>
                                      </div>
                                      
                                      <div className={`p-3 rounded-lg ${
                                        isDarkMode ? 'bg-gray-800' : 'bg-white'
                                      }`}>
                                        <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                          {response.content}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Respuesta legacy del usuario (mantener compatibilidad) */}
                          {observation.response && (
                            <div className={`mt-3 p-3 rounded-lg ${
                              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                            }`}>
                              <div className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                Respuesta del usuario:
                              </div>
                              <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                {observation.response}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        {editingObservation !== observation.id && (
                          <button
                            onClick={() => {
                              setEditingObservation(observation.id);
                              setEditText(observation.content);
                            }}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                          >
                            Editar
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteObservation(observation.id)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                    
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Creado: {new Date(observation.createdAt).toLocaleString()}
                      {observation.updatedAt !== observation.createdAt && (
                        <span className="ml-2">
                          | Actualizado: {new Date(observation.updatedAt).toLocaleString()}
                        </span>
                      )}
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
