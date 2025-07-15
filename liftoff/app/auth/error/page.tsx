"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthError() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir a la página principal después de 5 segundos
    const timeout = setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F2F3F5] flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Error de Autenticación
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Hubo un problema al intentar autenticarte. Por favor, intenta nuevamente.
          </p>
          <p className="mt-4 text-sm text-gray-500">
            Serás redirigido a la página principal en 5 segundos...
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1E2B3A] hover:bg-[#0D2247] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E2B3A]"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  );
}
