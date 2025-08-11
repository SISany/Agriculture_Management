"use client"

import {useState} from "react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Badge} from "@/components/ui/badge"
import {CloudRain, Search, Plus, Edit2, Trash2, Package, Sun, Wind, FileDown} from "lucide-react"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Label} from "@/components/ui/label"
import {exportWeatherData} from "@/lib/pdfExport"

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
    const [showAddForm, setShowAddForm] = useState(false)

    const [formData, setFormData] = useState({
        weather_id: 0,
        location: "",
        date_recorded: "",
        rainfall: 0,
        temperature: 0,
        season: "",
        humidity: 0,
        weather_conditions: ""
    })

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

    const handleInputChange = (field: string, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const newWeatherRecord: Weather = {
            ...formData,
            weather_id: Math.max(...weatherData.map(w => w.weather_id)) + 1
        }

        console.log("New Weather Record:", newWeatherRecord)

        setFormData({
            weather_id: 0,
            location: "",
            date_recorded: "",
            rainfall: 0,
            temperature: 0,
            season: "",
            humidity: 0,
            weather_conditions: ""
        })
        setShowAddForm(false)
    }

    // Calculate statistics
    const totalRecords = weatherData.length
    const averageTemperature = weatherData.reduce((sum, w) => sum + w.temperature, 0) / weatherData.length || 0
    const totalRainfall = weatherData.reduce((sum, w) => sum + w.rainfall, 0)
    const averageHumidity = weatherData.reduce((sum, w) => sum + w.humidity, 0) / weatherData.length || 0

    const seasons = ["Winter", "Spring", "Summer", "Autumn"]
    const weatherConditions = ["Sunny", "Partly Cloudy", "Cloudy", "Rainy", "Light Rain", "Heavy Rain", "Clear", "Stormy"]
    const locations = ["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Barisal", "Rangpur", "Mymensingh"]

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center space-x-4">
                        <div
                            className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg border-2 border-blue-300">
                            <CloudRain className="h-8 w-8 text-white"/>
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-foreground">Weather Dashboard</h1>
                            <p className="text-muted-foreground text-lg mt-2">Real-time weather monitoring and
                                analysis</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => exportWeatherData(weatherData)}>
                            <FileDown className="w-4 h-4 mr-2"/>
                            Export Data
                        </Button>
                        <Button size="sm" onClick={() => setShowAddForm(!showAddForm)}>
                            <Plus className="w-4 h-4 mr-2"/>
                            Add Weather Data
                        </Button>
                    </div>
                </div>
                <div className="bg-card border-2 border-border p-8">
                    <div className="flex items-center justify-between gap-6">
                        <div className="relative w-80">
                            <Search
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"/>
                            <Input
                                type="search"
                                placeholder="Search locations..."
                                className="bg-input border-2 border-border text-foreground placeholder-muted-foreground pl-12 w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button onClick={refreshWeatherData} disabled={weatherLoading}
                                className="bg-primary text-primary-foreground hover:bg-primary/90 border-2 border-primary">
                            {weatherLoading ? "Loading..." : "Refresh Weather"}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-card border-2 border-border p-6 text-foreground">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-secondary border border-border">
                                <Sun className="h-6 w-6 text-foreground"/>
                            </div>
                            <div className="text-3xl font-bold text-foreground">
                                {averageTemperature.toFixed(1)}°C
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
                                {totalRainfall.toFixed(1)}mm
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
                                {averageHumidity}%
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
                                {totalRecords} Records
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Total Weather Records</h3>
                        <p className="text-muted-foreground text-sm">Total number of weather records</p>
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
                    {/* Add Weather Data Form - Positioned above table */}
                    {showAddForm && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Add Weather Data</CardTitle>
                                <CardDescription>Enter comprehensive weather monitoring data</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Basic Information Section */}
                                <div>
                                    <h4 className="text-lg font-medium text-gray-900 mb-4">Weather Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="location" className="text-gray-700">Location *</Label>
                                            <Select value={formData.location}
                                                    onValueChange={(value) => handleInputChange("location", value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select location..."/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {locations.map((location) => (
                                                        <SelectItem key={location} value={location}>
                                                            {location}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="date_recorded" className="text-gray-700">Date Recorded
                                                *</Label>
                                            <Input
                                                id="date_recorded"
                                                type="date"
                                                value={formData.date_recorded}
                                                onChange={(e) => handleInputChange("date_recorded", e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="season" className="text-gray-700">Season *</Label>
                                            <Select value={formData.season}
                                                    onValueChange={(value) => handleInputChange("season", value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select season..."/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {seasons.map((season) => (
                                                        <SelectItem key={season} value={season}>
                                                            {season}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                {/* Measurement Data Section */}
                                <div>
                                    <h4 className="text-lg font-medium text-gray-900 mb-4">Measurements</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="rainfall" className="text-gray-700">Rainfall (mm) *</Label>
                                            <Input
                                                id="rainfall"
                                                type="number"
                                                step="0.1"
                                                placeholder="e.g. 12.3"
                                                value={formData.rainfall}
                                                onChange={(e) => handleInputChange("rainfall", parseFloat(e.target.value) || 0)}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="temperature" className="text-gray-700">Temperature (°C)
                                                *</Label>
                                            <Input
                                                id="temperature"
                                                type="number"
                                                step="0.1"
                                                placeholder="e.g. 25.7"
                                                value={formData.temperature}
                                                onChange={(e) => handleInputChange("temperature", parseFloat(e.target.value) || 0)}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="humidity" className="text-gray-700">Humidity (%) *</Label>
                                            <Input
                                                id="humidity"
                                                type="number"
                                                step="0.1"
                                                placeholder="e.g. 70"
                                                value={formData.humidity}
                                                onChange={(e) => handleInputChange("humidity", parseFloat(e.target.value) || 0)}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="weather_conditions" className="text-gray-700">Weather
                                                Conditions *</Label>
                                            <Select value={formData.weather_conditions}
                                                    onValueChange={(value) => handleInputChange("weather_conditions", value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select condition..."/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {weatherConditions.map((condition) => (
                                                        <SelectItem key={condition} value={condition}>
                                                            {condition}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                {/* Form Actions */}
                                <div className="flex gap-4 pt-4 border-t border-gray-200">
                                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                                        <Plus className="h-4 w-4 mr-2"/>
                                        Add Weather Data
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}
                    <div className="border-2 border-border mt-4">
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