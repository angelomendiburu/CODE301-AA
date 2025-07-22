'use client';

export default function AdminRegisterIncompletePage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Registros Incompletos</h1>
        <p className="text-gray-600 mt-2">Gestiona registros que necesitan información adicional</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Solicitudes Incompletas</h2>
          <p className="text-gray-600">Solicitudes que requieren más información del usuario</p>
        </div>
        
        <div className="text-center text-gray-500 py-8">
          <p>No hay registros incompletos en este momento</p>
        </div>
      </div>
    </div>
  );
}
