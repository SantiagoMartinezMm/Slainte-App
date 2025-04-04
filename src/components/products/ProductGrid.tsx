import React from 'react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { toast } from 'react-hot-toast';
import { 
  type Product,
  updateProductAvailability,
  deleteProduct
} from '@/lib/services/productService';
import { type Category } from '@/lib/services/categoryService';

interface ProductGridProps {
  products: Product[];
  categories: Category[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onAvailabilityToggle: (id: string, currentStatus: boolean) => void;
  onRefresh: () => void;
}

export default function ProductGrid({
  products,
  categories,
  onEdit,
  onDelete,
  onAvailabilityToggle,
  onRefresh
}: ProductGridProps) {
  // Función para obtener el nombre de la categoría
  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return 'Sin categoría';
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Categoría desconocida';
  };

  // Función para manejar el cambio de disponibilidad
  const handleAvailabilityToggle = async (id: string, isAvailable: boolean) => {
    try {
      await updateProductAvailability(id, !isAvailable);
      onAvailabilityToggle(id, isAvailable);
    } catch (error) {
      console.error('Error al cambiar disponibilidad:', error);
      toast.error('Error al cambiar la disponibilidad del producto');
    }
  };

  // Función para manejar la eliminación
  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await deleteProduct(id);
        onDelete(id);
        toast.success('Producto eliminado correctamente');
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        toast.error('Error al eliminar el producto');
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.length === 0 ? (
        <div className="col-span-full text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No hay productos disponibles</p>
        </div>
      ) : (
        products.map(product => (
          <Card key={product.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <Badge variant={product.is_available ? "success" : "secondary"}>
                  {product.is_available ? 'Disponible' : 'No disponible'}
                </Badge>
              </div>
              <CardDescription className="text-sm">
                {getCategoryName(product.category_id)}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pb-2">
              {product.image_url && (
                <div className="w-full h-40 mb-4 overflow-hidden rounded-md">
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                {product.alcohol_percentage && (
                  <Badge variant="outline">{product.alcohol_percentage}% Alcohol</Badge>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                {product.description || 'Sin descripción'}
              </p>
            </CardContent>
            
            <CardFooter className="flex justify-between pt-2">
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEdit(product)}
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
              <Button 
                variant={product.is_available ? "secondary" : "default"} 
                size="sm"
                onClick={() => handleAvailabilityToggle(product.id, product.is_available)}
              >
                {product.is_available ? 'Deshabilitar' : 'Habilitar'}
              </Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
}
