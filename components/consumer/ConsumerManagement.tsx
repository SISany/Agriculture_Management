"use client"

import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Search, Plus, Edit2, Trash2, Users, MapPin, DollarSign, Home, FileDown} from "lucide-react"
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts"
import {exportTableToPDF} from "@/lib/pdfExport"

interface Consumer {
    id: string
    consumer_id: string
    consumer_name: string
    location: string
    contact_info: string
    per_capita_income: number
    demographic_group: string
    household_size: number
    age_group: string
    occupation: string
    monthly_food_expenditure: number
    preferred_food_types: string[]
}

export default function ConsumerManagement() {
    const [consumers, setConsumers] = useState<Consumer[]>([
        {
            id: "1",
            consumer_id: "C001",
            consumer_name: "Rahman Family",
            location: "Dhaka",
            contact_info: "rahman@email.com",
            per_capita_income: 25000,
            demographic_group: "Middle Class",
            household_size: 5,
            age_group: "30-45",
            occupation: "Government Employee",
            monthly_food_expenditure: 15000,
            preferred_food_types: ["Rice", "Vegetables", "Fish"]
        },
        {
            id: "2",
            consumer_id: "C002",
            consumer_name: "Ahmed Household",
            location: "Chittagong",
            contact_info: "ahmed@email.com",
            per_capita_income: 35000,
            demographic_group: "Upper Middle Class",
            household_size: 4,
            age_group: "25-40",
            occupation: "Business Owner",
            monthly_food_expenditure: 22000,
            preferred_food_types: ["Meat", "Dairy", "Fruits"]
        },
        {
            id: "3",
            consumer_id: "C003",
            consumer_name: "Begum Family",
            location: "Sylhet",
            contact_info: "begum@email.com",
            per_capita_income: 18000,
            demographic_group: "Lower Middle Class",
            household_size: 6,
            age_group: "35-50",
            occupation: "Teacher",
            monthly_food_expenditure: 12000,
            preferred_food_types: ["Rice", "Lentils", "Vegetables"]
        }
    ])

    const [searchTerm, setSearchTerm] = useState("")
    const [selectedLocation, setSelectedLocation] = useState("all")
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState<Omit<Consumer, "id">>({
        consumer_id: "",
        consumer_name: "",
        location: "",
        contact_info: "",
        per_capita_income: 0,
        demographic_group: "",
        household_size: 0,
        age_group: "",
        occupation: "",
        monthly_food_expenditure: 0,
        preferred_food_types: []
    })

    const handleInputChange = (field: keyof Omit<Consumer, "id">, value: string | number | string[]) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const newConsumer: Consumer = {
            ...formData,
            id: Date.now().toString()
        }
        setConsumers([...consumers, newConsumer])
        setFormData({
            consumer_id: "",
            consumer_name: "",
            location: "",
            contact_info: "",
            per_capita_income: 0,
            demographic_group: "",
            household_size: 0,
            age_group: "",
            occupation: "",
            monthly_food_expenditure: 0,
            preferred_food_types: []
        })
        setShowForm(false)
    }

    const handleDelete = (id: string) => {
        setConsumers(consumers.filter(consumer => consumer.id !== id))
    }

    const filteredConsumers = consumers.filter(consumer => {
        const matchesSearch = consumer.consumer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            consumer.location.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesLocation = selectedLocation === "all" || consumer.location === selectedLocation
        return matchesSearch && matchesLocation
    })

    const uniqueLocations = [...new Set(consumers.map(consumer => consumer.location))]

    // Analytics data
    const locationDistribution = uniqueLocations.map(location => ({
        name: location,
        value: consumers.filter(c => c.location === location).length
    }))

    const demographicData = consumers.reduce((acc: Array<{ name: string, value: number }>, consumer) => {
        const existing = acc.find(item => item.name === consumer.demographic_group)
        if (existing) {
            existing.value += 1
        } else {
            acc.push({name: consumer.demographic_group, value: 1})
        }
        return acc
    }, [])

    const totalConsumers = consumers.length
    const avgIncome = Math.round(consumers.reduce((sum, c) => sum + c.per_capita_income, 0) / consumers.length)
    const avgHouseholdSize = Math.round(consumers.reduce((sum, c) => sum + c.household_size, 0) / consumers.length)
    const totalFoodExpenditure = consumers.reduce((sum, c) => sum + c.monthly_food_expenditure, 0)

    const handleExport = () => {
        exportTableToPDF({
            title: 'Consumer Management Report',
            subtitle: 'Agriculture Management System - Consumer Directory',
            filename: 'consumer-management-report.pdf',
            columns: [
                {header: 'Consumer ID', dataKey: 'consumer_id', width: 25},
                {header: 'Full Name', dataKey: 'consumer_name', width: 35},
                {header: 'Location', dataKey: 'location', width: 50},
                {header: 'Demographic Group', dataKey: 'demographic_group', width: 30},
                {header: 'Household Size', dataKey: 'household_size', width: 25}
            ],
            data: filteredConsumers.map(consumer => ({
                consumer_id: consumer.consumer_id,
                consumer_name: consumer.consumer_name,
                location: consumer.location,
                demographic_group: consumer.demographic_group,
                household_size: consumer.household_size
            }))
        })
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-green-100 p-3 rounded-xl border border-green-200">
                                <Users className="h-8 w-8 text-green-600"/>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Consumer Management</h1>
                                <p className="text-gray-600 mt-1">Manage consumer profiles and purchasing patterns</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Button
                                onClick={() => setShowForm(!showForm)}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
                            >
                                <Plus className="h-4 w-4 mr-2"/>
                                Add Consumer
                            </Button>
                            <Button
                                onClick={handleExport}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
                            >
                                <FileDown className="h-4 w-4 mr-2"/>
                                Export Data
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-green-100 p-2 rounded-lg">
                                <Users className="h-5 w-5 text-green-600"/>
                            </div>
                            <span className="text-2xl font-bold text-gray-900">{totalConsumers}</span>
                        </div>
                        <h3 className="font-medium text-gray-900">Total Consumers</h3>
                        <p className="text-sm text-gray-500">Registered profiles</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <DollarSign className="h-5 w-5 text-blue-600"/>
                            </div>
                            <span className="text-2xl font-bold text-gray-900">৳{avgIncome.toLocaleString()}</span>
                        </div>
                        <h3 className="font-medium text-gray-900">Avg Income</h3>
                        <p className="text-sm text-gray-500">Per capita monthly</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-purple-100 p-2 rounded-lg">
                                <Home className="h-5 w-5 text-purple-600"/>
                            </div>
                            <span className="text-2xl font-bold text-gray-900">{avgHouseholdSize}</span>
                        </div>
                        <h3 className="font-medium text-gray-900">Avg Household Size</h3>
                        <p className="text-sm text-gray-500">Family members</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-orange-100 p-2 rounded-lg">
                                <MapPin className="h-5 w-5 text-orange-600"/>
                            </div>
                            <span
                                className="text-2xl font-bold text-gray-900">৳{(totalFoodExpenditure / 1000).toFixed(0)}K</span>
                        </div>
                        <h3 className="font-medium text-gray-900">Total Food Spending</h3>
                        <p className="text-sm text-gray-500">Monthly combined</p>
                    </div>
                </div>

                {/* Data Entry Form */}
                {showForm && (
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">Add New Consumer</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="consumer_id" className="text-gray-700">Consumer ID</Label>
                                    <Input
                                        id="consumer_id"
                                        placeholder="e.g., C001"
                                        value={formData.consumer_id}
                                        onChange={(e) => handleInputChange("consumer_id", e.target.value)}
                                        className="mt-1"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="consumer_name" className="text-gray-700">Consumer Name</Label>
                                    <Input
                                        id="consumer_name"
                                        placeholder="e.g., Rahman Family"
                                        value={formData.consumer_name}
                                        onChange={(e) => handleInputChange("consumer_name", e.target.value)}
                                        className="mt-1"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="location" className="text-gray-700">Location</Label>
                                    <Input
                                        id="location"
                                        placeholder="e.g., Dhaka"
                                        value={formData.location}
                                        onChange={(e) => handleInputChange("location", e.target.value)}
                                        className="mt-1"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="contact_info" className="text-gray-700">Contact Info</Label>
                                    <Input
                                        id="contact_info"
                                        placeholder="e.g., email@example.com"
                                        value={formData.contact_info}
                                        onChange={(e) => handleInputChange("contact_info", e.target.value)}
                                        className="mt-1"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="demographic_group" className="text-gray-700">Demographic
                                        Group</Label>
                                    <Select value={formData.demographic_group}
                                            onValueChange={(value) => handleInputChange("demographic_group", value)}>
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Select group"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Lower Class">Lower Class</SelectItem>
                                            <SelectItem value="Lower Middle Class">Lower Middle Class</SelectItem>
                                            <SelectItem value="Middle Class">Middle Class</SelectItem>
                                            <SelectItem value="Upper Middle Class">Upper Middle Class</SelectItem>
                                            <SelectItem value="Upper Class">Upper Class</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="per_capita_income" className="text-gray-700">Per Capita
                                        Income</Label>
                                    <Input
                                        id="per_capita_income"
                                        type="number"
                                        placeholder="e.g., 25000"
                                        value={formData.per_capita_income}
                                        onChange={(e) => handleInputChange("per_capita_income", parseInt(e.target.value))}
                                        className="mt-1"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                                    Add Consumer
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Table View */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm" id="consumer-table">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Consumer Directory</h3>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                                <Input
                                    placeholder="Search consumers..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            {uniqueLocations.length > 0 && (
                                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                                    <SelectTrigger className="w-48">
                                        <SelectValue placeholder="All Locations"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Locations</SelectItem>
                                        {uniqueLocations.map((location) => (
                                            <SelectItem key={location} value={location}>{location}</SelectItem>
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
                                    <TableHead>Location</TableHead>
                                    <TableHead>Demographic</TableHead>
                                    <TableHead>Income</TableHead>
                                    <TableHead>Household Size</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredConsumers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                            <Users className="h-8 w-8 mx-auto mb-2 text-gray-400"/>
                                            No consumers found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredConsumers.map((consumer) => (
                                        <TableRow key={consumer.id} className="hover:bg-gray-50">
                                            <TableCell className="font-mono text-sm">{consumer.consumer_id}</TableCell>
                                            <TableCell className="font-medium">{consumer.consumer_name}</TableCell>
                                            <TableCell className="text-gray-600">{consumer.location}</TableCell>
                                            <TableCell>
                                                <span
                                                    className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                                    {consumer.demographic_group}
                                                </span>
                                            </TableCell>
                                            <TableCell
                                                className="text-gray-600">৳{consumer.per_capita_income.toLocaleString()}</TableCell>
                                            <TableCell
                                                className="text-gray-600">{consumer.household_size} members</TableCell>
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
                                                        onClick={() => handleDelete(consumer.id)}
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

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Distribution</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={locationDistribution}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {locationDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={[
                                                "#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6"
                                            ][index % 5]}/>
                                        ))}
                                    </Pie>
                                    <Tooltip/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Demographic Groups</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={demographicData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                                    <XAxis
                                        dataKey="name"
                                        stroke="#64748b"
                                        fontSize={12}
                                        label={{value: 'Demographic Group', position: 'insideBottom', offset: -5}}
                                    />
                                    <YAxis
                                        stroke="#64748b"
                                        fontSize={12}
                                        label={{value: 'Number of Consumers', angle: -90, position: 'insideLeft'}}
                                    />
                                    <Tooltip/>
                                    <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]}/>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}