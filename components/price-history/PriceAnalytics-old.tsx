"use client"

import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Badge} from "@/components/ui/badge"
import {ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Legend
} from "recharts"
import {Search, Plus, Edit2, Trash2, BarChart3, TrendingUp, DollarSign, FileDown} from "lucide-react"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Label} from "@/components/ui/label"
import {exportPriceData} from "@/lib/pdfExport"

interface PriceHistory {
    price_id: string
    product_id: string
    product_name: string
    date_recorded: string
    location: string
    wholesale_price: number
    retail_price: number
    harvest_season_price: number
    season: string
    weather_id: string
}

const priceHistory: PriceHistory[] = [
    {
        price_id: "PH001",
        product_id: "P001",
        product_name: "Wheat",
        date_recorded: "2024-01-15",
        location: "Dhaka",
        wholesale_price: 40,
        retail_price: 45,
        harvest_season_price: 38,
        season: "Winter",
        weather_id: "W001"
    },
    {
        price_id: "PH002",
        product_id: "P002",
        product_name: "Rice",
        date_recorded: "2024-01-15",
        location: "Chittagong",
        wholesale_price: 60,
        retail_price: 68,
        harvest_season_price: 55,
        season: "Winter",
        weather_id: "W002"
    },
    {
        price_id: "PH003",
        product_id: "P003",
        product_name: "Corn",
        date_recorded: "2024-01-16",
        location: "Sylhet",
        wholesale_price: 35,
        retail_price: 42,
        harvest_season_price: 32,
        season: "Winter",
        weather_id: "W003"
    },
    {
        price_id: "PH004",
        product_id: "P001",
        product_name: "Wheat",
        date_recorded: "2024-01-18",
        location: "Rajshahi",
        wholesale_price: 38,
        retail_price: 43,
        harvest_season_price: 36,
        season: "Winter",
        weather_id: "W004"
    }
]

// Sample trend data for charts
const priceTrendData = [
    {month: "Oct", wheat: 42, rice: 58, corn: 38},
    {month: "Nov", wheat: 40, rice: 62, corn: 36},
    {month: "Dec", wheat: 39, rice: 60, corn: 34},
    {month: "Jan", wheat: 40, rice: 60, corn: 35},
]

