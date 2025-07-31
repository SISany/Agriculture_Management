"use client"

import {useState, useEffect} from "react"
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
  Search,
  Settings,
  Package,
  BarChart3,
  Home,
  Wheat,
  Users,
  CloudRain,
  ShoppingCart,
  Factory,
  Plus,
  Edit,
  Trash2,
} from "lucide-react"

// Mock data based on ERD structure

// Products data
const products = [
  {
    product_id: "P001",
    product_name: "Wheat",
    product_type: "Grain",
    variety: "Winter Wheat",
    sowing_time: "October-November",
    transplanting_time: "N/A",
    harvest_time: "April-May",
    seed_requirement_per_acre: "40-50 kg"
  },
  {
    product_id: "P002",
    product_name: "Rice",
    product_type: "Grain",
    variety: "Basmati",
    sowing_time: "June-July",
    transplanting_time: "July-August",
    harvest_time: "November-December",
    seed_requirement_per_acre: "20-25 kg"
  },
  {
    product_id: "P003",
    product_name: "Corn",
    product_type: "Grain",
    variety: "Sweet Corn",
    sowing_time: "March-April",
    transplanting_time: "N/A",
    harvest_time: "July-August",
    seed_requirement_per_acre: "15-20 kg"
  }
]

// Production data
const production = [
  {
    production_id: "PR001",
    product_id: "P001",
    product_name: "Wheat",
    district_division: "Dhaka",
    date: "2024-01-15",
    quantity_produced: 5000,
    surplus_deficit: 500
  },
  {
    production_id: "PR002",
    product_id: "P002",
    product_name: "Rice",
    district_division: "Chittagong",
    date: "2024-01-10",
    quantity_produced: 3000,
    surplus_deficit: -200
  }
]

// Price History data
const priceHistory = [
  {
    price_id: "PH001",
    product_id: "P001",
    product_name: "Wheat",
    date_recorded: "2024-01-15",
    location: "Dhaka",
    wholesale_price: 40,
    retail_price: 45,
    harvest_season_price: 38
  },
  {
    price_id: "PH002",
    product_id: "P002",
    product_name: "Rice",
    date_recorded: "2024-01-15",
    location: "Chittagong",
    wholesale_price: 60,
    retail_price: 68,
    harvest_season_price: 55
  }
]

// Stakeholders data
const stakeholders = [
  {
    stakeholder_id: "S001",
    stakeholder_name: "Ahmed Farms",
    location: "Dhaka",
    contact_info: "ahmed@farms.com",
    stakeholder_type: "Farmer",
    farm_size: "50 acres",
    registration_date: "2023-01-15"
  },
  {
    stakeholder_id: "S002",
    stakeholder_name: "City Retail Store",
    location: "Chittagong",
    contact_info: "info@citystore.com",
    stakeholder_type: "Retailer",
    shop_type: "Grocery Store",
    customer_base: "5000+"
  },
  {
    stakeholder_id: "S003",
    stakeholder_name: "Grain Wholesale Co",
    location: "Dhaka",
    contact_info: "contact@grainwholesale.com",
    stakeholder_type: "Wholesaler",
    business_license: "WH-2023-001",
    storage_capacity: "10000 tons"
  }
]

// Transactions data
const transactions = [
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
    transaction_type: "Sale"
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
    transaction_type: "Purchase"
  }
]

