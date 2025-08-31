"use client"

import {useState, useEffect} from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Badge} from "@/components/ui/badge"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Search, Plus, Edit2, Trash2, Factory, TrendingUp} from "lucide-react"

interface Production {
    production_id: string
    product_id: string
    district_id: number
    date: string
    acreage: number
    quantity_produced: number
    product_name?: string
    district_name?: string
}

interface Product {
    product_id: string
    name: string
}

interface District {
    district_id: number
    name: string
}

export default function ProductionManagement() {
    const [productions, setProductions] = useState<Production[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [districts, setDistricts] = useState<District[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [showForm, setShowForm] = useState(false)
    const [editingProduction, setEditingProduction] = useState<Production | null>(null)
    const [formData, setFormData] = useState<Production>({
        production_id: "",
        product_id: "",
        district_id: 0,
        date: "",
        acreage: 0,
        quantity_produced: 0
    })

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [productionsRes, productsRes, districtsRes] = await Promise.all([
                fetch('/api/production'),
                fetch('/api/products'),
                fetch('/api/districts')
            ]);
            
            const productionsData = await productionsRes.json();
            const productsData = await productsRes.json();
            const districtsData = await districtsRes.json();
            
            setProductions(productionsData);
            setProducts(productsData);
            setDistricts(districtsData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: keyof Production, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const method = editingProduction ? 'PUT' : 'POST';
            const response = await fetch('/api/production', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            
            if (response.ok) {
                await fetchData();
                resetForm();
            }
        } catch (error) {
            console.error('Error saving production:', error);
        }
    }

    const handleEdit = (production: Production) => {
        setEditingProduction(production);
        setFormData(production);
        setShowForm(true);
    }

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this production record?')) {
            try {
                const response = await fetch(`/api/production?id=${id}`, {
                    method: 'DELETE',
                });
                
                if (response.ok) {
                    await fetchData();
                }
            } catch (error) {
                console.error('Error deleting production:', error);
            }
        }
    }

    const resetForm = () => {
        setFormData({
            production_id: "",
            product_id: "",
            district_id: 0,
            date: "",
            acreage: 0,
            quantity_produced: 0
        });
        setEditingProduction(null);
        setShowForm(false);
    }

    const filteredProductions = productions.filter(production => {
        const matchesSearch = (production.product_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (production.district_name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        return matchesSearch
    })

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
                            <h1 className="text-3xl font-bold text-foreground mb-2">Production History by District</h1>
                            <p className="text-muted-foreground">Historical production data showing acreage and quantity produced by district/division</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="bg-green-50 p-4 rounded-xl">
                                <Factory className="h-8 w-8 text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Total Records</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">{productions.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Total Acreage</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">
                                {productions.reduce((sum, p) => sum + (p.acreage || 0), 0).toLocaleString()}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Total Production</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">
                                {productions.reduce((sum, p) => sum + (p.quantity_produced || 0), 0).toLocaleString()} kg
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Controls */}
                <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Search productions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-full md:w-64"
                            />
                        </div>
                        <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Production
                        </Button>
                    </div>
                </div>

                {/* Add/Edit Form */}
                {showForm && (
                    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                        <h2 className="text-xl font-semibold text-foreground mb-4">
                            {editingProduction ? 'Edit Production' : 'Add New Production'}
                        </h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="production_id">Production ID *</Label>
                                <Input
                                    id="production_id"
                                    value={formData.production_id}
                                    onChange={(e) => handleInputChange("production_id", e.target.value)}
                                    required
                                    disabled={!!editingProduction}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="product_id">Product *</Label>
                                <Select value={formData.product_id} onValueChange={(value) => handleInputChange("product_id", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select product" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {products.map(product => (
                                            <SelectItem key={product.product_id} value={product.product_id}>
                                                {product.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="district_id">District *</Label>
                                <Select value={formData.district_id.toString()} onValueChange={(value) => handleInputChange("district_id", parseInt(value))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select district" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {districts.map(district => (
                                            <SelectItem key={district.district_id} value={district.district_id.toString()}>
                                                {district.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="date">Date *</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => handleInputChange("date", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="acreage">Acreage</Label>
                                <Input
                                    id="acreage"
                                    type="number"
                                    value={formData.acreage}
                                    onChange={(e) => handleInputChange("acreage", parseInt(e.target.value) || 0)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="quantity_produced">Quantity Produced (kg)</Label>
                                <Input
                                    id="quantity_produced"
                                    type="number"
                                    value={formData.quantity_produced}
                                    onChange={(e) => handleInputChange("quantity_produced", parseInt(e.target.value) || 0)}
                                />
                            </div>

                            <div className="md:col-span-2 flex gap-4">
                                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                                    {editingProduction ? 'Update Production' : 'Add Production'}
                                </Button>
                                <Button type="button" variant="outline" onClick={resetForm}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Productions Table */}
                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-border">
                        <h2 className="text-xl font-semibold text-foreground">
                            Production Records ({filteredProductions.length})
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead>Production ID</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead>District</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Acreage</TableHead>
                                    <TableHead>Quantity (kg)</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProductions.map((production) => (
                                    <TableRow key={production.production_id} className="hover:bg-gray-50">
                                        <TableCell className="font-medium">{production.production_id}</TableCell>
                                        <TableCell>{production.product_name || production.product_id}</TableCell>
                                        <TableCell>{production.district_name || production.district_id}</TableCell>
                                        <TableCell>{new Date(production.date).toLocaleDateString()}</TableCell>
                                        <TableCell>{(production.acreage || 0).toLocaleString()}</TableCell>
                                        <TableCell>{(production.quantity_produced || 0).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                                    onClick={() => handleEdit(production)}
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                                    onClick={() => handleDelete(production.production_id)}
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