export default function PriceAnalytics() {
    const [searchTerm, setSearchTerm] = useState("")
    const [showAddForm, setShowAddForm] = useState(false)
    const [priceHistoryData, setPriceHistoryData] = useState<PriceHistory[]>(priceHistory)
    const [formData, setFormData] = useState({
        price_id: "",
        product_id: "",
        product_name: "",
        location: "",
        date_recorded: "",
        wholesale_price: "",
        retail_price: "",
        harvest_season_price: "",
        season: "",
        weather_id: ""
    })

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const newPriceRecord: PriceHistory = {
            price_id: formData.price_id,
            product_id: formData.product_id,
            product_name: formData.product_name,
            date_recorded: formData.date_recorded,
            location: formData.location,
            wholesale_price: parseFloat(formData.wholesale_price) || 0,
            retail_price: parseFloat(formData.retail_price) || 0,
            harvest_season_price: parseFloat(formData.harvest_season_price) || 0,
            season: formData.season,
            weather_id: formData.weather_id
        }

        setPriceHistoryData([...priceHistoryData, newPriceRecord])

        // Reset form
        setFormData({
            price_id: "",
            product_id: "",
            product_name: "",
            location: "",
            date_recorded: "",
            wholesale_price: "",
            retail_price: "",
            harvest_season_price: "",
            season: "",
            weather_id: ""
        })
        setShowAddForm(false)
        alert("Price record added successfully!")
    }

    const filteredPriceHistory = priceHistoryData.filter(record =>
        record.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.price_id.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getMarginPercentage = (retail: number, wholesale: number) => {
        return (((retail - wholesale) / wholesale) * 100).toFixed(1)
    }

    const getSeasonalVariation = (current: number, harvest: number) => {
        return (((current - harvest) / harvest) * 100).toFixed(1)
    }

    const products = [
        {id: "P001", name: "Wheat"},
        {id: "P002", name: "Rice"},
        {id: "P003", name: "Corn"}
    ]
    const seasons = [
        {id: "Winter", name: "Winter"},
        {id: "Summer", name: "Summer"},
        {id: "Spring", name: "Spring"},
        {id: "Autumn", name: "Autumn"}
    ]

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Price History & Analytics</h1>
                    <p className="mt-2 text-muted-foreground">Track price trends and market analytics</p>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                        <Input
                            type="search"
                            placeholder="Search price records..."
                            className="pl-10 w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button onClick={() => setShowAddForm(true)}>
                        <Plus className="w-4 h-4 mr-2"/>
                        Add Price Record
                    </Button>
                    <Button onClick={() => exportPriceData(priceHistoryData as unknown as Record<string, unknown>[])}>
                        <FileDown className="w-4 h-4 mr-2"/>
                        Export Data
                    </Button>
                </div>
            </div>

            {/* 1. STATISTICS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Total Records</CardTitle>
                        <BarChart3 className="h-4 w-4 text-blue-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{priceHistoryData.length}</div>
                        <p className="text-xs text-muted-foreground">Price records</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Avg Wholesale Price</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${(priceHistoryData.reduce((sum, p) => sum + p.wholesale_price, 0) / priceHistoryData.length).toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground">Per unit</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Avg Retail Price</CardTitle>
                        <DollarSign className="h-4 w-4 text-purple-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${(priceHistoryData.reduce((sum, p) => sum + p.retail_price, 0) / priceHistoryData.length).toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground">Per unit</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Avg Margin</CardTitle>
                        <TrendingUp className="h-4 w-4 text-orange-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {(priceHistoryData.reduce((sum, p) => sum + ((p.retail_price - p.wholesale_price) / p.wholesale_price), 0) / priceHistoryData.length * 100).toFixed(1)}%
                        </div>
                        <p className="text-xs text-muted-foreground">Retail markup</p>
                    </CardContent>
                </Card>
            </div>

            {/* 2. ENTRY DATA FORM */}
            {showAddForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>Add Price Record</CardTitle>
                        <CardDescription>Enter current market pricing information</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Information Section */}
                            <div>
                                <h4 className="text-lg font-medium text-foreground mb-4">Basic Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="price_id" className="text-foreground">Price ID *</Label>
                                        <Input
                                            id="price_id"
                                            type="text"
                                            placeholder="e.g., PH005"
                                            value={formData.price_id}
                                            onChange={(e) => handleInputChange("price_id", e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="product_id" className="text-foreground">Product *</Label>
                                        <Select value={formData.product_id}
                                                onValueChange={(value) => {
                                                    handleInputChange("product_id", value)
                                                    const selectedProduct = products.find(p => p.id === value)
                                                    if (selectedProduct) {
                                                        handleInputChange("product_name", selectedProduct.name)
                                                    }
                                                }}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Product"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {products.map((product) => (
                                                    <SelectItem key={product.id} value={product.id}>
                                                        {product.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="product_name" className="text-foreground">Product Name</Label>
                                        <Input
                                            id="product_name"
                                            type="text"
                                            placeholder="Auto-filled from selection"
                                            value={formData.product_name}
                                            onChange={(e) => handleInputChange("product_name", e.target.value)}
                                            readOnly
                                            className="bg-gray-50"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="location" className="text-foreground">Location *</Label>
                                        <Input
                                            id="location"
                                            type="text"
                                            placeholder="e.g., Dhaka"
                                            value={formData.location}
                                            onChange={(e) => handleInputChange("location", e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="date_recorded" className="text-foreground">Date Recorded *</Label>
                                        <Input
                                            id="date_recorded"
                                            type="date"
                                            value={formData.date_recorded}
                                            onChange={(e) => handleInputChange("date_recorded", e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="season" className="text-foreground">Season *</Label>
                                        <Select value={formData.season}
                                                onValueChange={(value) => handleInputChange("season", value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Season"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {seasons.map((season) => (
                                                    <SelectItem key={season.id} value={season.id}>
                                                        {season.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {/* Price Information Section */}
                            <div>
                                <h4 className="text-lg font-medium text-foreground mb-4">Price Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="wholesale_price" className="text-foreground">Wholesale Price ($)
                                            *</Label>
                                        <Input
                                            id="wholesale_price"
                                            type="number"
                                            step="0.01"
                                            placeholder="e.g., 40.00"
                                            value={formData.wholesale_price}
                                            onChange={(e) => handleInputChange("wholesale_price", e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="retail_price" className="text-foreground">Retail Price ($)
                                            *</Label>
                                        <Input
                                            id="retail_price"
                                            type="number"
                                            step="0.01"
                                            placeholder="e.g., 45.00"
                                            value={formData.retail_price}
                                            onChange={(e) => handleInputChange("retail_price", e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="harvest_season_price" className="text-foreground">Harvest Season
                                            Price ($) *</Label>
                                        <Input
                                            id="harvest_season_price"
                                            type="number"
                                            step="0.01"
                                            placeholder="e.g., 38.00"
                                            value={formData.harvest_season_price}
                                            onChange={(e) => handleInputChange("harvest_season_price", e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Real-time calculations */}
                                {formData.wholesale_price && formData.retail_price && (
                                    <div className="bg-blue-50 p-4 rounded-lg mt-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-blue-700">Retail Margin:</span>
                                                <span className="font-semibold text-blue-800">
                                                    {(((parseFloat(formData.retail_price) - parseFloat(formData.wholesale_price)) / parseFloat(formData.wholesale_price)) * 100).toFixed(1)}%
                                                </span>
                                            </div>
                                            {formData.harvest_season_price && (
                                                <div className="flex justify-between">
                                                    <span className="text-blue-700">Seasonal Variation:</span>
                                                    <span className="font-semibold text-blue-800">
                                                        {(((parseFloat(formData.retail_price) - parseFloat(formData.harvest_season_price)) / parseFloat(formData.harvest_season_price)) * 100).toFixed(1)}%
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Additional Information Section */}
                            <div>
                                <h4 className="text-lg font-medium text-foreground mb-4">Additional Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="weather_id" className="text-foreground">Weather ID</Label>
                                        <Input
                                            id="weather_id"
                                            type="text"
                                            placeholder="e.g., W001"
                                            value={formData.weather_id}
                                            onChange={(e) => handleInputChange("weather_id", e.target.value)}
                                        />
                                        <p className="text-xs text-gray-500">Optional weather reference</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-border">
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                                    <Plus className="h-4 w-4 mr-2"/>
                                    Add Price Record
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
                    <CardTitle>Price History Records</CardTitle>
                    <CardDescription>Historical pricing data by season</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Price ID</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Wholesale Price</TableHead>
                                <TableHead>Retail Price</TableHead>
                                <TableHead>Harvest Price</TableHead>
                                <TableHead>Margin</TableHead>
                                <TableHead>Seasonal Var.</TableHead>
                                <TableHead>Season</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPriceHistory.map((record) => (
                                <TableRow key={record.price_id}>
                                    <TableCell className="font-medium">{record.price_id}</TableCell>
                                    <TableCell>{record.product_name}</TableCell>
                                    <TableCell>{record.date_recorded}</TableCell>
                                    <TableCell>${record.wholesale_price}</TableCell>
                                    <TableCell>${record.retail_price}</TableCell>
                                    <TableCell>${record.harvest_season_price}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {getMarginPercentage(record.retail_price, record.wholesale_price)}%
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={Math.abs(parseFloat(getSeasonalVariation(record.retail_price, record.harvest_season_price))) > 10 ? "destructive" : "default"}>
                                            {getSeasonalVariation(record.retail_price, record.harvest_season_price)}%
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{record.season}</Badge>
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
                </CardContent>
            </Card>

            {/* 4. CHARTS */}
            <div className="grid grid-cols-1 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Price Trends Over Time</CardTitle>
                        <CardDescription>Monthly price variations by product</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer
                            config={{
                                wheat: {label: "Wheat", color: "#8884d8"},
                                rice: {label: "Rice", color: "#82ca9d"},
                                corn: {label: "Corn", color: "#ffc658"}
                            }}
                            className="h-[300px]"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={priceTrendData}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis
                                        dataKey="month"
                                        tick={{fontSize: 12}}
                                        tickFormatter={(tick) => tick}
                                        label={{value: 'Month', position: 'insideBottom', offset: -5}}
                                    />
                                    <YAxis
                                        tick={{fontSize: 12}}
                                        tickFormatter={(tick) => `$${tick}`}
                                        label={{value: 'Price ($)', angle: -90, position: 'insideLeft'}}
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
            </div>
        </div>
    )
}