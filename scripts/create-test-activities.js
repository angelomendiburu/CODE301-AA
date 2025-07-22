const { PrismaClient } = require('@prisma/client');

async function createTestActivity() {
  const prisma = new PrismaClient();
  
  try {
    // Obtener un usuario para simular la actividad
    const user = await prisma.user.findFirst({
      where: { email: 'obserproductions@gmail.com' }
    });
    
    if (!user) {
      console.log('Usuario no encontrado');
      return;
    }
    
    // Crear una actividad de subida de métrica
    const activity = await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'upload_metric',
        description: `Subió una nueva métrica: "Ventas mensuales Q4 2025"`,
        metadata: {
          fileName: 'ventas_q4_2025.pdf',
          fileType: 'application/pdf',
          fileSize: 2048000,
          ipAddress: '::1',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
        }
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });
    
    console.log('✅ Actividad de prueba creada:');
    console.log(`ID: ${activity.id}`);
    console.log(`Usuario: ${activity.user.name} (${activity.user.email})`);
    console.log(`Acción: ${activity.action}`);
    console.log(`Descripción: ${activity.description}`);
    console.log(`Fecha: ${activity.createdAt}`);
    
    // Crear también una actividad de respuesta a observación
    const observationActivity = await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'respond_observation',
        description: `Respondió a una observación del administrador`,
        metadata: {
          observationId: 'cmddv076k000ftwqw27v288zg', // ID de una observación existente
          responseContent: 'Gracias por el feedback, he actualizado los documentos según sus recomendaciones.',
          ipAddress: '::1',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
        }
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });
    
    console.log('\n✅ Segunda actividad de prueba creada:');
    console.log(`ID: ${observationActivity.id}`);
    console.log(`Usuario: ${observationActivity.user.name} (${observationActivity.user.email})`);
    console.log(`Acción: ${observationActivity.action}`);
    console.log(`Descripción: ${observationActivity.description}`);
    
  } catch (error) {
    console.error('Error creando actividad de prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestActivity();
