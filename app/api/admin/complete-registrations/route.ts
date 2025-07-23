import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'registrations.json');
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json([]);
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const registrations = JSON.parse(fileContent);

    // Sort by most recent first
    registrations.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json(registrations);
  } catch (error) {
    console.error('Error loading complete registrations:', error);
    return NextResponse.json(
      { error: 'Error al cargar registros completos' },
      { status: 500 }
    );
  }
}
