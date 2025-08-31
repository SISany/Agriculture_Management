import { query } from '@/lib/database';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const products = await query('SELECT * FROM product');
    
    // Map the database column names to match the frontend expectations
    const mappedProducts = products.map(product => ({
      product_id: product.product_id,
      name: product.NAME || product.name,
      type: product.TYPE || product.type,
      variety: product.variety,
      sowing_time: product.sowing_time,
      harvest_time: product.harvest_time,
      seed_requirement_per_acre: parseFloat(product.seed_requirement_per_acre) || 0
    }));
    
    return NextResponse.json(mappedProducts);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const sql = `
      INSERT INTO product (product_id, name, type, variety, sowing_time, harvest_time, seed_requirement_per_acre)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    await query(sql, [
      data.product_id, data.name, data.type, data.variety,
      data.sowing_time, data.harvest_time, data.seed_requirement_per_acre
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
      UPDATE product 
      SET name=?, type=?, variety=?, sowing_time=?, harvest_time=?, seed_requirement_per_acre=?
      WHERE product_id=?
    `;
    
    await query(sql, [
      data.name, data.type, data.variety, data.sowing_time, 
      data.harvest_time, data.seed_requirement_per_acre, data.product_id
    ]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');
    
    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }
    
    await query('DELETE FROM product WHERE product_id = ?', [productId]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
