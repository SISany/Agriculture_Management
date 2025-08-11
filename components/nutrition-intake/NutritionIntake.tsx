"use client"

import {useState} from "react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Badge} from "@/components/ui/badge"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    Activity,
    Heart,
    AlertCircle,
    TrendingUp,
    Apple,
    FileDown
} from "lucide-react"
import {Label} from "@/components/ui/label"
import {exportNutritionData} from "@/lib/pdfExport"

// TypeScript interfaces
interface NutritionIntake {
    nutrition_id: string
    stakeholder_id: string
    stakeholder_name: string
    product_id: string
    product_name: string
    intake_date: string
    per_capita_nutrition_intake: number
    nutrition_type: string
    recommended_intake: number
    demographic_group: string
    age_group: string
    gender: string
    health_status: string
    per_capita_income: number
    per_capita_nutrition: number
    surplus_deficit: string
}

// Mock data
const nutritionIntakes: NutritionIntake[] = [
    {
        nutrition_id: "N001",
        stakeholder_id: "S004",
        stakeholder_name: "Rahman Family",
        product_id: "P001",
        product_name: "Wheat",
        intake_date: "2024-01-15",
        per_capita_nutrition_intake: 250,
        nutrition_type: "Carbohydrates",
        recommended_intake: 300,
        demographic_group: "Middle Class",
        age_group: "Adult",
        gender: "Mixed",
        health_status: "Healthy",
        per_capita_income: 5000,
        per_capita_nutrition: 200,
        surplus_deficit: "-15 tons"
    },
    {
        nutrition_id: "N002",
        stakeholder_id: "S005",
        stakeholder_name: "Khan Household",
        product_id: "P002",
        product_name: "Rice",
        intake_date: "2024-01-14",
        per_capita_nutrition_intake: 180,
        nutrition_type: "Protein",
        recommended_intake: 200,
        demographic_group: "Upper Middle Class",
        age_group: "Adult",
        gender: "Mixed",
        health_status: "Healthy",
        per_capita_income: 6000,
        per_capita_nutrition: 150,
        surplus_deficit: "-8 tons"
    },
    {
        nutrition_id: "N003",
        stakeholder_id: "S006",
        stakeholder_name: "Ali Family",
        product_id: "P001",
        product_name: "Wheat",
        intake_date: "2024-01-13",
        per_capita_nutrition_intake: 120,
        nutrition_type: "Fiber",
        recommended_intake: 150,
        demographic_group: "Lower Middle Class",
        age_group: "Adult",
        gender: "Mixed",
        health_status: "Moderate Risk",
        per_capita_income: 4000,
        per_capita_nutrition: 100,
        surplus_deficit: "-25 tons"
    },
    {
        nutrition_id: "N004",
        stakeholder_id: "S007",
        stakeholder_name: "Begum Household",
        product_id: "P003",
        product_name: "Corn",
        intake_date: "2024-01-12",
        per_capita_nutrition_intake: 95,
        nutrition_type: "Vitamins",
        recommended_intake: 100,
        demographic_group: "Middle Class",
        age_group: "Adult",
        gender: "Mixed",
        health_status: "Healthy",
        per_capita_income: 4500,
        per_capita_nutrition: 120,
        surplus_deficit: "-12 tons"
    },
    {
        nutrition_id: "N005",
        stakeholder_id: "S008",
        stakeholder_name: "Hasan Family",
        product_id: "P002",
        product_name: "Rice",
        intake_date: "2024-01-11",
        per_capita_nutrition_intake: 220,
        nutrition_type: "Minerals",
        recommended_intake: 180,
        demographic_group: "Upper Class",
        age_group: "Adult",
        gender: "Mixed",
        health_status: "Healthy",
        per_capita_income: 7000,
        per_capita_nutrition: 250,
        surplus_deficit: "+20 tons"
    }
]

