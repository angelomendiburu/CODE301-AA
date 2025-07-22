import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/options'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { content, observationId } = await request.json()

    if (!content || !observationId) {
      return NextResponse.json({ error: 'El contenido y observationId son requeridos' }, { status: 400 })
    }

    // Obtener el usuario
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    // Crear la respuesta a la observación
    const response = await prisma.observationResponse.create({
      data: {
        content,
        observationId,
        authorId: user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          }
        }
      }
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error creating observation response:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
