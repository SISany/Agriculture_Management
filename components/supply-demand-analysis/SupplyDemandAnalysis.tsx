"use client"

import React, {useState, useEffect} from "react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Badge} from "@/components/ui/badge"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Label} from "@/components/ui/label"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Scatter,
    ScatterChart,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    Tooltip
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
    Trash2,
    RefreshCw,
    Calendar,
    MapPin,
    Users,
    Cloud
} from "lucide-react"

// TypeScript interfaces
interface Product {
    product_id: string
    name: string
    type: string
    variety: string
}

interface District {
    district_id: number
    name: string
}

interface DemandSupplyOverview {
    product_id: string
    product_name: string
    type: string
    variety: string
    district_name: string
    total_supply: number
    total_consumption: number
    avg_price: number
    transaction_count: number
    surplus_deficit: number
}

interface SurplusDeficit {
    product_id: string
    product_name: string
    district_name: string
    year: number
    month: number
    monthly_production: number
    estimated_monthly_demand: number
    surplus_deficit: number
    status: 'Surplus' | 'Deficit'
}

interface PriceTrend {
    product_id: string
    product_name: string
    district_name: string
    date: string
    price_per_unit: number
    quantity_produced: number
    rainfall: number
    temperature: number
    prev_price: number
    price_change_percent: number
}

interface ConsumptionPattern {
    product_id: string
    product_name: string
    stakeholder_type: string
    district_name: string
    stakeholder_count: number
    total_consumption: number
    avg_consumption_per_stakeholder: number
    consumption_month: number
    consumption_year: number
}

interface StakeholderComparison {
    product_id: string
    product_name: string
    district_name: string
    seller_type: string
    buyer_type: string
    transaction_count: number
    total_quantity_traded: number
    avg_transaction_price: number
    total_trade_value: number
    avg_transaction_value: number
}

// Color schemes for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
const RADIAN = Math.PI / 180;

