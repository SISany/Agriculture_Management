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
      SELECT p.*, pr.name as product_name, d.name as district_name 
      FROM production p
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

        const production = await query(sql, params);

        // Transform data to match expected interface
        const transformedData = production.map(record => ({
            production_id: record.production_id,
            product_id: record.product_id,
            district_id: record.district_id,
            division: record.division || 'Unknown',
            year: new Date(record.date).getFullYear(),
            month: new Date(record.date).getMonth() + 1,
            acreage: record.acreage || 0,
            quantity_produced: record.quantity_produced || 0,
            product_name: record.product_name,
            district_name: record.district_name,
            date: record.date
        }));

        return NextResponse.json(transformedData);
    } catch (error) {
        console.error('Error fetching production data:', error);
        return NextResponse.json({error: error.message}, {status: 500});
    }
}