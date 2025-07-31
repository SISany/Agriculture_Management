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
import {Search, Download, Plus, Edit2, Trash2, Building2, Users, Package, DollarSign} from "lucide-react"

// TypeScript interfaces
interface Wholesaler {
    stakeholder_id: string
    stakeholder_name: string
    location: string
    contact_info: string
    business_license: string
    storage_capacity: number
    distribution_network_size: number
    supply_chain_reach: string
    registration_date: string
    monthly_volume: number
    specialization: string[]
    certification_status: string
    credit_rating: string
    operational_years: number
}

// Mock data
const wholesalers: Wholesaler[] = [
    {
        stakeholder_id: "W001",
        stakeholder_name: "Grain Wholesale Co",
        location: "Dhaka",
        contact_info: "contact@grainwholesale.com",
        business_license: "WH-2023-001",
        storage_capacity: 10000,
        distribution_network_size: 50,
        supply_chain_reach: "National",
        registration_date: "2022-01-15",
        monthly_volume: 5000,
        specialization: ["Wheat", "Rice", "Grains"],
        certification_status: "ISO Certified",
        credit_rating: "A+",
        operational_years: 15
    },
    {
        stakeholder_id: "W002",
        stakeholder_name: "Bangladesh Agro Distribution",
        location: "Chittagong",
        contact_info: "info@banglaagro.com",
        business_license: "WH-2022-089",
        storage_capacity: 15000,
        distribution_network_size: 75,
        supply_chain_reach: "International",
        registration_date: "2021-08-20",
        monthly_volume: 7500,
        specialization: ["Rice", "Corn", "Pulses"],
        certification_status: "HACCP Certified",
        credit_rating: "AA",
        operational_years: 18
    },
    {
        stakeholder_id: "W003",
        stakeholder_name: "Eastern Foods Distribution",
        location: "Sylhet",
        contact_info: "eastern@foods.com",
        business_license: "WH-2023-045",
        storage_capacity: 8000,
        distribution_network_size: 35,
        supply_chain_reach: "Regional",
        registration_date: "2023-03-10",
        monthly_volume: 3500,
        specialization: ["Tea", "Spices", "Grains"],
        certification_status: "Organic Certified",
        credit_rating: "A",
        operational_years: 8
    },
    {
        stakeholder_id: "W004",
        stakeholder_name: "Northern Agri Wholesale",
        location: "Rajshahi",
        contact_info: "northern@agri.com",
        business_license: "WH-2022-156",
        storage_capacity: 12000,
        distribution_network_size: 60,
        supply_chain_reach: "National",
        registration_date: "2022-06-15",
        monthly_volume: 6000,
        specialization: ["Wheat", "Barley", "Oats"],
        certification_status: "ISO Certified",
        credit_rating: "A+",
        operational_years: 12
    },
    {
        stakeholder_id: "W005",
        stakeholder_name: "Coastal Distribution Hub",
        location: "Khulna",
        contact_info: "coastal@hub.com",
        business_license: "WH-2023-078",
        storage_capacity: 6000,
        distribution_network_size: 28,
        supply_chain_reach: "Regional",
        registration_date: "2023-01-25",
        monthly_volume: 2800,
        specialization: ["Fish", "Rice", "Salt"],
        certification_status: "FDA Approved",
        credit_rating: "B+",
        operational_years: 5
    }
]

// Chart data
const supplyChainReachData = [
    {name: "International", value: 20, color: "#8884d8"},
    {name: "National", value: 40, color: "#82ca9d"},
    {name: "Regional", value: 40, color: "#ffc658"}
]

const volumeByLocation = [
    {location: "Dhaka", volume: 5000, capacity: 10000},
    {location: "Chittagong", volume: 7500, capacity: 15000},
    {location: "Sylhet", volume: 3500, capacity: 8000},
    {location: "Rajshahi", volume: 6000, capacity: 12000},
    {location: "Khulna", volume: 2800, capacity: 6000}
]

const networkSizeTrends = [
    {year: "2020", small: 15, medium: 20, large: 8},
    {year: "2021", small: 18, medium: 25, large: 12},
    {year: "2022", small: 22, medium: 30, large: 15},
    {year: "2023", small: 25, medium: 35, large: 18},
    {year: "2024", small: 28, medium: 40, large: 22}
]

const creditRatingDistribution = [
    {rating: "AA", count: 1},
    {rating: "A+", count: 2},
    {rating: "A", count: 1},
    {rating: "B+", count: 1}
]

