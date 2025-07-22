import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Verificar autenticación (opcional, dependiendo de tus requerimientos)
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener todos los usuarios no-admin (con o sin métricas)
    const usersWithMetrics = await prisma.user.findMany({
      where: {
        role: { not: 'admin' } // Excluir solo administradores
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        emailVerified: true,
        _count: {
          select: {
            metrics: true
          }
        },
        metrics: {
          select: {
            id: true,
            title: true,
            comment: true,
            sales: true,
            expenses: true,
            createdAt: true,
            imageUrl: true,
            documentUrl: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
      orderBy: {
        email: 'asc'
      }
    });

    // Calcular estadísticas para cada usuario
    const usersWithStats = usersWithMetrics.map(user => {
      const metrics = user.metrics;
      const totalMetrics = metrics.length;
      
      // Calcular totales de ventas y gastos
      const totalSales = metrics.reduce((sum: number, metric: any) => sum + (metric.sales || 0), 0);
      const totalExpenses = metrics.reduce((sum: number, metric: any) => sum + (metric.expenses || 0), 0);
      const netProfit = totalSales - totalExpenses;
      
      // Calcular progreso (basado en número de métricas)
      const maxMetrics = 20; // Meta arbitraria
      const progress = Math.min(Math.round((totalMetrics / maxMetrics) * 100), 100);
      
      // Métricas de los últimos 7 días para gráfico
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const recentMetrics = metrics.filter((metric: any) => 
        new Date(metric.createdAt) >= sevenDaysAgo
      );
      
      // Crear datos para gráfico por día
      const chartData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayStart = new Date(date.setHours(0, 0, 0, 0));
        const dayEnd = new Date(date.setHours(23, 59, 59, 999));
        
        const dayMetrics = recentMetrics.filter((metric: any) => {
          const metricDate = new Date(metric.createdAt);
          return metricDate >= dayStart && metricDate <= dayEnd;
        });
        
        const daySales = dayMetrics.reduce((sum: number, metric: any) => sum + (metric.sales || 0), 0);
        const dayExpenses = dayMetrics.reduce((sum: number, metric: any) => sum + (metric.expenses || 0), 0);
        
        chartData.push({
          date: dayStart.toISOString().split('T')[0],
          sales: daySales,
          expenses: dayExpenses,
          profit: daySales - dayExpenses,
          count: dayMetrics.length
        });
      }
      
      return {
        id: user.id,
        name: user.name || 'Usuario Sin Nombre',
        email: user.email,
        image: user.image,
        totalMetrics,
        totalSales,
        totalExpenses,
        netProfit,
        progress,
        chartData,
        recentMetrics: metrics.slice(0, 3), // Últimas 3 métricas
        memberSince: user.emailVerified || new Date()
      };
    });

    return NextResponse.json({ users: usersWithStats });
  } catch (error) {
    console.error('Error fetching users metrics:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
