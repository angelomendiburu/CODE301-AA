import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/options'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.email !== 'angelomendiburu@gmail.com') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Obtener todos los usuarios
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        _count: {
          select: {
            metrics: true
          }
        }
      }
    })

    // Obtener todas las métricas
    const allMetrics = await prisma.metric.findMany({
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Obtener métricas por usuario específico
    const metricsGrouped = await prisma.user.findMany({
      include: {
        metrics: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    return NextResponse.json({
      totalUsers: users.length,
      totalMetrics: allMetrics.length,
      users: users,
      allMetrics: allMetrics,
      metricsGrouped: metricsGrouped.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        metricsCount: user.metrics.length,
        metrics: user.metrics
      }))
    })
  } catch (error) {
    console.error('Error in debug endpoint:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
