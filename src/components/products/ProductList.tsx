import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { toast } from 'react-hot-toast';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead
} from '../ui/table';
import {
  getProducts,
  deleteProduct,
  updateProductAvailability,
  type Product
} from '@/lib/services/productService';
import { getCategories, type Category } from '@/lib/services/categoryService';
import {
  exportProductsToCSV,
  exportProductsToExcel
} from '@/lib/services/exportService';
import {
  getProductListPreferences,
  saveProductListPreferences,
  type ProductListPreferences
} from '@/lib/services/userPreferencesService';
import ProductModal from './ProductModal';
import ProductFilters from './ProductFilters';
import ProductGrid from './ProductGrid';
import { ViewToggle } from '../ui/view-toggle';
import ExportModal, { type ExportOptions } from '../export/ExportModal';
import { Download, Save } from 'lucide-react';

export default function ProductList() {
  // Estados
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState({
    categoryId: '',
    search: '',
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    onlyAvailable: false
  });
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);

  // Cargar preferencias del usuario
  useEffect(() => {
    const savedPreferences = getProductListPreferences();
    if (savedPreferences) {
      setViewMode(savedPreferences.viewMode);
      setSortBy(savedPreferences.sortBy);
      setSortOrder(savedPreferences.sortOrder);
      setItemsPerPage(savedPreferences.itemsPerPage);
      setFilters(savedPreferences.filters);
      setCurrentPage(1); // Siempre comenzar en la primera página al cargar preferencias
    }
    setPreferencesLoaded(true);
  }, []);

  // Cargar datos iniciales después de cargar preferencias
  useEffect(() => {
    if (preferencesLoaded) {
      loadData();
    }
  }, [currentPage, itemsPerPage, sortBy, sortOrder, filters, preferencesLoaded]);

  // Función para cargar datos
  async function loadData() {
    setIsLoading(true);
    try {
      // Cargar categorías si no están cargadas
      if (categories.length === 0) {
        const { data: categoriesData } = await getCategories();
        setCategories(categoriesData || []);
      }

      // Cargar productos con paginación y filtros
      let query: any = {
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
        sortBy,
        sortOrder,
        categoryId: filters.categoryId || undefined,
        search: filters.search || undefined
      };

      // Añadir filtros avanzados si están definidos
      if (filters.minPrice !== undefined) {
        query.minPrice = filters.minPrice;
      }

      if (filters.maxPrice !== undefined) {
        query.maxPrice = filters.maxPrice;
      }

      if (filters.onlyAvailable) {
        query.onlyAvailable = true;
      }

      const { data, count } = await getProducts(query);

      setProducts(data || []);
      setTotalItems(count || 0);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast.error('Error al cargar los productos');
    } finally {
      setIsLoading(false);
    }
  }

  // Manejar cambio de página
  function handlePageChange(page: number) {
    setCurrentPage(page);
  }

  // Manejar cambio de ordenación
  function handleSort(column: string) {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  }

  // Manejar cambio de filtros
  function handleFilterChange(newFilters: any) {
    setFilters(newFilters);
    setCurrentPage(1); // Resetear a la primera página al filtrar
  }

  // Manejar eliminación de producto
  async function handleDelete(id: string) {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;

    try {
      await deleteProduct(id);
      setProducts(products.filter(product => product.id !== id));
      toast.success('Producto eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      toast.error('Error al eliminar el producto');
    }
  }

  // Manejar edición de producto
  function handleEdit(product: Product) {
    setEditingProduct(product);
    setIsModalOpen(true);
  }

  // Manejar cambio de disponibilidad
  async function handleAvailabilityToggle(id: string, currentStatus: boolean) {
    try {
      await updateProductAvailability(id, !currentStatus);
      setProducts(products.map(product =>
        product.id === id
          ? { ...product, is_available: !currentStatus }
          : product
      ));
      toast.success(`Producto ${!currentStatus ? 'disponible' : 'no disponible'}`);
    } catch (error) {
      console.error('Error al cambiar disponibilidad:', error);
      toast.error('Error al actualizar la disponibilidad');
    }
  }

  // Manejar guardado de producto (crear/actualizar)
  async function handleProductSaved() {
    setIsModalOpen(false);
    setEditingProduct(null);
    await loadData();
    toast.success('Producto guardado correctamente');
  }

  // Obtener nombre de categoría
  function getCategoryName(categoryId: string | null) {
    if (!categoryId) return 'Sin categoría';
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Categoría desconocida';
  }

  // Manejar cambio de vista
  const handleViewChange = (view: 'list' | 'grid') => {
    setViewMode(view);
    saveCurrentPreferences(view);
  };

  // Guardar preferencias actuales
  const saveCurrentPreferences = (currentViewMode: 'list' | 'grid' = viewMode) => {
    const currentPreferences: ProductListPreferences = {
      viewMode: currentViewMode,
      sortBy,
      sortOrder,
      itemsPerPage,
      filters
    };
    saveProductListPreferences(currentPreferences);
    toast.success('Preferencias guardadas');
  };

  // Manejar exportación de productos
  async function handleExport(format: 'csv' | 'excel', options: ExportOptions) {
    try {
      // Obtener todos los productos para exportar
      const { data } = await getProducts({
        sortBy,
        sortOrder,
        categoryId: filters.categoryId || undefined,
        search: filters.search || undefined
      });

      if (!data || data.length === 0) {
        toast.error('No hay productos para exportar');
        return;
      }

      // Filtrar campos según las opciones seleccionadas
      const productsToExport = data.map(product => {
        const filteredProduct: Record<string, any> = {};
        options.fields.forEach(field => {
          if (field === 'category_id' && product.category_id) {
            // Reemplazar ID de categoría por nombre
            filteredProduct[field] = getCategoryName(product.category_id);
          } else {
            filteredProduct[field] = product[field as keyof Product];
          }
        });
        return filteredProduct;
      });

      // Exportar según formato seleccionado
      if (format === 'csv') {
        exportProductsToCSV(productsToExport as any[], options.fileName);
      } else {
        exportProductsToExcel(productsToExport as any[], options.fileName);
      }

      return Promise.resolve();
    } catch (error) {
      console.error('Error al exportar productos:', error);
      toast.error('Error al exportar los productos');
      return Promise.reject(error);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Productos</h2>
        <div className="flex items-center space-x-4">
          <ViewToggle
            view={viewMode}
            onViewChange={handleViewChange}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => saveCurrentPreferences()}
            className="flex items-center gap-2"
            title="Guardar preferencias actuales"
          >
            <Save className="h-4 w-4" />
            Guardar Preferencias
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}>
            Añadir Producto
          </Button>
        </div>
      </div>

      <ProductFilters
        categories={categories}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {viewMode === 'list' ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort('name')}
                    >
                      Nombre {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort('price')}
                    >
                      Precio {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort('category_id')}
                    >
                      Categoría {sortBy === 'category_id' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort('is_available')}
                    >
                      Disponible {sortBy === 'is_available' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No hay productos disponibles
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map(product => (
                      <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell className="max-w-xs truncate">{product.description}</TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>{getCategoryName(product.category_id)}</TableCell>
                        <TableCell>
                          <button
                            onClick={() => handleAvailabilityToggle(product.id, product.is_available)}
                            className={`px-2 py-1 rounded text-xs ${
                              product.is_available
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {product.is_available ? 'Disponible' : 'No disponible'}
                          </button>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(product)}
                            >
                              Editar
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(product.id)}
                            >
                              Eliminar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            <ProductGrid
              products={products}
              categories={categories}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAvailabilityToggle={handleAvailabilityToggle}
              onRefresh={loadData}
            />
          )}

          {/* Paginación */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              Mostrando {Math.min(totalItems, (currentPage - 1) * itemsPerPage + 1)} a {Math.min(totalItems, currentPage * itemsPerPage)} de {totalItems} productos
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Anterior
              </Button>
              {Array.from({ length: Math.ceil(totalItems / itemsPerPage) }, (_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= Math.ceil(totalItems / itemsPerPage)}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Modal para crear/editar producto */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onProductSaved={handleProductSaved}
        categories={categories}
        editingProduct={editingProduct}
      />

      {/* Modal para exportar productos */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        title="Exportar Productos"
        description="Selecciona el formato y los campos que deseas exportar."
        fields={[
          { id: 'name', label: 'Nombre' },
          { id: 'description', label: 'Descripción' },
          { id: 'price', label: 'Precio' },
          { id: 'category_id', label: 'Categoría' },
          { id: 'is_available', label: 'Disponibilidad' },
          { id: 'alcohol_percentage', label: 'Porcentaje de Alcohol' },
          { id: 'created_at', label: 'Fecha de Creación' },
          { id: 'updated_at', label: 'Fecha de Actualización' }
        ]}
      />
    </div>
  );
}
