import React, { useState, useRef, useEffect } from 'react';
import { Button } from './button';
import { validateImage } from '@/lib/services/imageService';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  initialImage?: string;
  onImageChange: (file: File | null) => void;
  onImageRemove?: () => void;
  className?: string;
  placeholderText?: string;
}

export default function ImageUploader({
  initialImage,
  onImageChange,
  onImageRemove,
  className = '',
  placeholderText = 'Arrastra una imagen o haz clic para seleccionar'
}: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImage || null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Actualizar preview cuando cambia initialImage
  useEffect(() => {
    if (initialImage) {
      setPreviewUrl(initialImage);
    }
  }, [initialImage]);

  // Manejar selección de archivo
  const handleFileChange = (file: File | null) => {
    setError(null);

    if (!file) {
      setPreviewUrl(null);
      onImageChange(null);
      return;
    }

    // Validar archivo
    const validation = validateImage(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    // Crear URL de preview
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
    onImageChange(file);
  };

  // Manejar clic en botón de selección
  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  // Manejar cambio en input file
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);
  };

  // Manejar drag & drop
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Manejar drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Manejar eliminación de imagen
  const handleRemove = () => {
    setPreviewUrl(null);
    onImageChange(null);
    if (onImageRemove) {
      onImageRemove();
    }
    
    // Limpiar input file
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`relative border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center min-h-[200px] transition-colors ${
          dragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary/50'
        } ${error ? 'border-red-500 bg-red-50' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={!previewUrl ? handleButtonClick : undefined}
        style={{ cursor: !previewUrl ? 'pointer' : 'default' }}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleInputChange}
        />

        {previewUrl ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-[180px] max-w-full object-contain rounded"
            />
            <button
              type="button"
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="flex flex-col items-center justify-center">
              {error ? (
                <div className="text-red-500 mb-2">
                  <X className="h-10 w-10 mb-2 mx-auto" />
                  <p>{error}</p>
                </div>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">{placeholderText}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    PNG, JPG, WEBP o GIF (máx. 5MB)
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center mt-2">
        {!previewUrl ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleButtonClick}
            className="flex items-center"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Seleccionar imagen
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleButtonClick}
            className="flex items-center"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Cambiar imagen
          </Button>
        )}
      </div>
    </div>
  );
}
