const { PrismaClient } = require('@prisma/client');

async function checkActivityLogs() {
  const prisma = new PrismaClient();
  
  try {
    console.log('=== CHECKING ACTIVITY LOGS ===\n');
    
    // Obtener todos los logs de actividad
    const activities = await prisma.activityLog.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    
    console.log(`Total activity logs found: ${activities.length}\n`);
    
    if (activities.length === 0) {
      console.log('No activity logs found in database');
      
      // Verificar si hay usuarios
      const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true }
      });
      console.log(`Users in database: ${users.length}`);
      
      // Verificar si hay métricas (para ver actividad)
      const metrics = await prisma.metric.findMany({
        take: 5,
        include: {
          author: {
            select: { name: true, email: true }
          }
        }
      });
      console.log(`Metrics in database: ${metrics.length}`);
      if (metrics.length > 0) {
        console.log('Recent metrics:');
        metrics.forEach((metric, index) => {
          console.log(`${index + 1}. ${metric.title} by ${metric.author.name} (${metric.createdAt})`);
        });
      }
      
    } else {
      activities.forEach((activity, index) => {
        console.log(`--- Activity ${index + 1} ---`);
        console.log(`ID: ${activity.id}`);
        console.log(`Action: ${activity.action}`);
        console.log(`Description: ${activity.description}`);
        console.log(`User: ${activity.user?.name || 'Unknown'} (${activity.user?.email || 'No email'})`);
        console.log(`Created: ${activity.createdAt.toISOString()}`);
        console.log(`Metadata:`, activity.metadata ? JSON.stringify(activity.metadata, null, 2) : 'None');
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('Error checking activity logs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkActivityLogs();