export default function SupplyDemandAnalysis() {
    const [selectedProduct, setSelectedProduct] = useState<string>('')
    const [selectedDistrict, setSelectedDistrict] = useState<string>('')
    const [selectedDateRange, setSelectedDateRange] = useState<{start: string, end: string}>({start: '', end: ''})
    const [products, setProducts] = useState<Product[]>([])
    const [districts, setDistricts] = useState<District[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [activeTab, setActiveTab] = useState<string>('overview')
    
    // Data states
    const [overviewData, setOverviewData] = useState<DemandSupplyOverview[]>([])
    const [surplusDeficitData, setSurplusDeficitData] = useState<SurplusDeficit[]>([])
    const [priceTrendsData, setPriceTrendsData] = useState<PriceTrend[]>([])
    const [consumptionData, setConsumptionData] = useState<ConsumptionPattern[]>([])
    const [stakeholderData, setStakeholderData] = useState<StakeholderComparison[]>([])

    // Load initial data
    useEffect(() => {
        fetchProducts()
        fetchDistricts()
    }, [])
    
    // Load analysis data when filters change
    useEffect(() => {
        if (selectedProduct && selectedDistrict) {
            fetchAnalysisData()
        }
    }, [selectedProduct, selectedDistrict, selectedDateRange, activeTab])
    
    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products')
            const data = await response.json()
            setProducts(data)
            if (data.length > 0) {
                setSelectedProduct(data[0].product_id)
            }
        } catch (error) {
            console.error('Error fetching products:', error)
        }
    }
    
    const fetchDistricts = async () => {
        try {
            const response = await fetch('/api/districts')
            const data = await response.json()
            setDistricts(data)
            if (data.length > 0) {
                // Try to select a district that likely has data (Dhaka = district_id 1)
                const dhakaDistrict = data.find(d => d.district_id === 1)
                const defaultDistrict = dhakaDistrict || data[0]
                setSelectedDistrict(defaultDistrict.district_id.toString())
            }
        } catch (error) {
            console.error('Error fetching districts:', error)
        }
    }
    
    const fetchAnalysisData = async () => {
        if (!selectedProduct || !selectedDistrict) {
            console.log('Missing required filters:', { selectedProduct, selectedDistrict })
            return
        }
        
        setLoading(true)
        try {
            const baseParams = new URLSearchParams({
                product_id: selectedProduct,
                district_id: selectedDistrict
            })
            
            if (selectedDateRange.start && selectedDateRange.end) {
                baseParams.append('start_date', selectedDateRange.start)
                baseParams.append('end_date', selectedDateRange.end)
            }
            
            switch (activeTab) {
                case 'overview':
                    const overviewResponse = await fetch(`/api/demand-supply?type=overview&${baseParams}`)
                    const overview = await overviewResponse.json()
                    setOverviewData(overview)
                    break
                    
                case 'surplus_deficit':
                    const surplusResponse = await fetch(`/api/demand-supply?type=surplus_deficit&${baseParams}`)
                    const surplus = await surplusResponse.json()
                    setSurplusDeficitData(surplus)
                    break
                    
                case 'price_trends':
                    const priceResponse = await fetch(`/api/demand-supply?type=price_trends&${baseParams}`)
                    const price = await priceResponse.json()
                    setPriceTrendsData(price)
                    break
                    
                case 'consumption':
                    const consumptionResponse = await fetch(`/api/demand-supply?type=consumption_patterns&${baseParams}`)
                    const consumption = await consumptionResponse.json()
                    setConsumptionData(consumption)
                    break
                    
                case 'stakeholders':
                    const stakeholderResponse = await fetch(`/api/demand-supply?type=stakeholder_comparison&${baseParams}`)
                    const stakeholder = await stakeholderResponse.json()
                    setStakeholderData(stakeholder)
                    break
            }
        } catch (error) {
            console.error('Error fetching analysis data:', error)
        } finally {
            setLoading(false)
        }
    }

    // Calculate summary metrics based on current data
    const getSummaryMetrics = () => {
        if (overviewData.length === 0) return { totalSupply: 0, totalDemand: 0, avgPrice: 0, transactionCount: 0 }
        
        return {
            totalSupply: overviewData.reduce((sum, item) => sum + (item.total_supply || 0), 0),
            totalDemand: overviewData.reduce((sum, item) => sum + (item.total_consumption || 0), 0),
            avgPrice: overviewData.reduce((sum, item) => sum + (item.avg_price || 0), 0) / overviewData.length,
            transactionCount: overviewData.reduce((sum, item) => sum + (item.transaction_count || 0), 0)
        }
    }
    
    const metrics = getSummaryMetrics()
    
    const renderCustomizedLabel = (entry: any) => {
        const { cx, cy, midAngle, innerRadius, outerRadius, percent } = entry
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5
        const x = cx + radius * Math.cos(-midAngle * RADIAN)
        const y = cy + radius * Math.sin(-midAngle * RADIAN)
        
        return (
            <text 
                x={x} 
                y={y} 
                fill="white" 
                textAnchor={x > cx ? 'start' : 'end'} 
                dominantBaseline="central"
                fontSize="12px"
                fontWeight="500"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Demand and Supply Analysis</h1>
                    <p className="text-sm text-muted-foreground">Surplus/deficit tracking, consumption patterns, price elasticity, and supply vs demand comparison</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={fetchAnalysisData} disabled={loading}>
                        {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                        Refresh
                    </Button>
                    <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2"/>
                        Export Report
                    </Button>
                </div>
            </div>
            
            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium flex items-center gap-2">
                                <Target className="h-4 w-4" />Product
                            </Label>
                            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select product" />
                                </SelectTrigger>
                                <SelectContent>
                                    {products.map((product) => (
                                        <SelectItem key={product.product_id} value={product.product_id}>
                                            {product.name} ({product.variety})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="space-y-2">
                            <Label className="text-sm font-medium flex items-center gap-2">
                                <MapPin className="h-4 w-4" />District
                            </Label>
                            <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select district" />
                                </SelectTrigger>
                                <SelectContent>
                                    {districts.map((district) => (
                                        <SelectItem key={district.district_id} value={district.district_id.toString()}>
                                            {district.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="space-y-2">
                            <Label className="text-sm font-medium flex items-center gap-2">
                                <Calendar className="h-4 w-4" />Start Date
                            </Label>
                            <Input 
                                type="date" 
                                value={selectedDateRange.start}
                                onChange={(e) => setSelectedDateRange(prev => ({...prev, start: e.target.value}))}
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label className="text-sm font-medium flex items-center gap-2">
                                <Calendar className="h-4 w-4" />End Date
                            </Label>
                            <Input 
                                type="date" 
                                value={selectedDateRange.end}
                                onChange={(e) => setSelectedDateRange(prev => ({...prev, end: e.target.value}))}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Supply</CardTitle>
                        <Target className="h-4 w-4 text-blue-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.totalSupply.toLocaleString()}</div>
                        <p className="text-xs text-blue-600 mt-1">Units available</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Demand</CardTitle>
                        <BarChart3 className="h-4 w-4 text-green-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.totalDemand.toLocaleString()}</div>
                        <p className="text-xs text-green-600 mt-1">Units required</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Price</CardTitle>
                        <TrendingUp className="h-4 w-4 text-purple-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">৳{metrics.avgPrice.toFixed(2)}</div>
                        <p className="text-xs text-purple-600 mt-1">Per unit</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                        <Zap className="h-4 w-4 text-orange-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.transactionCount}</div>
                        <p className="text-xs text-orange-600 mt-1">Total trades</p>
                    </CardContent>
                </Card>
            </div>

            {/* Analysis Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="surplus_deficit">Surplus/Deficit</TabsTrigger>
                    <TabsTrigger value="price_trends">Price Trends</TabsTrigger>
                    <TabsTrigger value="consumption">Consumption</TabsTrigger>
                    <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Supply vs Demand Overview</CardTitle>
                                <CardDescription>Current supply and demand balance by district</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {overviewData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={overviewData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="district_name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="total_supply" fill="#3b82f6" name="Supply" />
                                            <Bar dataKey="total_consumption" fill="#ef4444" name="Demand" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-[300px] text-gray-500">
                                        {loading ? 'Loading...' : 'No data available'}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader>
                                <CardTitle>Surplus/Deficit Distribution</CardTitle>
                                <CardDescription>Market balance status across regions</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {overviewData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={overviewData.map(item => ({
                                                    name: item.district_name,
                                                    value: Math.abs(item.surplus_deficit),
                                                    status: item.surplus_deficit > 0 ? 'Surplus' : 'Deficit'
                                                }))}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={renderCustomizedLabel}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {overviewData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.surplus_deficit > 0 ? '#10b981' : '#ef4444'} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-[300px] text-gray-500">
                                        {loading ? 'Loading...' : 'No data available'}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                    
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Detailed Overview Data</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product</TableHead>
                                            <TableHead>District</TableHead>
                                            <TableHead>Supply</TableHead>
                                            <TableHead>Consumption</TableHead>
                                            <TableHead>Balance</TableHead>
                                            <TableHead>Avg Price</TableHead>
                                            <TableHead>Transactions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {overviewData.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">{item.product_name}</TableCell>
                                                <TableCell>{item.district_name}</TableCell>
                                                <TableCell>{item.total_supply?.toLocaleString()}</TableCell>
                                                <TableCell>{item.total_consumption?.toLocaleString()}</TableCell>
                                                <TableCell>
                                                    <Badge variant={item.surplus_deficit > 0 ? "default" : "destructive"}>
                                                        {item.surplus_deficit > 0 ? 'Surplus' : 'Deficit'}: {Math.abs(item.surplus_deficit).toLocaleString()}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>৳{item.avg_price?.toFixed(2)}</TableCell>
                                                <TableCell>{item.transaction_count}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="surplus_deficit" className="mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Monthly Surplus/Deficit Trends</CardTitle>
                                <CardDescription>Production vs demand balance over time</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {surplusDeficitData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={surplusDeficitData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey={(item) => `${item.year}-${String(item.month).padStart(2, '0')}`} />
                                            <YAxis />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="surplus_deficit" stroke="#8884d8" strokeWidth={2} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-[300px] text-gray-500">
                                        {loading ? 'Loading...' : 'No data available'}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader>
                                <CardTitle>Production vs Demand</CardTitle>
                                <CardDescription>Comparative analysis by month</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {surplusDeficitData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={surplusDeficitData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey={(item) => `${item.year}-${String(item.month).padStart(2, '0')}`} />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="monthly_production" fill="#10b981" name="Production" />
                                            <Bar dataKey="estimated_monthly_demand" fill="#f59e0b" name="Demand" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-[300px] text-gray-500">
                                        {loading ? 'Loading...' : 'No data available'}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                
                <TabsContent value="price_trends" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Price Trends & Weather Correlation</CardTitle>
                            <CardDescription>Price changes influenced by weather conditions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {priceTrendsData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart data={priceTrendsData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis yAxisId="left" />
                                        <YAxis yAxisId="right" orientation="right" />
                                        <Tooltip />
                                        <Line yAxisId="left" type="monotone" dataKey="price_per_unit" stroke="#8884d8" strokeWidth={2} name="Price" />
                                        <Line yAxisId="right" type="monotone" dataKey="rainfall" stroke="#82ca9d" name="Rainfall" />
                                        <Line yAxisId="right" type="monotone" dataKey="temperature" stroke="#ffc658" name="Temperature" />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-[400px] text-gray-500">
                                    {loading ? 'Loading...' : 'No data available'}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="consumption" className="mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Consumption by Stakeholder Type</CardTitle>
                                <CardDescription>Consumption patterns across different stakeholder groups</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {consumptionData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={consumptionData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="stakeholder_type" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="total_consumption" fill="#8884d8" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-[300px] text-gray-500">
                                        {loading ? 'Loading...' : 'No data available'}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader>
                                <CardTitle>Monthly Consumption Trends</CardTitle>
                                <CardDescription>Consumption patterns over time</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {consumptionData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={consumptionData.sort((a, b) => a.consumption_month - b.consumption_month)}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey={(item) => `${item.consumption_year}-${String(item.consumption_month).padStart(2, '0')}`} />
                                            <YAxis />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="total_consumption" stroke="#82ca9d" strokeWidth={2} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-[300px] text-gray-500">
                                        {loading ? 'Loading...' : 'No data available'}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                
                <TabsContent value="stakeholders" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Stakeholder Trade Analysis</CardTitle>
                            <CardDescription>Trade volumes and values between different stakeholder types</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product</TableHead>
                                            <TableHead>Seller Type</TableHead>
                                            <TableHead>Buyer Type</TableHead>
                                            <TableHead>Transactions</TableHead>
                                            <TableHead>Quantity Traded</TableHead>
                                            <TableHead>Avg Price</TableHead>
                                            <TableHead>Total Value</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {stakeholderData.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">{item.product_name}</TableCell>
                                                <TableCell>{item.seller_type}</TableCell>
                                                <TableCell>{item.buyer_type}</TableCell>
                                                <TableCell>{item.transaction_count}</TableCell>
                                                <TableCell>{item.total_quantity_traded?.toLocaleString()}</TableCell>
                                                <TableCell>৳{item.avg_transaction_price?.toFixed(2)}</TableCell>
                                                <TableCell>৳{item.total_trade_value?.toLocaleString()}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>


        </div>
    )
}