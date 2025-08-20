import { query } from '@/lib/database';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const weather = await query(`
      SELECT w.*, d.name as district_name
      FROM weather_daily w
      LEFT JOIN district d ON w.district_id = d.district_id
      ORDER BY w.date DESC
    `);
    return NextResponse.json(weather);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const sql = `
      INSERT INTO weather_daily (weather_id, district_id, date, rainfall, temperature)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    await query(sql, [
      data.weather_id, data.district_id, data.date, 
      data.rainfall, data.temperature
    ]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const sql = `
      UPDATE weather_daily 
      SET district_id=?, date=?, rainfall=?, temperature=?
      WHERE weather_id=?
    `;
    
    await query(sql, [
      data.district_id, data.date, data.rainfall, 
      data.temperature, data.weather_id
    ]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const weatherId = searchParams.get('id');
    
    if (!weatherId) {
      return NextResponse.json({ error: 'Weather ID required' }, { status: 400 });
    }
    
    await query('DELETE FROM weather_daily WHERE weather_id = ?', [weatherId]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
