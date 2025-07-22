import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/options'

export async function GET(request: NextRequest) {
  return POST(request);
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.email !== 'angelomendiburu@gmail.com') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Crear o encontrar usuario obserproduciones@gmail.com
    let user = await prisma.user.findUnique({
      where: { email: 'obserproduciones@gmail.com' }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'obserproduciones@gmail.com',
          name: 'Obser Producciones',
          role: 'user'
        }
      })
    }

    // Crear métricas de ejemplo
    const sampleMetrics = [
      {
        title: 'Ventas Q1 2024',
        description: 'Métricas de ventas del primer trimestre',
        comment: 'Excelente crecimiento en comparación al trimestre anterior',
        imageUrl: '/placeholders/metric1.jpg',
        documentUrl: '/documents/ventas-q1.pdf',
        sales: 15000,
        expenses: 8000,
        authorId: user.id
      },
      {
        title: 'Marketing Digital',
        description: 'Campaña en redes sociales',
        comment: 'ROI positivo en todas las plataformas digitales',
        imageUrl: '/placeholders/metric2.jpg',
        documentUrl: '/documents/marketing-report.pdf',
        sales: 8500,
        expenses: 3200,
        authorId: user.id
      },
      {
        title: 'Expansión de Producto',
        description: 'Lanzamiento de nueva línea',
        comment: 'Buena acogida del mercado objetivo',
        imageUrl: '/placeholders/metric3.jpg',
        documentUrl: '/documents/expansion-analysis.pdf',
        sales: 12000,
        expenses: 7500,
        authorId: user.id
      }
    ]

    const createdMetrics = await Promise.all(
      sampleMetrics.map(metric => 
        prisma.metric.create({ data: metric })
      )
    )

    // También crear métricas para otros usuarios de ejemplo
    const users = await prisma.user.findMany({
      where: {
        email: {
          not: 'angelomendiburu@gmail.com'
        }
      }
    })

    for (const u of users) {
      if (u.id !== user.id) {
        await prisma.metric.create({
          data: {
            title: `Métrica de ${u.name || u.email}`,
            description: 'Métrica de ejemplo',
            comment: `Datos de ejemplo para ${u.name || u.email}`,
            imageUrl: '/placeholders/metric-default.jpg',
            documentUrl: '/documents/default-report.pdf',
            sales: Math.floor(Math.random() * 20000) + 5000,
            expenses: Math.floor(Math.random() * 10000) + 2000,
            authorId: u.id
          }
        })
      }
    }

    return NextResponse.json({
      message: 'Datos de ejemplo creados exitosamente',
      createdMetrics: createdMetrics.length,
      targetUser: user
    })
  } catch (error) {
    console.error('Error creating sample data:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
