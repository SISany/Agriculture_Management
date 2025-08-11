"use client"

import {useState} from "react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Badge} from "@/components/ui/badge"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {ChartContainer, ChartTooltip} from "@/components/ui/chart"
import {
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Scatter,
    ScatterChart
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
    Zap,
    Trash2
} from "lucide-react"

// TypeScript interfaces
interface SupplyDemandAnalysis {
    analysis_id: string
    product_id: string
    product_name: string
    stakeholder_type: string
    analysis_date: string
    supply_quantity: number
    demand_quantity: number
    price_impact: number
    location: string
    season: string
    weather_id: string
    market_equilibrium: 'Surplus' | 'Deficit' | 'Balanced'
    price_elasticity: number
    market_efficiency: number
}

// Mock data
const supplyDemandAnalyses: SupplyDemandAnalysis[] = [
    {
        analysis_id: "SDA001",
        product_id: "P001",
        product_name: "Wheat",
        stakeholder_type: "Farmer",
        analysis_date: "2024-01-15",
        supply_quantity: 12000,
        demand_quantity: 15000,
        price_impact: 8.5,
        location: "Dhaka",
        season: "Winter",
        weather_id: "W001",
        market_equilibrium: 'Deficit',
        price_elasticity: -0.8,
        market_efficiency: 75
    },
    {
        analysis_id: "SDA002",
        product_id: "P002",
        product_name: "Rice",
        stakeholder_type: "Wholesaler",
        analysis_date: "2024-01-14",
        supply_quantity: 25000,
        demand_quantity: 22000,
        price_impact: -3.2,
        location: "Chittagong",
        season: "Winter",
        weather_id: "W002",
        market_equilibrium: 'Surplus',
        price_elasticity: -0.6,
        market_efficiency: 82
    },
    {
        analysis_id: "SDA003",
        product_id: "P003",
        product_name: "Corn",
        stakeholder_type: "Retailer",
        analysis_date: "2024-01-13",
        supply_quantity: 8000,
        demand_quantity: 8200,
        price_impact: 1.2,
        location: "Sylhet",
        season: "Winter",
        weather_id: "W003",
        market_equilibrium: 'Balanced',
        price_elasticity: -1.2,
        market_efficiency: 88
    },
    {
        analysis_id: "SDA004",
        product_id: "P001",
        product_name: "Wheat",
        stakeholder_type: "Consumer",
        analysis_date: "2024-01-12",
        supply_quantity: 16000,
        demand_quantity: 18000,
        price_impact: 6.8,
        location: "Rajshahi",
        season: "Winter",
        weather_id: "W004",
        market_equilibrium: 'Deficit',
        price_elasticity: -0.9,
        market_efficiency: 71
    },
    {
        analysis_id: "SDA005",
        product_id: "P002",
        product_name: "Rice",
        stakeholder_type: "Farmer",
        analysis_date: "2024-01-11",
        supply_quantity: 14000,
        demand_quantity: 16500,
        price_impact: 4.5,
        location: "Khulna",
        season: "Winter",
        weather_id: "W005",
        market_equilibrium: 'Deficit',
        price_elasticity: -0.7,
        market_efficiency: 77
    }
]

// Chart data
const elasticityScatter = [
    {elasticity: -0.6, efficiency: 82, product: "Rice"},
    {elasticity: -0.7, efficiency: 77, product: "Rice"},
    {elasticity: -0.8, efficiency: 75, product: "Wheat"},
    {elasticity: -0.9, efficiency: 71, product: "Wheat"},
    {elasticity: -1.2, efficiency: 88, product: "Corn"}
]