export default function NutritionIntake() {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedMonth, setSelectedMonth] = useState("all")
    const [selectedYear, setSelectedYear] = useState("all")
    const [showAddForm, setShowAddForm] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        nutrition_id: "",
        stakeholder_id: "",
        stakeholder_name: "",
        product_id: "",
        product_name: "",
        intake_date: "",
        per_capita_nutrition_intake: 0,
        nutrition_type: "",
        recommended_intake: 0,
        demographic_group: "",
        age_group: "",
        gender: "",
        health_status: "",
        per_capita_income: 0,
        per_capita_nutrition: 0,
        surplus_deficit: ""
    })

    const filteredData = nutritionIntakes.filter(intake => {
        const matchesSearch = intake.stakeholder_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            intake.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            intake.nutrition_type.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesMonth = selectedMonth === "all" || new Date(intake.intake_date).getMonth() === parseInt(selectedMonth)
        const matchesYear = selectedYear === "all" || new Date(intake.intake_date).getFullYear() === parseInt(selectedYear)

        return matchesSearch && matchesMonth && matchesYear
    })

    const avgIntake = filteredData.reduce((sum, intake) => sum + intake.per_capita_nutrition_intake, 0) / filteredData.length || 0
    const avgRecommended = filteredData.reduce((sum, intake) => sum + intake.recommended_intake, 0) / filteredData.length || 0
    const nutritionGap = avgRecommended - avgIntake
    const complianceRate = (avgIntake / avgRecommended) * 100 || 0

    const handleInputChange = (field: string, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    // Auto-fill product name when product is selected
    const handleProductSelect = (productId: string) => {
        const selectedProduct = products.find(p => p.id === productId)
        handleInputChange("product_id", productId)
        if (selectedProduct) {
            handleInputChange("product_name", selectedProduct.name)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Add the new record to the data
        const newNutritionIntake: NutritionIntake = {
            ...formData,
        }

        console.log("New Nutrition Intake Record:", newNutritionIntake)

        // Reset form and hide it
        setFormData({
            nutrition_id: "",
            stakeholder_id: "",
            stakeholder_name: "",
            product_id: "",
            product_name: "",
            intake_date: "",
            per_capita_nutrition_intake: 0,
            nutrition_type: "",
            recommended_intake: 0,
            demographic_group: "",
            age_group: "",
            gender: "",
            health_status: "",
            per_capita_income: 0,
            per_capita_nutrition: 0,
            surplus_deficit: ""
        })
        setShowAddForm(false)
    }

    // Dropdown options
    const nutritionTypes = ["Carbohydrates", "Protein", "Fiber", "Vitamins", "Minerals", "Fats"]
    const products = [
        {id: "P001", name: "Wheat"},
        {id: "P002", name: "Rice"},
        {id: "P003", name: "Corn"},
        {id: "P004", name: "Potato"},
        {id: "P005", name: "Tomato"}
    ]

    const handleExport = () => {
        exportNutritionData(filteredData)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Apple className="h-8 w-8 text-green-600"/>
                        Nutrition Intake Analysis
                    </h1>
                    <p className="text-gray-600 mt-1">Monitor and analyze nutritional intake patterns across
                        demographics</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleExport}>
                        <FileDown className="w-4 h-4 mr-2"/>
                        Export Report
                    </Button>
                    <Button size="sm" onClick={() => setShowAddForm(!showAddForm)}>
                        <Plus className="w-4 h-4 mr-2"/>
                        Add Record
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Daily Intake</CardTitle>
                        <Apple className="h-4 w-4 text-green-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{avgIntake.toFixed(1)}g</div>
                        <p className="text-xs text-green-600 mt-1">Per capita daily</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Recommended</CardTitle>
                        <Heart className="h-4 w-4 text-blue-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{avgRecommended.toFixed(1)}g</div>
                        <p className="text-xs text-blue-600 mt-1">Daily recommendation</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Nutrition Gap</CardTitle>
                        {nutritionGap > 0 ? (
                            <AlertCircle className="h-4 w-4 text-red-600"/>
                        ) : (
                            <TrendingUp className="h-4 w-4 text-green-600"/>
                        )}
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${nutritionGap > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {Math.abs(nutritionGap).toFixed(1)}g
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                            {nutritionGap > 0 ? 'Deficit' : 'Surplus'}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
                        <Activity className="h-4 w-4 text-purple-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{complianceRate.toFixed(1)}%</div>
                        <p className="text-xs text-purple-600 mt-1">Meeting recommendations</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Nutrition Intake Records</CardTitle>
                    <CardDescription>Filter and analyze nutrition intake data</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                            <Input
                                placeholder="Search by consumer, product, nutrition type..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Month"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Months</SelectItem>
                                <SelectItem value="0">January</SelectItem>
                                <SelectItem value="1">February</SelectItem>
                                <SelectItem value="2">March</SelectItem>
                                <SelectItem value="3">April</SelectItem>
                                <SelectItem value="4">May</SelectItem>
                                <SelectItem value="5">June</SelectItem>
                                <SelectItem value="6">July</SelectItem>
                                <SelectItem value="7">August</SelectItem>
                                <SelectItem value="8">September</SelectItem>
                                <SelectItem value="9">October</SelectItem>
                                <SelectItem value="10">November</SelectItem>
                                <SelectItem value="11">December</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={selectedYear} onValueChange={setSelectedYear}>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Year"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Years</SelectItem>
                                <SelectItem value="2022">2022</SelectItem>
                                <SelectItem value="2023">2023</SelectItem>
                                <SelectItem value="2024">2024</SelectItem>
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
                                    <TableHead>Nutrition Type</TableHead>
                                    <TableHead>Actual Intake</TableHead>
                                    <TableHead>Recommended</TableHead>
                                    <TableHead>Gap</TableHead>
                                    <TableHead>Health Status</TableHead>
                                    <TableHead>Per Capita Income</TableHead>
                                    <TableHead>Per Capita Nutrition</TableHead>
                                    <TableHead>Surplus/Deficit</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.map((intake) => {
                                    const gap = intake.recommended_intake - intake.per_capita_nutrition_intake
                                    return (
                                        <TableRow key={intake.nutrition_id}>
                                            <TableCell className="font-medium">{intake.stakeholder_name}</TableCell>
                                            <TableCell>{intake.product_name}</TableCell>
                                            <TableCell>{new Date(intake.intake_date).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{intake.nutrition_type}</Badge>
                                            </TableCell>
                                            <TableCell>{intake.per_capita_nutrition_intake}g</TableCell>
                                            <TableCell>{intake.recommended_intake}g</TableCell>
                                            <TableCell>
                                                <span className={gap > 0 ? 'text-red-600' : 'text-green-600'}>
                                                  {gap > 0 ? '-' : '+'}{Math.abs(gap)}g
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={intake.health_status === "Healthy" ? "default" :
                                                        intake.health_status === "Moderate Risk" ? "secondary" : "destructive"}
                                                >
                                                    {intake.health_status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{intake.per_capita_income}</TableCell>
                                            <TableCell>{intake.per_capita_nutrition}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={intake.surplus_deficit.startsWith('-') ? 'text-red-600' : 'text-green-600'}>
                                                    {intake.surplus_deficit}
                                                </span>
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
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {showAddForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>Add Nutrition Record</CardTitle>
                        <CardDescription>Enter comprehensive nutrition intake data for stakeholders</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Information Section */}
                            <div>
                                <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="nutrition_id" className="text-gray-700">Nutrition ID *</Label>
                                        <Input
                                            id="nutrition_id"
                                            type="text"
                                            placeholder="e.g., N006"
                                            value={formData.nutrition_id}
                                            onChange={(e) => handleInputChange("nutrition_id", e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="stakeholder_id" className="text-gray-700">Stakeholder ID
                                            *</Label>
                                        <Input
                                            id="stakeholder_id"
                                            type="text"
                                            placeholder="e.g., S006"
                                            value={formData.stakeholder_id}
                                            onChange={(e) => handleInputChange("stakeholder_id", e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="stakeholder_name" className="text-gray-700">Stakeholder Name
                                            *</Label>
                                        <Input
                                            id="stakeholder_name"
                                            type="text"
                                            placeholder="e.g., Hassan Family"
                                            value={formData.stakeholder_name}
                                            onChange={(e) => handleInputChange("stakeholder_name", e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="product_id" className="text-gray-700">Product *</Label>
                                        <Select value={formData.product_id} onValueChange={handleProductSelect}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Product"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {products.map((product) => (
                                                    <SelectItem key={product.id} value={product.id}>
                                                        {product.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="product_name" className="text-gray-700">Product Name</Label>
                                        <Input
                                            id="product_name"
                                            type="text"
                                            placeholder="Auto-filled from selection"
                                            value={formData.product_name}
                                            readOnly
                                            className="bg-gray-50"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="intake_date" className="text-gray-700">Intake Date *</Label>
                                        <Input
                                            id="intake_date"
                                            type="date"
                                            value={formData.intake_date}
                                            onChange={(e) => handleInputChange("intake_date", e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Nutrition Data Section */}
                            <div>
                                <h4 className="text-lg font-medium text-gray-900 mb-4">Nutrition Data</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="nutrition_type" className="text-gray-700">Nutrition Type
                                            *</Label>
                                        <Select value={formData.nutrition_type}
                                                onValueChange={(value) => handleInputChange("nutrition_type", value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Nutrition Type"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {nutritionTypes.map((type) => (
                                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="per_capita_nutrition_intake" className="text-gray-700">Actual
                                            Intake (g) *</Label>
                                        <Input
                                            id="per_capita_nutrition_intake"
                                            type="number"
                                            step="0.1"
                                            placeholder="e.g., 250"
                                            value={formData.per_capita_nutrition_intake}
                                            onChange={(e) => handleInputChange("per_capita_nutrition_intake", parseFloat(e.target.value) || 0)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="recommended_intake" className="text-gray-700">Recommended Intake
                                            (g) *</Label>
                                        <Input
                                            id="recommended_intake"
                                            type="number"
                                            step="0.1"
                                            placeholder="e.g., 300"
                                            value={formData.recommended_intake}
                                            onChange={(e) => handleInputChange("recommended_intake", parseFloat(e.target.value) || 0)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="per_capita_nutrition" className="text-gray-700">Per Capita
                                            Nutrition *</Label>
                                        <Input
                                            id="per_capita_nutrition"
                                            type="number"
                                            step="0.1"
                                            placeholder="e.g., 200"
                                            value={formData.per_capita_nutrition}
                                            onChange={(e) => handleInputChange("per_capita_nutrition", parseFloat(e.target.value) || 0)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="surplus_deficit" className="text-gray-700">Surplus/Deficit
                                            *</Label>
                                        <Input
                                            id="surplus_deficit"
                                            type="text"
                                            placeholder="e.g., -15 tons or +20 tons"
                                            value={formData.surplus_deficit}
                                            onChange={(e) => handleInputChange("surplus_deficit", e.target.value)}
                                            required
                                        />
                                        <p className="text-xs text-gray-500">Use format: +/-[number] tons</p>
                                    </div>
                                </div>
                            </div>

                            {/* Economic Information */}
                            <div>
                                <h4 className="text-lg font-medium text-gray-900 mb-4">Economic Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="per_capita_income" className="text-gray-700">Per Capita Income
                                            ($) *</Label>
                                        <Input
                                            id="per_capita_income"
                                            type="number"
                                            step="0.01"
                                            placeholder="e.g., 5000"
                                            value={formData.per_capita_income}
                                            onChange={(e) => handleInputChange("per_capita_income", parseFloat(e.target.value) || 0)}
                                            required
                                        />
                                        <p className="text-xs text-gray-500">Annual per capita income in USD</p>
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex gap-4 pt-4 border-t border-gray-200">
                                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                                    <Plus className="h-4 w-4 mr-2"/>
                                    Add Nutrition Record
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}