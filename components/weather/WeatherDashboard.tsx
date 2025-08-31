"use client"

import {useState, useEffect} from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Badge} from "@/components/ui/badge"
import {Search, Plus, Edit2, Trash2, Cloud, Droplets, Thermometer, TrendingUp, TrendingDown, AlertTriangle, BarChart3, Activity} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area, ScatterChart, Scatter } from 'recharts'

// Helper to safely format numbers
function safeNumberFormat(value: any, decimals: number = 1, defaultValue: string = '0.0') {
    const num = Number(value);
    if (isNaN(num)) return defaultValue;
    return num.toFixed(decimals);
}

interface Weather {
    weather_id: string
    district_id: number
    date: string
    rainfall: number
    temperature: number
    district_name?: string
}

interface District {
    district_id: number
    name: string
}

interface WeatherImpact {
    product_id: string
    product_name: string
    district_name: string
    month_year: string
    avg_rainfall: number
    avg_temperature: number
    total_production: number
    total_acreage: number
    productivity_per_acre: number
    rainfall_category: string
    temperature_category: string
}

interface SeasonalWeather {
    product_id: string
    product_name: string
    sowing_time: string
    harvest_time: string
    district_name: string
    season_quarter: number
    season_name: string
    avg_seasonal_rainfall: number
    avg_seasonal_temperature: number
    min_rainfall: number
    max_rainfall: number
    min_temperature: number
    max_temperature: number
    days_recorded: number
    heavy_rain_days: number
    extreme_heat_days: number
    avg_seasonal_price: number
    seasonal_production: number
}

interface RegionalWeather {
    product_id: string
    product_name: string
    district_name: string
    recording_days: number
    avg_rainfall: number
    avg_temperature: number
    rainfall_variability: number
    temperature_variability: number
    total_production: number
    avg_price: number
    production_rank: number
    price_rank: number
    weather_suitability: string
}

