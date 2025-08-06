"use client"

import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Badge} from "@/components/ui/badge"
import {Search, Plus, Edit2, Trash2, Package, Activity, Target, TrendingUp, Calendar, Warehouse} from "lucide-react"

interface InventoryItem {
    inventory_id: string
    warehouse_id: string
    warehouse_name: string
    product_id: string
    product_name: string
    quantity_available: number
    quantity_reserved: number
    expiry_date: string
    batch_number: string
    unit_cost: number
    last_updated: string
}

const inventory: InventoryItem[] = [
    {
        inventory_id: "INV001",
        warehouse_id: "WH001",
        warehouse_name: "Central Grain Storage",
        product_id: "P001",
        product_name: "Wheat",
        quantity_available: 2000,
        quantity_reserved: 500,
        expiry_date: "2024-06-01",
        batch_number: "WH2024001",
        unit_cost: 38,
        last_updated: "2024-01-15"
    },
    {
        inventory_id: "INV002",
        warehouse_id: "WH001",
        warehouse_name: "Central Grain Storage",
        product_id: "P002",
        product_name: "Rice",
        quantity_available: 1500,
        quantity_reserved: 200,
        expiry_date: "2024-08-01",
        batch_number: "RC2024001",
        unit_cost: 55,
        last_updated: "2024-01-15"
    },
    {
        inventory_id: "INV003",
        warehouse_id: "WH002",
        warehouse_name: "Ahmed Farm Storage",
        product_id: "P003",
        product_name: "Corn",
        quantity_available: 800,
        quantity_reserved: 100,
        expiry_date: "2024-05-15",
        batch_number: "CN2024001",
        unit_cost: 42,
        last_updated: "2024-01-14"
    },
    {
        inventory_id: "INV004",
        warehouse_id: "WH003",
        warehouse_name: "City Distribution Center",
        product_id: "P001",
        product_name: "Wheat",
        quantity_available: 1200,
        quantity_reserved: 300,
        expiry_date: "2024-07-01",
        batch_number: "WH2024002",
        unit_cost: 40,
        last_updated: "2024-01-16"
    }
]

