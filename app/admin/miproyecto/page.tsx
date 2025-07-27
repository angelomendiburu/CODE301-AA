'use client';
import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
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

function MiProyectoContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [observations, setObservations] = useState<Observation[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [showMetricModal, setShowMetricModal] = useState(false);
  const [responseTexts, setResponseTexts] = useState<{[key: string]: string}>({});
  const [isLoadingResponse, setIsLoadingResponse] = useState<{[key: string]: boolean}>({});
  const [expandedObservations, setExpandedObservations] = useState<{[key: string]: boolean}>({});
  const [viewingUser, setViewingUser] = useState<any>(null); // Para mostrar información del usuario que se está viendo

  // Estados del modal de métrica
  const [metricTitle, setMetricTitle] = useState('');
  const [metricDescription, setMetricDescription] = useState('');
  const [metricComment, setMetricComment] = useState('');
  const [metricSales, setMetricSales] = useState('');
  const [metricExpenses, setMetricExpenses] = useState('');
  const [metricImage, setMetricImage] = useState<File | null>(null);
  const [metricDocument, setMetricDocument] = useState<File | null>(null);
  const [isLoadingMetric, setIsLoadingMetric] = useState(false);

  // Verificar autenticación
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/');
      return;
    }
  }, [session, status, router]);

  // Función para cerrar sesión
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  // Cargar observaciones
  const loadObservations = async () => {
    try {
      const response = await fetch('/api/observations');
      if (response.ok) {
        const data = await response.json();
        setObservations(data);
      }
    } catch (error) {
      console.error('Error loading observations:', error);
    }
  };

  // Cargar métricas
  const loadMetrics = useCallback(async () => {
    if (!session) return;
    
    try {
      // Obtener parámetros de la URL
      const userId = searchParams.get('userId');
      
      let response;
      
      if (userId && session?.user?.role === 'admin') {
        // Admin viendo métricas de un usuario específico
        response = await fetch(`/api/admin/user-metrics/${userId}`);
        
        if (response.ok) {
          const data = await response.json();
          setMetrics(data.metrics);
          setViewingUser(data.user);
          return;
        }
      } else {
        // Usuario normal viendo sus propias métricas
        response = await fetch('/api/metrics');
        if (response.ok) {
          const data = await response.json();
          setMetrics(data);
          setViewingUser(null);
          return;
        }
      }
    } catch (error) {
      console.error('Error loading metrics:', error);
    }
  }, [session, searchParams]);

  useEffect(() => {
    if (session) {
      loadObservations();
      loadMetrics();
    }
  }, [session, loadMetrics]);

  // Helper function to check if user already responded to an observation
  const userHasResponded = (observation: Observation) => {
    if (!session?.user?.email) return false;
    return observation.responses?.some(response => response.author.email === session.user?.email) || false;
  };

  // Toggle expanded state of an observation
  const toggleObservationExpanded = (observationId: string) => {
    setExpandedObservations(prev => ({
      ...prev,
      [observationId]: !prev[observationId]
    }));
  };

  // Responder a observación
  const handleSendResponse = async (observationId: string) => {
    const responseText = responseTexts[observationId] || '';
    if (!responseText.trim()) return;

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
        // Limpiar solo el campo de texto de esta observación específica
        setResponseTexts(prev => ({ ...prev, [observationId]: '' }));
        await loadObservations(); // Recargar observaciones
        
        // Log activity
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

  // Crear métrica
  const handleCreateMetric = async () => {
    // Validar campos requeridos
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
      
      // Añadir campos opcionales solo si tienen valor
      if (metricSales) formData.append('sales', metricSales);
      if (metricExpenses) formData.append('expenses', metricExpenses);
      
      formData.append('image', metricImage);
      formData.append('document', metricDocument);

      const response = await fetch('/api/metrics', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const metric = await response.json(); // Obtener la métrica creada con las URLs
        
        // Limpiar formulario
        setMetricTitle('');
        setMetricDescription('');
        setMetricComment('');
        setMetricSales('');
        setMetricExpenses('');
        setMetricImage(null);
        setMetricDocument(null);
        setShowMetricModal(false);
        await loadMetrics(); // Recargar métricas
        
        // Log activity con información completa
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
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-neutral-50 group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#ededed] px-10 py-3">
          <div className="flex items-center gap-4 text-[#141414]">
            <div className="size-4">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <h2 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em]">Mi Proyecto</h2>
            
            {/* Mostrar información del usuario que se está viendo (para admin) */}
            {viewingUser && session?.user?.role === 'admin' && (
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="text-blue-800 text-sm font-medium">
                  Viendo como: {viewingUser.name}
                </span>
              </div>
            )}
          </div>
          
          {/* Información del usuario y botón de cerrar sesión */}
          {session && (
            <div className="flex items-center gap-4">
              {/* Solo mostrar el botón de admin si es administrador */}
              {session.user?.role === 'admin' && (
                <div className="flex items-center gap-2">
                  <a
                    href="/admin/metrics"
                    className="flex items-center justify-center h-8 px-3 bg-purple-500 hover:bg-purple-600 text-white text-xs font-medium rounded-lg transition-colors"
                  >
                    Panel Admin
                  </a>
                </div>
              )}
              <div className="flex items-center gap-3">
                <AvatarImage
                  src={session.user?.image}
                  alt={session.user?.name || 'Usuario'}
                  size={32}
                  fallback={session.user?.name?.charAt(0) || 'U'}
                />
                <div className="flex flex-col">
                  <p className="text-[#141414] text-sm font-medium">
                    {session.user?.name || 'Usuario'}
                  </p>
                  <p className="text-neutral-500 text-xs">
                    {session.user?.role === 'admin' ? 'Admin - ' : ''}{session.user?.email}
                  </p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center justify-center h-8 px-3 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-lg transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </header>
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#141414] tracking-light text-[32px] font-bold leading-tight min-w-72">Bienvenido de nuevo, emprendedor</p>
            </div>
            <h2 className="text-[#141414] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Métricas empresariales</h2>
            
            {metrics.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-neutral-500 text-lg mb-4">No hay métricas disponibles</p>
                <p className="text-neutral-400 text-sm">Añade tu primera métrica para ver los gráficos aquí</p>
              </div>
            ) : (
              <div className="px-4 py-3 @container">
                <div className="flex overflow-hidden rounded-xl border border-[#dbdbdb] bg-neutral-50">
                  <table className="flex-1">
                    <thead>
                      <tr className="bg-neutral-50">
                        <th className="px-4 py-3 text-left text-[#141414] w-[200px] text-sm font-medium leading-normal">
                          Fecha
                        </th>
                        <th className="px-4 py-3 text-left text-[#141414] w-[150px] text-sm font-medium leading-normal">
                          Título
                        </th>
                        <th className="px-4 py-3 text-left text-[#141414] w-[120px] text-sm font-medium leading-normal">
                          Ventas
                        </th>
                        <th className="px-4 py-3 text-left text-[#141414] w-[120px] text-sm font-medium leading-normal">
                          Gastos
                        </th>
                        <th className="px-4 py-3 text-left text-[#141414] w-[200px] text-sm font-medium leading-normal">
                          Comentario
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {metrics.map((metric, index) => (
                        <tr key={metric.id} className="border-t border-t-[#dbdbdb]">
                          <td className="h-[72px] px-4 py-2 w-[200px] text-neutral-500 text-sm font-normal leading-normal">
                            {new Date(metric.createdAt).toLocaleDateString()}
                          </td>
                          <td className="h-[72px] px-4 py-2 w-[150px] text-neutral-500 text-sm font-normal leading-normal">
                            {metric.title}
                          </td>
                          <td className="h-[72px] px-4 py-2 w-[120px] text-neutral-500 text-sm font-normal leading-normal">
                            {metric.sales ? `$${metric.sales.toLocaleString()}` : '-'}
                          </td>
                          <td className="h-[72px] px-4 py-2 w-[120px] text-neutral-500 text-sm font-normal leading-normal">
                            {metric.expenses ? `$${metric.expenses.toLocaleString()}` : '-'}
                          </td>
                          <td className="h-[72px] px-4 py-2 w-[200px] text-neutral-500 text-sm font-normal leading-normal truncate">
                            {metric.comment}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            <div className="flex px-4 py-3 justify-end">
              <button 
                onClick={() => setShowMetricModal(true)}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-black text-neutral-50 text-sm font-bold leading-normal tracking-[0.015em]"
              >
                <span className="truncate">Añadir métricas</span>
              </button>
            </div>
            <h2 className="text-[#141414] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Resumen del progreso</h2>
            
            {metrics.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-neutral-500 text-lg mb-4">No hay gráficos disponibles</p>
                <p className="text-neutral-400 text-sm">Los gráficos se mostrarán cuando añadas métricas con datos de ventas y gastos</p>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap gap-4 px-4 py-6">
                  {/* Gráfico de Ventas */}
                  <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-xl border border-[#dbdbdb] p-6">
                    <p className="text-[#141414] text-base font-medium leading-normal">Ventas a lo largo del tiempo</p>
                    <p className="text-[#141414] tracking-light text-[32px] font-bold leading-tight truncate">
                      ${metrics
                        .filter(m => m.sales)
                        .reduce((sum, m) => sum + (m.sales || 0), 0)
                        .toLocaleString()}
                    </p>
                    <div className="flex gap-1">
                      <p className="text-neutral-500 text-base font-normal leading-normal">
                        Total de {metrics.filter(m => m.sales).length} métricas
                      </p>
                    </div>
                    <div className="grid min-h-[180px] grid-flow-col gap-6 grid-rows-[1fr_auto] items-end justify-items-center px-3">
                      {metrics.slice(0, 7).map((metric, index) => {
                        const maxSales = Math.max(...metrics.map(m => m.sales || 0));
                        const height = maxSales > 0 ? ((metric.sales || 0) / maxSales) * 100 : 0;
                        return (
                          <React.Fragment key={metric.id}>
                            <div 
                              className="border-neutral-500 bg-[#ededed] border-t-2 w-full" 
                              style={{ height: `${Math.max(height, 5)}%` }}
                              title={`Ventas: $${metric.sales?.toLocaleString() || '0'}`}
                            ></div>
                            <p className="text-neutral-500 text-[13px] font-bold leading-normal tracking-[0.015em]">
                              {new Date(metric.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}
                            </p>
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>

                  {/* Gráfico de Gastos */}
                  <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-xl border border-[#dbdbdb] p-6">
                    <p className="text-[#141414] text-base font-medium leading-normal">Gastos a lo largo del tiempo</p>
                    <p className="text-[#141414] tracking-light text-[32px] font-bold leading-tight truncate">
                      ${metrics
                        .filter(m => m.expenses)
                        .reduce((sum, m) => sum + (m.expenses || 0), 0)
                        .toLocaleString()}
                    </p>
                    <div className="flex gap-1">
                      <p className="text-neutral-500 text-base font-normal leading-normal">
                        Total de {metrics.filter(m => m.expenses).length} métricas
                      </p>
                    </div>
                    <div className="grid min-h-[180px] grid-flow-col gap-6 grid-rows-[1fr_auto] items-end justify-items-center px-3">
                      {metrics.slice(0, 7).map((metric, index) => {
                        const maxExpenses = Math.max(...metrics.map(m => m.expenses || 0));
                        const height = maxExpenses > 0 ? ((metric.expenses || 0) / maxExpenses) * 100 : 0;
                        return (
                          <React.Fragment key={metric.id}>
                            <div 
                              className="border-red-500 bg-red-100 border-t-2 w-full" 
                              style={{ height: `${Math.max(height, 5)}%` }}
                              title={`Gastos: $${metric.expenses?.toLocaleString() || '0'}`}
                            ></div>
                            <p className="text-neutral-500 text-[13px] font-bold leading-normal tracking-[0.015em]">
                              {new Date(metric.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}
                            </p>
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Resumen financiero */}
                <div className="flex flex-col gap-3 p-4">
                  <div className="flex gap-6 justify-between">
                    <p className="text-[#141414] text-base font-medium leading-normal">Balance (Ventas - Gastos)</p>
                    <p className="text-[#141414] text-sm font-normal leading-normal">
                      ${(metrics.reduce((sum, m) => sum + (m.sales || 0), 0) - 
                         metrics.reduce((sum, m) => sum + (m.expenses || 0), 0)).toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded bg-[#dbdbdb]">
                    <div 
                      className={`h-2 rounded ${
                        metrics.reduce((sum, m) => sum + (m.sales || 0), 0) >= 
                        metrics.reduce((sum, m) => sum + (m.expenses || 0), 0) 
                          ? 'bg-green-500' 
                          : 'bg-red-500'
                      }`} 
                      style={{ 
                        width: `${Math.min(
                          100, 
                          Math.abs(
                            (metrics.reduce((sum, m) => sum + (m.sales || 0), 0) - 
                             metrics.reduce((sum, m) => sum + (m.expenses || 0), 0)) / 
                            Math.max(1, metrics.reduce((sum, m) => sum + (m.sales || 0), 0)) * 100
                          )
                        )}%` 
                      }}
                    ></div>
                  </div>
                  <p className="text-neutral-500 text-sm font-normal leading-normal">
                    Ventas: ${metrics.reduce((sum, m) => sum + (m.sales || 0), 0).toLocaleString()} | 
                    Gastos: ${metrics.reduce((sum, m) => sum + (m.expenses || 0), 0).toLocaleString()}
                  </p>
                </div>
              </>
            )}
            <h2 className="text-[#141414] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Observaciones</h2>
            <div className="flex flex-col w-full gap-3 p-4">
              {observations.map((obs) => {
                const hasUserResponded = userHasResponded(obs);
                const isExpanded = expandedObservations[obs.id] || !hasUserResponded;
                
                return (
                <div key={obs.id} className={`border rounded-xl p-4 mb-4 transition-all ${
                  hasUserResponded 
                    ? 'border-green-200 bg-green-50/50' 
                    : 'border-[#dbdbdb] bg-white'
                }`}>
                  {/* Header con información de la observación */}
                  <div 
                    className={`flex flex-row items-start gap-3 mb-3 ${hasUserResponded ? 'cursor-pointer' : ''}`}
                    onClick={() => hasUserResponded && toggleObservationExpanded(obs.id)}
                  >
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10 shrink-0"
                      style={{ backgroundImage: 'url("/placeholders/admin.jpg")' }}
                    ></div>
                    <div className="flex flex-1 flex-col items-start justify-start">
                      <div className="flex w-full flex-row items-start justify-between gap-x-3 flex-wrap">
                        <div className="flex flex-wrap gap-x-3">
                          <p className="text-[#141414] text-sm font-bold leading-normal tracking-[0.015em]">
                            Admin {obs.author.name || obs.author.email}
                          </p>
                          <p className="text-neutral-500 text-sm font-normal leading-normal">
                            {new Date(obs.createdAt).toLocaleDateString()}
                          </p>
                          {obs.targetUser && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                              Dirigido a: {obs.targetUser.name}
                            </span>
                          )}
                        </div>
                        {hasUserResponded && (
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                              ✓ Respondida
                            </span>
                            <button className="text-gray-400 hover:text-gray-600 transition-colors">
                              {isExpanded ? '↑' : '↓'}
                            </button>
                          </div>
                        )}
                      </div>
                      <p className="text-[#141414] text-sm font-normal leading-normal">{obs.content}</p>
                    </div>
                  </div>

                  {/* Content colapsable */}
                  {isExpanded && (
                    <>
                      {/* Respuestas existentes */}
                      {obs.responses && obs.responses.length > 0 && (
                    <div className="ml-12 space-y-2 mb-3">
                      {obs.responses.map((response) => (
                        <div key={response.id} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between items-start mb-1">
                            <p className="text-[#141414] text-xs font-medium">
                              {response.author.name || response.author.email}
                            </p>
                            <p className="text-neutral-500 text-xs">
                              {new Date(response.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="text-[#141414] text-sm">{response.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Input para responder */}
                  <div className="flex flex-col w-full mt-2">
                    <div className="flex w-full items-stretch rounded-xl h-12">
                      <input
                        placeholder="Responder a la observación"
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#141414] focus:outline-0 focus:ring-0 border-none bg-[#ededed] focus:border-none h-full placeholder:text-neutral-500 px-4 rounded-r-none border-r-0 pr-2 text-base font-normal leading-normal"
                        value={responseTexts[obs.id] || ''}
                        onChange={(e) => setResponseTexts(prev => ({ ...prev, [obs.id]: e.target.value }))}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && (responseTexts[obs.id] || '').trim() !== '' && !isLoadingResponse[obs.id]) {
                            handleSendResponse(obs.id);
                          }
                        }}
                      />
                      <div className="flex border-none bg-[#ededed] items-center justify-center pr-4 rounded-r-xl border-l-0 !pr-2">
                        <div className="flex items-center gap-4 justify-end">
                          <button 
                            onClick={() => handleSendResponse(obs.id)}
                            disabled={isLoadingResponse[obs.id] || !(responseTexts[obs.id] || '').trim()}
                            className="min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-black text-neutral-50 text-sm font-medium leading-normal disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
                            title="Enviar respuesta (Enter)"
                          >
                            <span className="truncate">
                              {isLoadingResponse[obs.id] ? 'Enviando...' : 'Responder'}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                    </>
                  )}
                </div>
                )
              })}
              {observations.length === 0 && (
                <p className="text-neutral-500 text-sm italic px-4">No hay observaciones aún</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal para añadir métricas */}
      {showMetricModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[#141414]">Añadir Nueva Métrica</h3>
              <button 
                onClick={() => setShowMetricModal(false)}
                className="text-neutral-500 hover:text-[#141414]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#141414] mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-[#dbdbdb] rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Título de la métrica"
                  value={metricTitle}
                  onChange={(e) => setMetricTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#141414] mb-2">
                  Descripción
                </label>
                <textarea
                  className="w-full p-3 border border-[#dbdbdb] rounded-xl focus:outline-none focus:ring-2 focus:ring-black h-20 resize-none"
                  placeholder="Descripción de la métrica"
                  value={metricDescription}
                  onChange={(e) => setMetricDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#141414] mb-2">
                  Comentario *
                </label>
                <textarea
                  className="w-full p-3 border border-[#dbdbdb] rounded-xl focus:outline-none focus:ring-2 focus:ring-black h-20 resize-none"
                  placeholder="Comentario adicional (requerido)"
                  value={metricComment}
                  onChange={(e) => setMetricComment(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#141414] mb-2">
                  Ventas (opcional)
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full p-3 border border-[#dbdbdb] rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Monto de ventas"
                  value={metricSales}
                  onChange={(e) => setMetricSales(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#141414] mb-2">
                  Gastos (opcional)
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full p-3 border border-[#dbdbdb] rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Monto de gastos"
                  value={metricExpenses}
                  onChange={(e) => setMetricExpenses(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#141414] mb-2">
                  Imagen *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full p-3 border border-[#dbdbdb] rounded-xl focus:outline-none"
                  onChange={(e) => setMetricImage(e.target.files?.[0] || null)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#141414] mb-2">
                  Documento (Word, Excel, CSV, PDF) *
                </label>
                <input
                  type="file"
                  accept=".doc,.docx,.xls,.xlsx,.csv,.pdf"
                  className="w-full p-3 border border-[#dbdbdb] rounded-xl focus:outline-none"
                  onChange={(e) => setMetricDocument(e.target.files?.[0] || null)}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowMetricModal(false)}
                className="flex-1 px-4 py-2 border border-[#dbdbdb] rounded-xl text-[#141414] hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button 
                onClick={handleCreateMetric}
                disabled={isLoadingMetric || !metricTitle.trim() || !metricComment || !metricImage || !metricDocument}
                className="flex-1 px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingMetric ? 'Creando...' : 'Crear Métrica'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MiProyecto() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <MiProyectoContent />
    </Suspense>
  );
}
