import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/options'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const { content } = await request.json()

    if (!content) {
      return NextResponse.json({ error: 'El contenido es requerido' }, { status: 400 })
    }

    // Buscar la observación
    const observation = await prisma.observation.findUnique({
      where: { id: params.id },
      include: {
        responses: true
      }
    })

    if (!observation) {
      return NextResponse.json({ error: 'Observación no encontrada' }, { status: 404 })
    }

    // Verificar permisos: solo el autor puede editar la observación
    if (observation.authorId !== user.id) {
      return NextResponse.json({ error: 'No tienes permisos para editar esta observación' }, { status: 403 })
    }

    // Verificar que no tenga respuestas (solo se puede editar si no ha sido respondida)
    if (observation.responses && observation.responses.length > 0) {
      return NextResponse.json({ error: 'No se puede editar una observación que ya ha sido respondida' }, { status: 400 })
    }

    // Actualizar la observación
    const updatedObservation = await prisma.observation.update({
      where: { id: params.id },
      data: { content },
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
        },
        responses: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    })

    return NextResponse.json(updatedObservation)
  } catch (error) {
    console.error('Error updating observation:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
