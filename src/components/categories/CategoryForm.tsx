import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { toast } from 'react-hot-toast';
import ImageUploader from '../ui/ImageUploader';
import { uploadCategoryImage, getPlaceholderImage } from '@/lib/services/imageService';
import type { Category } from '@/lib/services/categoryService';

interface CategoryFormProps {
  initialData?: Category;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function CategoryForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting
}: CategoryFormProps) {
  // Estado para el archivo de imagen
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Configurar react-hook-form
  const methods = useForm({
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      image_url: initialData?.image_url || ''
    }
  });

  // Manejar cambio de imagen
  const handleImageChange = (file: File | null) => {
    setImageFile(file);
  };

  // Manejar envío del formulario
  const handleFormSubmit = async (data: any) => {
    try {
      setIsUploadingImage(!!imageFile);

      // Subir imagen si hay una nueva
      let imageUrl = data.image_url;
      if (imageFile) {
        try {
          imageUrl = await uploadCategoryImage(imageFile, initialData?.image_url);
        } catch (error) {
          console.error('Error al subir imagen:', error);
          toast.error('Error al subir la imagen. La categoría se guardará sin imagen.');
          imageUrl = '';
        }
      }

      // Preparar datos para enviar
      const formattedData = {
        ...data,
        image_url: imageUrl
      };

      await onSubmit(formattedData);
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      toast.error('Ha ocurrido un error al guardar la categoría');
    } finally {
      setIsUploadingImage(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          label="Nombre"
          name="name"
          required
          placeholder="Nombre de la categoría"
        />

        <Input
          label="Descripción"
          name="description"
          placeholder="Descripción de la categoría"
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Imagen de la categoría</label>
          <ImageUploader
            initialImage={initialData?.image_url || getPlaceholderImage('category')}
            onImageChange={handleImageChange}
            placeholderText="Arrastra una imagen o haz clic para seleccionar"
          />
          <input type="hidden" {...methods.register('image_url')} />
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
