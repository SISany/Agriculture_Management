'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Database, BarChart3, TrendingUp, Cloud } from 'lucide-react';

interface DataFlowStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  data?: any;
  status: 'pending' | 'loading' | 'completed' | 'error';
}

interface Product {
  product_id: string;
  name: string;
  type: string;
  variety: string;
}

interface District {
  district_id: number;
  name: string;
}

export default function DataFlowDemo() {
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  
  const [dataFlowSteps, setDataFlowSteps] = useState<DataFlowStep[]>([
    {
      id: 'raw_data',
      title: 'Raw Data Collection',
      description: 'Fetching production, weather, and price data from database',
      icon: <Database className="h-6 w-6" />,
      status: 'pending'
    },
    {
      id: 'demand_supply',
      title: 'Demand-Supply Analysis',
      description: 'Calculating supply vs demand metrics and surplus/deficit',
      icon: <BarChart3 className="h-6 w-6" />,
      status: 'pending'
    },
    {
      id: 'weather_impact',
      title: 'Weather Impact Analysis',
      description: 'Analyzing weather correlation with production and pricing',
      icon: <Cloud className="h-6 w-6" />,
      status: 'pending'
    },
    {
      id: 'price_trends',
      title: 'Price Trend Analysis',
      description: 'Processing price elasticity and market trends',
      icon: <TrendingUp className="h-6 w-6" />,
      status: 'pending'
    }
  ]);

  useEffect(() => {
    fetchProducts();
    fetchDistricts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
      if (data.length > 0) {
        setSelectedProduct(data[0].product_id);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchDistricts = async () => {
    try {
      const response = await fetch('/api/districts');
      const data = await response.json();
      setDistricts(data);
      if (data.length > 0) {
        setSelectedDistrict(data[0].district_id.toString());
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  const runDataFlowDemo = async () => {
    if (!selectedProduct || !selectedDistrict) {
      alert('Please select a product and district');
      return;
    }

    setIsRunning(true);
    setCurrentStep(0);

    const steps = [...dataFlowSteps];
    
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      
      // Update current step to loading
      steps[i].status = 'loading';
      setDataFlowSteps([...steps]);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      try {
        let data;
        switch (steps[i].id) {
          case 'raw_data':
            data = await fetchRawData();
            break;
          case 'demand_supply':
            data = await fetchDemandSupplyData();
            break;
          case 'weather_impact':
            data = await fetchWeatherImpactData();
            break;
          case 'price_trends':
            data = await fetchPriceTrendsData();
            break;
        }
        
        steps[i].data = data;
        steps[i].status = 'completed';
      } catch (error) {
        steps[i].status = 'error';
        console.error(`Error in step ${steps[i].id}:`, error);
      }
      
      setDataFlowSteps([...steps]);
    }
    
    setIsRunning(false);
  };

  const fetchRawData = async () => {
    const [productData, productionData, priceData, weatherData] = await Promise.all([
      fetch(`/api/products`).then(r => r.json()),
      fetch(`/api/production`).then(r => r.json()),
      fetch(`/api/prices`).then(r => r.json()),
      fetch(`/api/weather`).then(r => r.json())
    ]);

    return {
      products_count: productData.length,
      production_records: productionData.length,
      price_records: priceData.length,
      weather_records: weatherData.length
    };
  };

  const fetchDemandSupplyData = async () => {
    const response = await fetch(`/api/demand-supply?type=overview&product_id=${selectedProduct}&district_id=${selectedDistrict}`);
    const data = await response.json();
    return data;
  };

  const fetchWeatherImpactData = async () => {
    const response = await fetch(`/api/weather-impact?type=correlation&product_id=${selectedProduct}&district_id=${selectedDistrict}`);
    const data = await response.json();
    return data;
  };

  const fetchPriceTrendsData = async () => {
    const response = await fetch(`/api/demand-supply?type=price_trends&product_id=${selectedProduct}&district_id=${selectedDistrict}`);
    const data = await response.json();
    return data;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'loading': return 'bg-blue-500 animate-pulse';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'loading': return 'Processing...';
      case 'error': return 'Error';
      default: return 'Pending';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Agricultural Data Flow Demonstration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Select Product</label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.product_id} value={product.product_id}>
                      {product.name} ({product.variety})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Select District</label>
              <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose district" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((district) => (
                    <SelectItem key={district.district_id} value={district.district_id.toString()}>
                      {district.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                onClick={runDataFlowDemo} 
                disabled={isRunning || !selectedProduct || !selectedDistrict}
                className="w-full"
              >
                {isRunning ? 'Running Analysis...' : 'Start Data Flow Demo'}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {dataFlowSteps.map((step, index) => (
              <div key={step.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className={`w-4 h-4 rounded-full ${getStatusColor(step.status)}`}></div>
                <div className="flex-shrink-0">{step.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
                <Badge variant={step.status === 'completed' ? 'default' : 'secondary'}>
                  {getStatusText(step.status)}
                </Badge>
                {index < dataFlowSteps.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {dataFlowSteps.some(step => step.status === 'completed' && step.data) && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="raw_data">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="raw_data">Raw Data</TabsTrigger>
                <TabsTrigger value="demand_supply">Demand-Supply</TabsTrigger>
                <TabsTrigger value="weather_impact">Weather Impact</TabsTrigger>
                <TabsTrigger value="price_trends">Price Trends</TabsTrigger>
              </TabsList>
              
              {dataFlowSteps.map((step) => (
                <TabsContent key={step.id} value={step.id} className="mt-4">
                  {step.data && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">{step.title} Results</h3>
                      <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                        {JSON.stringify(step.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}