"use client"

import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Badge} from "@/components/ui/badge"
import {ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart"
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer} from "recharts"
import {Search, Plus, Edit2, Trash2, Factory, TrendingUp} from "lucide-react"

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

    const filteredProduction = production.filter(record =>
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
                    <Button>
                        <Plus className="w-4 h-4 mr-2"/>
                        Add Production Record
                    </Button>
                </div>
            </div>

            {/* Production Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Total Records</CardTitle>
                        <Factory className="h-4 w-4 text-blue-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{production.length}</div>
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
                            {production.reduce((sum, p) => sum + p.quantity_produced, 0).toLocaleString()} tons
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
                            {production.reduce((sum, p) => sum + p.acreage, 0).toLocaleString()} acres
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
                            {production.reduce((sum, p) => sum + p.surplus_deficit, 0).toLocaleString()} tons
                        </div>
                        <p className="text-xs text-gray-600">Surplus/Deficit</p>
                    </CardContent>
                </Card>
            </div>

            {/* Production Charts */}
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
                                <BarChart data={production}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="district_division" angle={-45} textAnchor="end" height={80}/>
                                    <YAxis/>
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
                                <BarChart data={production}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="district_division" angle={-45} textAnchor="end" height={80}/>
                                    <YAxis/>
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
                                {production.filter(p => (p.quantity_produced / p.acreage) > 4).length} regions
                                showing above-average yield per acre
                            </p>
                        </div>

                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h4 className="font-semibold text-blue-800 mb-2">Average Yield</h4>
                            <p className="text-sm text-blue-700">
                                {(production.reduce((sum, p) => sum + p.quantity_produced, 0) /
                                    production.reduce((sum, p) => sum + p.acreage, 0)).toFixed(2)} tons per acre
                            </p>
                        </div>

                        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                            <h4 className="font-semibold text-orange-800 mb-2">Surplus Regions</h4>
                            <p className="text-sm text-orange-700">
                                {production.filter(p => p.surplus_deficit > 0).length} out
                                of {production.length} regions
                                showing production surplus
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Detailed Production Table */}
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
        </div>
    )
}