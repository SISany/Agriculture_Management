import {query} from '@/lib/database';
import {NextResponse} from 'next/server';

export async function GET(request) {
    try {
        const {searchParams} = new URL(request.url);
        const productId = searchParams.get('product_id');
        const districtId = searchParams.get('district_id');
        const startYear = searchParams.get('start_year');
        const endYear = searchParams.get('end_year');

        let sql = `
      SELECT 
        p.product_id,
        p.district_id,
        CONCAT(YEAR(p.date), '-', LPAD(MONTH(p.date), 2, '0')) as period,
        SUM(p.quantity_produced) as producer_supply,
        SUM(p.quantity_produced) * 0.8 as wholesaler_demand,
        SUM(p.quantity_produced) * 0.9 as retailer_demand,
        COALESCE(SUM(cr.quantity), 0) as consumer_demand,
        CASE 
          WHEN SUM(p.quantity_produced) > COALESCE(SUM(cr.quantity), 0) THEN 
            ((SUM(p.quantity_produced) - COALESCE(SUM(cr.quantity), 0)) / SUM(p.quantity_produced)) * -10
          ELSE 
            ((COALESCE(SUM(cr.quantity), 0) - SUM(p.quantity_produced)) / SUM(p.quantity_produced)) * 15
        END as price_impact
      FROM production p
      LEFT JOIN consumption_record cr ON p.product_id = cr.product_id 
        AND YEAR(p.date) = YEAR(cr.date) 
        AND MONTH(p.date) = MONTH(cr.date)
      LEFT JOIN stakeholder s ON cr.stakeholder_id = s.stakeholder_id
        AND p.district_id = s.district_id
      WHERE 1=1
    `;

        let params = [];

        if (productId && productId !== 'all') {
            sql += ' AND p.product_id = ?';
            params.push(productId);
        }

        if (districtId && districtId !== 'all') {
            sql += ' AND p.district_id = ?';
            params.push(districtId);
        }

        if (startYear) {
            sql += ' AND YEAR(p.date) >= ?';
            params.push(startYear);
        }

        if (endYear) {
            sql += ' AND YEAR(p.date) <= ?';
            params.push(endYear);
        }

        sql += `
      GROUP BY p.product_id, p.district_id, YEAR(p.date), MONTH(p.date)
      HAVING SUM(p.quantity_produced) > 0
      ORDER BY YEAR(p.date) DESC, MONTH(p.date) DESC
    `;

        const supplyDemandData = await query(sql, params);
        return NextResponse.json(supplyDemandData);
    } catch (error) {
        console.error('Error fetching supply-demand comparison:', error);
        return NextResponse.json({error: error.message}, {status: 500});
    }
}