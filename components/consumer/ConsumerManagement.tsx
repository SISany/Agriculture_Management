"use client"

import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Badge} from "@/components/ui/badge"
import {Search, Plus, Edit2, Trash2, Users, DollarSign, Home, TrendingUp} from "lucide-react"

interface Consumer {
    stakeholder_id: string
    stakeholder_name: string
    location: string
    contact_info: string
    per_capita_income: number
    demographic_group: string
    household_size: number
}

const consumers: Consumer[] = [
    {
        stakeholder_id: "S004",
        stakeholder_name: "Rahman Family",
        location: "Sylhet",
        contact_info: "rahman@email.com",
        per_capita_income: 25000,
        demographic_group: "Middle Class",
        household_size: 5
    },
    {
        stakeholder_id: "S005",
        stakeholder_name: "Ahmed Household",
        location: "Dhaka",
        contact_info: "ahmed.family@email.com",
        per_capita_income: 35000,
        demographic_group: "Upper Middle Class",
        household_size: 4
    },
    {
        stakeholder_id: "S006",
        stakeholder_name: "Khan Family",
        location: "Chittagong",
        contact_info: "khan.home@email.com",
        per_capita_income: 18000,
        demographic_group: "Lower Middle Class",
        household_size: 6
    },
    {
        stakeholder_id: "S007",
        stakeholder_name: "Begum Household",
        location: "Rajshahi",
        contact_info: "begum.family@email.com",
        per_capita_income: 45000,
        demographic_group: "Upper Class",
        household_size: 3
    },
    {
        stakeholder_id: "S008",
        stakeholder_name: "Islam Family",
        location: "Khulna",
        contact_info: "islam.home@email.com",
        per_capita_income: 22000,
        demographic_group: "Middle Class",
        household_size: 5
    }
]

