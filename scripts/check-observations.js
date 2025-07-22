const { PrismaClient } = require('@prisma/client');

async function checkObservations() {
  const prisma = new PrismaClient();
  
  try {
    console.log('=== CHECKING OBSERVATIONS ===\n');
    
    // Obtener todas las observaciones
    const observations = await prisma.observation.findMany({
      include: {
        author: {
          select: { id: true, name: true, email: true }
        },
        targetUser: {
          select: { id: true, name: true, email: true }
        },
        responses: {
          include: {
            author: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`Total observations found: ${observations.length}\n`);
    
    if (observations.length === 0) {
      console.log('No observations found in database');
    } else {
      observations.forEach((obs, index) => {
        console.log(`--- Observation ${index + 1} ---`);
        console.log(`ID: ${obs.id}`);
        console.log(`Content: ${obs.content.substring(0, 100)}${obs.content.length > 100 ? '...' : ''}`);
        console.log(`Author: ${obs.author?.name || 'Unknown'} (${obs.author?.email || 'No email'})`);
        console.log(`Target User: ${obs.targetUser?.name || 'No target'} (${obs.targetUser?.email || 'No email'})`);
        console.log(`Created: ${obs.createdAt.toISOString()}`);
        console.log(`Responses: ${obs.responses.length}`);
        console.log('');
      });
    }
    
    // Obtener usuarios para referencia
    console.log('\n=== USERS ===\n');
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true }
    });
    
    users.forEach(user => {
      console.log(`${user.name || 'No name'} (${user.email || 'No email'}) - Role: ${user.role} - ID: ${user.id}`);
    });
    
  } catch (error) {
    console.error('Error checking observations:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkObservations();
