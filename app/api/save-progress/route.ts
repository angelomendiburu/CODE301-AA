import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Función para generar ID único
function generateUniqueId(): string {
  return Date.now().toString();
}

// Función para guardar en archivo JSON
async function saveToFile(fileName: string, data: any) {
  const filePath = path.join(process.cwd(), 'data', fileName);
  const dirPath = path.dirname(filePath);
  
  // Crear directorio si no existe
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  let existingData = [];
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    try {
      existingData = JSON.parse(fileContent);
    } catch (error) {
      console.error('Error parsing existing file:', error);
      existingData = [];
    }
  }

  existingData.push(data);
  fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      projectData, 
      currentStep, 
      userEmail 
    } = body;

    const registrationId = generateUniqueId();
    const timestamp = new Date().toISOString();

    const registrationData = {
      id: registrationId,
      userEmail: userEmail || 'anonymous',
      projectData,
      currentStep,
      createdAt: timestamp,
      updatedAt: timestamp,
      status: 'incomplete'
    };

    // Guardar registro incompleto
    await saveToFile('incomplete-registrations.json', registrationData);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Progreso guardado exitosamente',
      registrationId,
      canContinue: true
    });

  } catch (error) {
    console.error('Error al guardar progreso:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
