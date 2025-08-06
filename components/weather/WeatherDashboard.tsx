"use client"

import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Badge} from "@/components/ui/badge"
import {ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart"
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer} from "recharts"
import {CloudRain, Search, Plus, Edit2, Trash2, Bell, Package, Sun, Wind} from "lucide-react"

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
        setTimeout(() => {
            setWeatherLoading(false)
        }, 2000)
    }

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="bg-card border-2 border-border p-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-secondary border-2 border-border">
                                <CloudRain className="h-10 w-10 text-foreground"/>
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-foreground">
                                    Weather Dashboard - Bangladesh
                                </h1>
                                <p className="text-lg text-muted-foreground mt-2">
                                    Real-time weather monitoring for agricultural regions across Bangladesh
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="relative">
                                <Search
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"/>
                                <Input
                                    type="search"
                                    placeholder="Search locations..."
                                    className="bg-input border-2 border-border text-foreground placeholder-muted-foreground pl-12 w-64"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button onClick={refreshWeatherData} disabled={weatherLoading}
                                    className="bg-primary text-primary-foreground hover:bg-primary/90 border-2 border-primary">
                                {weatherLoading ? "Loading..." : "Refresh Weather"}
                            </Button>
                            <Button
                                className="bg-primary text-primary-foreground hover:bg-primary/90 border-2 border-primary">
                                <Plus className="w-4 h-4 mr-2"/>
                                Add Station
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-card border-2 border-border p-6 text-foreground">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-secondary border border-border">
                                <Sun className="h-6 w-6 text-foreground"/>
                            </div>
                            <div className="text-3xl font-bold text-foreground">
                                {(weatherData.reduce((sum, w) => sum + w.temperature, 0) / weatherData.length).toFixed(1)}°C
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Average Temperature</h3>
                        <p className="text-muted-foreground text-sm">Across all regions</p>
                    </div>

                    <div className="bg-card border-2 border-border p-6 text-foreground">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-secondary border border-border">
                                <CloudRain className="h-6 w-6 text-foreground"/>
                            </div>
                            <div className="text-3xl font-bold text-foreground">
                                {weatherData.reduce((sum, w) => sum + w.rainfall, 0).toFixed(1)}mm
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Total Rainfall</h3>
                        <p className="text-muted-foreground text-sm">Current hour total</p>
                    </div>

                    <div className="bg-card border-2 border-border p-6 text-foreground">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-secondary border border-border">
                                <Wind className="h-6 w-6 text-foreground"/>
                            </div>
                            <div className="text-3xl font-bold text-foreground">
                                {Math.round(weatherData.reduce((sum, w) => sum + w.humidity, 0) / weatherData.length)}%
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Average Humidity</h3>
                        <p className="text-muted-foreground text-sm">Regional average</p>
                    </div>

                    <div className="bg-card border-2 border-border p-6 text-foreground">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-secondary border border-border">
                                <Package className="h-6 w-6 text-foreground"/>
                            </div>
                            <div className="text-3xl font-bold text-foreground">
                                {weatherData.length}
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Active Stations</h3>
                        <p className="text-muted-foreground text-sm">Weather monitoring stations</p>
                    </div>
                </div>

                <div className="bg-card border-2 border-border p-8">
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold text-foreground mb-2">
                            Weather Alerts & Advisories
                        </h2>
                        <p className="text-muted-foreground text-lg">Important weather information for agricultural
                            planning</p>
                    </div>
                    <div className="space-y-4">
                        {weatherData.filter(w => w.rainfall > 15).length > 0 && (
                            <div className="flex items-center p-4 bg-secondary border-2 border-border">
                                <Bell className="h-6 w-6 text-foreground mr-4"/>
                                <div>
                                    <p className="font-semibold text-foreground text-lg">Heavy Rainfall Alert</p>
                                    <p className="text-muted-foreground">
                                        High rainfall detected
                                        in {weatherData.filter(w => w.rainfall > 15).map(w => w.location).join(', ')}.
                                        Consider crop protection measures.
                                    </p>
                                </div>
                            </div>
                        )}

                        {weatherData.filter(w => w.temperature > 30).length > 0 && (
                            <div className="flex items-center p-4 bg-secondary border-2 border-border">
                                <Bell className="h-6 w-6 text-foreground mr-4"/>
                                <div>
                                    <p className="font-semibold text-foreground text-lg">High Temperature Warning</p>
                                    <p className="text-muted-foreground">
                                        Elevated temperatures
                                        in {weatherData.filter(w => w.temperature > 30).map(w => w.location).join(', ')}.
                                        Ensure adequate irrigation.
                                    </p>
                                </div>
                            </div>
                        )}

                        {weatherData.filter(w => w.humidity > 80).length > 0 && (
                            <div className="flex items-center p-4 bg-secondary border-2 border-border">
                                <Bell className="h-6 w-6 text-foreground mr-4"/>
                                <div>
                                    <p className="font-semibold text-foreground text-lg">High Humidity Notice</p>
                                    <p className="text-muted-foreground">
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
                                <div className="flex items-center p-4 bg-secondary border-2 border-border">
                                    <Bell className="h-6 w-6 text-foreground mr-4"/>
                                    <div>
                                        <p className="font-semibold text-foreground text-lg">Weather Conditions
                                            Normal</p>
                                        <p className="text-muted-foreground">
                                            All regions showing favorable weather conditions for agricultural
                                            activities.
                                        </p>
                                    </div>
                                </div>
                            )}
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <div className="bg-card border-2 border-border p-8">
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-foreground mb-2">
                                Temperature Distribution
                            </h3>
                            <p className="text-muted-foreground">Temperature across Bangladesh regions</p>
                        </div>
                        <ChartContainer
                            config={{temperature: {label: "Temperature (°C)", color: "#000000"}}}
                            className="h-[350px]"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={filteredWeatherData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)"/>
                                    <XAxis dataKey="location" angle={-45} textAnchor="end" height={80}
                                           stroke="var(--muted-foreground)"/>
                                    <YAxis stroke="var(--muted-foreground)"/>
                                    <ChartTooltip content={<ChartTooltipContent/>}/>
                                    <Bar dataKey="temperature" fill="var(--foreground)" radius={[0, 0, 0, 0]}/>
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </div>

                    <div className="bg-card border-2 border-border p-8">
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-foreground mb-2">
                                Rainfall Distribution
                            </h3>
                            <p className="text-muted-foreground">Precipitation levels by region</p>
                        </div>
                        <ChartContainer
                            config={{rainfall: {label: "Rainfall (mm)", color: "#666666"}}}
                            className="h-[350px]"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={filteredWeatherData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)"/>
                                    <XAxis dataKey="location" angle={-45} textAnchor="end" height={80}
                                           stroke="var(--muted-foreground)"/>
                                    <YAxis stroke="var(--muted-foreground)"/>
                                    <ChartTooltip content={<ChartTooltipContent/>}/>
                                    <Bar dataKey="rainfall" fill="var(--muted-foreground)" radius={[0, 0, 0, 0]}/>
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </div>
                </div>

                <div className="bg-card border-2 border-border p-8">
                    <div className="pb-8">
                        <h2 className="text-3xl font-bold text-foreground mb-2">
                            Detailed Weather Records
                        </h2>
                        <p className="text-muted-foreground text-lg">Comprehensive weather data from all monitoring
                            stations</p>
                    </div>
                    <div className="border-2 border-border">
                        <Table>
                            <TableHeader className="bg-secondary border-b-2 border-border">
                                <TableRow>
                                    <TableHead className="text-foreground font-semibold border-r border-border">Weather
                                        ID</TableHead>
                                    <TableHead
                                        className="text-foreground font-semibold border-r border-border">Location</TableHead>
                                    <TableHead className="text-foreground font-semibold border-r border-border">Date
                                        Recorded</TableHead>
                                    <TableHead className="text-foreground font-semibold border-r border-border">Rainfall
                                        (mm)</TableHead>
                                    <TableHead className="text-foreground font-semibold border-r border-border">Temperature
                                        (°C)</TableHead>
                                    <TableHead
                                        className="text-foreground font-semibold border-r border-border">Season</TableHead>
                                    <TableHead className="text-foreground font-semibold border-r border-border">Humidity
                                        (%)</TableHead>
                                    <TableHead className="text-foreground font-semibold border-r border-border">Weather
                                        Conditions</TableHead>
                                    <TableHead className="text-foreground font-semibold">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="bg-card">
                                {filteredWeatherData.map((record) => (
                                    <TableRow key={record.weather_id}
                                              className="border-b border-border hover:bg-secondary/50">
                                        <TableCell
                                            className="font-semibold text-foreground border-r border-border">{record.weather_id}</TableCell>
                                        <TableCell
                                            className="font-medium text-foreground border-r border-border">{record.location}</TableCell>
                                        <TableCell
                                            className="text-muted-foreground border-r border-border">{new Date(record.date_recorded).toLocaleDateString()}</TableCell>
                                        <TableCell className="border-r border-border">
                                            <div className="flex items-center">
                                                <span className={`inline-block w-3 h-3 mr-2 ${
                                                    record.rainfall > 15 ? 'bg-foreground' :
                                                        record.rainfall > 5 ? 'bg-muted-foreground' : 'bg-secondary'
                                                }`}></span>
                                                <Badge
                                                    className="bg-foreground text-background border border-foreground">
                                                    {record.rainfall} mm
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell className="border-r border-border">
                                            <div className="flex items-center">
                                                <span className={`inline-block w-3 h-3 mr-2 ${
                                                    record.temperature > 30 ? 'bg-foreground' :
                                                        record.temperature > 20 ? 'bg-muted-foreground' : 'bg-secondary'
                                                }`}></span>
                                                <Badge
                                                    className="bg-foreground text-background border border-foreground">
                                                    {record.temperature}°C
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell className="border-r border-border">
                                            <Badge className="bg-secondary text-foreground border border-border">
                                                {record.season}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="border-r border-border">
                                            <div className="flex items-center">
                                                <span className={`inline-block w-3 h-3 mr-2 ${
                                                    record.humidity > 80 ? 'bg-foreground' :
                                                        record.humidity > 60 ? 'bg-muted-foreground' : 'bg-secondary'
                                                }`}></span>
                                                <Badge
                                                    className="bg-foreground text-background border border-foreground">
                                                    {record.humidity}%
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell className="border-r border-border">
                                            <Badge className="bg-secondary text-foreground border border-border">
                                                {record.weather_conditions}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Button variant="ghost" size="sm"
                                                        className="hover:bg-secondary border border-border">
                                                    <Edit2 className="w-4 h-4 text-foreground"/>
                                                </Button>
                                                <Button variant="ghost" size="sm"
                                                        className="hover:bg-secondary border border-border">
                                                    <Trash2 className="w-4 h-4 text-foreground"/>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    )
}