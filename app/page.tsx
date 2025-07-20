"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts"
import {
  Bell,
  ChevronDown,
  Download,
  Filter,
  MoreHorizontal,
  Search,
  Settings,
  TrendingUp,
  Package,
  DollarSign,
  BarChart3,
  FileText,
  Home,
  Wheat,
  Activity,
} from "lucide-react"
import { DataEntryForm } from "@/components/data-entry-form"

// Mock data for agriculture analysis
const demandSupplyData = [
  { month: "Jan", demand: 4000, supply: 3800, price: 45 },
  { month: "Feb", demand: 3000, supply: 3200, price: 42 },
  { month: "Mar", demand: 2000, supply: 2800, price: 38 },
  { month: "Apr", demand: 2780, supply: 3900, price: 35 },
  { month: "May", demand: 1890, supply: 4800, price: 32 },
  { month: "Jun", demand: 2390, supply: 3800, price: 36 },
  { month: "Jul", demand: 3490, supply: 4300, price: 40 },
  { month: "Aug", demand: 4200, supply: 3900, price: 44 },
  { month: "Sep", demand: 3800, supply: 3600, price: 46 },
  { month: "Oct", demand: 4100, supply: 3400, price: 48 },
  { month: "Nov", demand: 4300, supply: 3200, price: 52 },
  { month: "Dec", demand: 4500, supply: 3000, price: 55 },
]

const cropDistribution = [
  { name: "Wheat", value: 35, color: "#8884d8" },
  { name: "Rice", value: 25, color: "#82ca9d" },
  { name: "Corn", value: 20, color: "#ffc658" },
  { name: "Soybeans", value: 12, color: "#ff7300" },
  { name: "Others", value: 8, color: "#00ff88" },
]

const priceVolatility = [
  { product: "Wheat", jan: 45, feb: 42, mar: 38, apr: 35, may: 32, jun: 36 },
  { product: "Rice", jan: 38, feb: 40, mar: 42, apr: 39, may: 37, jun: 41 },
  { product: "Corn", jan: 28, feb: 30, mar: 32, apr: 29, may: 27, jun: 31 },
  { product: "Soybeans", jan: 52, feb: 48, mar: 45, apr: 47, may: 50, jun: 53 },
]

const recentTransactions = [
  {
    id: "TXN001",
    product: "Wheat",
    type: "Purchase",
    quantity: "500 tons",
    price: "$45/ton",
    status: "Completed",
    date: "2024-01-15",
  },
  {
    id: "TXN002",
    product: "Rice",
    type: "Sale",
    quantity: "300 tons",
    price: "$41/ton",
    status: "Pending",
    date: "2024-01-14",
  },
  {
    id: "TXN003",
    product: "Corn",
    type: "Purchase",
    quantity: "750 tons",
    price: "$31/ton",
    status: "Completed",
    date: "2024-01-13",
  },
  {
    id: "TXN004",
    product: "Soybeans",
    type: "Sale",
    quantity: "200 tons",
    price: "$53/ton",
    status: "Processing",
    date: "2024-01-12",
  },
  {
    id: "TXN005",
    product: "Wheat",
    type: "Purchase",
    quantity: "400 tons",
    price: "$44/ton",
    status: "Completed",
    date: "2024-01-11",
  },
]

// Mock Data Entry Form Component

export default function AgricultureAdminPanel() {
  const [activeSection, setActiveSection] = useState("dashboard")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Wheat className="h-8 w-8 text-green-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">AgriAnalytics</span>
              </div>

              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <Button
                  variant={activeSection === "dashboard" ? "default" : "ghost"}
                  onClick={() => setActiveSection("dashboard")}
                  className="inline-flex items-center px-1 pt-1"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="inline-flex items-center px-1 pt-1">
                      <Package className="w-4 h-4 mr-2" />
                      Products
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Crop Categories</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Grains</DropdownMenuItem>
                    <DropdownMenuItem>Vegetables</DropdownMenuItem>
                    <DropdownMenuItem>Fruits</DropdownMenuItem>
                    <DropdownMenuItem>Livestock</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="inline-flex items-center px-1 pt-1">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Analytics
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Analysis Tools</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Demand Forecasting</DropdownMenuItem>
                    <DropdownMenuItem>Supply Chain Analysis</DropdownMenuItem>
                    <DropdownMenuItem>Price Trends</DropdownMenuItem>
                    <DropdownMenuItem>Market Insights</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="inline-flex items-center px-1 pt-1">
                      <FileText className="w-4 h-4 mr-2" />
                      Reports
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Report Types</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Monthly Summary</DropdownMenuItem>
                    <DropdownMenuItem>Quarterly Analysis</DropdownMenuItem>
                    <DropdownMenuItem>Annual Report</DropdownMenuItem>
                    <DropdownMenuItem>Custom Reports</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input type="search" placeholder="Search products..." className="pl-10 w-64" />
              </div>

              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Settings</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Preferences</DropdownMenuItem>
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Agriculture Demand & Supply Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Monitor market trends, analyze demand patterns, and track supply chain metrics
            </p>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Demand</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42,350 tons</div>
                <p className="text-xs text-green-600">+12.5% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Supply</CardTitle>
                <Package className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">38,900 tons</div>
                <p className="text-xs text-red-600">-3.2% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Price</CardTitle>
                <DollarSign className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$42.50</div>
                <p className="text-xs text-green-600">+8.1% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Market Gap</CardTitle>
                <Activity className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3,450 tons</div>
                <p className="text-xs text-red-600">Supply shortage</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="space-y-8 mb-8">
            {/* First Row - Main Trends */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Demand vs Supply Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Demand vs Supply Trends</CardTitle>
                  <CardDescription>Monthly comparison of demand and supply volumes</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      demand: {
                        label: "Demand",
                        color: "#8884d8",
                      },
                      supply: {
                        label: "Supply",
                        color: "#82ca9d",
                      },
                    }}
                    className="h-[350px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={demandSupplyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line type="monotone" dataKey="demand" stroke="#8884d8" strokeWidth={2} />
                        <Line type="monotone" dataKey="supply" stroke="#82ca9d" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Price Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Price Volatility</CardTitle>
                  <CardDescription>Average price trends across different crops</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      price: {
                        label: "Price",
                        color: "#ffc658",
                      },
                    }}
                    className="h-[350px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={demandSupplyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area type="monotone" dataKey="price" stroke="#ffc658" fill="#ffc658" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Second Row - Distribution and Production */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Crop Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Crop Distribution</CardTitle>
                  <CardDescription>Market share by crop type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      value: {
                        label: "Percentage",
                      },
                    }}
                    className="h-[350px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={cropDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {cropDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Supply Chain Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Production</CardTitle>
                  <CardDescription>Production volumes by crop category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      supply: {
                        label: "Supply",
                        color: "#82ca9d",
                      },
                    }}
                    className="h-[350px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={demandSupplyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="supply" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Data Entry Form Section */}
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Add New Entry</CardTitle>
                <CardDescription>Input new product, stock, or sale information</CardDescription>
              </CardHeader>
              <CardContent>
                <DataEntryForm />
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest market transactions and orders</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell>{transaction.product}</TableCell>
                      <TableCell>
                        <Badge variant={transaction.type === "Purchase" ? "default" : "secondary"}>
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.quantity}</TableCell>
                      <TableCell>{transaction.price}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            transaction.status === "Completed"
                              ? "default"
                              : transaction.status === "Pending"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Cancel</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
