"use client"

// Import all components
import ProductList from "@/components/product/ProductList"
import WeatherDashboard from "@/components/weather/WeatherDashboard"
import StakeholderManagement from "@/components/stakeholder/StakeholderManagement"
import WarehouseManagement from "@/components/warehouse/WarehouseManagement"
import InventoryManagement from "@/components/inventory/InventoryManagement"
import ProductionManagement from "@/components/production/ProductionManagement"
import PriceAnalytics from "@/components/price-history/PriceAnalytics"
import TransactionManagement from "@/components/transaction/TransactionManagement"
import ShipmentTracking from "@/components/shipment/ShipmentTracking"
import ConsumerManagement from "@/components/consumer/ConsumerManagement"
import ConsumptionPattern from "@/components/consumption-pattern/ConsumptionPattern"
import DemandForecast from "@/components/demand-forecast/DemandForecast"
import FarmerManagement from "@/components/farmer/FarmerManagement"
import NutritionIntake from "@/components/nutrition-intake/NutritionIntake"
import RetailerManagement from "@/components/retailer/RetailerManagement"
import SupplyDemandAnalysis from "@/components/supply-demand-analysis/SupplyDemandAnalysis"
import WholesalerManagement from "@/components/wholesaler/WholesalerManagement"

import {useState, useEffect} from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {
  LineChart,
  Line,
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
  Warehouse as WarehouseIcon,
  Truck,
  Utensils,
  BarChart2,
  TrendingUp,
    Menu,
    X,
    Sparkles,
    ArrowRight,
} from "lucide-react"

// Chart data with dynamic colors
const demandSupplyData = [
    {month: "Jan", demand: 4000, supply: 3800, price: 45},
    {month: "Feb", demand: 3000, supply: 3200, price: 42},
    {month: "Mar", demand: 2000, supply: 2800, price: 38},
    {month: "Apr", demand: 2780, supply: 3900, price: 35},
    {month: "May", demand: 1890, supply: 4800, price: 32},
    {month: "Jun", demand: 2390, supply: 3800, price: 36},
]

// Mock weather data for dashboard
const weather = [
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
        feels_like: 27.2,
        weather_conditions: "Partly Cloudy"
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
        feels_like: 25.8,
        weather_conditions: "Clear Sky"
    }
]

const products = [
  {
    product_id: "P001",
    product_name: "Wheat",
    product_type: "Grain",
    product_type_alt: "Cereal",
    variety: "Winter Wheat",
    sowing_time: "October-November",
    transplanting_time: "N/A",
    harvest_time: "April-May",
    seed_requirement_per_acre: "40-50 kg",
    nutritional_value_per_unit: 364,
    storage_requirements: "Cool, dry place below 15°C"
  },
  {
    product_id: "P002",
    product_name: "Rice",
    product_type: "Grain",
    product_type_alt: "Cereal",
    variety: "Basmati",
    sowing_time: "June-July",
    transplanting_time: "July-August",
    harvest_time: "November-December",
    seed_requirement_per_acre: "20-25 kg",
    nutritional_value_per_unit: 130,
    storage_requirements: "Airtight containers, moisture <14%"
  },
  {
    product_id: "P003",
    product_name: "Corn",
    product_type: "Grain",
    product_type_alt: "Cereal",
    variety: "Sweet Corn",
    sowing_time: "March-April",
    transplanting_time: "N/A",
    harvest_time: "July-August",
    seed_requirement_per_acre: "15-20 kg",
    nutritional_value_per_unit: 86,
    storage_requirements: "Refrigerated at 0-2°C"
  }
]

const production = [
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
  }
]

