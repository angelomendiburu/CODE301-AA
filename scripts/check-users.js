const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
  console.log('🔍 Verificando usuarios en la base de datos...\n');

  const users = await prisma.user.findMany({
    include: {
      _count: { select: { metrics: true } }
    },
    orderBy: { email: 'asc' }
  });

  console.log('👥 Usuarios encontrados:');
  users.forEach(user => {
    const role = user.role === 'admin' ? '👑 ADMIN' : '👤 USER';
    console.log(`${role} - ${user.name || 'Sin nombre'}`);
    console.log(`   📧 Email: ${user.email}`);
    console.log(`   📊 Métricas: ${user._count.metrics}`);
    console.log(`   🆔 ID: ${user.id}`);
    console.log('');
  });

  // Buscar específicamente los emails relacionados con "obser"
  const obserUsers = await prisma.user.findMany({
    where: {
      email: {
        contains: 'obser'
      }
    },
    include: {
      _count: { select: { metrics: true } }
    }
  });

  console.log('🎯 Usuarios con "obser" en el email:');
  obserUsers.forEach(user => {
    const role = user.role === 'admin' ? '👑 ADMIN' : '👤 USER';
    console.log(`${role} - ${user.name || 'Sin nombre'} (${user.email}) - ${user._count.metrics} métricas`);
  });
}

checkUsers()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
