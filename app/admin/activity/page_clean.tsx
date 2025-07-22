'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('7days');

  // Cargar configuraciones guardadas
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('isDarkMode');
    if (savedDarkMode !== null) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  const fetchActivityLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const params = new URLSearchParams();
      if (filter !== 'all') params.set('action', filter);
      if (dateRange !== 'all') params.set('range', dateRange);
      
      const response = await fetch(`/api/admin/activity?${params.toString()}`);
      
      if (response.ok) {
        const data = await response.json();
        setActivities(data.activities || []);
      } else {
        console.error('Error fetching activity logs:', response.statusText);
        setActivities([]);
      }
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      setActivities([]);
    } finally {
      setIsLoading(false);
    }
  }, [filter, dateRange]);

  // Verificar autorización y cargar datos
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user?.email !== 'angelomendiburu@gmail.com') {
      router.push('/');
      return;
    }
    
    fetchActivityLogs();
  }, [session, status, router, filter, dateRange, fetchActivityLogs]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'login': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200';
      case 'logout': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200';
      case 'upload_metric': return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200';
      case 'upload_document': return 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200';
      case 'upload_image': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-200';
      case 'create_observation': return 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-200';
      case 'respond_observation': return 'bg-teal-100 text-teal-800 dark:bg-teal-800 dark:text-teal-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'login': return 'Inicio de sesión';
      case 'logout': return 'Cierre de sesión';
      case 'upload_metric': return 'Subida métrica';
      case 'upload_document': return 'Subida documento';
      case 'upload_image': return 'Subida imagen';
      case 'create_observation': return 'Observación creada';
      case 'respond_observation': return 'Respuesta observación';
      default: return action;
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
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Registro de Actividad</h1>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Monitoreo de todas las acciones de los usuarios</p>
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
              <div className="text-sm">
                <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {session.user?.name || 'Usuario'}
                </div>
                <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Admin - {session.user?.email}
                </div>
              </div>
            </div>
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
            {activities.length} actividades encontradas
          </div>
        </div>
      </div>

      {/* Lista de actividades */}
      <div className={`rounded-lg shadow-sm border ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Cargando actividades...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="p-8 text-center">
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              No se encontraron actividades para los filtros seleccionados
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {activities.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <AvatarImage
                      src={activity.user.image}
                      alt={activity.user.name}
                      size={40}
                      fallback={activity.user.name.charAt(0)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {activity.user.name}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(activity.action)}`}>
                          {getActionLabel(activity.action)}
                        </span>
                      </div>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {activity.description}
                      </p>
                      {activity.metadata && (
                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          {activity.metadata.fileName && (
                            <span className="mr-4">📁 {activity.metadata.fileName}</span>
                          )}
                          {activity.metadata.fileSize && (
                            <span className="mr-4">📏 {formatFileSize(activity.metadata.fileSize)}</span>
                          )}
                          {activity.metadata.ipAddress && (
                            <span>🌐 {activity.metadata.ipAddress}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {new Date(activity.createdAt).toLocaleString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
