import { query } from '@/lib/database';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const districts = await query('SELECT * FROM district ORDER BY name');
    
    // Map the database column names to match the frontend expectations
    const mappedDistricts = districts.map(district => ({
      district_id: district.district_id,
      name: district.NAME || district.name
    }));
    
    return NextResponse.json(mappedDistricts);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