// Weather data
const weather: WeatherData[] = [
  {
    weather_id: "W001",
    location: "Dhaka",
    date_recorded: "2024-01-15",
    rainfall: 15.2,
    temperature: 25.8,
    season: "Winter",
    humidity: 72,
    pressure: 1015,
    wind_speed: 2.8,
    weather_description: "partly cloudy",
    weather_main: "Clouds",
    feels_like: 27.2
  },
  {
    weather_id: "W002",
    location: "Chittagong",
    date_recorded: "2024-01-15",
    rainfall: 8.5,
    temperature: 24.2,
    season: "Winter",
    humidity: 75,
    pressure: 1012,
    wind_speed: 3.5,
    weather_description: "clear sky",
    weather_main: "Clear",
    feels_like: 25.8
  },
  {
    weather_id: "W003",
    location: "Sylhet",
    date_recorded: "2024-01-15",
    rainfall: 22.1,
    temperature: 23.5,
    season: "Winter",
    humidity: 78,
    pressure: 1010,
    wind_speed: 2.2,
    weather_description: "light rain",
    weather_main: "Rain",
    feels_like: 24.8
  },
  {
    weather_id: "W004",
    location: "Rajshahi",
    date_recorded: "2024-01-15",
    rainfall: 3.2,
    temperature: 22.8,
    season: "Winter",
    humidity: 65,
    pressure: 1018,
    wind_speed: 1.8,
    weather_description: "clear sky",
    weather_main: "Clear",
    feels_like: 23.5
  },
  {
    weather_id: "W005",
    location: "Khulna",
    date_recorded: "2024-01-15",
    rainfall: 12.8,
    temperature: 24.5,
    season: "Winter",
    humidity: 70,
    pressure: 1014,
    wind_speed: 2.5,
    weather_description: "scattered clouds",
    weather_main: "Clouds",
    feels_like: 26.1
  },
  {
    weather_id: "W006",
    location: "Barisal",
    date_recorded: "2024-01-15",
    rainfall: 18.7,
    temperature: 25.1,
    season: "Winter",
    humidity: 74,
    pressure: 1013,
    wind_speed: 3.1,
    weather_description: "moderate rain",
    weather_main: "Rain",
    feels_like: 26.8
  },
  {
    weather_id: "W007",
    location: "Rangpur",
    date_recorded: "2024-01-15",
    rainfall: 5.8,
    temperature: 21.9,
    season: "Winter",
    humidity: 68,
    pressure: 1016,
    wind_speed: 2.0,
    weather_description: "few clouds",
    weather_main: "Clouds",
    feels_like: 22.8
  }
]

// Chart data
const demandSupplyData = [
  { month: "Jan", demand: 4000, supply: 3800, price: 45 },
  { month: "Feb", demand: 3000, supply: 3200, price: 42 },
  { month: "Mar", demand: 2000, supply: 2800, price: 38 },
  { month: "Apr", demand: 2780, supply: 3900, price: 35 },
  { month: "May", demand: 1890, supply: 4800, price: 32 },
  { month: "Jun", demand: 2390, supply: 3800, price: 36 },
]

const cropDistribution = [
  { name: "Wheat", value: 35, color: "#8884d8" },
  { name: "Rice", value: 25, color: "#82ca9d" },
  { name: "Corn", value: 20, color: "#ffc658" },
  { name: "Soybeans", value: 12, color: "#ff7300" },
  { name: "Others", value: 8, color: "#00ff88" },
]

interface WeatherData {
  weather_id: string
  location: string
  date_recorded: string
  rainfall: number
  temperature: number
  season: string
  humidity?: number
  pressure?: number
  wind_speed?: number
  weather_description?: string
  weather_main?: string
  feels_like?: number
}

