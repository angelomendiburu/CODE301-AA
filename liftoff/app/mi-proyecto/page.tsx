"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MiProyecto() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/");
    }
  }, [session, router]);

  return (
    <div className="min-h-screen bg-[#F2F3F5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Mi Proyecto
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Bienvenido a tu área de proyecto en Start UPC
          </p>
        </div>

        <div className="mt-10">
          <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Información del Proyecto</h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              {/* Aquí irá el contenido del proyecto */}
              <p className="text-gray-500">Contenido del proyecto en construcción...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
