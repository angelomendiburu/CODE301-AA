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

export async function POST(request: NextRequest) {
  try {
    const projectData: ProjectData = await request.json();
    
    // Validate required fields
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
      ...projectData,
      createdAt: new Date().toISOString(),
      status: 'registered'
    };

    // Define the path for storing project data
    const dataDir = path.join(process.cwd(), 'data', 'projects');
    const filePath = path.join(dataDir, `${project.id}.json`);

    // Create directory if it doesn't exist
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Save project data to file
    fs.writeFileSync(filePath, JSON.stringify(project, null, 2));

    // Also save to a master projects list for easy retrieval
    const projectsListPath = path.join(dataDir, 'projects-list.json');
    let projectsList = [];
    
    if (fs.existsSync(projectsListPath)) {
      const existingData = fs.readFileSync(projectsListPath, 'utf-8');
      projectsList = JSON.parse(existingData);
    }
    
    projectsList.push({
      id: project.id,
      projectName: project.projectName,
      programId: project.programId,
      industry: project.industry,
      createdAt: project.createdAt,
      status: project.status
    });
    
    fs.writeFileSync(projectsListPath, JSON.stringify(projectsList, null, 2));

    console.log('Project registered successfully:', {
      id: project.id,
      name: project.projectName,
      program: project.programId
    });

    return NextResponse.json(
      { 
        message: 'Proyecto registrado exitosamente',
        projectId: project.id
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
