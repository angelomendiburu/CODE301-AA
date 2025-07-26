import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../../auth/[...nextauth]/options';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Verificar que el usuario es admin
    const adminUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true }
    });

    if (adminUser?.role !== 'admin') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    // Obtener solo usuarios (no administradores)
    const users = await prisma.user.findMany({
      where: {
        role: 'user' // Solo usuarios, no administradores
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        _count: {
          select: {
            observations: true
          }
        }
      }
    });

    // Definir la interfaz para el objeto de usuario
    interface User {
      id: string;
      name: string | null;
      email: string | null;
      image: string | null;
      role: string;
      _count: {
        observations: number;
      };
    }

    // Agregar status simulado y fecha de creación simulada para cada usuario
    const usersWithStatus = users.map((user: User) => ({
      ...user,
      status: 'active' as const, // Por ahora todos están activos
      createdAt: new Date().toISOString() // Fecha simulada
    }));

    return NextResponse.json({ users: usersWithStatus });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
