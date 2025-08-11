"use client"

import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Badge} from "@/components/ui/badge"
import {ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer} from "recharts"
import {Search, Plus, Edit2, Trash2, Factory, TrendingUp, FileDown} from "lucide-react"
import {exportProductionData} from "@/lib/pdfExport"

interface Production {
    production_id: string
    product_id: string
    product_name: string
    district_division: string
    date: string
    acreage: number
    quantity_produced: number
    surplus_deficit: number
    weather_id: string
}

const production: Production[] = [
    {
        production_id: "PR001",
        product_id: "P001",
        product_name: "Wheat",
        district_division: "Dhaka",
        date: "2024-01-15",
        acreage: 1200,
        quantity_produced: 5000,
        surplus_deficit: 500,
        weather_id: "W001"
    },
    {
        production_id: "PR002",
        product_id: "P002",
        product_name: "Rice",
        district_division: "Chittagong",
        date: "2024-01-10",
        acreage: 800,
        quantity_produced: 3000,
        surplus_deficit: -200,
        weather_id: "W002"
    },
    {
        production_id: "PR003",
        product_id: "P003",
        product_name: "Corn",
        district_division: "Sylhet",
        date: "2024-01-12",
        acreage: 600,
        quantity_produced: 2400,
        surplus_deficit: 300,
        weather_id: "W003"
    },
    {
        production_id: "PR004",
        product_id: "P001",
        product_name: "Wheat",
        district_division: "Rajshahi",
        date: "2024-01-18",
        acreage: 900,
        quantity_produced: 3800,
        surplus_deficit: 200,
        weather_id: "W004"
    }
]

