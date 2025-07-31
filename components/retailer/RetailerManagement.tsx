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
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    Legend
} from "recharts"
import {Search, Download, Plus, Edit2, Trash2, Store, Users, MapPin, DollarSign} from "lucide-react"

// TypeScript interfaces
interface Retailer {
    stakeholder_id: string
    stakeholder_name: string
    location: string
    contact_info: string
    shop_type: string
    customer_base: string
    monthly_sales_volume: number
    market_coverage: string
    registration_date: string
    business_license: string
    operating_hours: string
    payment_methods: string[]
    product_categories: string[]
    store_size: number
    staff_count: number
}

// Mock data
const retailers: Retailer[] = [
    {
        stakeholder_id: "R001",
        stakeholder_name: "City Retail Store",
        location: "Dhaka",
        contact_info: "info@citystore.com",
        shop_type: "Grocery Store",
        customer_base: "5000+",
        monthly_sales_volume: 200,
        market_coverage: "Urban",
        registration_date: "2023-01-20",
        business_license: "RS-2023-001",
        operating_hours: "8:00 AM - 10:00 PM",
        payment_methods: ["Cash", "Card", "Mobile Banking"],
        product_categories: ["Grains", "Vegetables", "Dairy"],
        store_size: 500,
        staff_count: 8
    },
    {
        stakeholder_id: "R002",
        stakeholder_name: "Fresh Mart",
        location: "Chittagong",
        contact_info: "freshmart@email.com",
        shop_type: "Supermarket",
        customer_base: "8000+",
        monthly_sales_volume: 350,
        market_coverage: "Urban",
        registration_date: "2022-11-15",
        business_license: "RS-2022-045",
        operating_hours: "7:00 AM - 11:00 PM",
        payment_methods: ["Cash", "Card", "Mobile Banking", "Digital Wallet"],
        product_categories: ["Grains", "Vegetables", "Fruits", "Dairy", "Meat"],
        store_size: 1200,
        staff_count: 15
    },
    {
        stakeholder_id: "R003",
        stakeholder_name: "Village Store",
        location: "Sylhet",
        contact_info: "village.store@gmail.com",
        shop_type: "General Store",
        customer_base: "2000+",
        monthly_sales_volume: 120,
        market_coverage: "Rural",
        registration_date: "2023-04-10",
        business_license: "RS-2023-089",
        operating_hours: "6:00 AM - 9:00 PM",
        payment_methods: ["Cash", "Mobile Banking"],
        product_categories: ["Grains", "Basic Goods"],
        store_size: 200,
        staff_count: 3
    },
    {
        stakeholder_id: "R004",
        stakeholder_name: "Metro Food Plaza",
        location: "Rajshahi",
        contact_info: "metro@foodplaza.com",
        shop_type: "Hypermarket",
        customer_base: "12000+",
        monthly_sales_volume: 580,
        market_coverage: "Regional",
        registration_date: "2022-08-25",
        business_license: "RS-2022-023",
        operating_hours: "24/7",
        payment_methods: ["Cash", "Card", "Mobile Banking", "Digital Wallet", "Crypto"],
        product_categories: ["Grains", "Vegetables", "Fruits", "Dairy", "Meat", "Electronics"],
        store_size: 2500,
        staff_count: 35
    },
    {
        stakeholder_id: "R005",
        stakeholder_name: "Organic Market",
        location: "Khulna",
        contact_info: "organic@market.com",
        shop_type: "Specialty Store",
        customer_base: "3500+",
        monthly_sales_volume: 180,
        market_coverage: "Urban",
        registration_date: "2023-02-14",
        business_license: "RS-2023-067",
        operating_hours: "9:00 AM - 8:00 PM",
        payment_methods: ["Cash", "Card", "Mobile Banking"],
        product_categories: ["Organic Grains", "Organic Vegetables", "Health Foods"],
        store_size: 300,
        staff_count: 6
    }
]

// Chart data
const shopTypeDistribution = [
    {name: "Grocery Store", value: 20, color: "#8884d8"},
    {name: "Supermarket", value: 20, color: "#82ca9d"},
    {name: "General Store", value: 20, color: "#ffc658"},
    {name: "Hypermarket", value: 20, color: "#ff7300"},
    {name: "Specialty Store", value: 20, color: "#00ff88"}
]

const salesVolumeData = [
    {month: "Jan", urban: 280, rural: 95, regional: 520},
    {month: "Feb", urban: 295, rural: 100, regional: 545},
    {month: "Mar", urban: 310, rural: 105, regional: 570},
    {month: "Apr", urban: 325, rural: 110, regional: 580},
    {month: "May", urban: 340, rural: 115, regional: 600},
    {month: "Jun", urban: 355, rural: 120, regional: 620}
]

const marketCoverageData = [
    {coverage: "Urban", retailers: 3, volume: 730},
    {coverage: "Rural", retailers: 1, volume: 120},
    {coverage: "Regional", retailers: 1, volume: 580}
]

const customerBaseAnalysis = [
    {range: "0-2000", count: 1},
    {range: "2000-5000", count: 1},
    {range: "5000-10000", count: 1},
    {range: "10000+", count: 2}
]

