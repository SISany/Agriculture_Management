"use client"

import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Badge} from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Search, Plus, Edit2, Trash2, Users, FileDown} from "lucide-react"
import {exportTableToPDF} from "@/lib/pdfExport"

interface Stakeholder {
    stakeholder_id: string
    stakeholder_name: string
    location: string
    contact_info: string
    stakeholder_type: "Farmer" | "Retailer" | "Wholesaler" | "Consumer"
    // Farmer specific fields
    farm_size?: string
    registration_date?: string
    farming_type?: string
    annual_production_capacity?: number
    // Retailer specific fields
    shop_type?: string
    customer_base?: string
    monthly_sales_volume?: number
    market_coverage?: string
    // Wholesaler specific fields
    business_license?: string
    storage_capacity?: string
    distribution_network_size?: number
    supply_chain_reach?: string
    // Consumer specific fields
    per_capita_income?: number
    demographic_group?: string
    household_size?: number
    contact_status?: string
}

const stakeholders: Stakeholder[] = [
    {
        stakeholder_id: "S001",
        stakeholder_name: "Ahmed Farms",
        location: "Dhaka",
        contact_info: "ahmed@farms.com",
        stakeholder_type: "Farmer",
        farm_size: "50 acres",
        registration_date: "2023-01-15",
        farming_type: "Organic",
        annual_production_capacity: 500,
        contact_status: "Active"
    },
    {
        stakeholder_id: "S002",
        stakeholder_name: "City Retail Store",
        location: "Chittagong",
        contact_info: "info@citystore.com",
        stakeholder_type: "Retailer",
        shop_type: "Grocery Store",
        customer_base: "5000+",
        monthly_sales_volume: 200,
        market_coverage: "Urban",
        contact_status: "Active"
    },
    {
        stakeholder_id: "S003",
        stakeholder_name: "Grain Wholesale Co",
        location: "Dhaka",
        contact_info: "contact@grainwholesale.com",
        stakeholder_type: "Wholesaler",
        business_license: "WH-2023-001",
        storage_capacity: "10000 tons",
        distribution_network_size: 50,
        supply_chain_reach: "National",
        contact_status: "Active"
    },
    {
        stakeholder_id: "S004",
        stakeholder_name: "Rahman Family",
        location: "Sylhet",
        contact_info: "rahman@email.com",
        stakeholder_type: "Consumer",
        per_capita_income: 25000,
        demographic_group: "Middle Class",
        household_size: 5,
        contact_status: "Active"
    },
    {
        stakeholder_id: "S005",
        stakeholder_name: "Green Valley Farm",
        location: "Rajshahi",
        contact_info: "info@greenvalley.com",
        stakeholder_type: "Farmer",
        farm_size: "120 acres",
        registration_date: "2022-08-20",
        farming_type: "Conventional",
        annual_production_capacity: 1200,
        contact_status: "Active"
    }
]

