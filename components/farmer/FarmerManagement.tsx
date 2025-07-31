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
    Line
} from "recharts"
import {Search, Download, Plus, Edit2, Trash2, Users, MapPin, TrendingUp, Factory} from "lucide-react"

// TypeScript interfaces
interface Farmer {
    stakeholder_id: string
    stakeholder_name: string
    location: string
    contact_info: string
    farm_size: number
    registration_date: string
    farming_type: string
    annual_production_capacity: number
    experience_years: number
    crops_grown: string[]
    certification: string
    land_ownership: string
    irrigation_type: string
    equipment_owned: string[]
}

// Mock data 
const farmers: Farmer[] = [
    {
        stakeholder_id: "F001",
        stakeholder_name: "Ahmed Hassan",
        location: "Dhaka",
        contact_info: "ahmed.hassan@email.com",
        farm_size: 50,
        registration_date: "2023-01-15",
        farming_type: "Organic",
        annual_production_capacity: 500,
        experience_years: 15,
        crops_grown: ["Wheat", "Rice"],
        certification: "Organic Certified",
        land_ownership: "Owned",
        irrigation_type: "Drip Irrigation",
        equipment_owned: ["Tractor", "Harvester"]
    },
    {
        stakeholder_id: "F002",
        stakeholder_name: "Fatima Rahman",
        location: "Chittagong",
        contact_info: "f.rahman@email.com",
        farm_size: 35,
        registration_date: "2023-03-22",
        farming_type: "Conventional",
        annual_production_capacity: 320,
        experience_years: 8,
        crops_grown: ["Rice", "Corn"],
        certification: "GAP Certified",
        land_ownership: "Leased",
        irrigation_type: "Flood Irrigation",
        equipment_owned: ["Tractor"]
    },
    {
        stakeholder_id: "F003",
        stakeholder_name: "Mohammad Ali",
        location: "Sylhet",
        contact_info: "m.ali@farmers.org",
        farm_size: 80,
        registration_date: "2022-11-10",
        farming_type: "Sustainable",
        annual_production_capacity: 750,
        experience_years: 22,
        crops_grown: ["Wheat", "Rice", "Vegetables"],
        certification: "Sustainable Agriculture",
        land_ownership: "Owned",
        irrigation_type: "Sprinkler System",
        equipment_owned: ["Tractor", "Harvester", "Planter"]
    },
    {
        stakeholder_id: "F004",
        stakeholder_name: "Rashida Begum",
        location: "Rajshahi",
        contact_info: "rashida@gmail.com",
        farm_size: 25,
        registration_date: "2023-06-05",
        farming_type: "Traditional",
        annual_production_capacity: 200,
        experience_years: 12,
        crops_grown: ["Wheat", "Lentils"],
        certification: "None",
        land_ownership: "Owned",
        irrigation_type: "Manual Irrigation",
        equipment_owned: ["Hand Tools"]
    },
    {
        stakeholder_id: "F005",
        stakeholder_name: "Karim Sheikh",
        location: "Khulna",
        contact_info: "k.sheikh@email.com",
        farm_size: 60,
        registration_date: "2023-02-18",
        farming_type: "Integrated",
        annual_production_capacity: 580,
        experience_years: 18,
        crops_grown: ["Rice", "Fish Farming"],
        certification: "Integrated Farming",
        land_ownership: "Owned",
        irrigation_type: "Pond System",
        equipment_owned: ["Tractor", "Pump"]
    }
]

// Chart data
const farmSizeDistribution = [
    {size: "Small (0-25 acres)", count: 1, percentage: 20},
    {size: "Medium (25-50 acres)", count: 2, percentage: 40},
    {size: "Large (50+ acres)", count: 2, percentage: 40}
]

const farmingTypeData = [
    {name: "Organic", value: 20, color: "#8884d8"},
    {name: "Conventional", value: 20, color: "#82ca9d"},
    {name: "Sustainable", value: 20, color: "#ffc658"},
    {name: "Traditional", value: 20, color: "#ff7300"},
    {name: "Integrated", value: 20, color: "#00ff88"}
]

const productionTrends = [
    {year: "2020", production: 1800},
    {year: "2021", production: 2100},
    {year: "2022", production: 2350},
    {year: "2023", production: 2550},
    {year: "2024", production: 2750}
]

const cropDistribution = [
    {crop: "Wheat", farmers: 3},
    {crop: "Rice", farmers: 4},
    {crop: "Corn", farmers: 1},
    {crop: "Vegetables", farmers: 1},
    {crop: "Lentils", farmers: 1}
]

