import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Pie, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
} from 'chart.js';
import { getProducts, type Product } from '@/lib/services/productService';
import { getCategories, type Category } from '@/lib/services/categoryService';
import { toast } from 'react-hot-toast';

// Registrar componentes de ChartJS
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);

export default function ProductStats() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        // Cargar productos
        const { data: productsData } = await getProducts();
        setProducts(productsData || []);

        // Cargar categorías
        const { data: categoriesData } = await getCategories();
        setCategories(categoriesData || []);
      } catch (error) {
        console.error('Error al cargar datos para estadísticas:', error);
        toast.error('Error al cargar datos para estadísticas');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Preparar datos para gráfico de categorías
  const categoryData = {
    labels: categories.map(cat => cat.name),
    datasets: [
      {
        label: 'Productos por categoría',
        data: categories.map(cat => 
          products.filter(p => p.category_id === cat.id).length
        ),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Preparar datos para gráfico de disponibilidad
  const availabilityData = {
    labels: ['Disponibles', 'No disponibles'],
    datasets: [
      {
        label: 'Disponibilidad de productos',
        data: [
          products.filter(p => p.is_available).length,
          products.filter(p => !p.is_available).length
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Preparar datos para gráfico de precios
  const priceRanges = [
    { label: '0-5€', min: 0, max: 5 },
    { label: '5-10€', min: 5, max: 10 },
    { label: '10-15€', min: 10, max: 15 },
    { label: '15-20€', min: 15, max: 20 },
    { label: '20-30€', min: 20, max: 30 },
    { label: '30+€', min: 30, max: Infinity }
  ];

  const priceData = {
    labels: priceRanges.map(range => range.label),
    datasets: [
      {
        label: 'Productos por rango de precio',
        data: priceRanges.map(range => 
          products.filter(p => p.price >= range.min && p.price < range.max).length
        ),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Opciones para gráficos
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: 'Distribución',
      },
    },
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Distribución por precio',
      },
    },
  };

  // Calcular estadísticas generales
  const totalProducts = products.length;
  const availableProducts = products.filter(p => p.is_available).length;
  const averagePrice = totalProducts > 0 
    ? products.reduce((sum, p) => sum + p.price, 0) / totalProducts 
    : 0;
  const highestPrice = totalProducts > 0 
    ? Math.max(...products.map(p => p.price)) 
    : 0;
  const lowestPrice = totalProducts > 0 
    ? Math.min(...products.map(p => p.price)) 
    : 0;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Estadísticas de Productos</h2>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Tarjetas de resumen */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total de Productos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{totalProducts}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Productos Disponibles</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{availableProducts}</p>
                <p className="text-sm text-gray-500">
                  {totalProducts > 0 ? Math.round((availableProducts / totalProducts) * 100) : 0}% del total
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Precio Promedio</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">${averagePrice.toFixed(2)}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Rango de Precios</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold">${lowestPrice.toFixed(2)} - ${highestPrice.toFixed(2)}</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Gráficos */}
          <Tabs defaultValue="categories">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="categories">Por Categoría</TabsTrigger>
              <TabsTrigger value="availability">Disponibilidad</TabsTrigger>
              <TabsTrigger value="prices">Por Precio</TabsTrigger>
            </TabsList>
            
            <TabsContent value="categories" className="p-4 bg-white rounded-md shadow">
              <div className="h-80">
                <Pie data={categoryData} options={pieOptions} />
              </div>
            </TabsContent>
            
            <TabsContent value="availability" className="p-4 bg-white rounded-md shadow">
              <div className="h-80">
                <Pie data={availabilityData} options={pieOptions} />
              </div>
            </TabsContent>
            
            <TabsContent value="prices" className="p-4 bg-white rounded-md shadow">
              <div className="h-80">
                <Bar data={priceData} options={barOptions} />
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
