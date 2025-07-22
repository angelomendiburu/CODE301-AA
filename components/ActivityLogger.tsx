'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';
import { logActivity, ActivityTypes } from '@/utils/activityLogger';

export function ActivityLogger() {
  const { data: session, status } = useSession();
  const isLoggedInRef = useRef(false);
  const hasLoggedLoginRef = useRef(false);

  useEffect(() => {
    // Cuando la sesión cambie
    if (status === 'authenticated' && session && !hasLoggedLoginRef.current) {
      // Usuario se logueó
      logActivity(
        ActivityTypes.LOGIN,
        'Inició sesión en la aplicación',
        {
          loginMethod: 'Google OAuth',
          userAgent: navigator.userAgent,
        }
      );
      isLoggedInRef.current = true;
      hasLoggedLoginRef.current = true;
    } else if (status === 'unauthenticated' && isLoggedInRef.current) {
      // Usuario se deslogueó
      logActivity(
        ActivityTypes.LOGOUT,
        'Cerró sesión en la aplicación'
      );
      isLoggedInRef.current = false;
      hasLoggedLoginRef.current = false;
    }
  }, [status, session]);

  // Registrar logout cuando la página se cierre
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isLoggedInRef.current) {
        // Usar navigator.sendBeacon para enviar datos antes de cerrar
        const data = JSON.stringify({
          action: ActivityTypes.LOGOUT,
          description: 'Cerró sesión al salir de la aplicación',
        });

        navigator.sendBeacon('/api/admin/activity', data);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return null; // Este componente no renderiza nada
}
