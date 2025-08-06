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
    Search,
    Plus,
    Edit2,
    Trash2,
    Truck,
    Activity,
    Target,
    TrendingUp,
    Calendar,
    Package,
    MapPin,
    User
} from "lucide-react"

interface Shipment {
    shipment_id: string
    sender_stakeholder_id: string
    sender_name: string
    receiver_stakeholder_id: string
    receiver_name: string
    product_id: string
    product_name: string
    source_warehouse_id: string
    destination_warehouse_id: string | null
    shipment_date: string
    expected_delivery_date: string
    actual_delivery_date: string | null
    quantity_shipped: number
    shipping_cost: number
    shipment_status: "Pending" | "In Transit" | "Delivered" | "Delayed"
    transport_mode: string
}

const shipments: Shipment[] = [
    {
        shipment_id: "SH001",
        sender_stakeholder_id: "S001",
        sender_name: "Ahmed Farms",
        receiver_stakeholder_id: "S003",
        receiver_name: "Grain Wholesale Co",
        product_id: "P001",
        product_name: "Wheat",
        source_warehouse_id: "WH002",
        destination_warehouse_id: "WH001",
        shipment_date: "2024-01-10",
        expected_delivery_date: "2024-01-12",
        actual_delivery_date: "2024-01-12",
        quantity_shipped: 500,
        shipping_cost: 2500,
        shipment_status: "Delivered",
        transport_mode: "Truck"
    },
    {
        shipment_id: "SH002",
        sender_stakeholder_id: "S003",
        sender_name: "Grain Wholesale Co",
        receiver_stakeholder_id: "S002",
        receiver_name: "City Retail Store",
        product_id: "P002",
        product_name: "Rice",
        source_warehouse_id: "WH001",
        destination_warehouse_id: null,
        shipment_date: "2024-01-14",
        expected_delivery_date: "2024-01-16",
        actual_delivery_date: null,
        quantity_shipped: 200,
        shipping_cost: 1800,
        shipment_status: "In Transit",
        transport_mode: "Truck"
    },
    {
        shipment_id: "SH003",
        sender_stakeholder_id: "S001",
        sender_name: "Ahmed Farms",
        receiver_stakeholder_id: "S002",
        receiver_name: "City Retail Store",
        product_id: "P003",
        product_name: "Corn",
        source_warehouse_id: "WH002",
        destination_warehouse_id: null,
        shipment_date: "2024-01-16",
        expected_delivery_date: "2024-01-18",
        actual_delivery_date: null,
        quantity_shipped: 300,
        shipping_cost: 2100,
        shipment_status: "Delayed",
        transport_mode: "Truck"
    },
    {
        shipment_id: "SH004",
        sender_stakeholder_id: "S003",
        sender_name: "Grain Wholesale Co",
        receiver_stakeholder_id: "S004",
        receiver_name: "Rahman Family",
        product_id: "P001",
        product_name: "Wheat",
        source_warehouse_id: "WH001",
        destination_warehouse_id: null,
        shipment_date: "2024-01-20",
        expected_delivery_date: "2024-01-22",
        actual_delivery_date: null,
        quantity_shipped: 50,
        shipping_cost: 450,
        shipment_status: "Pending",
        transport_mode: "Van"
    }
]

