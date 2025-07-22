'use client';
import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AvatarImage from '@/components/AvatarImage';

interface UserMetrics {
  id: string;
  name: string;
  email: string;
  image?: string;
  totalMetrics: number;
  totalSales: number;
  totalExpenses: number;
  chartData: {
    day: string;
    sales: number;
    expenses: number;
  }[];
}

export default function AdminMetrics() {
  const { data: session } = useSession();
  const router = useRouter();
  const [usersMetrics, setUsersMetrics] = useState<UserMetrics[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Load dark mode preference from localStorage on mount
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

  // Verificar que es admin
  useEffect(() => {
    if (session && session.user?.email !== 'angelomendiburu@gmail.com') {
      router.push('/mi-proyecto');
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

  // Cargar métricas de usuarios
  useEffect(() => {
    if (session && session.user?.email === 'angelomendiburu@gmail.com') {
      loadUsersMetrics();
    }
  }, [session]);

  const loadUsersMetrics = async () => {
    try {
      setIsLoadingUsers(true);
      const response = await fetch('/api/admin/metrics');
      if (response.ok) {
        const data = await response.json();
        setUsersMetrics(data);
      } else {
        console.error('Error loading metrics:', response.status);
      }
    } catch (error) {
      console.error('Error loading metrics:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  if (!session || session.user?.email !== 'angelomendiburu@gmail.com') {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-slate-50'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header simplificado con usuario */}
        <div className={`flex justify-between items-center mb-6 rounded-lg p-4 shadow-sm ${
          isDarkMode 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-white border-l-4 border-l-gradient-to-r border-l-emerald-500 shadow-lg bg-gradient-to-r from-emerald-50/30 to-teal-50/30'
        }`}>
          <div>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Métricas</h1>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Dashboard de empresas y métricas generales</p>
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

        {/* Header Gradient */}
        <div className="relative overflow-hidden rounded-lg shadow-lg mb-6">
          {/* Base gradient layer - subtle colors */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-700 via-gray-700 via-slate-600 to-gray-600 soft-pulse"></div>
          
          {/* Animated color layer - very subtle */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-teal-500/15 via-cyan-600/20 to-slate-700/25 subtle-animated-header"></div>
          
          {/* Floating overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent gentle-overlay"></div>
          
          <div className="relative p-6 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white drop-shadow-lg">Panel de Métricas</h2>
                <p className="text-gray-200 mt-1 drop-shadow-md">Gestiona y supervisa todas las métricas del sistema</p>
              </div>
              <div className="text-gray-200 drop-shadow-md">
                Total: {usersMetrics.length} empresas
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos generales - Siempre visibles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Total de Ventas */}
          <div className={`flex min-w-72 flex-1 flex-col gap-2 rounded-xl border p-6 shadow-lg ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-[#D000FF]/20'
          }`}>
            <p className={`text-base font-medium leading-normal ${isDarkMode ? 'text-white' : 'text-[#141414]'}`}>Total Ventas</p>
            <p className={`tracking-light text-[32px] font-bold leading-tight truncate ${
              isDarkMode 
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#D000FF] to-[#FF8C00]' 
                : 'text-[#141414]'
            }`}>
              ${usersMetrics.reduce((total, user) => total + user.totalSales, 0).toLocaleString()}
            </p>
            <div className="flex gap-1">
              <p className={`text-base font-normal leading-normal ${isDarkMode ? 'text-gray-400' : 'text-neutral-500'}`}>Ventas registradas</p>
              <p className={`text-base font-medium leading-normal ${
                isDarkMode ? 'text-green-400' : 'text-[#078807]'
              }`}>
                +${usersMetrics.reduce((total, user) => total + user.totalSales, 0).toLocaleString()}
              </p>
            </div>
            <div className="flex min-h-[180px] items-end justify-between gap-2 px-3">
              {usersMetrics.length > 0 ? usersMetrics.filter(user => user.totalSales > 0).slice(0, 7).map((user, idx) => {
                const maxSales = Math.max(...usersMetrics.map(u => u.totalSales), 1);
                const height = Math.max((user.totalSales / maxSales) * 100, 5);
                return (
                  <div key={user.id} className="flex flex-col items-center gap-2 flex-1 h-full">
                    <div className="flex flex-col justify-end h-full w-full">
                      <div 
                        className={`w-full rounded-t-sm ${
                          isDarkMode 
                            ? 'bg-gradient-to-t from-[#FF007B] to-[#FF6A00]' 
                            : 'bg-blue-500'
                        }`}
                        style={{ height: `${height}%` }}
                        title={`${user.name}: $${user.totalSales.toLocaleString()}`}
                      ></div>
                    </div>
                    <p className={`text-[10px] font-bold leading-normal tracking-[0.015em] truncate w-full text-center ${
                      isDarkMode ? 'text-gray-400' : 'text-neutral-500'
                    }`}>
                      {user.name.split(' ')[0]}
                    </p>
                  </div>
                );
              }) : (
                <div className={`w-full flex items-center justify-center text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-neutral-500'
                }`}>
                  No hay datos de ventas disponibles
                </div>
              )}
            </div>
          </div>

          {/* Total de Métricas */}
          <div className={`flex min-w-72 flex-1 flex-col gap-2 rounded-xl border p-6 shadow-lg ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-[#FF007B]/20'
          }`}>
            <p className={`text-base font-medium leading-normal ${isDarkMode ? 'text-white' : 'text-[#141414]'}`}>Total Métricas</p>
            <p className={`tracking-light text-[32px] font-bold leading-tight truncate ${
              isDarkMode 
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#FF2D55] to-[#FF8C00]' 
                : 'text-[#141414]'
            }`}>
              {usersMetrics.reduce((total, user) => total + user.totalMetrics, 0)}
            </p>
            <div className="flex gap-1">
              <p className={`text-base font-normal leading-normal ${isDarkMode ? 'text-gray-400' : 'text-neutral-500'}`}>Métricas registradas</p>
              <p className={`text-base font-medium leading-normal ${
                isDarkMode ? 'text-green-400' : 'text-[#078807]'
              }`}>
                +{usersMetrics.reduce((total, user) => total + user.totalMetrics, 0)}
              </p>
            </div>
            <div className="flex min-h-[180px] items-end justify-between gap-2 px-3">
              {usersMetrics.length > 0 ? usersMetrics.filter(user => user.totalMetrics > 0).slice(0, 7).map((user, idx) => {
                const maxMetrics = Math.max(...usersMetrics.map(u => u.totalMetrics), 1);
                const height = Math.max((user.totalMetrics / maxMetrics) * 100, 5);
                return (
                  <div key={user.id} className="flex flex-col items-center gap-2 flex-1 h-full">
                    <div className="flex flex-col justify-end h-full w-full">
                      <div 
                        className={`w-full rounded-t-sm ${
                          isDarkMode 
                            ? 'bg-gradient-to-t from-[#D000FF] to-[#FF2D55]' 
                            : 'bg-green-500'
                        }`}
                        style={{ height: `${height}%` }}
                        title={`${user.name}: ${user.totalMetrics} métricas`}
                      ></div>
                    </div>
                    <p className={`text-[10px] font-bold leading-normal tracking-[0.015em] truncate w-full text-center ${
                      isDarkMode ? 'text-gray-400' : 'text-neutral-500'
                    }`}>
                      {user.name.split(' ')[0]}
                    </p>
                  </div>
                );
              }) : (
                <div className={`w-full flex items-center justify-center text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-neutral-500'
                }`}>
                  No hay métricas disponibles
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Vista detallada del usuario - Solo cuando hay uno seleccionado */}
        {selectedUser && (
          <div className={`rounded-xl p-6 mb-6 border ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-[#141414]'}`}>Vista detallada del usuario</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className={`transition-colors ${
                  isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                ✕
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <AvatarImage
                src={selectedUser.image}
                alt={selectedUser.name}
                size={48}
                fallback={selectedUser.name.charAt(0)}
              />
              <div>
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-[#141414]'}`}>{selectedUser.name}</h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-neutral-500'}`}>{selectedUser.email}</p>
                <div className="flex items-center gap-4 mt-2">
                  <a
                    href={`/admin/miproyecto?userId=${selectedUser.id}`}
                    className={`inline-flex items-center gap-2 px-3 py-1 text-white text-xs font-medium rounded-lg transition-colors ${
                      isDarkMode 
                        ? 'bg-gradient-to-r from-[#FF007B] to-[#FF6A00] hover:from-[#FF007B]/80 hover:to-[#FF6A00]/80' 
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Ver como Usuario
                  </a>
                  <a
                    href={`/admin/metrics-documents?userId=${selectedUser.id}`}
                    className={`inline-flex items-center gap-2 px-3 py-1 text-white text-xs font-medium rounded-lg transition-colors ${
                      isDarkMode 
                        ? 'bg-gradient-to-r from-[#FF2D55] to-[#FF8C00] hover:from-[#FF2D55]/80 hover:to-[#FF8C00]/80' 
                        : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Ver Documentos
                  </a>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className={`text-xs transition-colors ${
                      isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-neutral-500 hover:text-neutral-700'
                    }`}
                  >
                    Cerrar vista detallada
                  </button>
                </div>
              </div>
            </div>

            {/* Gráficos del usuario seleccionado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gráfico de evolución de ventas */}
              <div className={`rounded-lg p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h4 className={`font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-[#141414]'}`}>Evolución de Ventas (7 días)</h4>
                <div className="h-32 flex items-end justify-between gap-2">
                  {selectedUser.chartData.map((day, idx) => {
                    const maxValue = Math.max(...selectedUser.chartData.map(d => Math.max(d.sales, d.expenses)), 1);
                    const salesHeight = Math.max((day.sales / maxValue) * 100, 2);
                    const expensesHeight = Math.max((day.expenses / maxValue) * 100, 2);
                    return (
                      <div key={idx} className="flex flex-col items-center gap-1 flex-1">
                        <div className="flex flex-col justify-end w-full h-24 gap-1">
                          <div 
                            className={`w-full rounded-sm ${
                              isDarkMode 
                                ? 'bg-gradient-to-t from-[#FF007B] to-[#FF6A00]' 
                                : 'bg-green-500'
                            }`}
                            style={{ height: `${salesHeight}%` }}
                            title={`Ventas: $${day.sales}`}
                          ></div>
                          <div 
                            className={`w-full rounded-sm ${
                              isDarkMode 
                                ? 'bg-gradient-to-t from-[#FF2D55] to-[#FF8C00]' 
                                : 'bg-red-500'
                            }`}
                            style={{ height: `${expensesHeight}%` }}
                            title={`Gastos: $${day.expenses}`}
                          ></div>
                        </div>
                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-neutral-500'}`}>{day.day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Resumen de métricas */}
              <div className={`rounded-lg p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h4 className={`font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-[#141414]'}`}>Resumen</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-300' : 'text-neutral-600'}>Total Métricas:</span>
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedUser.totalMetrics}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-300' : 'text-neutral-600'}>Ventas Total:</span>
                    <span className={`font-medium ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>${selectedUser.totalSales.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-300' : 'text-neutral-600'}>Gastos Total:</span>
                    <span className={`font-medium ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>${selectedUser.totalExpenses.toLocaleString()}</span>
                  </div>
                  <div className={`flex justify-between pt-2 ${isDarkMode ? 'border-t border-gray-600' : 'border-t'}`}>
                    <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-neutral-600'}`}>Balance:</span>
                    <span className={`font-bold ${
                      selectedUser.totalSales - selectedUser.totalExpenses >= 0 
                        ? isDarkMode ? 'text-green-400' : 'text-green-600'
                        : isDarkMode ? 'text-red-400' : 'text-red-600'
                    }`}>
                      ${(selectedUser.totalSales - selectedUser.totalExpenses).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabla de empresas/usuarios detallada */}
        <div className="mb-8">
          <h2 className={`text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4 ${
            isDarkMode ? 'text-white' : 'text-[#141414]'
          }`}>Dashboard de Empresas</h2>
          {isLoadingUsers ? (
            <div className={`text-center py-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Cargando datos...</div>
          ) : (
            <div className={`rounded-xl border overflow-hidden shadow-lg ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-[#FF2D55]/20'
            }`}>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                    <tr>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        Empresa
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        Progreso
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        Métricas Clave
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDarkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'}`}>
                    {usersMetrics.map((user, index) => {
                      // Calcular progreso basado en actividad y métricas
                      const progressScore = Math.min(Math.max((user.totalMetrics * 10) + (user.totalSales > 0 ? 30 : 0) + (user.totalExpenses > 0 ? 10 : 0), 0), 100);
                      
                      return (
                        <tr 
                          key={user.id} 
                          className={`cursor-pointer transition-colors duration-200 ${
                            isDarkMode 
                              ? `hover:bg-gray-700 hover:shadow-lg ${selectedUser?.id === user.id ? 'bg-gradient-to-r from-[#D000FF]/10 to-[#FF8C00]/10' : ''}` 
                              : `hover:bg-gradient-to-r hover:from-[#FF6A00]/5 hover:to-[#FF8C00]/5 hover:shadow-md ${selectedUser?.id === user.id ? 'bg-gradient-to-r from-[#D000FF]/10 to-[#FF8C00]/10 border-l-2 border-l-[#FF6A00]' : ''}`
                          }`}
                          onClick={() => setSelectedUser(user)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <AvatarImage
                                src={user.image}
                                alt={user.name}
                                size={40}
                                fallback={user.name.charAt(0)}
                              />
                              <div className="ml-4">
                                <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {user.name || `Empresa ${String.fromCharCode(65 + index)}`}
                                </div>
                                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</div>
                              </div>
                            </div>
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <div className={`w-full rounded-full h-2 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                                    <div
                                      className={`h-2 rounded-full transition-all duration-300 ${
                                        isDarkMode 
                                          ? 'bg-gradient-to-r from-[#FF007B] to-[#FF6A00]' 
                                          : 'bg-blue-600'
                                      }`}
                                      style={{ width: `${progressScore}%` }}
                                    ></div>
                                  </div>
                                  <span className={`ml-3 text-sm font-medium min-w-[3rem] ${
                                    isDarkMode ? 'text-white' : 'text-gray-900'
                                  }`}>
                                    {progressScore}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          
                          <td className="px-6 py-4">
                            <div className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              <div className="space-y-1">
                                <div>
                                  <span className="font-medium">Ventas:</span> ${user.totalSales.toLocaleString()}
                                </div>
                                <div>
                                  <span className="font-medium">Gastos:</span> ${user.totalExpenses.toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                
                {usersMetrics.length === 0 && !isLoadingUsers && (
                  <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <svg className={`mx-auto h-12 w-12 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m14 0h-2M6 13h2" />
                    </svg>
                    <h3 className={`mt-2 text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>No hay empresas registradas</h3>
                    <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Cuando los usuarios se registren, aparecerán aquí.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Lista de usuarios en tarjetas */}
        <div className="mb-8">
          <h2 className={`text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4 ${
            isDarkMode ? 'text-white' : 'text-[#141414]'
          }`}>Vista de Tarjetas</h2>
          {isLoadingUsers ? (
            <div className={`text-center py-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Cargando usuarios...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {usersMetrics.map((user) => (
                <div 
                  key={user.id} 
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    selectedUser?.id === user.id 
                      ? isDarkMode 
                        ? 'border-[#FF007B] bg-gradient-to-br from-[#D000FF]/10 to-[#FF8C00]/10' 
                        : 'border-blue-500 bg-blue-50'
                      : isDarkMode 
                        ? 'border-gray-700 bg-gray-800 hover:border-gray-600' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <AvatarImage
                      src={user.image}
                      alt={user.name}
                      size={40}
                      fallback={user.name.charAt(0)}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium truncate ${isDarkMode ? 'text-white' : 'text-[#141414]'}`}>{user.name}</h3>
                      <p className={`text-sm truncate ${isDarkMode ? 'text-gray-400' : 'text-neutral-500'}`}>{user.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-[#141414]'}`}>{user.totalMetrics}</div>
                      <div className={isDarkMode ? 'text-gray-400' : 'text-neutral-500'}>Métricas</div>
                    </div>
                    <div className="text-center">
                      <div className={`font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>${user.totalSales.toLocaleString()}</div>
                      <div className={isDarkMode ? 'text-gray-400' : 'text-neutral-500'}>Ventas</div>
                    </div>
                    <div className="text-center">
                      <div className={`font-bold ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>${user.totalExpenses.toLocaleString()}</div>
                      <div className={isDarkMode ? 'text-gray-400' : 'text-neutral-500'}>Gastos</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
