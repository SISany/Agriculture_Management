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
        nt.product_id,
        s.district_id,
        nt.month,
        nt.year,
        nt.per_capita_requirement,
        COALESCE(AVG(cr.quantity), 0) as actual_consumption,
        (COALESCE(AVG(cr.quantity), 0) - nt.per_capita_requirement) as surplus_deficit,
        CASE 
          WHEN (COALESCE(AVG(cr.quantity), 0) - nt.per_capita_requirement) > 0 THEN 'Surplus'
          WHEN (COALESCE(AVG(cr.quantity), 0) - nt.per_capita_requirement) < -5 THEN 'Severe Deficit'
          WHEN (COALESCE(AVG(cr.quantity), 0) - nt.per_capita_requirement) < 0 THEN 'Deficit'
          ELSE 'Adequate'
        END as nutritional_status
      FROM nutrition_targets nt
      LEFT JOIN consumption_record cr ON nt.product_id = cr.product_id 
        AND MONTH(cr.date) = nt.month 
        AND YEAR(cr.date) = nt.year
      LEFT JOIN stakeholder s ON cr.stakeholder_id = s.stakeholder_id
      WHERE 1=1
    `;

        let params = [];

        if (productId && productId !== 'all') {
            sql += ' AND nt.product_id = ?';
            params.push(productId);
        }

        if (districtId && districtId !== 'all') {
            sql += ' AND s.district_id = ?';
            params.push(districtId);
        }

        if (startYear) {
            sql += ' AND nt.year >= ?';
            params.push(startYear);
        }

        if (endYear) {
            sql += ' AND nt.year <= ?';
            params.push(endYear);
        }

        sql += `
      GROUP BY nt.product_id, s.district_id, nt.month, nt.year, nt.per_capita_requirement
      ORDER BY nt.year DESC, nt.month DESC
    `;

        const nutritionData = await query(sql, params);
        return NextResponse.json(nutritionData);
    } catch (error) {
        console.error('Error fetching nutrition analysis:', error);
        return NextResponse.json({error: error.message}, {status: 500});
    }
}