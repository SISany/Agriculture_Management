"use client"

import React, {useState, useEffect} from "react"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Badge} from "@/components/ui/badge"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    BarChart,
    Bar,
    Tooltip,
    Legend
} from "recharts"
import {
    Search,
    Download,
    Plus,
    Edit2,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Calendar,
    MapPin
} from "lucide-react"

interface Price {
    price_id?: number
    product_id: string
    district_id: number
    date: string
    price_per_unit: number
    price_type?: string
    product_name?: string
    district_name?: string
}

interface Product {
    product_id: string
    name: string
    harvest_time: string
}

interface District {
    district_id: number
    name: string
}

// Helper function to safely format numbers
const safeNumberFormat = (value: number | null | undefined, decimals: number = 2): string => {
    const num = Number(value || 0);
    if (isNaN(num)) return '0.00';
    return num.toFixed(decimals);
}

export default function PriceAnalytics() {
    const [prices, setPrices] = useState<Price[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [districts, setDistricts] = useState<District[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedProduct, setSelectedProduct] = useState("all")
    const [selectedDistrict, setSelectedDistrict] = useState("all")
    const [showForm, setShowForm] = useState(false)
    const [editingPrice, setEditingPrice] = useState<Price | null>(null)
    const [formData, setFormData] = useState<Price>({
        product_id: "",
        district_id: 0,
        date: "",
        price_per_unit: 0,
        price_type: "retail"
    })

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [pricesRes, productsRes, districtsRes] = await Promise.all([
                fetch('/api/prices'),
                fetch('/api/products'),
                fetch('/api/districts')
            ]);
            
            const pricesData = await pricesRes.json();
            const productsData = await productsRes.json();
            const districtsData = await districtsRes.json();
            
            setPrices(pricesData);
            setProducts(productsData);
            setDistricts(districtsData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const method = editingPrice ? 'PUT' : 'POST';
            const response = await fetch('/api/prices', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            
            if (response.ok) {
                await fetchData();
                resetForm();
            }
        } catch (error) {
            console.error('Error saving price:', error);
        }
    }

    const resetForm = () => {
        setFormData({
            product_id: "",
            district_id: 0,
            date: "",
            price_per_unit: 0
        });
        setEditingPrice(null);
        setShowForm(false);
    }

    const filteredPrices = prices.filter(price => {
        const matchesSearch = (price.product_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                            (price.district_name?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        const matchesProduct = selectedProduct === "all" || price.product_id === selectedProduct;
        const matchesDistrict = selectedDistrict === "all" || price.district_id.toString() === selectedDistrict;
        
        return matchesSearch && matchesProduct && matchesDistrict;
    });

    // Calculate statistics
    const avgPrice = prices.length > 0 ? prices.reduce((sum, p) => sum + (p.price_per_unit || 0), 0) / prices.length : 0;
    const highestPrice = prices.length > 0 ? Math.max(...prices.map(p => p.price_per_unit || 0)) : 0;
    const lowestPrice = prices.length > 0 ? Math.min(...prices.map(p => p.price_per_unit || 0)) : 0;

    // Prepare chart data
    const chartData = filteredPrices.map(price => ({
        date: new Date(price.date).toLocaleDateString(),
        price: price.price_per_unit,
        product: price.product_name,
        district: price.district_name
    }));

    if (loading) {
        return <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-foreground">Loading price data...</div>
        </div>;
    }

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground mb-2">Price History and Trends</h1>
                            <p className="text-muted-foreground">Historical harvest time, wholesale, and retail price trends for various crops</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="bg-green-50 p-4 rounded-xl">
                                <DollarSign className="h-8 w-8 text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Average Price</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">৳{safeNumberFormat(avgPrice, 2)}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Highest Price</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-600">৳{safeNumberFormat(highestPrice, 2)}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Lowest Price</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-red-600">৳{safeNumberFormat(lowestPrice, 2)}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Price Trends Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Price Trends Over Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Filters and Controls */}
                <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex gap-4 flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="Search prices..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-64"
                                />
                            </div>
                            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Filter by product" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Products</SelectItem>
                                    {products.map(product => (
                                        <SelectItem key={product.product_id} value={product.product_id}>
                                            {product.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Filter by district" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Districts</SelectItem>
                                    {districts.map(district => (
                                        <SelectItem key={district.district_id} value={district.district_id.toString()}>
                                            {district.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Add Price Record
                        </Button>
                    </div>
                </div>

                {/* Price Table */}
                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-border">
                        <h2 className="text-xl font-semibold text-foreground">Price Records ({filteredPrices.length})</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="font-semibold text-foreground">Date</TableHead>
                                    <TableHead className="font-semibold text-foreground">Product</TableHead>
                                    <TableHead className="font-semibold text-foreground">District</TableHead>
                                    <TableHead className="font-semibold text-foreground">Harvest Time</TableHead>
                                    <TableHead className="font-semibold text-foreground">Price/Unit</TableHead>
                                    <TableHead className="font-semibold text-foreground">Price Type</TableHead>
                                    <TableHead className="font-semibold text-foreground">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPrices.map((price, index) => {
                                    const product = products.find(p => p.product_id === price.product_id);
                                    return (
                                        <TableRow key={price.price_id || index} className="hover:bg-muted/50">
                                            <TableCell>{new Date(price.date).toLocaleDateString()}</TableCell>
                                            <TableCell className="font-medium">{price.product_name}</TableCell>
                                            <TableCell>{price.district_name}</TableCell>
                                            <TableCell>{product?.harvest_time || 'N/A'}</TableCell>
                                            <TableCell className="font-semibold">৳{safeNumberFormat(price.price_per_unit, 2)}</TableCell>
                                            <TableCell>
                                                <Badge variant={price.price_type === 'wholesale' ? "default" : "secondary"}>
                                                    {price.price_type === 'wholesale' ? 'Wholesale' : 'Retail'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setEditingPrice(price);
                                                            setFormData(price);
                                                            setShowForm(true);
                                                        }}
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Add/Edit Form Modal - You can implement this as needed */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-card p-6 rounded-xl border border-border max-w-md w-full mx-4">
                            <h3 className="text-lg font-semibold text-foreground mb-4">
                                {editingPrice ? 'Edit Price' : 'Add New Price'}
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Form fields would go here */}
                                <div className="flex gap-2">
                                    <Button type="submit">
                                        {editingPrice ? 'Update' : 'Add'}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={resetForm}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}