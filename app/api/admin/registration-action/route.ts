import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { id, action } = await request.json();
    
    if (!id || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'ID y acción válida son requeridos' },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), 'data', 'registrations.json');
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Archivo de registros no encontrado' },
        { status: 404 }
      );
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    let registrations = JSON.parse(fileContent);

    // Find and update the registration
    const registrationIndex = registrations.findIndex((reg: any) => reg.id === id);
    
    if (registrationIndex === -1) {
      return NextResponse.json(
        { error: 'Registro no encontrado' },
        { status: 404 }
      );
    }

    // Update status
    registrations[registrationIndex].status = action === 'approve' ? 'approved' : 'rejected';
    registrations[registrationIndex].processedAt = new Date().toISOString();
    registrations[registrationIndex].processedBy = 'admin'; // Could be dynamic based on session

    // Save updated data
    fs.writeFileSync(filePath, JSON.stringify(registrations, null, 2));

    return NextResponse.json({
      success: true,
      message: `Registro ${action === 'approve' ? 'aprobado' : 'rechazado'} exitosamente`
    });

  } catch (error) {
    console.error('Error processing registration action:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
