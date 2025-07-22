const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function investigateMetrics() {
  console.log('🔍 Investigando métricas de usuarios...\n');

  // Buscar todos los usuarios relacionados con "obser"
  const users = await prisma.user.findMany({
    where: {
      email: {
        contains: 'obser'
      }
    },
    include: {
      metrics: {
        orderBy: { createdAt: 'asc' },
        select: {
          id: true,
          title: true,
          comment: true,
          sales: true,
          expenses: true,
          createdAt: true
        }
      },
      _count: { select: { metrics: true } }
    }
  });

  console.log('👥 Usuarios encontrados:');
  users.forEach(user => {
    const role = user.role === 'admin' ? '👑 ADMIN' : '👤 USER';
    console.log(`\n${role} - ${user.name || 'Sin nombre'}`);
    console.log(`   📧 Email: ${user.email}`);
    console.log(`   📊 Total métricas: ${user._count.metrics}`);
    
    if (user.metrics.length > 0) {
      console.log(`   📋 Métricas:`);
      user.metrics.forEach((metric, idx) => {
        const date = new Date(metric.createdAt).toLocaleDateString('es-ES');
        console.log(`      ${idx + 1}. ${metric.title} - ${date}`);
        console.log(`         💬 ${metric.comment}`);
        if (metric.sales) console.log(`         💰 Ventas: $${metric.sales}`);
        if (metric.expenses) console.log(`         💸 Gastos: $${metric.expenses}`);
      });
    }
  });

  // Verificar si hay métricas con fechas de ejemplo (los últimos 7 días con datos automáticos)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const exampleMetrics = await prisma.metric.findMany({
    where: {
      AND: [
        { createdAt: { gte: sevenDaysAgo } },
        {
          OR: [
            { comment: { contains: 'día' } },
            { comment: { contains: 'Ventas del día' } },
            { comment: { contains: 'Campaña digital' } },
            { comment: { contains: 'Operaciones del' } }
          ]
        }
      ]
    },
    include: {
      author: { select: { email: true, name: true } }
    }
  });

  if (exampleMetrics.length > 0) {
    console.log(`\n🔍 Métricas de ejemplo detectadas (${exampleMetrics.length}):`);
    exampleMetrics.forEach(metric => {
      console.log(`   📊 ${metric.title} - ${metric.author.email}`);
      console.log(`      💬 ${metric.comment}`);
      console.log(`      📅 ${new Date(metric.createdAt).toLocaleDateString('es-ES')}`);
    });
  }
}

investigateMetrics()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
