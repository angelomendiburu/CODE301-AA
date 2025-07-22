'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Esperando a que cargue la sesión

    if (!session) {
      // No hay sesión, redirigir al login
      router.push('/');
      return;
    }

    // Determinar redirección basada en el rol del usuario
    if (session.user?.email === 'angelomendiburu@gmail.com') {
      // Usuario admin
      router.push('/admin/metrics');
    } else {
      // Usuario regular
      router.push('/mi-proyecto');
    }
  }, [session, status, router]);

  // Mostrar loading mientras se determina la redirección
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
        <p className="text-lg font-medium">Redirigiendo...</p>
      </div>
    </div>
  );
}
