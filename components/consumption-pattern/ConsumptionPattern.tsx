"use client"

import React, {useState, useEffect} from "react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Badge} from "@/components/ui/badge"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    Tooltip,
    AreaChart,
    Area,
    ScatterChart,
    Scatter
} from "recharts"
import {Search, Plus, Edit2, Trash2, TrendingUp, TrendingDown, MapPin, DollarSign, Package, FileDown, Users, Activity, Calendar, BarChart3} from "lucide-react"
import {Label} from "@/components/ui/label"
import {ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart"

// TypeScript interfaces based on requirement specifications
interface Product {
    product_id: string
    name: string
    type: string
    variety: string
    sowing_time: string
    transplanting_time: string
    harvest_time: string
    per_acre_seed_requirement: number
}

interface ProductionData {
    production_id: string
    product_id: string
    district_id: string
    division: string
    year: number
    month: number
    acreage: number
    quantity_produced: number
}

interface PriceHistory {
    price_id: string
    product_id: string
    district_id: string
    date: string
    harvest_price: number
    wholesale_price: number
    retail_price: number
}

interface WeatherData {
    weather_id: string
    district_id: string
    date: string
    rainfall: number
    temperature: number
    humidity: number
}

interface ConsumptionPattern {
    consumption_id: string
    stakeholder_id: string
    product_id: string
    district_id: string
    consumption_date: string
    quantity_consumed: number
    amount_spent: number
    demographic_group: string
    household_size: number
    per_capita_income: number
}

interface NutritionalAnalysis {
    product_id: string
    district_id: string
    month: number
    year: number
    per_capita_requirement: number
    actual_consumption: number
    surplus_deficit: number
    nutritional_status: string
}

interface District {
    district_id: string
    name: string
    division: string
}

interface SupplyDemandComparison {
    product_id: string
    district_id: string
    period: string
    producer_supply: number
    wholesaler_demand: number
    retailer_demand: number
    consumer_demand: number
    price_impact: number
}

// No hardcoded data - all data will be fetched from database/APIs

export default function ConsumptionPattern() {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedProduct, setSelectedProduct] = useState("all")
    const [selectedDistrict, setSelectedDistrict] = useState("all")
    const [selectedDateRange, setSelectedDateRange] = useState({start: '', end: ''})
    const [selectedYearRange, setSelectedYearRange] = useState({start: new Date().getFullYear() - 5, end: new Date().getFullYear()})
    const [selectedSeason, setSelectedSeason] = useState("all")
    const [selectedDemographic, setSelectedDemographic] = useState("all")
    const [activeTab, setActiveTab] = useState('overview')
    const [showAddForm, setShowAddForm] = useState(false)
    const [loading, setLoading] = useState(false)
    
    // Data states - all fetched from database/APIs
    const [products, setProducts] = useState<Product[]>([])
    const [districts, setDistricts] = useState<District[]>([])
    const [productionData, setProductionData] = useState<ProductionData[]>([])
    const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([])
    const [weatherData, setWeatherData] = useState<WeatherData[]>([])
    const [consumptionPatterns, setConsumptionPatterns] = useState<ConsumptionPattern[]>([])
    const [nutritionalAnalysis, setNutritionalAnalysis] = useState<NutritionalAnalysis[]>([])
    const [supplyDemandData, setSupplyDemandData] = useState<SupplyDemandComparison[]>([])
    const [demographicGroups, setDemographicGroups] = useState<string[]>([])
    
    // Helper functions for data processing
    const getProductName = (productId: string) => {
        return products.find(p => p.product_id === productId)?.name || 'Unknown Product'
    }
    
    const getDistrictName = (districtId: string) => {
        return districts.find(d => d.district_id === districtId)?.name || 'Unknown District'
    }
    
    // Computed data for charts
    const monthlyConsumptionData = React.useMemo(() => {
        if (!consumptionPatterns.length) return []
        
        // Group consumption data by month and product
        const monthlyData: { [key: string]: { month: string, wheat: number, rice: number, corn: number } } = {}
        
        consumptionPatterns.forEach(pattern => {
            const monthKey = new Date(pattern.consumption_date).toLocaleDateString('en', { month: 'short' })
            
            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = { month: monthKey, wheat: 0, rice: 0, corn: 0 }
            }
            
            // Map product names to chart data keys
            const productName = getProductName(pattern.product_id).toLowerCase()
            if (productName.includes('wheat')) {
                monthlyData[monthKey].wheat += pattern.quantity_consumed
            } else if (productName.includes('rice')) {
                monthlyData[monthKey].rice += pattern.quantity_consumed
            } else if (productName.includes('corn')) {
                monthlyData[monthKey].corn += pattern.quantity_consumed
            }
        })
        
        return Object.values(monthlyData).sort((a, b) => {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                           'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            return months.indexOf(a.month) - months.indexOf(b.month)
        })
    }, [consumptionPatterns])
    
    // Computed demographic consumption data for pie charts
    const demographicConsumption = React.useMemo(() => {
        if (!consumptionPatterns.length) return []
        
        // Group consumption by demographic groups
        const demographicData: { [key: string]: number } = {}
        
        consumptionPatterns.forEach(pattern => {
            const groupKey = pattern.demographic_group || 'General'
            demographicData[groupKey] = (demographicData[groupKey] || 0) + pattern.quantity_consumed
        })
        
        // Convert to array format expected by PieChart with colors
        const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff00ff']
        return Object.entries(demographicData).map(([name, value], index) => ({
            name,
            value,
            color: colors[index % colors.length]
        }))
    }, [consumptionPatterns])
    
    // Computed seasonal trends data for bar charts
    const seasonalTrends = React.useMemo(() => {
        if (!consumptionPatterns.length) return []
        
        // Group consumption by season
        const seasonalData: { [key: string]: number } = {}
        
        consumptionPatterns.forEach(pattern => {
            // Determine season from consumption date
            const date = new Date(pattern.consumption_date)
            const month = date.getMonth() + 1 // 1-12
            
            let season = 'Winter'
            if (month >= 3 && month <= 5) season = 'Spring'
            else if (month >= 6 && month <= 8) season = 'Summer'
            else if (month >= 9 && month <= 11) season = 'Monsoon'
            
            seasonalData[season] = (seasonalData[season] || 0) + pattern.quantity_consumed
        })
        
        // Convert to array format expected by BarChart
        return ['Spring', 'Summer', 'Monsoon', 'Winter'].map(season => ({
            season,
            consumption: seasonalData[season] || 0,
            average: Object.values(seasonalData).reduce((a, b) => a + b, 0) / 4
        }))
    }, [consumptionPatterns])
    
    useEffect(() => {
        fetchInitialData()
    }, [])
    
    useEffect(() => {
        if (selectedProduct !== 'all' && selectedDistrict !== 'all') {
            fetchAnalyticsData()
        }
    }, [activeTab, selectedProduct, selectedDistrict, selectedDateRange, selectedYearRange])
    
    useEffect(() => {
        fetchWeatherData()
    }, [selectedDistrict, selectedDateRange])
    
    const fetchInitialData = async () => {
        setLoading(true)
        try {
            const [productsRes, districtsRes, demographicsRes] = await Promise.all([
                fetch('/api/products?comprehensive=true'), // Fetch comprehensive product info
                fetch('/api/districts'),
                fetch('/api/demographics') // Fetch demographic groups from database
            ])
            
            if (productsRes.ok) {
                const productsData = await productsRes.json()
                setProducts(productsData)
            }
            
            if (districtsRes.ok) {
                const districtsData = await districtsRes.json()
                setDistricts(districtsData)
            }
            
            if (demographicsRes.ok) {
                const demographicsData = await demographicsRes.json()
                setDemographicGroups(demographicsData.map((d: any) => d.name))
            }
            
            // Fetch consumption patterns
            const consumptionRes = await fetch('/api/consumption-patterns')
            if (consumptionRes.ok) {
                const consumptionData = await consumptionRes.json()
                setConsumptionPatterns(consumptionData)
            }
        } catch (error) {
            console.error('Error fetching initial data:', error)
        } finally {
            setLoading(false)
        }
    }
    
    const fetchAnalyticsData = async () => {
        if (selectedProduct === 'all' || selectedDistrict === 'all') return
        
        setLoading(true)
        try {
            const params = new URLSearchParams({
                product_id: selectedProduct,
                district_id: selectedDistrict,
                start_year: selectedYearRange.start.toString(),
                end_year: selectedYearRange.end.toString()
            })
            
            if (selectedDateRange.start && selectedDateRange.end) {
                params.append('start_date', selectedDateRange.start)
                params.append('end_date', selectedDateRange.end)
            }
            
            // Fetch production history data
            const productionRes = await fetch(`/api/production-data?${params}`)
            if (productionRes.ok) {
                const productionData = await productionRes.json()
                setProductionData(productionData)
            }
            
            // Fetch price history data
            const priceRes = await fetch(`/api/price-history?${params}`)
            if (priceRes.ok) {
                const priceData = await priceRes.json()
                setPriceHistory(priceData)
            }
            
            // Fetch nutritional analysis with surplus/deficit calculations
            const nutritionRes = await fetch(`/api/nutrition-analysis?${params}`)
            if (nutritionRes.ok) {
                const nutritionData = await nutritionRes.json()
                setNutritionalAnalysis(nutritionData)
            }
            
            // Fetch supply vs demand comparison
            const supplyDemandRes = await fetch(`/api/supply-demand-comparison?${params}`)
            if (supplyDemandRes.ok) {
                const supplyDemandData = await supplyDemandRes.json()
                setSupplyDemandData(supplyDemandData)
            }
        } catch (error) {
            console.error('Error fetching analytics data:', error)
        } finally {
            setLoading(false)
        }
    }
    
    const fetchWeatherData = async () => {
        if (selectedDistrict === 'all') return
        
        try {
            const params = new URLSearchParams({
                district_id: selectedDistrict
            })
            
            if (selectedDateRange.start && selectedDateRange.end) {
                params.append('start_date', selectedDateRange.start)
                params.append('end_date', selectedDateRange.end)
            }
            
            // Fetch weather data from external API or database
            const weatherRes = await fetch(`/api/weather-impact?${params}`)
            if (weatherRes.ok) {
                const weatherData = await weatherRes.json()
                setWeatherData(weatherData)
            }
        } catch (error) {
            console.error('Error fetching weather data:', error)
        }
    }

    // Form state for adding new consumption patterns
    const [formData, setFormData] = useState({
        stakeholder_id: "",
        product_id: "",
        district_id: "",
        consumption_date: "",
        quantity_consumed: 0,
        amount_spent: 0,
        demographic_group: "",
        household_size: 0,
        per_capita_income: 0
    })

    // Filter consumption patterns based on selections
    const filteredData = consumptionPatterns.filter(pattern => {
        const matchesSearch = searchTerm === "" || 
            products.find(p => p.product_id === pattern.product_id)?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            districts.find(d => d.district_id === pattern.district_id)?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesProduct = selectedProduct === "all" || pattern.product_id === selectedProduct
        const matchesDistrict = selectedDistrict === "all" || pattern.district_id === selectedDistrict
        
        if (selectedDateRange.start && selectedDateRange.end) {
            const patternDate = new Date(pattern.consumption_date)
            const startDate = new Date(selectedDateRange.start)
            const endDate = new Date(selectedDateRange.end)
            if (patternDate < startDate || patternDate > endDate) return false
        }

        return matchesSearch && matchesProduct && matchesDistrict
    })

    // Calculate derived metrics from real data
    const totalConsumption = filteredData.reduce((sum, pattern) => sum + pattern.quantity_consumed, 0)
    const totalSpending = filteredData.reduce((sum, pattern) => sum + pattern.amount_spent, 0)
    const avgHouseholdSize = filteredData.length > 0 ? filteredData.reduce((sum, pattern) => sum + pattern.household_size, 0) / filteredData.length : 0
    const avgPerCapitaIncome = filteredData.length > 0 ? filteredData.reduce((sum, pattern) => sum + pattern.per_capita_income, 0) / filteredData.length : 0

    const handleInputChange = (field: string, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch('/api/consumption-patterns', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })

            if (response.ok) {
                // Refresh data after successful addition
                await fetchInitialData()
                
                // Reset form and hide it
                setFormData({
                    stakeholder_id: "",
                    product_id: "",
                    district_id: "",
                    consumption_date: "",
                    quantity_consumed: 0,
                    amount_spent: 0,
                    demographic_group: "",
                    household_size: 0,
                    per_capita_income: 0
                })
                setShowAddForm(false)
            } else {
                console.error('Error adding consumption pattern:', await response.text())
            }
        } catch (error) {
            console.error('Error submitting form:', error)
        } finally {
            setLoading(false)
        }
    }

    // Calculate price elasticity based on real data
    const calculatePriceElasticity = () => {
        if (priceHistory.length === 0 || consumptionPatterns.length === 0) return []
        
        return priceHistory.map(price => {
            const consumption = consumptionPatterns
                .filter(c => c.product_id === price.product_id && c.district_id === price.district_id)
                .reduce((sum, c) => sum + c.quantity_consumed, 0)
            
            return {
                product_name: getProductName(price.product_id),
                retail_price: price.retail_price,
                consumption: consumption,
                date: price.date
            }
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Consumption Pattern & Nutrition Analysis</h1>
                    <p className="text-sm text-muted-foreground">Comprehensive consumption patterns, nutrition intake tracking, and demand forecasting</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={fetchAnalyticsData} disabled={loading}>
                        <Activity className="w-4 h-4 mr-2" />
                        {loading ? 'Loading...' : 'Refresh'}
                    </Button>
                    <Button variant="outline" size="sm">
                        <FileDown className="w-4 h-4 mr-2"/>
                        Export Report
                    </Button>
                    <Button size="sm" onClick={() => setShowAddForm(true)}>
                        <Plus className="w-4 h-4 mr-2"/>
                        Add Pattern
                    </Button>
                </div>
            </div>
            
            {/* Enhanced Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="space-y-2">
                            <Label>Product</Label>
                            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select product" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Products</SelectItem>
                                    {products.map(product => (
                                        <SelectItem key={product.product_id} value={product.product_id}>
                                            {product.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="space-y-2">
                            <Label>District</Label>
                            <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select district" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Districts</SelectItem>
                                    {districts.map(district => (
                                        <SelectItem key={district.district_id} value={district.district_id.toString()}>
                                            {district.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="space-y-2">
                            <Label>Start Date</Label>
                            <Input 
                                type="date" 
                                value={selectedDateRange.start}
                                onChange={(e) => setSelectedDateRange(prev => ({...prev, start: e.target.value}))}
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label>End Date</Label>
                            <Input 
                                type="date" 
                                value={selectedDateRange.end}
                                onChange={(e) => setSelectedDateRange(prev => ({...prev, end: e.target.value}))}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Key Metrics - Derived from Real Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Production</CardTitle>
                        <Package className="h-4 w-4 text-blue-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {productionData.reduce((sum, p) => sum + p.quantity_produced, 0).toLocaleString()} kg
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Total acreage: {productionData.reduce((sum, p) => sum + p.acreage, 0).toLocaleString()}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Per Capita Income</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">৳{avgPerCapitaIncome.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">Based on consumption data</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Surplus/Deficit</CardTitle>
                        <TrendingUp className="h-4 w-4 text-orange-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {nutritionalAnalysis.reduce((sum, n) => sum + n.surplus_deficit, 0) > 0 ? '+' : ''}
                            {nutritionalAnalysis.reduce((sum, n) => sum + n.surplus_deficit, 0).toFixed(1)} kg
                        </div>
                        <p className="text-xs text-orange-600 mt-1">
                            {nutritionalAnalysis.reduce((sum, n) => sum + n.surplus_deficit, 0) > 0 ? 'Surplus' : 'Deficit'}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Price Trends</CardTitle>
                        <Activity className="h-4 w-4 text-purple-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ৳{priceHistory.length > 0 ? (priceHistory.reduce((sum, p) => sum + p.retail_price, 0) / priceHistory.length).toFixed(0) : 0}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Avg retail price</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Weather Impact</CardTitle>
                        <MapPin className="h-4 w-4 text-indigo-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {weatherData.length > 0 ? (weatherData.reduce((sum, w) => sum + w.rainfall, 0) / weatherData.length).toFixed(1) : 0}mm
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Avg rainfall</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Supply vs Demand</CardTitle>
                        <BarChart3 className="h-4 w-4 text-red-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {supplyDemandData.reduce((sum, s) => sum + s.producer_supply, 0) > supplyDemandData.reduce((sum, s) => sum + s.consumer_demand, 0) ? 'Surplus' : 'Shortage'}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Market status</p>
                    </CardContent>
                </Card>
            </div>
            
            {/* Enhanced Analysis Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="nutrition">Nutrition Analysis</TabsTrigger>
                    <TabsTrigger value="trends">Consumption Trends</TabsTrigger>
                    <TabsTrigger value="demographics">Demographics</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Monthly Consumption Trends</CardTitle>
                                <CardDescription>Product consumption patterns over time</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={monthlyConsumptionData}>
                                        <CartesianGrid strokeDasharray="3 3"/>
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend/>
                                        <Line type="monotone" dataKey="wheat" stroke="#8884d8" strokeWidth={2} name="Wheat"/>
                                        <Line type="monotone" dataKey="rice" stroke="#82ca9d" strokeWidth={2} name="Rice"/>
                                        <Line type="monotone" dataKey="corn" stroke="#ffc658" strokeWidth={2} name="Corn"/>
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader>
                                <CardTitle>Demographic Distribution</CardTitle>
                                <CardDescription>Consumption by socioeconomic groups</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={demographicConsumption}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {demographicConsumption.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color}/>
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                
                <TabsContent value="nutrition" className="mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Nutritional Requirements vs Intake</CardTitle>
                                <CardDescription>Per capita nutrition analysis with surplus/deficit tracking</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {nutritionalAnalysis.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={nutritionalAnalysis.map(item => ({
                                            ...item,
                                            product_name: getProductName(item.product_id)
                                        }))}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="product_name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="per_capita_requirement" fill="#fbbf24" name="Required" />
                                            <Bar dataKey="actual_consumption" fill="#10b981" name="Actual" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-[300px] text-gray-500">
                                        {selectedProduct === 'all' || selectedDistrict === 'all' ? 
                                            'Please select specific product and district' : 'Loading nutrition data...'}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader>
                                <CardTitle>Monthly Surplus/Deficit Analysis</CardTitle>
                                <CardDescription>Tracking surplus/deficit for selected year range</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {nutritionalAnalysis.slice(0, 5).map((item, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium">{getProductName(item.product_id)}</p>
                                                <p className="text-sm text-muted-foreground">{item.month}/{item.year} - {getDistrictName(item.district_id)}</p>
                                            </div>
                                            <div className="text-right">
                                                <Badge variant={item.surplus_deficit > 0 ? "default" : "destructive"}>
                                                    {item.surplus_deficit > 0 ? 'Surplus' : 'Deficit'}: {Math.abs(item.surplus_deficit).toFixed(1)}kg
                                                </Badge>
                                                <p className="text-sm text-muted-foreground mt-1">{item.nutritional_status}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                
                <TabsContent value="trends" className="mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Production History by District</CardTitle>
                                <CardDescription>Acreage and quantity produced over time</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={productionData.map(item => ({
                                        ...item,
                                        district_name: getDistrictName(item.district_id),
                                        product_name: getProductName(item.product_id)
                                    }))}>
                                        <CartesianGrid strokeDasharray="3 3"/>
                                        <XAxis dataKey="year" />
                                        <YAxis yAxisId="left" />
                                        <YAxis yAxisId="right" orientation="right" />
                                        <Tooltip />
                                        <Legend/>
                                        <Bar yAxisId="left" dataKey="acreage" fill="#8884d8" name="Acreage"/>
                                        <Bar yAxisId="right" dataKey="quantity_produced" fill="#82ca9d" name="Production (kg)"/>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader>
                                <CardTitle>Price Trends & Weather Correlation</CardTitle>
                                <CardDescription>Harvest, wholesale, retail prices with weather impact</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={priceHistory.map(price => {
                                        const weather = weatherData.find(w => 
                                            w.district_id === price.district_id && 
                                            new Date(w.date).getMonth() === new Date(price.date).getMonth()
                                        )
                                        return {
                                            ...price,
                                            month: new Date(price.date).toLocaleDateString('en', { month: 'short' }),
                                            rainfall: weather?.rainfall || 0
                                        }
                                    })}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis yAxisId="left" />
                                        <YAxis yAxisId="right" orientation="right" />
                                        <Tooltip />
                                        <Legend/>
                                        <Line yAxisId="left" type="monotone" dataKey="harvest_price" stroke="#8884d8" name="Harvest Price" />
                                        <Line yAxisId="left" type="monotone" dataKey="wholesale_price" stroke="#82ca9d" name="Wholesale Price" />
                                        <Line yAxisId="left" type="monotone" dataKey="retail_price" stroke="#ffc658" name="Retail Price" />
                                        <Line yAxisId="right" type="monotone" dataKey="rainfall" stroke="#ff7300" name="Rainfall (mm)" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                
                <TabsContent value="demographics" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Supply vs Demand Analysis</CardTitle>
                            <CardDescription>Comparison for producers, wholesalers, and retailers based on price and production data</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product</TableHead>
                                            <TableHead>District</TableHead>
                                            <TableHead>Period</TableHead>
                                            <TableHead>Producer Supply (kg)</TableHead>
                                            <TableHead>Wholesaler Demand (kg)</TableHead>
                                            <TableHead>Retailer Demand (kg)</TableHead>
                                            <TableHead>Consumer Demand (kg)</TableHead>
                                            <TableHead>Price Impact (%)</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {supplyDemandData.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">{getProductName(item.product_id)}</TableCell>
                                                <TableCell>{getDistrictName(item.district_id)}</TableCell>
                                                <TableCell>{item.period}</TableCell>
                                                <TableCell>{item.producer_supply?.toLocaleString()}</TableCell>
                                                <TableCell>{item.wholesaler_demand?.toLocaleString()}</TableCell>
                                                <TableCell>{item.retailer_demand?.toLocaleString()}</TableCell>
                                                <TableCell>{item.consumer_demand?.toLocaleString()}</TableCell>
                                                <TableCell>{item.price_impact?.toFixed(2)}%</TableCell>
                                                <TableCell>
                                                    <Badge variant={item.producer_supply > item.consumer_demand ? "default" : "destructive"}>
                                                        {item.producer_supply > item.consumer_demand ? 'Surplus' : 'Shortage'}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Add Consumption Pattern Form - Positioned above table */}
            {showAddForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>Add Consumption Pattern</CardTitle>
                        <CardDescription>Enter comprehensive consumption pattern data for analysis</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Information Section */}
                            <div>
                                <h4 className="text-lg font-medium text-foreground mb-4">Basic Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="consumer_name" className="text-foreground">Consumer *</Label>
                                        <Select value={formData.stakeholder_id}
                                                onValueChange={(value) => handleInputChange("stakeholder_id", value)}>
                                            <SelectTrigger className="bg-background text-foreground border-border">
                                                <SelectValue placeholder="Select Consumer"/>
                                            </SelectTrigger>
                                            <SelectContent className="bg-background border-border">
                                                {stakeholders.map((stakeholder) => (
                                                    <SelectItem 
                                                        key={stakeholder.stakeholder_id} 
                                                        value={stakeholder.stakeholder_id}
                                                        className="text-foreground hover:bg-muted focus:bg-muted"
                                                    >
                                                        {stakeholder.NAME || stakeholder.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="product_id" className="text-foreground">Product *</Label>
                                        <Select value={formData.product_id}
                                                onValueChange={(value) => handleInputChange("product_id", value)}>
                                            <SelectTrigger className="bg-background text-foreground border-border">
                                                <SelectValue placeholder="Select Product"/>
                                            </SelectTrigger>
                                            <SelectContent className="bg-background border-border">
                                                {products.map((product) => (
                                                    <SelectItem 
                                                        key={product.product_id} 
                                                        value={product.product_id}
                                                        className="text-foreground hover:bg-muted focus:bg-muted"
                                                    >
                                                        {getProductName(product.product_id)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="consumption_date" className="text-foreground">Consumption Date
                                            *</Label>
                                        <Input
                                            id="consumption_date"
                                            type="date"
                                            value={formData.consumption_date}
                                            onChange={(e) => handleInputChange("consumption_date", e.target.value)}
                                            required
                                            className="bg-background text-foreground border-border"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="district_id" className="text-foreground">District *</Label>
                                        <Select value={formData.district_id}
                                                onValueChange={(value) => handleInputChange("district_id", value)}>
                                            <SelectTrigger className="bg-background text-foreground border-border">
                                                <SelectValue placeholder="Select District"/>
                                            </SelectTrigger>
                                            <SelectContent className="bg-background border-border">
                                                {districts.map((district) => (
                                                    <SelectItem 
                                                        key={district.district_id} 
                                                        value={district.district_id.toString()}
                                                        className="text-foreground hover:bg-muted focus:bg-muted"
                                                    >
                                                        {district.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="demographic_group" className="text-foreground">Demographic Group *</Label>
                                        <Select value={formData.demographic_group}
                                                onValueChange={(value) => handleInputChange("demographic_group", value)}>
                                            <SelectTrigger className="bg-background text-foreground border-border">
                                                <SelectValue placeholder="Select Demographic"/>
                                            </SelectTrigger>
                                            <SelectContent className="bg-background border-border">
                                                <SelectItem value="Urban" className="text-foreground hover:bg-muted focus:bg-muted">Urban</SelectItem>
                                                <SelectItem value="Rural" className="text-foreground hover:bg-muted focus:bg-muted">Rural</SelectItem>
                                                <SelectItem value="Suburban" className="text-foreground hover:bg-muted focus:bg-muted">Suburban</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {/* Consumption Data Section */}
                            <div>
                                <h4 className="text-lg font-medium text-foreground mb-4">Consumption Data</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="quantity_consumed" className="text-foreground">Quantity Consumed
                                            (kg) *</Label>
                                        <Input
                                            id="quantity_consumed"
                                            type="number"
                                            step="0.1"
                                            placeholder="e.g., 5.5"
                                            value={formData.quantity_consumed}
                                            onChange={(e) => handleInputChange("quantity_consumed", parseFloat(e.target.value) || 0)}
                                            required
                                            className="bg-background text-foreground border-border"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="amount_spent" className="text-foreground">Amount Spent (৳)
                                            *</Label>
                                        <Input
                                            id="amount_spent"
                                            type="number"
                                            step="0.01"
                                            placeholder="e.g., 450.00"
                                            value={formData.amount_spent}
                                            onChange={(e) => handleInputChange("amount_spent", parseFloat(e.target.value) || 0)}
                                            required
                                            className="bg-background text-foreground border-border"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="household_size" className="text-foreground">Household Size
                                            *</Label>
                                        <Input
                                            id="household_size"
                                            type="number"
                                            min="1"
                                            placeholder="e.g., 4"
                                            value={formData.household_size}
                                            onChange={(e) => handleInputChange("household_size", parseInt(e.target.value) || 0)}
                                            required
                                            className="bg-background text-foreground border-border"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex gap-4 pt-4 border-t border-border">
                                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                                    <Plus className="h-4 w-4 mr-2"/>
                                    Add Consumption Pattern
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Filters and Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Consumption Pattern Data</CardTitle>
                    <CardDescription>Filter and view detailed consumption patterns</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                            <Input
                                placeholder="Search consumers, products, locations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-background text-foreground border-border"
                            />
                        </div>
                        <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                            <SelectTrigger className="w-full md:w-48 bg-background text-foreground border-border">
                                <SelectValue placeholder="Select Season"/>
                            </SelectTrigger>
                            <SelectContent className="bg-background border-border">
                                <SelectItem value="all" className="text-foreground hover:bg-muted focus:bg-muted">All Seasons</SelectItem>
                                <SelectItem value="Spring" className="text-foreground hover:bg-muted focus:bg-muted">Spring</SelectItem>
                                <SelectItem value="Summer">Summer</SelectItem>
                                <SelectItem value="Monsoon">Monsoon</SelectItem>
                                <SelectItem value="Winter">Winter</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={selectedDemographic} onValueChange={setSelectedDemographic}>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Select Demographic"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Demographics</SelectItem>
                                <SelectItem value="Upper Class">Upper Class</SelectItem>
                                <SelectItem value="Upper Middle Class">Upper Middle Class</SelectItem>
                                <SelectItem value="Middle Class">Middle Class</SelectItem>
                                <SelectItem value="Lower Middle Class">Lower Middle Class</SelectItem>
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
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Consumer</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Amount Spent</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Season</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.map((pattern) => (
                                    <TableRow key={pattern.consumption_id}>
                                        <TableCell className="font-medium">{pattern.stakeholder_id}</TableCell>
                                        <TableCell>{getProductName(pattern.product_id)}</TableCell>
                                        <TableCell>{new Date(pattern.consumption_date).toLocaleDateString()}</TableCell>
                                        <TableCell>{pattern.quantity_consumed} kg</TableCell>
                                        <TableCell>৳{pattern.amount_spent.toLocaleString()}</TableCell>
                                        <TableCell>{getDistrictName(pattern.district_id)}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{pattern.demographic_group}</Badge>
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
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Consumption Trends</CardTitle>
                        <CardDescription>Product consumption over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={monthlyConsumptionData}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis
                                        dataKey="month"
                                        label={{value: 'Month', position: 'insideBottom', offset: -5}}
                                    />
                                    <YAxis
                                        label={{value: 'Consumption (kg)', angle: -90, position: 'insideLeft'}}
                                    />
                                    <ChartTooltip content={<ChartTooltipContent/>}/>
                                    <Legend/>
                                    <Line type="monotone" dataKey="wheat" stroke="#8884d8" strokeWidth={2}/>
                                    <Line type="monotone" dataKey="rice" stroke="#82ca9d" strokeWidth={2}/>
                                    <Line type="monotone" dataKey="corn" stroke="#ffc658" strokeWidth={2}/>
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Demographic Distribution</CardTitle>
                        <CardDescription>Consumption by demographic groups</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={demographicConsumption}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {demographicConsumption.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color}/>
                                        ))}
                                    </Pie>
                                    <ChartTooltip content={<ChartTooltipContent/>}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Seasonal Consumption Analysis</CardTitle>
                    <CardDescription>Consumption patterns across different seasons</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={{}} className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={seasonalTrends}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis
                                    dataKey="season"
                                    label={{value: 'Season', position: 'insideBottom', offset: -5}}
                                />
                                <YAxis
                                    yAxisId="left"
                                    label={{value: 'Consumption (kg)', angle: -90, position: 'insideLeft'}}
                                />
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    label={{value: 'Spending (৳)', angle: 90, position: 'insideRight'}}
                                />
                                <ChartTooltip content={<ChartTooltipContent/>}/>
                                <Legend/>
                                <Bar yAxisId="left" dataKey="consumption" fill="#8884d8" name="Consumption (kg)"/>
                                <Bar yAxisId="right" dataKey="spending" fill="#82ca9d" name="Spending (৳)"/>
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    )
}