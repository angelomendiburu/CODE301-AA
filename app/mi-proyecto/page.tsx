"use client";

import { useSession, signOut } from "next-auth/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Semana 1", "Tareas Completadas": 10 },
  { name: "Semana 2", "Tareas Completadas": 15 },
  { name: "Semana 3", "Tareas Completadas": 12 },
  { name: "Semana 4", "Tareas Completadas": 20 },
];

export default function MiProyecto() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-[#F2F3F5] text-[#1E2B3A]">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold leading-tight">
            Mi Proyecto
          </h1>
          <div className="flex items-center">
            <span className="mr-4">Hola, {session?.user?.name}</span>
            <button
              onClick={() => signOut()}
              className="bg-[#ff2d5b] text-white rounded-lg px-4 py-2 hover:bg-[#ff1f4f] transition-colors duration-75"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Progreso del Proyecto</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Tareas Completadas" stroke="#ff2d5b" activeDot={{ r: 8 }} />
              </LineChart>
            </responsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}
