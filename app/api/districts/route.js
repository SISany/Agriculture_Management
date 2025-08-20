import { query } from '@/lib/database';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const districts = await query('SELECT * FROM district ORDER BY name');
    return NextResponse.json(districts);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
