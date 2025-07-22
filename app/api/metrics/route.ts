import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/options'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    console.log('=== Metrics API POST called ===')
    const session = await getServerSession(authOptions)
    console.log('Session:', session)
    
    if (!session || !session.user?.email) {
      console.log('No session or email found')
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    console.log('User authenticated:', session.user.email)

    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const comment = formData.get('comment') as string
    const sales = formData.get('sales') as string
    const expenses = formData.get('expenses') as string
    const image = formData.get('image') as File | null
    const document = formData.get('document') as File | null

    if (!title) {
      return NextResponse.json({ error: 'El título es requerido' }, { status: 400 })
    }

    if (!comment) {
      return NextResponse.json({ error: 'El comentario es requerido' }, { status: 400 })
    }

    if (!image || image.size === 0) {
      return NextResponse.json({ error: 'La imagen es requerida' }, { status: 400 })
    }

    if (!document || document.size === 0) {
      return NextResponse.json({ error: 'El documento es requerido' }, { status: 400 })
    }

    // Obtener el usuario
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    let imageUrl = null
    let documentUrl = null

    // Crear directorio uploads si no existe
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadsDir, { recursive: true })

    // Subir imagen si existe
    if (image && image.size > 0) {
      const imageBuffer = new Uint8Array(await image.arrayBuffer())
      const imageName = `${Date.now()}-${image.name}`
      const imagePath = join(uploadsDir, imageName)
      await writeFile(imagePath, imageBuffer)
      imageUrl = `/uploads/${imageName}`
    }

    // Subir documento si existe
    if (document && document.size > 0) {
      const documentBuffer = new Uint8Array(await document.arrayBuffer())
      const documentName = `${Date.now()}-${document.name}`
      const documentPath = join(uploadsDir, documentName)
      await writeFile(documentPath, documentBuffer)
      documentUrl = `/uploads/${documentName}`
    }

    // Crear la métrica
    const metric = await prisma.metric.create({
      data: {
        title,
        description,
        comment,
        imageUrl: imageUrl!,
        documentUrl: documentUrl!,
        sales: sales ? parseFloat(sales) : null,
        expenses: expenses ? parseFloat(expenses) : null,
        authorId: user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })

    return NextResponse.json(metric)
  } catch (error) {
    console.error('Error creating metric:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Buscar el usuario actual
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    // Obtener SOLO las métricas del usuario autenticado
    const metrics = await prisma.metric.findMany({
      where: {
        authorId: user.id
      },
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
        createdAt: 'desc'
      }
    })

    return NextResponse.json(metrics)
  } catch (error) {
    console.error('Error fetching metrics:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
