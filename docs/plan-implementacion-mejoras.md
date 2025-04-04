# Plan de Implementación de Mejoras - Slainte-app-astro

## Fecha: Abril 2025

Este documento detalla el plan para implementar las mejoras recomendadas en el proyecto Slainte-app-astro, después de haber completado la implementación de componentes UI para la gestión de productos y categorías.

## 1. Implementación de Carga de Imágenes

### Objetivo
Implementar funcionalidad para subir imágenes para productos y categorías en lugar de usar URLs.

### Análisis del Estado Actual
Actualmente, los productos y categorías almacenan URLs de imágenes en los campos `image_url`. No existe funcionalidad para cargar imágenes directamente a Supabase Storage.

### Tareas a Realizar

1. **Configurar Supabase Storage**
   - Crear un bucket `product-images` para almacenar imágenes de productos
   - Crear un bucket `category-images` para almacenar imágenes de categorías
   - Configurar políticas de seguridad para los buckets

2. **Crear Componente de Carga de Imágenes**
   - Implementar componente `ImageUploader.tsx` con funcionalidad de arrastrar y soltar
   - Añadir vista previa de imágenes
   - Implementar validación de tipos de archivo y tamaño

3. **Crear Servicio para Gestión de Imágenes**
   - Implementar `imageService.ts` con funciones para subir, obtener y eliminar imágenes
   - Integrar con Supabase Storage

4. **Actualizar Formularios de Productos y Categorías**
   - Reemplazar campo de URL de imagen con componente de carga de imágenes
   - Actualizar lógica de guardado para subir imágenes y guardar URLs generadas

5. **Implementar Eliminación de Imágenes**
   - Añadir lógica para eliminar imágenes antiguas al actualizar
   - Eliminar imágenes asociadas al eliminar productos o categorías

### Tiempo Estimado: 3 días

## 2. Mejoras en la Interfaz de Usuario

### Objetivo
Mejorar la experiencia de usuario añadiendo más opciones de filtrado, visualización en modo tarjeta/lista y otras mejoras de UI.

### Tareas a Realizar

1. **Implementar Modo de Visualización Alternativo**
   - Crear componente `ProductGrid.tsx` para visualización en modo tarjeta
   - Añadir botón para alternar entre vista de tabla y vista de tarjetas
   - Implementar diseño responsive para ambos modos

2. **Mejorar Filtros**
   - Añadir filtros adicionales para productos (precio, disponibilidad, etc.)
   - Implementar filtros avanzados con rangos de precios
   - Añadir guardado de preferencias de filtrado

3. **Implementar Ordenación Avanzada**
   - Añadir más opciones de ordenación
   - Permitir ordenación por múltiples campos
   - Guardar preferencias de ordenación

4. **Mejorar Navegación**
   - Implementar breadcrumbs para navegación
   - Añadir acciones rápidas en elementos de lista
   - Mejorar paginación con opciones de tamaño de página

5. **Implementar Temas y Personalización**
   - Añadir selector de tema claro/oscuro
   - Permitir personalización de colores de interfaz
   - Guardar preferencias de usuario

### Tiempo Estimado: 4 días

## 3. Exportación de Datos

### Objetivo
Implementar funcionalidad para exportar datos de productos y categorías a formatos CSV o Excel.

### Tareas a Realizar

1. **Crear Servicio de Exportación**
   - Implementar `exportService.ts` con funciones para exportar a diferentes formatos
   - Soportar formatos CSV y Excel
   - Implementar opciones de personalización de exportación

2. **Implementar UI para Exportación**
   - Añadir botón de exportación en listas de productos y categorías
   - Crear modal con opciones de exportación
   - Implementar indicador de progreso para exportaciones grandes

3. **Implementar Exportación Programada**
   - Añadir opción para programar exportaciones periódicas
   - Implementar notificaciones por correo con archivos exportados
   - Guardar historial de exportaciones

### Tiempo Estimado: 2 días

## 4. Estadísticas y Gráficos

### Objetivo
Añadir visualizaciones de datos sobre productos y categorías para facilitar el análisis.

### Tareas a Realizar

1. **Seleccionar Biblioteca de Gráficos**
   - Evaluar opciones (Recharts, Chart.js, D3.js)
   - Integrar biblioteca seleccionada con el proyecto
   - Crear componentes base para diferentes tipos de gráficos

2. **Implementar Dashboard de Productos**
   - Crear gráfico de distribución de productos por categoría
   - Implementar gráfico de precios promedio por categoría
   - Añadir gráfico de productos más/menos disponibles

