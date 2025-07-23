import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const registrationsPath = path.join(process.cwd(), 'data', 'registrations.json');
    
    if (!fs.existsSync(registrationsPath)) {
      return NextResponse.json({ status: 'pending' });
    }

    const registrationsData = fs.readFileSync(registrationsPath, 'utf8');
    const registrations = JSON.parse(registrationsData);

    // Buscar el registro del usuario actual
    const userRegistration = registrations.find((reg: any) => 
      reg.userEmail === session.user.email || reg.userEmail === 'anonymous'
    );

    if (!userRegistration) {
      return NextResponse.json({ status: 'not_found' });
    }

    return NextResponse.json({ 
      status: userRegistration.status,
      projectName: userRegistration.projectName,
      createdAt: userRegistration.createdAt,
      processedAt: userRegistration.processedAt
    });

  } catch (error) {
    console.error('Error al verificar estado del registro:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
