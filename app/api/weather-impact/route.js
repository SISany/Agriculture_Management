import { query } from '@/lib/database';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const analysis_type = searchParams.get('type') || 'correlation';
    const product_id = searchParams.get('product_id');
    const district_id = searchParams.get('district_id');
    const start_date = searchParams.get('start_date');
    const end_date = searchParams.get('end_date');

    let result = {};

    switch (analysis_type) {
      case 'correlation':
        result = await getWeatherProductionCorrelation(product_id, district_id, start_date, end_date);
        break;
      case 'price_impact':
        result = await getWeatherPriceImpact(product_id, district_id, start_date, end_date);
        break;
      case 'seasonal_analysis':
        result = await getSeasonalWeatherAnalysis(product_id, district_id, start_date, end_date);
        break;
      case 'regional_comparison':
        result = await getRegionalWeatherComparison(product_id, start_date, end_date);
        break;
      default:
        return NextResponse.json({ error: 'Invalid analysis type' }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Analyze correlation between weather conditions and production
async function getWeatherProductionCorrelation(product_id, district_id, start_date, end_date) {
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
    whereClause += ' AND w.date BETWEEN ? AND ?';
    params.push(start_date, end_date);
  }

  const sql = `
    SELECT 
      p.product_id,
      p.name as product_name,
      p.variety,
      d.name as district_name,
      DATE_FORMAT(w.date, '%Y-%m') as month_year,
      AVG(w.rainfall) as avg_rainfall,
      AVG(w.temperature) as avg_temperature,
      SUM(prod.quantity_produced) as total_production,
      SUM(prod.acreage) as total_acreage,
      SUM(prod.quantity_produced) / SUM(prod.acreage) as productivity_per_acre,
      CASE 
        WHEN AVG(w.rainfall) > 20 THEN 'High Rainfall'
        WHEN AVG(w.rainfall) > 10 THEN 'Moderate Rainfall'
        ELSE 'Low Rainfall'
      END as rainfall_category,
      CASE 
        WHEN AVG(w.temperature) > 35 THEN 'High Temperature'
        WHEN AVG(w.temperature) > 25 THEN 'Moderate Temperature'
        ELSE 'Low Temperature'
      END as temperature_category
    FROM product p
    JOIN production prod ON p.product_id = prod.product_id
    JOIN district d ON prod.district_id = d.district_id
    JOIN weather_daily w ON d.district_id = w.district_id 
      AND DATE_FORMAT(prod.date, '%Y-%m') = DATE_FORMAT(w.date, '%Y-%m')
    WHERE ${whereClause}
    GROUP BY p.product_id, d.district_id, DATE_FORMAT(w.date, '%Y-%m')
    ORDER BY p.name, d.name, month_year DESC
  `;

  return await query(sql, params);
}

// Analyze how weather affects pricing
async function getWeatherPriceImpact(product_id, district_id, start_date, end_date) {
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
      w.rainfall,
      w.temperature,
      CASE 
        WHEN w.rainfall > 20 AND w.temperature < 30 THEN 'Optimal Weather'
        WHEN w.rainfall < 5 OR w.temperature > 40 THEN 'Extreme Weather'
        ELSE 'Normal Weather'
      END as weather_condition,
      LAG(pr.price_per_unit, 7) OVER (PARTITION BY p.product_id, d.district_id ORDER BY pr.date) as price_week_ago,
      ((pr.price_per_unit - LAG(pr.price_per_unit, 7) OVER (PARTITION BY p.product_id, d.district_id ORDER BY pr.date)) / 
       LAG(pr.price_per_unit, 7) OVER (PARTITION BY p.product_id, d.district_id ORDER BY pr.date)) * 100 as weekly_price_change
    FROM product p
    JOIN price pr ON p.product_id = pr.product_id
    JOIN district d ON pr.district_id = d.district_id
    JOIN weather_daily w ON d.district_id = w.district_id 
      AND DATE(pr.date) = DATE(w.date)
    WHERE ${whereClause}
    ORDER BY p.name, d.name, pr.date DESC
  `;

  return await query(sql, params);
}

// Seasonal weather analysis and its impact on agriculture
async function getSeasonalWeatherAnalysis(product_id, district_id, start_date, end_date) {
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
    whereClause += ' AND w.date BETWEEN ? AND ?';
    params.push(start_date, end_date);
  }

  const sql = `
    SELECT 
      p.product_id,
      p.name as product_name,
      p.sowing_time,
      p.harvest_time,
      d.name as district_name,
      QUARTER(w.date) as season_quarter,
      CASE 
        WHEN QUARTER(w.date) = 1 THEN 'Winter (Jan-Mar)'
        WHEN QUARTER(w.date) = 2 THEN 'Spring (Apr-Jun)'
        WHEN QUARTER(w.date) = 3 THEN 'Summer (Jul-Sep)'
        ELSE 'Autumn (Oct-Dec)'
      END as season_name,
      AVG(w.rainfall) as avg_seasonal_rainfall,
      AVG(w.temperature) as avg_seasonal_temperature,
      MIN(w.rainfall) as min_rainfall,
      MAX(w.rainfall) as max_rainfall,
      MIN(w.temperature) as min_temperature,
      MAX(w.temperature) as max_temperature,
      COUNT(DISTINCT DATE(w.date)) as days_recorded,
      SUM(CASE WHEN w.rainfall > 25 THEN 1 ELSE 0 END) as heavy_rain_days,
      SUM(CASE WHEN w.temperature > 35 THEN 1 ELSE 0 END) as extreme_heat_days,
      AVG(pr.price_per_unit) as avg_seasonal_price,
      SUM(prod.quantity_produced) as seasonal_production
    FROM product p
    LEFT JOIN weather_daily w ON 1=1
    LEFT JOIN district d ON w.district_id = d.district_id
    LEFT JOIN price pr ON p.product_id = pr.product_id 
      AND d.district_id = pr.district_id 
      AND QUARTER(w.date) = QUARTER(pr.date)
    LEFT JOIN production prod ON p.product_id = prod.product_id 
      AND d.district_id = prod.district_id 
      AND QUARTER(w.date) = QUARTER(prod.date)
    WHERE ${whereClause}
    GROUP BY p.product_id, d.district_id, QUARTER(w.date)
    ORDER BY p.name, d.name, season_quarter
  `;

  return await query(sql, params);
}

// Compare weather impact across different regions
async function getRegionalWeatherComparison(product_id, start_date, end_date) {
  let whereClause = '1=1';
  let params = [];

  if (product_id) {
    whereClause += ' AND p.product_id = ?';
    params.push(product_id);
  }
  if (start_date && end_date) {
    whereClause += ' AND w.date BETWEEN ? AND ?';
    params.push(start_date, end_date);
  }

  const sql = `
    SELECT 
      p.product_id,
      p.name as product_name,
      d.name as district_name,
      COUNT(DISTINCT DATE(w.date)) as recording_days,
      AVG(w.rainfall) as avg_rainfall,
      AVG(w.temperature) as avg_temperature,
      STDDEV(w.rainfall) as rainfall_variability,
      STDDEV(w.temperature) as temperature_variability,
      SUM(prod.quantity_produced) as total_production,
      AVG(pr.price_per_unit) as avg_price,
      RANK() OVER (PARTITION BY p.product_id ORDER BY SUM(prod.quantity_produced) DESC) as production_rank,
      RANK() OVER (PARTITION BY p.product_id ORDER BY AVG(pr.price_per_unit) ASC) as price_rank,
      CASE 
        WHEN AVG(w.rainfall) > 15 AND AVG(w.temperature) BETWEEN 25 AND 35 THEN 'Favorable'
        WHEN AVG(w.rainfall) < 5 OR AVG(w.temperature) > 40 OR AVG(w.temperature) < 20 THEN 'Challenging'
        ELSE 'Moderate'
      END as weather_suitability
    FROM product p
    CROSS JOIN district d
    LEFT JOIN weather_daily w ON d.district_id = w.district_id
    LEFT JOIN production prod ON p.product_id = prod.product_id 
      AND d.district_id = prod.district_id
    LEFT JOIN price pr ON p.product_id = pr.product_id 
      AND d.district_id = pr.district_id
    WHERE ${whereClause} AND w.date IS NOT NULL
    GROUP BY p.product_id, d.district_id
    ORDER BY p.name, production_rank
  `;

  return await query(sql, params);
}