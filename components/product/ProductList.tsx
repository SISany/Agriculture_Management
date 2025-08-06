"use client"

import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Textarea} from "@/components/ui/textarea"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Search, Plus, Edit2, Trash2, Package, Calendar, Leaf} from "lucide-react"
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
    LineChart,
    Line
} from "recharts"

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

const initialProducts: Product[] = [
    {
        id: Date.now().toString(),
        product_id: "1",
        product_name: "Wheat",
        product_type: "Grain",
        product_type_alt: "Cereal",
        variety: "Winter Wheat",
        sowing_time: "2024-10-15",
        transplanting_time: "N/A",
        harvest_time: "2024-04-15",
        seed_requirement_per_acre: 45.0,
        nutritional_value_per_unit: 364.0,
        storage_requirements: "Cool, dry place below 15°C"
    },
    {
        id: Date.now().toString(),
        product_id: "2",
        product_name: "Rice",
        product_type: "Grain",
        product_type_alt: "Cereal",
        variety: "Basmati",
        sowing_time: "2024-06-15",
        transplanting_time: "2024-07-15",
        harvest_time: "2024-11-15",
        seed_requirement_per_acre: 22.5,
        nutritional_value_per_unit: 130.0,
        storage_requirements: "Airtight containers, moisture <14%"
    },
    {
        id: Date.now().toString(),
        product_id: "3",
        product_name: "Corn",
        product_type: "Grain",
        product_type_alt: "Cereal",
        variety: "Sweet Corn",
        sowing_time: "2024-03-15",
        transplanting_time: "N/A",
        harvest_time: "2024-07-15",
        seed_requirement_per_acre: 17.5,
        nutritional_value_per_unit: 86.0,
        storage_requirements: "Refrigerated at 0-2°C"
    }
]

