"use client"

import {useState, useEffect} from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Search, Plus, Edit2, Trash2, CreditCard} from "lucide-react"

interface Transaction {
    transaction_id: string
    buyer_id: string
    seller_id: string
    product_id: string
    quantity: number
    price_per_unit: number
    total_amount: number
    date: string
    buyer_name?: string
    seller_name?: string
    product_name?: string
}

interface Stakeholder {
    stakeholder_id: string
    name: string
}

interface Product {
    product_id: string
    name: string
}

export default function TransactionManagement() {
    // Helper function for safe number formatting
    const safeNumberFormat = (value: any, decimals: number = 2): string => {
        const num = parseFloat(value)
        return isNaN(num) ? '0.00' : num.toFixed(decimals)
    }
    
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [stakeholders, setStakeholders] = useState<Stakeholder[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [showForm, setShowForm] = useState(false)
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
    const [formData, setFormData] = useState<Transaction>({
        transaction_id: "",
        buyer_id: "",
        seller_id: "",
        product_id: "",
        quantity: 0,
        price_per_unit: 0,
        total_amount: 0,
        date: ""
    })

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        // Auto-calculate total amount when quantity or price changes
        const total = formData.quantity * formData.price_per_unit;
        if (total !== formData.total_amount) {
            setFormData(prev => ({ ...prev, total_amount: total }));
        }
    }, [formData.quantity, formData.price_per_unit]);

    const fetchData = async () => {
        try {
            const [transactionsRes, stakeholdersRes, productsRes] = await Promise.all([
                fetch('/api/transactions'),
                fetch('/api/stakeholders'),
                fetch('/api/products')
            ]);
            
            const transactionsData = await transactionsRes.json();
            const stakeholdersData = await stakeholdersRes.json();
            const productsData = await productsRes.json();
            
            setTransactions(transactionsData);
            setStakeholders(stakeholdersData);
            setProducts(productsData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: keyof Transaction, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const method = editingTransaction ? 'PUT' : 'POST';
            const response = await fetch('/api/transactions', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            
            if (response.ok) {
                await fetchData();
                resetForm();
            }
        } catch (error) {
            console.error('Error saving transaction:', error);
        }
    }

    const handleEdit = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setFormData(transaction);
        setShowForm(true);
    }

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this transaction?')) {
            try {
                const response = await fetch(`/api/transactions?id=${id}`, {
                    method: 'DELETE',
                });
                
                if (response.ok) {
                    await fetchData();
                }
            } catch (error) {
                console.error('Error deleting transaction:', error);
            }
        }
    }

    const resetForm = () => {
        setFormData({
            transaction_id: "",
            buyer_id: "",
            seller_id: "",
            product_id: "",
            quantity: 0,
            price_per_unit: 0,
            total_amount: 0,
            date: ""
        });
        setEditingTransaction(null);
        setShowForm(false);
    }

    const filteredTransactions = transactions.filter(transaction => {
        const matchesSearch = (transaction.buyer_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (transaction.seller_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (transaction.product_name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        return matchesSearch
    })

    const totalValue = transactions.reduce((sum, t) => sum + (t.total_amount || 0), 0);
    const totalQuantity = transactions.reduce((sum, t) => sum + (t.quantity || 0), 0);

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
                            <h1 className="text-3xl font-bold text-foreground mb-2">Transaction Management</h1>
                            <p className="text-muted-foreground">Track all agricultural product transactions</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="bg-purple-50 p-4 rounded-xl">
                                <CreditCard className="h-8 w-8 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Total Transactions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">{transactions.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Total Value</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">৳{totalValue.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Total Quantity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">{totalQuantity.toLocaleString()} kg</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Controls */}
                <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Search transactions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-full md:w-64"
                            />
                        </div>
                        <Button onClick={() => setShowForm(true)} className="bg-purple-600 hover:bg-purple-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Transaction
                        </Button>
                    </div>
                </div>

                {/* Add/Edit Form */}
                {showForm && (
                    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                        <h2 className="text-xl font-semibold text-foreground mb-4">
                            {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
                        </h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="transaction_id">Transaction ID *</Label>
                                <Input
                                    id="transaction_id"
                                    value={formData.transaction_id}
                                    onChange={(e) => handleInputChange("transaction_id", e.target.value)}
                                    required
                                    disabled={!!editingTransaction}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="product_id">Product *</Label>
                                <Select value={formData.product_id} onValueChange={(value) => handleInputChange("product_id", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select product" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {products.map(product => (
                                            <SelectItem key={product.product_id} value={product.product_id}>
                                                {product.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="buyer_id">Buyer *</Label>
                                <Select value={formData.buyer_id} onValueChange={(value) => handleInputChange("buyer_id", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select buyer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {stakeholders.map(stakeholder => (
                                            <SelectItem key={stakeholder.stakeholder_id} value={stakeholder.stakeholder_id}>
                                                {stakeholder.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="seller_id">Seller *</Label>
                                <Select value={formData.seller_id} onValueChange={(value) => handleInputChange("seller_id", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select seller" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {stakeholders.map(stakeholder => (
                                            <SelectItem key={stakeholder.stakeholder_id} value={stakeholder.stakeholder_id}>
                                                {stakeholder.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="quantity">Quantity (kg) *</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    value={formData.quantity}
                                    onChange={(e) => handleInputChange("quantity", parseInt(e.target.value) || 0)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="price_per_unit">Price per Unit (৳) *</Label>
                                <Input
                                    id="price_per_unit"
                                    type="number"
                                    step="0.01"
                                    value={formData.price_per_unit}
                                    onChange={(e) => handleInputChange("price_per_unit", parseFloat(e.target.value) || 0)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="total_amount">Total Amount (৳)</Label>
                                <Input
                                    id="total_amount"
                                    type="number"
                                    step="0.01"
                                    value={formData.total_amount}
                                    onChange={(e) => handleInputChange("total_amount", parseFloat(e.target.value) || 0)}
                                    disabled
                                />
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

                            <div className="md:col-span-2 flex gap-4">
                                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                                    {editingTransaction ? 'Update Transaction' : 'Add Transaction'}
                                </Button>
                                <Button type="button" variant="outline" onClick={resetForm}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Transactions Table */}
                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-border">
                        <h2 className="text-xl font-semibold text-foreground">
                            Transactions ({filteredTransactions.length})
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead>Transaction ID</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Buyer</TableHead>
                                    <TableHead>Seller</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Price/Unit</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTransactions.map((transaction) => (
                                    <TableRow key={transaction.transaction_id} className="hover:bg-gray-50">
                                        <TableCell className="font-medium">{transaction.transaction_id}</TableCell>
                                        <TableCell>{transaction.product_name || transaction.product_id}</TableCell>
                                        <TableCell>{transaction.buyer_name || transaction.buyer_id}</TableCell>
                                        <TableCell>{transaction.seller_name || transaction.seller_id}</TableCell>
                                        <TableCell>{(transaction.quantity || 0)} kg</TableCell>
                                        <TableCell>৳{safeNumberFormat(transaction.price_per_unit)}</TableCell>
                                        <TableCell>৳{(transaction.total_amount || 0).toLocaleString()}</TableCell>
                                        <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                                    onClick={() => handleEdit(transaction)}
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                                    onClick={() => handleDelete(transaction.transaction_id)}
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