export default function ProductionManagement() {
    const [searchTerm, setSearchTerm] = useState("")
    const [showAddForm, setShowAddForm] = useState(false)
    const [productions, setProductions] = useState<Production[]>(production)
    const [formData, setFormData] = useState({
        production_id: "",
        product_name: "",
        district_division: "",
        date: "",
        acreage: "",
        quantity_produced: "",
        surplus_deficit: "",
        weather_id: ""
    })

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const newProduction: Production = {
            production_id: formData.production_id,
            product_id: `P${Date.now()}`,
            product_name: formData.product_name,
            district_division: formData.district_division,
            date: formData.date,
            acreage: parseInt(formData.acreage) || 0,
            quantity_produced: parseInt(formData.quantity_produced) || 0,
            surplus_deficit: parseInt(formData.surplus_deficit) || 0,
            weather_id: formData.weather_id
        }

        setProductions([...productions, newProduction])

        // Reset form
        setFormData({
            production_id: "",
            product_name: "",
            district_division: "",
            date: "",
            acreage: "",
            quantity_produced: "",
            surplus_deficit: "",
            weather_id: ""
        })
        setShowAddForm(false)
        alert("Production record added successfully!")
    }

    const filteredProduction = productions.filter(record =>
        record.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.district_division.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.production_id.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Production Management</h1>
                    <p className="mt-2 text-gray-600">Track agricultural production across regions</p>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                        <Input
                            type="search"
                            placeholder="Search production records..."
                            className="pl-10 w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button onClick={() => setShowAddForm(true)}>
                        <Plus className="w-4 h-4 mr-2"/>
                        Add Production Record
                    </Button>
                    <Button onClick={() => exportProductionData(productions as unknown as Record<string, unknown>[])}>
                        <FileDown className="w-4 h-4 mr-2"/>
                        Export Data
                    </Button>
                </div>
            </div>

            {/* 1. STATISTICS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Total Records</CardTitle>
                        <Factory className="h-4 w-4 text-blue-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{productions.length}</div>
                        <p className="text-xs text-gray-600">Production records</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Total Production</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {productions.reduce((sum, p) => sum + p.quantity_produced, 0).toLocaleString()} tons
                        </div>
                        <p className="text-xs text-gray-600">This month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Total Acreage</CardTitle>
                        <Factory className="h-4 w-4 text-purple-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {productions.reduce((sum, p) => sum + p.acreage, 0).toLocaleString()} acres
                        </div>
                        <p className="text-xs text-gray-600">Under cultivation</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Net Surplus</CardTitle>
                        <TrendingUp className="h-4 w-4 text-orange-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {productions.reduce((sum, p) => sum + p.surplus_deficit, 0).toLocaleString()} tons
                        </div>
                        <p className="text-xs text-gray-600">Surplus/Deficit</p>
                    </CardContent>
                </Card>
            </div>

            {/* 2. ENTRY DATA FORM */}
            {showAddForm && (
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Add New Production Record</CardTitle>
                        <CardDescription>Enter production data for agricultural tracking</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="production_id" className="text-sm font-medium text-gray-700">Production
                                        ID</label>
                                    <Input
                                        id="production_id"
                                        type="text"
                                        placeholder="e.g., PR001"
                                        value={formData.production_id}
                                        onChange={(e) => handleInputChange("production_id", e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="product_name" className="text-sm font-medium text-gray-700">Product
                                        Name</label>
                                    <Select
                                        id="product_name"
                                        value={formData.product_name}
                                        onValueChange={(value) => handleInputChange("product_name", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a product..."/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Wheat">Wheat</SelectItem>
                                            <SelectItem value="Rice">Rice</SelectItem>
                                            <SelectItem value="Corn">Corn</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="district_division"
                                           className="text-sm font-medium text-gray-700">District/Division</label>
                                    <Select
                                        id="district_division"
                                        value={formData.district_division}
                                        onValueChange={(value) => handleInputChange("district_division", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a district..."/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Dhaka">Dhaka</SelectItem>
                                            <SelectItem value="Chittagong">Chittagong</SelectItem>
                                            <SelectItem value="Sylhet">Sylhet</SelectItem>
                                            <SelectItem value="Rajshahi">Rajshahi</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="date" className="text-sm font-medium text-gray-700">Production
                                        Date</label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => handleInputChange("date", e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="acreage" className="text-sm font-medium text-gray-700">Acreage
                                        (acres)</label>
                                    <Input
                                        id="acreage"
                                        type="number"
                                        placeholder="e.g., 1200"
                                        value={formData.acreage}
                                        onChange={(e) => handleInputChange("acreage", e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="quantity_produced" className="text-sm font-medium text-gray-700">Quantity
                                        Produced (tons)</label>
                                    <Input
                                        id="quantity_produced"
                                        type="number"
                                        placeholder="e.g., 5000"
                                        value={formData.quantity_produced}
                                        onChange={(e) => handleInputChange("quantity_produced", e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="surplus_deficit" className="text-sm font-medium text-gray-700">Surplus/Deficit
                                        (tons)</label>
                                    <Input
                                        id="surplus_deficit"
                                        type="number"
                                        placeholder="e.g., 500 or -200"
                                        value={formData.surplus_deficit}
                                        onChange={(e) => handleInputChange("surplus_deficit", e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="weather_id" className="text-sm font-medium text-gray-700">Weather
                                        ID</label>
                                    <Input
                                        id="weather_id"
                                        type="text"
                                        placeholder="e.g., W001"
                                        value={formData.weather_id}
                                        onChange={(e) => handleInputChange("weather_id", e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Real-time calculation */}
                            {formData.quantity_produced && formData.acreage && (
                                <div className="bg-green-50 p-4 rounded-lg mt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-green-700">Yield per Acre:</span>
                                        <span className="font-semibold text-green-800">
                                            {(parseFloat(formData.quantity_produced) / parseFloat(formData.acreage)).toFixed(2)} tons/acre
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-4 pt-4">
                                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                                    <Plus className="w-4 h-4 mr-2"/>
                                    Add Production Record
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* 3. TABLE SHOW */}
            <Card>
                <CardHeader>
                    <CardTitle>Production Records</CardTitle>
                    <CardDescription>Regional production data with weather correlation</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Production ID</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>District/Division</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Acreage</TableHead>
                                <TableHead>Quantity Produced</TableHead>
                                <TableHead>Yield per Acre</TableHead>
                                <TableHead>Surplus/Deficit</TableHead>
                                <TableHead>Weather ID</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProduction.map((record) => (
                                <TableRow key={record.production_id}>
                                    <TableCell className="font-medium">{record.production_id}</TableCell>
                                    <TableCell>{record.product_name}</TableCell>
                                    <TableCell>{record.district_division}</TableCell>
                                    <TableCell>{record.date}</TableCell>
                                    <TableCell>{record.acreage.toLocaleString()} acres</TableCell>
                                    <TableCell>{record.quantity_produced.toLocaleString()} tons</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {(record.quantity_produced / record.acreage).toFixed(2)} t/acre
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={record.surplus_deficit > 0 ? "default" : "destructive"}>
                                            {record.surplus_deficit > 0 ? '+' : ''}{record.surplus_deficit} tons
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{record.weather_id}</TableCell>
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
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* 4. CHARTS */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Production by Region</CardTitle>
                        <CardDescription>Quantity produced across different districts</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer
                            config={{quantity_produced: {label: "Production (tons)", color: "#82ca9d"}}}
                            className="h-[300px]"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={productions}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis
                                        dataKey="district_division"
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                        label={{value: 'District/Division', position: 'insideBottom', offset: -60}}
                                    />
                                    <YAxis
                                        label={{value: 'Production (tons)', angle: -90, position: 'insideLeft'}}
                                    />
                                    <ChartTooltip content={<ChartTooltipContent/>}/>
                                    <Bar dataKey="quantity_produced" fill="#82ca9d"/>
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Acreage Distribution</CardTitle>
                        <CardDescription>Land under cultivation by district</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer
                            config={{acreage: {label: "Acreage", color: "#8884d8"}}}
                            className="h-[300px]"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={productions}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis
                                        dataKey="district_division"
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                        label={{value: 'District/Division', position: 'insideBottom', offset: -60}}
                                    />
                                    <YAxis
                                        label={{value: 'Acreage (acres)', angle: -90, position: 'insideLeft'}}
                                    />
                                    <ChartTooltip content={<ChartTooltipContent/>}/>
                                    <Bar dataKey="acreage" fill="#8884d8"/>
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Production Insights */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Production Insights</CardTitle>
                    <CardDescription>Key performance indicators and productivity metrics</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <h4 className="font-semibold text-green-800 mb-2">High Productivity Regions</h4>
                            <p className="text-sm text-green-700">
                                {productions.filter(p => (p.quantity_produced / p.acreage) > 4).length} regions
                                showing above-average yield per acre
                            </p>
                        </div>

                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h4 className="font-semibold text-blue-800 mb-2">Average Yield</h4>
                            <p className="text-sm text-blue-700">
                                {(productions.reduce((sum, p) => sum + p.quantity_produced, 0) /
                                    productions.reduce((sum, p) => sum + p.acreage, 0)).toFixed(2)} tons per acre
                            </p>
                        </div>

                        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                            <h4 className="font-semibold text-orange-800 mb-2">Surplus Regions</h4>
                            <p className="text-sm text-orange-700">
                                {productions.filter(p => p.surplus_deficit > 0).length} out
                                of {productions.length} regions
                                showing production surplus
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}