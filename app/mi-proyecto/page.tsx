'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AvatarImage from '@/components/AvatarImage';
import { logActivity, ActivityTypes } from '@/utils/activityLogger';

interface Observation {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
  targetUser?: {
    id: string;
    name: string;
    email: string;
  };
  responses: {
    id: string;
    content: string;
    createdAt: string;
    author: {
      id: string;
      name: string;
      email: string;
      image?: string | null;
    };
  }[];
}

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

export default function MiProyectoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isDarkMode] = useState(false);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [responseTexts, setResponseTexts] = useState<{[key: string]: string}>({});
  const [isLoadingResponse, setIsLoadingResponse] = useState<{[key: string]: boolean}>({});
  const [showMetricModal, setShowMetricModal] = useState(false);
  const [metricTitle, setMetricTitle] = useState('');
  const [metricDescription, setMetricDescription] = useState('');
  const [metricComment, setMetricComment] = useState('');
  const [metricSales, setMetricSales] = useState('');
  const [metricExpenses, setMetricExpenses] = useState('');
  const [metricImage, setMetricImage] = useState<File | null>(null);
  const [metricDocument, setMetricDocument] = useState<File | null>(null);
  const [isLoadingMetric, setIsLoadingMetric] = useState(false);
  const [unreadObservations, setUnreadObservations] = useState(0);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);

  // Función para hacer scroll hacia las observaciones
  const scrollToObservations = () => {
    const observationsSection = document.getElementById('observaciones-section');
    if (observationsSection) {
      observationsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

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

  // Cargar observaciones dirigidas al usuario actual
  const loadObservations = useCallback(async () => {
    try {
      const response = await fetch('/api/observations');
      if (response.ok) {
        const data = await response.json();
        // Filtrar solo observaciones dirigidas al usuario actual
        const userObservations = data.filter((obs: Observation) => 
          obs.targetUser?.id === session?.user?.id || 
          (!obs.targetUser && obs.author.email !== session?.user?.email)
        );
        setObservations(userObservations);
        
        // Contar observaciones no leídas (simplificado - las de las últimas 24 horas)
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        const recent = userObservations.filter(obs => 
          new Date(obs.createdAt) > oneDayAgo && 
          obs.author.email === 'angelomendiburu@gmail.com'
        ).length;
        setUnreadObservations(recent);
      }
    } catch (error) {
      console.error('Error loading observations:', error);
    }
  }, [session]);

  // Cargar métricas del usuario
  const loadMetrics = useCallback(async () => {
    try {
      const response = await fetch('/api/metrics');
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      }
    } catch (error) {
      console.error('Error loading metrics:', error);
    }
  }, []);

  useEffect(() => {
    if (session && session.user?.email !== 'angelomendiburu@gmail.com') {
      loadObservations();
      loadMetrics();
    }
  }, [session, loadObservations, loadMetrics]);

  // Cerrar dropdown de notificaciones al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-notification-dropdown]')) {
        setNotificationDropdownOpen(false);
      }
    };

    if (notificationDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [notificationDropdownOpen]);

  // Responder a observación
  const handleSendResponse = async (observationId: string) => {
    const responseText = responseTexts[observationId];
    if (!responseText?.trim()) return;

    setIsLoadingResponse(prev => ({ ...prev, [observationId]: true }));
    try {
      const response = await fetch('/api/observations/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: responseText.trim(),
          observationId,
        }),
      });

      if (response.ok) {
        setResponseTexts(prev => ({ ...prev, [observationId]: '' }));
        await loadObservations();
        
        await logActivity(
          ActivityTypes.RESPOND_OBSERVATION,
          `Respondió a una observación`,
          { observationId }
        );
      } else {
        const error = await response.json();
        alert(error.error || 'Error al enviar la respuesta');
      }
    } catch (error) {
      console.error('Error sending response:', error);
      alert('Error al enviar la respuesta');
    } finally {
      setIsLoadingResponse(prev => ({ ...prev, [observationId]: false }));
    }
  };

  // Manejar apertura/cierre de notificaciones
  const handleNotificationToggle = () => {
    setNotificationDropdownOpen(!notificationDropdownOpen);
    // Marcar como leídas cuando se abre el dropdown
    if (!notificationDropdownOpen && unreadObservations > 0) {
      setUnreadObservations(0);
    }
  };

  // Crear métrica
  const handleCreateMetric = async () => {
    if (!metricTitle.trim() || !metricComment || !metricImage || !metricDocument) {
      alert('Por favor, completa todos los campos obligatorios: título, comentario, imagen y documento.');
      return;
    }

    setIsLoadingMetric(true);
    try {
      const formData = new FormData();
      formData.append('title', metricTitle.trim());
      if (metricDescription) formData.append('description', metricDescription);
      formData.append('comment', metricComment);
      
      if (metricSales) formData.append('sales', metricSales);
      if (metricExpenses) formData.append('expenses', metricExpenses);
      
      formData.append('image', metricImage);
      formData.append('document', metricDocument);

      const response = await fetch('/api/metrics', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const metric = await response.json();
        
        setMetricTitle('');
        setMetricDescription('');
        setMetricComment('');
        setMetricSales('');
        setMetricExpenses('');
        setMetricImage(null);
        setMetricDocument(null);
        setShowMetricModal(false);
        await loadMetrics();
        
        await logActivity(
          ActivityTypes.UPLOAD_METRIC,
          `Subió una nueva métrica: ${metricTitle}`,
          { 
            metricId: metric.id,
            metricTitle: metricTitle.trim(),
            fileName: metricDocument?.name || null,
            fileUrl: metric.imageUrl || null,
            documentUrl: metric.documentUrl || null,
            fileSize: metricDocument?.size || null,
            fileType: metricDocument?.type || null,
            hasImage: !!metricImage,
            hasDocument: !!metricDocument,
            hasSales: !!metricSales,
            hasExpenses: !!metricExpenses
          }
        );
      } else {
        const error = await response.json();
        alert(error.error || 'Error al crear la métrica');
      }
    } catch (error) {
      console.error('Error creating metric:', error);
      alert('Error al crear la métrica');
    } finally {
      setIsLoadingMetric(false);
    }
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
                  ? 'bg-blue-600 text-white' 
                  : 'bg-blue-500 text-white'
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
                  ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Documentos
            </a>

            <button
              onClick={scrollToObservations}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Observaciones
              {unreadObservations > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 ml-auto">
                  {unreadObservations}
                </span>
              )}
            </button>
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
              Dashboard
            </h2>
            
            <div className="flex items-center gap-4">
              {/* Campanita de notificaciones */}
              <div className="relative" data-notification-dropdown>
                <button 
                  onClick={handleNotificationToggle}
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'text-gray-300 hover:bg-gray-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 0 1 6 6v4.5l1.5 1.5h-15l1.5-1.5v-4.5a6 6 0 0 1 6-6z" />
                  </svg>
                  {unreadObservations > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadObservations}
                    </span>
                  )}
                </button>

                {/* Dropdown de notificaciones */}
                {notificationDropdownOpen && (
                  <div className={`absolute right-0 top-12 w-80 rounded-lg shadow-lg border z-50 ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700' 
                      : 'bg-white border-gray-200'
                  }`}>
                    <div className="p-4">
                      <h3 className={`text-sm font-semibold mb-3 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        Observaciones del Admin
                      </h3>
                      
                      {observations.length > 0 ? (
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                          {observations
                            .filter(obs => obs.author.email === 'angelomendiburu@gmail.com')
                            .slice(0, 5)
                            .map((obs) => (
                              <div key={obs.id} className={`p-3 rounded-lg border ${
                                isDarkMode 
                                  ? 'border-gray-600 bg-gray-700' 
                                  : 'border-gray-200 bg-gray-50'
                              }`}>
                                <div className="flex items-start gap-2">
                                  <div
                                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-6 h-6 flex-shrink-0"
                                    style={{ backgroundImage: 'url("/placeholders/admin.jpg")' }}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-xs font-medium ${
                                      isDarkMode ? 'text-white' : 'text-gray-900'
                                    }`}>
                                      Admin {obs.author.name || 'Administrator'}
                                    </p>
                                    <p className={`text-xs mt-1 line-clamp-2 ${
                                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                      {obs.content}
                                    </p>
                                    <p className={`text-xs mt-1 ${
                                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                      {new Date(obs.createdAt).toLocaleDateString('es-ES', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <p className={`text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          No hay observaciones del administrador
                        </p>
                      )}
                      
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <button
                          onClick={() => setNotificationDropdownOpen(false)}
                          className={`text-xs px-3 py-1 rounded transition-colors ${
                            isDarkMode 
                              ? 'text-blue-400 hover:bg-gray-700' 
                              : 'text-blue-600 hover:bg-gray-100'
                          }`}
                        >
                          Ver todas las observaciones
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

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

        {/* Contenido del dashboard */}
        <main className={`flex-1 p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Botón para crear nueva métrica */}
            <div className="flex justify-end">
              <button
                onClick={() => setShowMetricModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Crear Métrica
              </button>
            </div>

            {/* Gráficos de métricas */}
            {metrics.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Gráfico de Ventas */}
                <div className={`p-6 rounded-xl border ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                }`}>
                  <h3 className={`text-base font-medium mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Ventas a lo largo del tiempo
                  </h3>
                  <p className={`text-3xl font-bold mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    ${metrics
                      .filter(m => m.sales)
                      .reduce((sum, m) => sum + (m.sales || 0), 0)
                      .toLocaleString()}
                  </p>
                  <p className={`text-sm mb-4 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Total de {metrics.filter(m => m.sales).length} métricas
                  </p>
                  
                  <div className="grid min-h-[180px] grid-flow-col gap-6 grid-rows-[1fr_auto] items-end justify-items-center px-3">
                    {metrics.slice(0, 7).map((metric) => {
                      const maxSales = Math.max(...metrics.map(m => m.sales || 0));
                      const height = maxSales > 0 ? ((metric.sales || 0) / maxSales) * 100 : 0;
                      return (
                        <React.Fragment key={metric.id}>
                          <div 
                            className="border-green-500 bg-green-100 border-t-2 w-full" 
                            style={{ height: `${Math.max(height, 5)}%` }}
                            title={`Ventas: $${metric.sales?.toLocaleString() || '0'}`}
                          />
                          <p className={`text-xs font-bold ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {new Date(metric.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}
                          </p>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>

                {/* Gráfico de Gastos */}
                <div className={`p-6 rounded-xl border ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                }`}>
                  <h3 className={`text-base font-medium mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Gastos a lo largo del tiempo
                  </h3>
                  <p className={`text-3xl font-bold mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    ${metrics
                      .filter(m => m.expenses)
                      .reduce((sum, m) => sum + (m.expenses || 0), 0)
                      .toLocaleString()}
                  </p>
                  <p className={`text-sm mb-4 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Total de {metrics.filter(m => m.expenses).length} métricas
                  </p>
                  
                  <div className="grid min-h-[180px] grid-flow-col gap-6 grid-rows-[1fr_auto] items-end justify-items-center px-3">
                    {metrics.slice(0, 7).map((metric) => {
                      const maxExpenses = Math.max(...metrics.map(m => m.expenses || 0));
                      const height = maxExpenses > 0 ? ((metric.expenses || 0) / maxExpenses) * 100 : 0;
                      return (
                        <React.Fragment key={metric.id}>
                          <div 
                            className="border-red-500 bg-red-100 border-t-2 w-full" 
                            style={{ height: `${Math.max(height, 5)}%` }}
                            title={`Gastos: $${metric.expenses?.toLocaleString() || '0'}`}
                          />
                          <p className={`text-xs font-bold ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {new Date(metric.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}
                          </p>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Lista de métricas subidas */}
            {metrics.length > 0 && (
              <div className={`rounded-xl border ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}>
                <div className="p-6">
                  <h3 className={`text-lg font-semibold mb-4 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Métricas Subidas
                  </h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className={`${
                          isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                        }`}>
                          <th className={`px-4 py-3 text-left text-sm font-medium ${
                            isDarkMode ? 'text-gray-200' : 'text-gray-900'
                          }`}>
                            Fecha
                          </th>
                          <th className={`px-4 py-3 text-left text-sm font-medium ${
                            isDarkMode ? 'text-gray-200' : 'text-gray-900'
                          }`}>
                            Título
                          </th>
                          <th className={`px-4 py-3 text-left text-sm font-medium ${
                            isDarkMode ? 'text-gray-200' : 'text-gray-900'
                          }`}>
                            Ventas
                          </th>
                          <th className={`px-4 py-3 text-left text-sm font-medium ${
                            isDarkMode ? 'text-gray-200' : 'text-gray-900'
                          }`}>
                            Gastos
                          </th>
                          <th className={`px-4 py-3 text-left text-sm font-medium ${
                            isDarkMode ? 'text-gray-200' : 'text-gray-900'
                          }`}>
                            Comentario
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {metrics.map((metric, index) => (
                          <tr key={metric.id} className={`border-t ${
                            isDarkMode ? 'border-gray-600' : 'border-gray-200'
                          }`}>
                            <td className={`px-4 py-3 text-sm ${
                              isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              {new Date(metric.createdAt).toLocaleDateString('es-ES')}
                            </td>
                            <td className={`px-4 py-3 text-sm font-medium ${
                              isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {metric.title}
                            </td>
                            <td className={`px-4 py-3 text-sm ${
                              isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              {metric.sales ? `$${metric.sales.toLocaleString()}` : '-'}
                            </td>
                            <td className={`px-4 py-3 text-sm ${
                              isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              {metric.expenses ? `$${metric.expenses.toLocaleString()}` : '-'}
                            </td>
                            <td className={`px-4 py-3 text-sm ${
                              isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            } max-w-xs truncate`}>
                              {metric.comment}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Observaciones del admin */}
            {observations.length > 0 && (
              <div id="observaciones-section" className={`p-6 rounded-xl border ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Observaciones del Admin
                </h3>
                
                <div className="space-y-4">
                  {observations.map((obs) => (
                    <div key={obs.id} className={`border rounded-lg p-4 ${
                      isDarkMode 
                        ? 'border-gray-600 bg-gray-700' 
                        : 'border-gray-200 bg-gray-50'
                    }`}>
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-shrink-0">
                          {obs.author.email === 'angelomendiburu@gmail.com' ? (
                            <div
                              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10"
                              style={{ backgroundImage: 'url("/placeholders/admin.jpg")' }}
                            />
                          ) : (
                            <AvatarImage
                              src={obs.author.image || null}
                              alt={obs.author.name || obs.author.email}
                              size={40}
                              fallback={obs.author.name?.charAt(0).toUpperCase() || obs.author.email.charAt(0).toUpperCase()}
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className={`text-sm font-bold ${
                              isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {obs.author.email === 'angelomendiburu@gmail.com' 
                                ? `Admin ${obs.author.name || 'Administrator'}`
                                : (obs.author.name || 'Usuario')
                              }
                            </p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              isDarkMode 
                                ? 'bg-gray-600 text-gray-300' 
                                : 'bg-gray-200 text-gray-600'
                            }`}>
                              {new Date(obs.createdAt).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: '2-digit',
                                year: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <div className={`p-3 rounded-lg ${
                            isDarkMode ? 'bg-gray-600' : 'bg-white'
                          }`}>
                            <p className={`text-sm ${
                              isDarkMode ? 'text-gray-200' : 'text-gray-800'
                            }`}>
                              {obs.content}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Respuestas existentes */}
                      {obs.responses && obs.responses.length > 0 && (
                        <div className="ml-12 space-y-3 mb-3">
                          <div className={`text-sm font-medium mb-2 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            💬 Respuestas ({obs.responses.length})
                          </div>
                          {obs.responses.map((response) => (
                            <div key={response.id} className={`border rounded-lg p-4 ${
                              isDarkMode 
                                ? 'border-gray-600 bg-gray-600' 
                                : 'border-gray-200 bg-white'
                            }`}>
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0">
                                  {response.author.email === 'angelomendiburu@gmail.com' ? (
                                    <div
                                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-8 h-8"
                                      style={{ backgroundImage: 'url("/placeholders/admin.jpg")' }}
                                    />
                                  ) : (
                                    <AvatarImage
                                      src={response.author.image || null}
                                      alt={response.author.name || response.author.email}
                                      size={32}
                                      fallback={response.author.name?.charAt(0).toUpperCase() || response.author.email.charAt(0).toUpperCase()}
                                    />
                                  )}
                                </div>
                                
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <p className={`text-sm font-semibold ${
                                      isDarkMode ? 'text-white' : 'text-gray-900'
                                    }`}>
                                      {response.author.email === 'angelomendiburu@gmail.com' 
                                        ? `Admin ${response.author.name || 'Administrator'}`
                                        : (response.author.name || 'Sin nombre')
                                      }
                                    </p>
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                      isDarkMode 
                                        ? 'bg-gray-500 text-gray-300' 
                                        : 'bg-gray-100 text-gray-700'
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
                                  
                                  <div className={`p-3 rounded-lg ${
                                    isDarkMode ? 'bg-gray-500' : 'bg-gray-50'
                                  }`}>
                                    <p className={`text-sm ${
                                      isDarkMode ? 'text-gray-200' : 'text-gray-800'
                                    }`}>
                                      {response.content}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Campo para responder */}
                      <div className="ml-12 mt-3">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={responseTexts[obs.id] || ''}
                            onChange={(e) => setResponseTexts(prev => ({
                              ...prev,
                              [obs.id]: e.target.value
                            }))}
                            placeholder="Escribe tu respuesta..."
                            className={`flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500 ${
                              isDarkMode 
                                ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendResponse(obs.id)}
                          />
                          <button
                            onClick={() => handleSendResponse(obs.id)}
                            disabled={!responseTexts[obs.id]?.trim() || isLoadingResponse[obs.id]}
                            className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                          >
                            {isLoadingResponse[obs.id] ? 'Enviando...' : 'Responder'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mensaje cuando no hay observaciones */}
            {observations.length === 0 && (
              <div id="observaciones-section" className={`text-center py-8 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                No hay observaciones del administrador
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal para crear métrica */}
      {showMetricModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`max-w-2xl w-full mx-4 rounded-xl shadow-lg ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-xl font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Crear Nueva Métrica
                </h3>
                <button
                  onClick={() => setShowMetricModal(false)}
                  className={`p-1 rounded-lg ${
                    isDarkMode 
                      ? 'text-gray-400 hover:bg-gray-700' 
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Título *
                  </label>
                  <input
                    type="text"
                    value={metricTitle}
                    onChange={(e) => setMetricTitle(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Título de la métrica"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Descripción
                  </label>
                  <input
                    type="text"
                    value={metricDescription}
                    onChange={(e) => setMetricDescription(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Descripción opcional"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Comentario *
                  </label>
                  <textarea
                    value={metricComment}
                    onChange={(e) => setMetricComment(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    rows={3}
                    placeholder="Comentario sobre la métrica"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Ventas
                    </label>
                    <input
                      type="number"
                      value={metricSales}
                      onChange={(e) => setMetricSales(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-1 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Gastos
                    </label>
                    <input
                      type="number"
                      value={metricExpenses}
                      onChange={(e) => setMetricExpenses(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Imagen *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setMetricImage(e.target.files?.[0] || null)}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Documento *
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.xlsx,.xls,.csv"
                    onChange={(e) => setMetricDocument(e.target.files?.[0] || null)}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                  <p className={`text-xs mt-1 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Formatos soportados: PDF, Word (.doc, .docx), Excel (.xlsx, .xls), CSV
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowMetricModal(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' 
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateMetric}
                  disabled={isLoadingMetric}
                  className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg font-medium hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isLoadingMetric ? 'Creando...' : 'Crear Métrica'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
