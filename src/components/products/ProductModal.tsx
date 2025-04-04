import React, { useState } from 'react';
import { createProduct, updateProduct, type Product } from '@/lib/services/productService';
import type { Category } from '@/lib/services/categoryService';
import ProductForm from './ProductForm';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductSaved: () => void;
  categories: Category[];
  editingProduct: Product | null;
}

export default function ProductModal({
  isOpen,
  onClose,
  onProductSaved,
  categories,
  editingProduct
}: ProductModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Manejar envío del formulario
  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        // Actualizar producto existente
        await updateProduct(editingProduct.id, formData);
      } else {
        // Crear nuevo producto
        await createProduct(formData);
      }
      onProductSaved();
    } catch (error) {
      console.error('Error al guardar producto:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {editingProduct ? 'Editar Producto' : 'Añadir Producto'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isSubmitting}
          >
            &times;
          </button>
        </div>
        
        <ProductForm
          initialData={editingProduct || undefined}
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
