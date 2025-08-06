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
import {CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Label} from "@/components/ui/label"
import {Switch} from "@/components/ui/switch"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Separator} from "@/components/ui/separator"
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
    ChevronDown,
    ChevronRight,
    Menu,
    X,
    Sparkles,
    ArrowRight
} from "lucide-react"

// Mock data for dashboard only
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

const warehouses = [
  {
    warehouse_id: "WH001",
    stakeholder_id: "S003",
    warehouse_name: "Central Grain Storage",
    location: "Dhaka",
    storage_capacity: 10000,
    current_stock_level: 7500,
    storage_conditions: "Climate Controlled",
    temperature_controlled: 15,
    last_updated: "2024-01-15"
  },
  {
    warehouse_id: "WH002",
    stakeholder_id: "S001",
    warehouse_name: "Ahmed Farm Storage",
    location: "Dhaka",
    storage_capacity: 500,
    current_stock_level: 300,
    storage_conditions: "Dry Storage",
    temperature_controlled: 18,
    last_updated: "2024-01-14"
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

// Chart data
const demandSupplyData = [
  {month: "Jan", demand: 4000, supply: 3800, price: 45},
  {month: "Feb", demand: 3000, supply: 3200, price: 42},
  {month: "Mar", demand: 2000, supply: 2800, price: 38},
  {month: "Apr", demand: 2780, supply: 3900, price: 35},
  {month: "May", demand: 1890, supply: 4800, price: 32},
  {month: "Jun", demand: 2390, supply: 3800, price: 36},
]

const cropDistribution = [
    {name: "Wheat", value: 35, color: "#000000"},
    {name: "Rice", value: 25, color: "#333333"},
    {name: "Corn", value: 20, color: "#666666"},
    {name: "Soybeans", value: 12, color: "#999999"},
    {name: "Others", value: 8, color: "#cccccc"},
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

export default function AgricultureManagementSystem() {
  const [activeSection, setActiveSection] = useState("dashboard")
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [stakeholderExpanded, setStakeholderExpanded] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [theme, setTheme] = useState("light")
    const [fontSize, setFontSize] = useState(16)

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
            id: "products",
            label: "Product",
            icon: Package,
            category: "main"
        },
        {
            id: "production",
            label: "Production",
            icon: Factory,
            category: "main"
        },
        {
            id: "prices",
            label: "Price History",
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
            id: "consumption",
            label: "Consumption",
            icon: Utensils,
            category: "main"
        },
        {
            id: "supply-demand-analysis",
            label: "Supply Analysis",
            icon: BarChart3,
            category: "main"
        },
        {
            id: "nutrition-intake",
            label: "Nutrition",
            icon: BarChart2,
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
        },
        {
            id: "weather",
            label: "Weather",
            icon: CloudRain,
            category: "additional"
        }
    ]

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

    const renderDashboard = () => (
        <div className="space-y-8 animate-fade-in">
            {/* Square Header */}
            <div className="bg-card border-2 border-border p-8">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-4 bg-secondary border-2 border-border">
                        <Sparkles className="h-8 w-8 text-foreground"/>
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-foreground">
                            Agriculture Management Dashboard
                        </h1>
                        <p className="text-lg text-muted-foreground mt-2">
                            Comprehensive overview of agricultural production, demand, supply and market analytics
                        </p>
                    </div>
                </div>
                <div className="mt-6">
                    <Button
                        className="bg-primary text-primary-foreground hover:bg-primary/90 border-2 border-primary px-6 py-3 font-semibold">
                        View Analytics <ArrowRight className="ml-2 h-4 w-4"/>
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-card border-2 border-border p-6 transition-all duration-300 hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-semibold text-muted-foreground">Total Products</CardTitle>
                    <div className="p-2 bg-secondary border border-border">
                        <Package className="h-5 w-5 text-foreground"/>
                    </div>
                </CardHeader>
                <CardContent className="pb-4">
                    <div className="text-3xl font-bold text-foreground">{products.length}</div>
                    <p className="text-sm text-muted-foreground mt-1">Active products</p>
                </CardContent>
            </div>

            <div className="bg-card border-2 border-border p-6 transition-all duration-300 hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-semibold text-muted-foreground">Total Production</CardTitle>
                    <div className="p-2 bg-secondary border border-border">
                        <Factory className="h-5 w-5 text-foreground"/>
                    </div>
                </CardHeader>
                <CardContent className="pb-4">
                    <div className="text-3xl font-bold text-foreground">
                        {production.reduce((sum, p) => sum + p.quantity_produced, 0).toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">tons this month</p>
                </CardContent>
            </div>

            <div className="bg-card border-2 border-border p-6 transition-all duration-300 hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-semibold text-muted-foreground">Transactions</CardTitle>
                    <div className="p-2 bg-secondary border border-border">
                        <ShoppingCart className="h-5 w-5 text-foreground"/>
                    </div>
                </CardHeader>
                <CardContent className="pb-4">
                    <div className="text-3xl font-bold text-foreground">{transactions.length}</div>
                    <p className="text-sm text-muted-foreground mt-1">recent activities</p>
                </CardContent>
            </div>

            <div className="bg-card border-2 border-border p-6 transition-all duration-300 hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-semibold text-muted-foreground">Warehouses</CardTitle>
                    <div className="p-2 bg-secondary border border-border">
                        <WarehouseIcon className="h-5 w-5 text-foreground"/>
                    </div>
                </CardHeader>
                <CardContent className="pb-4">
                    <div className="text-3xl font-bold text-foreground">{warehouses.length}</div>
                    <p className="text-sm text-muted-foreground mt-1">storage facilities</p>
                </CardContent>
            </div>

            <div className="bg-card border-2 border-border p-6 transition-all duration-300 hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-semibold text-muted-foreground">Stakeholders</CardTitle>
                    <div className="p-2 bg-secondary border border-border">
                        <Users className="h-5 w-5 text-foreground"/>
                    </div>
                </CardHeader>
                <CardContent className="pb-4">
                    <div className="text-3xl font-bold text-foreground">{stakeholders.length}</div>
                    <p className="text-sm text-muted-foreground mt-1">registered users</p>
                </CardContent>
            </div>
        </div>

            {/* Square Charts Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="bg-card border-2 border-border p-6 shadow-sm">
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold text-foreground mb-2">Demand vs Supply Trends</h3>
                        <p className="text-muted-foreground">Monthly comparison of demand and supply volumes</p>
                    </div>
                    <ChartContainer
                        config={{
                            demand: {label: "Demand", color: "#000000"},
                            supply: {label: "Supply", color: "#666666"},
                        }}
                        className="h-[400px]"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={demandSupplyData} margin={{top: 20, right: 30, left: 20, bottom: 60}}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5"/>
                                <XAxis
                                    dataKey="month"
                                    stroke="#666666"
                                    fontSize={11}
                                    height={40}
                                />
                                <YAxis
                                    stroke="#666666"
                                    fontSize={11}
                                    width={50}
                                />
                                <ChartTooltip content={<ChartTooltipContent/>}/>
                                <Legend
                                    wrapperStyle={{
                                        fontSize: '11px',
                                        paddingTop: '15px'
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="demand"
                                    stroke="#000000"
                                    strokeWidth={2}
                                    dot={{fill: "#000000", strokeWidth: 2, r: 3}}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="supply"
                                    stroke="#666666"
                                    strokeWidth={2}
                                    dot={{fill: "#666666", strokeWidth: 2, r: 3}}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </div>

                <div className="bg-card border-2 border-border p-6 shadow-sm">
                <div className="mb-6">
                    <h3 className="text-2xl font-bold text-foreground mb-2">Crop Distribution</h3>
                    <p className="text-muted-foreground">Market share by crop type</p>
                </div>
                <ChartContainer
                    config={{value: {label: "Percentage"}}}
                    className="h-[400px]"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart margin={{top: 20, right: 20, left: 20, bottom: 20}}>
                            <Pie
                                data={cropDistribution}
                                cx="50%"
                                cy="45%"
                                labelLine={false}
                                label={({name, percent}) => `${name}\n${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                innerRadius={40}
                                fill="#000000"
                                dataKey="value"
                                paddingAngle={2}
                                fontSize={10}
                            >
                                {cropDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color}/>
                                ))}
                            </Pie>
                            <ChartTooltip content={<ChartTooltipContent/>}/>
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </div>
        </div>

            {/* Square Recent Activity */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="bg-card border-2 border-border shadow-sm transition-all duration-300 hover:shadow-md">
                    <CardHeader className="pb-6">
                        <CardTitle className="text-2xl font-bold text-foreground">Recent Transactions</CardTitle>
                        <CardDescription className="text-muted-foreground">Latest transaction
                            activities</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {transactions.slice(0, 3).map((transaction) => (
                                <div key={transaction.transaction_id}
                                     className="p-4 bg-muted/20 border border-border transition-colors hover:bg-muted/50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-secondary border border-border">
                                                <Package className="h-4 w-4 text-foreground"/>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-foreground">{transaction.product_name}</p>
                                                <p className="text-sm text-muted-foreground">{transaction.stakeholder_name}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-foreground">
                                                ${transaction.total_amount.toLocaleString()}
                                            </p>
                                            <Badge
                                                variant={transaction.transaction_type === "Sale" ? "default" : "secondary"}
                                                className="text-xs mt-1 border border-border">
                                                {transaction.transaction_type}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <Button
                                variant="outline"
                                onClick={() => setActiveSection("transactions")}
                                className="w-full mt-4 bg-secondary text-secondary-foreground border-2 border-border hover:bg-secondary/80"
                            >
                                View All Transactions <ArrowRight className="ml-2 h-4 w-4"/>
                            </Button>
                    </div>
                </CardContent>
            </div>

                <div className="bg-card border-2 border-border shadow-sm transition-all duration-300 hover:shadow-md">
                <CardHeader className="pb-6">
                    <CardTitle className="text-2xl font-bold text-foreground">Weather Overview</CardTitle>
                    <CardDescription className="text-muted-foreground">Current weather conditions</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {weather.slice(0, 2).map((record) => (
                            <div key={record.weather_id}
                                 className="p-4 bg-muted/20 border border-border transition-colors hover:bg-muted/50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-secondary border border-border">
                                            <CloudRain className="h-4 w-4 text-foreground"/>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-foreground">{record.location}</p>
                                            <p className="text-sm text-muted-foreground">{record.season} • {record.weather_conditions}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-foreground">{record.temperature}°C</p>
                                        <p className="text-sm text-muted-foreground">{record.rainfall}mm</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <Button
                            variant="outline"
                            onClick={() => setActiveSection("weather")}
                            className="w-full mt-4 bg-secondary text-secondary-foreground border-2 border-border hover:bg-secondary/80"
                        >
                            View All Weather Data <ArrowRight className="ml-2 h-4 w-4"/>
                        </Button>
                    </div>
                </CardContent>
            </div>
        </div>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return renderDashboard()
      case "products":
        return <ProductList/>
      case "production":
        return <ProductionManagement/>
      case "prices":
        return <PriceAnalytics/>
      case "transactions":
        return <TransactionManagement/>
      case "stakeholders":
        return <StakeholderManagement/>
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
        <div className="min-h-screen bg-background flex">
            {/* Square Left Sidebar */}
            <div
                className={`${sidebarOpen ? 'w-72' : 'w-16'} bg-card border-r-2 border-border shadow-sm transition-all duration-300 ease-in-out flex-shrink-0`}>
                {/* Square Sidebar Header */}
                <div
                    className={`flex items-center ${sidebarOpen ? 'justify-between p-6' : 'justify-center p-4'} border-b-2 border-border`}>
                    <div className={`flex items-center ${sidebarOpen ? '' : 'justify-center'}`}>
                        <div className="p-2 bg-secondary border-2 border-border">
                            <Wheat className="h-8 w-8 text-foreground flex-shrink-0"/>
                        </div>
                        {sidebarOpen && (
                            <div className="ml-3">
                                <span className="text-xl font-bold text-foreground">AgriManagement</span>
                                <p className="text-xs text-muted-foreground">Smart Agriculture Platform</p>
                            </div>
                        )}
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="hover:bg-secondary transition-colors border border-border"
                    >
                        {sidebarOpen ? <X className="h-5 w-5 text-muted-foreground"/> :
                            <Menu className="h-5 w-5 text-muted-foreground"/>}
                    </Button>
                </div>

                {/* Square Navigation Menu */}
                <nav className="flex-1 overflow-y-auto py-6 scrollbar-thin">
                    <div className={`${sidebarOpen ? 'px-4' : 'px-2'} space-y-2`}>
                        {navigationItems.map((item) => {
                            const Icon = item.icon
                            const isActive = activeSection === item.id

                            return (
                                <Button
                                    key={item.id}
                                    variant={isActive ? "default" : "ghost"}
                                    onClick={() => setActiveSection(item.id)}
                                    className={`w-full h-12 transition-colors border border-border ${
                                        sidebarOpen ? 'px-4 justify-start' : 'px-0 justify-center w-12'
                                    } ${isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}
                                    title={!sidebarOpen ? item.label : undefined}
                                >
                                    <Icon className={`h-5 w-5 flex-shrink-0 ${sidebarOpen ? 'mr-3' : ''}`}/>
                                    {sidebarOpen && <span className="font-medium">{item.label}</span>}
                                </Button>
                            )
                        })}

                        {/* Square Stakeholder Section */}
                        <div className="pt-4 border-t-2 border-border">
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    if (!sidebarOpen) {
                                        setSidebarOpen(true)
                                    }
                                    setStakeholderExpanded(!stakeholderExpanded)
                                }}
                                className={`w-full h-12 transition-colors border border-border ${
                                    sidebarOpen ? 'px-4 justify-start' : 'px-0 justify-center w-12'
                                } ${stakeholderItems.some(item => activeSection === item.id) ?
                                    'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}
                                title={!sidebarOpen ? 'Stakeholder' : undefined}
                            >
                                <Users className={`h-5 w-5 flex-shrink-0 ${sidebarOpen ? 'mr-3' : ''}`}/>
                                {sidebarOpen && (
                                    <>
                                        <span className="font-medium flex-1 text-left">Stakeholders</span>
                                        <div
                                            className={`transition-transform duration-300 ${stakeholderExpanded ? 'rotate-180' : ''}`}>
                                            {stakeholderExpanded ?
                                                <ChevronDown className="h-4 w-4 ml-auto"/> :
                                                <ChevronRight className="h-4 w-4 ml-auto"/>}
                                        </div>
                                    </>
                                )}
                            </Button>

                            {/* Square Stakeholder Submenu */}
                            {sidebarOpen && stakeholderExpanded && (
                                <div className="ml-6 mt-2 space-y-1 animate-fade-in">
                                    {stakeholderItems.map((item) => {
                                        const Icon = item.icon
                                        const isActive = activeSection === item.id

                                        return (
                                            <Button
                                                key={item.id}
                                                variant={isActive ? "default" : "ghost"}
                                                onClick={() => setActiveSection(item.id)}
                                                className={`w-full h-10 text-sm transition-colors px-4 justify-start border border-border ${
                                                    isActive ? 'bg-primary text-primary-foreground' :
                                                        'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}
                                            >
                                                <Icon className="h-4 w-4 mr-3 flex-shrink-0"/>
                                                <span>{item.label}</span>
                                            </Button>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </nav>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Square Top Header */}
                <header className="bg-card border-b-2 border-border px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <h1 className="text-2xl font-bold text-foreground">
                                {navigationItems.find(item => item.id === activeSection)?.label ||
                                    stakeholderItems.find(item => item.id === activeSection)?.label ||
                                    'Agriculture Management'}
                            </h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"/>
                                <Input
                                    type="search"
                                    placeholder="Search everything..."
                                    className="bg-input border-2 border-border text-foreground placeholder-muted-foreground pl-12 w-80 h-11 text-sm"
                                />
                            </div>

                            <Dialog>
                                <DialogTrigger
                                    className="p-3 bg-secondary border-2 border-border hover:bg-secondary/80 transition-colors">
                                    <Settings className="w-5 h-5 text-muted-foreground hover:text-foreground"/>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px] border-2 border-border">
                                    <DialogHeader>
                                        <DialogTitle
                                            className="text-2xl font-bold text-foreground flex items-center gap-3">
                                            <Settings className="h-6 w-6"/>
                                            Settings & Preferences
                                        </DialogTitle>
                                        <DialogDescription className="text-muted-foreground">
                                            Customize your agriculture management dashboard experience
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="space-y-6 mt-6">
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-foreground">Appearance</h3>
                                            <div
                                                className="flex items-center justify-between p-4 bg-card border-2 border-border">
                                                <div className="flex items-center space-x-3">
                                                    <div className="p-2 bg-secondary border border-border">
                                                        {theme === "dark" ? "🌙" : "☀️"}
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="theme-toggle"
                                                               className="text-base font-medium text-foreground">
                                                            {theme === "dark" ? "Dark Mode" : "Light Mode"}
                                                        </Label>
                                                        <p className="text-sm text-muted-foreground">
                                                            Switch between light and dark themes
                                                        </p>
                                                    </div>
                                                </div>
                                                <Switch
                                                    id="theme-toggle"
                                                    checked={theme === "dark"}
                                                    onCheckedChange={(checked: boolean) => {
                                                        const newTheme = checked ? "dark" : "light"
                                                        setTheme(newTheme)
                                                        document.documentElement.classList.toggle("dark", checked)
                                                        localStorage.setItem("theme", newTheme)
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <Separator/>

                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-foreground">Typography</h3>
                                            <div className="p-4 bg-card border-2 border-border">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <Label className="text-base font-medium text-foreground">Font
                                                            Size</Label>
                                                        <p className="text-sm text-muted-foreground">
                                                            Current: {fontSize}px
                                                        </p>
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
                                                        <SelectTrigger className="w-32 border-2 border-border">
                                                            <SelectValue placeholder="Select size"/>
                                                        </SelectTrigger>
                                                        <SelectContent className="border-2 border-border">
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
                                </DialogContent>
                            </Dialog>

                            <Button variant="ghost" size="sm"
                                    className="p-3 bg-secondary border-2 border-border hover:bg-secondary/80 transition-colors">
                                <Bell className="w-5 h-5 text-muted-foreground hover:text-foreground"/>
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-auto scrollbar-thin">
                    <div className="p-8">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    )
}
