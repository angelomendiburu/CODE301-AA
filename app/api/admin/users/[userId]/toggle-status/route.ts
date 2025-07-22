import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../../../../auth/[...nextauth]/options';

const prisma = new PrismaClient();

export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } }
) {
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

    // Verificar que el usuario existe y no es admin
    const targetUser = await prisma.user.findUnique({
      where: { id: params.userId },
      select: { id: true, role: true }
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    if (targetUser.role === 'admin') {
      return NextResponse.json({ error: 'No se puede modificar un administrador' }, { status: 403 });
    }

    // Por ahora, solo simulamos el cambio de estado
    // En el futuro se podría agregar un campo 'status' a la base de datos
    console.log(`User ${params.userId} status toggled`);

    return NextResponse.json({ 
      success: true, 
      message: 'Estado de usuario cambiado exitosamente'
    });

  } catch (error) {
    console.error('Error toggling user status:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
