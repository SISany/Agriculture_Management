"use client"

import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Badge} from "@/components/ui/badge"
import {ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart"
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer} from "recharts"
import {CloudRain, Search, Plus, Edit2, Trash2, Bell, Package} from "lucide-react"

interface Weather {
    weather_id: number
    location: string
    date_recorded: string
    rainfall: number
    temperature: number
    season: string
    humidity: number
    weather_conditions: string
}

const weatherData: Weather[] = [
    {
        weather_id: 1,
        location: "Dhaka",
        date_recorded: "2024-01-15",
        rainfall: 15.2,
        temperature: 25.8,
        season: "Winter",
        humidity: 72.0,
        weather_conditions: "Partly Cloudy"
    },
    {
        weather_id: 2,
        location: "Chittagong",
        date_recorded: "2024-01-15",
        rainfall: 8.5,
        temperature: 24.2,
        season: "Winter",
        humidity: 75.0,
        weather_conditions: "Clear Sky"
    },
    {
        weather_id: 3,
        location: "Sylhet",
        date_recorded: "2024-01-14",
        rainfall: 22.1,
        temperature: 23.5,
        season: "Winter",
        humidity: 78.0,
        weather_conditions: "Light Rain"
    },
    {
        weather_id: 4,
        location: "Rajshahi",
        date_recorded: "2024-01-14",
        rainfall: 5.3,
        temperature: 26.1,
        season: "Winter",
        humidity: 68.0,
        weather_conditions: "Sunny"
    },
    {
        weather_id: 5,
        location: "Khulna",
        date_recorded: "2024-01-13",
        rainfall: 18.7,
        temperature: 24.8,
        season: "Winter",
        humidity: 74.0,
        weather_conditions: "Overcast"
    }
]

export default function WeatherDashboard() {
    const [searchTerm, setSearchTerm] = useState("")
    const [weatherLoading, setWeatherLoading] = useState(false)

    const filteredWeatherData = weatherData.filter(weather =>
        weather.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        weather.weather_conditions.toLowerCase().includes(searchTerm.toLowerCase()) ||
        weather.season.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const refreshWeatherData = () => {
        setWeatherLoading(true)
        // Simulate API call
        setTimeout(() => {
            setWeatherLoading(false)
        }, 2000)
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Weather Data - Bangladesh</h1>
                    <p className="mt-2 text-gray-600">Real-time weather monitoring for agricultural regions across
                        Bangladesh</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                        <Input
                            type="search"
                            placeholder="Search locations..."
                            className="pl-10 w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button onClick={refreshWeatherData} disabled={weatherLoading}>
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
                            {(weatherData.reduce((sum, w) => sum + w.temperature, 0) / weatherData.length).toFixed(1)}°C
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
                            {weatherData.reduce((sum, w) => sum + w.rainfall, 0).toFixed(1)}mm
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
                            {Math.round(weatherData.reduce((sum, w) => sum + w.humidity, 0) / weatherData.length)}%
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
                        <div className="text-2xl font-bold">{weatherData.length}</div>
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
                        {weatherData.filter(w => w.rainfall > 15).length > 0 && (
                            <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <Bell className="h-5 w-5 text-yellow-600 mr-3"/>
                                <div>
                                    <p className="font-medium text-yellow-800">Heavy Rainfall Alert</p>
                                    <p className="text-sm text-yellow-700">
                                        High rainfall detected
                                        in {weatherData.filter(w => w.rainfall > 15).map(w => w.location).join(', ')}.
                                        Consider crop protection measures.
                                    </p>
                                </div>
                            </div>
                        )}

                        {weatherData.filter(w => w.temperature > 30).length > 0 && (
                            <div className="flex items-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
                                <Bell className="h-5 w-5 text-orange-600 mr-3"/>
                                <div>
                                    <p className="font-medium text-orange-800">High Temperature Warning</p>
                                    <p className="text-sm text-orange-700">
                                        Elevated temperatures
                                        in {weatherData.filter(w => w.temperature > 30).map(w => w.location).join(', ')}.
                                        Ensure adequate irrigation.
                                    </p>
                                </div>
                            </div>
                        )}

                        {weatherData.filter(w => w.humidity > 80).length > 0 && (
                            <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <Bell className="h-5 w-5 text-blue-600 mr-3"/>
                                <div>
                                    <p className="font-medium text-blue-800">High Humidity Notice</p>
                                    <p className="text-sm text-blue-700">
                                        High humidity levels
                                        in {weatherData.filter(w => w.humidity > 80).map(w => w.location).join(', ')}.
                                        Monitor for fungal diseases.
                                    </p>
                                </div>
                            </div>
                        )}

                        {weatherData.filter(w => w.rainfall > 15).length === 0 &&
                            weatherData.filter(w => w.temperature > 30).length === 0 &&
                            weatherData.filter(w => w.humidity > 80).length === 0 && (
                                <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <Bell className="h-5 w-5 text-green-600 mr-3"/>
                                    <div>
                                        <p className="font-medium text-green-800">Weather Conditions Normal</p>
                                        <p className="text-sm text-green-700">
                                            All regions showing favorable weather conditions for agricultural
                                            activities.
                                        </p>
                                    </div>
                                </div>
                            )}
                    </div>
                </CardContent>
            </Card>

            {/* Weather Charts */}
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
                                <BarChart data={filteredWeatherData}>
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
                                <BarChart data={filteredWeatherData}>
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
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Weather ID</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Date Recorded</TableHead>
                                <TableHead>Rainfall (mm)</TableHead>
                                <TableHead>Temperature (°C)</TableHead>
                                <TableHead>Season</TableHead>
                                <TableHead>Humidity (%)</TableHead>
                                <TableHead>Weather Conditions</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredWeatherData.map((record) => (
                                <TableRow key={record.weather_id}>
                                    <TableCell className="font-medium">{record.weather_id}</TableCell>
                                    <TableCell>{record.location}</TableCell>
                                    <TableCell>{new Date(record.date_recorded).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                      <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                          record.rainfall > 15 ? 'bg-blue-500' :
                              record.rainfall > 5 ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></span>
                                            {record.rainfall} mm
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                      <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                          record.temperature > 30 ? 'bg-red-500' :
                              record.temperature > 20 ? 'bg-green-500' : 'bg-blue-500'
                      }`}></span>
                                            {record.temperature}°C
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{record.season}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                      <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                          record.humidity > 80 ? 'bg-blue-500' :
                              record.humidity > 60 ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></span>
                                            {record.humidity}%
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`${
                                            record.weather_conditions.includes('Rain') ? 'bg-blue-50 text-blue-700' :
                                                record.weather_conditions.includes('Clear') ? 'bg-green-50 text-green-700' :
                                                    'bg-gray-50 text-gray-700'
                                        }`}>
                                            {record.weather_conditions}
                                        </Badge>
                                    </TableCell>
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