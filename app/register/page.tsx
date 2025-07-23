'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Program {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  color: string;
  icon: string;
}

interface ProjectData {
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
}

const programs: Program[] = [
  {
    id: 'incubalab',
    name: 'Incubalab',
    description: 'Programa de incubación integral para convertir ideas en proyectos viables',
    isEnabled: true,
    color: 'from-purple-500 to-pink-500',
    icon: '🚀'
  },
  {
    id: 'idea-feedback',
    name: 'Idea Feedback',
    description: 'Recibe retroalimentación especializada para validar y mejorar tu idea de negocio',
    isEnabled: true,
    color: 'from-blue-500 to-cyan-500',
    icon: '💡'
  },
  {
    id: 'aceleracion',
    name: 'Aceleración',
    description: 'Acelera el crecimiento de tu startup con mentoría y acceso a inversores',
    isEnabled: true,
    color: 'from-green-500 to-teal-500',
    icon: '⚡'
  }
];

const industries = [
  'Ambiental', 'Agricultura', 'Biotecnología', 'Comunicaciones',
  'Comida y bebida', 'Construcción', 'Consultoría', 'Cuidado de la salud',
  'Educación', 'Electrónica', 'Energía', 'Entretenimiento',
  'Finanzas', 'Hardware', 'Logística', 'Marketing',
  'Medios', 'Retail', 'Software', 'Tecnología',
  'Telecomunicaciones', 'Transporte', 'Turismo', 'Otro'
];