export default function RetailerManagement() {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedLocation, setSelectedLocation] = useState("all")
    const [selectedShopType, setSelectedShopType] = useState("all")
    const [selectedMarketCoverage, setSelectedMarketCoverage] = useState("all")

    const filteredData = retailers.filter(retailer => {
        const matchesSearch = retailer.stakeholder_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            retailer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            retailer.contact_info.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesLocation = selectedLocation === "all" || retailer.location === selectedLocation
        const matchesShopType = selectedShopType === "all" || retailer.shop_type === selectedShopType
        const matchesMarketCoverage = selectedMarketCoverage === "all" || retailer.market_coverage === selectedMarketCoverage

        return matchesSearch && matchesLocation && matchesShopType && matchesMarketCoverage
    })

    const totalRetailers = filteredData.length
    const totalSalesVolume = filteredData.reduce((sum, retailer) => sum + retailer.monthly_sales_volume, 0)
    const totalCustomerBase = filteredData.reduce((sum, retailer) => {
        const base = retailer.customer_base.replace(/[^0-9]/g, '')
        return sum + parseInt(base) || 0
    }, 0)
    const avgStoreSize = filteredData.reduce((sum, retailer) => sum + retailer.store_size, 0) / filteredData.length || 0

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Retailer Management System</h1>
                    <p className="text-sm text-gray-600">Manage retail partners, sales performance, and market
                        coverage</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2"/>
                        Export Data
                    </Button>
                    <Button size="sm">
                        <Plus className="w-4 h-4 mr-2"/>
                        Add Retailer
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Retailers</CardTitle>
                        <Store className="h-4 w-4 text-blue-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalRetailers}</div>
                        <p className="text-xs text-green-600 mt-1">Active partners</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Sales</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalSalesVolume.toLocaleString()}</div>
                        <p className="text-xs text-blue-600 mt-1">Units sold</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Customer Reach</CardTitle>
                        <Users className="h-4 w-4 text-purple-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalCustomerBase.toLocaleString()}+</div>
                        <p className="text-xs text-purple-600 mt-1">Total customers</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Store Size</CardTitle>
                        <MapPin className="h-4 w-4 text-orange-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{avgStoreSize.toFixed(0)} sq ft</div>
                        <p className="text-xs text-orange-600 mt-1">Average footprint</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Shop Type Distribution</CardTitle>
                        <CardDescription>Breakdown of retailer categories</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={shopTypeDistribution}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {shopTypeDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color}/>
                                        ))}
                                    </Pie>
                                    <ChartTooltip content={<ChartTooltipContent/>}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Sales Volume Trends</CardTitle>
                        <CardDescription>Monthly sales by market coverage</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={salesVolumeData}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="month"/>
                                    <YAxis/>
                                    <ChartTooltip content={<ChartTooltipContent/>}/>
                                    <Legend/>
                                    <Line type="monotone" dataKey="urban" stroke="#8884d8" strokeWidth={2}/>
                                    <Line type="monotone" dataKey="rural" stroke="#82ca9d" strokeWidth={2}/>
                                    <Line type="monotone" dataKey="regional" stroke="#ffc658" strokeWidth={2}/>
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Market Coverage Analysis</CardTitle>
                        <CardDescription>Retailers and volume by coverage area</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={marketCoverageData}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="coverage"/>
                                    <YAxis/>
                                    <ChartTooltip content={<ChartTooltipContent/>}/>
                                    <Legend/>
                                    <Bar dataKey="retailers" fill="#8884d8" name="Number of Retailers"/>
                                    <Bar dataKey="volume" fill="#82ca9d" name="Sales Volume"/>
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Customer Base Distribution</CardTitle>
                        <CardDescription>Retailer count by customer base size</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={customerBaseAnalysis}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="range"/>
                                    <YAxis/>
                                    <ChartTooltip content={<ChartTooltipContent/>}/>
                                    <Bar dataKey="count" fill="#ffc658"/>
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Retailer Directory</CardTitle>
                    <CardDescription>Search and manage retail partners</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                            <Input
                                placeholder="Search retailers by name, location, contact..."
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
                        <Select value={selectedShopType} onValueChange={setSelectedShopType}>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Shop Type"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="Grocery Store">Grocery Store</SelectItem>
                                <SelectItem value="Supermarket">Supermarket</SelectItem>
                                <SelectItem value="General Store">General Store</SelectItem>
                                <SelectItem value="Hypermarket">Hypermarket</SelectItem>
                                <SelectItem value="Specialty Store">Specialty Store</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={selectedMarketCoverage} onValueChange={setSelectedMarketCoverage}>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Market Coverage"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Coverage</SelectItem>
                                <SelectItem value="Urban">Urban</SelectItem>
                                <SelectItem value="Rural">Rural</SelectItem>
                                <SelectItem value="Regional">Regional</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Retailer Name</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Shop Type</TableHead>
                                    <TableHead>Customer Base</TableHead>
                                    <TableHead>Monthly Sales</TableHead>
                                    <TableHead>Market Coverage</TableHead>
                                    <TableHead>Store Size</TableHead>
                                    <TableHead>Staff Count</TableHead>
                                    <TableHead>Operating Hours</TableHead>
                                    <TableHead>Registration Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.map((retailer) => (
                                    <TableRow key={retailer.stakeholder_id}>
                                        <TableCell className="font-medium">{retailer.stakeholder_name}</TableCell>
                                        <TableCell>{retailer.location}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{retailer.shop_type}</Badge>
                                        </TableCell>
                                        <TableCell>{retailer.customer_base}</TableCell>
                                        <TableCell>{retailer.monthly_sales_volume.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={retailer.market_coverage === "Regional" ? "default" :
                                                    retailer.market_coverage === "Urban" ? "secondary" : "outline"}
                                            >
                                                {retailer.market_coverage}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{retailer.store_size.toLocaleString()} sq ft</TableCell>
                                        <TableCell>{retailer.staff_count}</TableCell>
                                        <TableCell className="text-xs">{retailer.operating_hours}</TableCell>
                                        <TableCell>{new Date(retailer.registration_date).toLocaleDateString()}</TableCell>
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
        </div>
    )
}