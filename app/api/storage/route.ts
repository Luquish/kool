import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Asegurarse de que la carpeta storage exista
const ensureDirectoryExists = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Función para guardar datos
const saveData = async (storagePath: string, data: any) => {
  try {
    const fullPath = path.join(process.cwd(), storagePath);
    const dirPath = path.dirname(fullPath);
    
    // Asegurar que el directorio existe
    ensureDirectoryExists(dirPath);
    
    // Guardar los datos como JSON
    fs.writeFileSync(fullPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error guardando datos:', error);
    return false;
  }
};

// Función para obtener datos
const getData = async (storagePath: string) => {
  try {
    const fullPath = path.join(process.cwd(), storagePath);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }
    
    const data = fs.readFileSync(fullPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error obteniendo datos:', error);
    return null;
  }
};

// POST: /api/storage
export async function POST(request: NextRequest) {
  try {
    const { path, data } = await request.json();
    
    if (!path || !data) {
      return NextResponse.json({ error: 'Se requiere path y data' }, { status: 400 });
    }
    
    const success = await saveData(path, data);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Error al guardar datos' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

// GET: /api/storage?path=storage/example.json
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const storagePath = searchParams.get('path');
    
    if (!storagePath) {
      return NextResponse.json({ error: 'Se requiere el parámetro path' }, { status: 400 });
    }
    
    const data = await getData(storagePath);
    
    if (data !== null) {
      return NextResponse.json({ data });
    } else {
      return NextResponse.json({ error: 'No se encontraron datos' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
} 