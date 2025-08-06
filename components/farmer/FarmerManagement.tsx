"use client"

import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Badge} from "@/components/ui/badge"
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip
} from "recharts"
import {TrendingUp, User, MapPin, Globe, Home, Factory, Search, Edit2, Trash2, Download} from "lucide-react"

interface Farmer {
    id: number
    farmerId: string
    fullName: string
    road: string
    house: string
    district: string
    area: string
    country: string
    experience: number
    weatherId: string
}

const initialFarmers: Farmer[] = [
    {
        id: 1,
        farmerId: "F001",
        fullName: "Ahmed Hassan",
        road: "Main Road",
        house: "12A",
        district: "Dhaka",
        area: "Dhanmondi",
        country: "Bangladesh",
        experience: 15,
        weatherId: "W001"
    },
    {
        id: 2,
        farmerId: "F002",
        fullName: "Fatima Khan",
        road: "Green Street",
        house: "45B",
        district: "Chittagong",
        area: "Agrabad",
        country: "Bangladesh",
        experience: 8,
        weatherId: "W002"
    }
]

export default function FarmerManagement() {
    const [farmers, setFarmers] = useState<Farmer[]>(initialFarmers)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedDistrict, setSelectedDistrict] = useState("all")
    const [selectedCountry, setSelectedCountry] = useState("all")
    const [formData, setFormData] = useState({
        farmerId: "",
        fullName: "",
        road: "",
        house: "",
        district: "",
        area: "",
        country: "",
        experience: "",
        weatherId: ""
    })

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({...prev, [field]: value}))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const newFarmer: Farmer = {
            id: farmers.length + 1,
            farmerId: formData.farmerId,
            fullName: formData.fullName,
            road: formData.road,
            house: formData.house,
            district: formData.district,
            area: formData.area,
            country: formData.country,
            experience: parseInt(formData.experience),
            weatherId: formData.weatherId
        }
        setFarmers([...farmers, newFarmer])
        setFormData({
            farmerId: "",
            fullName: "",
            road: "",
            house: "",
            district: "",
            area: "",
            country: "",
            experience: "",
            weatherId: ""
        })
    }

    const handleDelete = (id: number) => {
        setFarmers(farmers.filter(farmer => farmer.id !== id))
    }

    // Filter farmers
    const filteredData = farmers.filter(farmer => {
        const matchesSearch = farmer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            farmer.farmerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            farmer.district.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesDistrict = selectedDistrict === "all" || farmer.district === selectedDistrict
        const matchesCountry = selectedCountry === "all" || farmer.country === selectedCountry
        return matchesSearch && matchesDistrict && matchesCountry
    })

    // Statistics
    const totalFarmers = farmers.length
    const avgExperience = farmers.length > 0 ? farmers.reduce((sum, f) => sum + f.experience, 0) / farmers.length : 0
    const uniqueDistricts = Array.from(new Set(farmers.map(f => f.district)))
    const uniqueCountries = Array.from(new Set(farmers.map(f => f.country)))

    // Chart data
    const districtData = uniqueDistricts.map((district, index) => ({
        name: district,
        value: farmers.filter(f => f.district === district).length,
        percentage: (farmers.filter(f => f.district === district).length / farmers.length * 100).toFixed(1),
        color: index % 2 === 0 ? "#000000" : "#666666"
    }))

    const countryData = uniqueCountries.map((country, index) => ({
        name: country,
        value: farmers.filter(f => f.country === country).length,
        percentage: (farmers.filter(f => f.country === country).length / farmers.length * 100).toFixed(1),
        color: index % 2 === 0 ? "#000000" : "#666666"
    }))

    const experienceRanges = [
        {name: "0-5 years", min: 0, max: 5},
        {name: "6-10 years", min: 6, max: 10},
        {name: "11-15 years", min: 11, max: 15},
        {name: "16+ years", min: 16, max: 100}
    ]

    const experienceData = experienceRanges.map(range => ({
        name: range.name,
        value: farmers.filter(f => f.experience >= range.min && f.experience <= range.max).length
    }))

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="bg-card border-2 border-border p-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-4 bg-secondary border-2 border-border">
                            <TrendingUp className="h-10 w-10 text-foreground"/>
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-foreground">
                                Farmer Management System
                            </h1>
                            <p className="text-lg text-muted-foreground mt-2">
                                Manage farmer profiles with comprehensive data and analytics
                            </p>
                        </div>
                    </div>
                    <div className="mt-6 flex gap-3">
                        <Button
                            className="bg-primary text-primary-foreground hover:bg-primary/90 border-2 border-primary">
                            <Download className="w-4 h-4 mr-2"/>
                            Export Data
                        </Button>
                    </div>
                </div>

                {/* Statistics */}
                <div className="bg-card border-2 border-border p-8">
                    <div className="flex items-center gap-6 pb-6">
                        <div className="p-4 bg-secondary border-2 border-border">
                            <TrendingUp className="w-8 h-8 text-foreground"/>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-foreground">
                                Farmers Statistics
                            </h2>
                            <p className="text-muted-foreground mt-1">Comprehensive overview of registered farmers</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="text-center p-6 bg-card border-2 border-border">
                            <div className="text-3xl font-bold mb-2 text-foreground">{totalFarmers}</div>
                            <p className="text-muted-foreground font-medium">Total Farmers</p>
                        </div>
                        <div className="text-center p-6 bg-card border-2 border-border">
                            <div className="text-3xl font-bold mb-2 text-foreground">{avgExperience.toFixed(1)}</div>
                            <p className="text-muted-foreground font-medium">Average Experience</p>
                        </div>
                        <div className="text-center p-6 bg-card border-2 border-border">
                            <div className="text-3xl font-bold mb-2 text-foreground">{uniqueDistricts.length}</div>
                            <p className="text-muted-foreground font-medium">Districts Covered</p>
                        </div>
                        <div className="text-center p-6 bg-card border-2 border-border">
                            <div className="text-3xl font-bold mb-2 text-foreground">{uniqueCountries.length}</div>
                            <p className="text-muted-foreground font-medium">Countries</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-card border-2 border-border p-8">
                    <div className="pb-8">
                        <h2 className="text-3xl font-bold text-foreground mb-2">
                            Submit Farmer Data
                        </h2>
                        <p className="text-muted-foreground text-lg">Enter new farmer information with complete
                            details</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="space-y-3">
                                <Label htmlFor="farmerId"
                                       className="flex items-center gap-2 text-foreground font-semibold">
                                    <div className="p-2 bg-secondary border border-border">
                                        <User className="w-4 h-4 text-foreground"/>
                                    </div>
                                    Farmer ID
                                </Label>
                                <Input
                                    id="farmerId"
                                    placeholder="Enter farmer ID"
                                    value={formData.farmerId}
                                    onChange={(e) => handleInputChange("farmerId", e.target.value)}
                                    className="bg-input border-2 border-border text-foreground placeholder-muted-foreground"
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="fullName"
                                       className="flex items-center gap-2 text-foreground font-semibold">
                                    <div className="p-2 bg-secondary border border-border">
                                        <User className="w-4 h-4 text-foreground"/>
                                    </div>
                                    Full Name
                                </Label>
                                <Input
                                    id="fullName"
                                    placeholder="Enter full name"
                                    value={formData.fullName}
                                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                                    className="bg-input border-2 border-border text-foreground placeholder-muted-foreground"
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="road" className="flex items-center gap-2 text-foreground font-semibold">
                                    <div className="p-2 bg-secondary border border-border">
                                        <MapPin className="w-4 h-4 text-foreground"/>
                                    </div>
                                    Road
                                </Label>
                                <Input
                                    id="road"
                                    placeholder="Enter road name"
                                    value={formData.road}
                                    onChange={(e) => handleInputChange("road", e.target.value)}
                                    className="bg-input border-2 border-border text-foreground placeholder-muted-foreground"
                                />
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="house"
                                       className="flex items-center gap-2 text-foreground font-semibold">
                                    <div className="p-2 bg-secondary border border-border">
                                        <Home className="w-4 h-4 text-foreground"/>
                                    </div>
                                    House
                                </Label>
                                <Input
                                    id="house"
                                    placeholder="Enter house number"
                                    value={formData.house}
                                    onChange={(e) => handleInputChange("house", e.target.value)}
                                    className="bg-input border-2 border-border text-foreground placeholder-muted-foreground"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="space-y-3">
                                <Label htmlFor="district"
                                       className="flex items-center gap-2 text-foreground font-semibold">
                                    <div className="p-2 bg-secondary border border-border">
                                        <MapPin className="w-4 h-4 text-foreground"/>
                                    </div>
                                    District
                                </Label>
                                <Select value={formData.district}
                                        onValueChange={(value) => handleInputChange("district", value)}>
                                    <SelectTrigger className="bg-input border-2 border-border text-foreground">
                                        <SelectValue placeholder="Select district"/>
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-2 border-border">
                                        <SelectItem value="Dhaka"
                                                    className="text-foreground hover:bg-secondary">Dhaka</SelectItem>
                                        <SelectItem value="Chittagong"
                                                    className="text-foreground hover:bg-secondary">Chittagong</SelectItem>
                                        <SelectItem value="Sylhet"
                                                    className="text-foreground hover:bg-secondary">Sylhet</SelectItem>
                                        <SelectItem value="Rajshahi"
                                                    className="text-foreground hover:bg-secondary">Rajshahi</SelectItem>
                                        <SelectItem value="Khulna"
                                                    className="text-foreground hover:bg-secondary">Khulna</SelectItem>
                                        <SelectItem value="Barisal"
                                                    className="text-foreground hover:bg-secondary">Barisal</SelectItem>
                                        <SelectItem value="Rangpur"
                                                    className="text-foreground hover:bg-secondary">Rangpur</SelectItem>
                                        <SelectItem value="Mymensingh"
                                                    className="text-foreground hover:bg-secondary">Mymensingh</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="area" className="flex items-center gap-2 text-foreground font-semibold">
                                    <div className="p-2 bg-secondary border border-border">
                                        <Globe className="w-4 h-4 text-foreground"/>
                                    </div>
                                    Area
                                </Label>
                                <Input
                                    id="area"
                                    placeholder="Enter area"
                                    value={formData.area}
                                    onChange={(e) => handleInputChange("area", e.target.value)}
                                    className="bg-input border-2 border-border text-foreground placeholder-muted-foreground"
                                />
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="country"
                                       className="flex items-center gap-2 text-foreground font-semibold">
                                    <div className="p-2 bg-secondary border border-border">
                                        <Globe className="w-4 h-4 text-foreground"/>
                                    </div>
                                    Country
                                </Label>
                                <Select value={formData.country}
                                        onValueChange={(value) => handleInputChange("country", value)}>
                                    <SelectTrigger className="bg-input border-2 border-border text-foreground">
                                        <SelectValue placeholder="Select country"/>
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-2 border-border">
                                        <SelectItem value="Bangladesh"
                                                    className="text-foreground hover:bg-secondary">Bangladesh</SelectItem>
                                        <SelectItem value="India"
                                                    className="text-foreground hover:bg-secondary">India</SelectItem>
                                        <SelectItem value="Pakistan"
                                                    className="text-foreground hover:bg-secondary">Pakistan</SelectItem>
                                        <SelectItem value="Other"
                                                    className="text-foreground hover:bg-secondary">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="experience"
                                       className="flex items-center gap-2 text-foreground font-semibold">
                                    <div className="p-2 bg-secondary border border-border">
                                        <TrendingUp className="w-4 h-4 text-foreground"/>
                                    </div>
                                    Experience
                                </Label>
                                <Input
                                    id="experience"
                                    type="number"
                                    placeholder="Years of experience"
                                    value={formData.experience}
                                    onChange={(e) => handleInputChange("experience", e.target.value)}
                                    className="bg-input border-2 border-border text-foreground placeholder-muted-foreground"
                                    min="0"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label htmlFor="weatherId"
                                       className="flex items-center gap-2 text-foreground font-semibold">
                                    <div className="p-2 bg-secondary border border-border">
                                        <Factory className="w-4 h-4 text-foreground"/>
                                    </div>
                                    Weather ID
                                </Label>
                                <Input
                                    id="weatherId"
                                    placeholder="Enter weather ID"
                                    value={formData.weatherId}
                                    onChange={(e) => handleInputChange("weatherId", e.target.value)}
                                    className="bg-input border-2 border-border text-foreground placeholder-muted-foreground"
                                />
                            </div>
                        </div>

                        <div className="flex justify-start pt-6">
                            <Button type="submit"
                                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-12 py-4 text-lg font-semibold border-2 border-primary">
                                <User className="w-5 h-5 mr-3"/>
                                SUBMIT FARMER DATA
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Table */}
                <div className="bg-card border-2 border-border p-8">
                    <div className="pb-8">
                        <h2 className="text-3xl font-bold text-foreground mb-2">
                            Farmer Directory
                        </h2>
                        <p className="text-muted-foreground text-lg">Search and manage registered farmers</p>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 mb-8">
                        <div className="relative flex-1">
                            <Search
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"/>
                            <Input
                                placeholder="Search farmers by name, ID, district..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-input border-2 border-border text-foreground placeholder-muted-foreground pl-12"
                            />
                        </div>
                        {uniqueDistricts.length > 0 && (
                            <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                                <SelectTrigger
                                    className="bg-input border-2 border-border text-foreground w-full md:w-48">
                                    <SelectValue placeholder="Select District"/>
                                </SelectTrigger>
                                <SelectContent className="bg-card border-2 border-border">
                                    <SelectItem value="all" className="text-foreground hover:bg-secondary">All
                                        Districts</SelectItem>
                                    {uniqueDistricts.map((district) => (
                                        <SelectItem key={district} value={district}
                                                    className="text-foreground hover:bg-secondary">
                                            {district}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                        {uniqueCountries.length > 0 && (
                            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                                <SelectTrigger
                                    className="bg-input border-2 border-border text-foreground w-full md:w-48">
                                    <SelectValue placeholder="Select Country"/>
                                </SelectTrigger>
                                <SelectContent className="bg-card border-2 border-border">
                                    <SelectItem value="all" className="text-foreground hover:bg-secondary">All
                                        Countries</SelectItem>
                                    {uniqueCountries.map((country) => (
                                        <SelectItem key={country} value={country}
                                                    className="text-foreground hover:bg-secondary">
                                            {country}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    <div className="border-2 border-border">
                        <Table>
                            <TableHeader className="bg-secondary border-b-2 border-border">
                                <TableRow>
                                    <TableHead
                                        className="text-foreground font-semibold border-r border-border">ID</TableHead>
                                    <TableHead
                                        className="text-foreground font-semibold border-r border-border">Name</TableHead>
                                    <TableHead
                                        className="text-foreground font-semibold border-r border-border">Location</TableHead>
                                    <TableHead
                                        className="text-foreground font-semibold border-r border-border">Experience</TableHead>
                                    <TableHead className="text-foreground font-semibold border-r border-border">Weather
                                        ID</TableHead>
                                    <TableHead className="text-foreground font-semibold">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="bg-card">
                                {filteredData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                            <div className="flex flex-col items-center gap-3">
                                                <User className="h-12 w-12 text-muted-foreground"/>
                                                <p className="text-lg">No farmers registered yet.</p>
                                                <p className="text-sm">Use the form above to add farmers.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredData.map((farmer) => (
                                        <TableRow key={farmer.id}
                                                  className="border-b border-border hover:bg-secondary/50">
                                            <TableCell
                                                className="font-semibold text-foreground border-r border-border">{farmer.farmerId}</TableCell>
                                            <TableCell
                                                className="font-medium text-foreground border-r border-border">{farmer.fullName}</TableCell>
                                            <TableCell className="text-muted-foreground border-r border-border">
                                                {[farmer.house, farmer.road, farmer.area, farmer.district, farmer.country]
                                                    .filter(Boolean)
                                                    .join(", ")}
                                            </TableCell>
                                            <TableCell className="border-r border-border">
                                                <Badge
                                                    className="bg-foreground text-background border border-foreground">
                                                    {farmer.experience} years
                                                </Badge>
                                            </TableCell>
                                            <TableCell
                                                className="text-muted-foreground border-r border-border">{farmer.weatherId || "N/A"}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    <Button variant="ghost" size="sm"
                                                            className="hover:bg-secondary border border-border">
                                                        <Edit2 className="w-4 h-4 text-foreground"/>
                                                    </Button>
                                                    <Button variant="ghost" size="sm"
                                                            className="hover:bg-secondary border border-border"
                                                            onClick={() => handleDelete(farmer.id)}>
                                                        <Trash2 className="w-4 h-4 text-foreground"/>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-card border-2 border-border p-8">
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-foreground mb-2">
                                Farmers by District
                            </h3>
                            <p className="text-muted-foreground">Distribution of farmers across different districts</p>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={districtData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={120}
                                        paddingAngle={2}
                                        dataKey="value"
                                        label={({name, percentage}) => `${name}: ${percentage}%`}
                                    >
                                        {districtData.map((entry) => (
                                            <Cell key={`cell-${entry.name}`} fill={entry.color}/>
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value, name) => [`${value} farmers`, name]} contentStyle={{
                                        backgroundColor: 'var(--card)',
                                        border: '2px solid var(--border)',
                                        borderRadius: '0',
                                        color: 'var(--foreground)'
                                    }}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-card border-2 border-border p-8">
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-foreground mb-2">
                                Experience Distribution
                            </h3>
                            <p className="text-muted-foreground">Number of farmers by experience range</p>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={experienceData} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)"/>
                                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100}
                                           stroke="var(--muted-foreground)"/>
                                    <YAxis stroke="var(--muted-foreground)"/>
                                    <Tooltip formatter={(value) => [`${value} farmers`, "Count"]} contentStyle={{
                                        backgroundColor: 'var(--card)',
                                        border: '2px solid var(--border)',
                                        borderRadius: '0',
                                        color: 'var(--foreground)'
                                    }}/>
                                    <Bar dataKey="value" fill="var(--foreground)" radius={[0, 0, 0, 0]}/>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Country Chart */}
                {uniqueCountries.length > 1 && (
                    <div className="bg-card border-2 border-border p-8">
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-foreground mb-2">
                                Farmers by Country
                            </h3>
                            <p className="text-muted-foreground">Distribution of farmers across countries</p>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={countryData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={120}
                                        dataKey="value"
                                        label={({name, percentage}) => `${name}: ${percentage}%`}
                                    >
                                        {countryData.map((entry) => (
                                            <Cell key={`cell-${entry.name}`} fill={entry.color}/>
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value, name) => [`${value} farmers`, name]} contentStyle={{
                                        backgroundColor: 'var(--card)',
                                        border: '2px solid var(--border)',
                                        borderRadius: '0',
                                        color: 'var(--foreground)'
                                    }}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}