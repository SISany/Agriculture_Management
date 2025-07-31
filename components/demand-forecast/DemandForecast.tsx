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
    Trash2
} from "lucide-react"

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
const demandForecasts: DemandForecast[] = [
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
]

// Chart data for demand vs supply trends
const demandSupplyTrends = [
    {month: "Jan", wheat_demand: 14000, wheat_supply: 11000, rice_demand: 20000, rice_supply: 23000},
    {month: "Feb", wheat_demand: 15000, wheat_supply: 12000, rice_demand: 22000, rice_supply: 25000},
    {month: "Mar", wheat_demand: 16500, wheat_supply: 14000, rice_demand: 21000, rice_supply: 24000},
    {month: "Apr", wheat_demand: 18000, wheat_supply: 16000, rice_demand: 23000, rice_supply: 26000},
    {month: "May", wheat_demand: 19000, wheat_supply: 17500, rice_demand: 24500, rice_supply: 27000},
    {month: "Jun", wheat_demand: 17000, wheat_supply: 16000, rice_demand: 22500, rice_supply: 25500}
]

// Price elasticity data
const elasticityData = [
    {product: "Wheat", elasticity: -0.8, sensitivity: "Moderate"},
    {product: "Rice", elasticity: -0.6, sensitivity: "Low"},
    {product: "Corn", elasticity: -1.2, sensitivity: "High"},
    {product: "Soybeans", elasticity: -0.9, sensitivity: "Moderate"}
]

// Regional forecast data
const regionalData = [
    {region: "Dhaka", projected: 15000, current: 12000, gap: 3000},
    {region: "Chittagong", projected: 22000, current: 25000, gap: -3000},
    {region: "Sylhet", projected: 8000, current: 10000, gap: -2000},
    {region: "Rajshahi", projected: 18000, current: 16000, gap: 2000},
    {region: "Khulna", projected: 16500, current: 14000, gap: 2500}
]

