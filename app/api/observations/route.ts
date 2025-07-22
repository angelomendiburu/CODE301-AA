import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/options'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { content, targetUserId } = await request.json()

    if (!content) {
      return NextResponse.json({ error: 'El contenido es requerido' }, { status: 400 })
    }

    // Obtener el usuario
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    // Verificar que es admin
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Acceso denegado. Solo administradores pueden crear observaciones.' }, { status: 403 })
    }

    // Verificar que el usuario objetivo existe si se proporciona
    if (targetUserId) {
      const targetUser = await prisma.user.findUnique({
        where: { id: targetUserId }
      })

      if (!targetUser) {
        return NextResponse.json({ error: 'Usuario objetivo no encontrado' }, { status: 404 })
      }
    }

    // Crear la observación
    const observation = await prisma.observation.create({
      data: {
        content,
        authorId: user.id,
        targetUserId: targetUserId || null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        targetUser: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })

    return NextResponse.json(observation)
  } catch (error) {
    console.error('Error creating observation:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

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

    // Obtener parámetro de filtro por usuario objetivo
    const { searchParams } = new URL(request.url)
    const targetUserId = searchParams.get('targetUserId')

    let observations

    if (user.role === 'admin') {
      let whereClause = {}
      
      // Si se especifica targetUserId, filtrar por ese usuario
      if (targetUserId) {
        whereClause = { targetUserId: targetUserId }
      }
      
      // Admin ve todas las observaciones o las filtradas por usuario
      observations = await prisma.observation.findMany({
        where: whereClause,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            }
          },
          targetUser: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          },
          responses: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                }
              }
            },
            orderBy: {
              createdAt: 'asc'
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    } else {
      // Usuario regular solo ve observaciones dirigidas a él o generales
      observations = await prisma.observation.findMany({
        where: {
          OR: [
            { targetUserId: user.id },
            { targetUserId: null }
          ]
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            }
          },
          targetUser: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          },
          responses: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                }
              }
            },
            orderBy: {
              createdAt: 'asc'
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    }

    return NextResponse.json(observations)
  } catch (error) {
    console.error('Error fetching observations:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
