# Funcionalidad de Carga de Imágenes

## Fecha: Abril 2025

Este documento describe la implementación de la funcionalidad de carga de imágenes para productos y categorías en la aplicación Slainte-app-astro.

## Descripción General

La funcionalidad de carga de imágenes permite a los usuarios subir imágenes directamente desde su dispositivo para productos y categorías, en lugar de tener que proporcionar URLs de imágenes externas. Las imágenes se almacenan en Supabase Storage y se vinculan automáticamente a los productos o categorías correspondientes.

## Componentes Implementados

### 1. Servicio de Imágenes (`imageService.ts`)

Este servicio proporciona funciones para interactuar con Supabase Storage:

- `validateImage`: Valida que un archivo sea una imagen válida (tipo y tamaño)
- `uploadProductImage`: Sube una imagen al bucket de productos
- `uploadCategoryImage`: Sube una imagen al bucket de categorías
- `deleteImage`: Elimina una imagen existente
- `getPlaceholderImage`: Proporciona una URL de imagen de placeholder

### 2. Componente de Carga de Imágenes (`ImageUploader.tsx`)

Este componente proporciona una interfaz de usuario para cargar imágenes:

- Soporte para arrastrar y soltar imágenes
- Vista previa de la imagen seleccionada
- Validación de tipo y tamaño de archivo
- Botones para seleccionar y eliminar imágenes

### 3. Formularios Actualizados

Los formularios de productos y categorías han sido actualizados para incluir el componente de carga de imágenes:

- `ProductForm.tsx`: Formulario para crear/editar productos
- `CategoryForm.tsx`: Formulario para crear/editar categorías

### 4. Configuración de Supabase Storage

Se han creado dos buckets en Supabase Storage:

- `product-images`: Para almacenar imágenes de productos
- `category-images`: Para almacenar imágenes de categorías

Cada bucket tiene políticas de seguridad configuradas para permitir:
- Lectura pública de imágenes
- Escritura y eliminación solo para administradores y personal

## Flujo de Trabajo

### Carga de Imágenes para Productos

1. El usuario accede al formulario de creación/edición de producto
2. El usuario puede arrastrar una imagen al área designada o hacer clic para seleccionar un archivo
3. La imagen se muestra en vista previa
4. Al guardar el producto, la imagen se sube automáticamente a Supabase Storage
5. La URL de la imagen se guarda en el campo `image_url` del producto

### Carga de Imágenes para Categorías

1. El usuario accede al formulario de creación/edición de categoría
2. El usuario puede arrastrar una imagen al área designada o hacer clic para seleccionar un archivo
3. La imagen se muestra en vista previa
4. Al guardar la categoría, la imagen se sube automáticamente a Supabase Storage
5. La URL de la imagen se guarda en el campo `image_url` de la categoría

## Consideraciones Técnicas

### Tipos de Archivos Soportados

- JPEG (image/jpeg)
- PNG (image/png)
- WebP (image/webp)
- GIF (image/gif)

### Límites de Tamaño

- Tamaño máximo de archivo: 5MB

### Nombres de Archivo

Los archivos se guardan con nombres únicos generados usando UUID v4 para evitar colisiones.

### Reemplazo de Imágenes

Al actualizar un producto o categoría con una nueva imagen, la imagen anterior se elimina automáticamente para evitar acumulación de archivos no utilizados.

## Ejemplo de Uso

```typescript
// Subir una imagen de producto
const imageFile = event.target.files[0];
try {
  const imageUrl = await uploadProductImage(imageFile);
  console.log('Imagen subida:', imageUrl);
} catch (error) {
  console.error('Error al subir imagen:', error);
}

// Eliminar una imagen
try {
  await deleteImage(imageUrl);
  console.log('Imagen eliminada');
} catch (error) {
  console.error('Error al eliminar imagen:', error);
}
```

## Próximas Mejoras

1. **Redimensionamiento de Imágenes**: Implementar redimensionamiento automático para optimizar el almacenamiento y la carga.
2. **Compresión de Imágenes**: Añadir compresión para reducir el tamaño de los archivos.
3. **Múltiples Imágenes**: Permitir subir múltiples imágenes para un producto.
4. **Edición de Imágenes**: Añadir funcionalidad básica de edición (recorte, rotación).
5. **Carga Asíncrona**: Implementar carga asíncrona para mejorar la experiencia de usuario.

## Conclusión

La implementación de la funcionalidad de carga de imágenes mejora significativamente la experiencia de usuario al permitir subir imágenes directamente desde el dispositivo, en lugar de tener que proporcionar URLs externas. Esto facilita la gestión de productos y categorías, y proporciona una experiencia más integrada y profesional.
