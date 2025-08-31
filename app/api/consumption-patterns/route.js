import { query } from '@/lib/database';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const consumptionPatterns = await query(`
      SELECT 
        cr.*,
        s.name as stakeholder_name,
        s.type_id as stakeholder_type,
        st.type_name,
        p.name as product_name,
        p.type as product_type,
        d.name as district_name,
        CASE 
          WHEN s.type_id = 4 THEN 
            CASE 
              WHEN SUBSTRING(s.name, -12) LIKE '%High Income%' OR s.name LIKE '%Ali Family%' THEN 'Upper Class'
              WHEN SUBSTRING(s.name, -12) LIKE '%Middle Class%' OR s.name LIKE '%Khan Family%' THEN 'Middle Class'
              WHEN SUBSTRING(s.name, -11) LIKE '%Low Income%' OR s.name LIKE '%Begum Household%' THEN 'Lower Middle Class'
              WHEN s.name LIKE '%Urban%' OR s.name LIKE '%Ahmed Family%' THEN 'Upper Middle Class'
              ELSE 'General'
            END
          ELSE 'General'
        END as demographic_group,
        MONTH(cr.date) as month,
        YEAR(cr.date) as year,
        cr.date as consumption_date,
        cr.quantity as quantity_consumed,
        cr.quantity * 50 as amount_spent,
        CASE 
          WHEN s.name LIKE '%Family%' THEN 4
          WHEN s.name LIKE '%Household%' THEN 5
          ELSE 3
        END as household_size,
        CASE 
          WHEN s.name LIKE '%High Income%' OR s.name LIKE '%Ali Family%' THEN 80000
          WHEN s.name LIKE '%Middle Class%' OR s.name LIKE '%Khan Family%' THEN 45000
          WHEN s.name LIKE '%Low Income%' OR s.name LIKE '%Begum Household%' THEN 25000
          WHEN s.name LIKE '%Urban%' OR s.name LIKE '%Ahmed Family%' THEN 60000
          ELSE 35000
        END as per_capita_income
      FROM consumption_record cr
      LEFT JOIN stakeholder s ON cr.stakeholder_id = s.stakeholder_id
      LEFT JOIN stakeholder_type st ON s.type_id = st.type_id
      LEFT JOIN product p ON cr.product_id = p.product_id
      LEFT JOIN district d ON s.district_id = d.district_id
      ORDER BY cr.date DESC
    `);
    
    // Transform data to match expected interface
    const transformedData = consumptionPatterns.map(record => ({
      consumption_id: `C${record.record_id}`,
      stakeholder_id: record.stakeholder_id,
      product_id: record.product_id,
      district_id: record.district_id || 1,
      consumption_date: record.consumption_date,
      quantity_consumed: record.quantity_consumed,
      amount_spent: record.amount_spent,
      demographic_group: record.demographic_group,
      household_size: record.household_size,
      per_capita_income: record.per_capita_income,
      stakeholder_name: record.stakeholder_name,
      product_name: record.product_name,
      district_name: record.district_name,
      month: record.month,
      year: record.year
    }));
    
    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching consumption patterns:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
      console.log('Received consumption pattern data:', data);

      // First, let's validate that the stakeholder exists
      const stakeholderCheck = await query('SELECT stakeholder_id, name FROM stakeholder WHERE stakeholder_id = ?', [data.stakeholder_id]);
      console.log('Stakeholder check result:', stakeholderCheck);

      if (stakeholderCheck.length === 0) {
          return NextResponse.json({
              error: `Stakeholder with ID '${data.stakeholder_id}' does not exist. Please select a valid consumer from the dropdown.`
          }, {status: 400});
      }

      // Also validate product exists
      const productCheck = await query('SELECT product_id, name FROM product WHERE product_id = ?', [data.product_id]);
      console.log('Product check result:', productCheck);

      if (productCheck.length === 0) {
          return NextResponse.json({
              error: `Product with ID '${data.product_id}' does not exist. Please select a valid product.`
          }, {status: 400});
      }

      // For now, we'll insert into the consumption_record table with the basic fields
      // since the extended fields (demographic_group, household_size, per_capita_income, amount_spent, district_id)
      // are computed in the GET query based on stakeholder data
    const sql = `
      INSERT INTO consumption_record (stakeholder_id, product_id, date, quantity)
      VALUES (?, ?, ?, ?)
    `;
    
    await query(sql, [
      data.stakeholder_id, 
      data.product_id, 
      data.consumption_date, 
      data.quantity_consumed
    ]);

      return NextResponse.json({success: true, message: 'Consumption pattern added successfully'});
  } catch (error) {
      console.error('Database error:', error);
      return NextResponse.json({
          error: `Database error: ${error.message}. Please check that all required fields are filled correctly.`
      }, {status: 500});
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const sql = `
      UPDATE consumption_record 
      SET stakeholder_id=?, product_id=?, date=?, quantity=?
      WHERE record_id=?
    `;
    
    await query(sql, [
      data.stakeholder_id, 
      data.product_id, 
      data.consumption_date, 
      data.quantity_consumed,
      data.consumption_id.replace('C', '')
    ]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    await query('DELETE FROM consumption_record WHERE record_id = ?', [id.replace('C', '')]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
