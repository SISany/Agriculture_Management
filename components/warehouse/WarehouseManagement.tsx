"use client"

import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Badge} from "@/components/ui/badge"
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ComposedChart
} from "recharts"
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    Warehouse as WarehouseIcon,
    MapPin,
    Thermometer,
    Package,
    Users,
    FileDown
} from "lucide-react"
import {exportTableToPDF} from "@/lib/pdfExport"

interface Warehouse {
    id: string
    warehouse_id: string
    stakeholder_id: string
    warehouse_name: string
    location: string
    storage_capacity: number
    current_stock_level: number
    storage_conditions: string
    temperature_controlled: number
    last_updated: string
    stakeholder_name?: string
}

const initialWarehouses: Warehouse[] = [
    {
        id: "1",
        warehouse_id: "WH001",
        stakeholder_id: "S003",
        warehouse_name: "Central Grain Storage",
        location: "Dhaka",
        storage_capacity: 10000,
        current_stock_level: 7500,
        storage_conditions: "Climate Controlled",
        temperature_controlled: 15,
        last_updated: "2024-01-15",
        stakeholder_name: "Grain Wholesale Co"
    },
    {
        id: "2",
        warehouse_id: "WH002",
        stakeholder_id: "S001",
        warehouse_name: "Ahmed Farm Storage",
        location: "Dhaka",
        storage_capacity: 500,
        current_stock_level: 300,
        storage_conditions: "Dry Storage",
        temperature_controlled: 18,
        last_updated: "2024-01-14",
        stakeholder_name: "Ahmed Farms"
    },
    {
        id: "3",
        warehouse_id: "WH003",
        stakeholder_id: "S002",
        warehouse_name: "City Distribution Center",
        location: "Chittagong",
        storage_capacity: 2500,
        current_stock_level: 1800,
        storage_conditions: "Multi-Climate",
        temperature_controlled: 12,
        last_updated: "2024-01-16",
        stakeholder_name: "City Retail Store"
    }
]

