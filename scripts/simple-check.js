const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log('Verificando usuarios...');
    
    const users = await prisma.user.findMany({
      include: {
        _count: { select: { metrics: true } }
      }
    });
    
    console.log('Usuarios encontrados:', users.length);
    
    for (const user of users) {
      console.log(`- ${user.name || 'Sin nombre'} (${user.email}) - ${user._count.metrics} métricas`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