export default function AgricultureManagementSystem() {
  const [activeSection, setActiveSection] = useState("dashboard")

  // Weather API state management with proper typing
  const [weatherData, setWeatherData] = useState<WeatherData[]>([])
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [weatherError, setWeatherError] = useState<string | null>(null)

  // Function to fetch weather data
  const fetchWeatherData = async () => {
    setWeatherLoading(true)
    setWeatherError(null)

    try {
      const response = await fetch('/api/weather', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      })

      const result = await response.json()

      if (!response.ok) {
        if (result.fallback) {
          // API key not configured, use fallback data
          setWeatherError(result.error)
          setWeatherData(weather)
        } else {
          throw new Error(result.error || 'Failed to fetch weather data')
        }
      } else {
        // Successfully got data from API
        setWeatherData(result.data)
        setWeatherError(null)
      }
    } catch (error) {
      console.error('Error fetching weather data:', error)
      setWeatherError('Failed to load weather data. Using fallback data.')
      // Fallback to demo data if API fails
      setWeatherData(weather)
    } finally {
      setWeatherLoading(false)
    }
  }

  // Fetch weather data when weather section is active
  useEffect(() => {
    if (activeSection === "weather") {
      fetchWeatherData()
    }
  }, [activeSection])

  // Use weather data from API or fallback to mock data
  const currentWeatherData = weatherData.length > 0 ? weatherData : weather

  const renderDashboard = () => (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Agriculture Management Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Comprehensive overview of agricultural production, demand, supply and market analytics
          </p>
        </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-blue-600"/>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{products.length}</div>
            <p className="text-xs text-green-600">Active products</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Production</CardTitle>
            <Factory className="h-4 w-4 text-green-600"/>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {production.reduce((sum, p) => sum + p.quantity_produced, 0).toLocaleString()} tons
            </div>
            <p className="text-xs text-green-600">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <ShoppingCart className="h-4 w-4 text-purple-600"/>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{transactions.length}</div>
            <p className="text-xs text-blue-600">Recent transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Stakeholders</CardTitle>
            <Users className="h-4 w-4 text-yellow-600"/>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{stakeholders.length}</div>
            <p className="text-xs text-green-600">Registered users</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Demand vs Supply Trends</CardTitle>
            <CardDescription className="text-sm">Monthly comparison of demand and supply volumes</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
                config={{
                  demand: {label: "Demand", color: "#8884d8"},
                  supply: {label: "Supply", color: "#82ca9d"},
                }}
                className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={demandSupplyData}>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis dataKey="month"/>
                  <YAxis/>
                  <ChartTooltip content={<ChartTooltipContent/>}/>
                  <Legend/>
                  <Line type="monotone" dataKey="demand" stroke="#8884d8" strokeWidth={2}/>
                  <Line type="monotone" dataKey="supply" stroke="#82ca9d" strokeWidth={2}/>
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Crop Distribution</CardTitle>
            <CardDescription className="text-sm">Market share by crop type</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
                config={{value: {label: "Percentage"}}}
                className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                      data={cropDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                  >
                    {cropDistribution.map((entry, index) => (
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

      {/* Recent Activity Summary */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
            <CardDescription className="text-sm">Latest transaction activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.slice(0, 3).map((transaction) => (
                  <div key={transaction.transaction_id}
                       className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{transaction.product_name}</p>
                      <p className="text-xs text-gray-600">{transaction.stakeholder_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">${transaction.total_amount.toLocaleString()}</p>
                      <Badge variant={transaction.transaction_type === "Sale" ? "default" : "secondary"}
                             className="text-xs">
                        {transaction.transaction_type}
                      </Badge>
                    </div>
                  </div>
              ))}
              <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-sm"
                  onClick={() => setActiveSection("transactions")}
              >
                View All Transactions
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Weather Overview</CardTitle>
            <CardDescription className="text-sm">Current weather conditions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentWeatherData.slice(0, 2).map((record) => (
                  <div key={record.weather_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{record.location}</p>
                      <p className="text-xs text-gray-600">{record.season}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{record.temperature}°C</p>
                      <p className="text-xs text-gray-600">{record.rainfall}mm</p>
                    </div>
                  </div>
              ))}
              <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-sm"
                  onClick={() => setActiveSection("weather")}
              >
                View All Weather Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderProducts = () => (
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
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Variety</TableHead>
                  <TableHead>Sowing Time</TableHead>
                  <TableHead>Harvest Time</TableHead>
                  <TableHead>Seed Requirement</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                    <TableRow key={product.product_id}>
                      <TableCell className="font-medium">{product.product_id}</TableCell>
                      <TableCell>{product.product_name}</TableCell>
                      <TableCell>{product.product_type}</TableCell>
                      <TableCell>{product.variety}</TableCell>
                      <TableCell>{product.sowing_time}</TableCell>
                      <TableCell>{product.harvest_time}</TableCell>
                      <TableCell>{product.seed_requirement_per_acre}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4"/>
                          </Button>
                          <Button variant="outline" size="sm">
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

  const renderProduction = () => (
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
              />
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2"/>
              Add Production Record
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Production Records</CardTitle>
            <CardDescription>Regional production data</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Production ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>District/Division</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Quantity Produced</TableHead>
                  <TableHead>Surplus/Deficit</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {production.map((record) => (
                    <TableRow key={record.production_id}>
                      <TableCell className="font-medium">{record.production_id}</TableCell>
                      <TableCell>{record.product_name}</TableCell>
                      <TableCell>{record.district_division}</TableCell>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.quantity_produced.toLocaleString()} tons</TableCell>
                      <TableCell>
                        <Badge variant={record.surplus_deficit > 0 ? "default" : "destructive"}>
                          {record.surplus_deficit > 0 ? '+' : ''}{record.surplus_deficit} tons
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4"/>
                          </Button>
                          <Button variant="outline" size="sm">
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

  const renderPriceHistory = () => (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Price History & Analytics</h1>
            <p className="mt-2 text-gray-600">Track price trends and market analytics</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2"/>
            Add Price Record
          </Button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Price Trends</CardTitle>
            <CardDescription>Monthly price variations</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
                config={{price: {label: "Price", color: "#ffc658"}}}
                className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={demandSupplyData}>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis dataKey="month"/>
                  <YAxis/>
                  <ChartTooltip content={<ChartTooltipContent/>}/>
                  <Area type="monotone" dataKey="price" stroke="#ffc658" fill="#ffc658" fillOpacity={0.3}/>
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Production Volume</CardTitle>
            <CardDescription>Monthly production by region</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
                config={{supply: {label: "Supply", color: "#82ca9d"}}}
                className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demandSupplyData}>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis dataKey="month"/>
                  <YAxis/>
                  <ChartTooltip content={<ChartTooltipContent/>}/>
                  <Bar dataKey="supply" fill="#82ca9d"/>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Price History Records</CardTitle>
          <CardDescription>Historical pricing data by location</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Price ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Wholesale Price</TableHead>
                <TableHead>Retail Price</TableHead>
                <TableHead>Harvest Season Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {priceHistory.map((record) => (
                  <TableRow key={record.price_id}>
                    <TableCell className="font-medium">{record.price_id}</TableCell>
                    <TableCell>{record.product_name}</TableCell>
                    <TableCell>{record.date_recorded}</TableCell>
                    <TableCell>{record.location}</TableCell>
                    <TableCell>${record.wholesale_price}</TableCell>
                    <TableCell>${record.retail_price}</TableCell>
                    <TableCell>${record.harvest_season_price}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4"/>
                        </Button>
                        <Button variant="outline" size="sm">
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

  const renderTransactions = () => (
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
              />
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2"/>
              Add Transaction
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transaction Records</CardTitle>
            <CardDescription>All stakeholder transactions</CardDescription>
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
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                    <TableRow key={transaction.transaction_id}>
                      <TableCell className="font-medium">{transaction.transaction_id}</TableCell>
                      <TableCell>{transaction.stakeholder_name}</TableCell>
                      <TableCell>{transaction.product_name}</TableCell>
                      <TableCell>{transaction.transaction_date}</TableCell>
                      <TableCell>{transaction.quantity} tons</TableCell>
                      <TableCell>${transaction.price_per_unit}</TableCell>
                      <TableCell>${transaction.total_amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={transaction.transaction_type === "Sale" ? "default" : "secondary"}>
                          {transaction.transaction_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4"/>
                          </Button>
                          <Button variant="outline" size="sm">
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

  const renderStakeholders = () => (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Stakeholder Management</h1>
            <p className="mt-2 text-gray-600">Manage farmers, retailers, and wholesalers</p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
              <Input
                  type="search"
                  placeholder="Search stakeholders..."
                  className="pl-10 w-64"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Filter by Type
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>All</DropdownMenuItem>
                <DropdownMenuItem>Farmers</DropdownMenuItem>
                <DropdownMenuItem>Retailers</DropdownMenuItem>
                <DropdownMenuItem>Wholesalers</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button>
              <Plus className="w-4 h-4 mr-2"/>
              Add Stakeholder
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Farmers</CardTitle>
              <CardDescription>Registered farmers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stakeholders.filter(s => s.stakeholder_type === "Farmer").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Retailers</CardTitle>
              <CardDescription>Retail partners</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stakeholders.filter(s => s.stakeholder_type === "Retailer").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Wholesalers</CardTitle>
              <CardDescription>Wholesale partners</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stakeholders.filter(s => s.stakeholder_type === "Wholesaler").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Stakeholders</CardTitle>
            <CardDescription>Complete stakeholder directory</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stakeholder ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Additional Info</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stakeholders.map((stakeholder) => (
                    <TableRow key={stakeholder.stakeholder_id}>
                      <TableCell className="font-medium">{stakeholder.stakeholder_id}</TableCell>
                      <TableCell>{stakeholder.stakeholder_name}</TableCell>
                      <TableCell>
                        <Badge>{stakeholder.stakeholder_type}</Badge>
                      </TableCell>
                      <TableCell>{stakeholder.location}</TableCell>
                      <TableCell>{stakeholder.contact_info}</TableCell>
                      <TableCell>
                        {stakeholder.stakeholder_type === "Farmer" && stakeholder.farm_size && (
                            <span>{stakeholder.farm_size}</span>
                        )}
                        {stakeholder.stakeholder_type === "Retailer" && stakeholder.shop_type && (
                            <span>{stakeholder.shop_type}</span>
                        )}
                        {stakeholder.stakeholder_type === "Wholesaler" && stakeholder.storage_capacity && (
                            <span>{stakeholder.storage_capacity}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4"/>
                          </Button>
                          <Button variant="outline" size="sm">
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

  const renderWeather = () => (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Weather Data - Bangladesh</h1>
            <p className="mt-2 text-gray-600">Real-time weather monitoring for agricultural regions across
              Bangladesh</p>
          </div>
          <div className="flex gap-4">
            <Button onClick={fetchWeatherData} disabled={weatherLoading}>
              {weatherLoading ? "Loading..." : "Refresh Weather"}
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2"/>
              Add Weather Station
            </Button>
          </div>
        </div>

        {/* Weather Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Average Temperature</CardTitle>
              <CloudRain className="h-4 w-4 text-blue-600"/>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {weatherLoading ? "Loading..." :
                    currentWeatherData.length > 0 ?
                        (currentWeatherData.reduce((sum, w) => sum + w.temperature, 0) / currentWeatherData.length).toFixed(1) + "°C" :
                        "N/A"
                }
              </div>
              <p className="text-xs text-gray-600">Across all regions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Rainfall</CardTitle>
              <CloudRain className="h-4 w-4 text-blue-600"/>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {weatherLoading ? "Loading..." :
                    currentWeatherData.length > 0 ?
                        currentWeatherData.reduce((sum, w) => sum + w.rainfall, 0).toFixed(1) + "mm" :
                        "N/A"
                }
              </div>
              <p className="text-xs text-gray-600">Current hour total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Average Humidity</CardTitle>
              <CloudRain className="h-4 w-4 text-green-600"/>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {weatherLoading ? "Loading..." :
                    currentWeatherData.length > 0 ?
                        Math.round(currentWeatherData.reduce((sum, w) => sum + (w.humidity || 0), 0) / currentWeatherData.length) + "%" :
                        "N/A"
                }
              </div>
              <p className="text-xs text-gray-600">Regional average</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Active Stations</CardTitle>
              <Package className="h-4 w-4 text-yellow-600"/>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {weatherLoading ? "Loading..." : currentWeatherData.length}
              </div>
              <p className="text-xs text-gray-600">Weather monitoring stations</p>
            </CardContent>
          </Card>
        </div>

        {/* Weather Alerts */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Weather Alerts & Advisories</CardTitle>
            <CardDescription>Important weather information for agricultural planning</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentWeatherData.filter(w => w.rainfall > 15).length > 0 && (
                  <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <Bell className="h-5 w-5 text-yellow-600 mr-3"/>
                    <div>
                      <p className="font-medium text-yellow-800">Heavy Rainfall Alert</p>
                      <p className="text-sm text-yellow-700">
                        High rainfall detected
                        in {currentWeatherData.filter(w => w.rainfall > 15).map(w => w.location).join(', ')}.
                        Consider crop protection measures.
                      </p>
                    </div>
                  </div>
              )}

              {currentWeatherData.filter(w => w.temperature > 30).length > 0 && (
                  <div className="flex items-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <Bell className="h-5 w-5 text-orange-600 mr-3"/>
                    <div>
                      <p className="font-medium text-orange-800">High Temperature Warning</p>
                      <p className="text-sm text-orange-700">
                        Elevated temperatures
                        in {currentWeatherData.filter(w => w.temperature > 30).map(w => w.location).join(', ')}.
                        Ensure adequate irrigation.
                      </p>
                    </div>
                  </div>
              )}

              {currentWeatherData.filter(w => (w.humidity || 0) > 80).length > 0 && (
                  <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <Bell className="h-5 w-5 text-blue-600 mr-3"/>
                    <div>
                      <p className="font-medium text-blue-800">High Humidity Notice</p>
                      <p className="text-sm text-blue-700">
                        High humidity levels
                        in {currentWeatherData.filter(w => (w.humidity || 0) > 80).map(w => w.location).join(', ')}.
                        Monitor for fungal diseases.
                      </p>
                    </div>
                  </div>
              )}

              {currentWeatherData.filter(w => w.rainfall > 15).length === 0 &&
                  currentWeatherData.filter(w => w.temperature > 30).length === 0 &&
                  currentWeatherData.filter(w => (w.humidity || 0) > 80).length === 0 && (
                      <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                        <Bell className="h-5 w-5 text-green-600 mr-3"/>
                        <div>
                          <p className="font-medium text-green-800">Weather Conditions Normal</p>
                          <p className="text-sm text-green-700">
                            All regions showing favorable weather conditions for agricultural activities.
                          </p>
                        </div>
                      </div>
                  )}
            </div>
          </CardContent>
        </Card>

        {/* Regional Weather Comparison */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Temperature Distribution</CardTitle>
              <CardDescription>Temperature across Bangladesh regions</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                  config={{temperature: {label: "Temperature (°C)", color: "#ff7300"}}}
                  className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={currentWeatherData}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="location" angle={-45} textAnchor="end" height={80}/>
                    <YAxis/>
                    <ChartTooltip content={<ChartTooltipContent/>}/>
                    <Bar dataKey="temperature" fill="#ff7300"/>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rainfall Distribution</CardTitle>
              <CardDescription>Precipitation levels by region</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                  config={{rainfall: {label: "Rainfall (mm)", color: "#1e40af"}}}
                  className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={currentWeatherData}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="location" angle={-45} textAnchor="end" height={80}/>
                    <YAxis/>
                    <ChartTooltip content={<ChartTooltipContent/>}/>
                    <Bar dataKey="rainfall" fill="#1e40af"/>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Weather Table */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Weather Records - Bangladesh</CardTitle>
            <CardDescription>Comprehensive weather data from all monitoring stations</CardDescription>
          </CardHeader>
          <CardContent>
            {weatherLoading ? (
                <div className="flex justify-center items-center p-8">
                  <div className="text-gray-500">Loading weather data...</div>
                </div>
            ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Location</TableHead>
                      <TableHead>Date Recorded</TableHead>
                      <TableHead>Temperature (°C)</TableHead>
                      <TableHead>Feels Like (°C)</TableHead>
                      <TableHead>Humidity (%)</TableHead>
                      <TableHead>Pressure (hPa)</TableHead>
                      <TableHead>Rainfall (mm/h)</TableHead>
                      <TableHead>Wind Speed (m/s)</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Season</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentWeatherData.map((record) => (
                        <TableRow key={record.weather_id}>
                          <TableCell className="font-medium">{record.location}</TableCell>
                          <TableCell>{record.date_recorded}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                                  record.temperature > 30 ? 'bg-red-500' :
                                      record.temperature > 25 ? 'bg-orange-500' :
                                          record.temperature > 20 ? 'bg-yellow-500' : 'bg-blue-500'
                              }`}></span>
                              {record.temperature}°C
                            </div>
                          </TableCell>
                          <TableCell>{record.feels_like || record.temperature}°C</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                                  (record.humidity || 0) > 80 ? 'bg-blue-500' :
                                      (record.humidity || 0) > 60 ? 'bg-green-500' : 'bg-yellow-500'
                              }`}></span>
                              {record.humidity || 'N/A'}%
                            </div>
                          </TableCell>
                          <TableCell>{record.pressure || 'N/A'} hPa</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                                  record.rainfall > 15 ? 'bg-red-500' :
                                      record.rainfall > 5 ? 'bg-orange-500' : 'bg-green-500'
                              }`}></span>
                              {record.rainfall}
                            </div>
                          </TableCell>
                          <TableCell>{record.wind_speed || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`${
                                record.weather_main === 'Rain' ? 'bg-blue-50 text-blue-700' :
                                    record.weather_main === 'Clear' ? 'bg-green-50 text-green-700' :
                                        'bg-gray-50 text-gray-700'
                            }`}>
                              {record.weather_description || record.weather_main || 'Clear'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge>{record.season}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4"/>
                              </Button>
                              <Button variant="outline" size="sm">
                                <Bell className="w-4 h-4"/>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
            )}
          </CardContent>
        </Card>

        {/* Weather Tips for Farmers */}
        <Card>
          <CardHeader>
            <CardTitle>Agricultural Weather Insights</CardTitle>
            <CardDescription>Weather-based recommendations for farming activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Optimal Planting Conditions</h4>
                <p className="text-sm text-green-700">
                  {currentWeatherData.filter(w => w.temperature >= 20 && w.temperature <= 30 && w.rainfall < 10).length} regions
                  showing ideal conditions for planting activities.
                </p>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Irrigation Needs</h4>
                <p className="text-sm text-blue-700">
                  {currentWeatherData.filter(w => w.rainfall < 5).length} regions may require additional irrigation
                  due to low rainfall levels.
                </p>
              </div>

              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2">Harvest Readiness</h4>
                <p className="text-sm text-orange-700">
                  {currentWeatherData.filter(w => w.rainfall < 10 && (w.humidity || 0) < 70).length} regions
                  showing favorable conditions for harvesting activities.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weather Error Message - Moved to Bottom */}
        {weatherError && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-red-600 mr-3"/>
                  <div>
                    <p className="font-medium text-red-800">API Configuration Notice</p>
                    <p className="text-red-700">{weatherError}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
        )}
      </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return renderDashboard()
      case "products":
        return renderProducts()
      case "production":
        return renderProduction()
      case "prices":
        return renderPriceHistory()
      case "transactions":
        return renderTransactions()
      case "stakeholders":
        return renderStakeholders()
      case "weather":
        return renderWeather()
      default:
        return renderDashboard()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Wheat className="h-8 w-8 text-green-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">AgriManagement</span>
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

                <Button
                    variant={activeSection === "products" ? "default" : "ghost"}
                    onClick={() => setActiveSection("products")}
                    className="inline-flex items-center px-1 pt-1"
                >
                  <Package className="w-4 h-4 mr-2"/>
                  Products
                </Button>

                <Button
                    variant={activeSection === "production" ? "default" : "ghost"}
                    onClick={() => setActiveSection("production")}
                    className="inline-flex items-center px-1 pt-1"
                >
                  <Factory className="w-4 h-4 mr-2"/>
                  Production
                </Button>

                <Button
                    variant={activeSection === "prices" ? "default" : "ghost"}
                    onClick={() => setActiveSection("prices")}
                    className="inline-flex items-center px-1 pt-1"
                >
                  <BarChart3 className="w-4 h-4 mr-2"/>
                  Price Analytics
                </Button>

                <Button
                    variant={activeSection === "transactions" ? "default" : "ghost"}
                    onClick={() => setActiveSection("transactions")}
                    className="inline-flex items-center px-1 pt-1"
                >
                  <ShoppingCart className="w-4 h-4 mr-2"/>
                  Transactions
                </Button>

                <Button
                    variant={activeSection === "stakeholders" ? "default" : "ghost"}
                    onClick={() => setActiveSection("stakeholders")}
                    className="inline-flex items-center px-1 pt-1"
                >
                  <Users className="w-4 h-4 mr-2"/>
                  Stakeholders
                </Button>

                <Button
                    variant={activeSection === "weather" ? "default" : "ghost"}
                    onClick={() => setActiveSection("weather")}
                    className="inline-flex items-center px-1 pt-1"
                >
                  <CloudRain className="w-4 h-4 mr-2"/>
                  Weather
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input type="search" placeholder="Search..." className="pl-10 w-64"/>
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
          {renderContent()}
        </div>
      </main>
    </div>
  )
}
