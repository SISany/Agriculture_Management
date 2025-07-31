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
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    LineChart,
    Line,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    Legend
} from "recharts"
import {Search, Download, Plus, Edit2, Trash2, Activity, Heart, AlertCircle, TrendingUp, Apple} from "lucide-react"

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
        health_status: "Healthy"
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
        health_status: "Healthy"
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
        health_status: "Moderate Risk"
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
        health_status: "Healthy"
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
        health_status: "Healthy"
    }
]

// Chart data
const nutritionTrends = [
    {month: "Jan", carbohydrates: 245, protein: 175, fiber: 115, vitamins: 92, minerals: 205},
    {month: "Feb", carbohydrates: 255, protein: 180, fiber: 120, vitamins: 95, minerals: 210},
    {month: "Mar", carbohydrates: 260, protein: 185, fiber: 125, vitamins: 98, minerals: 215},
    {month: "Apr", carbohydrates: 250, protein: 190, fiber: 130, vitamins: 100, minerals: 220},
    {month: "May", carbohydrates: 265, protein: 185, fiber: 135, vitamins: 105, minerals: 225},
    {month: "Jun", carbohydrates: 270, protein: 195, fiber: 140, vitamins: 110, minerals: 230}
]

const recommendedVsActual = [
    {nutrient: "Carbs", recommended: 300, actual: 250, deficit: -50},
    {nutrient: "Protein", recommended: 200, actual: 180, deficit: -20},
    {nutrient: "Fiber", recommended: 150, actual: 120, deficit: -30},
    {nutrient: "Vitamins", recommended: 100, actual: 95, deficit: -5},
    {nutrient: "Minerals", recommended: 180, actual: 220, deficit: 40}
]

const demographicNutrition = [
    {demographic: "Upper Class", carbs: 280, protein: 200, fiber: 140, vitamins: 110, minerals: 240},
    {demographic: "Upper Middle", carbs: 270, protein: 190, fiber: 130, vitamins: 105, minerals: 220},
    {demographic: "Middle Class", carbs: 250, protein: 175, fiber: 120, vitamins: 95, minerals: 200},
    {demographic: "Lower Middle", carbs: 230, protein: 160, fiber: 110, vitamins: 85, minerals: 180}
]

const radarData = [
    {subject: "Carbohydrates", A: 250, B: 300, fullMark: 350},
    {subject: "Protein", A: 180, B: 200, fullMark: 250},
    {subject: "Fiber", A: 120, B: 150, fullMark: 200},
    {subject: "Vitamins", A: 95, B: 100, fullMark: 120},
    {subject: "Minerals", A: 220, B: 180, fullMark: 250}
]