export default function StakeholderManagement() {
    const [searchTerm, setSearchTerm] = useState("")
    const [filterType, setFilterType] = useState<string>("All")

    const filteredStakeholders = stakeholders.filter(stakeholder => {
        const matchesSearch = stakeholder.stakeholder_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            stakeholder.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            stakeholder.contact_info.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesFilter = filterType === "All" || stakeholder.stakeholder_type === filterType

        return matchesSearch && matchesFilter
    })

    const getStakeholderTypeColor = (type: string) => {
        switch (type) {
            case "Farmer":
                return "bg-green-100 text-green-800"
            case "Retailer":
                return "bg-blue-100 text-blue-800"
            case "Wholesaler":
                return "bg-purple-100 text-purple-800"
            case "Consumer":
                return "bg-orange-100 text-orange-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const getAdditionalInfo = (stakeholder: Stakeholder) => {
        switch (stakeholder.stakeholder_type) {
            case "Farmer":
                return stakeholder.farm_size || "N/A"
            case "Retailer":
                return stakeholder.shop_type || "N/A"
            case "Wholesaler":
                return stakeholder.storage_capacity || "N/A"
            case "Consumer":
                return stakeholder.demographic_group || "N/A"
            default:
                return "N/A"
        }
    }


    const handleExport = () => {
        exportTableToPDF({
            title: 'Stakeholder Management Report',
            subtitle: 'Agriculture Management System - Stakeholder Directory',
            filename: 'stakeholder-management-report.pdf',
            columns: [
                {header: 'Stakeholder ID', dataKey: 'stakeholder_id', width: 25},
                {header: 'Name', dataKey: 'stakeholder_name', width: 30},
                {header: 'Type', dataKey: 'stakeholder_type', width: 20},
                {header: 'Contact', dataKey: 'contact_info', width: 30},
                {header: 'Location', dataKey: 'location', width: 25},
                {header: 'Registration Date', dataKey: 'registration_date', width: 25}
            ],
            data: filteredStakeholders.map(stakeholder => ({
                stakeholder_id: stakeholder.stakeholder_id,
                stakeholder_name: stakeholder.stakeholder_name,
                stakeholder_type: stakeholder.stakeholder_type,
                contact_info: stakeholder.contact_info,
                location: stakeholder.location,
                registration_date: stakeholder.registration_date
            }))
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Stakeholder Management</h1>
                    <p className="mt-2 text-muted-foreground">Manage farmers, retailers, wholesalers, and consumers</p>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                        <Input
                            type="search"
                            placeholder="Search stakeholders..."
                            className="pl-10 w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                Filter by Type: {filterType}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setFilterType("All")}>All</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterType("Farmer")}>Farmers</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterType("Retailer")}>Retailers</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterType("Wholesaler")}>Wholesalers</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterType("Consumer")}>Consumers</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button>
                        <Plus className="w-4 h-4 mr-2"/>
                        Add Stakeholder
                    </Button>
                    <Button onClick={handleExport}>
                        <FileDown className="w-4 h-4 mr-2"/>
                        Export Data
                    </Button>
                </div>
            </div>

            {/* Stakeholder Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Farmers</CardTitle>
                        <Users className="h-4 w-4 text-green-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stakeholders.filter(s => s.stakeholder_type === "Farmer").length}
                        </div>
                        <p className="text-xs text-muted-foreground">Registered farmers</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Retailers</CardTitle>
                        <Users className="h-4 w-4 text-blue-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stakeholders.filter(s => s.stakeholder_type === "Retailer").length}
                        </div>
                        <p className="text-xs text-muted-foreground">Retail partners</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Wholesalers</CardTitle>
                        <Users className="h-4 w-4 text-purple-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stakeholders.filter(s => s.stakeholder_type === "Wholesaler").length}
                        </div>
                        <p className="text-xs text-muted-foreground">Wholesale partners</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Consumers</CardTitle>
                        <Users className="h-4 w-4 text-orange-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stakeholders.filter(s => s.stakeholder_type === "Consumer").length}
                        </div>
                        <p className="text-xs text-muted-foreground">Consumer base</p>
                    </CardContent>
                </Card>
            </div>

            {/* Stakeholder Distribution */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Stakeholder Distribution by Type</CardTitle>
                        <CardDescription>Breakdown of stakeholder categories</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {["Farmer", "Retailer", "Wholesaler", "Consumer"].map((type) => {
                                const count = stakeholders.filter(s => s.stakeholder_type === type).length
                                const percentage = (count / stakeholders.length) * 100
                                return (
                                    <div key={type} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-4 h-4 rounded ${
                                                type === "Farmer" ? "bg-green-500" :
                                                    type === "Retailer" ? "bg-blue-500" :
                                                        type === "Wholesaler" ? "bg-purple-500" : "bg-orange-500"
                                            }`}></div>
                                            <span className="text-sm font-medium">{type}s</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-muted-foreground">{count} stakeholders</span>
                                            <Badge variant="outline">{percentage.toFixed(0)}%</Badge>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Geographic Distribution</CardTitle>
                        <CardDescription>Stakeholders by location</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {Array.from(new Set(stakeholders.map(s => s.location))).map((location) => {
                                const count = stakeholders.filter(s => s.location === location).length
                                const percentage = (count / stakeholders.length) * 100
                                return (
                                    <div key={location} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-4 h-4 bg-indigo-500 rounded"></div>
                                            <span className="text-sm font-medium">{location}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-muted-foreground">{count} stakeholders</span>
                                            <Badge variant="outline">{percentage.toFixed(0)}%</Badge>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Stakeholder Details Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Stakeholders</CardTitle>
                    <CardDescription>Complete stakeholder directory</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Stakeholder ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Additional Info</TableHead>
                                <TableHead>Registration/Date</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStakeholders.map((stakeholder) => (
                                <TableRow key={stakeholder.stakeholder_id}>
                                    <TableCell className="font-medium">{stakeholder.stakeholder_id}</TableCell>
                                    <TableCell>{stakeholder.stakeholder_name}</TableCell>
                                    <TableCell>
                                        <Badge className={getStakeholderTypeColor(stakeholder.stakeholder_type)}>
                                            {stakeholder.stakeholder_type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{stakeholder.location}</TableCell>
                                    <TableCell>{stakeholder.contact_info}</TableCell>
                                    <TableCell>{getAdditionalInfo(stakeholder)}</TableCell>
                                    <TableCell>
                                        {stakeholder.registration_date ||
                                            (stakeholder.stakeholder_type === "Consumer" ? "Consumer" : "N/A")}
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

            {/* Stakeholder Insights */}
            <Card>
                <CardHeader>
                    <CardTitle>Stakeholder Insights</CardTitle>
                    <CardDescription>Key metrics and business intelligence</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <h4 className="font-semibold text-green-800 mb-2">Farmer Capacity</h4>
                            <p className="text-sm text-green-700">
                                Total farming capacity: {stakeholders
                                .filter(s => s.stakeholder_type === "Farmer")
                                .reduce((sum, s) => sum + (s.annual_production_capacity || 0), 0)
                                .toLocaleString()} tons annually
                            </p>
                        </div>

                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h4 className="font-semibold text-blue-800 mb-2">Retail Network</h4>
                            <p className="text-sm text-blue-700">
                                Average monthly sales: {(stakeholders
                                    .filter(s => s.stakeholder_type === "Retailer")
                                    .reduce((sum, s) => sum + (s.monthly_sales_volume || 0), 0) /
                                stakeholders.filter(s => s.stakeholder_type === "Retailer").length || 1
                            ).toFixed(0)} tons per retailer
                            </p>
                        </div>

                        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                            <h4 className="font-semibold text-purple-800 mb-2">Distribution Network</h4>
                            <p className="text-sm text-purple-700">
                                Total distribution reach: {stakeholders
                                .filter(s => s.stakeholder_type === "Wholesaler")
                                .reduce((sum, s) => sum + (s.distribution_network_size || 0), 0)
                            } distribution points
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}