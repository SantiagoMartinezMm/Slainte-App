import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { getProducts, type Product } from '@/lib/services/productService';
import { getCategories, getProductCountByCategory, type Category } from '@/lib/services/categoryService';
import { toast } from 'react-hot-toast';

// Registrar componentes de ChartJS
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export default function CategoryStats() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});
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

        // Cargar conteo de productos por categoría
        if (categoriesData && categoriesData.length > 0) {
          const counts: Record<string, number> = {};
          for (const category of categoriesData) {
            const count = await getProductCountByCategory(category.id);
            counts[category.id] = count;
          }
          setProductCounts(counts);
        }
      } catch (error) {
        console.error('Error al cargar datos para estadísticas:', error);
        toast.error('Error al cargar datos para estadísticas');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Preparar datos para gráfico de distribución de productos
  const productDistributionData = {
    labels: categories.map(cat => cat.name),
    datasets: [
      {
        label: 'Productos por categoría',
        data: categories.map(cat => productCounts[cat.id] || 0),
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

  // Preparar datos para gráfico de precio promedio por categoría
  const averagePriceData = {
    labels: categories.map(cat => cat.name),
    datasets: [
      {
        label: 'Precio promedio',
        data: categories.map(cat => {
          const categoryProducts = products.filter(p => p.category_id === cat.id);
          if (categoryProducts.length === 0) return 0;
          return categoryProducts.reduce((sum, p) => sum + p.price, 0) / categoryProducts.length;
        }),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Opciones para gráficos
  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: 'Distribución de productos por categoría',
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
        text: 'Precio promedio por categoría',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Calcular estadísticas generales
  const totalCategories = categories.length;
  const categoriesWithProducts = Object.values(productCounts).filter(count => count > 0).length;
  const mostPopularCategory = categories.length > 0 
    ? categories.reduce((prev, current) => 
        (productCounts[prev.id] || 0) > (productCounts[current.id] || 0) ? prev : current
      ) 
    : null;
  const emptyCategories = totalCategories - categoriesWithProducts;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Estadísticas de Categorías</h2>
      
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
                <CardTitle className="text-lg">Total de Categorías</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{totalCategories}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Categorías con Productos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{categoriesWithProducts}</p>
                <p className="text-sm text-gray-500">
                  {totalCategories > 0 ? Math.round((categoriesWithProducts / totalCategories) * 100) : 0}% del total
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Categoría más Popular</CardTitle>
              </CardHeader>
              <CardContent>
                {mostPopularCategory ? (
                  <>
                    <p className="text-xl font-bold">{mostPopularCategory.name}</p>
                    <p className="text-sm text-gray-500">
                      {productCounts[mostPopularCategory.id] || 0} productos
                    </p>
                  </>
                ) : (
                  <p className="text-gray-500">No hay datos</p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Categorías Vacías</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{emptyCategories}</p>
                <p className="text-sm text-gray-500">
                  {totalCategories > 0 ? Math.round((emptyCategories / totalCategories) * 100) : 0}% del total
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-4 bg-white rounded-md shadow">
              <h3 className="text-lg font-semibold mb-4">Distribución de Productos</h3>
              <div className="h-80">
                <Doughnut data={productDistributionData} options={doughnutOptions} />
              </div>
            </div>
            
            <div className="p-4 bg-white rounded-md shadow">
              <h3 className="text-lg font-semibold mb-4">Precio Promedio por Categoría</h3>
              <div className="h-80">
                <Bar data={averagePriceData} options={barOptions} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