export default function InventoryManagement() {
    const [searchTerm, setSearchTerm] = useState("")
    const [inventoryData, setInventoryData] = useState<InventoryItem[]>(inventory)

    // Form state
    const [formData, setFormData] = useState({
        inventory_id: "",
        warehouse_id: "",
        warehouse_name: "",
        product_id: "",
        product_name: "",
        quantity_available: "",
        quantity_reserved: "",
        expiry_date: "",
        batch_number: "",
        unit_cost: ""
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
        if (!formData.inventory_id || !formData.product_name || !formData.warehouse_name || !formData.quantity_available) {
            alert("Please fill in all required fields")
            return
        }

        // Create new inventory item
        const newInventoryItem: InventoryItem = {
            inventory_id: formData.inventory_id,
            warehouse_id: formData.warehouse_id,
            warehouse_name: formData.warehouse_name,
            product_id: formData.product_id || `P${String(inventoryData.length + 1).padStart(3, '0')}`,
            product_name: formData.product_name,
            quantity_available: parseFloat(formData.quantity_available) || 0,
            quantity_reserved: parseFloat(formData.quantity_reserved) || 0,
            expiry_date: formData.expiry_date,
            batch_number: formData.batch_number,
            unit_cost: parseFloat(formData.unit_cost) || 0,
            last_updated: new Date().toISOString().split('T')[0]
        }

        setInventoryData(prev => [...prev, newInventoryItem])

        // Reset form
        setFormData({
            inventory_id: "",
            warehouse_id: "",
            warehouse_name: "",
            product_id: "",
            product_name: "",
            quantity_available: "",
            quantity_reserved: "",
            expiry_date: "",
            batch_number: "",
            unit_cost: ""
        })

        alert("Inventory item submitted successfully!")
    }

    const handleDelete = (inventoryId: string) => {
        if (confirm("Are you sure you want to delete this inventory item?")) {
            setInventoryData(prev => prev.filter(item => item.inventory_id !== inventoryId))
        }
    }

    const filteredInventory = inventoryData.filter(item =>
        item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.warehouse_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.batch_number.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const isExpiringSoon = (expiryDate: string) => {
        const expiry = new Date(expiryDate)
        const today = new Date()
        const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000))
        return expiry <= thirtyDaysFromNow
    }

    const isExpired = (expiryDate: string) => {
        const expiry = new Date(expiryDate)
        const today = new Date()
        return expiry < today
    }

    const getExpiryBadgeVariant = (expiryDate: string) => {
        if (isExpired(expiryDate)) return "destructive"
        if (isExpiringSoon(expiryDate)) return "secondary"
        return "default"
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
                    <p className="mt-2 text-gray-600">Track product inventory across warehouses</p>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                        <Input
                            type="search"
                            placeholder="Search inventory..."
                            className="pl-10 w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button>
                        <Plus className="w-4 h-4 mr-2"/>
                        Add Inventory
                    </Button>
                </div>
            </div>

            {/* Inventory Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                        <Package className="h-4 w-4 text-blue-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{inventoryData.length}</div>
                        <p className="text-xs text-gray-600">Inventory items</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Total Available</CardTitle>
                        <Activity className="h-4 w-4 text-green-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {inventoryData.reduce((sum, inv) => sum + inv.quantity_available, 0).toLocaleString()} tons
                        </div>
                        <p className="text-xs text-gray-600">Available stock</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Reserved Stock</CardTitle>
                        <Target className="h-4 w-4 text-orange-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {inventoryData.reduce((sum, inv) => sum + inv.quantity_reserved, 0).toLocaleString()} tons
                        </div>
                        <p className="text-xs text-gray-600">Reserved items</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                        <TrendingUp className="h-4 w-4 text-purple-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${inventoryData.reduce((sum, inv) => sum + (inv.quantity_available * inv.unit_cost), 0).toLocaleString()}
                        </div>
                        <p className="text-xs text-gray-600">Inventory value</p>
                    </CardContent>
                </Card>
            </div>

            {/* Inventory Alerts */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Low Stock Alert</CardTitle>
                        <CardDescription>Items with low availability</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {inventoryData.filter(item => item.quantity_available < 1000).map((item) => (
                                <div key={item.inventory_id}
                                     className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium">{item.product_name}</p>
                                        <p className="text-xs text-gray-600">{item.warehouse_name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-red-700">{item.quantity_available} tons</p>
                                        <p className="text-xs text-red-600">Low Stock</p>
                                    </div>
                                </div>
                            ))}
                            {inventoryData.filter(item => item.quantity_available < 1000).length === 0 && (
                                <p className="text-sm text-gray-500 text-center py-4">No low stock items</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Expiry Alerts</CardTitle>
                        <CardDescription>Items expiring soon</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {inventoryData.filter(item => isExpiringSoon(item.expiry_date)).map((item) => (
                                <div key={item.inventory_id}
                                     className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium">{item.product_name}</p>
                                        <p className="text-xs text-gray-600">Batch: {item.batch_number}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-yellow-700">{item.expiry_date}</p>
                                        <p className="text-xs text-yellow-600">
                                            {isExpired(item.expiry_date) ? "Expired" : "Expiring Soon"}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {inventoryData.filter(item => isExpiringSoon(item.expiry_date)).length === 0 && (
                                <p className="text-sm text-gray-500 text-center py-4">No expiring items</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>High Value Items</CardTitle>
                        <CardDescription>Most valuable inventory</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {inventoryData
                                .sort((a, b) => (b.quantity_available * b.unit_cost) - (a.quantity_available * a.unit_cost))
                                .slice(0, 3)
                                .map((item) => (
                                    <div key={item.inventory_id}
                                         className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <div>
                                            <p className="text-sm font-medium">{item.product_name}</p>
                                            <p className="text-xs text-gray-600">{item.warehouse_name}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-green-700">
                                                ${(item.quantity_available * item.unit_cost).toLocaleString()}
                                            </p>
                                            <p className="text-xs text-green-600">Total Value</p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Inventory by Product */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Inventory by Product</CardTitle>
                    <CardDescription>Stock levels across all warehouses by product type</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {Array.from(new Set(inventoryData.map(item => item.product_name))).map((productName) => {
                            const productItems = inventoryData.filter(item => item.product_name === productName)
                            const totalAvailable = productItems.reduce((sum, item) => sum + item.quantity_available, 0)
                            const totalReserved = productItems.reduce((sum, item) => sum + item.quantity_reserved, 0)
                            const totalValue = productItems.reduce((sum, item) => sum + (item.quantity_available * item.unit_cost), 0)

                            return (
                                <div key={productName} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-semibold text-lg">{productName}</h4>
                                        <Badge variant="outline">{productItems.length} locations</Badge>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-green-600">{totalAvailable.toLocaleString()}</p>
                                            <p className="text-xs text-gray-600">Available (tons)</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-orange-600">{totalReserved.toLocaleString()}</p>
                                            <p className="text-xs text-gray-600">Reserved (tons)</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-purple-600">${totalValue.toLocaleString()}</p>
                                            <p className="text-xs text-gray-600">Total Value</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-blue-600">
                                                ${(totalValue / (totalAvailable || 1)).toFixed(2)}
                                            </p>
                                            <p className="text-xs text-gray-600">Avg. Unit Cost</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Inventory Data Entry Form */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Submit Inventory Data</CardTitle>
                    <CardDescription>Enter new inventory item information</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Form Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Inventory ID */}
                            <div className="space-y-2">
                                <Label htmlFor="inventory_id" className="flex items-center gap-2 text-green-600">
                                    <Package className="w-4 h-4"/>
                                    Inventory ID
                                </Label>
                                <Input
                                    id="inventory_id"
                                    placeholder="Enter inventory ID"
                                    value={formData.inventory_id}
                                    onChange={(e) => handleInputChange("inventory_id", e.target.value)}
                                    required
                                />
                            </div>

                            {/* Warehouse Name */}
                            <div className="space-y-2">
                                <Label htmlFor="warehouse_name" className="flex items-center gap-2 text-green-600">
                                    <Warehouse className="w-4 h-4"/>
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

                            {/* Product Name */}
                            <div className="space-y-2">
                                <Label htmlFor="product_name" className="flex items-center gap-2 text-green-600">
                                    <Package className="w-4 h-4"/>
                                    Product Name
                                </Label>
                                <Input
                                    id="product_name"
                                    placeholder="Enter product name"
                                    value={formData.product_name}
                                    onChange={(e) => handleInputChange("product_name", e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Quantity Available */}
                            <div className="space-y-2">
                                <Label htmlFor="quantity_available" className="flex items-center gap-2 text-green-600">
                                    <Activity className="w-4 h-4"/>
                                    Quantity Available (tons)
                                </Label>
                                <Input
                                    id="quantity_available"
                                    type="number"
                                    placeholder="Available quantity"
                                    value={formData.quantity_available}
                                    onChange={(e) => handleInputChange("quantity_available", e.target.value)}
                                    required
                                />
                            </div>

                            {/* Quantity Reserved */}
                            <div className="space-y-2">
                                <Label htmlFor="quantity_reserved" className="flex items-center gap-2 text-green-600">
                                    <Target className="w-4 h-4"/>
                                    Quantity Reserved (tons)
                                </Label>
                                <Input
                                    id="quantity_reserved"
                                    type="number"
                                    placeholder="Reserved quantity"
                                    value={formData.quantity_reserved}
                                    onChange={(e) => handleInputChange("quantity_reserved", e.target.value)}
                                />
                            </div>

                            {/* Unit Cost */}
                            <div className="space-y-2">
                                <Label htmlFor="unit_cost" className="flex items-center gap-2 text-green-600">
                                    <TrendingUp className="w-4 h-4"/>
                                    Unit Cost ($)
                                </Label>
                                <Input
                                    id="unit_cost"
                                    type="number"
                                    step="0.01"
                                    placeholder="Cost per unit"
                                    value={formData.unit_cost}
                                    onChange={(e) => handleInputChange("unit_cost", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Expiry Date */}
                            <div className="space-y-2">
                                <Label htmlFor="expiry_date" className="flex items-center gap-2 text-green-600">
                                    <Calendar className="w-4 h-4"/>
                                    Expiry Date
                                </Label>
                                <Input
                                    id="expiry_date"
                                    type="date"
                                    value={formData.expiry_date}
                                    onChange={(e) => handleInputChange("expiry_date", e.target.value)}
                                />
                            </div>

                            {/* Batch Number */}
                            <div className="space-y-2">
                                <Label htmlFor="batch_number" className="flex items-center gap-2 text-green-600">
                                    <Package className="w-4 h-4"/>
                                    Batch Number
                                </Label>
                                <Input
                                    id="batch_number"
                                    placeholder="Batch number"
                                    value={formData.batch_number}
                                    onChange={(e) => handleInputChange("batch_number", e.target.value)}
                                />
                            </div>

                            {/* Warehouse ID */}
                            <div className="space-y-2">
                                <Label htmlFor="warehouse_id" className="flex items-center gap-2 text-green-600">
                                    <Warehouse className="w-4 h-4"/>
                                    Warehouse ID
                                </Label>
                                <Input
                                    id="warehouse_id"
                                    placeholder="Warehouse ID"
                                    value={formData.warehouse_id}
                                    onChange={(e) => handleInputChange("warehouse_id", e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-start">
                            <Button type="submit"
                                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 flex items-center gap-2">
                                <Plus className="w-4 h-4"/>
                                SUBMIT INVENTORY DATA
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Detailed Inventory Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Inventory Details</CardTitle>
                    <CardDescription>Complete inventory listing with batch and expiry information</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Inventory ID</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>Warehouse</TableHead>
                                <TableHead>Available</TableHead>
                                <TableHead>Reserved</TableHead>
                                <TableHead>Expiry Date</TableHead>
                                <TableHead>Batch Number</TableHead>
                                <TableHead>Unit Cost</TableHead>
                                <TableHead>Total Value</TableHead>
                                <TableHead>Last Updated</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredInventory.map((item) => (
                                <TableRow key={item.inventory_id}>
                                    <TableCell className="font-medium">{item.inventory_id}</TableCell>
                                    <TableCell>{item.product_name}</TableCell>
                                    <TableCell>{item.warehouse_name}</TableCell>
                                    <TableCell>
                                        <span
                                            className={item.quantity_available < 1000 ? "text-red-600 font-semibold" : ""}>
                                            {item.quantity_available.toLocaleString()} tons
                                        </span>
                                    </TableCell>
                                    <TableCell>{item.quantity_reserved.toLocaleString()} tons</TableCell>
                                    <TableCell>
                                        <Badge variant={getExpiryBadgeVariant(item.expiry_date)}>
                                            {item.expiry_date}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{item.batch_number}</TableCell>
                                    <TableCell>${item.unit_cost}</TableCell>
                                    <TableCell>${(item.quantity_available * item.unit_cost).toLocaleString()}</TableCell>
                                    <TableCell>{item.last_updated}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-1">
                                            <Button variant="ghost" size="sm" className="hover:bg-blue-50">
                                                <Edit2 className="w-4 h-4 text-blue-600"/>
                                            </Button>
                                            <Button variant="ghost" size="sm" className="hover:bg-red-50"
                                                    onClick={() => handleDelete(item.inventory_id)}>
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