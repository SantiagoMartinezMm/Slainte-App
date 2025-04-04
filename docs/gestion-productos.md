# Gestión de Productos y Categorías

Este documento describe los componentes y funcionalidades implementados para la gestión de productos y categorías en la aplicación Slainte-app-astro.

## Estructura de Componentes

### Servicios

- **productService.ts**: Proporciona funciones para interactuar con la tabla de productos en Supabase.
- **categoryService.ts**: Proporciona funciones para interactuar con la tabla de categorías en Supabase.

### Componentes de Productos

- **ProductList.tsx**: Componente principal que muestra la lista de productos con funcionalidades de ordenación, paginación y filtrado.
- **ProductForm.tsx**: Formulario para crear y editar productos.
- **ProductModal.tsx**: Modal que contiene el formulario de productos.
- **ProductFilters.tsx**: Componente para filtrar la lista de productos.

### Componentes de Categorías

- **CategoryList.tsx**: Componente principal que muestra la lista de categorías.
- **CategoryForm.tsx**: Formulario para crear y editar categorías.
- **CategoryModal.tsx**: Modal que contiene el formulario de categorías.

### Páginas

- **/dashboard/products.astro**: Página para la gestión de productos.
- **/dashboard/categories.astro**: Página para la gestión de categorías.

## Funcionalidades Implementadas

### Productos

1. **Listado de Productos**:
   - Visualización en tabla con columnas para nombre, descripción, precio, categoría y disponibilidad.
   - Ordenación por cualquier columna.
   - Paginación para navegar entre resultados.
   - Filtrado por categoría y búsqueda por nombre.

2. **Creación de Productos**:
   - Formulario con validación para todos los campos.
   - Selección de categoría desde un desplegable.
   - Opción para marcar disponibilidad.
   - Campo para porcentaje de alcohol (opcional).

3. **Edición de Productos**:
   - Formulario prellenado con los datos del producto.
   - Mismas validaciones que en la creación.

4. **Eliminación de Productos**:
   - Confirmación antes de eliminar.
   - Actualización inmediata de la lista.

5. **Cambio de Disponibilidad**:
   - Botón para cambiar rápidamente la disponibilidad de un producto.

### Categorías

1. **Listado de Categorías**:
   - Visualización en tabla con columnas para nombre, descripción, número de productos y fecha de creación.
   - Ordenación por nombre y fecha.
   - Paginación para navegar entre resultados.
   - Búsqueda por nombre.

2. **Creación de Categorías**:
   - Formulario con validación para todos los campos.
   - Campo para imagen (URL).

3. **Edición de Categorías**:
   - Formulario prellenado con los datos de la categoría.
   - Mismas validaciones que en la creación.

4. **Eliminación de Categorías**:
   - Verificación de que no haya productos asociados.
   - Confirmación antes de eliminar.
   - Actualización inmediata de la lista.

## Cómo Usar

### Gestión de Productos

1. Navega a `/dashboard/products` para acceder a la página de gestión de productos.
2. Para añadir un nuevo producto, haz clic en el botón "Añadir Producto".
3. Para editar un producto existente, haz clic en el botón "Editar" en la fila correspondiente.
4. Para eliminar un producto, haz clic en el botón "Eliminar" en la fila correspondiente.
5. Para cambiar la disponibilidad de un producto, haz clic en el botón de disponibilidad en la fila correspondiente.
6. Para filtrar productos, utiliza los controles de filtro en la parte superior de la tabla.

### Gestión de Categorías

1. Navega a `/dashboard/categories` para acceder a la página de gestión de categorías.
2. Para añadir una nueva categoría, haz clic en el botón "Añadir Categoría".
3. Para editar una categoría existente, haz clic en el botón "Editar" en la fila correspondiente.
4. Para eliminar una categoría, haz clic en el botón "Eliminar" en la fila correspondiente (solo disponible si no hay productos asociados).
5. Para buscar categorías, utiliza el campo de búsqueda en la parte superior de la tabla.

## Consideraciones Técnicas

- Los componentes utilizan React Hook Form para la gestión de formularios.
- Se utilizan los componentes de tabla implementados previamente para mostrar los datos.
- Los servicios utilizan el cliente de Supabase para interactuar con la base de datos.
- Se implementa paginación del lado del servidor para mejorar el rendimiento.
- Los componentes son reactivos y se actualizan automáticamente cuando cambian los datos.

## Próximos Pasos

- Implementar carga de imágenes para productos y categorías.
- Añadir más filtros y opciones de ordenación.
- Implementar exportación de datos a CSV o Excel.
- Añadir gráficos y estadísticas sobre productos y categorías.
- Implementar gestión de inventario relacionada con productos.
