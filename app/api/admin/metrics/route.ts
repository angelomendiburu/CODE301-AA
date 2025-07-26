import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/options'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    // Verificar que es admin
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Acceso denegado. Solo administradores pueden ver estas métricas.' }, { status: 403 })
    }

    // Obtener todos los usuarios con sus métricas
    const users = await prisma.user.findMany({
      where: {
        role: { not: 'admin' } // Excluir admins de la lista
      },
      include: {
        metrics: {
          select: {
            sales: true,
            expenses: true,
            createdAt: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    // Definir interfaces para los objetos de usuario y métrica
    interface Metric {
      sales: number | null;
      expenses: number | null;
      createdAt: Date;
    }

    interface User {
      id: string;
      name: string | null;
      email: string | null;
      image: string | null;
      metrics: Metric[];
    }

    // Procesar datos para cada usuario
    const usersMetrics = users.map((user: User) => {
      const totalSales = user.metrics.reduce((sum: number, metric: Metric) => sum + (metric.sales || 0), 0)
      const totalExpenses = user.metrics.reduce((sum: number, metric: Metric) => sum + (metric.expenses || 0), 0)
      const totalMetrics = user.metrics.length

      // Generar datos de gráfico para los últimos 7 días
      const chartData = []
      const today = new Date()
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const dayMetrics = user.metrics.filter(metric => {
          const metricDate = new Date(metric.createdAt)
          return metricDate.toDateString() === date.toDateString()
        })
        
        const daySales = dayMetrics.reduce((sum, metric) => sum + (metric.sales || 0), 0)
        const dayExpenses = dayMetrics.reduce((sum, metric) => sum + (metric.expenses || 0), 0)
        
        chartData.push({
          day: date.toLocaleDateString('es-ES', { weekday: 'short' }),
          sales: daySales,
          expenses: dayExpenses
        })
      }

      return {
        id: user.id,
        name: user.name || user.email,
        email: user.email,
        image: user.image,
        totalMetrics,
        totalSales,
        totalExpenses,
        chartData
      }
    })

    return NextResponse.json(usersMetrics)
  } catch (error) {
    console.error('Error fetching admin metrics:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
