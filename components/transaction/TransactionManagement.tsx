"use client"

import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Badge} from "@/components/ui/badge"
import {ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart"
import {BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend} from "recharts"
import {Search, Plus, Edit2, Trash2, ShoppingCart, TrendingUp, DollarSign, Activity} from "lucide-react"

interface Transaction {
    transaction_id: string
    stakeholder_id: string
    stakeholder_name: string
    product_id: string
    product_name: string
    transaction_date: string
    quantity: number
    price_per_unit: number
    total_amount: number
    transaction_type: "Sale" | "Purchase"
    warehouse_id: string
    shipment_id: string
}

const transactions: Transaction[] = [
    {
        transaction_id: "T001",
        stakeholder_id: "S001",
        stakeholder_name: "Ahmed Farms",
        product_id: "P001",
        product_name: "Wheat",
        transaction_date: "2024-01-15",
        quantity: 500,
        price_per_unit: 42,
        total_amount: 21000,
        transaction_type: "Sale",
        warehouse_id: "WH002",
        shipment_id: "SH001"
    },
    {
        transaction_id: "T002",
        stakeholder_id: "S002",
        stakeholder_name: "City Retail Store",
        product_id: "P002",
        product_name: "Rice",
        transaction_date: "2024-01-14",
        quantity: 200,
        price_per_unit: 65,
        total_amount: 13000,
        transaction_type: "Purchase",
        warehouse_id: "WH001",
        shipment_id: "SH002"
    },
    {
        transaction_id: "T003",
        stakeholder_id: "S003",
        stakeholder_name: "Grain Wholesale Co",
        product_id: "P003",
        product_name: "Corn",
        transaction_date: "2024-01-16",
        quantity: 800,
        price_per_unit: 35,
        total_amount: 28000,
        transaction_type: "Purchase",
        warehouse_id: "WH001",
        shipment_id: "SH003"
    },
    {
        transaction_id: "T004",
        stakeholder_id: "S001",
        stakeholder_name: "Ahmed Farms",
        product_id: "P002",
        product_name: "Rice",
        transaction_date: "2024-01-18",
        quantity: 300,
        price_per_unit: 58,
        total_amount: 17400,
        transaction_type: "Sale",
        warehouse_id: "WH002",
        shipment_id: "SH004"
    }
]

// Chart data
const transactionTypeData = [
    {name: "Sales", value: transactions.filter(t => t.transaction_type === "Sale").length, color: "#82ca9d"},
    {name: "Purchases", value: transactions.filter(t => t.transaction_type === "Purchase").length, color: "#8884d8"}
]

const monthlyTransactionData = [
    {month: "Oct", sales: 85000, purchases: 62000},
    {month: "Nov", sales: 72000, purchases: 48000},
    {month: "Dec", sales: 68000, purchases: 55000},
    {month: "Jan", sales: 79400, purchases: 41000},
]

export default function TransactionManagement() {
    const [searchTerm, setSearchTerm] = useState("")

    const filteredTransactions = transactions.filter(transaction =>
        transaction.stakeholder_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.transaction_type.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Transaction Management</h1>
                    <p className="mt-2 text-gray-600">Track all agricultural transactions</p>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                        <Input
                            type="search"
                            placeholder="Search transactions..."
                            className="pl-10 w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button>
                        <Plus className="w-4 h-4 mr-2"/>
                        Add Transaction
                    </Button>
                </div>
            </div>

            {/* Transaction Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-blue-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{transactions.length}</div>
                        <p className="text-xs text-gray-600">All transactions</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${transactions.reduce((sum, t) => sum + t.total_amount, 0).toLocaleString()}
                        </div>
                        <p className="text-xs text-gray-600">Transaction volume</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Sales Volume</CardTitle>
                        <TrendingUp className="h-4 w-4 text-purple-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${transactions.filter(t => t.transaction_type === "Sale").reduce((sum, t) => sum + t.total_amount, 0).toLocaleString()}
                        </div>
                        <p className="text-xs text-gray-600">Total sales</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Average Transaction</CardTitle>
                        <Activity className="h-4 w-4 text-orange-600"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${(transactions.reduce((sum, t) => sum + t.total_amount, 0) / transactions.length).toLocaleString()}
                        </div>
                        <p className="text-xs text-gray-600">Per transaction</p>
                    </CardContent>
                </Card>
            </div>

            {/* Transaction Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Transaction Volume</CardTitle>
                        <CardDescription>Sales vs Purchase trends over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer
                            config={{
                                sales: {label: "Sales", color: "#82ca9d"},
                                purchases: {label: "Purchases", color: "#8884d8"}
                            }}
                            className="h-[300px]"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyTransactionData}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="month"/>
                                    <YAxis/>
                                    <ChartTooltip content={<ChartTooltipContent/>}/>
                                    <Legend/>
                                    <Bar dataKey="sales" fill="#82ca9d"/>
                                    <Bar dataKey="purchases" fill="#8884d8"/>
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Transaction Type Distribution</CardTitle>
                        <CardDescription>Breakdown of sales vs purchases</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer
                            config={{value: {label: "Count"}}}
                            className="h-[300px]"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={transactionTypeData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {transactionTypeData.map((entry, index) => (
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

            {/* Transaction Insights */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Transaction Insights</CardTitle>
                    <CardDescription>Key transaction metrics and patterns</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <h4 className="font-semibold text-green-800 mb-2">Top Product by Volume</h4>
                            <p className="text-sm text-green-700">
                                {(() => {
                                    const acc = transactions.reduce((acc, t) => {
                                        acc[t.product_name] = (acc[t.product_name] || 0) + t.total_amount
                                        return acc
                                    }, {} as Record<string, number>)
                                    return Object.entries(acc).sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A'
                                })()} leads in transaction value
                            </p>
                        </div>

                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h4 className="font-semibold text-blue-800 mb-2">Most Active Stakeholder</h4>
                            <p className="text-sm text-blue-700">
                                {(() => {
                                    const acc = transactions.reduce((acc, t) => {
                                        acc[t.stakeholder_name] = (acc[t.stakeholder_name] || 0) + 1
                                        return acc
                                    }, {} as Record<string, number>)
                                    return Object.entries(acc).sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A'
                                })()} with most transactions
                            </p>
                        </div>

                        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                            <h4 className="font-semibold text-orange-800 mb-2">Price Trends</h4>
                            <p className="text-sm text-orange-700">
                                Average price per unit:
                                ${(transactions.reduce((sum, t) => sum + t.price_per_unit, 0) / transactions.length).toFixed(2)}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Detailed Transaction Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Transaction Records</CardTitle>
                    <CardDescription>Complete transaction history with stakeholder and product details</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Transaction ID</TableHead>
                                <TableHead>Stakeholder</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Price/Unit</TableHead>
                                <TableHead>Total Amount</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Warehouse</TableHead>
                                <TableHead>Shipment</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTransactions.map((transaction) => (
                                <TableRow key={transaction.transaction_id}>
                                    <TableCell className="font-medium">{transaction.transaction_id}</TableCell>
                                    <TableCell>{transaction.stakeholder_name}</TableCell>
                                    <TableCell>{transaction.product_name}</TableCell>
                                    <TableCell>{transaction.transaction_date}</TableCell>
                                    <TableCell>{transaction.quantity} tons</TableCell>
                                    <TableCell>${transaction.price_per_unit}</TableCell>
                                    <TableCell>
                                        <span
                                            className="font-semibold">${transaction.total_amount.toLocaleString()}</span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={transaction.transaction_type === "Sale" ? "default" : "secondary"}>
                                            {transaction.transaction_type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{transaction.warehouse_id}</TableCell>
                                    <TableCell>{transaction.shipment_id}</TableCell>
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