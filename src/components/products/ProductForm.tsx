import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Input } from '../ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { Button } from '../ui/button';
import { toast } from 'react-hot-toast';
import ImageUploader from '../ui/ImageUploader';
import { uploadProductImage, getPlaceholderImage } from '@/lib/services/imageService';
import type { Product } from '@/lib/services/productService';
import type { Category } from '@/lib/services/categoryService';

interface ProductFormProps {
  initialData?: Product;
  categories: Category[];
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function ProductForm({
  initialData,
  categories,
  onSubmit,
  onCancel,
  isSubmitting
}: ProductFormProps) {
  // Estado para el archivo de imagen
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Configurar react-hook-form
  const methods = useForm({
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      price: initialData?.price ? initialData.price.toString() : '',
      category_id: initialData?.category_id || '',
      image_url: initialData?.image_url || '',
      is_available: initialData?.is_available ?? true,
      alcohol_percentage: initialData?.alcohol_percentage ? initialData.alcohol_percentage.toString() : ''
    }
  });

  // Opciones para el select de categorías
  const categoryOptions = categories.map(category => ({
    value: category.id,
    label: category.name
  }));

  // Manejar envío del formulario
  const handleFormSubmit = async (data: any) => {
    try {
      setIsUploadingImage(!!imageFile);

      // Subir imagen si hay una nueva
      let imageUrl = data.image_url;
      if (imageFile) {
        try {
          imageUrl = await uploadProductImage(imageFile, initialData?.image_url);
        } catch (error) {
          console.error('Error al subir imagen:', error);
          toast.error('Error al subir la imagen. El producto se guardará sin imagen.');
          imageUrl = '';
        }
      }

      // Convertir valores numéricos
      const formattedData = {
        ...data,
        price: parseFloat(data.price),
        alcohol_percentage: data.alcohol_percentage ? parseFloat(data.alcohol_percentage) : null,
        is_available: Boolean(data.is_available),
        image_url: imageUrl
      };

      await onSubmit(formattedData);
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      toast.error('Ha ocurrido un error al guardar el producto');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Manejar cambio de imagen
  const handleImageChange = (file: File | null) => {
    setImageFile(file);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          label="Nombre"
          name="name"
          required
          placeholder="Nombre del producto"
        />

        <Input
          label="Descripción"
          name="description"
          placeholder="Descripción del producto"
        />

        <Input
          label="Precio"
          name="price"
          type="number"
          step="0.01"
          required
          placeholder="0.00"
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Categoría</label>
          <Select onValueChange={(value) => methods.setValue('category_id', value)} defaultValue={methods.getValues('category_id')}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" {...methods.register('category_id', { required: 'Categoría es requerida' })} />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Imagen del producto</label>
          <ImageUploader
            initialImage={initialData?.image_url || getPlaceholderImage('product')}
            onImageChange={handleImageChange}
            placeholderText="Arrastra una imagen o haz clic para seleccionar"
          />
          <input type="hidden" {...methods.register('image_url')} />
        </div>

        <Input
          label="Porcentaje de alcohol"
          name="alcohol_percentage"
          type="number"
          step="0.1"
          placeholder="0.0"
        />

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="is_available"
            {...methods.register('is_available')}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="is_available" className="text-sm font-medium text-gray-700">
            Disponible
          </label>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting || isUploadingImage ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