export default function ProductList() {
    const [products, setProducts] = useState<Product[]>(initialProducts)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedType, setSelectedType] = useState("all")

    // Form state
    const [formData, setFormData] = useState({
        product_id: "",
        product_name: "",
        product_type: "",
        product_type_alt: "",
        variety: "",
        sowing_time: "",
        transplanting_time: "",
        harvest_time: "",
        seed_requirement_per_acre: "",
        nutritional_value_per_unit: "",
        storage_requirements: ""
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
        if (!formData.product_id || !formData.product_name || !formData.product_type) {
            alert("Please fill in all required fields")
            return
        }

        // Create new product
        const newProduct: Product = {
            id: Date.now().toString(),
            product_id: formData.product_id,
            product_name: formData.product_name,
            product_type: formData.product_type,
            product_type_alt: formData.product_type_alt,
            variety: formData.variety,
            sowing_time: formData.sowing_time,
            transplanting_time: formData.transplanting_time || "N/A",
            harvest_time: formData.harvest_time,
            seed_requirement_per_acre: parseFloat(formData.seed_requirement_per_acre) || 0,
            nutritional_value_per_unit: parseFloat(formData.nutritional_value_per_unit) || 0,
            storage_requirements: formData.storage_requirements
        }

        setProducts(prev => [...prev, newProduct])

        // Reset form
        setFormData({
            product_id: "",
            product_name: "",
            product_type: "",
            product_type_alt: "",
            variety: "",
            sowing_time: "",
            transplanting_time: "",
            harvest_time: "",
            seed_requirement_per_acre: "",
            nutritional_value_per_unit: "",
            storage_requirements: ""
        })

        alert("Product data submitted successfully!")
    }

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this product?")) {
            setProducts(prev => prev.filter(product => product.id !== id))
        }
    }

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.product_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.variety.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesType = selectedType === "all" || product.product_type === selectedType

        return matchesSearch && matchesType
    })

    const totalProducts = filteredProducts.length
    const uniqueTypes = [...new Set(products.map(p => p.product_type))].filter(Boolean)
    const avgNutrition = products.reduce((sum, p) => sum + p.nutritional_value_per_unit, 0) / products.length || 0
    const avgSeedReq = products.reduce((sum, p) => sum + p.seed_requirement_per_acre, 0) / products.length || 0

    // Chart data calculations
    const typeDistribution = uniqueTypes.map(type => ({
        name: type,
        value: products.filter(p => p.product_type === type).length,
        percentage: ((products.filter(p => p.product_type === type).length / products.length) * 100).toFixed(1)
    }))

    const nutritionData = products.map(product => ({
        name: product.product_name,
        nutrition: product.nutritional_value_per_unit,
        seedReq: product.seed_requirement_per_acre
    }))

    const seasonalData = products.reduce((acc, product) => {
        if (product.sowing_time) {
            const month = new Date(product.sowing_time).toLocaleString('default', {month: 'short'})
            const existing = acc.find(item => item.month === month)
            if (existing) {
                existing.count += 1
            } else {
                acc.push({month, count: 1})
            }
        }
        return acc
    }, [] as Array<{ month: string, count: number }>)

    // Vibrant color palette
    const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F']

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-900 via-blue-900 to-cyan-900 p-6">
            <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
                {/* Enhanced Header */}
                <div
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 p-8 text-white shadow-2xl">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-4">
                            <div
                                className="p-4 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 backdrop-blur-sm animate-float shadow-lg">
                                <Package className="h-10 w-10 text-white"/>
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold tracking-tight animate-slide-up bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                                    Product Management System
                                </h1>
                                <p className="text-lg text-emerald-100 mt-2 animate-slide-up animate-delay-200">
                                    Manage agricultural products and their specifications with advanced analytics
                                </p>
                            </div>
                        </div>
                    </div>
                    <div
                        className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
                    <div
                        className="absolute bottom-0 left-0 w-48 h-48 bg-pink-400/20 rounded-full blur-2xl animate-pulse-slow animate-delay-500"></div>
                </div>

                {/* Enhanced Statistics */}
                <div
                    className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-700 animate-scale-in animate-delay-100">
                    <div className="flex items-center gap-6 pb-6">
                        <div
                            className="p-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg animate-float">
                            <Package className="w-8 h-8 text-white"/>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                                Product Statistics
                            </h2>
                            <p className="text-slate-300 mt-1">Comprehensive overview of agricultural products</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div
                            className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg transform hover:scale-105 transition-all duration-300 animate-fade-in animate-delay-100">
                            <div className="text-3xl font-bold mb-2">{totalProducts}</div>
                            <p className="text-blue-100 font-medium">Total Products</p>
                        </div>
                        <div
                            className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg transform hover:scale-105 transition-all duration-300 animate-fade-in animate-delay-200">
                            <div className="text-3xl font-bold mb-2">{uniqueTypes.length}</div>
                            <p className="text-purple-100 font-medium">Product Types</p>
                        </div>
                        <div
                            className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg transform hover:scale-105 transition-all duration-300 animate-fade-in animate-delay-300">
                            <div className="text-3xl font-bold mb-2">{avgNutrition.toFixed(1)}</div>
                            <p className="text-orange-100 font-medium">Avg Nutrition (kcal)</p>
                        </div>
                        <div
                            className="text-center p-6 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-lg transform hover:scale-105 transition-all duration-300 animate-fade-in animate-delay-400">
                            <div className="text-3xl font-bold mb-2">{avgSeedReq.toFixed(1)}</div>
                            <p className="text-pink-100 font-medium">Avg Seed Req (kg/acre)</p>
                        </div>
                    </div>
                </div>

                {/* Enhanced Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Product Type Distribution */}
                    <div
                        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-700 animate-fade-in animate-delay-100">
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                                Product Type Distribution
                            </h3>
                            <p className="text-slate-300">Distribution of products by type</p>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={typeDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={120}
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={({name, percentage}) => `${name}: ${percentage}%`}
                                    >
                                        {typeDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value, name) => [`${value} products`, name]} contentStyle={{
                                        backgroundColor: '#1e293b',
                                        border: '1px solid #475569',
                                        borderRadius: '8px',
                                        color: 'white'
                                    }}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Nutritional Value Analysis */}
                    <div
                        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-700 animate-fade-in animate-delay-200">
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                                Nutritional Value Analysis
                            </h3>
                            <p className="text-slate-300">Nutritional value per product (kcal/unit)</p>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={nutritionData} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#475569"/>
                                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} stroke="#94a3b8"/>
                                    <YAxis stroke="#94a3b8"/>
                                    <Tooltip formatter={(value) => [`${value} kcal`, "Nutritional Value"]}
                                             contentStyle={{
                                                 backgroundColor: '#1e293b',
                                                 border: '1px solid #475569',
                                                 borderRadius: '8px',
                                                 color: 'white'
                                             }}/>
                                    <Bar dataKey="nutrition" fill="url(#nutritionGradient)" radius={[4, 4, 0, 0]}>
                                        <defs>
                                            <linearGradient id="nutritionGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.9}/>
                                                <stop offset="95%" stopColor="#059669" stopOpacity={0.9}/>
                                            </linearGradient>
                                        </defs>
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Seasonal Planting Chart */}
                {seasonalData.length > 0 && (
                    <div
                        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-700 animate-fade-in animate-delay-300">
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
                                Seasonal Planting Distribution
                            </h3>
                            <p className="text-slate-300">Number of products by sowing month</p>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={seasonalData} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#475569"/>
                                    <XAxis dataKey="month" stroke="#94a3b8"/>
                                    <YAxis stroke="#94a3b8"/>
                                    <Tooltip formatter={(value) => [`${value} products`, "Count"]} contentStyle={{
                                        backgroundColor: '#1e293b',
                                        border: '1px solid #475569',
                                        borderRadius: '8px',
                                        color: 'white'
                                    }}/>
                                    <Line type="monotone" dataKey="count" stroke="#F59E0B" strokeWidth={3}
                                          dot={{r: 6, fill: "#F59E0B"}}/>
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Enhanced Form */}
                <div
                    className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-700 animate-fade-in animate-delay-400">
                    <div className="pb-8">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent mb-2">
                            Submit Product Data
                        </h2>
                        <p className="text-slate-300 text-lg">Enter new product information with complete
                            specifications</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* First Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-3">
                                <Label htmlFor="product_id"
                                       className="flex items-center gap-2 text-cyan-400 font-semibold">
                                    <div
                                        className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 shadow-lg">
                                        <Package className="w-4 h-4 text-white"/>
                                    </div>
                                    Product ID
                                </Label>
                                <Input
                                    id="product_id"
                                    placeholder="Enter product ID"
                                    value={formData.product_id}
                                    onChange={(e) => handleInputChange("product_id", e.target.value)}
                                    className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-cyan-400 rounded-lg"
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="product_name"
                                       className="flex items-center gap-2 text-emerald-400 font-semibold">
                                    <div
                                        className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 shadow-lg">
                                        <Leaf className="w-4 h-4 text-white"/>
                                    </div>
                                    Product Name
                                </Label>
                                <Input
                                    id="product_name"
                                    placeholder="Enter product name"
                                    value={formData.product_name}
                                    onChange={(e) => handleInputChange("product_name", e.target.value)}
                                    className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-emerald-400 focus:ring-emerald-400 rounded-lg"
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="product_type"
                                       className="flex items-center gap-2 text-purple-400 font-semibold">
                                    <div
                                        className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                                        <Package className="w-4 h-4 text-white"/>
                                    </div>
                                    Product Type
                                </Label>
                                <Select value={formData.product_type}
                                        onValueChange={(value) => handleInputChange("product_type", value)}>
                                    <SelectTrigger
                                        className="bg-slate-700/50 border-slate-600 text-white focus:border-purple-400 focus:ring-purple-400 rounded-lg">
                                        <SelectValue placeholder="Select type"/>
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-600">
                                        <SelectItem value="Grain"
                                                    className="text-white hover:bg-slate-700">Grain</SelectItem>
                                        <SelectItem value="Vegetable"
                                                    className="text-white hover:bg-slate-700">Vegetable</SelectItem>
                                        <SelectItem value="Fruit"
                                                    className="text-white hover:bg-slate-700">Fruit</SelectItem>
                                        <SelectItem value="Legume"
                                                    className="text-white hover:bg-slate-700">Legume</SelectItem>
                                        <SelectItem value="Spice"
                                                    className="text-white hover:bg-slate-700">Spice</SelectItem>
                                        <SelectItem value="Cereal"
                                                    className="text-white hover:bg-slate-700">Cereal</SelectItem>
                                        <SelectItem value="Root"
                                                    className="text-white hover:bg-slate-700">Root</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Second Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-3">
                                <Label htmlFor="product_type_alt"
                                       className="flex items-center gap-2 text-orange-400 font-semibold">
                                    <div
                                        className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 shadow-lg">
                                        <Package className="w-4 h-4 text-white"/>
                                    </div>
                                    Alternative Type
                                </Label>
                                <Input
                                    id="product_type_alt"
                                    placeholder="Alternative type"
                                    value={formData.product_type_alt}
                                    onChange={(e) => handleInputChange("product_type_alt", e.target.value)}
                                    className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-orange-400 focus:ring-orange-400 rounded-lg"
                                />
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="variety"
                                       className="flex items-center gap-2 text-pink-400 font-semibold">
                                    <div
                                        className="p-2 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 shadow-lg">
                                        <Leaf className="w-4 h-4 text-white"/>
                                    </div>
                                    Variety
                                </Label>
                                <Input
                                    id="variety"
                                    placeholder="Enter variety"
                                    value={formData.variety}
                                    onChange={(e) => handleInputChange("variety", e.target.value)}
                                    className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-pink-400 focus:ring-pink-400 rounded-lg"
                                />
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="seed_requirement_per_acre"
                                       className="flex items-center gap-2 text-yellow-400 font-semibold">
                                    <div
                                        className="p-2 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 shadow-lg">
                                        <Package className="w-4 h-4 text-white"/>
                                    </div>
                                    Seed Req. (kg/acre)
                                </Label>
                                <Input
                                    id="seed_requirement_per_acre"
                                    type="number"
                                    step="0.1"
                                    placeholder="Seed requirement"
                                    value={formData.seed_requirement_per_acre}
                                    onChange={(e) => handleInputChange("seed_requirement_per_acre", e.target.value)}
                                    className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-yellow-400 focus:ring-yellow-400 rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Third Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-3">
                                <Label htmlFor="sowing_time"
                                       className="flex items-center gap-2 text-indigo-400 font-semibold">
                                    <div
                                        className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 shadow-lg">
                                        <Calendar className="w-4 h-4 text-white"/>
                                    </div>
                                    Sowing Time
                                </Label>
                                <Input
                                    id="sowing_time"
                                    type="date"
                                    value={formData.sowing_time}
                                    onChange={(e) => handleInputChange("sowing_time", e.target.value)}
                                    className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-indigo-400 focus:ring-indigo-400 rounded-lg"
                                />
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="transplanting_time"
                                       className="flex items-center gap-2 text-teal-400 font-semibold">
                                    <div
                                        className="p-2 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg">
                                        <Calendar className="w-4 h-4 text-white"/>
                                    </div>
                                    Transplanting Time
                                </Label>
                                <Input
                                    id="transplanting_time"
                                    type="date"
                                    value={formData.transplanting_time}
                                    onChange={(e) => handleInputChange("transplanting_time", e.target.value)}
                                    className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-teal-400 focus:ring-teal-400 rounded-lg"
                                />
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="harvest_time"
                                       className="flex items-center gap-2 text-green-400 font-semibold">
                                    <div
                                        className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg">
                                        <Calendar className="w-4 h-4 text-white"/>
                                    </div>
                                    Harvest Time
                                </Label>
                                <Input
                                    id="harvest_time"
                                    type="date"
                                    value={formData.harvest_time}
                                    onChange={(e) => handleInputChange("harvest_time", e.target.value)}
                                    className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-green-400 focus:ring-green-400 rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Fourth Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label htmlFor="nutritional_value_per_unit"
                                       className="flex items-center gap-2 text-violet-400 font-semibold">
                                    <div
                                        className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg">
                                        <Leaf className="w-4 h-4 text-white"/>
                                    </div>
                                    Nutritional Value (kcal/unit)
                                </Label>
                                <Input
                                    id="nutritional_value_per_unit"
                                    type="number"
                                    step="0.1"
                                    placeholder="Nutritional value"
                                    value={formData.nutritional_value_per_unit}
                                    onChange={(e) => handleInputChange("nutritional_value_per_unit", e.target.value)}
                                    className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-violet-400 focus:ring-violet-400 rounded-lg"
                                />
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="storage_requirements"
                                       className="flex items-center gap-2 text-rose-400 font-semibold">
                                    <div
                                        className="p-2 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 shadow-lg">
                                        <Package className="w-4 h-4 text-white"/>
                                    </div>
                                    Storage Requirements
                                </Label>
                                <Textarea
                                    id="storage_requirements"
                                    placeholder="Storage requirements"
                                    value={formData.storage_requirements}
                                    onChange={(e) => handleInputChange("storage_requirements", e.target.value)}
                                    className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-rose-400 focus:ring-rose-400 rounded-lg"
                                    rows={3}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-start pt-6">
                            <Button type="submit"
                                    className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 hover:from-emerald-600 hover:via-green-600 hover:to-teal-700 text-white px-12 py-4 text-lg font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 animate-scale-in animate-delay-500">
                                <Plus className="w-5 h-5 mr-3"/>
                                SUBMIT PRODUCT DATA
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Enhanced Table */}
                <div
                    className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-700 animate-fade-in animate-delay-500">
                    <div className="pb-8">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                            Product Directory
                        </h2>
                        <p className="text-slate-300 text-lg">Browse and manage agricultural products</p>
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4"/>
                            <Input
                                placeholder="Search products by name or type..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-cyan-400 rounded-lg pl-12"
                            />
                        </div>
                        {uniqueTypes.length > 0 && (
                            <Select value={selectedType} onValueChange={setSelectedType}>
                                <SelectTrigger
                                    className="bg-slate-700/50 border-slate-600 text-white focus:border-purple-400 focus:ring-purple-400 rounded-lg w-48">
                                    <SelectValue placeholder="All Types"/>
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-600">
                                    <SelectItem value="all" className="text-white hover:bg-slate-700">All
                                        Types</SelectItem>
                                    {uniqueTypes.map((type) => (
                                        <SelectItem key={type} value={type} className="text-white hover:bg-slate-700">
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    <div className="rounded-xl overflow-hidden shadow-lg border border-slate-700">
                        <Table>
                            <TableHeader
                                className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white">
                                <TableRow>
                                    <TableHead className="text-white font-semibold">Product ID</TableHead>
                                    <TableHead className="text-white font-semibold">Name</TableHead>
                                    <TableHead className="text-white font-semibold">Type</TableHead>
                                    <TableHead className="text-white font-semibold">Variety</TableHead>
                                    <TableHead className="text-white font-semibold">Sowing</TableHead>
                                    <TableHead className="text-white font-semibold">Harvest</TableHead>
                                    <TableHead className="text-white font-semibold">Seed Req.</TableHead>
                                    <TableHead className="text-white font-semibold">Nutrition</TableHead>
                                    <TableHead className="text-white font-semibold">Storage</TableHead>
                                    <TableHead className="text-white font-semibold">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="bg-slate-800/50">
                                {filteredProducts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={10} className="text-center py-12 text-slate-300">
                                            <div className="flex flex-col items-center gap-3">
                                                <Package className="h-12 w-12 text-slate-500"/>
                                                <p className="text-lg">No products found.</p>
                                                <p className="text-sm">Add products using the form above.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <TableRow key={product.id}
                                                  className="border-slate-700 hover:bg-slate-700/50 transition-all duration-300">
                                            <TableCell
                                                className="font-semibold text-cyan-400">{product.product_id}</TableCell>
                                            <TableCell
                                                className="font-medium text-white">{product.product_name}</TableCell>
                                            <TableCell>
                                                <span
                                                    className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-violet-500 text-white font-medium text-sm shadow-lg">
                                                    {product.product_type}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-slate-300">{product.variety}</TableCell>
                                            <TableCell className="text-slate-300">
                                                {product.sowing_time ? new Date(product.sowing_time).toLocaleDateString() : "N/A"}
                                            </TableCell>
                                            <TableCell className="text-slate-300">
                                                {product.harvest_time ? new Date(product.harvest_time).toLocaleDateString() : "N/A"}
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className="px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium text-sm shadow-lg">
                                                    {product.seed_requirement_per_acre} kg
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className="px-3 py-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium text-sm shadow-lg">
                                                    {product.nutritional_value_per_unit} kcal
                                                </span>
                                            </TableCell>
                                            <TableCell
                                                className="text-slate-300 max-w-xs truncate">{product.storage_requirements}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    <Button variant="ghost" size="sm"
                                                            className="hover:bg-blue-500/20 transition-all duration-300 rounded-xl p-3">
                                                        <Edit2 className="w-4 h-4 text-blue-400"/>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="hover:bg-red-500/20 transition-all duration-300 rounded-xl p-3"
                                                        onClick={() => handleDelete(product.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-400"/>
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