export default function FarmerManagement() {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedLocation, setSelectedLocation] = useState("all")
    const [selectedFarmingType, setSelectedFarmingType] = useState("all")
    const [selectedCertification, setSelectedCertification] = useState("all")

    const filteredData = farmers.filter(farmer => {
        const matchesSearch = farmer.stakeholder_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            farmer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            farmer.contact_info.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesLocation = selectedLocation === "all" || farmer.location === selectedLocation
        const matchesFarmingType = selectedFarmingType === "all" || farmer.farming_type === selectedFarmingType
        const matchesCertification = selectedCertification === "all" || farmer.certification.includes(selectedCertification)

        return matchesSearch && matchesLocation && matchesFarmingType && matchesCertification
    })

    const totalFarmers = filteredData.length
    const totalFarmSize = filteredData.reduce((sum, farmer) => sum + farmer.farm_size, 0)
    const totalProduction = filteredData.reduce((sum, farmer) => sum + farmer.annual_production_capacity, 0)
    const avgExperience = filteredData.reduce((sum, farmer) => sum + farmer.experience_years, 0) / filteredData.length || 0

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Farmer Management System</h1>
                    <p className="text-sm text-gray-600">Manage farmer profiles, farm operations, and agricultural
                        analytics</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2"/>
                        Export Data
                    </Button>
                    <Button size="sm">
                        <Plus className="w-4 h-4 mr-2"/>
                        Register Farmer
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Farmers</CardTitle>
                        <Users className="h-4 w-4 text-blue-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalFarmers}</div>
                        <p className="text-xs text-green-600 mt-1">Registered farmers</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Farm Area</CardTitle>
                        <MapPin className="h-4 w-4 text-green-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalFarmSize} acres</div>
                        <p className="text-xs text-blue-600 mt-1">Under cultivation</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Production</CardTitle>
                        <Factory className="h-4 w-4 text-purple-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalProduction} tons</div>
                        <p className="text-xs text-purple-600 mt-1">Annual capacity</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Experience</CardTitle>
                        <TrendingUp className="h-4 w-4 text-orange-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{avgExperience.toFixed(1)} years</div>
                        <p className="text-xs text-orange-600 mt-1">Farming experience</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Farm Size Distribution</CardTitle>
                        <CardDescription>Distribution of farms by size category</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={farmSizeDistribution}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="size"/>
                                    <YAxis/>
                                    <ChartTooltip content={<ChartTooltipContent/>}/>
                                    <Bar dataKey="count" fill="#8884d8"/>
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Farming Type Distribution</CardTitle>
                        <CardDescription>Breakdown by farming methodology</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={farmingTypeData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {farmingTypeData.map((entry, index) => (
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

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Production Trends</CardTitle>
                        <CardDescription>Total production capacity over years</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={productionTrends}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="year"/>
                                    <YAxis/>
                                    <ChartTooltip content={<ChartTooltipContent/>}/>
                                    <Line type="monotone" dataKey="production" stroke="#8884d8" strokeWidth={2}/>
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Crop Distribution</CardTitle>
                        <CardDescription>Number of farmers growing each crop</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={cropDistribution}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="crop"/>
                                    <YAxis/>
                                    <ChartTooltip content={<ChartTooltipContent/>}/>
                                    <Bar dataKey="farmers" fill="#82ca9d"/>
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Farmer Directory</CardTitle>
                    <CardDescription>Search and filter registered farmers</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                            <Input
                                placeholder="Search farmers by name, location, contact..."
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
                        <Select value={selectedFarmingType} onValueChange={setSelectedFarmingType}>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Farming Type"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="Organic">Organic</SelectItem>
                                <SelectItem value="Conventional">Conventional</SelectItem>
                                <SelectItem value="Sustainable">Sustainable</SelectItem>
                                <SelectItem value="Traditional">Traditional</SelectItem>
                                <SelectItem value="Integrated">Integrated</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={selectedCertification} onValueChange={setSelectedCertification}>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Certification"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Certifications</SelectItem>
                                <SelectItem value="Organic">Organic Certified</SelectItem>
                                <SelectItem value="GAP">GAP Certified</SelectItem>
                                <SelectItem value="Sustainable">Sustainable Agriculture</SelectItem>
                                <SelectItem value="None">None</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Farmer Name</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Farm Size</TableHead>
                                    <TableHead>Farming Type</TableHead>
                                    <TableHead>Production Capacity</TableHead>
                                    <TableHead>Experience</TableHead>
                                    <TableHead>Crops Grown</TableHead>
                                    <TableHead>Certification</TableHead>
                                    <TableHead>Land Ownership</TableHead>
                                    <TableHead>Registration Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.map((farmer) => (
                                    <TableRow key={farmer.stakeholder_id}>
                                        <TableCell className="font-medium">{farmer.stakeholder_name}</TableCell>
                                        <TableCell>{farmer.location}</TableCell>
                                        <TableCell>{farmer.farm_size} acres</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{farmer.farming_type}</Badge>
                                        </TableCell>
                                        <TableCell>{farmer.annual_production_capacity} tons</TableCell>
                                        <TableCell>{farmer.experience_years} years</TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {farmer.crops_grown.slice(0, 2).map((crop, index) => (
                                                    <Badge key={index} variant="secondary" className="text-xs">
                                                        {crop}
                                                    </Badge>
                                                ))}
                                                {farmer.crops_grown.length > 2 && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        +{farmer.crops_grown.length - 2}
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={farmer.certification === "None" ? "destructive" : "default"}
                                                className="text-xs"
                                            >
                                                {farmer.certification}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={farmer.land_ownership === "Owned" ? "default" : "secondary"}>
                                                {farmer.land_ownership}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{new Date(farmer.registration_date).toLocaleDateString()}</TableCell>
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