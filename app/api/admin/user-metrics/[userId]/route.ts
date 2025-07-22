import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    console.log('admin/user-metrics API - params:', params);
    
    const session = await getServerSession(authOptions)
    console.log('admin/user-metrics API - session:', session?.user?.email);
    
    if (!session || !session.user?.email) {
      console.log('admin/user-metrics API - No session');
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar que el usuario es admin
    const adminUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    })
    
    console.log('admin/user-metrics API - adminUser:', adminUser?.email, adminUser?.role);

    if (!adminUser || adminUser.role !== 'admin') {
      console.log('admin/user-metrics API - Not admin');
      return NextResponse.json({ error: 'Acceso denegado. Solo administradores.' }, { status: 403 })
    }

    // Obtener las métricas del usuario específico
    const metrics = await prisma.metric.findMany({
      where: {
        authorId: params.userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    console.log('admin/user-metrics API - metrics found:', metrics.length);

    // Obtener información del usuario
    const targetUser = await prisma.user.findUnique({
      where: { id: params.userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true
      }
    })
    
    console.log('admin/user-metrics API - targetUser:', targetUser);

    if (!targetUser) {
      console.log('admin/user-metrics API - Target user not found');
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    return NextResponse.json({
      user: targetUser,
      metrics
    })
  } catch (error) {
    console.error('admin/user-metrics API - Error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
