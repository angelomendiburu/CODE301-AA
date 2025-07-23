import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Obtener todos los usuarios
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        image: true,
        // Obtener métricas y proyectos asociados
        metrics: {
          select: { id: true }
        }
      }
    });

    // Calcular usuarios incompletos
    const incompleteUsers = await Promise.all(
      users
        .filter(user => user.role !== 'admin') // Excluir administradores
        .map(async (user) => {
          // Verificar si tiene proyecto registrado (buscar en data/projects o registrations)
          let hasProject = false;
          try {
            const registrationResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/registration-status`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: user.email })
            });
            
            if (registrationResponse.ok) {
              const regData = await registrationResponse.json();
              hasProject = regData.isRegistered;
            }
          } catch (error) {
            console.error('Error checking registration status:', error);
          }

          const hasMetrics = user.metrics.length > 0;
          
          // Calcular días desde la creación (aproximado, ya que no tenemos createdAt en el modelo actual)
          const daysSinceCreation = 1; // Por defecto 1 día, esto se puede mejorar

          // Un usuario está incompleto si no tiene proyecto O no tiene métricas
          const isIncomplete = !hasProject || !hasMetrics;

          if (isIncomplete) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              emailVerified: user.emailVerified,
              image: user.image,
              hasMetrics,
              hasProject,
              daysSinceCreation
            };
          }
          return null;
        })
    );

    // Filtrar usuarios nulos
    const filteredIncompleteUsers = incompleteUsers.filter(user => user !== null);

    return NextResponse.json({
      users: filteredIncompleteUsers,
      total: filteredIncompleteUsers.length
    });

  } catch (error) {
    console.error('Error fetching incomplete users:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
