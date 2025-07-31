"use client"

import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Search, Plus, Edit2, Trash2} from "lucide-react"

interface Product {
    product_id: number
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

const products: Product[] = [
    {
        product_id: 1,
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
        product_id: 2,
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
        product_id: 3,
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
    const [searchTerm, setSearchTerm] = useState("")

    const filteredProducts = products.filter(product =>
        product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.product_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.variety.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
                    <p className="mt-2 text-gray-600">Manage agricultural products and their specifications</p>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                        <Input
                            type="search"
                            placeholder="Search products..."
                            className="pl-10 w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button>
                        <Plus className="w-4 h-4 mr-2"/>
                        Add Product
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Products</CardTitle>
                    <CardDescription>List of all agricultural products</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product ID</TableHead>
                                <TableHead>Product Name</TableHead>
                                <TableHead>Product Type</TableHead>
                                <TableHead>Product Type Alt</TableHead>
                                <TableHead>Variety</TableHead>
                                <TableHead>Sowing Time</TableHead>
                                <TableHead>Transplanting Time</TableHead>
                                <TableHead>Harvest Time</TableHead>
                                <TableHead>Seed Requirement/Acre</TableHead>
                                <TableHead>Nutritional Value/Unit</TableHead>
                                <TableHead>Storage Requirements</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProducts.map((product) => (
                                <TableRow key={product.product_id}>
                                    <TableCell className="font-medium">{product.product_id}</TableCell>
                                    <TableCell>{product.product_name}</TableCell>
                                    <TableCell>{product.product_type}</TableCell>
                                    <TableCell>{product.product_type_alt}</TableCell>
                                    <TableCell>{product.variety}</TableCell>
                                    <TableCell>{new Date(product.sowing_time).toLocaleDateString()}</TableCell>
                                    <TableCell>{product.transplanting_time === "N/A" ? "N/A" : new Date(product.transplanting_time).toLocaleDateString()}</TableCell>
                                    <TableCell>{new Date(product.harvest_time).toLocaleDateString()}</TableCell>
                                    <TableCell>{product.seed_requirement_per_acre} kg</TableCell>
                                    <TableCell>{product.nutritional_value_per_unit} kcal</TableCell>
                                    <TableCell className="max-w-xs truncate">{product.storage_requirements}</TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <Button variant="outline" size="sm"
                                                    className="text-blue-600 border-blue-200 hover:bg-blue-50">
                                                <Edit2 className="w-4 h-4"/>
                                            </Button>
                                            <Button variant="outline" size="sm"
                                                    className="text-red-600 border-red-200 hover:bg-red-50">
                                                <Trash2 className="w-4 h-4"/>
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