export default function RegisterPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [projectData, setProjectData] = useState<ProjectData>({
    programId: '',
    projectName: '',
    category: '',
    industry: '',
    description: '',
    projectOrigin: '',
    projectStage: '',
    problemDescription: '',
    opportunityValue: '',
    youtubeUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [autoSaveMessage, setAutoSaveMessage] = useState('');

  // Estados para el iframe
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  // Auto-save function
  const saveProgress = async () => {
    if (!session?.user?.email || currentStep === 1) return;
    
    try {
      const response = await fetch('/api/save-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectData,
          currentStep,
          userEmail: session.user.email
        }),
      });

      if (response.ok) {
        setAutoSaveMessage('Progreso guardado automáticamente');
        setTimeout(() => setAutoSaveMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  // Auto-save effect - save every 30 seconds when data changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!session?.user?.email || currentStep === 1) return;
      
      // Direct auto-save without calling external function
      const autoSave = async () => {
        try {
          const response = await fetch('/api/save-progress', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              projectData,
              currentStep,
              userEmail: session.user.email
            }),
          });

          if (response.ok) {
            setAutoSaveMessage('Progreso guardado automáticamente');
            setTimeout(() => setAutoSaveMessage(''), 3000);
          }
        } catch (error) {
          console.error('Error saving progress:', error);
        }
      };

      autoSave();
    }, 30000);

    return () => clearTimeout(timer);
  }, [projectData, currentStep, session]);

  // Save progress when moving to next step
  const handleNextWithSave = async () => {
    await saveProgress();
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Load dark mode preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('adminDarkMode');
    if (savedDarkMode !== null) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // Redirect admin users
  useEffect(() => {
    if (session && session.user?.email === 'angelomendiburu@gmail.com') {
      router.push('/admin/metrics');
      return;
    }
  }, [session, router]);

  const extractYouTubeVideoId = (url: string) => {
    if (!url || typeof url !== 'string') {
      return null;
    }
    
    // Limpiar la URL de espacios y caracteres extraños
    const cleanUrl = url.trim();
    
    // Varios patrones para diferentes formatos de URL de YouTube
    const patterns = [
      // youtube.com/watch?v=VIDEO_ID (más específico)
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?(?:.*&)?v=([a-zA-Z0-9_-]{11})(?:&.*)?$/,
      // youtu.be/VIDEO_ID
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})(?:\?.*)?$/,
      // youtube.com/embed/VIDEO_ID
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})(?:\?.*)?$/,
      // youtube.com/v/VIDEO_ID
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]{11})(?:\?.*)?$/,
      // Patrón más específico para v=
      /[?&]v=([a-zA-Z0-9_-]{11})(?:[&\s].*)?$/,
      // Patrón más general como fallback
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    ];
    
    for (let i = 0; i < patterns.length; i++) {
      const pattern = patterns[i];
      const match = cleanUrl.match(pattern);
      if (match && match[1]) {
        // Verificar que el video ID tenga exactamente 11 caracteres
        if (match[1].length === 11) {
          return match[1];
        }
      }
    }
    
    return null;
  };

  const handleProgramSelect = (program: Program) => {
    if (!program.isEnabled) return;
    setSelectedProgram(program);
    setProjectData(prev => ({ ...prev, programId: program.id }));
    setCurrentStep(2);
  };

  const handleNextStep = () => {
    // Save progress before moving to next step
    handleNextWithSave();
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/register-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectData,
          userEmail: session?.user?.email || 'anonymous'
        }),
      });

      if (response.ok) {
        const result = await response.json();
        // Redirect to pending-approval page after successful complete registration
        router.push('/pending-approval');
      } else {
        const error = await response.json();
        alert(error.message || 'Error al registrar el proyecto');
      }
    } catch (error) {
      console.error('Error submitting project:', error);
      alert('Error al enviar el formulario');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[
        { number: 1, title: 'Selección de\nPrograma' },
        { number: 2, title: 'Datos\nGenerales' },
        { number: 3, title: 'Impacto y\nOrigen' },
        { number: 4, title: 'Presentación' }
      ].map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
              step.number <= currentStep
                ? 'bg-gradient-to-r from-[#D000FF] to-[#FF8C00] text-white shadow-lg'
                : isDarkMode
                  ? 'bg-gray-700 text-gray-400 border-2 border-gray-600'
                  : 'bg-white text-gray-500 border-2 border-gray-300'
            }`}>
              {step.number <= currentStep ? (
                step.number === currentStep ? step.number : '✓'
              ) : (
                step.number
              )}
            </div>
            <div className={`mt-2 text-xs text-center leading-tight ${
              step.number <= currentStep
                ? isDarkMode ? 'text-white' : 'text-gray-900'
                : isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {step.title}
            </div>
          </div>
          {index < 3 && (
            <div className={`w-16 h-1 mx-4 transition-all ${
              step.number < currentStep
                ? 'bg-gradient-to-r from-[#D000FF] to-[#FF8C00]'
                : isDarkMode
                  ? 'bg-gray-700'
                  : 'bg-gray-300'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Selecciona tu Programa
        </h2>
        <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Elige el programa que mejor se adapte a tu proyecto o idea de negocio
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {programs.map((program) => (
          <div
            key={program.id}
            onClick={() => handleProgramSelect(program)}
            className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
              program.isEnabled
                ? `cursor-pointer hover:shadow-xl hover:scale-105 ${
                    isDarkMode
                      ? 'border-gray-600 bg-gray-800 hover:border-purple-500'
                      : 'border-gray-200 bg-white hover:border-purple-500 shadow-sm'
                  }`
                : `opacity-50 cursor-not-allowed ${
                    isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
                  }`
            }`}
          >
            {!program.isEnabled && (
              <div className="absolute inset-0 bg-black bg-opacity-20 rounded-xl flex items-center justify-center z-10">
                <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Próximamente
                </span>
              </div>
            )}
            
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${program.color} flex items-center justify-center text-2xl shadow-lg`}>
                {program.icon}
              </div>
              <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {program.name}
              </h3>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                {program.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Datos Generales
        </h2>
        <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Información básica sobre tu proyecto o emprendimiento. Incluye el nombre, categoría, industria y descripción detallada.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Nombre del proyecto *
          </label>
          <input
            type="text"
            value={projectData.projectName}
            onChange={(e) => setProjectData(prev => ({ ...prev, projectName: e.target.value }))}
            className={`w-full p-4 rounded-lg border transition-colors ${
              isDarkMode
                ? 'bg-gray-800 border-gray-600 text-white focus:border-purple-500'
                : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
            } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
            placeholder="Ingresa el nombre de tu proyecto"
            required
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Selecciona la industria *
          </label>
          <select
            value={projectData.industry}
            onChange={(e) => setProjectData(prev => ({ ...prev, industry: e.target.value }))}
            className={`w-full p-4 rounded-lg border transition-colors ${
              isDarkMode
                ? 'bg-gray-800 border-gray-600 text-white focus:border-purple-500'
                : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
            } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
            required
          >
            <option value="">Selecciona una industria</option>
            {industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Descripción del proyecto *
          </label>
          <textarea
            value={projectData.description}
            onChange={(e) => setProjectData(prev => ({ ...prev, description: e.target.value }))}
            rows={5}
            className={`w-full p-4 rounded-lg border transition-colors ${
              isDarkMode
                ? 'bg-gray-800 border-gray-600 text-white focus:border-purple-500'
                : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
            } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
            placeholder="Describe tu proyecto en detalle..."
            required
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            onClick={handlePrevStep}
            className={`px-6 py-3 rounded-lg transition-colors ${
              isDarkMode
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Anterior
          </button>
          <button
            onClick={handleNextStep}
            disabled={!projectData.projectName || !projectData.industry || !projectData.description}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-[#D000FF] to-[#FF8C00] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Impacto y Origen
        </h2>
        <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Cuéntanos sobre el origen de tu proyecto, el problema que resuelve, tu cliente objetivo y el impacto que esperas generar.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            El proyecto proviene de: *
          </label>
          <div className="space-y-3">
            {[
              { value: 'curso', label: 'Proyecto de un curso' },
              { value: 'tesis', label: 'Proyecto de tesis' },
              { value: 'idea', label: 'Idea de emprendimiento' },
              { value: 'incubalab', label: 'Incubalab' }
            ].map((option) => (
              <label key={option.value} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <input
                  type="radio"
                  name="projectOrigin"
                  value={option.value}
                  checked={projectData.projectOrigin === option.value}
                  onChange={(e) => setProjectData(prev => ({ ...prev, projectOrigin: e.target.value }))}
                  className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                />
                <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            ¿En qué etapa se encuentra el proyecto? *
          </label>
          <div className="space-y-3">
            {[
              { value: 'idea', label: 'Idea de negocio' },
              { value: 'mvp', label: 'MVP (Prototipo mínimo viable)' }
            ].map((option) => (
              <label key={option.value} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <input
                  type="radio"
                  name="projectStage"
                  value={option.value}
                  checked={projectData.projectStage === option.value}
                  onChange={(e) => setProjectData(prev => ({ ...prev, projectStage: e.target.value }))}
                  className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                />
                <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            ¿Cuál es el problema u oportunidad que tu proyecto resuelve? *
          </label>
          <textarea
            value={projectData.problemDescription}
            onChange={(e) => setProjectData(prev => ({ ...prev, problemDescription: e.target.value }))}
            rows={4}
            className={`w-full p-4 rounded-lg border transition-colors ${
              isDarkMode
                ? 'bg-gray-800 border-gray-600 text-white focus:border-purple-500'
                : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
            } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
            placeholder="Explique el problema o oportunidad que su proyecto resuelve"
            required
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            ¿Por qué es valiosa la oportunidad? *
          </label>
          <textarea
            value={projectData.opportunityValue}
            onChange={(e) => setProjectData(prev => ({ ...prev, opportunityValue: e.target.value }))}
            rows={4}
            className={`w-full p-4 rounded-lg border transition-colors ${
              isDarkMode
                ? 'bg-gray-800 border-gray-600 text-white focus:border-purple-500'
                : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
            } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
            placeholder="Explique el valor y potencial de su oportunidad"
            required
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            onClick={handlePrevStep}
            className={`px-6 py-3 rounded-lg transition-colors ${
              isDarkMode
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Anterior
          </button>
          <button
            onClick={handleNextStep}
            disabled={!projectData.projectOrigin || !projectData.projectStage || !projectData.problemDescription || !projectData.opportunityValue}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-[#D000FF] to-[#FF8C00] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => {
    const videoId = extractYouTubeVideoId(projectData.youtubeUrl);
    
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Video de Presentación
          </h2>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Agrega un video de YouTube para presentar tu proyecto (opcional)
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              URL del video de YouTube
            </label>
            <input
              type="url"
              value={projectData.youtubeUrl}
              onChange={(e) => {
                setProjectData(prev => ({ ...prev, youtubeUrl: e.target.value }));
                setIframeLoaded(false);
                setIframeError(false);
              }}
              className={`w-full p-4 rounded-lg border transition-colors ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-600 text-white focus:border-purple-500'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
              } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
              placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ o https://youtu.be/dQw4w9WgXcQ"
            />
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Formatos soportados: youtube.com/watch?v=, youtu.be/, youtube.com/embed/
            </p>
          </div>

          {/* Video preview */}
          {videoId ? (
            <div className="space-y-3">
              <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Vista previa del video:
              </div>
              
              {iframeError ? (
                <div className="aspect-video w-full rounded-lg overflow-hidden bg-red-50 border border-red-200 flex items-center justify-center">
                  <div className="text-center text-red-600">
                    <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm font-medium">Error al cargar el video</p>
                    <p className="text-xs mt-1">El video podría no estar disponible o ser privado</p>
                    <a
                      href={`https://www.youtube.com/watch?v=${videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
                    >
                      Ver en YouTube
                    </a>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Método 1: iframe estándar de YouTube */}
                  <div className="aspect-video w-full rounded-lg overflow-hidden bg-black shadow-lg relative">
                    {!iframeLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                        <div className="text-center">
                          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                          <p className="mt-2 text-sm text-gray-600">Cargando video...</p>
                        </div>
                      </div>
                    )}
                    
                    {iframeError && (
                      <div className="absolute inset-0 bg-yellow-50 border border-yellow-200 flex items-center justify-center z-10">
                        <div className="text-center text-yellow-800">
                          <svg className="mx-auto h-8 w-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          <p className="text-xs font-medium">Video bloqueado</p>
                          <p className="text-xs">Posible bloqueador de anuncios</p>
                        </div>
                      </div>
                    )}
                    
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0&disablekb=1`}
                      title="Video de presentación"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full"
                      onLoad={() => {
                        setIframeLoaded(true);
                        
                        // Verificar después de más tiempo si el contenido está disponible
                        setTimeout(() => {
                          const iframe = document.querySelector('iframe') as HTMLIFrameElement;
                          if (iframe) {
                            try {
                              // Intentar acceder al contenido del iframe
                              const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                              if (!iframeDoc || iframeDoc.body?.innerHTML.trim() === '') {
                                setIframeError(true);
                              }
                            } catch (e) {
                              // Error de CORS es normal para YouTube - significa que sí hay contenido
                            }
                          }
                        }, 5000); // Esperar 5 segundos
                      }}
                      onError={() => {
                        setIframeError(true);
                      }}
                    ></iframe>
                  </div>
                  
                  {/* Fallback: Thumbnail de YouTube con enlace */}
                  <div className={`p-4 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-600' 
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center gap-4">
                      <Image
                        src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                        alt="Thumbnail del video"
                        width={80}
                        height={60}
                        className="rounded object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          Video de YouTube detectado
                        </p>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          ID del video: {videoId}
                        </p>
                        {iframeError && (
                          <div className="mt-2 p-2 bg-yellow-100 border border-yellow-300 rounded text-xs text-yellow-800">
                            <p className="font-medium">⚠️ Problema detectado:</p>
                            <p>El iframe se bloquea, posiblemente por:</p>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                              <li>Bloqueador de anuncios (AdBlock, uBlock, etc.)</li>
                              <li>Configuración de privacidad del navegador</li>
                              <li>Extensiones que bloquean contenido</li>
                            </ul>
                          </div>
                        )}
                        <a
                          href={`https://www.youtube.com/watch?v=${videoId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
                        >
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.148.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd"/>
                          </svg>
                          Ver en YouTube
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Video ID: {videoId}
              </p>
              
              {/* Botones de control */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => {
                    setIframeError(false);
                    setIframeLoaded(false);
                    // Forzar recarga del iframe
                    const iframe = document.querySelector('iframe');
                    if (iframe) {
                      const currentSrc = iframe.src;
                      iframe.src = '';
                      setTimeout(() => {
                        iframe.src = currentSrc;
                      }, 100);
                    }
                  }}
                  className={`text-xs px-3 py-1 rounded ${
                    isDarkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  } transition-colors`}
                >
                  🔄 Recargar video
                </button>
                
                <button
                  onClick={() => {
                    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
                  }}
                  className={`text-xs px-3 py-1 rounded ${
                    isDarkMode 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-red-500 text-white hover:bg-red-600'
                  } transition-colors`}
                >
                  📺 Abrir en YouTube
                </button>
                
                {iframeError && (
                  <div className="w-full mt-2 p-2 bg-orange-100 border border-orange-300 rounded text-xs">
                    <p className="font-medium text-orange-800">💡 Solución sugerida:</p>
                    <p className="text-orange-700 mt-1">
                      Para ver el video embebido, deshabilita temporalmente tu bloqueador de anuncios 
                      (AdBlock, uBlock Origin, etc.) para este sitio y recarga la página.
                    </p>
                    <p className="text-orange-600 mt-1">
                      O usa el botón &quot;📺 Abrir en YouTube&quot; para ver el video en una nueva pestaña.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : projectData.youtubeUrl ? (
            <div className={`aspect-video w-full rounded-lg border-2 border-dashed flex items-center justify-center ${
              isDarkMode 
                ? 'border-gray-600 bg-gray-800 text-gray-400' 
                : 'border-gray-300 bg-gray-50 text-gray-500'
            }`}>
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <p className="text-sm">Esperando URL válida de YouTube...</p>
              </div>
            </div>
          ) : (
            <div className={`aspect-video w-full rounded-lg border-2 border-dashed flex items-center justify-center ${
              isDarkMode 
                ? 'border-gray-600 bg-gray-800 text-gray-400' 
                : 'border-gray-300 bg-gray-50 text-gray-500'
            }`}>
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <p className="text-sm">Ingresa una URL de YouTube para ver la vista previa</p>
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              onClick={handlePrevStep}
              className={`px-6 py-3 rounded-lg transition-colors ${
                isDarkMode
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Anterior
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#D000FF] to-[#FF8C00] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Registrando...
                </div>
              ) : (
                'Completar Registro'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-slate-50'}`}>
      {/* Header */}
      <div className={`shadow-sm border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-full overflow-hidden flex items-center justify-center shadow-lg ${
                isDarkMode ? 'bg-black ring-2 ring-white/20' : 'bg-white ring-2 ring-black/20'
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
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Formulario de Proyecto</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {autoSaveMessage && (
                <div className="text-xs text-green-600 font-medium flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {autoSaveMessage}
                </div>
              )}
              
              {selectedProgram && (
                <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Programa: <span className="font-medium text-purple-600">{selectedProgram.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Header */}
      <div className={`border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="text-center">
            <h1 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Formulario de Proyecto
            </h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Complete todos los pasos para registrar su proyecto
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {renderStepIndicator()}
        
        <div className="mb-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </div>
      </div>
    </div>
  );
}