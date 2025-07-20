"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Save } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function DataEntryForm() {
  const [activeTab, setActiveTab] = useState("product")
  const [formData, setFormData] = useState({
    // Product form
    productName: "",
    productCategory: "",
    productDescription: "",
    productUnit: "",

    // Stock form
    stockProduct: "",
    stockQuantity: "",
    stockLocation: "",
    stockDate: "",
    stockSupplier: "",
    stockCost: "",

    // Sale form
    saleProduct: "",
    saleQuantity: "",
    salePrice: "",
    saleCustomer: "",
    saleDate: "",
    saleLocation: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (type: string) => {
    console.log(`Submitting ${type} data:`, formData)
    // Here you would typically send the data to your backend
    alert(`${type} data submitted successfully!`)

    // Reset form
    if (type === "product") {
      setFormData((prev) => ({
        ...prev,
        productName: "",
        productCategory: "",
        productDescription: "",
        productUnit: "",
      }))
    } else if (type === "stock") {
      setFormData((prev) => ({
        ...prev,
        stockProduct: "",
        stockQuantity: "",
        stockLocation: "",
        stockDate: "",
        stockSupplier: "",
        stockCost: "",
      }))
    } else if (type === "sale") {
      setFormData((prev) => ({
        ...prev,
        saleProduct: "",
        saleQuantity: "",
        salePrice: "",
        saleCustomer: "",
        saleDate: "",
        saleLocation: "",
      }))
    }
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="product" className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Product
        </TabsTrigger>
        <TabsTrigger value="stock" className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Stock
        </TabsTrigger>
        <TabsTrigger value="sale" className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Record Sale
        </TabsTrigger>
      </TabsList>

      {/* New Product Form */}
      <TabsContent value="product" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="productName">Product Name</Label>
            <Input
              id="productName"
              placeholder="e.g., Organic Wheat"
              value={formData.productName}
              onChange={(e) => handleInputChange("productName", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="productCategory">Category</Label>
            <Select
              value={formData.productCategory}
              onValueChange={(value) => handleInputChange("productCategory", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grains">Grains</SelectItem>
                <SelectItem value="vegetables">Vegetables</SelectItem>
                <SelectItem value="fruits">Fruits</SelectItem>
                <SelectItem value="livestock">Livestock</SelectItem>
                <SelectItem value="dairy">Dairy</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="productUnit">Unit of Measurement</Label>
            <Select value={formData.productUnit} onValueChange={(value) => handleInputChange("productUnit", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tons">Tons</SelectItem>
                <SelectItem value="kg">Kilograms</SelectItem>
                <SelectItem value="lbs">Pounds</SelectItem>
                <SelectItem value="bushels">Bushels</SelectItem>
                <SelectItem value="pieces">Pieces</SelectItem>
                <SelectItem value="liters">Liters</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="productDescription">Description</Label>
            <Textarea
              id="productDescription"
              placeholder="Product description, quality specifications, etc."
              value={formData.productDescription}
              onChange={(e) => handleInputChange("productDescription", e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => handleSubmit("product")} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Add Product
          </Button>
        </div>
      </TabsContent>

      {/* Add Stock Form */}
      <TabsContent value="stock" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="stockProduct">Product</Label>
            <Select value={formData.stockProduct} onValueChange={(value) => handleInputChange("stockProduct", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wheat">Wheat</SelectItem>
                <SelectItem value="rice">Rice</SelectItem>
                <SelectItem value="corn">Corn</SelectItem>
                <SelectItem value="soybeans">Soybeans</SelectItem>
                <SelectItem value="barley">Barley</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stockQuantity">Quantity</Label>
            <Input
              id="stockQuantity"
              type="number"
              placeholder="e.g., 500"
              value={formData.stockQuantity}
              onChange={(e) => handleInputChange("stockQuantity", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stockLocation">Storage Location</Label>
            <Input
              id="stockLocation"
              placeholder="e.g., Warehouse A, Silo 3"
              value={formData.stockLocation}
              onChange={(e) => handleInputChange("stockLocation", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stockDate">Received Date</Label>
            <Input
              id="stockDate"
              type="date"
              value={formData.stockDate}
              onChange={(e) => handleInputChange("stockDate", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stockSupplier">Supplier</Label>
            <Input
              id="stockSupplier"
              placeholder="e.g., Green Valley Farms"
              value={formData.stockSupplier}
              onChange={(e) => handleInputChange("stockSupplier", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stockCost">Cost per Unit ($)</Label>
            <Input
              id="stockCost"
              type="number"
              step="0.01"
              placeholder="e.g., 45.50"
              value={formData.stockCost}
              onChange={(e) => handleInputChange("stockCost", e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => handleSubmit("stock")} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Add to Stock
          </Button>
        </div>
      </TabsContent>

      {/* Record Sale Form */}
      <TabsContent value="sale" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="saleProduct">Product</Label>
            <Select value={formData.saleProduct} onValueChange={(value) => handleInputChange("saleProduct", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wheat">Wheat</SelectItem>
                <SelectItem value="rice">Rice</SelectItem>
                <SelectItem value="corn">Corn</SelectItem>
                <SelectItem value="soybeans">Soybeans</SelectItem>
                <SelectItem value="barley">Barley</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="saleQuantity">Quantity Sold</Label>
            <Input
              id="saleQuantity"
              type="number"
              placeholder="e.g., 300"
              value={formData.saleQuantity}
              onChange={(e) => handleInputChange("saleQuantity", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="salePrice">Price per Unit ($)</Label>
            <Input
              id="salePrice"
              type="number"
              step="0.01"
              placeholder="e.g., 48.75"
              value={formData.salePrice}
              onChange={(e) => handleInputChange("salePrice", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="saleCustomer">Customer</Label>
            <Input
              id="saleCustomer"
              placeholder="e.g., ABC Food Processing"
              value={formData.saleCustomer}
              onChange={(e) => handleInputChange("saleCustomer", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="saleDate">Sale Date</Label>
            <Input
              id="saleDate"
              type="date"
              value={formData.saleDate}
              onChange={(e) => handleInputChange("saleDate", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="saleLocation">Delivery Location</Label>
            <Input
              id="saleLocation"
              placeholder="e.g., Chicago, IL"
              value={formData.saleLocation}
              onChange={(e) => handleInputChange("saleLocation", e.target.value)}
            />
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Sale Value:</span>
            <Badge variant="secondary" className="text-lg">
              $
              {formData.saleQuantity && formData.salePrice
                ? (Number.parseFloat(formData.saleQuantity) * Number.parseFloat(formData.salePrice)).toLocaleString()
                : "0.00"}
            </Badge>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => handleSubmit("sale")} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Record Sale
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  )
}
