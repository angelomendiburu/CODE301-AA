import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId, email, type } = await request.json();

    if (!userId || !email || !type) {
      return NextResponse.json(
        { error: 'Datos requeridos faltantes' },
        { status: 400 }
      );
    }

    // Crear registro de actividad
    await prisma.activityLog.create({
      data: {
        userId,
        action: 'reminder_sent',
        description: `Recordatorio enviado por email para ${type}`,
        metadata: {
          email,
          type,
          sentAt: new Date().toISOString()
        }
      }
    });

    // Aquí normalmente integrarías con un servicio de email como SendGrid, Nodemailer, etc.
    // Por ahora, simulamos el envío exitoso
    
    const emailContent = getEmailContent(type);
    
    // Simular envío de email (en producción, aquí iría la lógica real de email)
    console.log(`Email reminder sent to ${email}:`, emailContent);

    return NextResponse.json({
      success: true,
      message: 'Recordatorio enviado exitosamente'
    });

  } catch (error) {
    console.error('Error sending reminder:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

function getEmailContent(type: string) {
  const templates = {
    incomplete_registration: {
      subject: '🚀 Completa tu registro en StartUPC',
      body: `
        ¡Hola!
        
        Notamos que aún no has completado tu registro en StartUPC. 
        
        Para acceder a todos los beneficios de nuestra plataforma de incubación, necesitas:
        
        ✅ Completar la información de tu proyecto
        ✅ Subir tus métricas y documentos
        ✅ Finalizar tu perfil de emprendedor
        
        ¡No pierdas la oportunidad de ser parte de la comunidad de startups más grande del Perú!
        
        Completa tu registro aquí: ${process.env.NEXTAUTH_URL}/register
        
        Si tienes alguna pregunta, no dudes en contactarnos.
        
        ¡Saludos!
        Equipo StartUPC
      `
    }
  };

  return templates[type as keyof typeof templates] || templates.incomplete_registration;
}