export default function DemandForecast() {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedLocation, setSelectedLocation] = useState("all")
    const [selectedProduct, setSelectedProduct] = useState("all")
    const [selectedPeriod, setSelectedPeriod] = useState("all")

    const filteredData = demandForecasts.filter(forecast => {
        const matchesSearch = forecast.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            forecast.location.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesLocation = selectedLocation === "all" || forecast.location === selectedLocation
        const matchesProduct = selectedProduct === "all" || forecast.product_name === selectedProduct
        const matchesPeriod = selectedPeriod === "all" || forecast.forecast_period === selectedPeriod

        return matchesSearch && matchesLocation && matchesProduct && matchesPeriod
    })

    const totalProjectedDemand = filteredData.reduce((sum, forecast) => sum + forecast.projected_demand, 0)
    const totalCurrentSupply = filteredData.reduce((sum, forecast) => sum + forecast.current_supply, 0)
    const avgAccuracy = filteredData.reduce((sum, forecast) => sum + forecast.accuracy_percentage, 0) / filteredData.length || 0
    const supplyGap = totalProjectedDemand - totalCurrentSupply

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Demand Forecast Analytics</h1>
                    <p className="text-sm text-gray-600">AI-powered demand forecasting and supply gap analysis</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2"/>
                        Export Report
                    </Button>
                    <Button size="sm">
                        <Plus className="w-4 h-4 mr-2"/>
                        New Forecast
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Projected Demand</CardTitle>
                        <Target className="h-4 w-4 text-blue-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalProjectedDemand.toLocaleString()}</div>
                        <p className="text-xs text-blue-600 mt-1">tons (next period)</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Current Supply</CardTitle>
                        <BarChart3 className="h-4 w-4 text-green-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalCurrentSupply.toLocaleString()}</div>
                        <p className="text-xs text-green-600 mt-1">tons available</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Supply Gap</CardTitle>
                        {supplyGap > 0 ? (
                            <AlertTriangle className="h-4 w-4 text-red-600"/>
                        ) : (
                            <TrendingUp className="h-4 w-4 text-green-600"/>
                        )}
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${supplyGap > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {Math.abs(supplyGap).toLocaleString()}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                            {supplyGap > 0 ? 'Shortage' : 'Surplus'}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Accuracy</CardTitle>
                        <TrendingUp className="h-4 w-4 text-purple-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{avgAccuracy.toFixed(1)}%</div>
                        <p className="text-xs text-purple-600 mt-1">Forecast precision</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Demand vs Supply Trends</CardTitle>
                        <CardDescription>Monthly projected demand and current supply comparison</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={demandSupplyTrends}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="month"/>
                                    <YAxis/>
                                    <ChartTooltip content={<ChartTooltipContent/>}/>
                                    <Legend/>
                                    <Bar dataKey="wheat_demand" fill="#8884d8" name="Wheat Demand"/>
                                    <Bar dataKey="wheat_supply" fill="#82ca9d" name="Wheat Supply"/>
                                    <Line type="monotone" dataKey="rice_demand" stroke="#ff7300" strokeWidth={2}
                                          name="Rice Demand"/>
                                    <Line type="monotone" dataKey="rice_supply" stroke="#ffc658" strokeWidth={2}
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
                        <ChartContainer config={{}} className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={regionalData}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="region"/>
                                    <YAxis/>
                                    <ChartTooltip content={<ChartTooltipContent/>}/>
                                    <Legend/>
                                    <Bar dataKey="projected" fill="#8884d8" name="Projected Demand"/>
                                    <Bar dataKey="current" fill="#82ca9d" name="Current Supply"/>
                                    <Bar dataKey="gap" fill="#ff7300" name="Supply Gap"/>
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Price Elasticity Analysis</CardTitle>
                    <CardDescription>Product sensitivity to price changes</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={{}} className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={elasticityData} layout="horizontal">
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis type="number"/>
                                <YAxis dataKey="product" type="category"/>
                                <ChartTooltip content={<ChartTooltipContent/>}/>
                                <Bar dataKey="elasticity" fill="#8884d8"/>
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Demand Forecast Data</CardTitle>
                    <CardDescription>Filter and analyze demand forecasts</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                            <Input
                                placeholder="Search products, locations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Select Location"/>
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
                        <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Select Product"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Products</SelectItem>
                                <SelectItem value="Wheat">Wheat</SelectItem>
                                <SelectItem value="Rice">Rice</SelectItem>
                                <SelectItem value="Corn">Corn</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Forecast Period"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Periods</SelectItem>
                                <SelectItem value="Next 3 Months">Next 3 Months</SelectItem>
                                <SelectItem value="Next 6 Months">Next 6 Months</SelectItem>
                                <SelectItem value="Next 12 Months">Next 12 Months</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Forecast Date</TableHead>
                                    <TableHead>Projected Demand</TableHead>
                                    <TableHead>Current Supply</TableHead>
                                    <TableHead>Supply Gap</TableHead>
                                    <TableHead>Period</TableHead>
                                    <TableHead>Accuracy</TableHead>
                                    <TableHead>Trend</TableHead>
                                    <TableHead>Elasticity</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.map((forecast) => {
                                    const gap = forecast.projected_demand - forecast.current_supply
                                    return (
                                        <TableRow key={forecast.demand_id}>
                                            <TableCell className="font-medium">{forecast.product_name}</TableCell>
                                            <TableCell>{forecast.location}</TableCell>
                                            <TableCell>{new Date(forecast.forecast_date).toLocaleDateString()}</TableCell>
                                            <TableCell>{forecast.projected_demand.toLocaleString()}</TableCell>
                                            <TableCell>{forecast.current_supply.toLocaleString()}</TableCell>
                                            <TableCell>
                        <span className={gap > 0 ? 'text-red-600' : 'text-green-600'}>
                          {gap > 0 ? '+' : ''}{gap.toLocaleString()}
                        </span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{forecast.forecast_period}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={forecast.accuracy_percentage >= 90 ? "default" :
                                                        forecast.accuracy_percentage >= 80 ? "secondary" : "destructive"}
                                                >
                                                    {forecast.accuracy_percentage}%
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={forecast.demand_trend === "Increasing" ? "default" :
                                                        forecast.demand_trend === "Stable" ? "secondary" : "destructive"}
                                                >
                                                    {forecast.demand_trend === "Increasing" &&
                                                        <TrendingUp className="w-3 h-3 mr-1"/>}
                                                    {forecast.demand_trend === "Decreasing" &&
                                                        <TrendingDown className="w-3 h-3 mr-1"/>}
                                                    {forecast.demand_trend}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{forecast.price_elasticity}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-1">
                                                    <Button variant="ghost" size="sm" className="hover:bg-blue-50">
                                                        <Edit2 className="w-4 h-4 text-blue-600"/>
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="hover:bg-red-50">
                                                        <Trash2 className="w-4 h-4 text-red-600"/>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}