import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const initialCredits = {
      credits: 3,
      transactions: [
        {
          date: new Date().toISOString(),
          amount: 3,
          type: 'purchase',
          description: 'Welcome credits'
        }
      ]
    };

    const creditsPath = path.join(process.cwd(), 'storage', email, 'credits.json');
    fs.writeFileSync(creditsPath, JSON.stringify(initialCredits, null, 2));

    return NextResponse.json(initialCredits);
  } catch (error) {
    console.error('Error creating credits:', error);
    return NextResponse.json(
      { error: 'Error creating credits' },
      { status: 500 }
    );
  }
} 