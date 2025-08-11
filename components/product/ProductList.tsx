"use client"

import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Search, Plus, Edit2, Trash2, Package, Leaf, BarChart3, FileDown} from "lucide-react"
import {exportProductData} from "@/lib/pdfExport"

interface Product {
    id: string
    product_id: string
    product_name: string
    product_type: string
    product_type_alt: string
    variety: string
    sowing_time: string
    transplanting_time: string
    harvest_time: string
    seed_requirement_per_acre: number
    nutritional_value_per_unit: number
    storage_requirements: string
}

export default function ProductList() {
    const [products, setProducts] = useState<Product[]>([
        {
            id: Date.now().toString(),
            product_id: "P001",
            product_name: "Wheat",
            product_type: "Grain",
            product_type_alt: "Cereal",
            variety: "Winter Wheat",
            sowing_time: "2024-10-15",
            transplanting_time: "",
            harvest_time: "2024-04-15",
            seed_requirement_per_acre: 45,
            nutritional_value_per_unit: 364,
            storage_requirements: "Cool, dry place below 15°C"
        },
        {
            id: (Date.now() + 1).toString(),
            product_id: "P002",
            product_name: "Rice",
            product_type: "Grain",
            product_type_alt: "Cereal",
            variety: "Basmati",
            sowing_time: "2024-06-15",
            transplanting_time: "2024-07-15",
            harvest_time: "2024-11-15",
            seed_requirement_per_acre: 22.5,
            nutritional_value_per_unit: 130,
            storage_requirements: "Airtight containers, moisture <14%"
        },
        {
            id: (Date.now() + 2).toString(),
            product_id: "P003",
            product_name: "Corn",
            product_type: "Grain",
            product_type_alt: "Cereal",
            variety: "Sweet Corn",
            sowing_time: "2024-03-15",
            transplanting_time: "",
            harvest_time: "2024-07-15",
            seed_requirement_per_acre: 17.5,
            nutritional_value_per_unit: 86,
            storage_requirements: "Refrigerated at 0-2°C"
        },
        {
            id: (Date.now() + 3).toString(),
            product_id: "P004",
            product_name: "Tomato",
            product_type: "Vegetable",
            product_type_alt: "Fruit Vegetable",
            variety: "Cherry Tomato",
            sowing_time: "2024-02-15",
            transplanting_time: "2024-03-15",
            harvest_time: "2024-06-15",
            seed_requirement_per_acre: 0.5,
            nutritional_value_per_unit: 18,
            storage_requirements: "Store at 12-15°C"
        }
    ])
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedType, setSelectedType] = useState("all")
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState<Omit<Product, "id">>({
        product_id: "",
        product_name: "",
        product_type: "",
        product_type_alt: "",
        variety: "",
        sowing_time: "",
        transplanting_time: "",
        harvest_time: "",
        seed_requirement_per_acre: 0,
        nutritional_value_per_unit: 0,
        storage_requirements: ""
    })

    const handleInputChange = (field: keyof Omit<Product, "id">, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const newProduct: Product = {
            ...formData,
            id: Date.now().toString()
        }
        setProducts([...products, newProduct])
        setFormData({
            product_id: "",
            product_name: "",
            product_type: "",
            product_type_alt: "",
            variety: "",
            sowing_time: "",
            transplanting_time: "",
            harvest_time: "",
            seed_requirement_per_acre: 0,
            nutritional_value_per_unit: 0,
            storage_requirements: ""
        })
        setShowForm(false)
    }

    const handleDelete = (id: string) => {
        setProducts(products.filter(product => product.id !== id))
    }

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.product_type.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesType = selectedType === "all" || product.product_type === selectedType
        return matchesSearch && matchesType
    })

    const uniqueTypes = [...new Set(products.map(product => product.product_type))]

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Clean Header */}
                <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-green-100 p-3 rounded-xl border border-green-200">
                                <Package className="h-8 w-8 text-green-600"/>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
                                <p className="text-gray-600 mt-1">Manage agricultural products and their
                                    specifications</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Button
                                onClick={() => setShowForm(!showForm)}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
                            >
                                <Plus className="h-4 w-4 mr-2"/>
                                Add Product
                            </Button>
                            <Button
                                onClick={() => exportProductData(products as unknown as Record<string, unknown>[])}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
                            >
                                <FileDown className="h-4 w-4 mr-2"/>
                                Export Data
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <Package className="h-5 w-5 text-blue-600"/>
                            </div>
                            <span className="text-2xl font-bold text-gray-900">{products.length}</span>
                        </div>
                        <h3 className="font-medium text-gray-900">Total Products</h3>
                        <p className="text-sm text-gray-500">Across all categories</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-purple-100 p-2 rounded-lg">
                                <BarChart3 className="h-5 w-5 text-purple-600"/>
                            </div>
                            <span className="text-2xl font-bold text-gray-900">{uniqueTypes.length}</span>
                        </div>
                        <h3 className="font-medium text-gray-900">Product Types</h3>
                        <p className="text-sm text-gray-500">Different categories</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-orange-100 p-2 rounded-lg">
                                <Leaf className="h-5 w-5 text-orange-600"/>
                            </div>
                            <span className="text-2xl font-bold text-gray-900">
                                {Math.round(products.reduce((sum, p) => sum + p.nutritional_value_per_unit, 0) / products.length)}
                            </span>
                        </div>
                        <h3 className="font-medium text-gray-900">Avg Nutrition</h3>
                        <p className="text-sm text-gray-500">Calories per unit</p>
                    </div>
                </div>

                {/* Add Product Form */}
                {showForm && (
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">Add New Product</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Information */}
                            <div>
                                <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="product_id" className="text-gray-700">Product ID *</Label>
                                        <Input
                                            id="product_id"
                                            placeholder="e.g., P005"
                                            value={formData.product_id}
                                            onChange={(e) => handleInputChange("product_id", e.target.value)}
                                            className="mt-1"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="product_name" className="text-gray-700">Product Name *</Label>
                                        <Input
                                            id="product_name"
                                            placeholder="e.g., Wheat"
                                            value={formData.product_name}
                                            onChange={(e) => handleInputChange("product_name", e.target.value)}
                                            className="mt-1"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="product_type" className="text-gray-700">Product Type *</Label>
                                        <Select value={formData.product_type}
                                                onValueChange={(value) => handleInputChange("product_type", value)}>
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="Select type"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Grain">Grain</SelectItem>
                                                <SelectItem value="Vegetable">Vegetable</SelectItem>
                                                <SelectItem value="Fruit">Fruit</SelectItem>
                                                <SelectItem value="Legume">Legume</SelectItem>
                                                <SelectItem value="Spice">Spice</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="product_type_alt" className="text-gray-700">Alternative
                                            Type</Label>
                                        <Input
                                            id="product_type_alt"
                                            placeholder="e.g., Cereal"
                                            value={formData.product_type_alt}
                                            onChange={(e) => handleInputChange("product_type_alt", e.target.value)}
                                            className="mt-1"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="variety" className="text-gray-700">Variety *</Label>
                                        <Input
                                            id="variety"
                                            placeholder="e.g., Winter Wheat"
                                            value={formData.variety}
                                            onChange={(e) => handleInputChange("variety", e.target.value)}
                                            className="mt-1"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Cultivation Timing */}
                            <div>
                                <h4 className="text-lg font-medium text-gray-900 mb-4">Cultivation Timing</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="sowing_time" className="text-gray-700">Sowing Time *</Label>
                                        <Input
                                            id="sowing_time"
                                            type="date"
                                            value={formData.sowing_time}
                                            onChange={(e) => handleInputChange("sowing_time", e.target.value)}
                                            className="mt-1"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="transplanting_time" className="text-gray-700">Transplanting
                                            Time</Label>
                                        <Input
                                            id="transplanting_time"
                                            type="date"
                                            value={formData.transplanting_time}
                                            onChange={(e) => handleInputChange("transplanting_time", e.target.value)}
                                            className="mt-1"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Leave empty if not applicable</p>
                                    </div>

                                    <div>
                                        <Label htmlFor="harvest_time" className="text-gray-700">Harvest Time *</Label>
                                        <Input
                                            id="harvest_time"
                                            type="date"
                                            value={formData.harvest_time}
                                            onChange={(e) => handleInputChange("harvest_time", e.target.value)}
                                            className="mt-1"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Agricultural Details */}
                            <div>
                                <h4 className="text-lg font-medium text-gray-900 mb-4">Agricultural Details</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="seed_requirement_per_acre" className="text-gray-700">Seed
                                            Requirement (kg/acre) *</Label>
                                        <Input
                                            id="seed_requirement_per_acre"
                                            type="number"
                                            step="0.1"
                                            placeholder="e.g., 45"
                                            value={formData.seed_requirement_per_acre}
                                            onChange={(e) => handleInputChange("seed_requirement_per_acre", parseFloat(e.target.value) || 0)}
                                            className="mt-1"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="nutritional_value_per_unit" className="text-gray-700">Nutritional
                                            Value (kcal/100g) *</Label>
                                        <Input
                                            id="nutritional_value_per_unit"
                                            type="number"
                                            placeholder="e.g., 364"
                                            value={formData.nutritional_value_per_unit}
                                            onChange={(e) => handleInputChange("nutritional_value_per_unit", parseInt(e.target.value) || 0)}
                                            className="mt-1"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Storage Requirements */}
                            <div>
                                <h4 className="text-lg font-medium text-gray-900 mb-4">Storage Information</h4>
                                <div>
                                    <Label htmlFor="storage_requirements" className="text-gray-700">Storage Requirements
                                        *</Label>
                                    <Input
                                        id="storage_requirements"
                                        placeholder="e.g., Cool, dry place below 15°C"
                                        value={formData.storage_requirements}
                                        onChange={(e) => handleInputChange("storage_requirements", e.target.value)}
                                        className="mt-1"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Describe optimal storage conditions</p>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-gray-200">
                                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                                    <Plus className="h-4 w-4 mr-2"/>
                                    Add Product
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Products Table */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Product Directory</h3>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                                <Input
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            {uniqueTypes.length > 0 && (
                                <Select value={selectedType} onValueChange={setSelectedType}>
                                    <SelectTrigger className="w-48">
                                        <SelectValue placeholder="All Types"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        {uniqueTypes.map((type) => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
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
                                    <TableHead>Type</TableHead>
                                    <TableHead>Variety</TableHead>
                                    <TableHead>Time of Sowing</TableHead>
                                    <TableHead>Nutrition</TableHead>
                                    <TableHead>Seed Req.</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProducts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                            <Package className="h-8 w-8 mx-auto mb-2 text-gray-400"/>
                                            No products found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <TableRow key={product.id} className="hover:bg-gray-50">
                                            <TableCell className="font-mono text-sm">{product.product_id}</TableCell>
                                            <TableCell className="font-medium">{product.product_name}</TableCell>
                                            <TableCell>
                                                <span
                                                    className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                                    {product.product_type}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-gray-600">{product.variety}</TableCell>
                                            <TableCell className="text-gray-600">{product.sowing_time}</TableCell>
                                            <TableCell>
                                                <span
                                                    className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                                    {product.nutritional_value_per_unit} kcal
                                                </span>
                                            </TableCell>
                                            <TableCell
                                                className="text-gray-600">{product.seed_requirement_per_acre} kg/acre</TableCell>
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
                                                        onClick={() => handleDelete(product.id)}
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
            </div>
        </div>
    )
}