export default function WarehouseManagement() {
    const [warehouses, setWarehouses] = useState<Warehouse[]>(initialWarehouses)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedLocation, setSelectedLocation] = useState("all")

    // Form state
    const [formData, setFormData] = useState({
        warehouse_id: "",
        stakeholder_id: "",
        warehouse_name: "",
        location: "",
        storage_capacity: "",
        current_stock_level: "",
        storage_conditions: "",
        temperature_controlled: "",
        stakeholder_name: ""
    })

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Validate form
        if (!formData.warehouse_id || !formData.warehouse_name || !formData.location || !formData.storage_capacity) {
            alert("Please fill in all required fields")
            return
        }

        // Create new warehouse
        const newWarehouse: Warehouse = {
            id: Date.now().toString(),
            warehouse_id: formData.warehouse_id,
            stakeholder_id: formData.stakeholder_id,
            warehouse_name: formData.warehouse_name,
            location: formData.location,
            storage_capacity: parseFloat(formData.storage_capacity) || 0,
            current_stock_level: parseFloat(formData.current_stock_level) || 0,
            storage_conditions: formData.storage_conditions,
            temperature_controlled: parseFloat(formData.temperature_controlled) || 20,
            last_updated: new Date().toISOString().split('T')[0],
            stakeholder_name: formData.stakeholder_name
        }

        setWarehouses(prev => [...prev, newWarehouse])

        // Reset form
        setFormData({
            warehouse_id: "",
            stakeholder_id: "",
            warehouse_name: "",
            location: "",
            storage_capacity: "",
            current_stock_level: "",
            storage_conditions: "",
            temperature_controlled: "",
            stakeholder_name: ""
        })

        alert("Warehouse data submitted successfully!")
    }

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this warehouse?")) {
            setWarehouses(prev => prev.filter(warehouse => warehouse.id !== id))
        }
    }

    const filteredWarehouses = warehouses.filter(warehouse => {
        const matchesSearch = warehouse.warehouse_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            warehouse.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            warehouse.storage_conditions.toLowerCase().includes(searchTerm.toLowerCase()) ||
            warehouse.stakeholder_name?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesLocation = selectedLocation === "all" || warehouse.location === selectedLocation

        return matchesSearch && matchesLocation
    })

    const totalWarehouses = filteredWarehouses.length
    const totalCapacity = filteredWarehouses.reduce((sum, w) => sum + w.storage_capacity, 0)
    const totalStock = filteredWarehouses.reduce((sum, w) => sum + w.current_stock_level, 0)
    const avgUtilization = totalCapacity > 0 ? (totalStock / totalCapacity) * 100 : 0

    const uniqueLocations = [...new Set(warehouses.map(w => w.location))].filter(Boolean)
    const uniqueConditions = [...new Set(warehouses.map(w => w.storage_conditions))].filter(Boolean)

    // Chart data calculations
    const locationData = uniqueLocations.map(location => ({
        name: location,
        warehouses: warehouses.filter(w => w.location === location).length,
        totalCapacity: warehouses.filter(w => w.location === location).reduce((sum, w) => sum + w.storage_capacity, 0),
        currentStock: warehouses.filter(w => w.location === location).reduce((sum, w) => sum + w.current_stock_level, 0)
    }))

    const conditionsData = uniqueConditions.map(condition => ({
        name: condition,
        value: warehouses.filter(w => w.storage_conditions === condition).length,
        percentage: ((warehouses.filter(w => w.storage_conditions === condition).length / warehouses.length) * 100).toFixed(1)
    }))

    const utilizationRanges = [
        {range: "0-25%", min: 0, max: 0.25, color: "#10B981"},
        {range: "26-50%", min: 0.26, max: 0.50, color: "#3B82F6"},
        {range: "51-75%", min: 0.51, max: 0.75, color: "#F59E0B"},
        {range: "76-90%", min: 0.76, max: 0.90, color: "#EF4444"},
        {range: "90%+", min: 0.91, max: 1, color: "#7C2D12"}
    ]

    const utilizationData = utilizationRanges.map(range => ({
        name: range.range,
        value: warehouses.filter(w => {
            const utilization = w.current_stock_level / w.storage_capacity
            return utilization >= range.min && utilization <= range.max
        }).length,
        color: range.color
    }))

    const capacityAnalysisData = warehouses.map(warehouse => ({
        name: warehouse.warehouse_name,
        capacity: warehouse.storage_capacity,
        stock: warehouse.current_stock_level,
        available: warehouse.storage_capacity - warehouse.current_stock_level,
        utilization: ((warehouse.current_stock_level / warehouse.storage_capacity) * 100).toFixed(1)
    })).sort((a, b) => b.capacity - a.capacity)

    const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4']

    const getUtilizationColor = (utilization: number) => {
        if (utilization > 0.9) return "destructive"
        if (utilization > 0.8) return "secondary"
        return "default"
    }

    const handleExport = () => {
        exportTableToPDF({
            title: 'Warehouse Management Report',
            subtitle: 'Agriculture Management System - Warehouse Operations',
            filename: 'warehouse-management-report.pdf',
            columns: [
                {header: 'Warehouse ID', dataKey: 'warehouse_id', width: 25},
                {header: 'Name', dataKey: 'warehouse_name', width: 30},
                {header: 'Location', dataKey: 'location', width: 30},
                {header: 'Type', dataKey: 'warehouse_type', width: 20},
                {header: 'Total Capacity', dataKey: 'total_capacity', width: 25},
                {header: 'Current Stock', dataKey: 'current_stock', width: 25},
                {header: 'Available Space', dataKey: 'available_space', width: 25},
                {header: 'Manager', dataKey: 'manager_name', width: 25},
                {header: 'Status', dataKey: 'operational_status', width: 20}
            ],
            data: filteredWarehouses.map(warehouse => ({
                warehouse_id: warehouse.warehouse_id,
                warehouse_name: warehouse.warehouse_name,
                location: warehouse.location,
                warehouse_type: warehouse.storage_conditions,
                total_capacity: warehouse.storage_capacity,
                current_stock: warehouse.current_stock_level,
                available_space: warehouse.storage_capacity - warehouse.current_stock_level,
                manager_name: warehouse.stakeholder_name,
                operational_status: "Operational"
            }))
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Warehouse Management System</h1>
                    <p className="text-sm text-muted-foreground">Manage storage facilities and inventory tracking</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleExport}>
                        <FileDown className="w-4 h-4 mr-2"/>
                        Export Data
                    </Button>
                </div>
            </div>

            {/* 1. STATISTICS - Warehouse Statistics */}
            <Card>
                <CardHeader className="flex flex-row items-center gap-4 pb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <WarehouseIcon className="w-6 h-6 text-purple-600"/>
                    </div>
                    <div>
                        <CardTitle className="text-xl text-purple-600">Warehouse Statistics</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <p className="text-lg"><strong>Total Warehouses:</strong> {totalWarehouses}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-lg"><strong>Total
                                Capacity:</strong> {totalCapacity.toLocaleString()} tons</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-lg"><strong>Current Stock:</strong> {totalStock.toLocaleString()} tons
                            </p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-lg"><strong>Average Utilization:</strong> {avgUtilization.toFixed(1)}%
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 2. DATA ENTRY - Warehouse Data Entry Form */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Submit Warehouse Data</CardTitle>
                    <CardDescription>Enter new warehouse information</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Form Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Warehouse ID */}
                            <div className="space-y-2">
                                <Label htmlFor="warehouse_id" className="flex items-center gap-2 text-purple-600">
                                    <WarehouseIcon className="w-4 h-4"/>
                                    Warehouse ID
                                </Label>
                                <Input
                                    id="warehouse_id"
                                    placeholder="Enter warehouse ID"
                                    value={formData.warehouse_id}
                                    onChange={(e) => handleInputChange("warehouse_id", e.target.value)}
                                    required
                                />
                            </div>

                            {/* Warehouse Name */}
                            <div className="space-y-2">
                                <Label htmlFor="warehouse_name" className="flex items-center gap-2 text-purple-600">
                                    <WarehouseIcon className="w-4 h-4"/>
                                    Warehouse Name
                                </Label>
                                <Input
                                    id="warehouse_name"
                                    placeholder="Enter warehouse name"
                                    value={formData.warehouse_name}
                                    onChange={(e) => handleInputChange("warehouse_name", e.target.value)}
                                    required
                                />
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                                <Label htmlFor="location" className="flex items-center gap-2 text-purple-600">
                                    <MapPin className="w-4 h-4"/>
                                    Location
                                </Label>
                                <Select value={formData.location}
                                        onValueChange={(value) => handleInputChange("location", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select location"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Dhaka">Dhaka</SelectItem>
                                        <SelectItem value="Chittagong">Chittagong</SelectItem>
                                        <SelectItem value="Sylhet">Sylhet</SelectItem>
                                        <SelectItem value="Rajshahi">Rajshahi</SelectItem>
                                        <SelectItem value="Khulna">Khulna</SelectItem>
                                        <SelectItem value="Barisal">Barisal</SelectItem>
                                        <SelectItem value="Rangpur">Rangpur</SelectItem>
                                        <SelectItem value="Mymensingh">Mymensingh</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Stakeholder ID */}
                            <div className="space-y-2">
                                <Label htmlFor="stakeholder_id" className="flex items-center gap-2 text-purple-600">
                                    <Users className="w-4 h-4"/>
                                    Stakeholder ID
                                </Label>
                                <Input
                                    id="stakeholder_id"
                                    placeholder="Enter stakeholder ID"
                                    value={formData.stakeholder_id}
                                    onChange={(e) => handleInputChange("stakeholder_id", e.target.value)}
                                />
                            </div>

                            {/* Stakeholder Name */}
                            <div className="space-y-2">
                                <Label htmlFor="stakeholder_name" className="flex items-center gap-2 text-purple-600">
                                    <Users className="w-4 h-4"/>
                                    Owner/Stakeholder Name
                                </Label>
                                <Input
                                    id="stakeholder_name"
                                    placeholder="Enter stakeholder name"
                                    value={formData.stakeholder_name}
                                    onChange={(e) => handleInputChange("stakeholder_name", e.target.value)}
                                />
                            </div>

                            {/* Storage Capacity */}
                            <div className="space-y-2">
                                <Label htmlFor="storage_capacity" className="flex items-center gap-2 text-purple-600">
                                    <WarehouseIcon className="w-4 h-4"/>
                                    Storage Capacity (tons)
                                </Label>
                                <Input
                                    id="storage_capacity"
                                    type="number"
                                    placeholder="Storage capacity"
                                    value={formData.storage_capacity}
                                    onChange={(e) => handleInputChange("storage_capacity", e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Current Stock Level */}
                            <div className="space-y-2">
                                <Label htmlFor="current_stock_level"
                                       className="flex items-center gap-2 text-purple-600">
                                    <Package className="w-4 h-4"/>
                                    Current Stock Level (tons)
                                </Label>
                                <Input
                                    id="current_stock_level"
                                    type="number"
                                    placeholder="Enter current stock level"
                                    value={formData.current_stock_level}
                                    onChange={(e) => handleInputChange("current_stock_level", e.target.value)}
                                />
                            </div>

                            {/* Storage Conditions */}
                            <div className="space-y-2">
                                <Label htmlFor="storage_conditions" className="flex items-center gap-2 text-purple-600">
                                    <WarehouseIcon className="w-4 h-4"/>
                                    Storage Conditions
                                </Label>
                                <Select value={formData.storage_conditions}
                                        onValueChange={(value) => handleInputChange("storage_conditions", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select storage conditions"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Climate Controlled">Climate Controlled</SelectItem>
                                        <SelectItem value="Dry Storage">Dry Storage</SelectItem>
                                        <SelectItem value="Cold Storage">Cold Storage</SelectItem>
                                        <SelectItem value="Multi-Climate">Multi-Climate</SelectItem>
                                        <SelectItem value="Ambient">Ambient</SelectItem>
                                        <SelectItem value="Refrigerated">Refrigerated</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Temperature Controlled */}
                            <div className="space-y-2">
                                <Label htmlFor="temperature_controlled"
                                       className="flex items-center gap-2 text-purple-600">
                                    <Thermometer className="w-4 h-4"/>
                                    Temperature (°C)
                                </Label>
                                <Input
                                    id="temperature_controlled"
                                    type="number"
                                    placeholder="Temperature"
                                    value={formData.temperature_controlled}
                                    onChange={(e) => handleInputChange("temperature_controlled", e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-start">
                            <Button type="submit"
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2 flex items-center gap-2">
                                <Plus className="w-4 h-4"/>
                                SUBMIT WAREHOUSE DATA
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* 3. TABLE SHOW - Warehouse Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Warehouse Directory</CardTitle>
                    <CardDescription>Search and manage registered warehouses</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                            <Input
                                placeholder="Search warehouses by name, location, owner..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        {uniqueLocations.length > 0 && (
                            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                                <SelectTrigger className="w-full md:w-48">
                                    <SelectValue placeholder="Select Location"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Locations</SelectItem>
                                    {uniqueLocations.map(location => (
                                        <SelectItem key={location} value={location}>{location}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader className="bg-purple-600 text-white">
                                <TableRow>
                                    <TableHead className="text-white">Warehouse ID</TableHead>
                                    <TableHead className="text-white">Name</TableHead>
                                    <TableHead className="text-white">Owner</TableHead>
                                    <TableHead className="text-white">Location</TableHead>
                                    <TableHead className="text-white">Capacity</TableHead>
                                    <TableHead className="text-white">Current Stock</TableHead>
                                    <TableHead className="text-white">Utilization</TableHead>
                                    <TableHead className="text-white">Conditions</TableHead>
                                    <TableHead className="text-white">Temperature</TableHead>
                                    <TableHead className="text-white">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredWarehouses.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                                            No warehouses registered yet. Use the form above to add warehouses.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredWarehouses.map((warehouse) => {
                                        const utilization = warehouse.current_stock_level / warehouse.storage_capacity
                                        return (
                                            <TableRow key={warehouse.id}>
                                                <TableCell className="font-medium">{warehouse.warehouse_id}</TableCell>
                                                <TableCell>{warehouse.warehouse_name}</TableCell>
                                                <TableCell>{warehouse.stakeholder_name || "N/A"}</TableCell>
                                                <TableCell>{warehouse.location}</TableCell>
                                                <TableCell>{warehouse.storage_capacity.toLocaleString()} tons</TableCell>
                                                <TableCell>{warehouse.current_stock_level.toLocaleString()} tons</TableCell>
                                                <TableCell>
                                                    <Badge variant={getUtilizationColor(utilization)}>
                                                        {(utilization * 100).toFixed(1)}%
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{warehouse.storage_conditions}</TableCell>
                                                <TableCell>{warehouse.temperature_controlled}°C</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-1">
                                                        <Button variant="ghost" size="sm"
                                                                className="hover:bg-purple-50">
                                                            <Edit2 className="w-4 h-4 text-purple-600"/>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="hover:bg-red-50"
                                                            onClick={() => handleDelete(warehouse.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4 text-red-600"/>
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* 4. CHARTS - Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Location Distribution Pie Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg text-purple-600">Warehouses by Location</CardTitle>
                        <CardDescription>Distribution of warehouses across locations</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={locationData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={120}
                                        paddingAngle={5}
                                        dataKey="warehouses"
                                        label={({name, warehouses}) => `${name}: ${warehouses}`}
                                    >
                                        {locationData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value, name) => [`${value} warehouses`, name]}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Storage Conditions Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg text-purple-600">Storage Conditions</CardTitle>
                        <CardDescription>Distribution by storage condition types</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={conditionsData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={120}
                                        dataKey="value"
                                        label={({name, percentage}) => `${name}: ${percentage}%`}
                                    >
                                        {conditionsData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value, name) => [`${value} warehouses`, name]}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Utilization Analysis */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg text-purple-600">Warehouse Utilization Analysis</CardTitle>
                    <CardDescription>Number of warehouses by utilization rate</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={utilizationData} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="name"/>
                                <YAxis/>
                                <Tooltip formatter={(value) => [`${value} warehouses`, "Count"]}/>
                                <Bar dataKey="value" fill="#8B5CF6"/>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Capacity vs Stock Analysis */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg text-purple-600">Capacity vs Current Stock</CardTitle>
                    <CardDescription>Capacity and stock levels by warehouse</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={capacityAnalysisData}
                                           margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100}/>
                                <YAxis/>
                                <Tooltip
                                    formatter={(value, name) => {
                                        if (name === 'capacity') return [`${value} tons`, 'Total Capacity']
                                        if (name === 'stock') return [`${value} tons`, 'Current Stock']
                                        return [`${value} tons`, 'Available Space']
                                    }}
                                />
                                <Bar dataKey="capacity" fill="#8B5CF6" name="capacity"/>
                                <Bar dataKey="stock" fill="#10B981" name="stock"/>
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}