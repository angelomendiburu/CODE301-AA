'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import Image from 'next/image';

interface IncompleteUser {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  emailVerified: Date | null;
  image: string | null;
  hasMetrics: boolean;
  hasProject: boolean;
  daysSinceCreation: number;
}

export default function AdminRegisterIncompletePage() {
  const [incompleteUsers, setIncompleteUsers] = useState<IncompleteUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);

  useEffect(() => {
    fetchIncompleteUsers();
  }, []);

  const fetchIncompleteUsers = async () => {
    try {
      const response = await fetch('/api/admin/incomplete-users');
      if (response.ok) {
        const data = await response.json();
        setIncompleteUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching incomplete users:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendReminderEmail = async (userId: string, email: string) => {
    setSendingEmail(userId);
    try {
      const response = await fetch('/api/admin/send-reminder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          email,
          type: 'incomplete_registration'
        }),
      });

      if (response.ok) {
        alert('Recordatorio enviado exitosamente');
      } else {
        alert('Error al enviar recordatorio');
      }
    } catch (error) {
      console.error('Error sending reminder:', error);
      alert('Error al enviar recordatorio');
    } finally {
      setSendingEmail(null);
    }
  };

  const openWhatsApp = (phone?: string) => {
    const message = encodeURIComponent(
      '¡Hola! 👋 Notamos que aún no has completado tu registro en StartUPC. Te ayudamos a finalizar tu perfil y acceder a todos los beneficios de nuestra plataforma. ¿Podemos ayudarte?'
    );
    const url = phone 
      ? `https://wa.me/${phone}?text=${message}`
      : `https://wa.me?text=${message}`;
    window.open(url, '_blank');
  };

  const getStatusColor = (user: IncompleteUser) => {
    if (user.daysSinceCreation > 7) return 'text-red-600 bg-red-50';
    if (user.daysSinceCreation > 3) return 'text-yellow-600 bg-yellow-50';
    return 'text-blue-600 bg-blue-50';
  };

  const getStatusText = (user: IncompleteUser) => {
    if (!user.hasProject) return 'Sin proyecto registrado';
    if (!user.hasMetrics) return 'Sin métricas subidas';
    return 'Registro básico incompleto';
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <main className="flex-1 p-8 ml-64">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff2d5b]"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <main className="flex-1 p-8 ml-64">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Registros Incompletos</h1>
          <p className="text-gray-600">
            Usuarios que no han completado todos los pasos de registro o no han subido información completa
          </p>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {incompleteUsers.filter(u => u.daysSinceCreation > 7).length}
                </p>
                <p className="text-gray-600">Más de 7 días</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {incompleteUsers.filter(u => u.daysSinceCreation <= 7 && u.daysSinceCreation > 3).length}
                </p>
                <p className="text-gray-600">3-7 días</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {incompleteUsers.filter(u => u.daysSinceCreation <= 3).length}
                </p>
                <p className="text-gray-600">Recientes (≤3 días)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de usuarios incompletos */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Usuarios con Registros Incompletos ({incompleteUsers.length})
            </h2>
          </div>
          
          {incompleteUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Días desde registro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progreso
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {incompleteUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            {user.image ? (
                              <Image 
                                className="h-10 w-10 rounded-full" 
                                src={user.image} 
                                alt="" 
                                width={40}
                                height={40}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name || 'Sin nombre'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user)}`}>
                          {getStatusText(user)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.daysSinceCreation} días
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className={`h-2 w-2 rounded-full ${user.hasProject ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                          <span className="text-xs text-gray-600">Proyecto</span>
                          <div className={`h-2 w-2 rounded-full ${user.hasMetrics ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                          <span className="text-xs text-gray-600">Métricas</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => user.email && sendReminderEmail(user.id, user.email)}
                          disabled={sendingEmail === user.id}
                          className="text-[#ff2d5b] hover:text-[#ff1f4f] disabled:opacity-50"
                        >
                          {sendingEmail === user.id ? 'Enviando...' : '📧 Email'}
                        </button>
                        <button
                          onClick={() => openWhatsApp()}
                          className="text-green-600 hover:text-green-700"
                        >
                          💬 WhatsApp
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">¡Excelente!</h3>
              <p className="mt-2 text-gray-600">No hay registros incompletos en este momento.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
