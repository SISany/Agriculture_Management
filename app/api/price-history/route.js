import {query} from '@/lib/database';
import {NextResponse} from 'next/server';

export async function GET(request) {
    try {
        const {searchParams} = new URL(request.url);
        const productId = searchParams.get('product_id');
        const districtId = searchParams.get('district_id');
        const startYear = searchParams.get('start_year');
        const endYear = searchParams.get('end_year');
        const startDate = searchParams.get('start_date');
        const endDate = searchParams.get('end_date');

        let sql = `
      SELECT 
        CONCAT('PR', p.product_id, '_', p.district_id, '_', DATE_FORMAT(p.date, '%Y%m%d')) as price_id,
        p.product_id,
        p.district_id,
        p.date,
        p.price_per_unit as harvest_price,
        p.price_per_unit * 1.1 as wholesale_price,
        p.price_per_unit * 1.2 as retail_price,
        pr.name as product_name,
        d.name as district_name
      FROM price p
      LEFT JOIN product pr ON p.product_id = pr.product_id
      LEFT JOIN district d ON p.district_id = d.district_id
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

        if (startDate) {
            sql += ' AND p.date >= ?';
            params.push(startDate);
        }

        if (endDate) {
            sql += ' AND p.date <= ?';
            params.push(endDate);
        }

        sql += ' ORDER BY p.date DESC';

        const prices = await query(sql, params);
        return NextResponse.json(prices);
    } catch (error) {
        console.error('Error fetching price history:', error);
        return NextResponse.json({error: error.message}, {status: 500});
    }
}