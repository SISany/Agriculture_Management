"use client"

import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Search, Plus, Edit2, Trash2, Warehouse, Building, Truck, TrendingUp, FileDown} from "lucide-react"
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts"
import {exportTableToPDF} from "@/lib/pdfExport"

// TypeScript interfaces
interface Wholesaler {
    id: string
    wholesaler_id: string
    wholesaler_name: string
    location: string
    contact_info: string
    business_license: string
    storage_capacity: string
    distribution_network_size: number
    supply_chain_reach: string
    registration_date: string
    annual_turnover: number
    warehouse_count: number
}

export default function WholesalerManagement() {
    const [wholesalers, setWholesalers] = useState<Wholesaler[]>([
        {
            id: "1",
            wholesaler_id: "W001",
            wholesaler_name: "Grain Wholesale Co",
            location: "Dhaka",
            contact_info: "contact@grainwholesale.com",
            business_license: "WH-2023-001",
            storage_capacity: "10000 tons",
            distribution_network_size: 50,
            supply_chain_reach: "National",
            registration_date: "2023-01-10",
            annual_turnover: 2500000,
            warehouse_count: 5
        },
        {
            id: "2",
            wholesaler_id: "W002",
            wholesaler_name: "Regional Food Distributors",
            location: "Chittagong",
            contact_info: "info@regionalfood.com",
            business_license: "WH-2023-002",
            storage_capacity: "7500 tons",
            distribution_network_size: 35,
            supply_chain_reach: "Regional",
            registration_date: "2023-02-15",
            annual_turnover: 1800000,
            warehouse_count: 3
        },
        {
            id: "3",
            wholesaler_id: "W003",
            wholesaler_name: "Fresh Supply Network",
            location: "Sylhet",
            contact_info: "hello@freshsupply.com",
            business_license: "WH-2023-003",
            storage_capacity: "5000 tons",
            distribution_network_size: 25,
            supply_chain_reach: "Regional",
            registration_date: "2023-04-20",
            annual_turnover: 1200000,
            warehouse_count: 2
        }
    ])

    const [searchTerm, setSearchTerm] = useState("")
    const [selectedLocation, setSelectedLocation] = useState("all")
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState<Omit<Wholesaler, "id">>({
        wholesaler_id: "",
        wholesaler_name: "",
        location: "",
        contact_info: "",
        business_license: "",
        storage_capacity: "",
        distribution_network_size: 0,
        supply_chain_reach: "",
        registration_date: "",
        annual_turnover: 0,
        warehouse_count: 0
    })

    const handleInputChange = (field: keyof Omit<Wholesaler, "id">, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const newWholesaler: Wholesaler = {
            ...formData,
            id: Date.now().toString()
        }
        setWholesalers([...wholesalers, newWholesaler])
        setFormData({
            wholesaler_id: "",
            wholesaler_name: "",
            location: "",
            contact_info: "",
            business_license: "",
            storage_capacity: "",
            distribution_network_size: 0,
            supply_chain_reach: "",
            registration_date: "",
            annual_turnover: 0,
            warehouse_count: 0
        })
        setShowForm(false)
    }

    const handleDelete = (id: string) => {
        setWholesalers(wholesalers.filter(wholesaler => wholesaler.id !== id))
    }

    const filteredWholesalers = wholesalers.filter(wholesaler => {
        const matchesSearch = wholesaler.wholesaler_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            wholesaler.location.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesLocation = selectedLocation === "all" || wholesaler.location === selectedLocation
        return matchesSearch && matchesLocation
    })

    const uniqueLocations = [...new Set(wholesalers.map(wholesaler => wholesaler.location))]

    // Analytics data
    const locationDistribution = uniqueLocations.map(location => ({
        name: location,
        value: wholesalers.filter(w => w.location === location).length
    }))

    const reachData = wholesalers.reduce((acc: Array<{ name: string, value: number }>, wholesaler) => {
        const existing = acc.find(item => item.name === wholesaler.supply_chain_reach)
        if (existing) {
            existing.value += 1
        } else {
            acc.push({name: wholesaler.supply_chain_reach, value: 1})
        }
        return acc
    }, [])

    const totalWholesalers = wholesalers.length
    const totalTurnover = wholesalers.reduce((sum, w) => sum + w.annual_turnover, 0)
    const avgNetworkSize = Math.round(wholesalers.reduce((sum, w) => sum + w.distribution_network_size, 0) / wholesalers.length)
    const totalWarehouses = wholesalers.reduce((sum, w) => sum + w.warehouse_count, 0)

    const handleExport = () => {
        exportTableToPDF({
            title: 'Wholesaler Management Report',
            subtitle: 'Agriculture Management System - Wholesaler Directory',
            filename: 'wholesaler-management-report.pdf',
            columns: [
                {header: 'Wholesaler ID', dataKey: 'wholesaler_id', width: 25},
                {header: 'Wholesaler Name', dataKey: 'wholesaler_name', width: 35},
                {header: 'Location', dataKey: 'location', width: 30},
                {header: 'Supply Chain Reach', dataKey: 'supply_chain_reach', width: 30},
                {header: 'Storage Capacity', dataKey: 'storage_capacity', width: 25},
                {header: 'Annual Revenue', dataKey: 'annual_revenue', width: 25}
            ],
            data: filteredWholesalers.map(wholesaler => ({
                wholesaler_id: wholesaler.wholesaler_id,
                wholesaler_name: wholesaler.wholesaler_name,
                location: wholesaler.location,
                supply_chain_reach: wholesaler.supply_chain_reach,
                storage_capacity: wholesaler.storage_capacity,
                annual_revenue: wholesaler.annual_turnover
            }))
        })
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-purple-100 p-3 rounded-xl border border-purple-200">
                                <Warehouse className="h-8 w-8 text-purple-600"/>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">Wholesaler Management</h1>
                                <p className="text-muted-foreground mt-1">Manage wholesale partners and distribution
                                    networks</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Button
                                onClick={() => setShowForm(!showForm)}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3"
                            >
                                <Plus className="h-4 w-4 mr-2"/>
                                Add Wholesaler
                            </Button>
                            <Button
                                onClick={handleExport}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3"
                            >
                                <FileDown className="h-4 w-4 mr-2"/>
                                Export Data
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-purple-100 p-2 rounded-lg">
                                <Warehouse className="h-5 w-5 text-purple-600"/>
                            </div>
                            <span className="text-2xl font-bold text-foreground">{totalWholesalers}</span>
                        </div>
                        <h3 className="font-medium text-foreground">Total Wholesalers</h3>
                        <p className="text-sm text-gray-500">Active partners</p>
                    </div>

                    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-green-100 p-2 rounded-lg">
                                <TrendingUp className="h-5 w-5 text-green-600"/>
                            </div>
                            <span
                                className="text-2xl font-bold text-foreground">${(totalTurnover / 1000000).toFixed(1)}M</span>
                        </div>
                        <h3 className="font-medium text-foreground">Total Turnover</h3>
                        <p className="text-sm text-gray-500">Annual combined</p>
                    </div>

                    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <Building className="h-5 w-5 text-blue-600"/>
                            </div>
                            <span className="text-2xl font-bold text-foreground">{totalWarehouses}</span>
                        </div>
                        <h3 className="font-medium text-foreground">Total Warehouses</h3>
                        <p className="text-sm text-gray-500">Storage facilities</p>
                    </div>

                    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-orange-100 p-2 rounded-lg">
                                <Truck className="h-5 w-5 text-orange-600"/>
                            </div>
                            <span className="text-2xl font-bold text-foreground">{avgNetworkSize}</span>
                        </div>
                        <h3 className="font-medium text-foreground">Avg Network Size</h3>
                        <p className="text-sm text-gray-500">Distribution points</p>
                    </div>
                </div>

                {/* Data Entry Form */}
                {showForm && (
                    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                        <h3 className="text-xl font-semibold text-foreground mb-6">Add New Wholesaler</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="wholesaler_id" className="text-foreground">Wholesaler ID</Label>
                                    <Input
                                        id="wholesaler_id"
                                        placeholder="e.g., W001"
                                        value={formData.wholesaler_id}
                                        onChange={(e) => handleInputChange("wholesaler_id", e.target.value)}
                                        className="mt-1"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="wholesaler_name" className="text-foreground">Wholesaler Name</Label>
                                    <Input
                                        id="wholesaler_name"
                                        placeholder="e.g., Grain Wholesale Co"
                                        value={formData.wholesaler_name}
                                        onChange={(e) => handleInputChange("wholesaler_name", e.target.value)}
                                        className="mt-1"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="location" className="text-foreground">Location</Label>
                                    <Input
                                        id="location"
                                        placeholder="e.g., Dhaka"
                                        value={formData.location}
                                        onChange={(e) => handleInputChange("location", e.target.value)}
                                        className="mt-1"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="contact_info" className="text-foreground">Contact Info</Label>
                                    <Input
                                        id="contact_info"
                                        placeholder="e.g., email@wholesale.com"
                                        value={formData.contact_info}
                                        onChange={(e) => handleInputChange("contact_info", e.target.value)}
                                        className="mt-1"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="supply_chain_reach" className="text-foreground">Supply Chain
                                        Reach</Label>
                                    <Select value={formData.supply_chain_reach}
                                            onValueChange={(value) => handleInputChange("supply_chain_reach", value)}>
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Select reach"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Local">Local</SelectItem>
                                            <SelectItem value="Regional">Regional</SelectItem>
                                            <SelectItem value="National">National</SelectItem>
                                            <SelectItem value="International">International</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="annual_turnover" className="text-foreground">Annual Turnover</Label>
                                    <Input
                                        id="annual_turnover"
                                        type="number"
                                        placeholder="e.g., 2500000"
                                        value={formData.annual_turnover}
                                        onChange={(e) => handleInputChange("annual_turnover", parseInt(e.target.value))}
                                        className="mt-1"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
                                    Add Wholesaler
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Table View */}
                <div className="bg-card rounded-xl border border-border shadow-sm">
                    <div className="p-6 border-b border-border">
                        <h3 className="text-xl font-semibold text-foreground mb-4">Wholesaler Directory</h3>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                                <Input
                                    placeholder="Search wholesalers..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            {uniqueLocations.length > 0 && (
                                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                                    <SelectTrigger className="w-48">
                                        <SelectValue placeholder="All Locations"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Locations</SelectItem>
                                        {uniqueLocations.map((location) => (
                                            <SelectItem key={location} value={location}>{location}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead>ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Chain Reach</TableHead>
                                    <TableHead>Turnover</TableHead>
                                    <TableHead>Network Size</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredWholesalers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                            <Warehouse className="h-8 w-8 mx-auto mb-2 text-gray-400"/>
                                            No wholesalers found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredWholesalers.map((wholesaler) => (
                                        <TableRow key={wholesaler.id} className="hover:bg-gray-50">
                                            <TableCell
                                                className="font-mono text-sm">{wholesaler.wholesaler_id}</TableCell>
                                            <TableCell className="font-medium">{wholesaler.wholesaler_name}</TableCell>
                                            <TableCell className="text-muted-foreground">{wholesaler.location}</TableCell>
                                            <TableCell>
                                                <span
                                                    className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                                                    {wholesaler.supply_chain_reach}
                                                </span>
                                            </TableCell>
                                            <TableCell
                                                className="text-muted-foreground">${wholesaler.annual_turnover.toLocaleString()}</TableCell>
                                            <TableCell
                                                className="text-muted-foreground">{wholesaler.distribution_network_size}</TableCell>
                                            <TableCell>
                                                <div className="flex space-x-2">
                                                    <Button variant="ghost" size="sm"
                                                            className="text-muted-foreground hover:text-blue-600">
                                                        <Edit2 className="h-4 w-4"/>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-muted-foreground hover:text-red-600"
                                                        onClick={() => handleDelete(wholesaler.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4"/>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                        <h3 className="text-lg font-semibold text-foreground mb-4">Location Distribution</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={locationDistribution}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {locationDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={[
                                                "#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#3B82F6"
                                            ][index % 5]}/>
                                        ))}
                                    </Pie>
                                    <Tooltip/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                        <h3 className="text-lg font-semibold text-foreground mb-4">Supply Chain Reach</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={reachData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                                    <XAxis
                                        dataKey="name"
                                        stroke="#64748b"
                                        fontSize={12}
                                        label={{value: 'Supply Chain Reach', position: 'insideBottom', offset: -5}}
                                    />
                                    <YAxis
                                        stroke="#64748b"
                                        fontSize={12}
                                        label={{value: 'Number of Wholesalers', angle: -90, position: 'insideLeft'}}
                                    />
                                    <Tooltip/>
                                    <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]}/>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}