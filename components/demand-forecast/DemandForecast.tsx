"use client"

import {useState} from "react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Badge} from "@/components/ui/badge"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart"
import {
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    ComposedChart,
    Legend
} from "recharts"
import {
    Search,
    Download,
    Plus,
    Edit2,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    Target,
    BarChart3,
    Trash2,
    Package,
    MapPin,
    Calendar,
    FileDown
} from "lucide-react"
import {exportTableToPDF} from "@/lib/pdfExport"

// TypeScript interfaces
interface DemandForecast {
    demand_id: string
    product_id: string
    product_name: string
    location: string
    forecast_date: string
    projected_demand: number
    current_supply: number
    forecast_period: string
    price_elasticity: number
    weather_id: string
    accuracy_percentage: number
    demand_trend: 'Increasing' | 'Decreasing' | 'Stable'
    season: string
}

// Mock data

export default function DemandForecast() {
    const [searchTerm, setSearchTerm] = useState("")
    const [showAddForm, setShowAddForm] = useState(false)
    const [demandData, setDemandData] = useState<DemandForecast[]>([
        {
            demand_id: "DF001",
            product_id: "P001",
            product_name: "Wheat",
            location: "Dhaka",
            forecast_date: "2024-02-01",
            projected_demand: 15000,
            current_supply: 12000,
            forecast_period: "Next 3 Months",
            price_elasticity: -0.8,
            weather_id: "W001",
            accuracy_percentage: 87,
            demand_trend: "Increasing",
            season: "Spring"
        },
        {
            demand_id: "DF002",
            product_id: "P002",
            product_name: "Rice",
            location: "Chittagong",
            forecast_date: "2024-02-01",
            projected_demand: 22000,
            current_supply: 25000,
            forecast_period: "Next 3 Months",
            price_elasticity: -0.6,
            weather_id: "W002",
            accuracy_percentage: 92,
            demand_trend: "Stable",
            season: "Spring"
        },
        {
            demand_id: "DF003",
            product_id: "P003",
            product_name: "Corn",
            location: "Sylhet",
            forecast_date: "2024-02-01",
            projected_demand: 8000,
            current_supply: 10000,
            forecast_period: "Next 3 Months",
            price_elasticity: -1.2,
            weather_id: "W003",
            accuracy_percentage: 83,
            demand_trend: "Decreasing",
            season: "Spring"
        },
        {
            demand_id: "DF004",
            product_id: "P001",
            product_name: "Wheat",
            location: "Rajshahi",
            forecast_date: "2024-02-01",
            projected_demand: 18000,
            current_supply: 16000,
            forecast_period: "Next 6 Months",
            price_elasticity: -0.9,
            weather_id: "W004",
            accuracy_percentage: 89,
            demand_trend: "Increasing",
            season: "Spring"
        },
        {
            demand_id: "DF005",
            product_id: "P002",
            product_name: "Rice",
            location: "Khulna",
            forecast_date: "2024-02-01",
            projected_demand: 16500,
            current_supply: 14000,
            forecast_period: "Next 6 Months",
            price_elasticity: -0.7,
            weather_id: "W005",
            accuracy_percentage: 85,
            demand_trend: "Increasing",
            season: "Spring"
        }
    ])

    // Form state
    const [formData, setFormData] = useState({
        demand_id: "",
        product_name: "",
        location: "",
        forecast_date: "",
        projected_demand: "",
        current_supply: "",
        forecast_period: "",
        price_elasticity: "",
        accuracy_percentage: "",
        demand_trend: "",
        season: "",
        weather_id: "",
        product_id: ""
    })

    const [selectedLocation, setSelectedLocation] = useState("all")
    const [selectedProduct, setSelectedProduct] = useState("all")
    const [selectedPeriod, setSelectedPeriod] = useState("all")

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Validate form
        if (!formData.demand_id || !formData.product_name || !formData.location || !formData.projected_demand) {
            alert("Please fill in all required fields")
            return
        }

        // Create new demand forecast
        const newForecast: DemandForecast = {
            demand_id: formData.demand_id,
            product_id: formData.product_id || `P${String(demandData.length + 1).padStart(3, '0')}`,
            product_name: formData.product_name,
            location: formData.location,
            forecast_date: formData.forecast_date || new Date().toISOString().split('T')[0],
            projected_demand: parseFloat(formData.projected_demand) || 0,
            current_supply: parseFloat(formData.current_supply) || 0,
            forecast_period: formData.forecast_period,
            price_elasticity: parseFloat(formData.price_elasticity) || 0,
            weather_id: formData.weather_id,
            accuracy_percentage: parseFloat(formData.accuracy_percentage) || 85,
            demand_trend: (formData.demand_trend as 'Increasing' | 'Decreasing' | 'Stable') || 'Stable',
            season: formData.season
        }

        // Add to the forecasts list (in a real app, this would be sent to backend)
        setDemandData([...demandData, newForecast])

        // Reset form
        setFormData({
            demand_id: "",
            product_name: "",
            location: "",
            forecast_date: "",
            projected_demand: "",
            current_supply: "",
            forecast_period: "",
            price_elasticity: "",
            weather_id: "",
            accuracy_percentage: "",
            demand_trend: "",
            season: "",
            product_id: ""
        })

        alert("Demand forecast data submitted successfully!")
    }

    const handleDelete = (demandId: string) => {
        if (confirm("Are you sure you want to delete this demand forecast?")) {
            setDemandData(prev => prev.filter(forecast => forecast.demand_id !== demandId))
        }
    }

    const filteredForecasts = demandData.filter(forecast => {
        const matchesSearch = forecast.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            forecast.location.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesLocation = selectedLocation === "all" || forecast.location === selectedLocation
        const matchesProduct = selectedProduct === "all" || forecast.product_name === selectedProduct
        const matchesPeriod = selectedPeriod === "all" || forecast.forecast_period === selectedPeriod
        return matchesSearch && matchesLocation && matchesProduct && matchesPeriod
    })

    // Updated statistics based on filteredForecasts
    const totalProjectedDemand = filteredForecasts.reduce((sum, forecast) => sum + forecast.projected_demand, 0)
    const totalCurrentSupply = filteredForecasts.reduce((sum, forecast) => sum + forecast.current_supply, 0)
    const avgAccuracy = filteredForecasts.reduce((sum, forecast) => sum + forecast.accuracy_percentage, 0) / filteredForecasts.length || 0
    const supplyGap = totalProjectedDemand - totalCurrentSupply

    // Prepare chart data for new chart requirements
    const demandSupplyTrendData = [
        {month: "Jan", wheat_demand: 14000, wheat_supply: 11000, rice_demand: 20000, rice_supply: 23000},
        {month: "Feb", wheat_demand: 15000, wheat_supply: 12000, rice_demand: 22000, rice_supply: 25000},
        {month: "Mar", wheat_demand: 16500, wheat_supply: 14000, rice_demand: 21000, rice_supply: 24000},
        {month: "Apr", wheat_demand: 18000, wheat_supply: 16000, rice_demand: 23000, rice_supply: 26000},
        {month: "May", wheat_demand: 19000, wheat_supply: 17500, rice_demand: 24500, rice_supply: 27000},
        {month: "Jun", wheat_demand: 17000, wheat_supply: 16000, rice_demand: 22500, rice_supply: 25500}
    ]

    // Regional Gap Chart Data
    const regionalGapData = [
        {region: "Dhaka", projected_demand: 15000, current_supply: 12000, supply_gap: 3000},
        {region: "Chittagong", projected_demand: 22000, current_supply: 25000, supply_gap: -3000},
        {region: "Sylhet", projected_demand: 8000, current_supply: 10000, supply_gap: -2000},
        {region: "Rajshahi", projected_demand: 18000, current_supply: 16000, supply_gap: 2000},
        {region: "Khulna", projected_demand: 16500, current_supply: 14000, supply_gap: 2500}
    ]

    const handleExport = () => {
        exportTableToPDF({
            title: 'Demand Forecast Report',
            subtitle: 'Agriculture Management System - Demand Analysis',
            filename: 'demand-forecast-report.pdf',
            columns: [
                {header: 'Forecast ID', dataKey: 'demand_id', width: 25},
                {header: 'Product', dataKey: 'product_name', width: 25},
                {header: 'Location', dataKey: 'location', width: 30},
                {header: 'Forecast Date', dataKey: 'forecast_date', width: 25},
                {header: 'Projected Demand', dataKey: 'projected_demand', width: 30},
                {header: 'Current Supply', dataKey: 'current_supply', width: 30},
                {header: 'Supply Gap', dataKey: 'supply_gap', width: 25},
                {header: 'Period', dataKey: 'forecast_period', width: 25},
                {header: 'Trend', dataKey: 'demand_trend', width: 25},
                {header: 'Accuracy', dataKey: 'accuracy_percentage', width: 25}
            ],
            data: filteredForecasts.map(forecast => ({
                demand_id: forecast.demand_id,
                product_name: forecast.product_name,
                location: forecast.location,
                forecast_date: forecast.forecast_date,
                projected_demand: forecast.projected_demand,
                current_supply: forecast.current_supply,
                supply_gap: forecast.projected_demand - forecast.current_supply,
                forecast_period: forecast.forecast_period,
                demand_trend: forecast.demand_trend,
                accuracy_percentage: `${forecast.accuracy_percentage}%`
            }))
        })
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Demand Forecast Analytics</h1>
                        <p className="text-muted-foreground text-lg">AI-powered demand forecasting and supply gap analysis</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" onClick={handleExport}>
                            <FileDown className="w-4 h-4 mr-2"/>
                            Export Data
                        </Button>
                        <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2"/>
                            Export Report
                        </Button>
                        <Button variant="default" size="sm" onClick={() => setShowAddForm(!showAddForm)}>
                            <Plus className="w-4 h-4 mr-2"/>
                            Add Demand Forecast
                        </Button>
                    </div>
                </div>

                {/* 1. STATISTICS CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="bg-card border border-blue-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Projected Demand</CardTitle>
                            <Target className="h-4 w-4 text-blue-600"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalProjectedDemand.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">tons (next period)</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border border-green-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Current Supply</CardTitle>
                            <BarChart3 className="h-4 w-4 text-green-600"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalCurrentSupply.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">tons available</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border border-red-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Supply Gap</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-red-600"/>
                        </CardHeader>
                        <CardContent>
                            <div
                                className="text-2xl font-bold text-red-600">{Math.abs(supplyGap).toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">{supplyGap > 0 ? "Shortage" : "Surplus"}</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border border-purple-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg Accuracy</CardTitle>
                            <TrendingUp className="h-4 w-4 text-purple-600"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{avgAccuracy.toFixed(1)}%</div>
                            <p className="text-xs text-muted-foreground">Forecast precision</p>
                        </CardContent>
                    </Card>
                </div>

                {/* 2. ENTRY DATA FORM */}
                {showAddForm && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">Submit Demand Forecast Data</CardTitle>
                            <CardDescription>Enter new demand forecast information</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Form Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Demand ID */}
                                    <div className="space-y-2">
                                        <label htmlFor="demand_id" className="flex items-center gap-2 text-blue-600">
                                            <Target className="w-4 h-4"/>
                                            Demand ID
                                        </label>
                                        <Input
                                            id="demand_id"
                                            placeholder="Enter demand forecast ID"
                                            value={formData.demand_id}
                                            onChange={(e) => handleInputChange("demand_id", e.target.value)}
                                        />
                                    </div>

                                    {/* Product Name */}
                                    <div className="space-y-2">
                                        <label htmlFor="product_name" className="flex items-center gap-2 text-blue-600">
                                            <Package className="w-4 h-4"/>
                                            Product Name
                                        </label>
                                        <Select value={formData.product_name}
                                                onValueChange={(value) => handleInputChange("product_name", value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select product"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Wheat">Wheat</SelectItem>
                                                <SelectItem value="Rice">Rice</SelectItem>
                                                <SelectItem value="Corn">Corn</SelectItem>
                                                <SelectItem value="Soybeans">Soybeans</SelectItem>
                                                <SelectItem value="Barley">Barley</SelectItem>
                                                <SelectItem value="Lentils">Lentils</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Product ID */}
                                    <div className="space-y-2">
                                        <label htmlFor="product_id" className="flex items-center gap-2 text-blue-600">
                                            <Package className="w-4 h-4"/>
                                            Product ID
                                        </label>
                                        <Input
                                            id="product_id"
                                            placeholder="Enter product ID"
                                            value={formData.product_id}
                                            onChange={(e) => handleInputChange("product_id", e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Location */}
                                    <div className="space-y-2">
                                        <label htmlFor="location" className="flex items-center gap-2 text-blue-600">
                                            <MapPin className="w-4 h-4"/>
                                            Location
                                        </label>
                                        <Select value={formData.location}
                                                onValueChange={(value) => handleInputChange("location", value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select location"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Dhaka">Dhaka</SelectItem>
                                                <SelectItem value="Chittagong">Chittagong</SelectItem>
                                                <SelectItem value="Sylhet">Sylhet</SelectItem>
                                                <SelectItem value="Rajshahi">Rajshahi</SelectItem>
                                                <SelectItem value="Khulna">Khulna</SelectItem>
                                                <SelectItem value="Barisal">Barisal</SelectItem>
                                                <SelectItem value="Rangpur">Rangpur</SelectItem>
                                                <SelectItem value="Mymensingh">Mymensingh</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Projected Demand */}
                                    <div className="space-y-2">
                                        <label htmlFor="projected_demand"
                                               className="flex items-center gap-2 text-blue-600">
                                            <TrendingUp className="w-4 h-4"/>
                                            Projected Demand (tons)
                                        </label>
                                        <Input
                                            id="projected_demand"
                                            type="number"
                                            placeholder="Projected demand"
                                            value={formData.projected_demand}
                                            onChange={(e) => handleInputChange("projected_demand", e.target.value)}
                                        />
                                    </div>

                                    {/* Current Supply */}
                                    <div className="space-y-2">
                                        <label htmlFor="current_supply"
                                               className="flex items-center gap-2 text-blue-600">
                                            <BarChart3 className="w-4 h-4"/>
                                            Current Supply (tons)
                                        </label>
                                        <Input
                                            id="current_supply"
                                            type="number"
                                            placeholder="Current supply"
                                            value={formData.current_supply}
                                            onChange={(e) => handleInputChange("current_supply", e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Forecast Date */}
                                    <div className="space-y-2">
                                        <label htmlFor="forecast_date"
                                               className="flex items-center gap-2 text-blue-600">
                                            <Calendar className="w-4 h-4"/>
                                            Forecast Date
                                        </label>
                                        <Input
                                            id="forecast_date"
                                            type="date"
                                            placeholder="YYYY-MM-DD"
                                            value={formData.forecast_date}
                                            onChange={(e) => handleInputChange("forecast_date", e.target.value)}
                                        />
                                    </div>

                                    {/* Forecast Period */}
                                    <div className="space-y-2">
                                        <label htmlFor="forecast_period"
                                               className="flex items-center gap-2 text-blue-600">
                                            <Calendar className="w-4 h-4"/>
                                            Forecast Period
                                        </label>
                                        <Select value={formData.forecast_period}
                                                onValueChange={(value) => handleInputChange("forecast_period", value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select period"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Next 3 Months">Next 3 Months</SelectItem>
                                                <SelectItem value="Next 6 Months">Next 6 Months</SelectItem>
                                                <SelectItem value="Next 12 Months">Next 12 Months</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {/* Price Elasticity */}
                                    <div className="space-y-2">
                                        <label htmlFor="price_elasticity"
                                               className="flex items-center gap-2 text-blue-600">
                                            <TrendingDown className="w-4 h-4"/>
                                            Price Elasticity
                                        </label>
                                        <Input
                                            id="price_elasticity"
                                            type="number"
                                            step="0.1"
                                            placeholder="-0.8"
                                            value={formData.price_elasticity}
                                            onChange={(e) => handleInputChange("price_elasticity", e.target.value)}
                                        />
                                    </div>

                                    {/* Weather ID */}
                                    <div className="space-y-2">
                                        <label htmlFor="weather_id" className="flex items-center gap-2 text-blue-600">
                                            <AlertTriangle className="w-4 h-4"/>
                                            Weather ID
                                        </label>
                                        <Input
                                            id="weather_id"
                                            placeholder="Weather ID"
                                            value={formData.weather_id}
                                            onChange={(e) => handleInputChange("weather_id", e.target.value)}
                                        />
                                    </div>

                                    {/* Demand Trend */}
                                    <div className="space-y-2">
                                        <label htmlFor="demand_trend" className="flex items-center gap-2 text-blue-600">
                                            <TrendingUp className="w-4 h-4"/>
                                            Demand Trend
                                        </label>
                                        <Select value={formData.demand_trend}
                                                onValueChange={(value) => handleInputChange("demand_trend", value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select trend"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Increasing">Increasing</SelectItem>
                                                <SelectItem value="Stable">Stable</SelectItem>
                                                <SelectItem value="Decreasing">Decreasing</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Season */}
                                    <div className="space-y-2">
                                        <label htmlFor="season" className="flex items-center gap-2 text-blue-600">
                                            <Target className="w-4 h-4"/>
                                            Season
                                        </label>
                                        <Select value={formData.season}
                                                onValueChange={(value) => handleInputChange("season", value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select season"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Spring">Spring</SelectItem>
                                                <SelectItem value="Summer">Summer</SelectItem>
                                                <SelectItem value="Autumn">Autumn</SelectItem>
                                                <SelectItem value="Winter">Winter</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-start gap-4">
                                    <Button type="submit"
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 flex items-center gap-2">
                                        <Plus className="w-4 h-4"/>
                                        SUBMIT FORECAST DATA
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* 3. TABLE SHOW */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Demand Forecast Records</CardTitle>
                        <CardDescription>Complete demand forecast listing with trend analysis</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                                <Input
                                    placeholder="Search forecasts..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Select value={selectedLocation}
                                    onValueChange={(value) => setSelectedLocation(value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select location"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Locations</SelectItem>
                                    <SelectItem value="Dhaka">Dhaka</SelectItem>
                                    <SelectItem value="Chittagong">Chittagong</SelectItem>
                                    <SelectItem value="Sylhet">Sylhet</SelectItem>
                                    <SelectItem value="Rajshahi">Rajshahi</SelectItem>
                                    <SelectItem value="Khulna">Khulna</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={selectedProduct}
                                    onValueChange={(value) => setSelectedProduct(value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select product"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Products</SelectItem>
                                    <SelectItem value="Wheat">Wheat</SelectItem>
                                    <SelectItem value="Rice">Rice</SelectItem>
                                    <SelectItem value="Corn">Corn</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={selectedPeriod}
                                    onValueChange={(value) => setSelectedPeriod(value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select period"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Periods</SelectItem>
                                    <SelectItem value="Next 3 Months">Next 3 Months</SelectItem>
                                    <SelectItem value="Next 6 Months">Next 6 Months</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {filteredForecasts.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <Target className="h-8 w-8 mx-auto mb-2 text-gray-400"/>
                                No demand forecasts found. Use the form above to add forecasts.
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Forecast ID</TableHead>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Forecast Date</TableHead>
                                        <TableHead>Projected Demand</TableHead>
                                        <TableHead>Current Supply</TableHead>
                                        <TableHead>Supply Gap</TableHead>
                                        <TableHead>Period</TableHead>
                                        <TableHead>Trend</TableHead>
                                        <TableHead>Accuracy</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredForecasts.map((forecast) => (
                                        <TableRow key={forecast.demand_id}>
                                            <TableCell className="font-medium">{forecast.demand_id}</TableCell>
                                            <TableCell>{forecast.product_name}</TableCell>
                                            <TableCell>{forecast.location}</TableCell>
                                            <TableCell>{forecast.forecast_date}</TableCell>
                                            <TableCell>{forecast.projected_demand.toLocaleString()} tons</TableCell>
                                            <TableCell>{forecast.current_supply.toLocaleString()} tons</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={forecast.current_supply >= forecast.projected_demand ? "default" : "destructive"}>
                                                    {forecast.current_supply >= forecast.projected_demand ? "Surplus" : "Shortage"}
                                                    : {Math.abs(forecast.current_supply - forecast.projected_demand).toLocaleString()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{forecast.forecast_period}</TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    forecast.demand_trend === "Increasing" ? "default" :
                                                        forecast.demand_trend === "Decreasing" ? "destructive" : "secondary"
                                                }>
                                                    {forecast.demand_trend}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{forecast.accuracy_percentage}%</TableCell>
                                            <TableCell>
                                                <div className="flex space-x-2">
                                                    <Button variant="ghost" size="sm"
                                                            className="text-muted-foreground hover:text-blue-600">
                                                        <Edit2 className="w-4 h-4 text-blue-600"/>
                                                    </Button>
                                                    <Button variant="ghost" size="sm"
                                                            className="text-muted-foreground hover:text-red-600"
                                                            onClick={() => handleDelete(forecast.demand_id)}>
                                                        <Trash2 className="w-4 h-4 text-red-600"/>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                {/* 4. CHARTS */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Demand vs Supply Trends</CardTitle>
                            <CardDescription>Monthly projected demand and current supply comparison</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={{
                                wheat_demand: {label: "Wheat Demand", color: "#8B5CF6"},
                                wheat_supply: {label: "Wheat Supply", color: "#10B981"},
                                rice_demand: {label: "Rice Demand", color: "#F59E0B"},
                                rice_supply: {label: "Rice Supply", color: "#3B82F6"}
                            }} className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart data={demandSupplyTrendData}>
                                        <CartesianGrid strokeDasharray="3 3"/>
                                        <XAxis dataKey="month" label={{value: 'Month', position: 'insideBottom'}}/>
                                        <YAxis label={{
                                            value: 'Demand/Supply (tons)',
                                            angle: -90,
                                            position: 'insideLeft'
                                        }}/>
                                        <ChartTooltip content={<ChartTooltipContent/>}/>
                                        <Legend/>
                                        <Bar dataKey="wheat_demand" fill="#8B5CF6" name="Wheat Demand"/>
                                        <Bar dataKey="wheat_supply" fill="#10B981" name="Wheat Supply"/>
                                        <Line type="monotone" dataKey="rice_demand" stroke="#F59E0B" strokeWidth={3}
                                              name="Rice Demand"/>
                                        <Line type="monotone" dataKey="rice_supply" stroke="#3B82F6" strokeWidth={3}
                                              name="Rice Supply"/>
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Regional Demand-Supply Gap</CardTitle>
                            <CardDescription>Supply gap analysis by region</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={{
                                projected_demand: {label: "Projected Demand", color: "#8B5CF6"},
                                current_supply: {label: "Current Supply", color: "#10B981"},
                                supply_gap: {label: "Supply Gap", color: "#F59E0B"}
                            }} className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={regionalGapData}
                                              margin={{top: 20, right: 30, left: 20, bottom: 80}}>
                                        <CartesianGrid strokeDasharray="3 3"/>
                                        <XAxis dataKey="region" angle={-45} textAnchor="end" height={100}
                                               label={{value: 'Region', position: 'insideBottom'}}/>
                                        <YAxis label={{
                                            value: 'Demand/Supply (tons)',
                                            angle: -90,
                                            position: 'insideLeft'
                                        }}/>
                                        <ChartTooltip content={<ChartTooltipContent/>}/>
                                        <Legend/>
                                        <Bar dataKey="projected_demand" fill="#8B5CF6" name="Projected Demand"/>
                                        <Bar dataKey="current_supply" fill="#10B981" name="Current Supply"/>
                                        <Bar dataKey="supply_gap" fill="#F59E0B" name="Supply Gap"/>
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}