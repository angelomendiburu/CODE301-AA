'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface IncompleteRegistration {
  id: string;
  userEmail: string;
  projectData: {
    programId: string;
    projectName: string;
    category: string;
    industry: string;
    description: string;
    projectOrigin: string;
    projectStage: string;
    problemDescription: string;
    opportunityValue: string;
    youtubeUrl: string;
    phone: string;
  };
  currentStep: number;
  createdAt: string;
  updatedAt: string;
  status: string;
}

interface CompleteRegistration {
  id: string;
  userEmail: string;
  projectData?: {
    programId: string;
    projectName: string;
    category: string;
    industry: string;
    description: string;
    projectOrigin: string;
    projectStage: string;
    problemDescription: string;
    opportunityValue: string;
    youtubeUrl: string;
    phone: string;
  };
  // Soporte para formato legacy
  programId?: string;
  projectName?: string;
  category?: string;
  industry?: string;
  description?: string;
  projectOrigin?: string;
  projectStage?: string;
  problemDescription?: string;
  opportunityValue?: string;
  youtubeUrl?: string;
  phone?: string;
  
  completedSteps?: number;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function AdminRegisterPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [incompleteRegistrations, setIncompleteRegistrations] = useState<IncompleteRegistration[]>([]);
  const [completeRegistrations, setCompleteRegistrations] = useState<CompleteRegistration[]>([]);
  const [activeTab, setActiveTab] = useState<'incomplete' | 'pending' | 'approved' | 'rejected'>('pending');
  const [loading, setLoading] = useState(true);
  const [selectedRegistration, setSelectedRegistration] = useState<CompleteRegistration | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Estados para video preview
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  const extractYouTubeVideoId = (url: string) => {
    if (!url || typeof url !== 'string') {
      return null;
    }
    
    const cleanUrl = url.trim();
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?(?:.*&)?v=([a-zA-Z0-9_-]{11})(?:&.*)?$/,
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})(?:\?.*)?$/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})(?:\?.*)?$/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]{11})(?:\?.*)?$/,
      /[?&]v=([a-zA-Z0-9_-]{11})(?:[&\s].*)?$/,
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    ];
    
    for (let i = 0; i < patterns.length; i++) {
      const pattern = patterns[i];
      const match = cleanUrl.match(pattern);
      if (match && match[1]) {
        if (match[1].length === 11) {
          return match[1];
        }
      }
    }
    
    return null;
  };

  const getProjectData = (registration: CompleteRegistration) => {
    return registration.projectData || {
      programId: registration.programId || '',
      projectName: registration.projectName || '',
      category: registration.category || '',
      industry: registration.industry || '',
      description: registration.description || '',
      projectOrigin: registration.projectOrigin || '',
      projectStage: registration.projectStage || '',
      problemDescription: registration.problemDescription || '',
      opportunityValue: registration.opportunityValue || '',
      youtubeUrl: registration.youtubeUrl || ''
    };
  };

  useEffect(() => {
    // Detectar modo oscuro del localStorage (sincronizado con el AdminSidebar)
    const savedDarkMode = localStorage.getItem('adminDarkMode');
    if (savedDarkMode !== null) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    } else {
      // Fallback al modo oscuro del sistema si no hay preferencia guardada
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setIsDarkMode(mediaQuery.matches);
    }
    
    // Listener para cambios en localStorage (cuando se cambia desde AdminSidebar)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'adminDarkMode' && e.newValue !== null) {
        setIsDarkMode(JSON.parse(e.newValue));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Aplicar modo oscuro al documento completo
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#111827'; // bg-gray-900
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#ffffff';
    }
    
    // Cleanup al desmontar el componente
    return () => {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '';
    };
  }, [isDarkMode]);

  useEffect(() => {
    loadRegistrations();
  }, []);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user.role !== 'admin') {
      router.push('/');
    }
  }, [session, status, router]);

  if (status === 'loading' || !session || session.user.role !== 'admin') {
    return <div>Cargando...</div>;
  }

  const loadRegistrations = async () => {
    try {
      // Load incomplete registrations
      const incompleteResponse = await fetch('/api/admin/incomplete-registrations');
      if (incompleteResponse.ok) {
        const incompleteData = await incompleteResponse.json();
        setIncompleteRegistrations(incompleteData);
      }

      // Load complete registrations
      const completeResponse = await fetch('/api/admin/complete-registrations');
      if (completeResponse.ok) {
        const completeData = await completeResponse.json();
        setCompleteRegistrations(completeData);
      }
    } catch (error) {
      console.error('Error loading registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (id: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch('/api/admin/registration-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action })
      });

      if (response.ok) {
        loadRegistrations(); // Reload data
        alert(`Registro ${action === 'approve' ? 'aprobado' : 'rechazado'} exitosamente`);
      }
    } catch (error) {
      console.error('Error processing action:', error);
      alert('Error al procesar la acción');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES');
  };

  const getStepProgress = (currentStep: number) => {
    const steps = ['Programa', 'Datos Generales', 'Impacto y Origen', 'Presentación'];
    return `${currentStep}/4 - ${steps[currentStep - 1] || 'Sin comenzar'}`;
  };

  const openModal = (registration: CompleteRegistration) => {
    setSelectedRegistration(registration);
    setIsModalOpen(true);
    setIframeLoaded(false);
    setIframeError(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRegistration(null);
  };

  const DetailModal = () => {
    if (!selectedRegistration) return null;

    const projectData = getProjectData(selectedRegistration);
    const videoId = extractYouTubeVideoId(projectData.youtubeUrl);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className={`rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className={`sticky top-0 border-b p-6 flex justify-between items-center ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h2 className={`text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Detalles del Registro
            </h2>
            <button
              onClick={closeModal}
              className={`transition-colors ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-white' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Información básica */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className={`font-semibold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Información del Usuario</h3>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>
                  <span className="font-medium">Email:</span> {selectedRegistration.userEmail}
                </p>
                {(selectedRegistration.projectData?.phone || selectedRegistration.phone) && (
                  <p className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>
                    <span className="font-medium">Teléfono:</span> {selectedRegistration.projectData?.phone || selectedRegistration.phone}
                  </p>
                )}
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>
                  <span className="font-medium">Fecha de registro:</span> {formatDate(selectedRegistration.createdAt)}
                </p>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>
                  <span className="font-medium">Estado:</span> 
                  <span className={`ml-1 px-2 py-1 text-xs rounded-full ${
                    selectedRegistration.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    selectedRegistration.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedRegistration.status === 'pending' ? 'Pendiente' :
                     selectedRegistration.status === 'approved' ? 'Aprobado' : 'Rechazado'}
                  </span>
                </p>
              </div>

              <div>
                <h3 className={`font-semibold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Datos del Proyecto</h3>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>
                  <span className="font-medium">Nombre:</span> {projectData.projectName}
                </p>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>
                  <span className="font-medium">Programa:</span> {projectData.programId}
                </p>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>
                  <span className="font-medium">Industria:</span> {projectData.industry}
                </p>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>
                  <span className="font-medium">Categoría:</span> {projectData.category}
                </p>
              </div>
            </div>

            {/* Descripción del proyecto */}
            <div>
              <h3 className={`font-semibold mb-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Descripción del Proyecto</h3>
              <p className={`p-4 rounded-lg ${
                isDarkMode 
                  ? 'text-gray-300 bg-gray-700' 
                  : 'text-gray-700 bg-gray-50'
              }`}>{projectData.description}</p>
            </div>

            {/* Información adicional */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className={`font-semibold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Origen y Etapa</h3>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>
                  <span className="font-medium">Origen del proyecto:</span> {projectData.projectOrigin}
                </p>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>
                  <span className="font-medium">Etapa actual:</span> {projectData.projectStage}
                </p>
              </div>

              <div>
                <h3 className={`font-semibold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Impacto y Valor</h3>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>
                  <span className="font-medium">Valor de oportunidad:</span> {projectData.opportunityValue}
                </p>
              </div>
            </div>

            {/* Descripción del problema */}
            {projectData.problemDescription && (
              <div>
                <h3 className={`font-semibold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Descripción del Problema</h3>
                <p className={`p-4 rounded-lg ${
                  isDarkMode 
                    ? 'text-gray-300 bg-gray-700' 
                    : 'text-gray-700 bg-gray-50'
                }`}>{projectData.problemDescription}</p>
              </div>
            )}

            {/* Video de YouTube */}
            {projectData.youtubeUrl && (
              <div>
                <h3 className={`font-semibold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Video de Presentación</h3>
                <div className="space-y-3">
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>URL: {projectData.youtubeUrl}</p>
                  
                  {videoId ? (
                    <div>
                      <div className="aspect-video w-full rounded-lg overflow-hidden bg-black shadow-lg relative">
                        {!iframeLoaded && (
                          <div className={`absolute inset-0 flex items-center justify-center z-10 ${
                            isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                          }`}>
                            <div className="text-center">
                              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                              <p className={`mt-2 text-sm ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                              }`}>Cargando video...</p>
                            </div>
                          </div>
                        )}
                        
                        <iframe
                          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0`}
                          title="Video de presentación"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="w-full h-full"
                          onLoad={() => setIframeLoaded(true)}
                          onError={() => setIframeError(true)}
                        ></iframe>
                      </div>
                      
                      <div className={`mt-3 p-3 rounded-lg ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                      }`}>
                        <div className="flex items-center gap-3">
                          <Image
                            src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                            alt="Thumbnail del video"
                            width={80}
                            height={60}
                            className="rounded object-cover"
                          />
                          <div>
                            <p className={`text-sm font-medium ${
                              isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>Video ID: {videoId}</p>
                            <a
                              href={`https://www.youtube.com/watch?v=${videoId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800 underline"
                            >
                              Ver en YouTube
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={`p-4 border rounded-lg ${
                      isDarkMode 
                        ? 'bg-yellow-900/20 border-yellow-700 text-yellow-300' 
                        : 'bg-yellow-50 border-yellow-200 text-yellow-800'
                    }`}>
                      <p className="text-sm">URL de video no válida o no reconocida</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Botones de acción */}
            {activeTab === 'pending' && (
              <div className={`flex gap-3 pt-4 border-t ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <button
                  onClick={() => {
                    handleApproval(selectedRegistration.id, 'approve');
                    closeModal();
                  }}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Aprobar Registro
                </button>
                <button
                  onClick={() => {
                    handleApproval(selectedRegistration.id, 'reject');
                    closeModal();
                  }}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Rechazar Registro
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const filteredCompleteRegistrations = completeRegistrations.filter(reg => {
    if (activeTab === 'pending') return reg.status === 'pending';
    if (activeTab === 'approved') return reg.status === 'approved';
    if (activeTab === 'rejected') return reg.status === 'rejected';
    return false;
  });

  if (loading) {
    return (
      <div className={`min-h-screen w-full ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}>
        <div className="max-w-6xl mx-auto p-6">
          <div className="text-center">Cargando registros...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen w-full ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
    }`}>
      <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className={`text-3xl font-bold ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>Panel de Solicitudes de Registro</h1>
        <p className={`mt-2 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>Gestiona todas las solicitudes de registro según el plan de postulación</p>
      </div>
      
      {/* Tabs */}
      <div className="flex space-x-1 mb-6">
        {[
          { key: 'incomplete', label: 'Incompletos', count: incompleteRegistrations.length },
          { key: 'pending', label: 'Pendientes', count: completeRegistrations.filter(r => r.status === 'pending').length },
          { key: 'approved', label: 'Aprobados', count: completeRegistrations.filter(r => r.status === 'approved').length },
          { key: 'rejected', label: 'Rechazados', count: completeRegistrations.filter(r => r.status === 'rejected').length }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-blue-500 text-white'
                : isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Content */}
      <div className={`rounded-lg shadow ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        {activeTab === 'incomplete' && (
          <div className="p-6">
            <h2 className={`text-xl font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>Registros Incompletos</h2>
            {incompleteRegistrations.length === 0 ? (
              <div className="text-center py-8">
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                  No hay registros incompletos en este momento
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {incompleteRegistrations.map((registration) => (
                  <div key={registration.id} className={`border rounded-lg p-4 ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className={`font-semibold ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {registration.projectData.projectName || 'Sin nombre de proyecto'}
                        </h3>
                        <p className={`text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>{registration.userEmail}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-500'
                        }`}>
                          Progreso: {getStepProgress(registration.currentStep)}
                        </div>
                        <div className={`text-xs ${
                          isDarkMode ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          Actualizado: {formatDate(registration.updatedAt)}
                        </div>
                      </div>
                    </div>
                    
                    <div className={`grid grid-cols-2 gap-4 text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>
                      <div>
                        <span className="font-medium">Programa:</span> {registration.projectData.programId || 'No seleccionado'}
                      </div>
                      <div>
                        <span className="font-medium">Industria:</span> {registration.projectData.industry || 'No especificada'}
                      </div>
                    </div>
                    
                    {registration.projectData.description && (
                      <div className="mt-2">
                        <span className={`font-medium text-sm ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-900'
                        }`}>Descripción:</span>
                        <p className={`text-sm mt-1 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-700'
                        }`}>{registration.projectData.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab !== 'incomplete' && (
          <div className="p-6">
            <h2 className={`text-xl font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Registros {activeTab === 'pending' ? 'Pendientes' : activeTab === 'approved' ? 'Aprobados' : 'Rechazados'}
            </h2>
            {filteredCompleteRegistrations.length === 0 ? (
              <div className="text-center py-8">
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                  No hay registros {activeTab === 'pending' ? 'pendientes' : activeTab === 'approved' ? 'aprobados' : 'rechazados'} en este momento
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCompleteRegistrations.map((registration) => {
                  const projectData = getProjectData(registration);
                  return (
                    <div key={registration.id} className={`border rounded-lg p-4 ${
                      isDarkMode ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className={`font-semibold ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {projectData.projectName}
                          </h3>
                          <p className={`text-sm ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>{registration.userEmail}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-600">
                            Completo (4/4)
                          </div>
                          <div className={`text-xs ${
                            isDarkMode ? 'text-gray-500' : 'text-gray-400'
                          }`}>
                            Enviado: {formatDate(registration.createdAt)}
                          </div>
                        </div>
                      </div>
                      
                      <div className={`grid grid-cols-2 gap-4 text-sm mb-3 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-900'
                      }`}>
                        <div>
                          <span className="font-medium">Programa:</span> {projectData.programId}
                        </div>
                        <div>
                          <span className="font-medium">Industria:</span> {projectData.industry}
                        </div>
                      </div>
                      
                      <p className={`text-sm mb-3 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-700'
                      }`}>{projectData.description}</p>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => openModal(registration)}
                          className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          Ver Detalles
                        </button>
                        
                        {activeTab === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApproval(registration.id, 'approve')}
                              className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                            >
                              Aprobar
                            </button>
                            <button
                              onClick={() => handleApproval(registration.id, 'reject')}
                              className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                            >
                              Rechazar
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de detalles */}
      {isModalOpen && <DetailModal />}
      </div>
    </div>
  );
}