const stakeholders = [
  {
    stakeholder_id: "S001",
    stakeholder_name: "Ahmed Farms",
    location: "Dhaka",
    contact_info: "ahmed@farms.com",
    stakeholder_type: "Farmer",
    farm_size: "50 acres",
    registration_date: "2023-01-15",
    farming_type: "Organic",
    annual_production_capacity: 500
  },
  {
    stakeholder_id: "S002",
    stakeholder_name: "City Retail Store",
    location: "Chittagong",
    contact_info: "info@citystore.com",
    stakeholder_type: "Retailer",
    shop_type: "Grocery Store",
    customer_base: "5000+",
    monthly_sales_volume: 200,
    market_coverage: "Urban"
  },
  {
    stakeholder_id: "S003",
    stakeholder_name: "Grain Wholesale Co",
    location: "Dhaka",
    contact_info: "contact@grainwholesale.com",
    stakeholder_type: "Wholesaler",
    business_license: "WH-2023-001",
    storage_capacity: "10000 tons",
    distribution_network_size: 50,
    supply_chain_reach: "National"
  },
  {
    stakeholder_id: "S004",
    stakeholder_name: "Rahman Family",
    location: "Sylhet",
    contact_info: "rahman@email.com",
    stakeholder_type: "Consumer",
    per_capita_income: 25000,
    demographic_group: "Middle Class",
    household_size: 5
  }
]

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
  }
]

