const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function transferMetricsToRealUser() {
  console.log('📧 Transfiriendo métricas al usuario real de Google...\n');

  // Buscar ambos usuarios
  const oldUser = await prisma.user.findUnique({
    where: { email: 'obserproduciones@gmail.com' }, // Sin "s" - usuario fake
    include: { metrics: true, _count: { select: { metrics: true } } }
  });

  let realUser = await prisma.user.findUnique({
    where: { email: 'obserproductions@gmail.com' }, // Con "s" - usuario real de Google
    include: { metrics: true, _count: { select: { metrics: true } } }
  });

  if (!oldUser) {
    console.log('❌ No se encontró el usuario fake con métricas');
    return;
  }

  console.log(`📊 Usuario fake encontrado: ${oldUser.email} con ${oldUser._count.metrics} métricas`);

  if (!realUser) {
    console.log('👤 Usuario real no existe aún, se creará automáticamente al hacer login');
    console.log('📝 Por ahora, actualizaré el email del usuario fake para que coincida con el real');
    
    // Actualizar el email del usuario fake para que coincida con el real
    await prisma.user.update({
      where: { id: oldUser.id },
      data: { 
        email: 'obserproductions@gmail.com',
        name: 'Obser Producciones'
      }
    });
    
    console.log('✅ Email actualizado de obserproduciones@gmail.com a obserproductions@gmail.com');
  } else {
    console.log(`👤 Usuario real encontrado: ${realUser.email} con ${realUser._count.metrics} métricas`);
    
    if (oldUser.metrics.length > 0) {
      // Transferir métricas del usuario fake al real
      await prisma.metric.updateMany({
        where: { authorId: oldUser.id },
        data: { authorId: realUser.id }
      });
      
      console.log(`✅ ${oldUser.metrics.length} métricas transferidas de ${oldUser.email} a ${realUser.email}`);
      
      // Eliminar el usuario fake
      await prisma.user.delete({
        where: { id: oldUser.id }
      });
      
      console.log('🗑️ Usuario fake eliminado');
    }
  }

  // Verificar estado final
  console.log('\n📊 Estado final:');
  const allUsers = await prisma.user.findMany({
    include: { _count: { select: { metrics: true } } }
  });

  allUsers.forEach(user => {
    const role = user.role === 'admin' ? '👑 ADMIN' : '👤 USER';
    console.log(`${role} - ${user.name || 'Sin nombre'} (${user.email}) - ${user._count.metrics} métricas`);
  });

  console.log('\n🎉 ¡Transferencia completada! Ahora al loguearte con obserproductions@gmail.com verás tus métricas.');
}

transferMetricsToRealUser()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