export default function SupplyDemandAnalysis() {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedProduct, setSelectedProduct] = useState("all")
    const [selectedStakeholder, setSelectedStakeholder] = useState("all")
    const [selectedEquilibrium, setSelectedEquilibrium] = useState("all")

    const filteredData = supplyDemandAnalyses.filter(analysis => {
        const matchesSearch = analysis.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            analysis.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            analysis.stakeholder_type.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesProduct = selectedProduct === "all" || analysis.product_name === selectedProduct
        const matchesStakeholder = selectedStakeholder === "all" || analysis.stakeholder_type === selectedStakeholder
        const matchesEquilibrium = selectedEquilibrium === "all" || analysis.market_equilibrium === selectedEquilibrium

        return matchesSearch && matchesProduct && matchesStakeholder && matchesEquilibrium
    })

    const totalSupply = filteredData.reduce((sum, analysis) => sum + analysis.supply_quantity, 0)
    const totalDemand = filteredData.reduce((sum, analysis) => sum + analysis.demand_quantity, 0)
    const avgPriceImpact = filteredData.reduce((sum, analysis) => sum + analysis.price_impact, 0) / filteredData.length || 0
    const avgEfficiency = filteredData.reduce((sum, analysis) => sum + analysis.market_efficiency, 0) / filteredData.length || 0

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Supply-Demand Analysis</h1>
                    <p className="text-sm text-gray-600">Advanced market equilibrium and price impact analysis</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2"/>
                        Export Analysis
                    </Button>
                    <Button size="sm">
                        <Plus className="w-4 h-4 mr-2"/>
                        New Analysis
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Supply</CardTitle>
                        <Target className="h-4 w-4 text-blue-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalSupply.toLocaleString()}</div>
                        <p className="text-xs text-blue-600 mt-1">Units available</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Demand</CardTitle>
                        <BarChart3 className="h-4 w-4 text-green-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalDemand.toLocaleString()}</div>
                        <p className="text-xs text-green-600 mt-1">Units required</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Price Impact</CardTitle>
                        {avgPriceImpact > 0 ? (
                            <TrendingUp className="h-4 w-4 text-red-600"/>
                        ) : (
                            <TrendingDown className="h-4 w-4 text-green-600"/>
                        )}
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${avgPriceImpact > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {avgPriceImpact > 0 ? '+' : ''}{avgPriceImpact.toFixed(1)}%
                        </div>
                        <p className="text-xs text-gray-600 mt-1">Average impact</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Market Efficiency</CardTitle>
                        <Zap className="h-4 w-4 text-purple-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{avgEfficiency.toFixed(1)}%</div>
                        <p className="text-xs text-purple-600 mt-1">Average efficiency</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Elasticity vs Efficiency</CardTitle>
                        <CardDescription>Price elasticity correlation with market efficiency</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart
                                    data={elasticityScatter}
                                    margin={{top: 20, right: 20, bottom: 60, left: 80}}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0"/>
                                    <XAxis
                                        type="number"
                                        dataKey="elasticity"
                                        name="Price Elasticity"
                                        domain={[-1.3, -0.5]}
                                        tick={{fontSize: 12, fill: '#64748b'}}
                                        label={{
                                            value: 'Price Elasticity',
                                            position: 'insideBottom',
                                            offset: -10,
                                            style: {
                                                textAnchor: 'middle',
                                                fontSize: '14px',
                                                fill: '#374151',
                                                fontWeight: '500'
                                            }
                                        }}
                                    />
                                    <YAxis
                                        type="number"
                                        dataKey="efficiency"
                                        name="Market Efficiency"
                                        domain={[65, 95]}
                                        tick={{fontSize: 12, fill: '#64748b'}}
                                        label={{
                                            value: 'Market Efficiency (%)',
                                            angle: -90,
                                            position: 'insideLeft',
                                            offset: 10,
                                            style: {
                                                textAnchor: 'middle',
                                                fontSize: '14px',
                                                fill: '#374151',
                                                fontWeight: '500'
                                            }
                                        }}
                                    />
                                    <ChartTooltip
                                        cursor={{strokeDasharray: '3 3'}}
                                        content={({active, payload}) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0].payload;
                                                return (
                                                    <div
                                                        className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                                                        <p className="font-semibold text-gray-800 mb-1">
                                                            Product: {data.product}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            Price Elasticity: {data.elasticity}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            Market Efficiency: {data.efficiency}%
                                                        </p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Scatter
                                        dataKey="efficiency"
                                        fill="#3b82f6"
                                        stroke="#1d4ed8"
                                        strokeWidth={2}
                                        r={6}
                                    />
                                </ScatterChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Supply-Demand Analysis Data</CardTitle>
                    <CardDescription>Filter and analyze market equilibrium data</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                            <Input
                                placeholder="Search by product, location, stakeholder..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
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
                        <Select value={selectedStakeholder} onValueChange={setSelectedStakeholder}>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Stakeholder Type"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Stakeholders</SelectItem>
                                <SelectItem value="Farmer">Farmer</SelectItem>
                                <SelectItem value="Wholesaler">Wholesaler</SelectItem>
                                <SelectItem value="Retailer">Retailer</SelectItem>
                                <SelectItem value="Consumer">Consumer</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={selectedEquilibrium} onValueChange={setSelectedEquilibrium}>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Market Equilibrium"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All States</SelectItem>
                                <SelectItem value="Surplus">Surplus</SelectItem>
                                <SelectItem value="Balanced">Balanced</SelectItem>
                                <SelectItem value="Deficit">Deficit</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Stakeholder</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Supply</TableHead>
                                    <TableHead>Demand</TableHead>
                                    <TableHead>Gap</TableHead>
                                    <TableHead>Price Impact</TableHead>
                                    <TableHead>Equilibrium</TableHead>
                                    <TableHead>Elasticity</TableHead>
                                    <TableHead>Efficiency</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.map((analysis) => {
                                    const gap = analysis.supply_quantity - analysis.demand_quantity
                                    return (
                                        <TableRow key={analysis.analysis_id}>
                                            <TableCell className="font-medium">{analysis.product_name}</TableCell>
                                            <TableCell>{analysis.stakeholder_type}</TableCell>
                                            <TableCell>{analysis.location}</TableCell>
                                            <TableCell>{new Date(analysis.analysis_date).toLocaleDateString()}</TableCell>
                                            <TableCell>{analysis.supply_quantity.toLocaleString()}</TableCell>
                                            <TableCell>{analysis.demand_quantity.toLocaleString()}</TableCell>
                                            <TableCell>
                        <span className={gap > 0 ? 'text-green-600' : 'text-red-600'}>
                          {gap > 0 ? '+' : ''}{gap.toLocaleString()}
                        </span>
                                            </TableCell>
                                            <TableCell>
                        <span className={analysis.price_impact > 0 ? 'text-red-600' : 'text-green-600'}>
                          {analysis.price_impact > 0 ? '+' : ''}{analysis.price_impact}%
                        </span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={analysis.market_equilibrium === "Balanced" ? "default" :
                                                        analysis.market_equilibrium === "Surplus" ? "secondary" : "destructive"}
                                                >
                                                    {analysis.market_equilibrium === "Surplus" &&
                                                        <TrendingDown className="w-3 h-3 mr-1"/>}
                                                    {analysis.market_equilibrium === "Deficit" &&
                                                        <AlertTriangle className="w-3 h-3 mr-1"/>}
                                                    {analysis.market_equilibrium}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{analysis.price_elasticity}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={analysis.market_efficiency >= 85 ? "default" :
                                                        analysis.market_efficiency >= 75 ? "secondary" : "destructive"}
                                                >
                                                    {analysis.market_efficiency}%
                                                </Badge>
                                            </TableCell>
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