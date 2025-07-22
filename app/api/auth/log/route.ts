import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, action, description, metadata } = body;

    if (!userId || !action || !description) {
      return NextResponse.json(
        { error: 'userId, action y description son requeridos' },
        { status: 400 }
      );
    }

    // Obtener información de la request para metadata adicional
    const userAgent = request.headers.get('user-agent') || '';
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ipAddress = forwardedFor?.split(',')[0] || realIp || '::1';

    const activity = await prisma.activityLog.create({
      data: {
        userId,
        action,
        description,
        metadata: {
          ...metadata,
          ipAddress,
          userAgent,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, activity });
  } catch (error) {
    console.error('Error logging auth activity:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
