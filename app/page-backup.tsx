"use client"

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
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  LineChart,
  Line,
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

export default function AgricultureManagementSystem() {
    const [activeSection, setActiveSection] = useState('dashboard')
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [loading, setLoading] = useState(true)
    
    // Real data states
    const [dashboardData, setDashboardData] = useState({
        demandSupplyData: [],
        productionData: [],
        priceData: [],
        transactionData: [],
        stakeholderData: [],
        productsData: []
    })
    
    const [dashboardStats, setDashboardStats] = useState({
        totalProducts: 0,
        totalStakeholders: 0,
        totalTransactions: 0,
        averagePrice: 0,
        totalProduction: 0,
        weatherAlerts: 0
    })

    useEffect(() => {
        setMounted(true)
        fetchDashboardData()
    }, [])

    // Fetch real data from APIs
    const fetchDashboardData = async () => {
        setLoading(true)
        try {
            const [
                productionRes,
                pricesRes,
                transactionsRes,
                stakeholdersRes,
                productsRes
            ] = await Promise.all([
                fetch('/api/production'),
                fetch('/api/prices'),
                fetch('/api/transactions'),
                fetch('/api/stakeholders'),
                fetch('/api/products')
            ])

            const [
                productionData,
                priceData,
                transactionData,
                stakeholderData,
                productsData
            ] = await Promise.all([
                productionRes.ok ? productionRes.json() : [],
                pricesRes.ok ? pricesRes.json() : [],
                transactionsRes.ok ? transactionsRes.json() : [],
                stakeholdersRes.ok ? stakeholdersRes.json() : [],
                productsRes.ok ? productsRes.json() : []
            ])

            // Process data for charts
            const processedDemandSupply = processDemandSupplyData(productionData, priceData)
            
            setDashboardData({
                demandSupplyData: processedDemandSupply,
                productionData,
                priceData,
                transactionData,
                stakeholderData,
                productsData
            })

            setDashboardStats({
                totalProducts: productsData.length,
                totalStakeholders: stakeholderData.length,
                totalTransactions: transactionData.length,
                averagePrice: priceData.length > 0 ? priceData.reduce((sum, p) => sum + parseFloat(p.price_per_unit || 0), 0) / priceData.length : 0,
                totalProduction: productionData.reduce((sum, p) => sum + parseFloat(p.quantity_produced || 0), 0),
                weatherAlerts: 2
            })

        } catch (error) {
            console.error('Error fetching dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    // Process data for demand/supply charts
    const processDemandSupplyData = (production, prices) => {
        const monthlyData = {}
        
        production.forEach(prod => {
            const month = new Date(prod.date).toLocaleDateString('en', { month: 'short' })
            if (!monthlyData[month]) {
                monthlyData[month] = { month, supply: 0, demand: 0, price: 0, priceCount: 0 }
            }
            monthlyData[month].supply += parseFloat(prod.quantity_produced || 0)
        })
        
        prices.forEach(price => {
            const month = new Date(price.date).toLocaleDateString('en', { month: 'short' })
            if (monthlyData[month]) {
                monthlyData[month].price += parseFloat(price.price_per_unit || 0)
                monthlyData[month].priceCount += 1
            }
        })
        
        return Object.values(monthlyData)
            .map(data => ({
                ...data,
                demand: data.supply * 0.8, // Estimate demand as 80% of supply
                price: data.priceCount > 0 ? data.price / data.priceCount : 0
            }))
            .sort((a, b) => {
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                return months.indexOf(a.month) - months.indexOf(b.month)
            })
    }

    // Safe number formatting
    const safeNumberFormat = (value, decimals = 2) => {
        const num = parseFloat(value)
        return isNaN(num) ? '0.00' : num.toFixed(decimals)
    }

    const renderDashboard = () => (
        <div className="space-y-6">
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading real database data...</p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-200">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground mb-2">
                                    Real-time Agriculture Dashboard
                                </h1>
                                <p className="text-muted-foreground text-lg max-w-2xl">
                                    Live data from your agriculture database - production, pricing, transactions, and stakeholder insights.
                                </p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-xl border border-blue-200">
                                <Sparkles className="h-6 w-6 text-blue-600"/>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-green-100 p-2 rounded-lg">
                                    <Package className="h-5 w-5 text-green-600"/>
                                </div>
                                <span className="text-2xl font-bold text-foreground">{dashboardStats.totalProducts}</span>
                            </div>
                            <h3 className="font-medium text-foreground">Products</h3>
                            <p className="text-sm text-muted-foreground">In database</p>
                        </div>

                        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                    <Factory className="h-5 w-5 text-blue-600"/>
                                </div>
                                <span className="text-2xl font-bold text-foreground">
                                    {Math.round(dashboardStats.totalProduction).toLocaleString()}
                                </span>
                            </div>
                            <h3 className="font-medium text-foreground">Production</h3>
                            <p className="text-sm text-muted-foreground">Total units</p>
                        </div>

                        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-purple-100 p-2 rounded-lg">
                                    <ShoppingCart className="h-5 w-5 text-purple-600"/>
                                </div>
                                <span className="text-2xl font-bold text-foreground">{dashboardStats.totalTransactions}</span>
                            </div>
                            <h3 className="font-medium text-foreground">Transactions</h3>
                            <p className="text-sm text-muted-foreground">Total recorded</p>
                        </div>

                        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-yellow-100 p-2 rounded-lg">
                                    <TrendingUp className="h-5 w-5 text-yellow-600"/>
                                </div>
                                <span className="text-2xl font-bold text-foreground">
                                    ৳{safeNumberFormat(dashboardStats.averagePrice)}
                                </span>
                            </div>
                            <h3 className="font-medium text-foreground">Avg Price</h3>
                            <p className="text-sm text-muted-foreground">Per unit</p>
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-foreground">Supply vs Demand</h3>
                                <BarChart3 className="h-5 w-5 text-muted-foreground"/>
                            </div>
                            <ChartContainer config={{}} className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={dashboardData.demandSupplyData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0"/>
                                        <XAxis dataKey="month" stroke="#666"/>
                                        <YAxis stroke="#666"/>
                                        <ChartTooltip content={<ChartTooltipContent/>}/>
                                        <Legend/>
                                        <Line 
                                            type="monotone" 
                                            dataKey="supply" 
                                            stroke="#22c55e" 
                                            strokeWidth={3} 
                                            name="Supply" 
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="demand" 
                                            stroke="#ef4444" 
                                            strokeWidth={3} 
                                            name="Demand"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </div>

                        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-foreground">Price Trends</h3>
                                <TrendingUp className="h-5 w-5 text-muted-foreground"/>
                            </div>
                            <ChartContainer config={{}} className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={dashboardData.demandSupplyData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0"/>
                                        <XAxis dataKey="month" stroke="#666"/>
                                        <YAxis stroke="#666"/>
                                        <ChartTooltip content={<ChartTooltipContent/>}/>
                                        <Line 
                                            type="monotone" 
                                            dataKey="price" 
                                            stroke="#3b82f6" 
                                            strokeWidth={3} 
                                            name="Average Price (৳)"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </div>
                    </div>

                    {/* Navigation Cards */}
                    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                        <h3 className="text-lg font-semibold text-foreground mb-4">Explore Data Sections</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button 
                                onClick={() => setActiveSection('supply-demand-analysis')}
                                className="flex items-center p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200"
                            >
                                <BarChart3 className="h-6 w-6 text-blue-600 mr-3"/>
                                <div className="text-left">
                                    <h4 className="font-medium text-foreground">Supply & Demand</h4>
                                    <p className="text-sm text-muted-foreground">Market analysis</p>
                                </div>
                                <ArrowRight className="h-4 w-4 text-blue-600 ml-auto"/>
                            </button>
                            
                            <button 
                                onClick={() => setActiveSection('prices')}
                                className="flex items-center p-4 rounded-lg bg-green-50 hover:bg-green-100 transition-colors border border-green-200"
                            >
                                <TrendingUp className="h-6 w-6 text-green-600 mr-3"/>
                                <div className="text-left">
                                    <h4 className="font-medium text-foreground">Price Analytics</h4>
                                    <p className="text-sm text-muted-foreground">Price trends</p>
                                </div>
                                <ArrowRight className="h-4 w-4 text-green-600 ml-auto"/>
                            </button>
                            
                            <button 
                                onClick={() => setActiveSection('consumption')}
                                className="flex items-center p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors border border-purple-200"
                            >
                                <Utensils className="h-6 w-6 text-purple-600 mr-3"/>
                                <div className="text-left">
                                    <h4 className="font-medium text-foreground">Consumption</h4>
                                    <p className="text-sm text-muted-foreground">Usage patterns</p>
                                </div>
                                <ArrowRight className="h-4 w-4 text-purple-600 ml-auto"/>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )

    const navigationItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'products', label: 'Comprehensive Product Information', icon: Package },
        { id: 'production', label: 'Production History by District', icon: Factory },
        { id: 'prices', label: 'Price History and Trends', icon: TrendingUp },
        { id: 'supply-demand-analysis', label: 'Supply and Demand Analysis', icon: BarChart3 },
        { id: 'transactions', label: 'Transaction Management', icon: ShoppingCart },
        { id: 'consumption', label: 'Consumption Patterns and Nutrition', icon: Utensils },
        { id: 'stakeholders', label: 'Stakeholder Management', icon: Users },
        { id: 'weather', label: 'Weather Data History', icon: CloudRain },
        { id: 'warehouses', label: 'Warehouse Management', icon: WarehouseIcon },
        { id: 'inventory', label: 'Inventory Management', icon: Package },
        { id: 'shipments', label: 'Shipment Tracking', icon: Truck },
        { id: 'consumers', label: 'Consumer Management', icon: Users },
        { id: 'nutrition-intake', label: 'Nutrition Intake', icon: Utensils },
        { id: 'demand-forecast', label: 'Demand Forecast', icon: BarChart2 },
        { id: 'farmer-management', label: 'Farmer Management', icon: Wheat },
        { id: 'retailer-management', label: 'Retailer Management', icon: ShoppingCart },
        { id: 'wholesaler-management', label: 'Wholesaler Management', icon: Factory },
    ]

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
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                            <Wheat className="h-5 w-5 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-foreground">AgriDB</h2>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {navigationItems.map((item) => {
                        const Icon = item.icon
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveSection(item.id)
                                    setSidebarOpen(false)
                                }}
                                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    activeSection === item.id
                                        ? 'bg-primary/10 text-primary border border-primary/20'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                }`}
                            >
                                <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                                <span className="truncate">{item.label}</span>
                            </button>
                        )
                    })}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="bg-card border-b border-border px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden"
                            >
                                <Menu className="h-4 w-4" />
                            </Button>
                            <h1 className="text-lg font-semibold text-foreground">
                                {navigationItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
                            </h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="sm">
                                <Search className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                                <Bell className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                                <Settings className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {renderContent()}
                </main>
            </div>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    )
}
