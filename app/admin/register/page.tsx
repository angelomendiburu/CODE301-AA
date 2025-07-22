'use client';

export default function AdminRegisterPage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Panel de Solicitudes de Registro</h1>
        <p className="text-gray-600 mt-2">Gestiona todas las solicitudes de registro según el plan de postulación</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Solicitudes Pendientes</h2>
          <p className="text-gray-600">Solicitudes en espera de evaluación</p>
        </div>
        
        <div className="text-center text-gray-500 py-8">
          <p>No hay solicitudes pendientes en este momento</p>
        </div>
      </div>
    </div>
  );
}
