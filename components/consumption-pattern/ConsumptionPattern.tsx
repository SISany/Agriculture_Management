"use client"

import {useState} from "react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Badge} from "@/components/ui/badge"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart"
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts"
import {Search, Plus, Edit2, Trash2, TrendingUp, MapPin, DollarSign, Package, FileDown} from "lucide-react"
import {exportConsumptionData} from "@/lib/pdfExport"
import {Label} from "@/components/ui/label"

// TypeScript interfaces
interface ConsumptionPattern {
    consumption_id: string
    stakeholder_id: string
    stakeholder_name: string
    product_id: string
    product_name: string
    consumption_date: string
    quantity_consumed: number
    amount_spent: number
    purchase_location: string
    season: string
    demographic_group: string
    household_size: number
}

// Mock data
const consumptionPatterns: ConsumptionPattern[] = [
    {
        consumption_id: "CP001",
        stakeholder_id: "S004",
        stakeholder_name: "Rahman Family",
        product_id: "P001",
        product_name: "Wheat",
        consumption_date: "2024-01-15",
        quantity_consumed: 25,
        amount_spent: 1250,
        purchase_location: "Local Market",
        season: "Winter",
        demographic_group: "Middle Class",
        household_size: 5
    },
    {
        consumption_id: "CP002",
        stakeholder_id: "S005",
        stakeholder_name: "Khan Household",
        product_id: "P002",
        product_name: "Rice",
        consumption_date: "2024-01-14",
        quantity_consumed: 30,
        amount_spent: 1950,
        purchase_location: "Supermarket",
        season: "Winter",
        demographic_group: "Upper Middle Class",
        household_size: 4
    },
    {
        consumption_id: "CP003",
        stakeholder_id: "S006",
        stakeholder_name: "Ali Family",
        product_id: "P003",
        product_name: "Corn",
        consumption_date: "2024-01-13",
        quantity_consumed: 15,
        amount_spent: 300,
        purchase_location: "Local Vendor",
        season: "Winter",
        demographic_group: "Lower Middle Class",
        household_size: 6
    },
    {
        consumption_id: "CP004",
        stakeholder_id: "S007",
        stakeholder_name: "Begum Household",
        product_id: "P001",
        product_name: "Wheat",
        consumption_date: "2024-01-12",
        quantity_consumed: 20,
        amount_spent: 1000,
        purchase_location: "Wholesale Market",
        season: "Winter",
        demographic_group: "Middle Class",
        household_size: 3
    },
    {
        consumption_id: "CP005",
        stakeholder_id: "S008",
        stakeholder_name: "Hasan Family",
        product_id: "P002",
        product_name: "Rice",
        consumption_date: "2024-01-11",
        quantity_consumed: 35,
        amount_spent: 2275,
        purchase_location: "Local Market",
        season: "Winter",
        demographic_group: "Upper Class",
        household_size: 7
    }
]

// Chart data
const monthlyConsumptionData = [
    {month: "Jan", wheat: 2400, rice: 4000, corn: 1200},
    {month: "Feb", wheat: 2200, rice: 3800, corn: 1100},
    {month: "Mar", wheat: 2600, rice: 4200, corn: 1300},
    {month: "Apr", wheat: 2800, rice: 4500, corn: 1400},
    {month: "May", wheat: 3000, rice: 4800, corn: 1500},
    {month: "Jun", wheat: 2700, rice: 4300, corn: 1350}
]

const demographicConsumption = [
    {name: "Upper Class", value: 35, color: "#8884d8"},
    {name: "Upper Middle Class", value: 28, color: "#82ca9d"},
    {name: "Middle Class", value: 25, color: "#ffc658"},
    {name: "Lower Middle Class", value: 12, color: "#ff7300"}
]

const seasonalTrends = [
    {season: "Spring", consumption: 3200, spending: 156000},
    {season: "Summer", consumption: 2800, spending: 142000},
    {season: "Monsoon", consumption: 3600, spending: 178000},
    {season: "Winter", consumption: 4200, spending: 195000}
]

