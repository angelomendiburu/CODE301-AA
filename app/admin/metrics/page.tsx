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
  BarChart,
  Bar,
} from "recharts";

const data = [
  { name: "Ene", "Usuarios": 4000, "Ingresos": 2400 },
  { name: "Feb", "Usuarios": 3000, "Ingresos": 1398 },
  { name: "Mar", "Usuarios": 2000, "Ingresos": 9800 },
  { name: "Abr", "Usuarios": 2780, "Ingresos": 3908 },
  { name: "May", "Usuarios": 1890, "Ingresos": 4800 },
  { name: "Jun", "Usuarios": 2390, "Ingresos": 3800 },
  { name: "Jul", "Usuarios": 3490, "Ingresos": 4300 },
];

export default function AdminMetrics() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-[#F2F3F5] text-[#1E2B3A]">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold leading-tight">
            Panel de Administración
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Usuarios Registrados</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Usuarios" stroke="#1E2B3A" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Ingresos</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Ingresos" fill="#ff2d5b" />
                </BarChart>
              </responsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
