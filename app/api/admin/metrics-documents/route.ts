import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../../auth/[...nextauth]/options';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    console.log('Session data:', session?.user);
    
    if (!session?.user?.email) {
      console.log('No session or email found');
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Verificar que el usuario es admin
    const adminUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true, name: true, email: true }
    });

    console.log('Admin user found:', adminUser);

    if (adminUser?.role !== 'admin') {
      console.log('User is not admin. Role:', adminUser?.role);
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    // Obtener todos los usuarios que tienen documentos en sus métricas
    const usersWithDocuments = await prisma.user.findMany({
      where: {
        role: 'user', // Solo usuarios regulares
        metrics: {
          some: {
            OR: [
              { imageUrl: { not: '' } },
              { documentUrl: { not: '' } }
            ]
          }
        }
      },
      include: {
        _count: {
          select: {
            metrics: true
          }
        },
        metrics: {
          where: {
            OR: [
              { imageUrl: { not: '' } },
              { documentUrl: { not: '' } }
            ]
          },
          select: {
            id: true,
            title: true,
            description: true,
            comment: true,
            imageUrl: true,
            documentUrl: true,
            sales: true,
            expenses: true,
            createdAt: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    console.log('Users with documents found:', usersWithDocuments.length);
    console.log('Sample data:', usersWithDocuments.slice(0, 2));

    // Transformar los datos para que tengan la estructura esperada
    const transformedUsers = usersWithDocuments.map((user: any) => ({
      ...user,
      documents: user.metrics.flatMap((metric: any) => {
        const docs = [];
        
        // Función para detectar el tipo de archivo basado en la URL
        const getFileTypeFromUrl = (url: string) => {
          const lowerUrl = url.toLowerCase();
          if (lowerUrl.includes('.jpg') || lowerUrl.includes('.jpeg') || lowerUrl.includes('.png') || lowerUrl.includes('.gif') || lowerUrl.includes('.webp')) {
            return 'image/jpeg';
          } else if (lowerUrl.includes('.pdf')) {
            return 'application/pdf';
          } else if (lowerUrl.includes('.doc') || lowerUrl.includes('.docx')) {
            return 'application/msword';
          }
          // Si es de cloudinary o similar, probablemente es imagen
          if (lowerUrl.includes('cloudinary') || lowerUrl.includes('imgur') || lowerUrl.includes('image')) {
            return 'image/jpeg';
          }
          return 'application/octet-stream';
        };
        
        // Agregar imagen si existe
        if (metric.imageUrl) {
          docs.push({
            id: `${metric.id}-image`,
            fileName: metric.imageUrl,
            originalName: `Imagen - ${metric.title || 'Métrica'}`,
            fileSize: 0, // No tenemos el tamaño del archivo
            fileType: getFileTypeFromUrl(metric.imageUrl),
            uploadedAt: metric.createdAt,
            metricId: metric.id,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image
            },
            metric: {
              id: metric.id,
              type: metric.title || 'Métrica',
              amount: metric.sales || metric.expenses || 0
            }
          });
        }
        
        // Agregar documento si existe
        if (metric.documentUrl) {
          docs.push({
            id: `${metric.id}-document`,
            fileName: metric.documentUrl,
            originalName: `Documento - ${metric.title || 'Métrica'}`,
            fileSize: 0, // No tenemos el tamaño del archivo
            fileType: getFileTypeFromUrl(metric.documentUrl),
            uploadedAt: metric.createdAt,
            metricId: metric.id,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image
            },
            metric: {
              id: metric.id,
              type: metric.title || 'Métrica',
              amount: metric.sales || metric.expenses || 0
            }
          });
        }
        
        return docs;
      })
    })).filter(user => user.documents.length > 0);

    return NextResponse.json({ 
      users: transformedUsers,
      totalDocuments: transformedUsers.reduce((total, user) => total + user.documents.length, 0)
    });
  } catch (error) {
    console.error('Error fetching metrics documents:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
