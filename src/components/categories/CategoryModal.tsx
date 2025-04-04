import React, { useState } from 'react';
import { createCategory, updateCategory, type Category } from '@/lib/services/categoryService';
import CategoryForm from './CategoryForm';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategorySaved: () => void;
  editingCategory: Category | null;
}

export default function CategoryModal({
  isOpen,
  onClose,
  onCategorySaved,
  editingCategory
}: CategoryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Manejar envío del formulario
  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      if (editingCategory) {
        // Actualizar categoría existente
        await updateCategory(editingCategory.id, formData);
      } else {
        // Crear nueva categoría
        await createCategory(formData);
      }
      onCategorySaved();
    } catch (error) {
      console.error('Error al guardar categoría:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {editingCategory ? 'Editar Categoría' : 'Añadir Categoría'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isSubmitting}
          >
            &times;
          </button>
        </div>
        
        <CategoryForm
          initialData={editingCategory || undefined}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
