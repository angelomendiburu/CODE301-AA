const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function finalCleanup() {
  console.log('🧹 Limpieza final de usuarios...\n');

  // Eliminar usuario sin métricas "Angelo Mendiburu (obserproductions@gmail.com)"
  const usersToDelete = await prisma.user.findMany({
    where: {
      OR: [
        { email: 'obserproductions@gmail.com' },
        { 
          AND: [
            { email: { not: 'angelomendiburu@gmail.com' } },
            { email: { not: 'obserproduciones@gmail.com' } }
          ]
        }
      ]
    },
    include: {
      _count: { select: { metrics: true } }
    }
  });

  console.log('Usuarios a eliminar:');
  for (const user of usersToDelete) {
    console.log(`- ${user.name} (${user.email}) - ${user._count.metrics} métricas`);
    
    if (user._count.metrics === 0) {
      await prisma.user.delete({ where: { id: user.id } });
      console.log(`  ✅ Eliminado: ${user.email}`);
    } else {
      console.log(`  ⚠️ No eliminado (tiene métricas): ${user.email}`);
    }
  }

  // Verificar estado final
  const finalUsers = await prisma.user.findMany({
    include: {
      _count: { select: { metrics: true } }
    }
  });

  console.log('\n📊 Estado final:');
  finalUsers.forEach(user => {
    const role = user.role === 'admin' ? '👑 ADMIN' : '👤 USER';
    console.log(`${role} - ${user.name} (${user.email}) - ${user._count.metrics} métricas`);
  });

  console.log('\n🎉 ¡Limpieza final completada!');
}

finalCleanup()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
