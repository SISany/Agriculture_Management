import { query } from '@/lib/database';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const prices = await query(`
      SELECT p.*, 
             pr.name as product_name, 
             d.name as district_name
      FROM price p
      LEFT JOIN product pr ON p.product_id = pr.product_id
      LEFT JOIN district d ON p.district_id = d.district_id
      ORDER BY p.date DESC
    `);
    return NextResponse.json(prices);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const sql = `
      INSERT INTO price (product_id, district_id, date, price_per_unit)
      VALUES (?, ?, ?, ?)
    `;
    
    await query(sql, [
      data.product_id, data.district_id, data.date, data.price_per_unit
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
      UPDATE price 
      SET product_id=?, district_id=?, date=?, price_per_unit=?
      WHERE price_id=?
    `;
    
    await query(sql, [
      data.product_id, data.district_id, data.date, 
      data.price_per_unit, data.price_id
    ]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const priceId = searchParams.get('id');
    
    if (!priceId) {
      return NextResponse.json({ error: 'Price ID required' }, { status: 400 });
    }
    
    await query('DELETE FROM price WHERE price_id = ?', [priceId]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
