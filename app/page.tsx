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

import {useState} from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
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
  {name: "Wheat", value: 35, color: "#8884d8"},
  {name: "Rice", value: 25, color: "#82ca9d"},
  {name: "Corn", value: 20, color: "#ffc658"},
  {name: "Soybeans", value: 12, color: "#ff7300"},
  {name: "Others", value: 8, color: "#00ff88"},
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
            <CardTitle className="text-sm font-medium">Active Warehouses</CardTitle>
            <WarehouseIcon className="h-4 w-4 text-purple-600"/>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{warehouses.length}</div>
            <p className="text-xs text-blue-600">Storage facilities</p>
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
              {weather.slice(0, 2).map((record) => (
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

  return (
      <div className="min-h-screen bg-gray-50 flex">
          {/* Left Sidebar */}
          <div
              className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300 ease-in-out flex-shrink-0`}>
              {/* Sidebar Header */}
              <div
                  className={`flex items-center ${sidebarOpen ? 'justify-between p-4' : 'justify-center p-2'} border-b`}>
                  <div className={`flex items-center ${sidebarOpen ? '' : 'justify-center'}`}>
                      <Wheat className="h-8 w-8 text-green-600 flex-shrink-0"/>
                      {sidebarOpen && (
                          <span className="ml-2 text-lg font-bold text-gray-900 truncate">AgriManagement</span>
                      )}
              </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className={`${sidebarOpen ? 'p-1.5' : 'p-2 mt-2'} hover:bg-gray-100`}
                >
                    {sidebarOpen ? <X className="h-5 w-5"/> : <Menu className="h-5 w-5"/>}
                </Button>
            </div>

              {/* Navigation Menu */}
              <nav className="flex-1 overflow-y-auto py-4">
                  <div className={`${sidebarOpen ? 'px-3' : 'px-2'} space-y-1`}>
                      {/* Main Navigation Items */}
                      {navigationItems.map((item) => {
                          const Icon = item.icon
                          const isActive = activeSection === item.id

                          return (
                              <Button
                                  key={item.id}
                                  variant={isActive ? "default" : "ghost"}
                                  onClick={() => setActiveSection(item.id)}
                                  className={`w-full justify-start h-9 text-sm font-medium transition-all duration-200 ${
                                      sidebarOpen ? 'px-3' : 'px-0 justify-center'
                                  } ${isActive ?
                                      'bg-green-600 text-white shadow-sm' :
                                      'text-gray-700 hover:bg-green-50 hover:text-green-700'
                                  }`}
                                  title={!sidebarOpen ? item.label : undefined}
                              >
                                  <Icon className={`h-4 w-4 flex-shrink-0 ${sidebarOpen ? 'mr-3' : ''}`}/>
                                  {sidebarOpen && <span className="truncate">{item.label}</span>}
                              </Button>
                          )
                      })}

                  {/* Stakeholder Section */}
                  <div className="pt-2">
                  <Button
                      variant="ghost"
                      onClick={() => {
                          if (!sidebarOpen) {
                              setSidebarOpen(true)
                          }
                          setStakeholderExpanded(!stakeholderExpanded)
                      }}
                      className={`w-full justify-start h-9 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all duration-200 ${
                          sidebarOpen ? 'px-3' : 'px-0 justify-center'
                      } ${stakeholderItems.some(item => activeSection === item.id) ? 'bg-green-50 text-green-700' : ''}`}
                      title={!sidebarOpen ? 'Stakeholder' : undefined}
                  >
                      <Users className={`h-4 w-4 flex-shrink-0 ${sidebarOpen ? 'mr-3' : ''}`}/>
                      {sidebarOpen && (
                          <>
                              <span className="truncate flex-1 text-left">Stakeholder</span>
                              {stakeholderExpanded ?
                                  <ChevronDown className="h-4 w-4 ml-auto"/> :
                                  <ChevronRight className="h-4 w-4 ml-auto"/>
                              }
                          </>
                      )}
                  </Button>

                    {/* Stakeholder Submenu */}
                    {sidebarOpen && stakeholderExpanded && (
                    <div className="ml-4 mt-1 space-y-1">
                        {stakeholderItems.map((item) => {
                            const Icon = item.icon
                            const isActive = activeSection === item.id

                            return (
                                <Button
                                    key={item.id}
                                    variant={isActive ? "default" : "ghost"}
                                    onClick={() => setActiveSection(item.id)}
                                    className={`w-full justify-start h-8 text-xs font-medium transition-all duration-200 px-3 ${
                                        isActive ?
                                            'bg-green-600 text-white shadow-sm' :
                                            'text-gray-600 hover:bg-green-50 hover:text-green-700'
                                    }`}
                                >
                                    <Icon className="h-3 w-3 mr-2 flex-shrink-0"/>
                                    <span className="truncate">{item.label}</span>
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
              {/* Top Header */}
              <header className="bg-white shadow-sm border-b px-6 py-4">
                  <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                  <h1 className="text-xl font-semibold text-gray-900">
                      {navigationItems.find(item => item.id === activeSection)?.label ||
                          stakeholderItems.find(item => item.id === activeSection)?.label ||
                          'Agriculture Management'}
                  </h1>
              </div>

                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                                <Input type="search" placeholder="Search..." className="pl-10 w-64 h-9"/>
                            </div>

                    <Button variant="ghost" size="sm" className="p-2">
                        <Bell className="w-4 h-4"/>
                    </Button>

                    <Button variant="ghost" size="sm" className="p-2">
                        <Settings className="w-4 h-4"/>
                    </Button>
              </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-auto">
                    <div className="p-6">
                        {renderContent()}
                    </div>
                </main>
            </div>
      </div>
  )
}
