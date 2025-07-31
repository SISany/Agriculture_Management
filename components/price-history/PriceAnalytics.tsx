"use client"

import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Badge} from "@/components/ui/badge"
import {ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart"
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Legend
} from "recharts"
import {Search, Plus, Edit2, Trash2, BarChart3, TrendingUp, DollarSign} from "lucide-react"

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

    const filteredPriceHistory = priceHistory.filter(record =>
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

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Price History & Analytics</h1>
                    <p className="mt-2 text-gray-600">Track price trends and market analytics</p>
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
                    <Button>
                        <Plus className="w-4 h-4 mr-2"/>
                        Add Price Record
                    </Button>
                </div>
            </div>

            {/* Price Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Total Records</CardTitle>
                        <BarChart3 className="h-4 w-4 text-blue-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{priceHistory.length}</div>
                        <p className="text-xs text-gray-600">Price records</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Avg Wholesale Price</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${(priceHistory.reduce((sum, p) => sum + p.wholesale_price, 0) / priceHistory.length).toFixed(2)}
                        </div>
                        <p className="text-xs text-gray-600">Per unit</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Avg Retail Price</CardTitle>
                        <DollarSign className="h-4 w-4 text-purple-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${(priceHistory.reduce((sum, p) => sum + p.retail_price, 0) / priceHistory.length).toFixed(2)}
                        </div>
                        <p className="text-xs text-gray-600">Per unit</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Avg Margin</CardTitle>
                        <TrendingUp className="h-4 w-4 text-orange-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {(priceHistory.reduce((sum, p) => sum + ((p.retail_price - p.wholesale_price) / p.wholesale_price), 0) / priceHistory.length * 100).toFixed(1)}%
                        </div>
                        <p className="text-xs text-gray-600">Retail markup</p>
                    </CardContent>
                </Card>
            </div>

            {/* Price Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
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
                                    <XAxis dataKey="month"/>
                                    <YAxis/>
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
                        <CardTitle>Price Distribution by Location</CardTitle>
                        <CardDescription>Wholesale vs Retail prices across regions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer
                            config={{
                                wholesale_price: {label: "Wholesale", color: "#82ca9d"},
                                retail_price: {label: "Retail", color: "#8884d8"}
                            }}
                            className="h-[300px]"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={priceHistory}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="location" angle={-45} textAnchor="end" height={80}/>
                                    <YAxis/>
                                    <ChartTooltip content={<ChartTooltipContent/>}/>
                                    <Legend/>
                                    <Bar dataKey="wholesale_price" fill="#82ca9d"/>
                                    <Bar dataKey="retail_price" fill="#8884d8"/>
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Price Analysis Insights */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Market Price Insights</CardTitle>
                    <CardDescription>Key market indicators and price analysis</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <h4 className="font-semibold text-green-800 mb-2">Highest Margin Products</h4>
                            <p className="text-sm text-green-700">
                                {priceHistory
                                    .sort((a, b) => ((b.retail_price - b.wholesale_price) / b.wholesale_price) - ((a.retail_price - a.wholesale_price) / a.wholesale_price))
                                    .slice(0, 2)
                                    .map(p => p.product_name)
                                    .join(', ')} showing highest retail margins
                            </p>
                        </div>

                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h4 className="font-semibold text-blue-800 mb-2">Price Stability</h4>
                            <p className="text-sm text-blue-700">
                                {priceHistory.filter(p => Math.abs(p.retail_price - p.harvest_season_price) / p.harvest_season_price < 0.1).length} out
                                of {priceHistory.length} products
                                showing stable pricing
                            </p>
                        </div>

                        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                            <h4 className="font-semibold text-orange-800 mb-2">Seasonal Impact</h4>
                            <p className="text-sm text-orange-700">
                                Average seasonal price
                                variation: {(priceHistory.reduce((sum, p) => sum + Math.abs((p.retail_price - p.harvest_season_price) / p.harvest_season_price), 0) / priceHistory.length * 100).toFixed(1)}%
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Detailed Price History Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Price History Records</CardTitle>
                    <CardDescription>Historical pricing data by location and season</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Price ID</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Location</TableHead>
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
                                    <TableCell>{record.location}</TableCell>
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
        </div>
    )
}