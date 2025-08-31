"use client"

import {useState, useEffect} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Search, Plus, Edit2, Trash2, Package} from "lucide-react"

interface Product {
    product_id: string
    name: string
    type: string
    variety: string
    sowing_time: string
    harvest_time: string
    seed_requirement_per_acre: number
}

// Helper function to safely display numbers
const safeNumber = (value: number | null | undefined, defaultValue: number = 0): number => {
    if (value === null || value === undefined || isNaN(value)) return defaultValue;
    return Number(value);
}

// Helper function to safely format numbers with decimal places
const safeNumberFormat = (value: number | null | undefined, decimals: number = 1, defaultValue: number = 0): string => {
    const num = safeNumber(value, defaultValue);
    return num.toFixed(decimals);
}

export default function ProductList() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedType, setSelectedType] = useState("all")
    const [showForm, setShowForm] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [formData, setFormData] = useState<Product>({
        product_id: "",
        name: "",
        type: "",
        variety: "",
        sowing_time: "",
        harvest_time: "",
        seed_requirement_per_acre: 0
    })

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: keyof Product, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const method = editingProduct ? 'PUT' : 'POST';
            const response = await fetch('/api/products', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            
            if (response.ok) {
                await fetchProducts();
                resetForm();
            }
        } catch (error) {
            console.error('Error saving product:', error);
        }
    }

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData(product);
        setShowForm(true);
    }

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                const response = await fetch(`/api/products?id=${id}`, {
                    method: 'DELETE',
                });
                
                if (response.ok) {
                    await fetchProducts();
                }
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    }

    const resetForm = () => {
        setFormData({
            product_id: "",
            name: "",
            type: "",
            variety: "",
            sowing_time: "",
            harvest_time: "",
            seed_requirement_per_acre: 0
        });
        setEditingProduct(null);
        setShowForm(false);
    }

    const filteredProducts = products.filter(product => {
        const matchesSearch = (product.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (product.type?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        const matchesType = selectedType === "all" || product.type === selectedType
        return matchesSearch && matchesType
    })

    const uniqueTypes = [...new Set(products.map(product => product.type).filter(Boolean))]

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground mb-2">Comprehensive Product Information</h1>
                            <p className="text-muted-foreground">Complete database of agricultural products with sowing times, harvest times, and per acre seed requirements</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="bg-green-50 p-4 rounded-xl">
                                <Package className="h-8 w-8 text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Products</h3>
                        <p className="text-3xl font-bold text-foreground">{products.length}</p>
                    </div>
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Product Types</h3>
                        <p className="text-3xl font-bold text-foreground">{uniqueTypes.length}</p>
                    </div>
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Avg Seed Req/Acre</h3>
                        <p className="text-3xl font-bold text-foreground">
                            {products.length > 0 ? 
                                safeNumber(Math.round(products.reduce((sum, p) => sum + safeNumber(p.seed_requirement_per_acre), 0) / products.length))
                                : 0}
                        </p>
                    </div>
                </div>

                {/* Controls */}
                <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-full md:w-64"
                                />
                            </div>
                            <Select value={selectedType} onValueChange={setSelectedType}>
                                <SelectTrigger className="w-full md:w-40">
                                    <SelectValue placeholder="All Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    {uniqueTypes.map(type => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Product
                        </Button>
                    </div>
                </div>

                {/* Add Product Form */}
                {showForm && (
                    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                        <h2 className="text-xl font-semibold text-foreground mb-4">
                            {editingProduct ? 'Edit Product' : 'Add New Product'}
                        </h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="product_id" className="text-foreground">Product ID *</Label>
                                <Input
                                    id="product_id"
                                    type="text"
                                    value={formData.product_id}
                                    onChange={(e) => handleInputChange("product_id", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-foreground">Product Name *</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type" className="text-foreground">Product Type *</Label>
                                <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Cereal">Cereal</SelectItem>
                                        <SelectItem value="Vegetable">Vegetable</SelectItem>
                                        <SelectItem value="Fruit">Fruit</SelectItem>
                                        <SelectItem value="Legume">Legume</SelectItem>
                                        <SelectItem value="Spice">Spice</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="variety" className="text-foreground">Variety</Label>
                                <Input
                                    id="variety"
                                    type="text"
                                    value={formData.variety}
                                    onChange={(e) => handleInputChange("variety", e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sowing_time" className="text-foreground">Sowing Time</Label>
                                <Input
                                    id="sowing_time"
                                    type="text"
                                    value={formData.sowing_time}
                                    onChange={(e) => handleInputChange("sowing_time", e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="harvest_time" className="text-foreground">Harvest Time</Label>
                                <Input
                                    id="harvest_time"
                                    type="text"
                                    value={formData.harvest_time}
                                    onChange={(e) => handleInputChange("harvest_time", e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="seed_requirement_per_acre" className="text-foreground">Seed Requirement (per acre)</Label>
                                <Input
                                    id="seed_requirement_per_acre"
                                    type="number"
                                    step="0.1"
                                    value={formData.seed_requirement_per_acre}
                                    onChange={(e) => handleInputChange("seed_requirement_per_acre", parseFloat(e.target.value) || 0)}
                                />
                            </div>

                            <div className="md:col-span-2 flex gap-4">
                                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                                    {editingProduct ? 'Update Product' : 'Add Product'}
                                </Button>
                                <Button type="button" variant="outline" onClick={resetForm}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Products Table */}
                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-border">
                        <h2 className="text-xl font-semibold text-foreground">Products ({filteredProducts.length})</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead className="font-semibold text-foreground">Product ID</TableHead>
                                    <TableHead className="font-semibold text-foreground">Name</TableHead>
                                    <TableHead className="font-semibold text-foreground">Type</TableHead>
                                    <TableHead className="font-semibold text-foreground">Variety</TableHead>
                                    <TableHead className="font-semibold text-foreground">Sowing Time</TableHead>
                                    <TableHead className="font-semibold text-foreground">Harvest Time</TableHead>
                                    <TableHead className="font-semibold text-foreground">Seed Req/Acre</TableHead>
                                    <TableHead className="font-semibold text-foreground">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProducts.map((product) => (
                                    <TableRow key={product.product_id} className="hover:bg-gray-50">
                                        <TableCell className="font-medium">{product.product_id}</TableCell>
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                {product.type}
                                            </span>
                                        </TableCell>
                                        <TableCell>{product.variety || "N/A"}</TableCell>
                                        <TableCell>{product.sowing_time || "N/A"}</TableCell>
                                        <TableCell>{product.harvest_time || "N/A"}</TableCell>
                                        <TableCell>{safeNumberFormat(product.seed_requirement_per_acre, 1)} kg</TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                                    onClick={() => handleEdit(product)}
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                                    onClick={() => handleDelete(product.product_id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    )
}
