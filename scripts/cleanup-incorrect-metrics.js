const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanupIncorrectMetrics() {
  console.log('🧹 Limpiando métricas incorrectas...\n');

  // Obtener las métricas del usuario obserproductions@gmail.com (con "s")
  const userWithS = await prisma.user.findUnique({
    where: { email: 'obserproductions@gmail.com' },
    include: {
      metrics: {
        orderBy: { createdAt: 'asc' }
      }
    }
  });

  if (!userWithS) {
    console.log('❌ Usuario obserproductions@gmail.com no encontrado');
    return;
  }

  console.log(`📊 Usuario: ${userWithS.name} (${userWithS.email})`);
  console.log(`📊 Métricas encontradas: ${userWithS.metrics.length}\n`);

  // Mostrar todas las métricas
  userWithS.metrics.forEach((metric, idx) => {
    const date = new Date(metric.createdAt).toLocaleDateString('es-ES');
    console.log(`${idx + 1}. ${metric.title} - ${date}`);
    console.log(`   💬 ${metric.comment}`);
    console.log(`   💰 Ventas: $${metric.sales || 0}, Gastos: $${metric.expenses || 0}\n`);
  });

  // Identificar métricas de ejemplo (las que tienen patrones automáticos)
  const exampleMetrics = userWithS.metrics.filter(metric => 
    metric.comment.includes('día') && 
    (metric.comment.includes('Buena actividad') || 
     metric.comment.includes('ROI positivo') || 
     metric.comment.includes('Funcionamiento normal'))
  );

  const realMetrics = userWithS.metrics.filter(metric => 
    !metric.comment.includes('día') || 
    (!metric.comment.includes('Buena actividad') && 
     !metric.comment.includes('ROI positivo') && 
     !metric.comment.includes('Funcionamiento normal'))
  );

  console.log(`🔍 Métricas de ejemplo detectadas: ${exampleMetrics.length}`);
  console.log(`✅ Métricas reales del usuario: ${realMetrics.length}\n`);

  if (exampleMetrics.length > 0) {
    console.log('🗑️ Eliminando métricas de ejemplo incorrectas...');
    
    for (const metric of exampleMetrics) {
      await prisma.metric.delete({
        where: { id: metric.id }
      });
      console.log(`   ✅ Eliminada: ${metric.title} - ${metric.comment}`);
    }
    
    console.log(`\n🎉 Se eliminaron ${exampleMetrics.length} métricas de ejemplo incorrectas`);
    console.log(`✅ El usuario ${userWithS.email} ahora tiene solo sus métricas reales: ${realMetrics.length}`);
  } else {
    console.log('✅ No se encontraron métricas de ejemplo incorrectas');
  }

  // Verificar estado final
  const finalUser = await prisma.user.findUnique({
    where: { email: 'obserproductions@gmail.com' },
    include: {
      _count: { select: { metrics: true } }
    }
  });

  console.log(`\n📊 Estado final: ${finalUser?.name} tiene ${finalUser?._count.metrics} métricas`);
}

cleanupIncorrectMetrics()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
