"use client"

import {useState, useEffect} from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Badge} from "@/components/ui/badge"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Search, Plus, Edit2, Trash2, Users} from "lucide-react"

interface Stakeholder {
    stakeholder_id: string
    name: string
    type_id: number
    district_id: number
    contact_info: string
    type_name?: string
    district_name?: string
}

interface StakeholderType {
    type_id: number
    type_name: string
}

interface District {
    district_id: number
    name: string
}

export default function StakeholderManagement() {
    const [stakeholders, setStakeholders] = useState<Stakeholder[]>([])
    const [stakeholderTypes, setStakeholderTypes] = useState<StakeholderType[]>([])
    const [districts, setDistricts] = useState<District[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedType, setSelectedType] = useState("all")
    const [showForm, setShowForm] = useState(false)
    const [editingStakeholder, setEditingStakeholder] = useState<Stakeholder | null>(null)
    const [formData, setFormData] = useState<Stakeholder>({
        stakeholder_id: "",
        name: "",
        type_id: 0,
        district_id: 0,
        contact_info: ""
    })

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [stakeholdersRes, typesRes, districtsRes] = await Promise.all([
                fetch('/api/stakeholders'),
                fetch('/api/stakeholder-types'),
                fetch('/api/districts')
            ]);
            
            const stakeholdersData = await stakeholdersRes.json();
            const typesData = await typesRes.json();
            const districtsData = await districtsRes.json();
            
            setStakeholders(stakeholdersData);
            setStakeholderTypes(typesData);
            setDistricts(districtsData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: keyof Stakeholder, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const method = editingStakeholder ? 'PUT' : 'POST';
            const response = await fetch('/api/stakeholders', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            
            if (response.ok) {
                await fetchData();
                resetForm();
            }
        } catch (error) {
            console.error('Error saving stakeholder:', error);
        }
    }

    const handleEdit = (stakeholder: Stakeholder) => {
        setEditingStakeholder(stakeholder);
        setFormData(stakeholder);
        setShowForm(true);
    }

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this stakeholder?')) {
            try {
                const response = await fetch(`/api/stakeholders?id=${id}`, {
                    method: 'DELETE',
                });
                
                if (response.ok) {
                    await fetchData();
                }
            } catch (error) {
                console.error('Error deleting stakeholder:', error);
            }
        }
    }

    const resetForm = () => {
        setFormData({
            stakeholder_id: "",
            name: "",
            type_id: 0,
            district_id: 0,
            contact_info: ""
        });
        setEditingStakeholder(null);
        setShowForm(false);
    }

    const filteredStakeholders = stakeholders.filter(stakeholder => {
        const matchesSearch = (stakeholder.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (stakeholder.contact_info?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        const matchesType = selectedType === "all" || stakeholder.type_id.toString() === selectedType
        return matchesSearch && matchesType
    })

    const getTypeBadgeColor = (typeName: string) => {
        switch (typeName) {
            case 'Farmer': return 'bg-green-100 text-green-800'
            case 'Wholesaler': return 'bg-blue-100 text-blue-800'
            case 'Retailer': return 'bg-purple-100 text-purple-800'
            case 'Consumer': return 'bg-orange-100 text-orange-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground mb-2">Stakeholder Management</h1>
                            <p className="text-muted-foreground">Manage farmers, wholesalers, retailers, and consumers</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="bg-blue-50 p-4 rounded-xl">
                                <Users className="h-8 w-8 text-blue-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Total Stakeholders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">{stakeholders.length}</div>
                        </CardContent>
                    </Card>
                    {stakeholderTypes.map(type => (
                        <Card key={type.type_id}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500">{type.type_name}s</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-foreground">
                                    {stakeholders.filter(s => s.type_id === type.type_id).length}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Controls */}
                <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Search stakeholders..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-full md:w-64"
                                />
                            </div>
                            <Select value={selectedType} onValueChange={setSelectedType}>
                                <SelectTrigger className="w-full md:w-40">
                                    <SelectValue placeholder="All Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    {stakeholderTypes.map(type => (
                                        <SelectItem key={type.type_id} value={type.type_id.toString()}>
                                            {type.type_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Stakeholder
                        </Button>
                    </div>
                </div>

                {/* Add/Edit Form */}
                {showForm && (
                    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                        <h2 className="text-xl font-semibold text-foreground mb-4">
                            {editingStakeholder ? 'Edit Stakeholder' : 'Add New Stakeholder'}
                        </h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="stakeholder_id">Stakeholder ID *</Label>
                                <Input
                                    id="stakeholder_id"
                                    value={formData.stakeholder_id}
                                    onChange={(e) => handleInputChange("stakeholder_id", e.target.value)}
                                    required
                                    disabled={!!editingStakeholder}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name">Name *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type_id">Type *</Label>
                                <Select value={formData.type_id.toString()} onValueChange={(value) => handleInputChange("type_id", parseInt(value))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {stakeholderTypes.map(type => (
                                            <SelectItem key={type.type_id} value={type.type_id.toString()}>
                                                {type.type_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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

                            <div className="md:col-span-2 space-y-2">
                                <Label htmlFor="contact_info">Contact Information</Label>
                                <Input
                                    id="contact_info"
                                    value={formData.contact_info}
                                    onChange={(e) => handleInputChange("contact_info", e.target.value)}
                                    placeholder="Email, phone, or other contact details"
                                />
                            </div>

                            <div className="md:col-span-2 flex gap-4">
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                                    {editingStakeholder ? 'Update Stakeholder' : 'Add Stakeholder'}
                                </Button>
                                <Button type="button" variant="outline" onClick={resetForm}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Stakeholders Table */}
                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-border">
                        <h2 className="text-xl font-semibold text-foreground">
                            Stakeholders ({filteredStakeholders.length})
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead>ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>District</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredStakeholders.map((stakeholder) => (
                                    <TableRow key={stakeholder.stakeholder_id} className="hover:bg-gray-50">
                                        <TableCell className="font-medium">{stakeholder.stakeholder_id}</TableCell>
                                        <TableCell>{stakeholder.name}</TableCell>
                                        <TableCell>
                                            <Badge className={getTypeBadgeColor(stakeholder.type_name || '')}>
                                                {stakeholder.type_name}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{stakeholder.district_name || stakeholder.district_id}</TableCell>
                                        <TableCell>{stakeholder.contact_info || 'N/A'}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                                    onClick={() => handleEdit(stakeholder)}
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                                    onClick={() => handleDelete(stakeholder.stakeholder_id)}
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
