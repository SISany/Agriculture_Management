"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {Save, Factory, DollarSign, TrendingUp, Package, Warehouse, Truck} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"

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

      // Production form
      prodProduct: "",
      prodDistrict: "",
      prodDate: "",
      prodAcreage: "",
      prodQuantity: "",
      prodWeatherId: "",

      // Price form
      priceProduct: "",
      priceLocation: "",
      priceDate: "",
      priceWholesale: "",
      priceRetail: "",
      priceHarvest: "",
      priceSeason: "",

      // Demand Forecast form
      demandProduct: "",
      demandLocation: "",
      demandDate: "",
      demandProjected: "",
      demandSupply: "",
      demandPeriod: "",
      demandElasticity: "",
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

      // Reset form based on type
      const fieldsToReset = getFieldsToReset(type)
      setFormData((prev) => {
          const newData = {...prev}
          fieldsToReset.forEach(field => {
              newData[field as keyof typeof prev] = ""
          })
          return newData
      })
  }

    const getFieldsToReset = (type: string) => {
        switch (type) {
            case "product":
                return ["productName", "productCategory", "productDescription", "productUnit"]
            case "stock":
                return ["stockProduct", "stockQuantity", "stockLocation", "stockDate", "stockSupplier", "stockCost"]
            case "sale":
                return ["saleProduct", "saleQuantity", "salePrice", "saleCustomer", "saleDate", "saleLocation"]
            case "production":
                return ["prodProduct", "prodDistrict", "prodDate", "prodAcreage", "prodQuantity", "prodWeatherId"]
            case "price":
                return ["priceProduct", "priceLocation", "priceDate", "priceWholesale", "priceRetail", "priceHarvest", "priceSeason"]
            case "demand":
                return ["demandProduct", "demandLocation", "demandDate", "demandProjected", "demandSupply", "demandPeriod", "demandElasticity"]
            default:
                return []
    }
  }

  return (
      <div className="space-y-6">
          {/* Header */}
          <div>
              <h1 className="text-2xl font-bold text-gray-900">Agriculture Data Entry Portal</h1>
              <p className="mt-2 text-gray-600">Centralized data entry for all agriculture management needs</p>
          </div>

        {/* Enhanced Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="product" className="flex items-center gap-2">
                    <Package className="w-4 h-4"/>
                    Product
                </TabsTrigger>
                <TabsTrigger value="stock" className="flex items-center gap-2">
                    <Warehouse className="w-4 h-4"/>
                    Stock
                </TabsTrigger>
                <TabsTrigger value="sale" className="flex items-center gap-2">
                    <Truck className="w-4 h-4"/>
                    Sale
                </TabsTrigger>
                <TabsTrigger value="production" className="flex items-center gap-2">
                    <Factory className="w-4 h-4"/>
                    Production
                </TabsTrigger>
                <TabsTrigger value="price" className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4"/>
                    Price
                </TabsTrigger>
                <TabsTrigger value="demand" className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4"/>
                    Forecast
                </TabsTrigger>
            </TabsList>

          {/* New Product Form */}
          <TabsContent value="product" className="space-y-4">
              <Card>
                  <CardHeader>
                      <CardTitle>Add New Product</CardTitle>
                      <CardDescription>Register a new agricultural product in the system</CardDescription>
                  </CardHeader>
                  <CardContent>
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
                              <SelectValue placeholder="Select category"/>
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
                      <Select value={formData.productUnit}
                              onValueChange={(value) => handleInputChange("productUnit", value)}>
                          <SelectTrigger>
                              <SelectValue placeholder="Select unit"/>
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

                <div className="flex justify-end mt-6">
                    <Button onClick={() => handleSubmit("product")} className="flex items-center gap-2">
                        <Save className="w-4 h-4"/>
                        Add Product
                    </Button>
                </div>
            </CardContent>
          </Card>
        </TabsContent>

          {/* Add Stock Form */}
          <TabsContent value="stock" className="space-y-4">
              <Card>
                  <CardHeader>
                      <CardTitle>Add Stock Entry</CardTitle>
                      <CardDescription>Record new inventory or stock additions</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                              <Label htmlFor="stockProduct">Product</Label>
                              <Select value={formData.stockProduct}
                                      onValueChange={(value) => handleInputChange("stockProduct", value)}>
                                  <SelectTrigger>
                                      <SelectValue placeholder="Select product"/>
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

                <div className="flex justify-end mt-6">
                    <Button onClick={() => handleSubmit("stock")} className="flex items-center gap-2">
                        <Save className="w-4 h-4"/>
                        Add to Stock
                    </Button>
                </div>
            </CardContent>
          </Card>
        </TabsContent>

          {/* Record Sale Form */}
          <TabsContent value="sale" className="space-y-4">
              <Card>
                  <CardHeader>
                      <CardTitle>Record Sale Transaction</CardTitle>
                      <CardDescription>Log completed sales and transactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                              <Label htmlFor="saleProduct">Product</Label>
                              <Select value={formData.saleProduct}
                                      onValueChange={(value) => handleInputChange("saleProduct", value)}>
                                  <SelectTrigger>
                                      <SelectValue placeholder="Select product"/>
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

                <div className="bg-gray-50 p-4 rounded-lg mt-4">
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

                <div className="flex justify-end mt-6">
                    <Button onClick={() => handleSubmit("sale")} className="flex items-center gap-2">
                        <Save className="w-4 h-4"/>
                        Record Sale
                    </Button>
                </div>
            </CardContent>
          </Card>
        </TabsContent>

          {/* Production Data Form */}
          <TabsContent value="production" className="space-y-4">
              <Card>
                  <CardHeader>
                      <CardTitle>Add Production Record</CardTitle>
                      <CardDescription>Record agricultural production data by region</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                              <Label htmlFor="prodProduct">Product</Label>
                              <Select value={formData.prodProduct}
                                      onValueChange={(value) => handleInputChange("prodProduct", value)}>
                                  <SelectTrigger>
                                      <SelectValue placeholder="Select product"/>
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
                              <Label htmlFor="prodDistrict">District/Division</Label>
                              <Select value={formData.prodDistrict}
                                      onValueChange={(value) => handleInputChange("prodDistrict", value)}>
                                  <SelectTrigger>
                                      <SelectValue placeholder="Select district"/>
                                  </SelectTrigger>
                                  <SelectContent>
                                      <SelectItem value="dhaka">Dhaka</SelectItem>
                                      <SelectItem value="chittagong">Chittagong</SelectItem>
                                      <SelectItem value="sylhet">Sylhet</SelectItem>
                                      <SelectItem value="rajshahi">Rajshahi</SelectItem>
                                      <SelectItem value="barisal">Barisal</SelectItem>
                                      <SelectItem value="khulna">Khulna</SelectItem>
                                  </SelectContent>
                              </Select>
                          </div>

                          <div className="space-y-2">
                              <Label htmlFor="prodDate">Production Date</Label>
                              <Input
                                  id="prodDate"
                                  type="date"
                                  value={formData.prodDate}
                                  onChange={(e) => handleInputChange("prodDate", e.target.value)}
                              />
                          </div>

                          <div className="space-y-2">
                              <Label htmlFor="prodAcreage">Acreage (acres)</Label>
                              <Input
                                  id="prodAcreage"
                                  type="number"
                                  placeholder="e.g., 1200"
                                  value={formData.prodAcreage}
                                  onChange={(e) => handleInputChange("prodAcreage", e.target.value)}
                              />
                          </div>

                          <div className="space-y-2">
                              <Label htmlFor="prodQuantity">Quantity Produced (tons)</Label>
                              <Input
                                  id="prodQuantity"
                                  type="number"
                                  placeholder="e.g., 5000"
                                  value={formData.prodQuantity}
                                  onChange={(e) => handleInputChange("prodQuantity", e.target.value)}
                              />
                          </div>

                          <div className="space-y-2">
                              <Label htmlFor="prodWeatherId">Weather ID</Label>
                              <Input
                                  id="prodWeatherId"
                                  placeholder="e.g., W001"
                                  value={formData.prodWeatherId}
                                  onChange={(e) => handleInputChange("prodWeatherId", e.target.value)}
                              />
                          </div>
                      </div>

                      {formData.prodQuantity && formData.prodAcreage && (
                          <div className="bg-green-50 p-4 rounded-lg mt-4">
                              <div className="flex justify-between items-center">
                                  <span className="text-sm text-green-700">Yield per Acre:</span>
                                  <Badge variant="outline" className="text-green-800">
                                      {(Number.parseFloat(formData.prodQuantity) / Number.parseFloat(formData.prodAcreage)).toFixed(2)} tons/acre
                                  </Badge>
                              </div>
                          </div>
                      )}

                      <div className="flex justify-end mt-6">
                          <Button onClick={() => handleSubmit("production")} className="flex items-center gap-2">
                              <Save className="w-4 h-4"/>
                              Add Production Record
                          </Button>
                      </div>
                  </CardContent>
              </Card>
          </TabsContent>

          {/* Price History Form */}
          <TabsContent value="price" className="space-y-4">
              <Card>
                  <CardHeader>
                      <CardTitle>Add Price Record</CardTitle>
                      <CardDescription>Record current market pricing information</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                              <Label htmlFor="priceProduct">Product</Label>
                              <Select value={formData.priceProduct}
                                      onValueChange={(value) => handleInputChange("priceProduct", value)}>
                                  <SelectTrigger>
                                      <SelectValue placeholder="Select product"/>
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
                              <Label htmlFor="priceLocation">Location</Label>
                              <Select value={formData.priceLocation}
                                      onValueChange={(value) => handleInputChange("priceLocation", value)}>
                                  <SelectTrigger>
                                      <SelectValue placeholder="Select location"/>
                                  </SelectTrigger>
                                  <SelectContent>
                                      <SelectItem value="dhaka">Dhaka</SelectItem>
                                      <SelectItem value="chittagong">Chittagong</SelectItem>
                                      <SelectItem value="sylhet">Sylhet</SelectItem>
                                      <SelectItem value="rajshahi">Rajshahi</SelectItem>
                                      <SelectItem value="barisal">Barisal</SelectItem>
                                      <SelectItem value="khulna">Khulna</SelectItem>
                                  </SelectContent>
                              </Select>
                          </div>

                          <div className="space-y-2">
                              <Label htmlFor="priceDate">Date Recorded</Label>
                              <Input
                                  id="priceDate"
                                  type="date"
                                  value={formData.priceDate}
                                  onChange={(e) => handleInputChange("priceDate", e.target.value)}
                              />
                          </div>

                          <div className="space-y-2">
                              <Label htmlFor="priceSeason">Season</Label>
                              <Select value={formData.priceSeason}
                                      onValueChange={(value) => handleInputChange("priceSeason", value)}>
                                  <SelectTrigger>
                                      <SelectValue placeholder="Select season"/>
                                  </SelectTrigger>
                                  <SelectContent>
                                      <SelectItem value="spring">Spring</SelectItem>
                                      <SelectItem value="summer">Summer</SelectItem>
                                      <SelectItem value="monsoon">Monsoon</SelectItem>
                                      <SelectItem value="autumn">Autumn</SelectItem>
                                      <SelectItem value="winter">Winter</SelectItem>
                                  </SelectContent>
                              </Select>
                          </div>

                          <div className="space-y-2">
                              <Label htmlFor="priceWholesale">Wholesale Price ($)</Label>
                              <Input
                                  id="priceWholesale"
                                  type="number"
                                  step="0.01"
                                  placeholder="e.g., 40.00"
                                  value={formData.priceWholesale}
                                  onChange={(e) => handleInputChange("priceWholesale", e.target.value)}
                              />
                          </div>

                          <div className="space-y-2">
                              <Label htmlFor="priceRetail">Retail Price ($)</Label>
                              <Input
                                  id="priceRetail"
                                  type="number"
                                  step="0.01"
                                  placeholder="e.g., 45.00"
                                  value={formData.priceRetail}
                                  onChange={(e) => handleInputChange("priceRetail", e.target.value)}
                              />
                          </div>

                          <div className="space-y-2 md:col-span-2">
                              <Label htmlFor="priceHarvest">Harvest Season Price ($)</Label>
                              <Input
                                  id="priceHarvest"
                                  type="number"
                                  step="0.01"
                                  placeholder="e.g., 38.00"
                                  value={formData.priceHarvest}
                                  onChange={(e) => handleInputChange("priceHarvest", e.target.value)}
                              />
                          </div>
                      </div>

                      {formData.priceRetail && formData.priceWholesale && (
                          <div className="bg-blue-50 p-4 rounded-lg mt-4">
                              <div className="flex justify-between items-center">
                                  <span className="text-sm text-blue-700">Retail Margin:</span>
                                  <Badge variant="outline" className="text-blue-800">
                                      {(((Number.parseFloat(formData.priceRetail) - Number.parseFloat(formData.priceWholesale)) / Number.parseFloat(formData.priceWholesale)) * 100).toFixed(1)}%
                                  </Badge>
                              </div>
                          </div>
                      )}

                      <div className="flex justify-end mt-6">
                          <Button onClick={() => handleSubmit("price")} className="flex items-center gap-2">
                              <Save className="w-4 h-4"/>
                              Add Price Record
                          </Button>
                      </div>
                  </CardContent>
              </Card>
          </TabsContent>

          {/* Demand Forecast Form */}
          <TabsContent value="demand" className="space-y-4">
              <Card>
                  <CardHeader>
                      <CardTitle>Add Demand Forecast</CardTitle>
                      <CardDescription>Create demand projections and forecasts</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                              <Label htmlFor="demandProduct">Product</Label>
                              <Select value={formData.demandProduct}
                                      onValueChange={(value) => handleInputChange("demandProduct", value)}>
                                  <SelectTrigger>
                                      <SelectValue placeholder="Select product"/>
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
                              <Label htmlFor="demandLocation">Location</Label>
                              <Select value={formData.demandLocation}
                                      onValueChange={(value) => handleInputChange("demandLocation", value)}>
                                  <SelectTrigger>
                                      <SelectValue placeholder="Select location"/>
                                  </SelectTrigger>
                                  <SelectContent>
                                      <SelectItem value="dhaka">Dhaka</SelectItem>
                                      <SelectItem value="chittagong">Chittagong</SelectItem>
                                      <SelectItem value="sylhet">Sylhet</SelectItem>
                                      <SelectItem value="rajshahi">Rajshahi</SelectItem>
                                      <SelectItem value="barisal">Barisal</SelectItem>
                                      <SelectItem value="khulna">Khulna</SelectItem>
                                  </SelectContent>
                              </Select>
                          </div>

                          <div className="space-y-2">
                              <Label htmlFor="demandDate">Forecast Date</Label>
                              <Input
                                  id="demandDate"
                                  type="date"
                                  value={formData.demandDate}
                                  onChange={(e) => handleInputChange("demandDate", e.target.value)}
                              />
                          </div>

                          <div className="space-y-2">
                              <Label htmlFor="demandPeriod">Forecast Period</Label>
                              <Select value={formData.demandPeriod}
                                      onValueChange={(value) => handleInputChange("demandPeriod", value)}>
                                  <SelectTrigger>
                                      <SelectValue placeholder="Select period"/>
                                  </SelectTrigger>
                                  <SelectContent>
                                      <SelectItem value="1_month">1 Month</SelectItem>
                                      <SelectItem value="3_months">3 Months</SelectItem>
                                      <SelectItem value="6_months">6 Months</SelectItem>
                                      <SelectItem value="1_year">1 Year</SelectItem>
                                  </SelectContent>
                              </Select>
                          </div>

                          <div className="space-y-2">
                              <Label htmlFor="demandProjected">Projected Demand (tons)</Label>
                              <Input
                                  id="demandProjected"
                                  type="number"
                                  placeholder="e.g., 15000"
                                  value={formData.demandProjected}
                                  onChange={(e) => handleInputChange("demandProjected", e.target.value)}
                              />
                          </div>

                          <div className="space-y-2">
                              <Label htmlFor="demandSupply">Current Supply (tons)</Label>
                              <Input
                                  id="demandSupply"
                                  type="number"
                                  placeholder="e.g., 12000"
                                  value={formData.demandSupply}
                                  onChange={(e) => handleInputChange("demandSupply", e.target.value)}
                              />
                          </div>

                          <div className="space-y-2 md:col-span-2">
                              <Label htmlFor="demandElasticity">Price Elasticity</Label>
                              <Input
                                  id="demandElasticity"
                                  type="number"
                                  step="0.1"
                                  placeholder="e.g., 1.2"
                                  value={formData.demandElasticity}
                                  onChange={(e) => handleInputChange("demandElasticity", e.target.value)}
                              />
                          </div>
                      </div>

                      {formData.demandProjected && formData.demandSupply && (
                          <div className="bg-purple-50 p-4 rounded-lg mt-4">
                              <div className="flex justify-between items-center">
                                  <span className="text-sm text-purple-700">Supply-Demand Gap:</span>
                                  <Badge
                                      variant={Number.parseFloat(formData.demandSupply) >= Number.parseFloat(formData.demandProjected) ? "default" : "destructive"}>
                                      {(Number.parseFloat(formData.demandSupply) - Number.parseFloat(formData.demandProjected)).toLocaleString()} tons
                                  </Badge>
                              </div>
                          </div>
                      )}

                      <div className="flex justify-end mt-6">
                          <Button onClick={() => handleSubmit("demand")} className="flex items-center gap-2">
                              <Save className="w-4 h-4"/>
                              Add Forecast
                          </Button>
                      </div>
                  </CardContent>
              </Card>
          </TabsContent>
      </Tabs>
    </div>
  )
}
