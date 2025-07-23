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
    // Buscar primero por email real, luego por anonymous (datos legacy)
    const userRegistration = registrations.find((reg: any) => 
      reg.userEmail === session.user.email
    );

    // Si no se encuentra por email, buscar el más reciente con "anonymous" 
    // esto es para compatibilidad con datos existentes
    const anonymousRegistration = registrations
      .filter((reg: any) => reg.userEmail === 'anonymous')
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

    const finalRegistration = userRegistration || anonymousRegistration;

    if (!finalRegistration) {
      return NextResponse.json({ status: 'not_found' });
    }

    return NextResponse.json({ 
      status: finalRegistration.status,
      projectName: finalRegistration.projectName,
      createdAt: finalRegistration.createdAt,
      processedAt: finalRegistration.processedAt
    });

  } catch (error) {
    console.error('Error al verificar estado del registro:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
