import { query } from '@/lib/database';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const analysis_type = searchParams.get('type') || 'overview';
    const product_id = searchParams.get('product_id');
    const district_id = searchParams.get('district_id');
    const start_date = searchParams.get('start_date');
    const end_date = searchParams.get('end_date');

    let result = {};

    switch (analysis_type) {
      case 'overview':
        result = await getDemandSupplyOverview(product_id, district_id, start_date, end_date);
        break;
      case 'surplus_deficit':
        result = await getSurplusDeficitAnalysis(product_id, district_id, start_date, end_date);
        break;
      case 'price_trends':
        result = await getPriceTrendAnalysis(product_id, district_id, start_date, end_date);
        break;
      case 'consumption_patterns':
        result = await getConsumptionPatterns(product_id, district_id, start_date, end_date);
        break;
      case 'stakeholder_comparison':
        result = await getStakeholderComparison(product_id, district_id, start_date, end_date);
        break;
      default:
        return NextResponse.json({ error: 'Invalid analysis type' }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Get overall demand vs supply overview
async function getDemandSupplyOverview(product_id, district_id, start_date, end_date) {
  let whereClause = '1=1';
  let params = [];

  if (product_id) {
    whereClause += ' AND p.product_id = ?';
    params.push(product_id);
  }
  if (district_id) {
    whereClause += ' AND prod.district_id = ?';
    params.push(district_id);
  }
  if (start_date && end_date) {
    whereClause += ' AND prod.date BETWEEN ? AND ?';
    params.push(start_date, end_date);
  }

  const sql = `
    SELECT 
      p.product_id,
      p.name as product_name,
      p.type,
      p.variety,
      d.name as district_name,
      SUM(prod.quantity_produced) as total_supply,
      SUM(cr.quantity) as total_consumption,
      AVG(pr.price_per_unit) as avg_price,
      COUNT(DISTINCT t.transaction_id) as transaction_count,
      SUM(prod.quantity_produced) - COALESCE(SUM(cr.quantity), 0) as surplus_deficit
    FROM product p
    LEFT JOIN production prod ON p.product_id = prod.product_id
    LEFT JOIN district d ON prod.district_id = d.district_id
    LEFT JOIN consumption_record cr ON p.product_id = cr.product_id
    LEFT JOIN price pr ON p.product_id = pr.product_id AND prod.district_id = pr.district_id
    LEFT JOIN transaction t ON p.product_id = t.product_id
    WHERE ${whereClause}
    GROUP BY p.product_id, prod.district_id
    ORDER BY p.name, d.name
  `;

  const results = await query(sql, params);
  
  // Convert string numbers to proper numbers
  return results.map(row => ({
    ...row,
    total_supply: parseFloat(row.total_supply) || 0,
    total_consumption: parseFloat(row.total_consumption) || 0,
    avg_price: parseFloat(row.avg_price) || 0,
    transaction_count: parseInt(row.transaction_count) || 0,
    surplus_deficit: parseFloat(row.surplus_deficit) || 0
  }));
}

// Calculate monthly surplus/deficit based on production vs consumption
async function getSurplusDeficitAnalysis(product_id, district_id, start_date, end_date) {
  let whereClause = '1=1';
  let params = [];

  if (product_id) {
    whereClause += ' AND p.product_id = ?';
    params.push(product_id);
  }
  if (district_id) {
    whereClause += ' AND d.district_id = ?';
    params.push(district_id);
  }
  if (start_date && end_date) {
    whereClause += ' AND DATE(prod.date) BETWEEN ? AND ?';
    params.push(start_date, end_date);
  }

  const sql = `
    SELECT 
      p.product_id,
      p.name as product_name,
      d.name as district_name,
      YEAR(prod.date) as year,
      MONTH(prod.date) as month,
      SUM(prod.quantity_produced) as monthly_production,
      nt.per_capita_requirement * 1000000 as estimated_monthly_demand,
      SUM(prod.quantity_produced) - (nt.per_capita_requirement * 1000000) as surplus_deficit,
      CASE 
        WHEN SUM(prod.quantity_produced) > (nt.per_capita_requirement * 1000000) 
        THEN 'Surplus'
        ELSE 'Deficit'
      END as status
    FROM product p
    LEFT JOIN production prod ON p.product_id = prod.product_id
    LEFT JOIN district d ON prod.district_id = d.district_id
    LEFT JOIN nutrition_targets nt ON p.product_id = nt.product_id 
      AND MONTH(prod.date) = nt.month 
      AND YEAR(prod.date) = nt.year
    WHERE ${whereClause} AND prod.date IS NOT NULL
    GROUP BY p.product_id, d.district_id, YEAR(prod.date), MONTH(prod.date)
    ORDER BY p.name, d.name, year DESC, month DESC
  `;

  return await query(sql, params);
}

// Analyze price trends and elasticity
async function getPriceTrendAnalysis(product_id, district_id, start_date, end_date) {
  let whereClause = '1=1';
  let params = [];

  if (product_id) {
    whereClause += ' AND p.product_id = ?';
    params.push(product_id);
  }
  if (district_id) {
    whereClause += ' AND pr.district_id = ?';
    params.push(district_id);
  }
  if (start_date && end_date) {
    whereClause += ' AND pr.date BETWEEN ? AND ?';
    params.push(start_date, end_date);
  }

  const sql = `
    SELECT 
      p.product_id,
      p.name as product_name,
      d.name as district_name,
      pr.date,
      pr.price_per_unit,
      prod.quantity_produced,
      w.rainfall,
      w.temperature,
      LAG(pr.price_per_unit) OVER (PARTITION BY p.product_id, pr.district_id ORDER BY pr.date) as prev_price,
      ((pr.price_per_unit - LAG(pr.price_per_unit) OVER (PARTITION BY p.product_id, pr.district_id ORDER BY pr.date)) / 
       LAG(pr.price_per_unit) OVER (PARTITION BY p.product_id, pr.district_id ORDER BY pr.date)) * 100 as price_change_percent
    FROM product p
    JOIN price pr ON p.product_id = pr.product_id
    JOIN district d ON pr.district_id = d.district_id
    LEFT JOIN production prod ON p.product_id = prod.product_id 
      AND pr.district_id = prod.district_id 
      AND DATE(pr.date) = DATE(prod.date)
    LEFT JOIN weather_daily w ON pr.district_id = w.district_id 
      AND DATE(pr.date) = DATE(w.date)
    WHERE ${whereClause}
    ORDER BY p.name, d.name, pr.date DESC
  `;

  return await query(sql, params);
}

// Analyze consumption patterns by stakeholder type
async function getConsumptionPatterns(product_id, district_id, start_date, end_date) {
  let whereClause = '1=1';
  let params = [];

  if (product_id) {
    whereClause += ' AND p.product_id = ?';
    params.push(product_id);
  }
  if (district_id) {
    whereClause += ' AND s.district_id = ?';
    params.push(district_id);
  }
  if (start_date && end_date) {
    whereClause += ' AND cr.date BETWEEN ? AND ?';
    params.push(start_date, end_date);
  }

  const sql = `
    SELECT 
      p.product_id,
      p.name as product_name,
      st.type_name as stakeholder_type,
      d.name as district_name,
      COUNT(DISTINCT s.stakeholder_id) as stakeholder_count,
      SUM(cr.quantity) as total_consumption,
      AVG(cr.quantity) as avg_consumption_per_stakeholder,
      MONTH(cr.date) as consumption_month,
      YEAR(cr.date) as consumption_year
    FROM product p
    JOIN consumption_record cr ON p.product_id = cr.product_id
    JOIN stakeholder s ON cr.stakeholder_id = s.stakeholder_id
    JOIN stakeholder_type st ON s.type_id = st.type_id
    JOIN district d ON s.district_id = d.district_id
    WHERE ${whereClause}
    GROUP BY p.product_id, st.type_id, s.district_id, YEAR(cr.date), MONTH(cr.date)
    ORDER BY p.name, st.type_name, consumption_year DESC, consumption_month DESC
  `;

  return await query(sql, params);
}

// Compare supply vs demand across different stakeholder types
async function getStakeholderComparison(product_id, district_id, start_date, end_date) {
  let whereClause = '1=1';
  let params = [];

  if (product_id) {
    whereClause += ' AND p.product_id = ?';
    params.push(product_id);
  }
  if (district_id) {
    whereClause += ' AND d.district_id = ?';
    params.push(district_id);
  }
  if (start_date && end_date) {
    whereClause += ' AND t.date BETWEEN ? AND ?';
    params.push(start_date, end_date);
  }

  const sql = `
    SELECT 
      p.product_id,
      p.name as product_name,
      d.name as district_name,
      seller_type.type_name as seller_type,
      buyer_type.type_name as buyer_type,
      COUNT(t.transaction_id) as transaction_count,
      SUM(t.quantity) as total_quantity_traded,
      AVG(t.price_per_unit) as avg_transaction_price,
      SUM(t.total_amount) as total_trade_value,
      AVG(t.total_amount) as avg_transaction_value
    FROM product p
    JOIN transaction t ON p.product_id = t.product_id
    JOIN stakeholder seller ON t.seller_id = seller.stakeholder_id
    JOIN stakeholder buyer ON t.buyer_id = buyer.stakeholder_id
    JOIN stakeholder_type seller_type ON seller.type_id = seller_type.type_id
    JOIN stakeholder_type buyer_type ON buyer.type_id = buyer_type.type_id
    JOIN district d ON seller.district_id = d.district_id
    WHERE ${whereClause}
    GROUP BY p.product_id, d.district_id, seller.type_id, buyer.type_id
    ORDER BY p.name, d.name, total_trade_value DESC
  `;

  return await query(sql, params);
}