export default function ConsumptionPattern() {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedSeason, setSelectedSeason] = useState("all")
    const [selectedDemographic, setSelectedDemographic] = useState("all")
    const [selectedProduct, setSelectedProduct] = useState("all")
    const [showAddForm, setShowAddForm] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        pattern_id: "",
        consumer_name: "",
        product_name: "",
        consumption_date: "",
        quantity_consumed: 0,
        amount_spent: 0,
        location: "",
        season: "",
        demographic_group: "",
        household_size: 0
    })

    const filteredData = consumptionPatterns.filter(pattern => {
        const matchesSearch = pattern.stakeholder_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pattern.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pattern.purchase_location.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesSeason = selectedSeason === "all" || pattern.season === selectedSeason
        const matchesDemographic = selectedDemographic === "all" || pattern.demographic_group === selectedDemographic
        const matchesProduct = selectedProduct === "all" || pattern.product_name === selectedProduct

        return matchesSearch && matchesSeason && matchesDemographic && matchesProduct
    })

    const totalConsumption = filteredData.reduce((sum, pattern) => sum + pattern.quantity_consumed, 0)
    const totalSpending = filteredData.reduce((sum, pattern) => sum + pattern.amount_spent, 0)
    const avgHouseholdSize = filteredData.reduce((sum, pattern) => sum + pattern.household_size, 0) / filteredData.length || 0

    const handleInputChange = (field: string, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Add the new record to the data
        const newConsumptionPattern = {
            consumption_id: `CP${String(consumptionPatterns.length + 1).padStart(3, '0')}`,
            stakeholder_id: `S${String(consumptionPatterns.length + 1).padStart(3, '0')}`,
            stakeholder_name: formData.consumer_name,
            product_id: `P${String(consumptionPatterns.length + 1).padStart(3, '0')}`,
            product_name: formData.product_name,
            consumption_date: formData.consumption_date,
            quantity_consumed: formData.quantity_consumed,
            amount_spent: formData.amount_spent,
            purchase_location: formData.location,
            season: formData.season,
            demographic_group: formData.demographic_group,
            household_size: formData.household_size
        }

        console.log("New Consumption Pattern Record:", newConsumptionPattern)

        // Reset form and hide it
        setFormData({
            pattern_id: "",
            consumer_name: "",
            product_name: "",
            consumption_date: "",
            quantity_consumed: 0,
            amount_spent: 0,
            location: "",
            season: "",
            demographic_group: "",
            household_size: 0
        })
        setShowAddForm(false)
    }

    // Dropdown options
    const seasons = ["Winter", "Spring", "Summer", "Autumn"]
    const demographicGroups = ["Upper Class", "Upper Middle Class", "Middle Class", "Lower Middle Class", "Lower Class"]
    const products = ["Wheat", "Rice", "Corn", "Potato", "Tomato", "Fish", "Chicken", "Beef"]
    const locations = ["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Barisal", "Rangpur", "Mymensingh"]

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Consumption Pattern Analysis</h1>
                    <p className="text-sm text-gray-600">Track and analyze consumer consumption patterns and
                        behaviors</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm"
                            onClick={() => exportConsumptionData(filteredData as unknown as Record<string, unknown>[])}>
                        <FileDown className="w-4 h-4 mr-2"/>
                        Export Data
                    </Button>
                    <Button size="sm" onClick={() => setShowAddForm(true)}>
                        <Plus className="w-4 h-4 mr-2"/>
                        Add Pattern
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Consumption</CardTitle>
                        <Package className="h-4 w-4 text-blue-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalConsumption.toLocaleString()} kg</div>
                        <p className="text-xs text-green-600 mt-1">+12% from last month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Spending</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">৳{totalSpending.toLocaleString()}</div>
                        <p className="text-xs text-blue-600 mt-1">Average per household</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Household Size</CardTitle>
                        <TrendingUp className="h-4 w-4 text-purple-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{avgHouseholdSize.toFixed(1)}</div>
                        <p className="text-xs text-gray-600 mt-1">Members per household</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Consumers</CardTitle>
                        <MapPin className="h-4 w-4 text-orange-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{filteredData.length}</div>
                        <p className="text-xs text-green-600 mt-1">Tracked patterns</p>
                    </CardContent>
                </Card>
            </div>

            {/* Add Consumption Pattern Form - Positioned above table */}
            {showAddForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>Add Consumption Pattern</CardTitle>
                        <CardDescription>Enter comprehensive consumption pattern data for analysis</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Information Section */}
                            <div>
                                <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="consumer_name" className="text-gray-700">Consumer Name *</Label>
                                        <Input
                                            id="consumer_name"
                                            type="text"
                                            placeholder="e.g., Rahman Family"
                                            value={formData.consumer_name}
                                            onChange={(e) => handleInputChange("consumer_name", e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="product_name" className="text-gray-700">Product *</Label>
                                        <Select value={formData.product_name}
                                                onValueChange={(value) => handleInputChange("product_name", value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Product"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {products.map((product) => (
                                                    <SelectItem key={product} value={product}>
                                                        {product}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="consumption_date" className="text-gray-700">Consumption Date
                                            *</Label>
                                        <Input
                                            id="consumption_date"
                                            type="date"
                                            value={formData.consumption_date}
                                            onChange={(e) => handleInputChange("consumption_date", e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="location" className="text-gray-700">Location *</Label>
                                        <Select value={formData.location}
                                                onValueChange={(value) => handleInputChange("location", value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Location"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {locations.map((location) => (
                                                    <SelectItem key={location} value={location}>
                                                        {location}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="season" className="text-gray-700">Season *</Label>
                                        <Select value={formData.season}
                                                onValueChange={(value) => handleInputChange("season", value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Season"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {seasons.map((season) => (
                                                    <SelectItem key={season} value={season}>
                                                        {season}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="demographic_group" className="text-gray-700">Demographic Group
                                            *</Label>
                                        <Select value={formData.demographic_group}
                                                onValueChange={(value) => handleInputChange("demographic_group", value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Group"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {demographicGroups.map((group) => (
                                                    <SelectItem key={group} value={group}>
                                                        {group}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {/* Consumption Data Section */}
                            <div>
                                <h4 className="text-lg font-medium text-gray-900 mb-4">Consumption Data</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="quantity_consumed" className="text-gray-700">Quantity Consumed
                                            (kg) *</Label>
                                        <Input
                                            id="quantity_consumed"
                                            type="number"
                                            step="0.1"
                                            placeholder="e.g., 5.5"
                                            value={formData.quantity_consumed}
                                            onChange={(e) => handleInputChange("quantity_consumed", parseFloat(e.target.value) || 0)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="amount_spent" className="text-gray-700">Amount Spent (৳)
                                            *</Label>
                                        <Input
                                            id="amount_spent"
                                            type="number"
                                            step="0.01"
                                            placeholder="e.g., 450.00"
                                            value={formData.amount_spent}
                                            onChange={(e) => handleInputChange("amount_spent", parseFloat(e.target.value) || 0)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="household_size" className="text-gray-700">Household Size
                                            *</Label>
                                        <Input
                                            id="household_size"
                                            type="number"
                                            min="1"
                                            placeholder="e.g., 4"
                                            value={formData.household_size}
                                            onChange={(e) => handleInputChange("household_size", parseInt(e.target.value) || 0)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex gap-4 pt-4 border-t border-gray-200">
                                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                                    <Plus className="h-4 w-4 mr-2"/>
                                    Add Consumption Pattern
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Filters and Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Consumption Pattern Data</CardTitle>
                    <CardDescription>Filter and view detailed consumption patterns</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                            <Input
                                placeholder="Search consumers, products, locations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Select Season"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Seasons</SelectItem>
                                <SelectItem value="Spring">Spring</SelectItem>
                                <SelectItem value="Summer">Summer</SelectItem>
                                <SelectItem value="Monsoon">Monsoon</SelectItem>
                                <SelectItem value="Winter">Winter</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={selectedDemographic} onValueChange={setSelectedDemographic}>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Select Demographic"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Demographics</SelectItem>
                                <SelectItem value="Upper Class">Upper Class</SelectItem>
                                <SelectItem value="Upper Middle Class">Upper Middle Class</SelectItem>
                                <SelectItem value="Middle Class">Middle Class</SelectItem>
                                <SelectItem value="Lower Middle Class">Lower Middle Class</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Select Product"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Products</SelectItem>
                                <SelectItem value="Wheat">Wheat</SelectItem>
                                <SelectItem value="Rice">Rice</SelectItem>
                                <SelectItem value="Corn">Corn</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Consumer</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Amount Spent</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Season</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.map((pattern) => (
                                    <TableRow key={pattern.consumption_id}>
                                        <TableCell className="font-medium">{pattern.stakeholder_name}</TableCell>
                                        <TableCell>{pattern.product_name}</TableCell>
                                        <TableCell>{new Date(pattern.consumption_date).toLocaleDateString()}</TableCell>
                                        <TableCell>{pattern.quantity_consumed} kg</TableCell>
                                        <TableCell>৳{pattern.amount_spent.toLocaleString()}</TableCell>
                                        <TableCell>{pattern.purchase_location}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{pattern.season}</Badge>
                                        </TableCell>
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
                    </div>
                </CardContent>
            </Card>

            {/* Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Consumption Trends</CardTitle>
                        <CardDescription>Product consumption over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={monthlyConsumptionData}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis
                                        dataKey="month"
                                        label={{value: 'Month', position: 'insideBottom', offset: -5}}
                                    />
                                    <YAxis
                                        label={{value: 'Consumption (kg)', angle: -90, position: 'insideLeft'}}
                                    />
                                    <ChartTooltip content={<ChartTooltipContent/>}/>
                                    <Legend/>
                                    <Line type="monotone" dataKey="wheat" stroke="#8884d8" strokeWidth={2}/>
                                    <Line type="monotone" dataKey="rice" stroke="#82ca9d" strokeWidth={2}/>
                                    <Line type="monotone" dataKey="corn" stroke="#ffc658" strokeWidth={2}/>
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Demographic Distribution</CardTitle>
                        <CardDescription>Consumption by demographic groups</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={demographicConsumption}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {demographicConsumption.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color}/>
                                        ))}
                                    </Pie>
                                    <ChartTooltip content={<ChartTooltipContent/>}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Seasonal Consumption Analysis</CardTitle>
                    <CardDescription>Consumption patterns across different seasons</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={{}} className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={seasonalTrends}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis
                                    dataKey="season"
                                    label={{value: 'Season', position: 'insideBottom', offset: -5}}
                                />
                                <YAxis
                                    yAxisId="left"
                                    label={{value: 'Consumption (kg)', angle: -90, position: 'insideLeft'}}
                                />
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    label={{value: 'Spending (৳)', angle: 90, position: 'insideRight'}}
                                />
                                <ChartTooltip content={<ChartTooltipContent/>}/>
                                <Legend/>
                                <Bar yAxisId="left" dataKey="consumption" fill="#8884d8" name="Consumption (kg)"/>
                                <Bar yAxisId="right" dataKey="spending" fill="#82ca9d" name="Spending (৳)"/>
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    )
}