export default function NutritionIntake() {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedNutritionType, setSelectedNutritionType] = useState("all")
    const [selectedDemographic, setSelectedDemographic] = useState("all")
    const [selectedHealthStatus, setSelectedHealthStatus] = useState("all")

    const filteredData = nutritionIntakes.filter(intake => {
        const matchesSearch = intake.stakeholder_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            intake.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            intake.nutrition_type.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesNutritionType = selectedNutritionType === "all" || intake.nutrition_type === selectedNutritionType
        const matchesDemographic = selectedDemographic === "all" || intake.demographic_group === selectedDemographic
        const matchesHealthStatus = selectedHealthStatus === "all" || intake.health_status === selectedHealthStatus

        return matchesSearch && matchesNutritionType && matchesDemographic && matchesHealthStatus
    })

    const avgIntake = filteredData.reduce((sum, intake) => sum + intake.per_capita_nutrition_intake, 0) / filteredData.length || 0
    const avgRecommended = filteredData.reduce((sum, intake) => sum + intake.recommended_intake, 0) / filteredData.length || 0
    const nutritionGap = avgRecommended - avgIntake
    const complianceRate = (avgIntake / avgRecommended) * 100 || 0

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Nutrition Intake Analysis</h1>
                    <p className="text-sm text-gray-600">Monitor and analyze per capita nutritional intake patterns</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2"/>
                        Export Report
                    </Button>
                    <Button size="sm">
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

            {/* Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Nutrition Trends Over Time</CardTitle>
                        <CardDescription>Monthly nutrition intake patterns</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={nutritionTrends}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="month"/>
                                    <YAxis/>
                                    <ChartTooltip content={<ChartTooltipContent/>}/>
                                    <Legend/>
                                    <Line type="monotone" dataKey="carbohydrates" stroke="#8884d8" strokeWidth={2}/>
                                    <Line type="monotone" dataKey="protein" stroke="#82ca9d" strokeWidth={2}/>
                                    <Line type="monotone" dataKey="fiber" stroke="#ffc658" strokeWidth={2}/>
                                    <Line type="monotone" dataKey="vitamins" stroke="#ff7300" strokeWidth={2}/>
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recommended vs Actual Intake</CardTitle>
                        <CardDescription>Nutrient intake compared to recommendations</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={recommendedVsActual}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="nutrient"/>
                                    <YAxis/>
                                    <ChartTooltip content={<ChartTooltipContent/>}/>
                                    <Legend/>
                                    <Bar dataKey="recommended" fill="#8884d8" name="Recommended"/>
                                    <Bar dataKey="actual" fill="#82ca9d" name="Actual Intake"/>
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Nutrition by Demographic</CardTitle>
                        <CardDescription>Intake patterns across demographic groups</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={demographicNutrition}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="demographic"/>
                                    <YAxis/>
                                    <ChartTooltip content={<ChartTooltipContent/>}/>
                                    <Legend/>
                                    <Bar dataKey="carbs" stackId="a" fill="#8884d8"/>
                                    <Bar dataKey="protein" stackId="a" fill="#82ca9d"/>
                                    <Bar dataKey="fiber" stackId="a" fill="#ffc658"/>
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Nutrition Profile</CardTitle>
                        <CardDescription>Comprehensive nutrition intake radar</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart data={radarData}>
                                    <PolarGrid/>
                                    <PolarAngleAxis dataKey="subject"/>
                                    <PolarRadiusAxis/>
                                    <Radar name="Actual" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6}/>
                                    <Radar name="Recommended" dataKey="B" stroke="#82ca9d" fill="#82ca9d"
                                           fillOpacity={0.6}/>
                                    <Legend/>
                                </RadarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
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
                        <Select value={selectedNutritionType} onValueChange={setSelectedNutritionType}>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Nutrition Type"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="Carbohydrates">Carbohydrates</SelectItem>
                                <SelectItem value="Protein">Protein</SelectItem>
                                <SelectItem value="Fiber">Fiber</SelectItem>
                                <SelectItem value="Vitamins">Vitamins</SelectItem>
                                <SelectItem value="Minerals">Minerals</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={selectedDemographic} onValueChange={setSelectedDemographic}>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Demographic"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Groups</SelectItem>
                                <SelectItem value="Upper Class">Upper Class</SelectItem>
                                <SelectItem value="Upper Middle Class">Upper Middle Class</SelectItem>
                                <SelectItem value="Middle Class">Middle Class</SelectItem>
                                <SelectItem value="Lower Middle Class">Lower Middle Class</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={selectedHealthStatus} onValueChange={setSelectedHealthStatus}>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Health Status"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="Healthy">Healthy</SelectItem>
                                <SelectItem value="Moderate Risk">Moderate Risk</SelectItem>
                                <SelectItem value="High Risk">High Risk</SelectItem>
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
                                    <TableHead>Compliance</TableHead>
                                    <TableHead>Demographic</TableHead>
                                    <TableHead>Health Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.map((intake) => {
                                    const gap = intake.recommended_intake - intake.per_capita_nutrition_intake
                                    const compliance = (intake.per_capita_nutrition_intake / intake.recommended_intake) * 100
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
                                                    variant={compliance >= 100 ? "default" :
                                                        compliance >= 80 ? "secondary" : "destructive"}
                                                >
                                                    {compliance.toFixed(1)}%
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">{intake.demographic_group}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={intake.health_status === "Healthy" ? "default" :
                                                        intake.health_status === "Moderate Risk" ? "secondary" : "destructive"}
                                                >
                                                    {intake.health_status}
                                                </Badge>
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
        </div>
    )
}