const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAllMetrics() {
  try {
    console.log('🔍 Verificando métricas actuales...\n');

    // Obtener usuario obserproductions@gmail.com (CON "s")
    const userWithS = await prisma.user.findUnique({
      where: { email: 'obserproductions@gmail.com' },
      include: {
        metrics: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            comment: true,
            sales: true,
            expenses: true,
            createdAt: true
          }
        }
      }
    });

    // Obtener usuario obserproduciones@gmail.com (SIN "s")
    const userWithoutS = await prisma.user.findUnique({
      where: { email: 'obserproduciones@gmail.com' },
      include: {
        metrics: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            comment: true,
            sales: true,
            expenses: true,
            createdAt: true
          }
        }
      }
    });

    console.log('👤 USUARIO CON "S": obserproductions@gmail.com');
    if (userWithS) {
      console.log(`   📊 Total métricas: ${userWithS.metrics.length}`);
      userWithS.metrics.forEach((metric, idx) => {
        const date = new Date(metric.createdAt).toLocaleDateString('es-ES');
        console.log(`   ${idx + 1}. ${metric.title} - ${date}`);
        console.log(`      💬 ${metric.comment}`);
        console.log(`      💰 $${metric.sales || 0} / $${metric.expenses || 0}`);
      });
    } else {
      console.log('   ❌ Usuario no existe');
    }

    console.log('\n👤 USUARIO SIN "S": obserproduciones@gmail.com');
    if (userWithoutS) {
      console.log(`   📊 Total métricas: ${userWithoutS.metrics.length}`);
      userWithoutS.metrics.forEach((metric, idx) => {
        const date = new Date(metric.createdAt).toLocaleDateString('es-ES');
        console.log(`   ${idx + 1}. ${metric.title} - ${date}`);
        console.log(`      💬 ${metric.comment}`);
        console.log(`      💰 $${metric.sales || 0} / $${metric.expenses || 0}`);
      });
    } else {
      console.log('   ❌ Usuario no existe');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAllMetrics();
