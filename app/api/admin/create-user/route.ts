import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, name, role = 'user' } = await request.json();

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email y nombre son requeridos' },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'El usuario ya existe' },
        { status: 400 }
      );
    }

    // Crear nuevo usuario
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        role,
        // Para usuarios creados manualmente, no tienen imagen por defecto
        image: null,
        emailVerified: null,
      }
    });

    // Crear registro de actividad
    await prisma.activityLog.create({
      data: {
        userId: newUser.id,
        action: 'manual_user_creation',
        description: `Usuario ${name} creado manualmente por administrador`,
        metadata: { email, role }
      }
    });

    return NextResponse.json({
      message: 'Usuario creado exitosamente',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        status: 'incomplete' // Status manual para control
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creando usuario:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// GET - Obtener todos los usuarios
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        image: true,
      },
      orderBy: {
        id: 'desc' // Ordenar por ID para usuarios más recientes primero
      }
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
