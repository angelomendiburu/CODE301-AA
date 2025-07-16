"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminMetrics() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.role !== "admin") {
      router.push("/");
    }
  }, [session, router]);

  return (
    <div className="min-h-screen bg-[#F2F3F5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Panel de Administración
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Métricas y estadísticas de Start UPC
          </p>
        </div>

        <div className="mt-10">
          <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Métricas Generales</h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              {/* Aquí irán las métricas */}
              <p className="text-gray-500">Panel de métricas en construcción...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