export default function ConsumerManagement() {
    const [searchTerm, setSearchTerm] = useState("")

    const filteredConsumers = consumers.filter(consumer =>
        consumer.stakeholder_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consumer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consumer.demographic_group.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consumer.contact_info.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getDemographicColor = (group: string) => {
        switch (group) {
            case "Upper Class":
                return "bg-purple-100 text-purple-800"
            case "Upper Middle Class":
                return "bg-blue-100 text-blue-800"
            case "Middle Class":
                return "bg-green-100 text-green-800"
            case "Lower Middle Class":
                return "bg-yellow-100 text-yellow-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Consumer Management</h1>
                    <p className="mt-2 text-gray-600">Manage consumer demographics and profiles</p>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                        <Input
                            type="search"
                            placeholder="Search consumers..."
                            className="pl-10 w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button>
                        <Plus className="w-4 h-4 mr-2"/>
                        Add Consumer
                    </Button>
                </div>
            </div>

            {/* Consumer Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Total Consumers</CardTitle>
                        <Users className="h-4 w-4 text-blue-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{consumers.length}</div>
                        <p className="text-xs text-gray-600">Registered consumers</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Avg Income</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${(consumers.reduce((sum, c) => sum + c.per_capita_income, 0) / consumers.length).toLocaleString()}
                        </div>
                        <p className="text-xs text-gray-600">Per capita income</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Avg Household Size</CardTitle>
                        <Home className="h-4 w-4 text-purple-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {(consumers.reduce((sum, c) => sum + c.household_size, 0) / consumers.length).toFixed(1)}
                        </div>
                        <p className="text-xs text-gray-600">People per household</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Total Population</CardTitle>
                        <TrendingUp className="h-4 w-4 text-orange-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {consumers.reduce((sum, c) => sum + c.household_size, 0)}
                        </div>
                        <p className="text-xs text-gray-600">People covered</p>
                    </CardContent>
                </Card>
            </div>

            {/* Consumer Analytics */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Demographic Distribution</CardTitle>
                        <CardDescription>Consumer distribution by demographic groups</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {Array.from(new Set(consumers.map(c => c.demographic_group))).map((group) => {
                                const count = consumers.filter(c => c.demographic_group === group).length
                                const avgIncome = consumers.filter(c => c.demographic_group === group)
                                    .reduce((sum, c) => sum + c.per_capita_income, 0) / count
                                const percentage = (count / consumers.length) * 100
                                return (
                                    <div key={group} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-4 h-4 rounded ${
                                                group === "Upper Class" ? "bg-purple-500" :
                                                    group === "Upper Middle Class" ? "bg-blue-500" :
                                                        group === "Middle Class" ? "bg-green-500" :
                                                            group === "Lower Middle Class" ? "bg-yellow-500" : "bg-gray-500"
                                            }`}></div>
                                            <span className="text-sm font-medium">{group}</span>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <span className="text-sm text-gray-600">{count} consumers</span>
                                            <span
                                                className="text-sm text-gray-600">Avg: ${avgIncome.toLocaleString()}</span>
                                            <Badge variant="outline">{percentage.toFixed(0)}%</Badge>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Geographic Distribution</CardTitle>
                        <CardDescription>Consumer distribution by location</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {Array.from(new Set(consumers.map(c => c.location))).map((location) => {
                                const count = consumers.filter(c => c.location === location).length
                                const totalHouseholds = consumers.filter(c => c.location === location)
                                    .reduce((sum, c) => sum + c.household_size, 0)
                                const percentage = (count / consumers.length) * 100
                                return (
                                    <div key={location} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-4 h-4 bg-indigo-500 rounded"></div>
                                            <span className="text-sm font-medium">{location}</span>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <span className="text-sm text-gray-600">{count} families</span>
                                            <span className="text-sm text-gray-600">{totalHouseholds} people</span>
                                            <Badge variant="outline">{percentage.toFixed(0)}%</Badge>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Consumer Insights */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Consumer Insights</CardTitle>
                    <CardDescription>Key demographic insights and market analysis</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <h4 className="font-semibold text-green-800 mb-2">Purchasing Power</h4>
                            <p className="text-sm text-green-700">
                                Total household income:
                                ${consumers.reduce((sum, c) => sum + (c.per_capita_income * c.household_size), 0).toLocaleString()}
                                across all consumer households
                            </p>
                        </div>

                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h4 className="font-semibold text-blue-800 mb-2">Market Segments</h4>
                            <p className="text-sm text-blue-700">
                                {consumers.filter(c => c.per_capita_income > 30000).length} high-income
                                and {consumers.filter(c => c.per_capita_income < 20000).length} low-income households
                            </p>
                        </div>

                        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                            <h4 className="font-semibold text-orange-800 mb-2">Family Structure</h4>
                            <p className="text-sm text-orange-700">
                                {consumers.filter(c => c.household_size >= 5).length} large families (5+ members)
                                and {consumers.filter(c => c.household_size < 4).length} small families
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Detailed Consumer Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Consumer Records</CardTitle>
                    <CardDescription>Complete consumer demographics and profile information</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Consumer ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Per Capita Income</TableHead>
                                <TableHead>Demographic Group</TableHead>
                                <TableHead>Household Size</TableHead>
                                <TableHead>Total Income</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredConsumers.map((consumer) => (
                                <TableRow key={consumer.stakeholder_id}>
                                    <TableCell className="font-medium">{consumer.stakeholder_id}</TableCell>
                                    <TableCell>{consumer.stakeholder_name}</TableCell>
                                    <TableCell>{consumer.location}</TableCell>
                                    <TableCell>{consumer.contact_info}</TableCell>
                                    <TableCell>${consumer.per_capita_income.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Badge className={getDemographicColor(consumer.demographic_group)}>
                                            {consumer.demographic_group}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex space-x-1 items-center">
                                            <Home className="w-3 h-3"/>
                                            <span>{consumer.household_size} people</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                    <span className="font-semibold">
                      ${(consumer.per_capita_income * consumer.household_size).toLocaleString()}
                    </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
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