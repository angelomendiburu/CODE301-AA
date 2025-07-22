'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
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

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('adminDarkMode');
    if (savedDarkMode !== null) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  useEffect(() => {
    if (session && session.user?.email !== 'angelomendiburu@gmail.com') {
      router.push('/');
      return;
    }
    if (session && session.user?.email === 'angelomendiburu@gmail.com') {
      fetchUsersWithDocuments();
    }
  }, [session, router]);

  useEffect(() => {
    if (userId && usersWithDocuments.length > 0) {
      const user = usersWithDocuments.find(u => u.id === userId);
      if (user) {
        setSelectedUser(user);
      }
    }
  }, [userId, usersWithDocuments]);

  const fetchUsersWithDocuments = async () => {
    try {
      const response = await fetch('/api/admin/metrics-documents');
      if (response.ok) {
        const data = await response.json();
        setUsersWithDocuments(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching users with documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('document') || fileType.includes('word')) return '📝';
    if (fileType.includes('sheet') || fileType.includes('excel')) return '📊';
    return '📎';
  };

  if (!session || session.user?.email !== 'angelomendiburu@gmail.com') {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      {/* Header */}
      <div className={`flex justify-between items-center mb-6 rounded-lg p-4 shadow-sm ${
        isDarkMode 
          ? 'bg-gray-800 border border-gray-700' 
          : 'bg-white border-l-4 border-l-blue-600 shadow-lg'
      }`}>
        <div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Documentos de Métricas
          </h1>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Gestión de documentos asociados a las métricas
          </p>
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

      {/* Controles */}
      <div className={`mb-4 p-4 rounded-lg shadow-sm ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center">
          <div>
            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {selectedUser ? `Documentos de ${selectedUser.name || selectedUser.email}` : 'Todos los usuarios'}
            </h2>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${
                viewMode === 'grid' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${
                viewMode === 'list' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Lista de usuarios */}
        <div className={`rounded-lg shadow-sm border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className={`text-md font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Usuarios ({usersWithDocuments.length})
            </h3>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            <div
              onClick={() => setSelectedUser(null)}
              className={`p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                !selectedUser ? 'bg-blue-50 dark:bg-blue-900' : ''
              }`}
            >
              <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Todos los usuarios
              </div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Ver todos los documentos
              </div>
            </div>
            
            {usersWithDocuments.map((user) => (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  selectedUser?.id === user.id ? 'bg-blue-50 dark:bg-blue-900' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <AvatarImage
                    src={user.image}
                    alt={user.name || user.email}
                    size={24}
                    fallback={(user.name || user.email).charAt(0)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {user.name || 'Sin nombre'}
                    </div>
                    <div className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {user.documents.length} documentos
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel de documentos */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className={`rounded-lg shadow-sm border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="p-4">
                {(() => {
                  const documents = selectedUser ? selectedUser.documents : usersWithDocuments.flatMap(u => u.documents);
                  
                  if (documents.length === 0) {
                    return (
                      <div className="text-center py-8">
                        <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          No hay documentos disponibles
                        </p>
                      </div>
                    );
                  }

                  if (viewMode === 'grid') {
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {documents.map((doc) => (
                          <div
                            key={doc.id}
                            className={`p-4 rounded-lg border hover:shadow-md transition-shadow ${
                              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="text-2xl">
                                {getFileIcon(doc.fileType)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className={`text-sm font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {doc.originalName}
                                </h4>
                                <p className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {formatFileSize(doc.fileSize)}
                                </p>
                                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {new Date(doc.uploadedAt).toLocaleDateString('es-ES')}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <AvatarImage
                                    src={doc.user.image}
                                    alt={doc.user.name}
                                    size={16}
                                    fallback={doc.user.name.charAt(0)}
                                  />
                                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {doc.user.name}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  } else {
                    return (
                      <div className="space-y-2">
                        {documents.map((doc) => (
                          <div
                            key={doc.id}
                            className={`p-3 rounded-lg border ${
                              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className="text-xl">
                                {getFileIcon(doc.fileType)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className={`text-sm font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {doc.originalName}
                                </h4>
                                <div className="flex items-center gap-4 mt-1">
                                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {formatFileSize(doc.fileSize)}
                                  </span>
                                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {new Date(doc.uploadedAt).toLocaleDateString('es-ES')}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    <AvatarImage
                                      src={doc.user.image}
                                      alt={doc.user.name}
                                      size={16}
                                      fallback={doc.user.name.charAt(0)}
                                    />
                                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                      {doc.user.name}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  }
                })()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
