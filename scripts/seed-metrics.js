const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = [
    {
      email: 'obserproduciones@gmail.com',
      name: 'Obser Producciones'
    },
    {
      email: 'obserproductions@gmail.com', 
      name: 'Obser Productions'
    }
  ];
  
  for (const userData of users) {
    console.log(`\n=== Procesando usuario: ${userData.email} ===`);
    
    // Buscar el usuario
    let user = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    // Si el usuario no existe, crearlo
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          role: 'user'
        }
      });
      console.log(`Usuario creado: ${user.name} (${user.email})`);
    } else {
      console.log(`Usuario encontrado: ${user.name} (${user.email})`);
    }

    // Métricas de ejemplo para los últimos 7 días
    const today = new Date();
    const metrics = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Datos variables para cada día
      const dayData = [
        {
          title: 'Ventas Diarias',
          description: 'Registro de ventas del día',
          comment: `Ventas del día ${date.toLocaleDateString('es-ES')} - Buena actividad comercial`,
          sales: Math.floor(Math.random() * 5000) + 1000, // Entre 1000 y 6000
          expenses: Math.floor(Math.random() * 2000) + 500, // Entre 500 y 2500
          imageUrl: '/placeholders/John.webp',
          documentUrl: '/uploads/documento-ejemplo.pdf'
        },
        {
          title: 'Marketing Digital',
          description: 'Inversión en publicidad online',
          comment: `Campaña digital del ${date.toLocaleDateString('es-ES')} - ROI positivo`,
          sales: Math.floor(Math.random() * 3000) + 500,
          expenses: Math.floor(Math.random() * 1500) + 300,
          imageUrl: '/placeholders/Sarah.webp',
          documentUrl: '/uploads/reporte-marketing.pdf'
        },
        {
          title: 'Operaciones',
          description: 'Costos operativos diarios',
          comment: `Operaciones del ${date.toLocaleDateString('es-ES')} - Funcionamiento normal`,
          sales: Math.floor(Math.random() * 2000) + 800,
          expenses: Math.floor(Math.random() * 1200) + 400,
          imageUrl: '/placeholders/Richard.webp',
          documentUrl: '/uploads/informe-operaciones.pdf'
        }
      ];

      // Seleccionar aleatoriamente 1-2 métricas por día
      const dailyMetricsCount = Math.floor(Math.random() * 2) + 1;
      const selectedMetrics = dayData.slice(0, dailyMetricsCount);

      for (const metric of selectedMetrics) {
        metrics.push({
          ...metric,
          authorId: user.id,
          createdAt: date,
          updatedAt: date
        });
      }
    }

    // Insertar todas las métricas
    console.log(`Insertando ${metrics.length} métricas para ${userData.email}...`);
    
    for (const metric of metrics) {
      await prisma.metric.create({
        data: metric
      });
      console.log(`✓ Métrica creada: ${metric.title} - ${metric.createdAt.toLocaleDateString('es-ES')}`);
    }

    console.log(`\n🎉 ¡Completado para ${userData.email}! Se han agregado ${metrics.length} métricas de ejemplo`);
    console.log('📊 Las métricas incluyen ventas, gastos, comentarios e imágenes de ejemplo');
    console.log('📅 Distribuidas a lo largo de los últimos 7 días');
  }
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