export default function ShipmentTracking() {
    const [searchTerm, setSearchTerm] = useState("")
    const [shipmentData, setShipmentData] = useState<Shipment[]>(shipments)

    // Form state
    const [formData, setFormData] = useState({
        shipment_id: "",
        sender_stakeholder_id: "",
        sender_name: "",
        receiver_stakeholder_id: "",
        receiver_name: "",
        product_id: "",
        product_name: "",
        source_warehouse_id: "",
        destination_warehouse_id: "",
        shipment_date: "",
        expected_delivery_date: "",
        quantity_shipped: "",
        shipping_cost: "",
        shipment_status: "" as "Pending" | "In Transit" | "Delivered" | "Delayed" | "",
        transport_mode: ""
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
        if (!formData.shipment_id || !formData.sender_name || !formData.receiver_name || !formData.product_name || !formData.quantity_shipped) {
            alert("Please fill in all required fields")
            return
        }

        // Create new shipment
        const newShipment: Shipment = {
            shipment_id: formData.shipment_id,
            sender_stakeholder_id: formData.sender_stakeholder_id,
            sender_name: formData.sender_name,
            receiver_stakeholder_id: formData.receiver_stakeholder_id,
            receiver_name: formData.receiver_name,
            product_id: formData.product_id || `P${String(shipmentData.length + 1).padStart(3, '0')}`,
            product_name: formData.product_name,
            source_warehouse_id: formData.source_warehouse_id,
            destination_warehouse_id: formData.destination_warehouse_id || null,
            shipment_date: formData.shipment_date || new Date().toISOString().split('T')[0],
            expected_delivery_date: formData.expected_delivery_date,
            actual_delivery_date: null,
            quantity_shipped: parseFloat(formData.quantity_shipped) || 0,
            shipping_cost: parseFloat(formData.shipping_cost) || 0,
            shipment_status: (formData.shipment_status as "Pending" | "In Transit" | "Delivered" | "Delayed") || "Pending",
            transport_mode: formData.transport_mode
        }

        setShipmentData(prev => [...prev, newShipment])

        // Reset form
        setFormData({
            shipment_id: "",
            sender_stakeholder_id: "",
            sender_name: "",
            receiver_stakeholder_id: "",
            receiver_name: "",
            product_id: "",
            product_name: "",
            source_warehouse_id: "",
            destination_warehouse_id: "",
            shipment_date: "",
            expected_delivery_date: "",
            quantity_shipped: "",
            shipping_cost: "",
            shipment_status: "",
            transport_mode: ""
        })

        alert("Shipment data submitted successfully!")
    }

    const handleDelete = (shipmentId: string) => {
        if (confirm("Are you sure you want to delete this shipment?")) {
            setShipmentData(prev => prev.filter(shipment => shipment.shipment_id !== shipmentId))
        }
    }

    const filteredShipments = shipmentData.filter(shipment =>
        shipment.shipment_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.sender_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.receiver_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.shipment_status.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Delivered":
                return "default"
            case "In Transit":
                return "secondary"
            case "Pending":
                return "outline"
            case "Delayed":
                return "destructive"
            default:
                return "outline"
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Shipment Tracking</h1>
                    <p className="mt-2 text-gray-600">Track product shipments and deliveries</p>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                        <Input
                            type="search"
                            placeholder="Search shipments..."
                            className="pl-10 w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button>
                        <Plus className="w-4 h-4 mr-2"/>
                        Create Shipment
                    </Button>
                </div>
            </div>

            {/* Shipment Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
                        <Truck className="h-4 w-4 text-blue-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{shipmentData.length}</div>
                        <p className="text-xs text-gray-600">All shipments</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">In Transit</CardTitle>
                        <Activity className="h-4 w-4 text-orange-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {shipmentData.filter(s => s.shipment_status === "In Transit").length}
                        </div>
                        <p className="text-xs text-gray-600">Active shipments</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                        <Target className="h-4 w-4 text-green-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {shipmentData.filter(s => s.shipment_status === "Delivered").length}
                        </div>
                        <p className="text-xs text-gray-600">Completed shipments</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
                        <TrendingUp className="h-4 w-4 text-purple-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${shipmentData.reduce((sum, s) => sum + s.shipping_cost, 0).toLocaleString()}
                        </div>
                        <p className="text-xs text-gray-600">Shipping costs</p>
                    </CardContent>
                </Card>
            </div>

            {/* Shipment Status Overview */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Shipment Status Distribution</CardTitle>
                        <CardDescription>Current status of all shipments</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {["Pending", "In Transit", "Delivered", "Delayed"].map((status) => {
                                const count = shipmentData.filter(s => s.shipment_status === status).length
                                const percentage = (count / shipmentData.length) * 100
                                return (
                                    <div key={status} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-4 h-4 rounded ${
                                                status === "Delivered" ? "bg-green-500" :
                                                    status === "In Transit" ? "bg-blue-500" :
                                                        status === "Pending" ? "bg-yellow-500" : "bg-red-500"
                                            }`}></div>
                                            <span className="text-sm font-medium">{status}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-600">{count} shipments</span>
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
                        <CardTitle>Transport Mode Analysis</CardTitle>
                        <CardDescription>Distribution by transport method</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {Array.from(new Set(shipmentData.map(s => s.transport_mode))).map((mode) => {
                                const count = shipmentData.filter(s => s.transport_mode === mode).length
                                const avgCost = shipmentData.filter(s => s.transport_mode === mode)
                                    .reduce((sum, s) => sum + s.shipping_cost, 0) / count
                                const percentage = (count / shipmentData.length) * 100
                                return (
                                    <div key={mode} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <Truck className="w-4 h-4 text-blue-500"/>
                                                <span className="text-sm font-medium">{mode}</span>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <span className="text-sm text-gray-600">{count} shipments</span>
                                                <span
                                                    className="text-sm text-gray-600">Avg: ${avgCost.toFixed(0)}</span>
                                                <Badge variant="outline">{percentage.toFixed(0)}%</Badge>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Delivery Performance */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Delivery Performance Insights</CardTitle>
                    <CardDescription>Shipment performance metrics and trends</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <h4 className="font-semibold text-green-800 mb-2">On-Time Delivery Rate</h4>
                            <p className="text-sm text-green-700">
                                {(shipmentData.filter(s => s.shipment_status === "Delivered").length /
                                    shipmentData.filter(s => s.shipment_status !== "Pending").length * 100).toFixed(1)}%
                                of non-pending shipments delivered successfully
                            </p>
                        </div>

                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h4 className="font-semibold text-blue-800 mb-2">Average Shipping Cost</h4>
                            <p className="text-sm text-blue-700">
                                ${(shipmentData.reduce((sum, s) => sum + s.shipping_cost, 0) / shipmentData.length).toFixed(2)}
                                per shipment across all transport modes
                            </p>
                        </div>

                        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                            <h4 className="font-semibold text-orange-800 mb-2">Active Routes</h4>
                            <p className="text-sm text-orange-700">
                                {shipmentData.filter(s => s.shipment_status === "In Transit" || s.shipment_status === "Pending").length}
                                shipments currently in progress or awaiting dispatch
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Shipment Data Entry Form */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Submit Shipment Data</CardTitle>
                    <CardDescription>Enter new shipment information</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Form Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Shipment ID */}
                            <div className="space-y-2">
                                <Label htmlFor="shipment_id" className="flex items-center gap-2 text-blue-600">
                                    <Truck className="w-4 h-4"/>
                                    Shipment ID
                                </Label>
                                <Input
                                    id="shipment_id"
                                    placeholder="Enter shipment ID"
                                    value={formData.shipment_id}
                                    onChange={(e) => handleInputChange("shipment_id", e.target.value)}
                                    required
                                />
                            </div>

                            {/* Sender Name */}
                            <div className="space-y-2">
                                <Label htmlFor="sender_name" className="flex items-center gap-2 text-blue-600">
                                    <User className="w-4 h-4"/>
                                    Sender Name
                                </Label>
                                <Select value={formData.sender_name}
                                        onValueChange={(value) => handleInputChange("sender_name", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select sender"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Ahmed Farms">Ahmed Farms</SelectItem>
                                        <SelectItem value="Grain Wholesale Co">Grain Wholesale Co</SelectItem>
                                        <SelectItem value="City Retail Store">City Retail Store</SelectItem>
                                        <SelectItem value="Rahman Family">Rahman Family</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Receiver Name */}
                            <div className="space-y-2">
                                <Label htmlFor="receiver_name" className="flex items-center gap-2 text-blue-600">
                                    <User className="w-4 h-4"/>
                                    Receiver Name
                                </Label>
                                <Select value={formData.receiver_name}
                                        onValueChange={(value) => handleInputChange("receiver_name", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select receiver"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Ahmed Farms">Ahmed Farms</SelectItem>
                                        <SelectItem value="Grain Wholesale Co">Grain Wholesale Co</SelectItem>
                                        <SelectItem value="City Retail Store">City Retail Store</SelectItem>
                                        <SelectItem value="Rahman Family">Rahman Family</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Product Name */}
                            <div className="space-y-2">
                                <Label htmlFor="product_name" className="flex items-center gap-2 text-blue-600">
                                    <Package className="w-4 h-4"/>
                                    Product Name
                                </Label>
                                <Select value={formData.product_name}
                                        onValueChange={(value) => handleInputChange("product_name", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select product"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Wheat">Wheat</SelectItem>
                                        <SelectItem value="Rice">Rice</SelectItem>
                                        <SelectItem value="Corn">Corn</SelectItem>
                                        <SelectItem value="Soybeans">Soybeans</SelectItem>
                                        <SelectItem value="Barley">Barley</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Quantity Shipped */}
                            <div className="space-y-2">
                                <Label htmlFor="quantity_shipped" className="flex items-center gap-2 text-blue-600">
                                    <Activity className="w-4 h-4"/>
                                    Quantity Shipped (tons)
                                </Label>
                                <Input
                                    id="quantity_shipped"
                                    type="number"
                                    placeholder="Quantity shipped"
                                    value={formData.quantity_shipped}
                                    onChange={(e) => handleInputChange("quantity_shipped", e.target.value)}
                                    required
                                />
                            </div>

                            {/* Shipping Cost */}
                            <div className="space-y-2">
                                <Label htmlFor="shipping_cost" className="flex items-center gap-2 text-blue-600">
                                    <TrendingUp className="w-4 h-4"/>
                                    Shipping Cost ($)
                                </Label>
                                <Input
                                    id="shipping_cost"
                                    type="number"
                                    step="0.01"
                                    placeholder="Shipping cost"
                                    value={formData.shipping_cost}
                                    onChange={(e) => handleInputChange("shipping_cost", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Shipment Date */}
                            <div className="space-y-2">
                                <Label htmlFor="shipment_date" className="flex items-center gap-2 text-blue-600">
                                    <Calendar className="w-4 h-4"/>
                                    Shipment Date
                                </Label>
                                <Input
                                    id="shipment_date"
                                    type="date"
                                    value={formData.shipment_date}
                                    onChange={(e) => handleInputChange("shipment_date", e.target.value)}
                                />
                            </div>

                            {/* Expected Delivery Date */}
                            <div className="space-y-2">
                                <Label htmlFor="expected_delivery_date"
                                       className="flex items-center gap-2 text-blue-600">
                                    <Target className="w-4 h-4"/>
                                    Expected Delivery
                                </Label>
                                <Input
                                    id="expected_delivery_date"
                                    type="date"
                                    value={formData.expected_delivery_date}
                                    onChange={(e) => handleInputChange("expected_delivery_date", e.target.value)}
                                />
                            </div>

                            {/* Shipment Status */}
                            <div className="space-y-2">
                                <Label htmlFor="shipment_status" className="flex items-center gap-2 text-blue-600">
                                    <Activity className="w-4 h-4"/>
                                    Shipment Status
                                </Label>
                                <Select value={formData.shipment_status}
                                        onValueChange={(value) => handleInputChange("shipment_status", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="In Transit">In Transit</SelectItem>
                                        <SelectItem value="Delivered">Delivered</SelectItem>
                                        <SelectItem value="Delayed">Delayed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Transport Mode */}
                            <div className="space-y-2">
                                <Label htmlFor="transport_mode" className="flex items-center gap-2 text-blue-600">
                                    <Truck className="w-4 h-4"/>
                                    Transport Mode
                                </Label>
                                <Select value={formData.transport_mode}
                                        onValueChange={(value) => handleInputChange("transport_mode", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select mode"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Truck">Truck</SelectItem>
                                        <SelectItem value="Van">Van</SelectItem>
                                        <SelectItem value="Train">Train</SelectItem>
                                        <SelectItem value="Ship">Ship</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                            {/* Source Warehouse ID */}
                            <div className="space-y-2">
                                <Label htmlFor="source_warehouse_id" className="flex items-center gap-2 text-blue-600">
                                    <MapPin className="w-4 h-4"/>
                                    Source Warehouse ID
                                </Label>
                                <Input
                                    id="source_warehouse_id"
                                    placeholder="Source warehouse ID"
                                    value={formData.source_warehouse_id}
                                    onChange={(e) => handleInputChange("source_warehouse_id", e.target.value)}
                                />
                            </div>

                            {/* Destination Warehouse ID */}
                            <div className="space-y-2">
                                <Label htmlFor="destination_warehouse_id"
                                       className="flex items-center gap-2 text-blue-600">
                                    <Target className="w-4 h-4"/>
                                    Destination Warehouse ID
                                </Label>
                                <Input
                                    id="destination_warehouse_id"
                                    placeholder="Destination warehouse ID"
                                    value={formData.destination_warehouse_id}
                                    onChange={(e) => handleInputChange("destination_warehouse_id", e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-start">
                            <Button type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 flex items-center gap-2">
                                <Plus className="w-4 h-4"/>
                                SUBMIT SHIPMENT DATA
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Detailed Shipment Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Shipment Records</CardTitle>
                    <CardDescription>Complete shipment tracking with status and delivery information</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Shipment ID</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>From</TableHead>
                                <TableHead>To</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Ship Date</TableHead>
                                <TableHead>Expected</TableHead>
                                <TableHead>Actual</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Cost</TableHead>
                                <TableHead>Mode</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredShipments.map((shipment) => (
                                <TableRow key={shipment.shipment_id}>
                                    <TableCell className="font-medium">{shipment.shipment_id}</TableCell>
                                    <TableCell>{shipment.product_name}</TableCell>
                                    <TableCell>{shipment.sender_name}</TableCell>
                                    <TableCell>{shipment.receiver_name}</TableCell>
                                    <TableCell>{shipment.quantity_shipped} tons</TableCell>
                                    <TableCell>{shipment.shipment_date}</TableCell>
                                    <TableCell>{shipment.expected_delivery_date}</TableCell>
                                    <TableCell>
                                        {shipment.actual_delivery_date || (
                                            <span className="text-gray-400">Pending</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusColor(shipment.shipment_status)}>
                                            {shipment.shipment_status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>${shipment.shipping_cost.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-1">
                                            <Truck className="w-3 h-3"/>
                                            <span className="text-sm">{shipment.transport_mode}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-1">
                                            <Button variant="ghost" size="sm" className="hover:bg-blue-50">
                                                <Edit2 className="w-4 h-4 text-blue-600"/>
                                            </Button>
                                            <Button variant="ghost" size="sm" className="hover:bg-red-50"
                                                    onClick={() => handleDelete(shipment.shipment_id)}>
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