export default function AgricultureManagementSystem() {
    const [activeSection, setActiveSection] = useState("dashboard")
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [mounted, setMounted] = useState(false)
    const [theme, setTheme] = useState("light")
    const [fontSize, setFontSize] = useState(16)
    const [showSettings, setShowSettings] = useState(false)
    const [stakeholderExpanded, setStakeholderExpanded] = useState(false)

    const stakeholderItems = [
        {
            id: "farmer-management",
            label: "Farmer",
            icon: Users
        },
        {
            id: "retailer-management",
            label: "Retailer",
            icon: Users
        },
        {
            id: "wholesaler-management",
            label: "Wholesaler",
            icon: Users
        },
        {
            id: "consumers",
            label: "Consumer",
            icon: Users
        }
    ]

    useEffect(() => {
        setMounted(true)

        // Initialize theme from localStorage
        const savedTheme = localStorage.getItem("theme")
        if (savedTheme === "dark" || savedTheme === "light") {
            setTheme(savedTheme)
            document.documentElement.classList.toggle("dark", savedTheme === "dark")
        } else {
            // Default to system preference
            const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches
            const defaultTheme = systemDark ? "dark" : "light"
            setTheme(defaultTheme)
            document.documentElement.classList.toggle("dark", systemDark)
            localStorage.setItem("theme", defaultTheme)
        }

        // Initialize font size from localStorage
        const savedFontSize = localStorage.getItem("fontSize")
        if (savedFontSize && !isNaN(parseInt(savedFontSize))) {
            const size = parseInt(savedFontSize)
            setFontSize(size)
            document.documentElement.style.fontSize = `${size}px`
        } else {
            // Default font size
            document.documentElement.style.fontSize = "16px"
            localStorage.setItem("fontSize", "16")
        }
    }, [])

    // Navigation items configuration
    const navigationItems = [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: Home,
            category: "main"
        },
        {
            id: "stakeholders",
            label: "Stakeholder",
            icon: Users,
            category: "main"
        },
        {
            id: "products",
            label: "Product Information",
            icon: Package,
            category: "main"
        },
        {
            id: "production",
            label: "Production History",
            icon: Factory,
            category: "main"
        },
        {
            id: "prices",
            label: "Price History & Trends",
            icon: BarChart3,
            category: "main"
        },
        {
            id: "weather",
            label: "Weather Data History",
            icon: CloudRain,
            category: "main"
        },
        {
            id: "consumption",
            label: "Consumption Patterns",
            icon: Utensils,
            category: "main"
        },
        {
            id: "supply-demand-analysis",
            label: "Supply vs Demand Analysis",
            icon: BarChart3,
            category: "main"
        },
        {
            id: "demand-forecast",
            label: "Demand Forecast",
            icon: TrendingUp,
            category: "main"
        },
        {
            id: "inventory",
            label: "Inventory",
            icon: Package,
            category: "main"
        },
        {
            id: "shipments",
            label: "Shipment",
            icon: Truck,
            category: "main"
        },
        {
            id: "warehouses",
            label: "Warehouse",
            icon: WarehouseIcon,
            category: "main"
        },
        {
            id: "transactions",
            label: "Transaction",
            icon: ShoppingCart,
            category: "main"
        }
    ]

    useEffect(() => {
        setMounted(true)

        // Initialize theme from localStorage
        const savedTheme = localStorage.getItem("theme")
        if (savedTheme === "dark" || savedTheme === "light") {
            setTheme(savedTheme)
            document.documentElement.classList.toggle("dark", savedTheme === "dark")
        } else {
            // Default to system preference
            const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches
            const defaultTheme = systemDark ? "dark" : "light"
            setTheme(defaultTheme)
            document.documentElement.classList.toggle("dark", systemDark)
            localStorage.setItem("theme", defaultTheme)
        }

        // Initialize font size from localStorage
        const savedFontSize = localStorage.getItem("fontSize")
        if (savedFontSize && !isNaN(parseInt(savedFontSize))) {
            const size = parseInt(savedFontSize)
            setFontSize(size)
            document.documentElement.style.fontSize = `${size}px`
        } else {
            // Default font size
            document.documentElement.style.fontSize = "16px"
            localStorage.setItem("fontSize", "16")
        }
    }, [])

    const renderDashboard = () => (
        <div className="space-y-6 animate-fade-in">
            {/* Clean Modern Header */}
            <div
                className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 p-8 border border-blue-200">
                <div className="relative z-10">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground mb-2">
                                Agriculture Management
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-2xl">
                                Monitor, analyze and optimize your agricultural operations with real-time insights and
                                data-driven decisions.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-3 rounded-xl border border-blue-200">
                                <Sparkles className="h-6 w-6 text-blue-600"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modern Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div
                    className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-100 p-2 rounded-lg">
                            <Package className="h-5 w-5 text-green-600"/>
                        </div>
                        <span className="text-2xl font-bold text-foreground">{products.length}</span>
                    </div>
                    <h3 className="font-medium text-foreground">Active Products</h3>
                    <p className="text-sm text-gray-500">Currently managed</p>
                </div>

                <div
                    className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <Factory className="h-5 w-5 text-blue-600"/>
                        </div>
                        <span className="text-2xl font-bold text-foreground">
                            {production.reduce((sum, p) => sum + p.quantity_produced, 0).toLocaleString()}
                        </span>
                    </div>
                    <h3 className="font-medium text-foreground">Production</h3>
                    <p className="text-sm text-gray-500">Tons this month</p>
                </div>

                <div
                    className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-purple-100 p-2 rounded-lg">
                            <ShoppingCart className="h-5 w-5 text-purple-600"/>
                        </div>
                        <span className="text-2xl font-bold text-foreground">{transactions.length}</span>
                    </div>
                    <h3 className="font-medium text-foreground">Transactions</h3>
                    <p className="text-sm text-gray-500">Recent activities</p>
                </div>

                <div
                    className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-orange-100 p-2 rounded-lg">
                            <Users className="h-5 w-5 text-orange-600"/>
                        </div>
                        <span className="text-2xl font-bold text-foreground">{stakeholders.length}</span>
                    </div>
                    <h3 className="font-medium text-foreground">Stakeholders</h3>
                    <p className="text-sm text-gray-500">Registered users</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Demand Supply Chart */}
                <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-foreground mb-2">Supply & Demand Trends</h3>
                        <p className="text-muted-foreground">Monthly analysis of market dynamics</p>
                    </div>
                    <ChartContainer
                        config={{
                            demand: {label: "Demand", color: "#3B82F6"},
                            supply: {label: "Supply", color: "#10B981"},
                        }}
                        className="h-[300px]"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={demandSupplyData} margin={{top: 20, right: 30, left: 20, bottom: 20}}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                                <XAxis
                                    dataKey="month"
                                    stroke="#64748b"
                                    fontSize={12}
                                    tick={{fontSize: 12, fill: '#64748b'}}
                                    label={{
                                        value: 'Month',
                                        position: 'insideBottom',
                                        offset: -10,
                                        style: {textAnchor: 'middle', fontSize: '12px', fill: '#64748b'}
                                    }}
                                />
                                <YAxis
                                    stroke="#64748b"
                                    fontSize={12}
                                    tick={{fontSize: 12, fill: '#64748b'}}
                                    label={{
                                        value: 'Quantity (units)',
                                        angle: -90,
                                        position: 'insideLeft',
                                        style: {textAnchor: 'middle', fontSize: '12px', fill: '#64748b'}
                                    }}
                                />
                                <ChartTooltip content={<ChartTooltipContent/>}/>
                                <Legend/>
                                <Line
                                    type="monotone"
                                    dataKey="demand"
                                    stroke="#3B82F6"
                                    strokeWidth={2}
                                    dot={{fill: "#3B82F6", strokeWidth: 0, r: 4}}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="supply"
                                    stroke="#10B981"
                                    strokeWidth={2}
                                    dot={{fill: "#10B981", strokeWidth: 0, r: 4}}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </div>

                {/* Crop Distribution */}
                <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-foreground mb-2">Crop Distribution</h3>
                        <p className="text-muted-foreground">Market share breakdown</p>
                    </div>
                    <ChartContainer config={{value: {label: "Percentage"}}} className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        {name: "Wheat", value: 35, color: "#3B82F6"},
                                        {name: "Rice", value: 25, color: "#10B981"},
                                        {name: "Corn", value: 20, color: "#F59E0B"},
                                        {name: "Soybeans", value: 12, color: "#EF4444"},
                                        {name: "Others", value: 8, color: "#8B5CF6"}
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {[
                                        {name: "Wheat", value: 35, color: "#3B82F6"},
                                        {name: "Rice", value: 25, color: "#10B981"},
                                        {name: "Corn", value: 20, color: "#F59E0B"},
                                        {name: "Soybeans", value: 12, color: "#EF4444"},
                                        {name: "Others", value: 8, color: "#8B5CF6"}
                                    ].map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color}/>
                                    ))}
                                </Pie>
                                <ChartTooltip content={<ChartTooltipContent/>}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </div>
            </div>

            {/* Activity Feed */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Recent Transactions */}
                <div className="bg-card rounded-xl border border-border shadow-sm">
                    <div className="p-6 border-b border-border">
                        <h3 className="text-xl font-semibold text-foreground">Recent Transactions</h3>
                        <p className="text-muted-foreground">Latest financial activities</p>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {transactions.slice(0, 3).map((transaction) => (
                                <div key={transaction.transaction_id}
                                     className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-card p-2 rounded-lg border border-border">
                                            <Package className="h-4 w-4 text-muted-foreground"/>
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">{transaction.product_name}</p>
                                            <p className="text-sm text-gray-500">{transaction.stakeholder_name}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-foreground">${transaction.total_amount.toLocaleString()}</p>
                                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                            transaction.transaction_type === "Sale"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-blue-100 text-blue-800"
                                        }`}>
                                            {transaction.transaction_type}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <Button
                                onClick={() => setActiveSection("transactions")}
                                className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                            >
                                View All Transactions <ArrowRight className="ml-2 h-4 w-4"/>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Weather Overview */}
                <div className="bg-card rounded-xl border border-border shadow-sm">
                    <div className="p-6 border-b border-border">
                        <h3 className="text-xl font-semibold text-foreground">Weather Overview</h3>
                        <p className="text-muted-foreground">Current conditions</p>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {weather.slice(0, 2).map((record) => (
                                <div key={record.weather_id}
                                     className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-card p-2 rounded-lg border border-border">
                                            <CloudRain className="h-4 w-4 text-muted-foreground"/>
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">{record.location}</p>
                                            <p className="text-sm text-gray-500">{record.season} • {record.weather_conditions}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-semibold text-foreground">{record.temperature}°C</p>
                                        <p className="text-sm text-gray-500">{record.rainfall}mm</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <Button
                                onClick={() => setActiveSection("weather")}
                                className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                            >
                                View Weather Data <ArrowRight className="ml-2 h-4 w-4"/>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return renderDashboard()
        case "stakeholders":
            return <StakeholderManagement/>
      case "products":
          return <ProductList/>
      case "production":
          return <ProductionManagement/>
      case "prices":
          return <PriceAnalytics/>
      case "transactions":
          return <TransactionManagement/>
      case "weather":
          return <WeatherDashboard/>
      case "warehouses":
          return <WarehouseManagement/>
      case "inventory":
          return <InventoryManagement/>
      case "shipments":
          return <ShipmentTracking/>
      case "consumers":
          return <ConsumerManagement/>
      case "consumption":
          return <ConsumptionPattern/>
      case "nutrition-intake":
          return <NutritionIntake/>
      case "demand-forecast":
          return <DemandForecast/>
      case "farmer-management":
          return <FarmerManagement/>
      case "retailer-management":
          return <RetailerManagement/>
      case "supply-demand-analysis":
          return <SupplyDemandAnalysis/>
      case "wholesaler-management":
          return <WholesalerManagement/>
      default:
        return renderDashboard()
    }
  }

    if (!mounted) return null

    return (
        <div className="min-h-screen flex bg-background">
            {/* Clean Left Sidebar */}
            <div
                className={`${sidebarOpen ? 'w-72' : 'w-16'} bg-card shadow-sm transition-all duration-300 ease-in-out flex-shrink-0 border-r border-border`}>
                {/* Clean Sidebar Header */}
                <div
                    className={`flex items-center ${sidebarOpen ? 'justify-between p-6' : 'justify-center p-4'} border-b border-border`}>
                    <div className={`flex items-center ${sidebarOpen ? '' : 'justify-center'}`}>
                        <div className="p-2 bg-blue-600 rounded-lg border border-blue-700">
                            <Wheat className="h-8 w-8 flex-shrink-0 text-white"/>
                        </div>
                        {sidebarOpen && (
                            <div className="ml-3">
                                <span className="text-xl font-bold text-foreground">AgriManagement</span>
                                <p className="text-xs text-gray-500">Smart Agriculture Platform</p>
                            </div>
                        )}
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="hover:bg-gray-100 transition-colors border border-border"
                    >
                        {sidebarOpen ? <X className="h-5 w-5 text-muted-foreground"/> :
                            <Menu className="h-5 w-5 text-muted-foreground"/>}
                    </Button>
                </div>

                {/* Clean Navigation Menu */}
                <nav className="flex-1 overflow-y-auto py-6 scrollbar-thin">
                    <div className={`${sidebarOpen ? 'px-4' : 'px-2'} space-y-2`}>
                        {navigationItems.map((item) => {
                            if (item.id === "stakeholders") return (
                                <div key={item.id} className={`mt-4`}>
                                    <Button
                                        variant={stakeholderExpanded ? "default" : "ghost"}
                                        onClick={() => setStakeholderExpanded(!stakeholderExpanded)}
                                        className={`w-full h-12 transition-colors ${
                                            sidebarOpen ? 'px-4 justify-start' : 'px-0 justify-center w-12'
                                        } ${
                                            stakeholderExpanded
                                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                : 'text-muted-foreground hover:text-foreground hover:bg-gray-100'
                                        }`}
                                        title={!sidebarOpen ? "Stakeholder" : undefined}
                                    >
                                        <Users className={`h-5 w-5 flex-shrink-0 ${sidebarOpen ? 'mr-3' : ''}`}/>
                                        {sidebarOpen && <span className="font-medium">Stakeholder</span>}
                                        {sidebarOpen && (
                                            <span className={`ml-auto`}>
                                                {stakeholderExpanded ? <X className="h-5 w-5"/> :
                                                    <Menu className="h-5 w-5"/>}
                                            </span>
                                        )}
                                    </Button>
                                    {stakeholderExpanded && (
                                        <div className={`${sidebarOpen ? 'pl-8' : 'pl-0'} pt-2 space-y-1`}>
                                            {stakeholderItems.map(child => {
                                                const ChildIcon = child.icon
                                                const isActiveChild = activeSection === child.id
                                                return (
                                                    <Button
                                                        key={child.id}
                                                        variant={isActiveChild ? "default" : "ghost"}
                                                        onClick={() => setActiveSection(child.id)}
                                                        className={`w-full h-10 transition-colors ${
                                                            sidebarOpen ? 'px-2 justify-start' : 'px-0 justify-center w-12'
                                                        } ${
                                                            isActiveChild
                                                                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                                                : 'text-muted-foreground hover:text-foreground hover:bg-gray-100'
                                                        }`}
                                                        title={!sidebarOpen ? child.label : undefined}
                                                    >
                                                        <ChildIcon
                                                            className={`h-4 w-4 flex-shrink-0 ${sidebarOpen ? 'mr-2' : ''}`}/>
                                                        {sidebarOpen && <span className="text-sm">{child.label}</span>}
                                                    </Button>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            )
                            const Icon = item.icon
                            const isActive = activeSection === item.id

                            // Don't render stakeholder as a normal nav item!
                            if (item.id === "stakeholders") return null

                            return (
                                <Button
                                    key={item.id}
                                    variant={isActive ? "default" : "ghost"}
                                    onClick={() => setActiveSection(item.id)}
                                    className={`w-full h-12 transition-colors ${
                                        sidebarOpen ? 'px-4 justify-start' : 'px-0 justify-center w-12'
                                    } ${
                                        isActive
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-gray-100'
                                    }`}
                                    title={!sidebarOpen ? item.label : undefined}
                                >
                                    <Icon className={`h-5 w-5 flex-shrink-0 ${sidebarOpen ? 'mr-3' : ''}`}/>
                                    {sidebarOpen && <span className="font-medium">{item.label}</span>}
                                </Button>
                            )
                        })}
                    </div>
                </nav>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Clean Top Header */}
                <header className="px-8 py-6 bg-card border-b border-border">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <h1 className="text-2xl font-bold text-foreground">
                                {activeSection === "farmer-management" ? "Farmer Management" :
                                    activeSection === "retailer-management" ? "Retailer Management" :
                                        activeSection === "wholesaler-management" ? "Wholesaler Management" :
                                            activeSection === "consumers" ? "Consumer Management" :
                                                navigationItems.find(item => item.id === activeSection)?.label ||
                                                'Agriculture Management'}
                            </h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"/>
                                <Input
                                    type="search"
                                    placeholder="Search everything..."
                                    className="pl-12 w-80 h-11 text-sm border border-border bg-input text-foreground"
                                />
                            </div>

                            <Button
                                onClick={() => setShowSettings(!showSettings)}
                                className="p-3 transition-colors border border-border bg-card text-muted-foreground hover:bg-muted"
                            >
                                <Settings className="w-5 h-5"/>
                            </Button>

                            <Button
                                variant="ghost"
                                size="sm"
                                className="p-3 transition-colors border border-border bg-card text-muted-foreground hover:bg-muted"
                            >
                                <Bell className="w-5 h-5"/>
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Clean Settings Panel */}
                {showSettings && (
                    <div className="p-6 bg-card border-b border-border">
                        <div className="max-w-md mx-auto space-y-6">
                            <h2 className="text-xl font-bold text-foreground">Settings & Preferences</h2>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-foreground">Appearance</h3>
                                <div
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-card border border-border rounded-lg">
                                            {theme === "dark" ? "🌙" : "☀️"}
                                        </div>
                                        <div>
                                            <Label className="text-base font-medium text-foreground">
                                                {theme === "dark" ? "Dark Mode" : "Light Mode"}
                                            </Label>
                                            <p className="text-sm text-gray-500">Switch between themes</p>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={theme === "dark"}
                                        onChange={(e) => {
                                            const newTheme = e.target.checked ? "dark" : "light"
                                            setTheme(newTheme)
                                            document.documentElement.classList.toggle("dark", e.target.checked)
                                            localStorage.setItem("theme", newTheme)
                                        }}
                                        className="w-6 h-6"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-foreground">Typography</h3>
                                    <div className="p-4 bg-gray-50 border border-border rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label className="text-base font-medium text-foreground">Font Size</Label>
                                                <p className="text-sm text-gray-500">Current: {fontSize}px</p>
                                            </div>
                                            <Select
                                                value={fontSize.toString()}
                                                onValueChange={(value) => {
                                                    const newFontSize = parseInt(value)
                                                    setFontSize(newFontSize)
                                                    document.documentElement.style.fontSize = `${newFontSize}px`
                                                    localStorage.setItem("fontSize", value)
                                                }}
                                            >
                                                <SelectTrigger className="w-32 border border-gray-300">
                                                    <SelectValue placeholder="Select size"/>
                                                </SelectTrigger>
                                                <SelectContent className="border border-gray-300">
                                                    <SelectItem value="12">Small (12px)</SelectItem>
                                                    <SelectItem value="14">Default (14px)</SelectItem>
                                                    <SelectItem value="16">Medium (16px)</SelectItem>
                                                    <SelectItem value="18">Large (18px)</SelectItem>
                                                    <SelectItem value="20">Extra Large (20px)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <main className="flex-1 overflow-auto scrollbar-thin bg-gray-50">
                    <div className="p-8">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    )
}
