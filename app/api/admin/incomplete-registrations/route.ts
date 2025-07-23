import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'incomplete-registrations.json');
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json([]);
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const registrations = JSON.parse(fileContent);

    // Sort by most recent first
    registrations.sort((a: any, b: any) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    return NextResponse.json(registrations);
  } catch (error) {
    console.error('Error loading incomplete registrations:', error);
    return NextResponse.json(
      { error: 'Error al cargar registros incompletos' },
      { status: 500 }
    );
  }
}
