"use client"

import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Search, Plus, Edit2, Trash2, Store, MapPin, Users, TrendingUp} from "lucide-react"
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

interface Retailer {
    id: string
    retailer_id: string
    retailer_name: string
    location: string
    contact_info: string
    shop_type: string
    customer_base: string
    monthly_sales_volume: number
    market_coverage: string
    registration_date: string
    business_license: string
    annual_revenue: number
}

export default function RetailerManagement() {
    const [retailers, setRetailers] = useState<Retailer[]>([
        {
            id: "1",
            retailer_id: "R001",
            retailer_name: "City Retail Store",
            location: "Dhaka",
            contact_info: "info@citystore.com",
            shop_type: "Grocery Store",
            customer_base: "5000+",
            monthly_sales_volume: 200,
            market_coverage: "Urban",
            registration_date: "2023-01-15",
            business_license: "RT-2023-001",
            annual_revenue: 500000
        },
        {
            id: "2",
            retailer_id: "R002",
            retailer_name: "Green Valley Market",
            location: "Chittagong",
            contact_info: "contact@greenvalley.com",
            shop_type: "Supermarket",
            customer_base: "10000+",
            monthly_sales_volume: 450,
            market_coverage: "Suburban",
            registration_date: "2023-03-20",
            business_license: "RT-2023-002",
            annual_revenue: 1200000
        },
        {
            id: "3",
            retailer_id: "R003",
            retailer_name: "Fresh Corner",
            location: "Sylhet",
            contact_info: "hello@freshcorner.com",
            shop_type: "Convenience Store",
            customer_base: "2000+",
            monthly_sales_volume: 120,
            market_coverage: "Local",
            registration_date: "2023-06-10",
            business_license: "RT-2023-003",
            annual_revenue: 300000
        }
    ])

    const [searchTerm, setSearchTerm] = useState("")
    const [selectedLocation, setSelectedLocation] = useState("all")
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState<Omit<Retailer, "id">>({
        retailer_id: "",
        retailer_name: "",
        location: "",
        contact_info: "",
        shop_type: "",
        customer_base: "",
        monthly_sales_volume: 0,
        market_coverage: "",
        registration_date: "",
        business_license: "",
        annual_revenue: 0
    })

    const handleInputChange = (field: keyof Omit<Retailer, "id">, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const newRetailer: Retailer = {
            ...formData,
            id: Date.now().toString()
        }
        setRetailers([...retailers, newRetailer])
        setFormData({
            retailer_id: "",
            retailer_name: "",
            location: "",
            contact_info: "",
            shop_type: "",
            customer_base: "",
            monthly_sales_volume: 0,
            market_coverage: "",
            registration_date: "",
            business_license: "",
            annual_revenue: 0
        })
        setShowForm(false)
    }

    const handleDelete = (id: string) => {
        setRetailers(retailers.filter(retailer => retailer.id !== id))
    }

    const filteredRetailers = retailers.filter(retailer => {
        const matchesSearch = retailer.retailer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            retailer.location.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesLocation = selectedLocation === "all" || retailer.location === selectedLocation
        return matchesSearch && matchesLocation
    })

    const uniqueLocations = [...new Set(retailers.map(retailer => retailer.location))]

    // Analytics data
    const locationDistribution = uniqueLocations.map(location => ({
        name: location,
        value: retailers.filter(r => r.location === location).length
    }))

    const shopTypeData = retailers.reduce((acc: Array<{ name: string, value: number }>, retailer) => {
        const existing = acc.find(item => item.name === retailer.shop_type)
        if (existing) {
            existing.value += 1
        } else {
            acc.push({name: retailer.shop_type, value: 1})
        }
        return acc
    }, [])

    const totalRetailers = retailers.length
    const totalRevenue = retailers.reduce((sum, r) => sum + r.annual_revenue, 0)
    const avgSalesVolume = Math.round(retailers.reduce((sum, r) => sum + r.monthly_sales_volume, 0) / retailers.length)
    const totalCustomerBase = retailers.reduce((sum, r) => {
        const customers = parseInt(r.customer_base.replace(/[^0-9]/g, '')) || 0
        return sum + customers
    }, 0)

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-100 p-3 rounded-xl border border-blue-200">
                                <Store className="h-8 w-8 text-blue-600"/>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Retailer Management</h1>
                                <p className="text-gray-600 mt-1">Manage retail partners and their business
                                    information</p>
                            </div>
                        </div>
                        <Button
                            onClick={() => setShowForm(!showForm)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
                        >
                            <Plus className="h-4 w-4 mr-2"/>
                            Add Retailer
                        </Button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <Store className="h-5 w-5 text-blue-600"/>
                            </div>
                            <span className="text-2xl font-bold text-gray-900">{totalRetailers}</span>
                        </div>
                        <h3 className="font-medium text-gray-900">Total Retailers</h3>
                        <p className="text-sm text-gray-500">Active partners</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-green-100 p-2 rounded-lg">
                                <TrendingUp className="h-5 w-5 text-green-600"/>
                            </div>
                            <span
                                className="text-2xl font-bold text-gray-900">${(totalRevenue / 1000000).toFixed(1)}M</span>
                        </div>
                        <h3 className="font-medium text-gray-900">Total Revenue</h3>
                        <p className="text-sm text-gray-500">Annual combined</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-purple-100 p-2 rounded-lg">
                                <Users className="h-5 w-5 text-purple-600"/>
                            </div>
                            <span
                                className="text-2xl font-bold text-gray-900">{totalCustomerBase.toLocaleString()}</span>
                        </div>
                        <h3 className="font-medium text-gray-900">Customer Base</h3>
                        <p className="text-sm text-gray-500">Total customers served</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-orange-100 p-2 rounded-lg">
                                <MapPin className="h-5 w-5 text-orange-600"/>
                            </div>
                            <span className="text-2xl font-bold text-gray-900">{avgSalesVolume}</span>
                        </div>
                        <h3 className="font-medium text-gray-900">Avg Monthly Sales</h3>
                        <p className="text-sm text-gray-500">Volume per retailer</p>
                    </div>
                </div>

                {/* Data Entry Form */}
                {showForm && (
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">Add New Retailer</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="retailer_id" className="text-gray-700">Retailer ID</Label>
                                    <Input
                                        id="retailer_id"
                                        placeholder="e.g., R001"
                                        value={formData.retailer_id}
                                        onChange={(e) => handleInputChange("retailer_id", e.target.value)}
                                        className="mt-1"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="retailer_name" className="text-gray-700">Retailer Name</Label>
                                    <Input
                                        id="retailer_name"
                                        placeholder="e.g., City Store"
                                        value={formData.retailer_name}
                                        onChange={(e) => handleInputChange("retailer_name", e.target.value)}
                                        className="mt-1"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="location" className="text-gray-700">Location</Label>
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
                                    <Label htmlFor="contact_info" className="text-gray-700">Contact Info</Label>
                                    <Input
                                        id="contact_info"
                                        placeholder="e.g., email@store.com"
                                        value={formData.contact_info}
                                        onChange={(e) => handleInputChange("contact_info", e.target.value)}
                                        className="mt-1"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="shop_type" className="text-gray-700">Shop Type</Label>
                                    <Select value={formData.shop_type}
                                            onValueChange={(value) => handleInputChange("shop_type", value)}>
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Select type"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Grocery Store">Grocery Store</SelectItem>
                                            <SelectItem value="Supermarket">Supermarket</SelectItem>
                                            <SelectItem value="Convenience Store">Convenience Store</SelectItem>
                                            <SelectItem value="Department Store">Department Store</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="annual_revenue" className="text-gray-700">Annual Revenue</Label>
                                    <Input
                                        id="annual_revenue"
                                        type="number"
                                        placeholder="e.g., 500000"
                                        value={formData.annual_revenue}
                                        onChange={(e) => handleInputChange("annual_revenue", parseInt(e.target.value))}
                                        className="mt-1"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                                    Add Retailer
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Table View */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Retailer Directory</h3>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                                <Input
                                    placeholder="Search retailers..."
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
                                    <TableHead>Shop Type</TableHead>
                                    <TableHead>Revenue</TableHead>
                                    <TableHead>Customer Base</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRetailers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                            <Store className="h-8 w-8 mx-auto mb-2 text-gray-400"/>
                                            No retailers found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredRetailers.map((retailer) => (
                                        <TableRow key={retailer.id} className="hover:bg-gray-50">
                                            <TableCell className="font-mono text-sm">{retailer.retailer_id}</TableCell>
                                            <TableCell className="font-medium">{retailer.retailer_name}</TableCell>
                                            <TableCell className="text-gray-600">{retailer.location}</TableCell>
                                            <TableCell>
                                                <span
                                                    className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                                    {retailer.shop_type}
                                                </span>
                                            </TableCell>
                                            <TableCell
                                                className="text-gray-600">${retailer.annual_revenue.toLocaleString()}</TableCell>
                                            <TableCell className="text-gray-600">{retailer.customer_base}</TableCell>
                                            <TableCell>
                                                <div className="flex space-x-2">
                                                    <Button variant="ghost" size="sm"
                                                            className="text-gray-600 hover:text-blue-600">
                                                        <Edit2 className="h-4 w-4"/>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-gray-600 hover:text-red-600"
                                                        onClick={() => handleDelete(retailer.id)}
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
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Distribution</h3>
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
                                                "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"
                                            ][index % 5]}/>
                                        ))}
                                    </Pie>
                                    <Tooltip/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Shop Type Distribution</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={shopTypeData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                                    <XAxis dataKey="name" stroke="#64748b" fontSize={12}/>
                                    <YAxis stroke="#64748b" fontSize={12}/>
                                    <Tooltip/>
                                    <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]}/>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}