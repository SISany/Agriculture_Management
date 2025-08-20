import { query } from '@/lib/database';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const transactions = await query(`
      SELECT t.*, 
             sb.name as buyer_name, 
             ss.name as seller_name, 
             p.name as product_name
      FROM transaction t
      LEFT JOIN stakeholder sb ON t.buyer_id = sb.stakeholder_id
      LEFT JOIN stakeholder ss ON t.seller_id = ss.stakeholder_id
      LEFT JOIN product p ON t.product_id = p.product_id
    `);
    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const sql = `
      INSERT INTO transaction (transaction_id, buyer_id, seller_id, product_id, quantity, price_per_unit, total_amount, date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await query(sql, [
      data.transaction_id, data.buyer_id, data.seller_id, data.product_id,
      data.quantity, data.price_per_unit, data.total_amount, data.date
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
      UPDATE transaction 
      SET buyer_id=?, seller_id=?, product_id=?, quantity=?, price_per_unit=?, total_amount=?, date=?
      WHERE transaction_id=?
    `;
    
    await query(sql, [
      data.buyer_id, data.seller_id, data.product_id, data.quantity,
      data.price_per_unit, data.total_amount, data.date, data.transaction_id
    ]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get('id');
    
    if (!transactionId) {
      return NextResponse.json({ error: 'Transaction ID required' }, { status: 400 });
    }
    
    await query('DELETE FROM transaction WHERE transaction_id = ?', [transactionId]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
