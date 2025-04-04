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
  getCategories,
  deleteCategory,
  getProductCountByCategory,
  type Category
} from '@/lib/services/categoryService';
import {
  exportCategoriesToCSV,
  exportCategoriesToExcel
} from '@/lib/services/exportService';
import {
  getCategoryListPreferences,
  saveCategoryListPreferences,
  type CategoryListPreferences
} from '@/lib/services/userPreferencesService';
import CategoryModal from './CategoryModal';
import ExportModal, { type ExportOptions } from '../export/ExportModal';
import { Download, Save } from 'lucide-react';

export default function CategoryList() {
  // Estados
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState('');
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);

  // Cargar preferencias del usuario
  useEffect(() => {
    const savedPreferences = getCategoryListPreferences();
    if (savedPreferences) {
      setSortBy(savedPreferences.sortBy);
      setSortOrder(savedPreferences.sortOrder);
      setItemsPerPage(savedPreferences.itemsPerPage);
      if (savedPreferences.search) {
        setSearch(savedPreferences.search);
      }
      setCurrentPage(1); // Siempre comenzar en la primera página al cargar preferencias
    }
    setPreferencesLoaded(true);
  }, []);

  // Cargar datos iniciales después de cargar preferencias
  useEffect(() => {
    if (preferencesLoaded) {
      loadData();
    }
  }, [currentPage, itemsPerPage, sortBy, sortOrder, search, preferencesLoaded]);

  // Función para cargar datos
  async function loadData() {
    setIsLoading(true);
    try {
      // Cargar categorías con paginación y filtros
      const { data, count } = await getCategories({
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
        sortBy,
        sortOrder,
        search: search || undefined
      });

      setCategories(data || []);
      setTotalItems(count || 0);

      // Cargar conteo de productos para cada categoría
      const counts: Record<string, number> = {};
      for (const category of data || []) {
        counts[category.id] = await getProductCountByCategory(category.id);
      }
      setProductCounts(counts);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast.error('Error al cargar las categorías');
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

  // Manejar cambio de búsqueda
  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    setCurrentPage(1); // Resetear a la primera página al buscar
  }

  // Manejar eliminación de categoría
  async function handleDelete(id: string) {
    // Verificar si hay productos asociados
    if (productCounts[id] > 0) {
      toast.error(`No se puede eliminar la categoría porque tiene ${productCounts[id]} productos asociados`);
      return;
    }

    if (!confirm('¿Estás seguro de que deseas eliminar esta categoría?')) return;

    try {
      await deleteCategory(id);
      setCategories(categories.filter(category => category.id !== id));
      toast.success('Categoría eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      toast.error('Error al eliminar la categoría');
    }
  }

  // Manejar edición de categoría
  function handleEdit(category: Category) {
    setEditingCategory(category);
    setIsModalOpen(true);
  }

  // Manejar guardado de categoría (crear/actualizar)
  async function handleCategorySaved() {
    setIsModalOpen(false);
    setEditingCategory(null);
    await loadData();
    toast.success('Categoría guardada correctamente');
  }

  // Guardar preferencias actuales
  const saveCurrentPreferences = () => {
    const currentPreferences: CategoryListPreferences = {
      sortBy,
      sortOrder,
      itemsPerPage,
      search
    };
    saveCategoryListPreferences(currentPreferences);
    toast.success('Preferencias guardadas');
  };

  // Manejar exportación de categorías
  async function handleExport(format: 'csv' | 'excel', options: ExportOptions) {
    try {
      // Obtener todas las categorías para exportar
      const { data } = await getCategories({
        sortBy,
        sortOrder,
        search: search || undefined
      });

      if (!data || data.length === 0) {
        toast.error('No hay categorías para exportar');
        return;
      }

      // Filtrar campos según las opciones seleccionadas
      const categoriesToExport = data.map(category => {
        const filteredCategory: Record<string, any> = {};
        options.fields.forEach(field => {
          filteredCategory[field] = category[field as keyof Category];
        });
        return filteredCategory;
      });

      // Exportar según formato seleccionado
      if (format === 'csv') {
        exportCategoriesToCSV(categoriesToExport as any[], options.fileName);
      } else {
        exportCategoriesToExcel(categoriesToExport as any[], options.fileName);
      }

      return Promise.resolve();
    } catch (error) {
      console.error('Error al exportar categorías:', error);
      toast.error('Error al exportar las categorías');
      return Promise.reject(error);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Categorías</h2>
        <div className="flex items-center space-x-4">
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
            setEditingCategory(null);
            setIsModalOpen(true);
          }}>
            Añadir Categoría
          </Button>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <div className="flex items-center">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Buscar categorías..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
          <Button
            variant="outline"
            className="ml-2"
            onClick={() => setSearch('')}
          >
            Limpiar
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
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
                  <TableHead>Productos</TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort('created_at')}
                  >
                    Creado {sortBy === 'created_at' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No hay categorías disponibles
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map(category => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell className="max-w-xs truncate">{category.description}</TableCell>
                      <TableCell>{productCounts[category.id] || 0}</TableCell>
                      <TableCell>{new Date(category.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(category)}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(category.id)}
                            disabled={productCounts[category.id] > 0}
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

          {/* Paginación */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              Mostrando {Math.min(totalItems, (currentPage - 1) * itemsPerPage + 1)} a {Math.min(totalItems, currentPage * itemsPerPage)} de {totalItems} categorías
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

      {/* Modal para crear/editar categoría */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        onCategorySaved={handleCategorySaved}
        editingCategory={editingCategory}
      />

      {/* Modal para exportar categorías */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        title="Exportar Categorías"
        description="Selecciona el formato y los campos que deseas exportar."
        fields={[
          { id: 'name', label: 'Nombre' },
          { id: 'description', label: 'Descripción' },
          { id: 'created_at', label: 'Fecha de Creación' },
          { id: 'updated_at', label: 'Fecha de Actualización' }
        ]}
      />
    </div>
  );
}