export default function WholesalerManagement() {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedLocation, setSelectedLocation] = useState("all")
    const [selectedReach, setSelectedReach] = useState("all")
    const [selectedCertification, setSelectedCertification] = useState("all")

    const filteredData = wholesalers.filter(wholesaler => {
        const matchesSearch = wholesaler.stakeholder_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            wholesaler.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            wholesaler.contact_info.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesLocation = selectedLocation === "all" || wholesaler.location === selectedLocation
        const matchesReach = selectedReach === "all" || wholesaler.supply_chain_reach === selectedReach
        const matchesCertification = selectedCertification === "all" || wholesaler.certification_status.includes(selectedCertification)

        return matchesSearch && matchesLocation && matchesReach && matchesCertification
    })

    const totalWholesalers = filteredData.length
    const totalCapacity = filteredData.reduce((sum, wholesaler) => sum + wholesaler.storage_capacity, 0)
    const totalVolume = filteredData.reduce((sum, wholesaler) => sum + wholesaler.monthly_volume, 0)
    const totalNetworkSize = filteredData.reduce((sum, wholesaler) => sum + wholesaler.distribution_network_size, 0)

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Wholesaler Management System</h1>
                    <p className="text-sm text-gray-600">Manage wholesale partners, distribution networks, and supply
                        chain operations</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2"/>
                        Export Data
                    </Button>
                    <Button size="sm">
                        <Plus className="w-4 h-4 mr-2"/>
                        Add Wholesaler
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Wholesalers</CardTitle>
                        <Building2 className="h-4 w-4 text-blue-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalWholesalers}</div>
                        <p className="text-xs text-green-600 mt-1">Active partners</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Storage Capacity</CardTitle>
                        <Package className="h-4 w-4 text-green-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalCapacity.toLocaleString()}</div>
                        <p className="text-xs text-blue-600 mt-1">Tons capacity</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Volume</CardTitle>
                        <DollarSign className="h-4 w-4 text-purple-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalVolume.toLocaleString()}</div>
                        <p className="text-xs text-purple-600 mt-1">Tons processed</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Network Size</CardTitle>
                        <Users className="h-4 w-4 text-orange-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalNetworkSize}</div>
                        <p className="text-xs text-orange-600 mt-1">Distribution points</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Supply Chain Reach</CardTitle>
                        <CardDescription>Distribution by geographic coverage</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={supplyChainReachData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {supplyChainReachData.map((entry, index) => (
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
                        <CardTitle>Volume vs Capacity by Location</CardTitle>
                        <CardDescription>Utilization rates across regions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={volumeByLocation}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="location"/>
                                    <YAxis/>
                                    <ChartTooltip content={<ChartTooltipContent/>}/>
                                    <Legend/>
                                    <Bar dataKey="capacity" fill="#8884d8" name="Storage Capacity"/>
                                    <Bar dataKey="volume" fill="#82ca9d" name="Monthly Volume"/>
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Network Size Growth</CardTitle>
                        <CardDescription>Distribution network expansion over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={networkSizeTrends}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="year"/>
                                    <YAxis/>
                                    <ChartTooltip content={<ChartTooltipContent/>}/>
                                    <Legend/>
                                    <Line type="monotone" dataKey="small" stroke="#8884d8" strokeWidth={2}
                                          name="Small Networks"/>
                                    <Line type="monotone" dataKey="medium" stroke="#82ca9d" strokeWidth={2}
                                          name="Medium Networks"/>
                                    <Line type="monotone" dataKey="large" stroke="#ffc658" strokeWidth={2}
                                          name="Large Networks"/>
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Credit Rating Distribution</CardTitle>
                        <CardDescription>Financial reliability of wholesalers</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={creditRatingDistribution}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="rating"/>
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
                    <CardTitle>Wholesaler Directory</CardTitle>
                    <CardDescription>Search and manage wholesale partners</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                            <Input
                                placeholder="Search wholesalers by name, location, contact..."
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
                        <Select value={selectedReach} onValueChange={setSelectedReach}>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Supply Chain Reach"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Reach</SelectItem>
                                <SelectItem value="International">International</SelectItem>
                                <SelectItem value="National">National</SelectItem>
                                <SelectItem value="Regional">Regional</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={selectedCertification} onValueChange={setSelectedCertification}>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Certification"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Certifications</SelectItem>
                                <SelectItem value="ISO">ISO Certified</SelectItem>
                                <SelectItem value="HACCP">HACCP Certified</SelectItem>
                                <SelectItem value="Organic">Organic Certified</SelectItem>
                                <SelectItem value="FDA">FDA Approved</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Wholesaler Name</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>License</TableHead>
                                    <TableHead>Storage Capacity</TableHead>
                                    <TableHead>Monthly Volume</TableHead>
                                    <TableHead>Network Size</TableHead>
                                    <TableHead>Supply Chain Reach</TableHead>
                                    <TableHead>Certification</TableHead>
                                    <TableHead>Credit Rating</TableHead>
                                    <TableHead>Operational Years</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.map((wholesaler) => (
                                    <TableRow key={wholesaler.stakeholder_id}>
                                        <TableCell className="font-medium">{wholesaler.stakeholder_name}</TableCell>
                                        <TableCell>{wholesaler.location}</TableCell>
                                        <TableCell className="text-xs">{wholesaler.business_license}</TableCell>
                                        <TableCell>{wholesaler.storage_capacity.toLocaleString()} tons</TableCell>
                                        <TableCell>{wholesaler.monthly_volume.toLocaleString()} tons</TableCell>
                                        <TableCell>{wholesaler.distribution_network_size}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={wholesaler.supply_chain_reach === "International" ? "default" :
                                                    wholesaler.supply_chain_reach === "National" ? "secondary" : "outline"}
                                            >
                                                {wholesaler.supply_chain_reach}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-xs">
                                                {wholesaler.certification_status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={wholesaler.credit_rating.startsWith("A") ? "default" :
                                                    wholesaler.credit_rating.startsWith("B") ? "secondary" : "destructive"}
                                            >
                                                {wholesaler.credit_rating}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{wholesaler.operational_years} years</TableCell>
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