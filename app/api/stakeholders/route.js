import { query } from '@/lib/database';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const stakeholders = await query(`
      SELECT s.*, st.type_name, d.name as district_name 
      FROM stakeholder s
      LEFT JOIN stakeholder_type st ON s.type_id = st.type_id
      LEFT JOIN district d ON s.district_id = d.district_id
    `);
    return NextResponse.json(stakeholders);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const sql = `
      INSERT INTO stakeholder (stakeholder_id, name, type_id, district_id, contact_info)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    await query(sql, [
      data.stakeholder_id, data.name, data.type_id, 
      data.district_id, data.contact_info
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
      UPDATE stakeholder 
      SET name=?, type_id=?, district_id=?, contact_info=?
      WHERE stakeholder_id=?
    `;
    
    await query(sql, [
      data.name, data.type_id, data.district_id, 
      data.contact_info, data.stakeholder_id
    ]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const stakeholderId = searchParams.get('id');
    
    if (!stakeholderId) {
      return NextResponse.json({ error: 'Stakeholder ID required' }, { status: 400 });
    }
    
    await query('DELETE FROM stakeholder WHERE stakeholder_id = ?', [stakeholderId]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