export default function WeatherDashboard() {
    const [weather, setWeather] = useState<Weather[]>([])
    const [districts, setDistricts] = useState<District[]>([])
    const [products, setProducts] = useState<any[]>([])
    const [weatherImpact, setWeatherImpact] = useState<WeatherImpact[]>([])
    const [seasonalData, setSeasonalData] = useState<SeasonalWeather[]>([])
    const [regionalData, setRegionalData] = useState<RegionalWeather[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedDistrict, setSelectedDistrict] = useState("all")
    const [selectedProduct, setSelectedProduct] = useState("all")
    const [selectedDateRange, setSelectedDateRange] = useState({start: '', end: ''})
    const [activeTab, setActiveTab] = useState('overview')
    const [showForm, setShowForm] = useState(false)
    const [editingWeather, setEditingWeather] = useState<Weather | null>(null)
    const [formData, setFormData] = useState<Weather>({
        weather_id: "",
        district_id: 0,
        date: "",
        rainfall: 0,
        temperature: 0
    })

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [weatherRes, districtsRes, productsRes] = await Promise.all([
                fetch('/api/weather'),
                fetch('/api/districts'),
                fetch('/api/products')
            ]);
            
            const weatherData = await weatherRes.json();
            const districtsData = await districtsRes.json();
            const productsData = await productsRes.json();
            
            setWeather(weatherData);
            setDistricts(districtsData);
            setProducts(productsData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const fetchWeatherImpact = async () => {
        if (selectedProduct === 'all' || selectedDistrict === 'all') return;
        
        try {
            const params = new URLSearchParams({
                type: 'correlation',
                product_id: selectedProduct,
                district_id: selectedDistrict
            });
            
            if (selectedDateRange.start && selectedDateRange.end) {
                params.append('start_date', selectedDateRange.start);
                params.append('end_date', selectedDateRange.end);
            }
            
            const response = await fetch(`/api/weather-impact?${params}`);
            const data = await response.json();
            setWeatherImpact(data);
        } catch (error) {
            console.error('Error fetching weather impact:', error);
        }
    };
    
    const fetchSeasonalData = async () => {
        if (selectedProduct === 'all' || selectedDistrict === 'all') return;
        
        try {
            const params = new URLSearchParams({
                type: 'seasonal_analysis',
                product_id: selectedProduct,
                district_id: selectedDistrict
            });
            
            if (selectedDateRange.start && selectedDateRange.end) {
                params.append('start_date', selectedDateRange.start);
                params.append('end_date', selectedDateRange.end);
            }
            
            const response = await fetch(`/api/weather-impact?${params}`);
            const data = await response.json();
            setSeasonalData(data);
        } catch (error) {
            console.error('Error fetching seasonal data:', error);
        }
    };
    
    const fetchRegionalData = async () => {
        if (selectedProduct === 'all') return;
        
        try {
            const params = new URLSearchParams({
                type: 'regional_comparison',
                product_id: selectedProduct
            });
            
            if (selectedDateRange.start && selectedDateRange.end) {
                params.append('start_date', selectedDateRange.start);
                params.append('end_date', selectedDateRange.end);
            }
            
            const response = await fetch(`/api/weather-impact?${params}`);
            const data = await response.json();
            setRegionalData(data);
        } catch (error) {
            console.error('Error fetching regional data:', error);
        }
    };
    
    useEffect(() => {
        if (activeTab === 'impact' && selectedProduct !== 'all' && selectedDistrict !== 'all') {
            fetchWeatherImpact();
        } else if (activeTab === 'seasonal' && selectedProduct !== 'all' && selectedDistrict !== 'all') {
            fetchSeasonalData();
        } else if (activeTab === 'regional' && selectedProduct !== 'all') {
            fetchRegionalData();
        }
    }, [activeTab, selectedProduct, selectedDistrict, selectedDateRange]);

    const handleInputChange = (field: keyof Weather, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const method = editingWeather ? 'PUT' : 'POST';
            const response = await fetch('/api/weather', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            
            if (response.ok) {
                await fetchData();
                resetForm();
            }
        } catch (error) {
            console.error('Error saving weather:', error);
        }
    }

    const handleEdit = (weatherRecord: Weather) => {
        setEditingWeather(weatherRecord);
        setFormData(weatherRecord);
        setShowForm(true);
    }

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this weather record?')) {
            try {
                const response = await fetch(`/api/weather?id=${id}`, {
                    method: 'DELETE',
                });
                
                if (response.ok) {
                    await fetchData();
                }
            } catch (error) {
                console.error('Error deleting weather:', error);
            }
        }
    }

    const resetForm = () => {
        setFormData({
            weather_id: "",
            district_id: 0,
            date: "",
            rainfall: 0,
            temperature: 0
        });
        setEditingWeather(null);
        setShowForm(false);
    }

    const filteredWeather = weather.filter(record => {
        const matchesSearch = (record.district_name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        const matchesDistrict = selectedDistrict === "all" || record.district_id.toString() === selectedDistrict
        return matchesSearch && matchesDistrict
    })

    const averageRainfall = weather.length > 0 ? weather.reduce((sum, w) => sum + (w.rainfall || 0), 0) / weather.length : 0;
    const averageTemperature = weather.length > 0 ? weather.reduce((sum, w) => sum + (w.temperature || 0), 0) / weather.length : 0;
    const maxRainfall = weather.length > 0 ? Math.max(...weather.map(w => w.rainfall || 0)) : 0;
    const maxTemperature = weather.length > 0 ? Math.max(...weather.map(w => w.temperature || 0)) : 0;

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground mb-2">Weather Impact Analysis</h1>
                            <p className="text-muted-foreground">Comprehensive weather monitoring and agricultural impact analysis</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="bg-sky-50 p-4 rounded-xl">
                                <Activity className="h-8 w-8 text-sky-600" />
                            </div>
                        </div>
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
                            
                            <div className="flex items-end">
                                <Button onClick={() => setShowForm(true)} className="bg-sky-600 hover:bg-sky-700">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Data
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Active Stations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{districts.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2 flex flex-row items-center space-y-0 space-x-2">
                            <Droplets className="h-4 w-4 text-blue-600" />
                            <CardTitle className="text-sm font-medium text-gray-500">Avg Rainfall</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{safeNumberFormat(averageRainfall, 1)}mm</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2 flex flex-row items-center space-y-0 space-x-2">
                            <Thermometer className="h-4 w-4 text-red-600" />
                            <CardTitle className="text-sm font-medium text-gray-500">Avg Temperature</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{safeNumberFormat(averageTemperature, 1)}°C</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Weather Records</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{weather.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Extreme Events</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">
                                {weather.filter(w => w.rainfall > 50 || w.temperature > 40 || w.temperature < 10).length}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                
                {/* Enhanced Analysis Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Weather Overview</TabsTrigger>
                        <TabsTrigger value="impact">Agricultural Impact</TabsTrigger>
                        <TabsTrigger value="seasonal">Seasonal Analysis</TabsTrigger>
                        <TabsTrigger value="regional">Regional Comparison</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="mt-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Temperature Trends</CardTitle>
                                    <CardDescription>Daily temperature variations across time</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {filteredWeather.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={300}>
                                            <LineChart data={filteredWeather.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="date" />
                                                <YAxis />
                                                <Tooltip />
                                                <Line type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={2} name="Temperature (°C)" />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="flex items-center justify-center h-[300px] text-gray-500">
                                            No temperature data available
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                            
                            <Card>
                                <CardHeader>
                                    <CardTitle>Rainfall Distribution</CardTitle>
                                    <CardDescription>Precipitation patterns over time</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {filteredWeather.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={filteredWeather.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="date" />
                                                <YAxis />
                                                <Tooltip />
                                                <Bar dataKey="rainfall" fill="#3b82f6" name="Rainfall (mm)" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="flex items-center justify-center h-[300px] text-gray-500">
                                            No rainfall data available
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                            
                            <Card className="lg:col-span-2">
                                <CardHeader>
                                    <CardTitle>Weather Alerts & Warnings</CardTitle>
                                    <CardDescription>Extreme weather conditions that may impact agriculture</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {weather.filter(w => w.rainfall > 50).slice(0, 3).map((alert, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                                                <div className="flex items-center space-x-3">
                                                    <Droplets className="h-5 w-5 text-blue-600" />
                                                    <div>
                                                        <p className="font-medium text-blue-900">Heavy Rainfall Alert</p>
                                                        <p className="text-sm text-blue-700">{alert.district_name || `District ${alert.district_id}`} - {new Date(alert.date).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <Badge variant="secondary">{safeNumberFormat(alert.rainfall, 1)}mm</Badge>
                                            </div>
                                        ))}
                                        
                                        {weather.filter(w => w.temperature > 38).slice(0, 3).map((alert, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                                                <div className="flex items-center space-x-3">
                                                    <Thermometer className="h-5 w-5 text-red-600" />
                                                    <div>
                                                        <p className="font-medium text-red-900">Extreme Heat Warning</p>
                                                        <p className="text-sm text-red-700">{alert.district_name || `District ${alert.district_id}`} - {new Date(alert.date).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <Badge variant="destructive">{safeNumberFormat(alert.temperature, 1)}°C</Badge>
                                            </div>
                                        ))}
                                        
                                        {weather.filter(w => w.rainfall < 1 && w.temperature > 35).slice(0, 2).map((alert, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                                                <div className="flex items-center space-x-3">
                                                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                                                    <div>
                                                        <p className="font-medium text-yellow-900">Drought Conditions</p>
                                                        <p className="text-sm text-yellow-700">{alert.district_name || `District ${alert.district_id}`} - {new Date(alert.date).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <Badge variant="outline">Critical</Badge>
                                            </div>
                                        ))}
                                        
                                        {weather.length === 0 && (
                                            <div className="text-center py-8 text-gray-500">
                                                <Cloud className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                                <p>No weather alerts at this time</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                    
                    <TabsContent value="impact" className="mt-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Weather-Production Correlation</CardTitle>
                                    <CardDescription>How weather conditions affect agricultural productivity</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {weatherImpact.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={300}>
                                            <ScatterChart data={weatherImpact}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="avg_rainfall" name="Rainfall (mm)" />
                                                <YAxis dataKey="productivity_per_acre" name="Productivity (tons/acre)" />
                                                <Tooltip />
                                                <Scatter dataKey="productivity_per_acre" fill="#10b981" />
                                            </ScatterChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="flex items-center justify-center h-[300px] text-gray-500">
                                            {selectedProduct === 'all' || selectedDistrict === 'all' ? 
                                                'Please select specific product and district' : 'Loading impact data...'}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                            
                            <Card>
                                <CardHeader>
                                    <CardTitle>Impact Analysis Summary</CardTitle>
                                    <CardDescription>Weather condition categorization and effects</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {weatherImpact.slice(0, 5).map((item, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p className="font-medium">{item.month_year}</p>
                                                    <p className="text-sm text-muted-foreground">{item.rainfall_category} | {item.temperature_category}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold">{safeNumberFormat(item.productivity_per_acre, 2)} tons/acre</p>
                                                    <p className="text-sm text-muted-foreground">{item.total_production?.toLocaleString()} tons total</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                    
                    <TabsContent value="seasonal" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Seasonal Weather Patterns</CardTitle>
                                <CardDescription>Weather trends across different seasons and their agricultural impact</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {seasonalData.length > 0 ? (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={seasonalData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="season_name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Bar dataKey="avg_seasonal_rainfall" fill="#3b82f6" name="Rainfall (mm)" />
                                                <Bar dataKey="avg_seasonal_temperature" fill="#ef4444" name="Temperature (°C)" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                        
                                        <ResponsiveContainer width="100%" height={300}>
                                            <AreaChart data={seasonalData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="season_name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Area type="monotone" dataKey="seasonal_production" stroke="#10b981" fill="#10b981" fillOpacity={0.3} name="Production" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-[300px] text-gray-500">
                                        {selectedProduct === 'all' || selectedDistrict === 'all' ? 
                                            'Please select specific product and district' : 'Loading seasonal data...'}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                    
                    <TabsContent value="regional" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Regional Weather Suitability</CardTitle>
                                <CardDescription>Weather conditions comparison across different regions</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>District</TableHead>
                                                <TableHead>Avg Rainfall</TableHead>
                                                <TableHead>Avg Temperature</TableHead>
                                                <TableHead>Weather Suitability</TableHead>
                                                <TableHead>Production Rank</TableHead>
                                                <TableHead>Total Production</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {regionalData.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="font-medium">{item.district_name}</TableCell>
                                                    <TableCell>{safeNumberFormat(item.avg_rainfall, 1)}mm</TableCell>
                                                    <TableCell>{safeNumberFormat(item.avg_temperature, 1)}°C</TableCell>
                                                    <TableCell>
                                                        <Badge variant={item.weather_suitability === 'Favorable' ? 'default' : 
                                                                     item.weather_suitability === 'Challenging' ? 'destructive' : 'secondary'}>
                                                            {item.weather_suitability}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>#{item.production_rank}</TableCell>
                                                    <TableCell>{item.total_production?.toLocaleString()} tons</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>


                {/* Add/Edit Form */}
                {showForm && (
                    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                        <h2 className="text-xl font-semibold text-foreground mb-4">
                            {editingWeather ? 'Edit Weather' : 'Add New Weather Record'}
                        </h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="weather_id">Weather ID *</Label>
                                <Input
                                    id="weather_id"
                                    value={formData.weather_id}
                                    onChange={(e) => handleInputChange("weather_id", e.target.value)}
                                    required
                                    disabled={!!editingWeather}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="district_id">District *</Label>
                                <Select value={formData.district_id.toString()} onValueChange={(value) => handleInputChange("district_id", parseInt(value))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select district" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {districts.map(district => (
                                            <SelectItem key={district.district_id} value={district.district_id.toString()}>
                                                {district.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="date">Date *</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => handleInputChange("date", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="rainfall">Rainfall (mm)</Label>
                                <Input
                                    id="rainfall"
                                    type="number"
                                    step="0.1"
                                    value={formData.rainfall}
                                    onChange={(e) => handleInputChange("rainfall", parseFloat(e.target.value) || 0)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="temperature">Temperature (°C)</Label>
                                <Input
                                    id="temperature"
                                    type="number"
                                    step="0.1"
                                    value={formData.temperature}
                                    onChange={(e) => handleInputChange("temperature", parseFloat(e.target.value) || 0)}
                                />
                            </div>

                            <div className="md:col-span-2 flex gap-4">
                                <Button type="submit" className="bg-sky-600 hover:bg-sky-700">
                                    {editingWeather ? 'Update Weather' : 'Add Weather'}
                                </Button>
                                <Button type="button" variant="outline" onClick={resetForm}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Weather Table */}
                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-border">
                        <h2 className="text-xl font-semibold text-foreground">
                            Weather Records ({filteredWeather.length})
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead>Weather ID</TableHead>
                                    <TableHead>District</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Rainfall (mm)</TableHead>
                                    <TableHead>Temperature (°C)</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredWeather.map((weatherRecord) => (
                                    <TableRow key={weatherRecord.weather_id} className="hover:bg-gray-50">
                                        <TableCell className="font-medium">{weatherRecord.weather_id}</TableCell>
                                        <TableCell>{weatherRecord.district_name || weatherRecord.district_id}</TableCell>
                                        <TableCell>{new Date(weatherRecord.date).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-1">
                                                <Droplets className="h-4 w-4 text-blue-600" />
                                                <span>{safeNumberFormat(weatherRecord.rainfall, 1)}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-1">
                                                <Thermometer className="h-4 w-4 text-red-600" />
                                                <span>{safeNumberFormat(weatherRecord.temperature, 1)}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                                    onClick={() => handleEdit(weatherRecord)}
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                                    onClick={() => handleDelete(weatherRecord.weather_id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    )
}
