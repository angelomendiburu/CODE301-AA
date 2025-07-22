const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanupUsers() {
  console.log('🔍 Limpiando usuarios duplicados...\n');

  // 1. Buscar usuarios duplicados
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { email: 'obserproduciones@gmail.com' },
        { email: 'obserproduciones@mail.com' },
        { email: 'angelomendiburu@gmail.com' }
      ]
    },
    include: {
      metrics: true,
      _count: { select: { metrics: true } }
    }
  });

  console.log('Usuarios encontrados:');
  users.forEach(user => {
    console.log(`- ${user.name || 'Sin nombre'} (${user.email}) - ${user._count.metrics} métricas`);
  });

  // 2. Encontrar el usuario de mail.com (el que tiene métricas)
  const mailUser = users.find(u => u.email === 'obserproduciones@mail.com');
  const gmailUser = users.find(u => u.email === 'obserproduciones@gmail.com');
  const adminUser = users.find(u => u.email === 'angelomendiburu@gmail.com');

  if (mailUser && gmailUser) {
    console.log('\n📋 Transfiriendo métricas de @mail.com a @gmail.com...');
    
    // Transferir métricas del usuario @mail.com al @gmail.com
    if (mailUser.metrics.length > 0) {
      await prisma.metric.updateMany({
        where: { authorId: mailUser.id },
        data: { authorId: gmailUser.id }
      });
      console.log(`✅ ${mailUser.metrics.length} métricas transferidas`);
    }

    // Eliminar usuario @mail.com
    await prisma.user.delete({
      where: { id: mailUser.id }
    });
    console.log('🗑️ Usuario @mail.com eliminado');

    // Actualizar nombre del usuario de Gmail si es necesario
    if (!gmailUser.name || gmailUser.name === 'Usuario Sin Nombre') {
      await prisma.user.update({
        where: { id: gmailUser.id },
        data: { 
          name: 'Obser Producciones',
          role: 'user'
        }
      });
      console.log('✅ Datos de usuario @gmail.com actualizados');
    }
  } else if (mailUser && !gmailUser) {
    console.log('\n📝 Actualizando email de @mail.com a @gmail.com...');
    
    // Cambiar el email del usuario
    await prisma.user.update({
      where: { id: mailUser.id },
      data: { 
        email: 'obserproduciones@gmail.com',
        name: 'Obser Producciones',
        role: 'user'
      }
    });
    console.log('✅ Email actualizado a @gmail.com');
  }

  // 3. Verificar que el admin esté correctamente configurado
  if (adminUser) {
    await prisma.user.update({
      where: { id: adminUser.id },
      data: { 
        role: 'admin',
        name: adminUser.name || 'Angelo David Mendiburu Vargas'
      }
    });
    console.log('✅ Usuario administrador configurado correctamente');
  }

  // 4. Verificar resultado final
  console.log('\n📊 Estado final:');
  const finalUsers = await prisma.user.findMany({
    include: {
      _count: { select: { metrics: true } }
    }
  });

  finalUsers.forEach(user => {
    const role = user.role === 'admin' ? '👑 ADMIN' : '👤 USER';
    console.log(`${role} - ${user.name || 'Sin nombre'} (${user.email}) - ${user._count.metrics} métricas`);
  });

  console.log('\n🎉 ¡Limpieza completada exitosamente!');
}

cleanupUsers()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