3. **Implementar Análisis de Tendencias**
   - Crear gráficos de tendencias de creación de productos
   - Implementar visualización de cambios de precios
   - Añadir predicciones simples basadas en datos históricos

4. **Crear Informes Exportables**
   - Implementar generación de informes con gráficos
   - Permitir exportación de informes en PDF
   - Añadir programación de informes periódicos

### Tiempo Estimado: 4 días

## 5. Gestión de Inventario

### Objetivo
Implementar funcionalidad para gestionar el inventario relacionado con productos.

### Análisis del Estado Actual
Las tablas de inventario ya están creadas en la base de datos, pero no hay componentes UI para gestionarlas.

### Tareas a Realizar

1. **Crear Servicios para Inventario**
   - Implementar `inventoryService.ts` con funciones CRUD para inventario
   - Implementar `inventoryTransactionService.ts` para gestionar transacciones
   - Crear funciones para cálculos y alertas de inventario

2. **Implementar Componentes de Inventario**
   - Crear `InventoryList.tsx` para listar elementos de inventario
   - Implementar `InventoryForm.tsx` para crear/editar elementos
   - Crear `InventoryTransactionForm.tsx` para registrar movimientos

3. **Implementar Alertas de Inventario**
   - Crear sistema de alertas para niveles bajos de stock
   - Implementar notificaciones para reordenar productos
   - Añadir panel de alertas en el dashboard

4. **Integrar con Productos**
   - Vincular productos con elementos de inventario
   - Actualizar inventario automáticamente al procesar pedidos
   - Mostrar información de inventario en detalles de producto

5. **Implementar Informes de Inventario**
   - Crear informes de estado actual de inventario
   - Implementar informes de movimientos históricos
   - Añadir proyecciones de necesidades futuras

### Tiempo Estimado: 5 días

## 6. Pruebas

### Objetivo
Escribir pruebas unitarias y de integración para los componentes implementados.

### Análisis del Estado Actual
El proyecto ya tiene configurado Vitest y Testing Library, con algunos tests existentes para componentes básicos.

### Tareas a Realizar

1. **Implementar Pruebas Unitarias para Servicios**
   - Escribir tests para `productService.ts` y `categoryService.ts`
   - Implementar tests para `imageService.ts`
   - Crear tests para servicios de exportación e inventario

2. **Implementar Pruebas para Componentes UI**
   - Escribir tests para componentes de productos y categorías
   - Implementar tests para componentes de carga de imágenes
   - Crear tests para componentes de gráficos y exportación

3. **Implementar Pruebas de Integración**
   - Crear tests para flujos completos de creación/edición de productos
   - Implementar tests para exportación de datos
   - Escribir tests para gestión de inventario

4. **Configurar CI/CD para Pruebas**
   - Configurar GitHub Actions para ejecutar pruebas automáticamente
   - Implementar informes de cobertura de código
   - Añadir validaciones pre-commit

### Tiempo Estimado: 4 días

## Cronograma General

### Semana 1: Carga de Imágenes y Mejoras UI
- Día 1-3: Implementación de carga de imágenes
- Día 4-7: Mejoras en la interfaz de usuario

### Semana 2: Exportación, Estadísticas e Inventario
- Día 1-2: Implementación de exportación de datos
- Día 3-6: Implementación de estadísticas y gráficos
- Día 7: Inicio de gestión de inventario

### Semana 3: Inventario y Pruebas
- Día 1-4: Continuación de gestión de inventario
- Día 5-7: Implementación de pruebas

## Priorización

1. **Alta Prioridad**:
   - Implementación de carga de imágenes
   - Mejoras básicas en la interfaz de usuario
   - Pruebas unitarias para componentes existentes

2. **Media Prioridad**:
   - Exportación de datos
   - Estadísticas y gráficos básicos
   - Gestión básica de inventario

3. **Baja Prioridad**:
   - Funcionalidades avanzadas de UI
   - Estadísticas avanzadas
   - Exportación programada
   - Funcionalidades avanzadas de inventario

## Conclusión

Este plan proporciona una hoja de ruta clara para implementar las mejoras recomendadas en el proyecto Slainte-app-astro. La implementación se realizará de manera incremental, priorizando las funcionalidades más importantes y asegurando la calidad mediante pruebas continuas.

Cada mejora se ha dividido en tareas específicas con tiempos estimados, lo que permitirá un seguimiento efectivo del progreso y una mejor gestión de recursos.
