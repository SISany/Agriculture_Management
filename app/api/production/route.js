import { query } from '@/lib/database';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const productions = await query(`
      SELECT p.*, pr.name as product_name, d.name as district_name 
      FROM production p
      LEFT JOIN product pr ON p.product_id = pr.product_id
      LEFT JOIN district d ON p.district_id = d.district_id
    `);
    
    // Map the database column names to match the frontend expectations
    const mappedProductions = productions.map(production => ({
      production_id: production.production_id,
      product_id: production.product_id,
      district_id: production.district_id,
      date: production.DATE || production.date, // Handle both cases
      acreage: parseFloat(production.acreage) || 0,
      quantity_produced: parseFloat(production.quantity_produced) || 0,
      product_name: production.product_name,
      district_name: production.district_name
    }));
    
    return NextResponse.json(mappedProductions);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const sql = `
      INSERT INTO production (production_id, product_id, district_id, date, acreage, quantity_produced)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    await query(sql, [
      data.production_id, data.product_id, data.district_id, 
      data.date, data.acreage, data.quantity_produced
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
      UPDATE production 
      SET product_id=?, district_id=?, date=?, acreage=?, quantity_produced=?
      WHERE production_id=?
    `;
    
    await query(sql, [
      data.product_id, data.district_id, data.date, 
      data.acreage, data.quantity_produced, data.production_id
    ]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productionId = searchParams.get('id');
    
    if (!productionId) {
      return NextResponse.json({ error: 'Production ID required' }, { status: 400 });
    }
    
    await query('DELETE FROM production WHERE production_id = ?', [productionId]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
