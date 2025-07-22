'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [newObservation, setNewObservation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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
    
    fetchUsers();
  }, [session, status, router]);

  // Cargar observaciones cuando se selecciona un usuario
  useEffect(() => {
    if (selectedUser) {
      fetchObservations(selectedUser.id);
    } else {
      setObservations([]);
    }
  }, [selectedUser]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchObservations = async (userId: string) => {
    try {
      const response = await fetch(`/api/observations?targetUserId=${userId}`);
      
      if (response.ok) {
        const data = await response.json();
        // La API devuelve las observaciones directamente, no dentro de un objeto
        setObservations(Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch observations:', response.statusText);
        setObservations([]);
      }
    } catch (error) {
      console.error('Error fetching observations:', error);
      setObservations([]);
    }
  };

  const handleSubmitObservation = async () => {
    if (!selectedUser || !newObservation.trim()) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/observations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newObservation.trim(),
          targetUserId: selectedUser.id
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Log activity
        await logActivity(
          ActivityTypes.CREATE_OBSERVATION,
          `Observación creada para ${selectedUser.name || selectedUser.email}`,
          {
            observationId: data.observation.id,
            targetUserId: selectedUser.id
          }
        );
        
        setNewObservation('');
        fetchObservations(selectedUser.id);
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      }
    } catch (error) {
      console.error('Error creating observation:', error);
    } finally {
      setIsSubmitting(false);
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
          : 'bg-white border-l-4 border-l-purple-600 shadow-lg'
      }`}>
        <div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Observaciones</h1>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Gestión de observaciones y respuestas de usuarios</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de usuarios */}
        <div className={`rounded-lg shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Usuarios ({users.length})
            </h2>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {users.map((user) => (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`p-4 cursor-pointer border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  selectedUser?.id === user.id ? 'bg-blue-50 dark:bg-blue-900' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <AvatarImage
                    src={user.image}
                    alt={user.name || user.email}
                    size={32}
                    fallback={(user.name || user.email).charAt(0)}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {user.name || 'Sin nombre'}
                    </p>
                    <p className={`text-xs truncate ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      {user.email}
                    </p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>
                      {user._count.metrics} métricas
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel de observaciones */}
        <div className="lg:col-span-2">
          {selectedUser ? (
            <>
              {/* Header del usuario seleccionado */}
              <div className={`mb-4 p-4 rounded-lg shadow-sm border ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center gap-3">
                  <AvatarImage
                    src={selectedUser.image}
                    alt={selectedUser.name || selectedUser.email}
                    size={40}
                    fallback={(selectedUser.name || selectedUser.email).charAt(0)}
                  />
                  <div>
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedUser.name || 'Sin nombre'}
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {selectedUser.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Formulario para nueva observación */}
              <div className={`mb-4 p-4 rounded-lg shadow-sm border ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <h4 className={`text-md font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Nueva Observación
                </h4>
                <textarea
                  value={newObservation}
                  onChange={(e) => setNewObservation(e.target.value)}
                  placeholder="Escribe una observación..."
                  rows={4}
                  className={`w-full p-3 rounded-lg border resize-none ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
                <div className="flex justify-between items-center mt-3">
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {newObservation.length}/1000
                  </span>
                  <button
                    onClick={handleSubmitObservation}
                    disabled={isSubmitting || !newObservation.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar Observación'}
                  </button>
                </div>
                
                {showSuccessMessage && (
                  <div className="mt-3 p-2 bg-green-100 text-green-800 text-sm rounded-lg dark:bg-green-800 dark:text-green-200">
                    ✓ Observación enviada correctamente
                  </div>
                )}
              </div>

              {/* Lista de observaciones */}
              <div className={`rounded-lg shadow-sm border ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h4 className={`text-md font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Historial de Observaciones ({observations.length})
                  </h4>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {observations.length === 0 ? (
                    <div className="p-4 text-center">
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        No hay observaciones para este usuario
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {observations.map((observation) => (
                        <div key={observation.id} className="p-4">
                          <div className="flex items-start gap-3">
                            <AvatarImage
                              src={observation.author.image}
                              alt={observation.author.name || observation.author.email}
                              size={32}
                              fallback={(observation.author.name || observation.author.email).charAt(0)}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {observation.author.name || 'Admin'}
                                </span>
                                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {new Date(observation.createdAt).toLocaleString('es-ES')}
                                </span>
                              </div>
                              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {observation.content}
                              </p>
                              
                              {/* Respuestas */}
                              {observation.responses.length > 0 && (
                                <div className="mt-3 ml-4 border-l-2 border-gray-200 dark:border-gray-600 pl-4">
                                  {observation.responses.map((response) => (
                                    <div key={response.id} className="mb-2">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-xs font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                          {response.author.name || 'Usuario'}
                                        </span>
                                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                          {new Date(response.createdAt).toLocaleString('es-ES')}
                                        </span>
                                      </div>
                                      <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        {response.content}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className={`p-8 text-center rounded-lg shadow-sm border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Selecciona un usuario para ver sus observaciones
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
