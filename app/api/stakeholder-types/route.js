import { query } from '@/lib/database';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const types = await query('SELECT * FROM stakeholder_type ORDER BY type_name');
    return NextResponse.json(types);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
