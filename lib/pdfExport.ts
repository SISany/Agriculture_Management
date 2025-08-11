import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
    interface jsPDF {
        autoTable: typeof autoTable
    }
}

export interface ExportColumn {
    header: string
    dataKey: string
    width?: number
}

export interface ExportOptions {
    title: string
    subtitle?: string
    filename: string
    columns: ExportColumn[]
    data: Record<string, unknown>[]
}

export const exportTableToPDF = (options: ExportOptions) => {
    const {title, subtitle, filename, columns, data} = options

    // Create new PDF document
    const doc = new jsPDF()

    // Set document properties
    doc.setProperties({
        title: title,
        subject: 'Agriculture Management System - Data Export',
        author: 'Agriculture Management System',
        creator: 'Agriculture Management System'
    })

    // Add title
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text(title, 20, 20)

    // Add subtitle if provided
    if (subtitle) {
        doc.setFontSize(12)
        doc.setFont('helvetica', 'normal')
        doc.text(subtitle, 20, 30)
    }

    // Add date
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
    doc.setFontSize(10)
    doc.text(`Generated on: ${currentDate}`, 20, subtitle ? 40 : 30)

    // Prepare table data
    const tableData = data.map(item => {
        return columns.map(col => item[col.dataKey] || '')
    })

    // Add table using autoTable
    autoTable(doc, {
        head: [columns.map(col => col.header)],
        body: tableData,
        startY: subtitle ? 50 : 40,
        theme: 'striped',
        headStyles: {
            fillColor: [59, 130, 246], // Blue color
            textColor: 255,
            fontStyle: 'bold'
        },
        bodyStyles: {
            textColor: 50
        },
        alternateRowStyles: {
            fillColor: [248, 250, 252]
        },
        margin: {top: 20, left: 20, right: 20, bottom: 20},
        styles: {
            fontSize: 8,
            cellPadding: 3
        }
    })

    // Add page numbers
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() - 40, doc.internal.pageSize.getHeight() - 10)
    }

    // Save the PDF
    doc.save(filename)
}

// Pre-configured export functions for different components
export const exportWeatherData = (data: Record<string, unknown>[]) => {
    exportTableToPDF({
        title: 'Weather Data Report',
        subtitle: 'Agriculture Management System - Weather Monitoring',
        filename: 'weather-data-report.pdf',
        columns: [
            {header: 'Weather ID', dataKey: 'weather_id', width: 20},
            {header: 'Location', dataKey: 'location', width: 30},
            {header: 'Date', dataKey: 'date_recorded', width: 25},
            {header: 'Rainfall (mm)', dataKey: 'rainfall', width: 25},
            {header: 'Temperature (°C)', dataKey: 'temperature', width: 30},
            {header: 'Season', dataKey: 'season', width: 20},
            {header: 'Humidity (%)', dataKey: 'humidity', width: 25}
        ],
        data
    })
}

export const exportProductData = (data: Record<string, unknown>[]) => {
    exportTableToPDF({
        title: 'Product Catalog Report',
        subtitle: 'Agriculture Management System - Product Directory',
        filename: 'product-catalog-report.pdf',
        columns: [
            {header: 'Product ID', dataKey: 'product_id', width: 20},
            {header: 'Name', dataKey: 'product_name', width: 25},
            {header: 'Type', dataKey: 'product_type', width: 20},
            {header: 'Variety', dataKey: 'variety', width: 25},
            {header: 'Sowing Time', dataKey: 'sowing_time', width: 25},
            {header: 'Transplanting', dataKey: 'transplanting_time', width: 25},
            {header: 'Harvest Time', dataKey: 'harvest_time', width: 25},
            {header: 'Per Acre Seed (kg)', dataKey: 'seed_requirement_per_acre', width: 25},
            {header: 'Nutrition (kcal)', dataKey: 'nutritional_value_per_unit', width: 25}
        ],
        data
    })
}

