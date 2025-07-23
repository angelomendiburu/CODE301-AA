import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface ProjectData {
  programId: string;
  projectName: string;
  category: string;
  industry: string;
  description: string;
  projectOrigin: string;
  projectStage: string;
  problemDescription: string;
  opportunityValue: string;
  youtubeUrl: string;
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
    const { projectData, userEmail } = body;
    
    // Validate required fields for complete registration
    const requiredFields: (keyof ProjectData)[] = [
      'programId',
      'projectName', 
      'industry',
      'description',
      'projectOrigin',
      'projectStage',
      'problemDescription',
      'opportunityValue'
    ];
    
    for (const field of requiredFields) {
      if (!projectData[field]) {
        return NextResponse.json(
          { message: `El campo ${field} es requerido` },
          { status: 400 }
        );
      }
    }

    // Create project data with timestamp
    const project = {
      id: Date.now().toString(),
      userEmail: userEmail || 'anonymous',
      ...projectData,
      createdAt: new Date().toISOString(),
      status: 'pending',
      completedSteps: 4
    };

    // Save complete registration to registrations.json
    await saveToFile('registrations.json', project);

    console.log('Complete project registration:', {
      id: project.id,
      name: project.projectName,
      program: project.programId,
      userEmail: project.userEmail
    });

    return NextResponse.json(
      { 
        success: true,
        message: 'Registro completo enviado exitosamente',
        projectId: project.id,
        redirectTo: '/pending-approval'
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error registering project:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
