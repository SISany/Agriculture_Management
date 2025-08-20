"use client"

import {useState, useEffect} from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Search, Plus, Edit2, Trash2, Cloud, Droplets, Thermometer} from "lucide-react"

interface Weather {
    weather_id: string
    district_id: number
    date: string
    rainfall: number
    temperature: number
    district_name?: string
}

interface District {
    district_id: number
    name: string
}

export default function WeatherDashboard() {
    const [weather, setWeather] = useState<Weather[]>([])
    const [districts, setDistricts] = useState<District[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedDistrict, setSelectedDistrict] = useState("all")
    const [showForm, setShowForm] = useState(false)
    const [editingWeather, setEditingWeather] = useState<Weather | null>(null)
    const [formData, setFormData] = useState<Weather>({
        weather_id: "",
        district_id: 0,
        date: "",
        rainfall: 0,
        temperature: 0
    })

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [weatherRes, districtsRes] = await Promise.all([
                fetch('/api/weather'),
                fetch('/api/districts')
            ]);
            
            const weatherData = await weatherRes.json();
            const districtsData = await districtsRes.json();
            
            setWeather(weatherData);
            setDistricts(districtsData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: keyof Weather, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const method = editingWeather ? 'PUT' : 'POST';
            const response = await fetch('/api/weather', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            
            if (response.ok) {
                await fetchData();
                resetForm();
            }
        } catch (error) {
            console.error('Error saving weather:', error);
        }
    }

    const handleEdit = (weatherRecord: Weather) => {
        setEditingWeather(weatherRecord);
        setFormData(weatherRecord);
        setShowForm(true);
    }

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this weather record?')) {
            try {
                const response = await fetch(`/api/weather?id=${id}`, {
                    method: 'DELETE',
                });
                
                if (response.ok) {
                    await fetchData();
                }
            } catch (error) {
                console.error('Error deleting weather:', error);
            }
        }
    }

    const resetForm = () => {
        setFormData({
            weather_id: "",
            district_id: 0,
            date: "",
            rainfall: 0,
            temperature: 0
        });
        setEditingWeather(null);
        setShowForm(false);
    }

    const filteredWeather = weather.filter(record => {
        const matchesSearch = (record.district_name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        const matchesDistrict = selectedDistrict === "all" || record.district_id.toString() === selectedDistrict
        return matchesSearch && matchesDistrict
    })

    const averageRainfall = weather.length > 0 ? weather.reduce((sum, w) => sum + (w.rainfall || 0), 0) / weather.length : 0;
    const averageTemperature = weather.length > 0 ? weather.reduce((sum, w) => sum + (w.temperature || 0), 0) / weather.length : 0;
    const maxRainfall = weather.length > 0 ? Math.max(...weather.map(w => w.rainfall || 0)) : 0;
    const maxTemperature = weather.length > 0 ? Math.max(...weather.map(w => w.temperature || 0)) : 0;

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Weather Dashboard</h1>
                            <p className="text-gray-600">Monitor daily weather conditions across districts</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="bg-sky-50 p-4 rounded-xl">
                                <Cloud className="h-8 w-8 text-sky-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Total Records</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">{weather.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2 flex flex-row items-center space-y-0 space-x-2">
                            <Droplets className="h-4 w-4 text-blue-600" />
                            <CardTitle className="text-sm font-medium text-gray-500">Avg Rainfall</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-blue-600">{averageRainfall.toFixed(1)}mm</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2 flex flex-row items-center space-y-0 space-x-2">
                            <Thermometer className="h-4 w-4 text-red-600" />
                            <CardTitle className="text-sm font-medium text-gray-500">Avg Temperature</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-red-600">{averageTemperature.toFixed(1)}°C</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Max Rainfall</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-blue-800">{maxRainfall.toFixed(1)}mm</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Controls */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Search by district..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-full md:w-64"
                                />
                            </div>
                            <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                                <SelectTrigger className="w-full md:w-40">
                                    <SelectValue placeholder="All Districts" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Districts</SelectItem>
                                    {districts.map(district => (
                                        <SelectItem key={district.district_id} value={district.district_id.toString()}>
                                            {district.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={() => setShowForm(true)} className="bg-sky-600 hover:bg-sky-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Weather
                        </Button>
                    </div>
                </div>

                {/* Add/Edit Form */}
                {showForm && (
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            {editingWeather ? 'Edit Weather' : 'Add New Weather Record'}
                        </h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="weather_id">Weather ID *</Label>
                                <Input
                                    id="weather_id"
                                    value={formData.weather_id}
                                    onChange={(e) => handleInputChange("weather_id", e.target.value)}
                                    required
                                    disabled={!!editingWeather}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="district_id">District *</Label>
                                <Select value={formData.district_id.toString()} onValueChange={(value) => handleInputChange("district_id", parseInt(value))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select district" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {districts.map(district => (
                                            <SelectItem key={district.district_id} value={district.district_id.toString()}>
                                                {district.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="date">Date *</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => handleInputChange("date", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="rainfall">Rainfall (mm)</Label>
                                <Input
                                    id="rainfall"
                                    type="number"
                                    step="0.1"
                                    value={formData.rainfall}
                                    onChange={(e) => handleInputChange("rainfall", parseFloat(e.target.value) || 0)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="temperature">Temperature (°C)</Label>
                                <Input
                                    id="temperature"
                                    type="number"
                                    step="0.1"
                                    value={formData.temperature}
                                    onChange={(e) => handleInputChange("temperature", parseFloat(e.target.value) || 0)}
                                />
                            </div>

                            <div className="md:col-span-2 flex gap-4">
                                <Button type="submit" className="bg-sky-600 hover:bg-sky-700">
                                    {editingWeather ? 'Update Weather' : 'Add Weather'}
                                </Button>
                                <Button type="button" variant="outline" onClick={resetForm}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Weather Table */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Weather Records ({filteredWeather.length})
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead>Weather ID</TableHead>
                                    <TableHead>District</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Rainfall (mm)</TableHead>
                                    <TableHead>Temperature (°C)</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredWeather.map((weatherRecord) => (
                                    <TableRow key={weatherRecord.weather_id} className="hover:bg-gray-50">
                                        <TableCell className="font-medium">{weatherRecord.weather_id}</TableCell>
                                        <TableCell>{weatherRecord.district_name || weatherRecord.district_id}</TableCell>
                                        <TableCell>{new Date(weatherRecord.date).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-1">
                                                <Droplets className="h-4 w-4 text-blue-600" />
                                                <span>{weatherRecord.rainfall.toFixed(1)}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-1">
                                                <Thermometer className="h-4 w-4 text-red-600" />
                                                <span>{weatherRecord.temperature.toFixed(1)}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                                    onClick={() => handleEdit(weatherRecord)}
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                                    onClick={() => handleDelete(weatherRecord.weather_id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
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