export const exportNutritionData = (data: Record<string, unknown>[]) => {
    exportTableToPDF({
        title: 'Nutrition Intake Report',
        subtitle: 'Agriculture Management System - Nutritional Analysis',
        filename: 'nutrition-intake-report.pdf',
        columns: [
            {header: 'Consumer', dataKey: 'stakeholder_name', width: 30},
            {header: 'Product', dataKey: 'product_name', width: 25},
            {header: 'Date', dataKey: 'intake_date', width: 25},
            {header: 'Nutrition Type', dataKey: 'nutrition_type', width: 30},
            {header: 'Actual Intake (g)', dataKey: 'per_capita_nutrition_intake', width: 30},
            {header: 'Recommended (g)', dataKey: 'recommended_intake', width: 30},
            {header: 'Health Status', dataKey: 'health_status', width: 25},
            {header: 'Income', dataKey: 'per_capita_income', width: 20},
            {header: 'Surplus/Deficit', dataKey: 'surplus_deficit', width: 25}
        ],
        data
    })
}

export const exportPriceData = (data: Record<string, unknown>[]) => {
    exportTableToPDF({
        title: 'Price History Report',
        subtitle: 'Agriculture Management System - Market Price Analysis',
        filename: 'price-history-report.pdf',
        columns: [
            {header: 'Price ID', dataKey: 'price_id', width: 20},
            {header: 'Product', dataKey: 'product_name', width: 25},
            {header: 'Location', dataKey: 'location', width: 25},
            {header: 'Date', dataKey: 'date_recorded', width: 25},
            {header: 'Wholesale ($)', dataKey: 'wholesale_price', width: 25},
            {header: 'Retail ($)', dataKey: 'retail_price', width: 25},
            {header: 'Harvest ($)', dataKey: 'harvest_season_price', width: 25},
            {header: 'Season', dataKey: 'season', width: 20}
        ],
        data
    })
}

export const exportProductionData = (data: Record<string, unknown>[]) => {
    exportTableToPDF({
        title: 'Production Management Report',
        subtitle: 'Agriculture Management System - Regional Production Data',
        filename: 'production-management-report.pdf',
        columns: [
            {header: 'Production ID', dataKey: 'production_id', width: 25},
            {header: 'Product', dataKey: 'product_name', width: 25},
            {header: 'District/Division', dataKey: 'district_division', width: 35},
            {header: 'Quantity (tons)', dataKey: 'quantity_produced', width: 30},
            {header: 'Acreage', dataKey: 'acreage', width: 25},
            {header: 'Season', dataKey: 'season', width: 20},
            {header: 'Date', dataKey: 'production_date', width: 25}
        ],
        data
    })
}

export const exportConsumptionData = (data: Record<string, unknown>[]) => {
    exportTableToPDF({
        title: 'Consumption Pattern Report',
        subtitle: 'Agriculture Management System - Consumer Behavior Analysis',
        filename: 'consumption-pattern-report.pdf',
        columns: [
            {header: 'Consumer', dataKey: 'consumer_name', width: 30},
            {header: 'Product', dataKey: 'product_name', width: 25},
            {header: 'Date', dataKey: 'consumption_date', width: 25},
            {header: 'Quantity (kg)', dataKey: 'quantity_consumed', width: 25},
            {header: 'Amount Spent (৳)', dataKey: 'amount_spent', width: 30},
            {header: 'Location', dataKey: 'location', width: 25},
            {header: 'Season', dataKey: 'season', width: 20},
            {header: 'Household Size', dataKey: 'household_size', width: 25}
        ],
        data
    })
}

export const exportTransactionData = (data: Record<string, unknown>[]) => {
    exportTableToPDF({
        title: 'Transaction Management Report',
        subtitle: 'Agriculture Management System - Financial Transaction Records',
        filename: 'transaction-report.pdf',
        columns: [
            {header: 'Transaction ID', dataKey: 'transaction_id', width: 30},
            {header: 'Buyer', dataKey: 'buyer_name', width: 30},
            {header: 'Seller', dataKey: 'seller_name', width: 30},
            {header: 'Product', dataKey: 'product_name', width: 25},
            {header: 'Quantity', dataKey: 'quantity', width: 20},
            {header: 'Price/Unit ($)', dataKey: 'price_per_unit', width: 25},
            {header: 'Total ($)', dataKey: 'total_amount', width: 25},
            {header: 'Date', dataKey: 'transaction_date', width: 25}
        ],
        data
    })
}