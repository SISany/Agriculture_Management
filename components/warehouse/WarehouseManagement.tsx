"use client"

import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Badge} from "@/components/ui/badge"
import {Search, Plus, Edit2, Trash2, Warehouse as WarehouseIcon} from "lucide-react"

interface Warehouse {
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

const warehouses: Warehouse[] = [
    {
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
    const [searchTerm, setSearchTerm] = useState("")

    const filteredWarehouses = warehouses.filter(warehouse =>
        warehouse.warehouse_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        warehouse.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        warehouse.storage_conditions.toLowerCase().includes(searchTerm.toLowerCase()) ||
        warehouse.stakeholder_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getUtilizationColor = (utilization: number) => {
        if (utilization > 0.9) return "destructive"
        if (utilization > 0.8) return "secondary"
        return "default"
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Warehouse Management</h1>
                    <p className="mt-2 text-gray-600">Manage storage facilities and capacity</p>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                        <Input
                            type="search"
                            placeholder="Search warehouses..."
                            className="pl-10 w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button>
                        <Plus className="w-4 h-4 mr-2"/>
                        Add Warehouse
                    </Button>
                </div>
            </div>

            {/* Warehouse Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Total Warehouses</CardTitle>
                        <WarehouseIcon className="h-4 w-4 text-blue-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{warehouses.length}</div>
                        <p className="text-xs text-gray-600">Active facilities</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
                        <WarehouseIcon className="h-4 w-4 text-green-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {warehouses.reduce((sum, w) => sum + w.storage_capacity, 0).toLocaleString()} tons
                        </div>
                        <p className="text-xs text-gray-600">Combined capacity</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Current Stock</CardTitle>
                        <WarehouseIcon className="h-4 w-4 text-orange-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {warehouses.reduce((sum, w) => sum + w.current_stock_level, 0).toLocaleString()} tons
                        </div>
                        <p className="text-xs text-gray-600">Total stored</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Utilization Rate</CardTitle>
                        <WarehouseIcon className="h-4 w-4 text-purple-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {((warehouses.reduce((sum, w) => sum + w.current_stock_level, 0) /
                                warehouses.reduce((sum, w) => sum + w.storage_capacity, 0)) * 100).toFixed(1)}%
                        </div>
                        <p className="text-xs text-gray-600">Average utilization</p>
                    </CardContent>
                </Card>
            </div>

            {/* Storage Capacity Chart */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Warehouse Capacity Overview</CardTitle>
                        <CardDescription>Storage capacity vs current stock levels</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {warehouses.map((warehouse) => {
                                const utilization = (warehouse.current_stock_level / warehouse.storage_capacity) * 100
                                return (
                                    <div key={warehouse.warehouse_id} className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium">{warehouse.warehouse_name}</span>
                                            <span>{utilization.toFixed(1)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${
                                                    utilization > 90 ? 'bg-red-500' :
                                                        utilization > 80 ? 'bg-yellow-500' : 'bg-green-500'
                                                }`}
                                                style={{width: `${utilization}%`}}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-600">
                                            <span>{warehouse.current_stock_level.toLocaleString()} tons</span>
                                            <span>{warehouse.storage_capacity.toLocaleString()} tons</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Storage Conditions Distribution</CardTitle>
                        <CardDescription>Types of storage facilities</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {Array.from(new Set(warehouses.map(w => w.storage_conditions))).map((condition) => {
                                const count = warehouses.filter(w => w.storage_conditions === condition).length
                                const percentage = (count / warehouses.length) * 100
                                return (
                                    <div key={condition} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-4 h-4 bg-blue-500 rounded"></div>
                                            <span className="text-sm font-medium">{condition}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-600">{count} facilities</span>
                                            <Badge variant="outline">{percentage.toFixed(0)}%</Badge>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Warehouse Details Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Warehouses</CardTitle>
                    <CardDescription>Complete warehouse directory and status</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Warehouse ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Owner</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Capacity</TableHead>
                                <TableHead>Current Stock</TableHead>
                                <TableHead>Utilization</TableHead>
                                <TableHead>Storage Conditions</TableHead>
                                <TableHead>Temperature</TableHead>
                                <TableHead>Last Updated</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredWarehouses.map((warehouse) => {
                                const utilization = warehouse.current_stock_level / warehouse.storage_capacity
                                return (
                                    <TableRow key={warehouse.warehouse_id}>
                                        <TableCell className="font-medium">{warehouse.warehouse_id}</TableCell>
                                        <TableCell>{warehouse.warehouse_name}</TableCell>
                                        <TableCell>{warehouse.stakeholder_name}</TableCell>
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
                                        <TableCell>{warehouse.last_updated}</TableCell>
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
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Warehouse Insights */}
            <Card>
                <CardHeader>
                    <CardTitle>Warehouse Insights & Recommendations</CardTitle>
                    <CardDescription>Operational insights and capacity optimization suggestions</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <h4 className="font-semibold text-red-800 mb-2">High Utilization Alert</h4>
                            <p className="text-sm text-red-700">
                                {warehouses.filter(w => (w.current_stock_level / w.storage_capacity) > 0.9).length} warehouses
                                are operating above 90% capacity. Consider redistributing stock or expanding storage.
                            </p>
                        </div>

                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <h4 className="font-semibold text-yellow-800 mb-2">Temperature Monitoring</h4>
                            <p className="text-sm text-yellow-700">
                                Average temperature across
                                facilities: {(warehouses.reduce((sum, w) => sum + w.temperature_controlled, 0) / warehouses.length).toFixed(1)}°C.
                                Monitor for optimal storage conditions.
                            </p>
                        </div>

                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <h4 className="font-semibold text-green-800 mb-2">Available Capacity</h4>
                            <p className="text-sm text-green-700">
                                {warehouses.reduce((sum, w) => sum + (w.storage_capacity - w.current_stock_level), 0).toLocaleString()} tons
                                of available storage capacity across all facilities.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}