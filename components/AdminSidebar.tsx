'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AvatarImage from '@/components/AvatarImage';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('adminDarkMode');
    if (savedDarkMode !== null) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }
    
    const savedSidebarCollapsed = localStorage.getItem('adminSidebarCollapsed');
    if (savedSidebarCollapsed !== null) {
      setSidebarCollapsed(JSON.parse(savedSidebarCollapsed));
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('adminDarkMode', JSON.stringify(newDarkMode));
  };

  const toggleSidebarCollapsed = () => {
    const newSidebarCollapsed = !sidebarCollapsed;
    setSidebarCollapsed(newSidebarCollapsed);
    localStorage.setItem('adminSidebarCollapsed', JSON.stringify(newSidebarCollapsed));
  };

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isActive = (path: string) => pathname === path;

  const navItems = [
    {
      href: '/admin/metrics',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v4H8V5z" />
        </svg>
      )
    },
    {
      href: '/admin/users',
      label: 'Usuarios',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      )
    },
    {
      href: '/admin/registrations',
      label: 'Registros',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    },
    {
      href: '/admin/observations',
      label: 'Observaciones',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )
    },
    {
      href: '/admin/activity',
      label: 'Actividad',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      href: '/admin/metrics-documents',
      label: 'Documentos',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  ];

  return (
    <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} shadow-lg transition-all duration-300 ease-in-out ${isDarkMode ? 'bg-gray-800' : 'bg-white'} min-h-screen`}>
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

          {/* Usuario info y cerrar sesión */}
          {session && (
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center gap-3 mb-3">
                <AvatarImage
                  src={session.user?.image}
                  alt={session.user?.name || 'Usuario'}
                  size={32}
                  fallback={session.user?.name?.charAt(0) || 'U'}
                />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {session.user?.name || 'Usuario'}
                  </p>
                  <p className={`text-xs truncate ${isDarkMode ? 'text-white/70' : 'text-gray-600'}`}>
                    {session.user?.email}
                  </p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isDarkMode 
                    ? 'bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30' 
                    : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Cerrar Sesión
              </button>
            </div>
          )}
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
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-lg font-medium text-sm lg:text-base group transition-colors ${
                isActive(item.href)
                  ? (isDarkMode 
                      ? 'bg-gradient-to-r from-[#D000FF]/20 to-[#FF8C00]/20 text-white border border-white/10' 
                      : 'bg-gradient-to-r from-[#D000FF]/10 to-[#FF8C00]/10 text-[#D000FF] border border-[#D000FF]/20 shadow-md')
                  : (isDarkMode 
                      ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                      : 'text-gray-600 hover:bg-gradient-to-r hover:from-[#FF007B]/5 hover:to-[#FF2D55]/5 hover:text-[#FF007B]')
              }`}
              title={sidebarCollapsed ? item.label : ''}
            >
              {item.icon}
              {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
              {sidebarCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50">
                  {item.label}
                </div>
              )}
            </Link>
          ))}
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
  );
}
